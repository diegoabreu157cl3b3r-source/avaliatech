import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { invalidateDashboardCache } from "@/lib/cache";
import { logActivity } from "@/lib/activity";
import { generateExamSchema } from "@/lib/validators";
import { cleanText } from "@/lib/sanitizers";
import { buildExamVersions, calculateAdaptiveAutoDistribution, calculateAutoDistribution, shuffleArray } from "@/lib/exam";
import { createExamPdf } from "@/lib/pdf";
import { fail, handleApiError, validationFail } from "@/lib/response";
import { isValidLogo } from "@/lib/upload";
import type { Questao } from "@/types/question";
import type { DistribuicaoDificuldade, GenerateExamRequest, ModoDificuldade } from "@/types/exam";

function createSubjectParams(subjects: string[]) {
  return Object.fromEntries(subjects.map((subject, index) => [`assunto${index}`, subject]));
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

    const modoDificuldade: ModoDificuldade = parsed.data.modoDificuldade ?? "unica";
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
      logoMime: parsed.data.logoMime ?? null
    };

    if (data.assuntos.length === 0) return fail("Selecione pelo menos um assunto.", 422);

    const subjectParams = createSubjectParams(data.assuntos);
    const subjectPlaceholders = data.assuntos.map((_, index) => `:assunto${index}`).join(", ");

    const availableSubjects = await query<{ assunto: string }[]>(
      `SELECT DISTINCT assunto
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto IN (${subjectPlaceholders})`,
      { usuarioId: user.id, disciplina: data.disciplina, ...subjectParams }
    );

    if (availableSubjects.length !== data.assuntos.length) {
      return fail("Um ou mais assuntos não pertencem à disciplina selecionada.", 422);
    }

    let selectedIds: number[] = [];
    let dificuldadeArmazenada = data.dificuldade;
    let distribuicaoUtilizada: DistribuicaoDificuldade | null = null;

    if (modoDificuldade === "unica") {
      // Fetch only IDs for fast lightweight sampling
      const compatibleRows = await query<{ id: number }[]>(
        `SELECT id
         FROM questoes
         WHERE usuario_id = :usuarioId
           AND disciplina = :disciplina
           AND assunto IN (${subjectPlaceholders})
           AND dificuldade = :dificuldade`,
        {
          usuarioId: user.id,
          disciplina: data.disciplina,
          ...subjectParams,
          dificuldade: data.dificuldade
        }
      );

      if (compatibleRows.length < data.quantidadeQuestoes) {
        return fail(
          `Não existem questões suficientes para gerar esta prova. Foram encontradas ${compatibleRows.length} questões (${data.dificuldade}), mas são necessárias ${data.quantidadeQuestoes}.`,
          422
        );
      }

      selectedIds = shuffleArray(compatibleRows.map((r) => r.id)).slice(0, data.quantidadeQuestoes);
      dificuldadeArmazenada = data.dificuldade;
    } else {
      // Fetch only IDs and difficulty for fast lightweight distribution check
      const allCompatible = await query<{ id: number; dificuldade: "Fácil" | "Média" | "Difícil" }[]>(
        `SELECT id, dificuldade
         FROM questoes
         WHERE usuario_id = :usuarioId
           AND disciplina = :disciplina
           AND assunto IN (${subjectPlaceholders})`,
        {
          usuarioId: user.id,
          disciplina: data.disciplina,
          ...subjectParams
        }
      );

      const easyIds = allCompatible.filter((q) => q.dificuldade === "Fácil").map((q) => q.id);
      const mediumIds = allCompatible.filter((q) => q.dificuldade === "Média").map((q) => q.id);
      const hardIds = allCompatible.filter((q) => q.dificuldade === "Difícil").map((q) => q.id);
      const totalCompatible = allCompatible.length;

      if (totalCompatible < data.quantidadeQuestoes) {
        return fail(
          `Não existem questões suficientes no seu banco para gerar esta prova. Foram encontradas ${totalCompatible} questões no total (Fácil: ${easyIds.length}, Média: ${mediumIds.length}, Difícil: ${hardIds.length}), mas são necessárias ${data.quantidadeQuestoes}.`,
          422
        );
      }

      let targetDistribution: DistribuicaoDificuldade;

      if (modoDificuldade === "personalizada" && data.distribuicao) {
        targetDistribution = data.distribuicao;
      } else if (
        data.distribuicao &&
        data.distribuicao.facil + data.distribuicao.media + data.distribuicao.dificil === data.quantidadeQuestoes
      ) {
        targetDistribution = data.distribuicao;
      } else {
        targetDistribution = calculateAdaptiveAutoDistribution(data.quantidadeQuestoes, {
          facil: easyIds.length,
          media: mediumIds.length,
          dificil: hardIds.length
        }).distribution;
      }

      distribuicaoUtilizada = targetDistribution;
      dificuldadeArmazenada = modoDificuldade === "automatica" ? "Balanceada" : "Personalizada";

      const shortages: string[] = [];
      if (easyIds.length < targetDistribution.facil) {
        shortages.push(`Fácil: ${easyIds.length} disponíveis (necessárias: ${targetDistribution.facil})`);
      }
      if (mediumIds.length < targetDistribution.media) {
        shortages.push(`Média: ${mediumIds.length} disponíveis (necessárias: ${targetDistribution.media})`);
      }
      if (hardIds.length < targetDistribution.dificil) {
        shortages.push(`Difícil: ${hardIds.length} disponíveis (necessárias: ${targetDistribution.dificil})`);
      }

      if (shortages.length > 0) {
        return fail(
          `Não existem questões suficientes para atender à distribuição solicitada. ${shortages.join("; ")}.`,
          422
        );
      }

      const pickedEasy = shuffleArray(easyIds).slice(0, targetDistribution.facil);
      const pickedMedium = shuffleArray(mediumIds).slice(0, targetDistribution.media);
      const pickedHard = shuffleArray(hardIds).slice(0, targetDistribution.dificil);

      selectedIds = shuffleArray([...pickedEasy, ...pickedMedium, ...pickedHard]);
    }

    // Now fetch full question records ONLY for the selected questions
    const idPlaceholders = selectedIds.map((_, index) => `:qid${index}`).join(", ");
    const idParams = Object.fromEntries(selectedIds.map((id, index) => [`qid${index}`, id]));

    const fullQuestions = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
              disciplina, assunto, dificuldade, created_at, updated_at
       FROM questoes
       WHERE id IN (${idPlaceholders})`,
      idParams
    );

    // Maintain the randomly chosen order
    const questionMap = new Map(fullQuestions.map((q) => [q.id, q]));
    const selectedQuestions = selectedIds
      .map((id) => questionMap.get(id))
      .filter((q): q is Questao => Boolean(q));

    const { versionA, versionB } = buildExamVersions(selectedQuestions);
    const dadosJson = JSON.stringify({
      header: { ...data, dificuldade: dificuldadeArmazenada },
      versionA,
      versionB,
      distribuicao: distribuicaoUtilizada
    });

    try {
      await db.execute<ResultSetHeader>(
        `INSERT INTO provas
         (usuario_id, escola, professor, disciplina, assunto, dificuldade, quantidade_questoes, versao, data_prova, valor_avaliacao, dados_json, data_geracao)
         VALUES (:usuarioId, :escola, :professor, :disciplina, :assunto, :dificuldade, :quantidade, 'A/B', :dataProva, :valorAvaliacao, :dadosJson, NOW())`,
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
          dadosJson
        }
      );
    } catch (insertError: unknown) {
      const isUnknownColumn = insertError && typeof insertError === "object" && (insertError as { code?: string }).code === "ER_BAD_FIELD_ERROR";
      if (isUnknownColumn) {
        await db.execute<ResultSetHeader>(
          `INSERT INTO provas
           (usuario_id, escola, professor, disciplina, assunto, dificuldade, quantidade_questoes, versao, data_prova, valor_avaliacao, data_geracao)
           VALUES (:usuarioId, :escola, :professor, :disciplina, :assunto, :dificuldade, :quantidade, 'A/B', :dataProva, :valorAvaliacao, NOW())`,
          {
            usuarioId: user.id,
            escola: data.escola,
            professor: data.professor,
            disciplina: data.disciplina,
            assunto: data.assuntos.join(", "),
            dificuldade: dificuldadeArmazenada,
            quantidade: data.quantidadeQuestoes,
            dataProva: data.dataProva,
            valorAvaliacao: data.valorAvaliacao
          }
        );
      } else {
        throw insertError;
      }
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
    const filename = `avaliatech-${data.disciplina.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
