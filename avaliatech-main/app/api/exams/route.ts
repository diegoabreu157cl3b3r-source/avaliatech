import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Prova } from "@/types/exam";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 50);
    const offset = (page - 1) * limit;

    const countRows = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM provas WHERE usuario_id = :usuarioId",
      { usuarioId: user.id }
    );

    const rows = await query<Prova[]>(
      `SELECT id, usuario_id, escola, professor, disciplina, assunto, dificuldade,
              quantidade_questoes, versao, data_prova, valor_avaliacao, data_geracao, created_at
       FROM provas
       WHERE usuario_id = :usuarioId
       ORDER BY created_at DESC
       LIMIT :limit OFFSET :offset`,
      { usuarioId: user.id, limit, offset }
    );

    const total = countRows[0]?.total ?? 0;
    return ok({ items: rows, total, page, limit, totalPages: Math.max(Math.ceil(total / limit), 1) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
