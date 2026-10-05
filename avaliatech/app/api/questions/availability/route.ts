import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanOptionalText, cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const disciplina = cleanOptionalText(searchParams.get("disciplina"));
    const rawAssuntos = searchParams.get("assuntos");

    if (!disciplina) {
      return ok({
        total: 0,
        facil: 0,
        media: 0,
        dificil: 0
      });
    }

    const assuntos = rawAssuntos
      ? rawAssuntos.split(",").map(cleanText).filter(Boolean)
      : [];

    const whereClauses = ["usuario_id = :usuarioId", "disciplina = :disciplina"];
    const params: Record<string, string | number> = {
      usuarioId: user.id,
      disciplina
    };

    if (assuntos.length > 0) {
      const placeholders = assuntos.map((_, i) => `:assunto${i}`).join(", ");
      assuntos.forEach((assunto, i) => {
        params[`assunto${i}`] = assunto;
      });
      whereClauses.push(`assunto IN (${placeholders})`);
    }

    const rows = await query<{ dificuldade: "Fácil" | "Média" | "Difícil"; total: number }[]>(
      `SELECT dificuldade, COUNT(*) AS total
       FROM questoes
       WHERE ${whereClauses.join(" AND ")}
       GROUP BY dificuldade`,
      params
    );

    const map = new Map(rows.map((r) => [r.dificuldade, Number(r.total) || 0]));
    const facil = map.get("Fácil") ?? 0;
    const media = map.get("Média") ?? 0;
    const dificil = map.get("Difícil") ?? 0;
    const total = facil + media + dificil;

    return ok({
      total,
      facil,
      media,
      dificil
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
