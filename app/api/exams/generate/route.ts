import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { invalidateDashboardCache } from "@/lib/cache";
import { logActivity } from "@/lib/activity";
import { generateExamSchema } from "@/lib/validators";
import { cleanText } from "@/lib/sanitizers";
import {
  buildExamVersions,
  calculateAdaptiveAutoDistribution,
  shuffleArray,
} from "@/lib/exam";
import { createExamPdf } from "@/lib/pdf";
import { fail, handleApiError, validationFail } from "@/lib/response";
import { isValidLogo } from "@/lib/upload";
import type { Questao } from "@/types/question";
import type {
  DistribuicaoDificuldade,
  GenerateExamRequest,
  ModoDificuldade,
} from "@/types/exam";

function createSubjectParams(subjects: string[]) {
  return Object.fromEntries(
    subjects.map((subject, index) => [`assunto${index}`, subject])
  );
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = generateExamSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    if (!isValidLogo(parsed.data.logoBase64)) {
      return fail("A logo deve ser PNG, JPG ou JPEG e ter no máximo 2 MB.", 422);
    }

    const modoDificuldade: ModoDificuldade =
      parsed.data.modoDificuldade ?? "unica";
    const data: GenerateExamRequest = {
      escola: cleanText(parsed.data.escola),
      professor: cleanText(parsed.data.professor),
      disciplina: cleanText(parsed.data.disciplina),
      assuntos: [...new Set(parsed.data.assuntos.map(cleanText).filter(Boolean))],
      dificuldade: parsed.data.dificuldade,
      modoDificuldade,
      distribuicao: parsed.data.distribuicao ?? null,
      quantidadeQuestoes: parsed.data.quantidadeQuestoes as 10 | 15 | 20 | 25,
      dataProva: parsed.data.dataProva,
      valorAvaliacao: cleanText(parsed.data.valorAvaliacao),
      logoBase64: parsed.data.logoBase64 ?? null,
      logoMime: parsed.data.logoMime ?? null,
    };

    if (data.assuntos.length === 0) {
      return fail("Selecione pelo menos um assunto.", 422);
    }

    const subjectParams = createSubjectParams(data.assuntos);
    const subjectPlaceholders = data.assuntos
      .map((_, index) => `:assunto${index}`)
      .join(", ");
    const queryParams = {
      usuarioId: user.id,
      disciplina: data.disciplina,
      ...subjectParams,
    };

    const availableSubjects = await query<{ assunto: string }[]>(
      `SELECT DISTINCT assunto
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto IN (${subjectPlaceholders})`,
      queryParams
    );

    if (availableSubjects.length !== data.assuntos.length) {
      return fail(
        "Um ou mais assuntos não pertencem à disciplina selecionada.",
        422
      );
    }

    let selectedIds: number[] = [];
    let dificuldadeArmazenada = data.dificuldade;
    let distribuicaoUtilizada: DistribuicaoDificuldade | null = null;

    if (modoDificuldade === "unica") {
      const compatibleRows = await query<{ id: number }[]>(
        `SELECT id
         FROM questoes
         WHERE usuario_id = :usuarioId
           AND disciplina = :disciplina
           AND assunto IN (${subjectPlaceholders})
           AND dificuldade = :dificuldade`,
        { ...queryParams, dificuldade: data.dificuldade }
      );

      if (compatibleRows.length < data.quantidadeQuestoes) {
        return fail(
          `Não existem questões suficientes para gerar esta prova. Foram encontradas ${compatibleRows.length} questões (${data.dificuldade}), mas são necessárias ${data.quantidadeQuestoes}.`,
          422
        );
      }

      selectedIds = shuffleArray(compatibleRows.map((row) => row.id)).slice(
        0,
        data.quantidadeQuestoes
      );
    } else {
      const allCompatible = await query<{
        id: number;
        dificuldade: "Fácil" | "Média" | "Difícil";
      }[]>(
        `SELECT id, dificuldade
         FROM questoes
         WHERE usuario_id = :usuarioId
           AND disciplina = :disciplina
           AND assunto IN (${subjectPlaceholders})`,
        queryParams
      );

      const easyIds = allCompatible
        .filter((question) => question.dificuldade === "Fácil")
        .map((question) => question.id);
      const mediumIds = allCompatible
        .filter((question) => question.dificuldade === "Média")
        .map((question) => question.id);
      const hardIds = allCompatible
        .filter((question) => question.dificuldade === "Difícil")
        .map((question) => question.id);

      if (allCompatible.length < data.quantidadeQuestoes) {
        return fail(
          `Não existem questões suficientes no seu banco. Foram encontradas ${allCompatible.length}, mas são necessárias ${data.quantidadeQuestoes}.`,
          422
        );
      }

      let targetDistribution: DistribuicaoDificuldade;
      if (modoDificuldade === "personalizada") {
        const custom = data.distribuicao;
        if (!custom) {
          return fail("Informe a distribuição personalizada das dificuldades.", 422);
        }
        const values = [custom.facil, custom.media, custom.dificil];
        if (
          values.some((value) => !Number.isInteger(value) || value < 0) ||
          values.reduce((sum, value) => sum + value, 0) !==
            data.quantidadeQuestoes
        ) {
          return fail(
            "A distribuição personalizada deve usar inteiros não negativos e somar a quantidade solicitada.",
            422
          );
        }
        targetDistribution = custom;
      } else {
        const adaptive = calculateAdaptiveAutoDistribution(
          data.quantidadeQuestoes,
          {
            facil: easyIds.length,
            media: mediumIds.length,
            dificil: hardIds.length,
          }
        );
        if (!adaptive.hasEnoughTotal) {
          return fail(
            `Não existem questões suficientes. Foram encontradas ${adaptive.totalAvailable}, mas são necessárias ${data.quantidadeQuestoes}.`,
            422
          );
        }
        targetDistribution = adaptive.distribution;
      }

      distribuicaoUtilizada = targetDistribution;
      dificuldadeArmazenada =
        modoDificuldade === "automatica" ? "Balanceada" : "Personalizada";

      const shortages: string[] = [];
      if (easyIds.length < targetDistribution.facil) {
        shortages.push(
          `Fácil: ${easyIds.length} disponíveis (necessárias: ${targetDistribution.facil})`
        );
      }
      if (mediumIds.length < targetDistribution.media) {
        shortages.push(
          `Média: ${mediumIds.length} disponíveis (necessárias: ${targetDistribution.media})`
        );
      }
      if (hardIds.length < targetDistribution.dificil) {
        shortages.push(
          `Difícil: ${hardIds.length} disponíveis (necessárias: ${targetDistribution.dificil})`
        );
      }
      if (shortages.length > 0) {
        return fail(
          `Não existem questões suficientes para atender à distribuição solicitada. ${shortages.join("; ")}.`,
          422
        );
      }

      selectedIds = shuffleArray([
        ...shuffleArray(easyIds).slice(0, targetDistribution.facil),
        ...shuffleArray(mediumIds).slice(0, targetDistribution.media),
        ...shuffleArray(hardIds).slice(0, targetDistribution.dificil),
      ]);
    }

    if (selectedIds.length === 0) {
      return fail("Não foi possível selecionar questões para a prova.", 422);
    }

    const idPlaceholders = selectedIds
      .map((_, index) => `:qid${index}`)
      .join(", ");
    const idParams = Object.fromEntries(
      selectedIds.map((id, index) => [`qid${index}`, id])
    );

    const fullQuestions = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b,
              alternativa_c, alternativa_d, correta, disciplina, assunto,
              dificuldade, created_at, updated_at
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND id IN (${idPlaceholders})`,
      { usuarioId: user.id, ...idParams }
    );

    const questionMap = new Map(fullQuestions.map((question) => [question.id, question]));
    const selectedQuestions = selectedIds
      .map((id) => questionMap.get(id))
      .filter((question): question is Questao => Boolean(question));

    if (selectedQuestions.length !== data.quantidadeQuestoes) {
      return fail(
        "Algumas questões deixaram de estar disponíveis. Atualize a página e tente novamente.",
        409
      );
    }

    const { versionA, versionB } = buildExamVersions(selectedQuestions);
    const dadosJson = JSON.stringify({
      header: { ...data, dificuldade: dificuldadeArmazenada },
      versionA,
      versionB,
      distribuicao: distribuicaoUtilizada,
    });

    try {
      await db.execute<ResultSetHeader>(
        `INSERT INTO provas
          (usuario_id, escola, professor, disciplina, assunto, dificuldade,
           quantidade_questoes, versao, data_prova, valor_avaliacao, dados_json, data_geracao)
         VALUES
          (:usuarioId, :escola, :professor, :disciplina, :assunto, :dificuldade,
           :quantidade, 'A/B', :dataProva, :valorAvaliacao, :dadosJson, NOW())`,
        {
          usuarioId: user.id,
          escola: data.escola,
          professor: data.professor,
          disciplina: data.disciplina,
          assunto: data.assuntos.join(", "),
          dificuldade: dificuldadeArmazenada,
          quantidade: data.quantidadeQuestoes,
          dataProva: data.dataProva,
          valorAvaliacao: data.valorAvaliacao,
          dadosJson,
        }
      );
    } catch (insertError: unknown) {
      const unknownColumn =
        insertError &&
        typeof insertError === "object" &&
        (insertError as { code?: string }).code === "ER_BAD_FIELD_ERROR";
      if (!unknownColumn) throw insertError;

      await db.execute<ResultSetHeader>(
        `INSERT INTO provas
          (usuario_id, escola, professor, disciplina, assunto, dificuldade,
           quantidade_questoes, versao, data_prova, valor_avaliacao, data_geracao)
         VALUES
          (:usuarioId, :escola, :professor, :disciplina, :assunto, :dificuldade,
           :quantidade, 'A/B', :dataProva, :valorAvaliacao, NOW())`,
        {
          usuarioId: user.id,
          escola: data.escola,
          professor: data.professor,
          disciplina: data.disciplina,
          assunto: data.assuntos.join(", "),
          dificuldade: dificuldadeArmazenada,
          quantidade: data.quantidadeQuestoes,
          dataProva: data.dataProva,
          valorAvaliacao: data.valorAvaliacao,
        }
      );
    }

    invalidateDashboardCache(user.id);
    await logActivity(
      user.id,
      "prova_gerada",
      `Prova gerada de ${data.disciplina} (${data.quantidadeQuestoes} questões)`,
      `Assuntos: ${data.assuntos.join(", ")} · ${dificuldadeArmazenada}`
    );

    const pdfBytes = await createExamPdf(
      { ...data, dificuldade: dificuldadeArmazenada },
      versionA,
      versionB
    );
    const filename = `avaliatech-${data.disciplina
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
