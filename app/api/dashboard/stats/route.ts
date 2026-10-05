import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getCachedDashboardStats, setCachedDashboardStats } from "@/lib/cache";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();

    // Check in-memory cache
    const cached = getCachedDashboardStats<Record<string, unknown>>(user.id);
    if (cached) {
      return ok(cached);
    }

    // Execute independent queries in parallel via Promise.all
    const [
      questionStatsRows,
      examStatsRows,
      difficultyRows,
      disciplineRows,
      recentQuestions,
      activityRows
    ] = await Promise.all([
      // 1. Consolidated totals for questions, disciplines and subjects
      query<{ totalQuestoes: number; totalDisciplinas: number; totalAssuntos: number }[]>(
        `SELECT
           COUNT(*) AS totalQuestoes,
           COUNT(DISTINCT disciplina) AS totalDisciplinas,
           COUNT(DISTINCT assunto) AS totalAssuntos
         FROM questoes
         WHERE usuario_id = :usuarioId`,
        { usuarioId: user.id }
      ),

      // 2. Total exams
      query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM provas WHERE usuario_id = :usuarioId",
        { usuarioId: user.id }
      ),

      // 3. Difficulty stats
      query<{ dificuldade: string; total: number }[]>(
        `SELECT dificuldade, COUNT(*) AS total
         FROM questoes
         WHERE usuario_id = :usuarioId
         GROUP BY dificuldade`,
        { usuarioId: user.id }
      ),

      // 4. Top disciplines
      query<{ disciplina: string; total: number }[]>(
        `SELECT disciplina, COUNT(*) AS total
         FROM questoes
         WHERE usuario_id = :usuarioId
         GROUP BY disciplina
         ORDER BY total DESC
         LIMIT 10`,
        { usuarioId: user.id }
      ),

      // 5. Recent questions
      query(
        `SELECT id, pergunta, disciplina, assunto, dificuldade, created_at
         FROM questoes
         WHERE usuario_id = :usuarioId
         ORDER BY created_at DESC
         LIMIT 5`,
        { usuarioId: user.id }
      ),

      // 6. Recent activities (with safe fallback)
      query<{
        id: number;
        tipo: "questao_criada" | "questao_editada" | "questao_excluida" | "prova_gerada" | "prova_excluida";
        titulo: string;
        descricao: string | null;
        created_at: string;
      }[]>(
        `SELECT id, tipo, titulo, descricao, created_at
         FROM atividades
         WHERE usuario_id = :usuarioId
         ORDER BY created_at DESC
         LIMIT 8`,
        { usuarioId: user.id }
      ).catch(() => [])
    ]);

    const qStats = questionStatsRows[0] ?? { totalQuestoes: 0, totalDisciplinas: 0, totalAssuntos: 0 };
    const totalQuestoes = Number(qStats.totalQuestoes) || 0;
    const totalDisciplinas = Number(qStats.totalDisciplinas) || 0;
    const totalAssuntos = Number(qStats.totalAssuntos) || 0;
    const totalProvas = Number(examStatsRows[0]?.total) || 0;

    // Process difficulty map
    const difficultyMap = new Map(difficultyRows.map((r) => [r.dificuldade, Number(r.total)]));
    const questoesPorDificuldade = (["Fácil", "Média", "Difícil"] as const).map((dif) => {
      const total = difficultyMap.get(dif) ?? 0;
      const porcentagem = totalQuestoes > 0 ? Math.round((total / totalQuestoes) * 100) : 0;
      return { dificuldade: dif, total, porcentagem };
    });

    // Process disciplines map
    const questoesPorDisciplina = disciplineRows.map((row) => {
      const total = Number(row.total);
      const porcentagem = totalQuestoes > 0 ? Math.round((total / totalQuestoes) * 100) : 0;
      return { disciplina: row.disciplina, total, porcentagem };
    });

    let recentActivities = activityRows;

    // Fallback if no activities recorded
    if (recentActivities.length === 0) {
      const [fallbackQuestions, fallbackExams] = await Promise.all([
        query<{ id: number; disciplina: string; assunto: string; created_at: string }[]>(
          `SELECT id, disciplina, assunto, created_at
           FROM questoes
           WHERE usuario_id = :usuarioId
           ORDER BY created_at DESC
           LIMIT 4`,
          { usuarioId: user.id }
        ),
        query<{ id: number; disciplina: string; assunto: string; quantidade_questoes: number; created_at: string }[]>(
          `SELECT id, disciplina, assunto, quantidade_questoes, created_at
           FROM provas
           WHERE usuario_id = :usuarioId
           ORDER BY created_at DESC
           LIMIT 4`,
          { usuarioId: user.id }
        )
      ]);

      const combined = [
        ...fallbackQuestions.map((q) => ({
          id: q.id,
          tipo: "questao_criada" as const,
          titulo: `Nova questão cadastrada em ${q.disciplina}`,
          descricao: `Assunto: ${q.assunto}`,
          created_at: q.created_at
        })),
        ...fallbackExams.map((e) => ({
          id: e.id + 100000,
          tipo: "prova_gerada" as const,
          titulo: `Prova gerada de ${e.disciplina} (${e.quantidade_questoes} questões)`,
          descricao: `Assunto: ${e.assunto}`,
          created_at: e.created_at
        }))
      ];

      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      recentActivities = combined.slice(0, 8);
    }

    const payload = {
      totalQuestoes,
      totalDisciplinas,
      totalAssuntos,
      totalProvas,
      questoesPorDificuldade,
      questoesPorDisciplina,
      recentQuestions,
      recentActivities
    };

    // Cache the result for subsequent requests
    setCachedDashboardStats(user.id, payload, 30_000);

    return ok(payload);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
