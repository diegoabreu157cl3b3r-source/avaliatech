import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

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

    const totalQuestoes = questions?.total ?? 0;

    // 1. Gráfico por Dificuldade
    const difficultyRows = await query<{ dificuldade: string; total: number }[]>(
      `SELECT dificuldade, COUNT(*) AS total
       FROM questoes
       WHERE usuario_id = :usuarioId
       GROUP BY dificuldade`,
      { usuarioId: user.id }
    );

    const difficultyMap = new Map(difficultyRows.map((r) => [r.dificuldade, Number(r.total)]));
    const questoesPorDificuldade = (["Fácil", "Média", "Difícil"] as const).map((dif) => {
      const total = difficultyMap.get(dif) ?? 0;
      const porcentagem = totalQuestoes > 0 ? Math.round((total / totalQuestoes) * 100) : 0;
      return { dificuldade: dif, total, porcentagem };
    });

    // 2. Gráfico por Disciplina
    const disciplineRows = await query<{ disciplina: string; total: number }[]>(
      `SELECT disciplina, COUNT(*) AS total
       FROM questoes
       WHERE usuario_id = :usuarioId
       GROUP BY disciplina
       ORDER BY total DESC
       LIMIT 10`,
      { usuarioId: user.id }
    );

    const questoesPorDisciplina = disciplineRows.map((row) => {
      const total = Number(row.total);
      const porcentagem = totalQuestoes > 0 ? Math.round((total / totalQuestoes) * 100) : 0;
      return { disciplina: row.disciplina, total, porcentagem };
    });

    // 3. Questões recentes
    const recentQuestions = await query(
      `SELECT id, pergunta, disciplina, assunto, dificuldade, created_at
       FROM questoes
       WHERE usuario_id = :usuarioId
       ORDER BY created_at DESC
       LIMIT 5`,
      { usuarioId: user.id }
    );

    // 4. Atividades recentes
    let recentActivities: Array<{
      id: number;
      tipo: "questao_criada" | "questao_editada" | "questao_excluida" | "prova_gerada" | "prova_excluida";
      titulo: string;
      descricao: string | null;
      created_at: string;
    }> = [];

    try {
      recentActivities = await query(
        `SELECT id, tipo, titulo, descricao, created_at
         FROM atividades
         WHERE usuario_id = :usuarioId
         ORDER BY created_at DESC
         LIMIT 8`,
        { usuarioId: user.id }
      );
    } catch {
      // Tabela de atividades pode não existir ainda
      recentActivities = [];
    }

    // Fallback: se não houver atividades gravadas ainda, sintetizar a partir de questões e provas existentes
    if (recentActivities.length === 0) {
      const fallbackQuestions = await query<{ id: number; disciplina: string; assunto: string; created_at: string }[]>(
        `SELECT id, disciplina, assunto, created_at
         FROM questoes
         WHERE usuario_id = :usuarioId
         ORDER BY created_at DESC
         LIMIT 4`,
        { usuarioId: user.id }
      );

      const fallbackExams = await query<{ id: number; disciplina: string; assunto: string; quantidade_questoes: number; created_at: string }[]>(
        `SELECT id, disciplina, assunto, quantidade_questoes, created_at
         FROM provas
         WHERE usuario_id = :usuarioId
         ORDER BY created_at DESC
         LIMIT 4`,
        { usuarioId: user.id }
      );

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

    return ok({
      totalQuestoes,
      totalDisciplinas: disciplines?.total ?? 0,
      totalAssuntos: subjects?.total ?? 0,
      totalProvas: exams?.total ?? 0,
      questoesPorDificuldade,
      questoesPorDisciplina,
      recentQuestions,
      recentActivities
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
