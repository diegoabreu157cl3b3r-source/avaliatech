import { requireAuth } from "@/lib/auth";
import { query } from "@/lib/db";
import { cleanText } from "@/lib/sanitizers";
import { calculateAdaptiveAutoDistribution } from "@/lib/exam";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

function createSubjectParams(subjects: string[]) {
  return Object.fromEntries(
    subjects.map((subject, index) => [`assunto${index}`, subject])
  );
}

interface DifficultyCountRow {
  dificuldade: "Fácil" | "Média" | "Difícil" | string;
  total: number;
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return fail("Informe os filtros da prova.", 400);
    }

    const input = body as Record<string, unknown>;
    const disciplina =
      typeof input.disciplina === "string" ? cleanText(input.disciplina) : "";
    const quantidade = input.quantidadeQuestoes;

    if (![10, 15, 20, 25].includes(Number(quantidade))) {
      return fail("A quantidade deve ser 10, 15, 20 ou 25 questões.", 422);
    }

    const assuntos: string[] = Array.isArray(input.assuntos)
      ? Array.from(
          new Set<string>(
            input.assuntos
              .filter((item: unknown): item is string => typeof item === "string")
              .map((item) => cleanText(item))
              .filter((item) => item.length > 0)
          )
        )
      : [];

    if (!disciplina) return fail("Selecione uma disciplina.", 422);
    if (assuntos.length === 0) return fail("Selecione pelo menos um assunto.", 422);

    const subjectParams = createSubjectParams(assuntos);
    const subjectPlaceholders = assuntos
      .map((_, index) => `:assunto${index}`)
      .join(", ");

    const validSubjects = await query<{ assunto: string }[]>(
      `SELECT DISTINCT assunto
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto IN (${subjectPlaceholders})`,
      { usuarioId: user.id, disciplina, ...subjectParams }
    );

    if (validSubjects.length !== assuntos.length) {
      return fail(
        "Um ou mais assuntos não pertencem à disciplina selecionada.",
        422
      );
    }

    const rows = await query<DifficultyCountRow[]>(
      `SELECT dificuldade, COUNT(*) AS total
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto IN (${subjectPlaceholders})
       GROUP BY dificuldade`,
      { usuarioId: user.id, disciplina, ...subjectParams }
    );

    const counts = { facil: 0, media: 0, dificil: 0, total: 0 };
    for (const row of rows) {
      const count = Number(row.total) || 0;
      if (row.dificuldade === "Fácil") counts.facil = count;
      else if (row.dificuldade === "Média") counts.media = count;
      else if (row.dificuldade === "Difícil") counts.dificil = count;
    }
    counts.total = counts.facil + counts.media + counts.dificil;

    const result = calculateAdaptiveAutoDistribution(Number(quantidade), {
      facil: counts.facil,
      media: counts.media,
      dificil: counts.dificil,
    });

    return ok({
      distribution: result.distribution,
      counts,
      totalAvailable: result.totalAvailable,
      hasEnoughTotal: result.hasEnoughTotal,
      isAdjusted: result.isAdjusted,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
