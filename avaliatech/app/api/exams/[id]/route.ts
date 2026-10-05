import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { buildExamVersions } from "@/lib/exam";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Prova, ExamDataPayload, GenerateExamRequest } from "@/types/exam";
import type { Questao } from "@/types/question";
import type { ResultSetHeader } from "mysql2";

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

    let dataPayload: ExamDataPayload | null = null;

    if (exam.dados_json) {
      try {
        const parsed = JSON.parse(exam.dados_json) as ExamDataPayload;
        if (parsed?.header && parsed?.versionA && parsed?.versionB) {
          dataPayload = parsed;
        }
      } catch {
        // Fallback to reconstruction
      }
    }

    if (!dataPayload) {
      // Reconstroi os dados a partir das questoes do professor
      const subjects = exam.assunto.split(",").map((s) => s.trim()).filter(Boolean);
      const subjectParams = Object.fromEntries(subjects.map((s, i) => [`assunto${i}`, s]));
      const subjectPlaceholders = subjects.map((_, i) => `:assunto${i}`).join(", ");

      const questions = await query<Questao[]>(
        `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
                disciplina, assunto, dificuldade, created_at, updated_at
         FROM questoes
         WHERE usuario_id = :usuarioId
           AND disciplina = :disciplina
           ${subjects.length > 0 ? `AND assunto IN (${subjectPlaceholders})` : ""}
         LIMIT :limit`,
        {
          usuarioId: user.id,
          disciplina: exam.disciplina,
          ...subjectParams,
          limit: exam.quantidade_questoes
        }
      );

      const header: GenerateExamRequest = {
        escola: exam.escola,
        professor: exam.professor,
        disciplina: exam.disciplina,
        assuntos: subjects,
        dificuldade: exam.dificuldade,
        quantidadeQuestoes: exam.quantidade_questoes as 10 | 15 | 20 | 25,
        dataProva: exam.data_prova ? String(exam.data_prova).slice(0, 10) : "",
        valorAvaliacao: exam.valor_avaliacao || "10,0",
        logoBase64: null,
        logoMime: null
      };

      const { versionA, versionB } = buildExamVersions(questions);
      dataPayload = { header, versionA, versionB };
    }

    return ok({ exam, dataPayload });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const examId = Number(id);

    if (!Number.isInteger(examId) || examId <= 0) {
      return fail("Identificador de prova inválido.", 400);
    }

    const rows = await query<Prova[]>(
      `SELECT id, disciplina, assunto, quantidade_questoes FROM provas WHERE id = :id AND usuario_id = :usuarioId LIMIT 1`,
      { id: examId, usuarioId: user.id }
    );

    const exam = rows[0];
    if (!exam) {
      return fail("Prova não encontrada ou não pertence ao seu usuário.", 404);
    }

    await db.execute<ResultSetHeader>(
      "DELETE FROM provas WHERE id = :id AND usuario_id = :usuarioId",
      { id: examId, usuarioId: user.id }
    );

    await logActivity(
      user.id,
      "prova_excluida",
      `Prova excluída de ${exam.disciplina} (${exam.quantidade_questoes} questões)`,
      `Assuntos: ${exam.assunto}`
    );

    return ok(null, "Prova excluída com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
