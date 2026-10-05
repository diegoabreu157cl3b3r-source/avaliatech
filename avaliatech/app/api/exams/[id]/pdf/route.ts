import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { buildExamVersions } from "@/lib/exam";
import { createExamPdf } from "@/lib/pdf";
import { fail, handleApiError } from "@/lib/response";
import type { Prova, ExamDataPayload, GenerateExamRequest } from "@/types/exam";
import type { Questao } from "@/types/question";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const examId = Number(id);

    if (!Number.isInteger(examId) || examId <= 0) {
      return fail("Identificador de prova inválido.", 400);
    }

    const rows = await query<Prova[]>(
      `SELECT id, usuario_id, escola, professor, disciplina, assunto, dificuldade,
              quantidade_questoes, versao, data_prova, valor_avaliacao, dados_json, data_geracao, created_at
       FROM provas
       WHERE id = :id AND usuario_id = :usuarioId
       LIMIT 1`,
      { id: examId, usuarioId: user.id }
    );

    const exam = rows[0];
    if (!exam) {
      return fail("Prova não encontrada ou não pertence ao seu usuário.", 404);
    }

    // 1. If exact snapshot exists, render directly
    if (exam.dados_json) {
      try {
        const payload = JSON.parse(exam.dados_json) as ExamDataPayload;
        if (payload?.header && payload?.versionA && payload?.versionB) {
          const pdfBytes = await createExamPdf(payload.header, payload.versionA, payload.versionB);
          const safeDiscipline = (exam.disciplina || "prova").toLowerCase().replace(/[^a-z0-9]+/gi, "-");
          const filename = `avaliatech-${safeDiscipline}.pdf`;

          return new Response(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${filename}"`,
              "Cache-Control": "no-store"
            }
          });
        }
      } catch {
        // Fallback to reconstruction if payload JSON is malformed
      }
    }

    // 2. Reconstruct historical exam from database
    const subjects = (exam.assunto || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (subjects.length === 0) {
      return fail("Dados insuficientes para reconstruir esta prova histórica.", 422);
    }

    const subjectPlaceholders = subjects.map((_, index) => `:assunto${index}`).join(", ");
    const subjectParams = Object.fromEntries(subjects.map((subject, index) => [`assunto${index}`, subject]));

    const userRows = await query<{ logo_base64: string | null; logo_mime: "image/png" | "image/jpeg" | null }[]>(
      "SELECT logo_base64, logo_mime FROM usuarios WHERE id = :id LIMIT 1",
      { id: user.id }
    );
    const userProfile = userRows[0];

    const compatibleQuestions = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
              disciplina, assunto, dificuldade, created_at, updated_at
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto IN (${subjectPlaceholders})
         AND dificuldade = :dificuldade
       ORDER BY id ASC`,
      {
        usuarioId: user.id,
        disciplina: exam.disciplina,
        dificuldade: exam.dificuldade,
        ...subjectParams
      }
    );

    if (compatibleQuestions.length < exam.quantidade_questoes) {
      return fail(
        `Não há questões suficientes no banco atual para reconstruir esta prova histórica (necessárias: ${exam.quantidade_questoes}, encontradas: ${compatibleQuestions.length}).`,
        422
      );
    }

    const selectedQuestions = compatibleQuestions.slice(0, exam.quantidade_questoes);
    const { versionA, versionB } = buildExamVersions(selectedQuestions);

    let dateStr = "";
    if (exam.data_prova) {
      if (typeof exam.data_prova === "string") {
        dateStr = exam.data_prova.slice(0, 10);
      } else {
        const d = new Date(exam.data_prova);
        dateStr = isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
      }
    }

    const headerData: GenerateExamRequest = {
      escola: exam.escola,
      professor: exam.professor,
      disciplina: exam.disciplina,
      assuntos: subjects,
      dificuldade: exam.dificuldade,
      quantidadeQuestoes: (exam.quantidade_questoes as 10 | 15 | 20 | 25) || 10,
      dataProva: dateStr || new Date().toISOString().slice(0, 10),
      valorAvaliacao: exam.valor_avaliacao || "10,0",
      logoBase64: userProfile?.logo_base64 ?? null,
      logoMime: userProfile?.logo_mime ?? null
    };

    const pdfBytes = await createExamPdf(headerData, versionA, versionB);
    const safeDiscipline = (exam.disciplina || "prova").toLowerCase().replace(/[^a-z0-9]+/gi, "-");
    const filename = `avaliatech-${safeDiscipline}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
