import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanOptionalText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";

const MAX_SUGGESTIONS = 10;

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = cleanOptionalText(searchParams.get("query"));
    const discipline = cleanOptionalText(searchParams.get("discipline"));

    if (type !== "discipline" && type !== "subject") return fail("Tipo de sugestão inválido.", 422);
    if (type === "subject" && !discipline) return fail("Informe a disciplina para buscar assuntos.", 422);

    const column = type === "discipline" ? "disciplina" : "assunto";
    const conditions = ["usuario_id = :usuarioId"];
    const params: Record<string, string | number> = { usuarioId: user.id, limit: MAX_SUGGESTIONS };

    if (type === "subject") {
      conditions.push("disciplina = :discipline");
      params.discipline = discipline;
    }
    if (search) {
      conditions.push(`${column} LIKE :search`);
      params.search = `%${search}%`;
    }

    const rows = await query<{ value: string }[]>(
      `SELECT DISTINCT ${column} AS value
       FROM questoes
       WHERE ${conditions.join(" AND ")}
       ORDER BY ${column} ASC
       LIMIT :limit`,
      params
    );

    return ok({ items: rows.map((row) => row.value) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
