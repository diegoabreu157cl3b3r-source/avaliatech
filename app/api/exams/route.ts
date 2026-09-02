import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Prova } from "@/types/exam";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 50);
    const offset = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const escola = searchParams.get("escola")?.trim() || "";
    const disciplina = searchParams.get("disciplina")?.trim() || "";
    const assunto = searchParams.get("assunto")?.trim() || "";
    const dificuldade = searchParams.get("dificuldade")?.trim() || "";
    const periodo = searchParams.get("periodo")?.trim() || "";

    const whereClauses: string[] = ["usuario_id = :usuarioId"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = { usuarioId: user.id };

    if (search) {
      whereClauses.push(
        "(escola LIKE :search OR professor LIKE :search OR disciplina LIKE :search OR assunto LIKE :search)"
      );
      params.search = `%${search}%`;
    }

    if (escola && escola !== "Todas") {
      whereClauses.push("escola = :escola");
      params.escola = escola;
    }

    if (disciplina && disciplina !== "Todas") {
      whereClauses.push("disciplina = :disciplina");
      params.disciplina = disciplina;
    }

    if (assunto && assunto !== "Todos") {
      whereClauses.push("assunto LIKE :assuntoPattern");
      params.assuntoPattern = `%${assunto}%`;
    }

    if (dificuldade && dificuldade !== "Todas") {
      whereClauses.push("dificuldade = :dificuldade");
      params.dificuldade = dificuldade;
    }

    if (periodo === "7d") {
      whereClauses.push("created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    } else if (periodo === "30d") {
      whereClauses.push("created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    } else if (periodo === "90d") {
      whereClauses.push("created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)");
    }

    const whereSql = whereClauses.join(" AND ");

    const countRows = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM provas WHERE ${whereSql}`,
      params
    );

    const rows = await query<Prova[]>(
      `SELECT id, usuario_id, escola, professor, disciplina, assunto, dificuldade,
              quantidade_questoes, versao, data_prova, valor_avaliacao, data_geracao, created_at
       FROM provas
       WHERE ${whereSql}
       ORDER BY created_at DESC
       LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );

    const total = countRows[0]?.total ?? 0;

    return ok({
      items: rows,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
