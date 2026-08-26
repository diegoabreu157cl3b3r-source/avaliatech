import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/response";

export async function GET() {
  try {
    const user = await requireAuth();

    const [questions] = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM questoes WHERE usuario_id = :usuarioId",
      { usuarioId: user.id }
    );
    const [disciplines] = await query<{ total: number }[]>(
      "SELECT COUNT(DISTINCT disciplina) AS total FROM questoes WHERE usuario_id = :usuarioId",
      { usuarioId: user.id }
    );
    const [subjects] = await query<{ total: number }[]>(
      "SELECT COUNT(DISTINCT assunto) AS total FROM questoes WHERE usuario_id = :usuarioId",
      { usuarioId: user.id }
    );
    const [exams] = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM provas WHERE usuario_id = :usuarioId",
      { usuarioId: user.id }
    );

    const recentQuestions = await query(
      `SELECT id, pergunta, disciplina, assunto, dificuldade, created_at
       FROM questoes
       WHERE usuario_id = :usuarioId
       ORDER BY created_at DESC
       LIMIT 5`,
      { usuarioId: user.id }
    );

    return ok({
      totalQuestoes: questions?.total ?? 0,
      totalDisciplinas: disciplines?.total ?? 0,
      totalAssuntos: subjects?.total ?? 0,
      totalProvas: exams?.total ?? 0,
      recentQuestions
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
