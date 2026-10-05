import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Disciplina } from "@/types/discipline";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const disciplineId = Number(id);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0) {
      return fail("Identificador de disciplina inválido.", 400);
    }

    const body = await request.json();
    const rawName = typeof body?.nome === "string" ? body.nome : "";
    const nome = cleanText(rawName);

    if (!nome || nome.length < 2) {
      return fail("O nome da disciplina deve ter pelo menos 2 caracteres.", 422);
    }

    if (nome.length > 120) {
      return fail("O nome da disciplina não pode exceder 120 caracteres.", 422);
    }

    // Verificar se a disciplina pertence ao usuário
    const currentRows = await query<Disciplina[]>(
      "SELECT id, nome FROM disciplinas WHERE id = :id AND usuario_id = :usuarioId LIMIT 1",
      { id: disciplineId, usuarioId: user.id }
    );

    const current = currentRows[0];
    if (!current) {
      return fail("Disciplina não encontrada ou não pertence ao seu usuário.", 404);
    }

    // Verificar se outro registro já tem esse nome
    const duplicateRows = await query<Disciplina[]>(
      "SELECT id FROM disciplinas WHERE usuario_id = :usuarioId AND LOWER(nome) = LOWER(:nome) AND id != :id LIMIT 1",
      { usuarioId: user.id, nome, id: disciplineId }
    );

    if (duplicateRows.length > 0) {
      return fail("Você já possui outra disciplina com este nome.", 409);
    }

    const oldName = current.nome;

    // Atualizar tabela disciplinas
    await db.execute(
      "UPDATE disciplinas SET nome = :nome WHERE id = :id AND usuario_id = :usuarioId",
      { nome, id: disciplineId, usuarioId: user.id }
    );

    // Atualizar nome textual nas questões vinculadas para manter sincronia
    await db.execute(
      "UPDATE questoes SET disciplina = :nome WHERE usuario_id = :usuarioId AND (disciplina_id = :id OR disciplina = :oldName)",
      { nome, usuarioId: user.id, id: disciplineId, oldName }
    );

    return ok({ id: disciplineId, nome }, "Disciplina atualizada com sucesso.");
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
    const disciplineId = Number(id);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0) {
      return fail("Identificador de disciplina inválido.", 400);
    }

    const currentRows = await query<Disciplina[]>(
      "SELECT id, nome FROM disciplinas WHERE id = :id AND usuario_id = :usuarioId LIMIT 1",
      { id: disciplineId, usuarioId: user.id }
    );

    const current = currentRows[0];
    if (!current) {
      return fail("Disciplina não encontrada ou não pertence ao seu usuário.", 404);
    }

    // Verificar se existem questões vinculadas à disciplina
    const questionsCountRows = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM questoes
       WHERE usuario_id = :usuarioId AND (disciplina_id = :id OR disciplina = :nome)`,
      { usuarioId: user.id, id: disciplineId, nome: current.nome }
    );

    const questionsCount = Number(questionsCountRows[0]?.total || 0);
    if (questionsCount > 0) {
      return fail(
        `Não é possível excluir esta disciplina pois existem ${questionsCount} questão(ões) vinculada(s) a ela. Remova ou reatribua as questões antes de prosseguir.`,
        409
      );
    }

    // Deletar assuntos vinculados (já sabemos que não têm questões)
    await db.execute(
      "DELETE FROM assuntos WHERE disciplina_id = :disciplineId AND usuario_id = :usuarioId",
      { disciplineId, usuarioId: user.id }
    );

    // Deletar a disciplina
    await db.execute(
      "DELETE FROM disciplinas WHERE id = :id AND usuario_id = :usuarioId",
      { id: disciplineId, usuarioId: user.id }
    );

    return ok(null, "Disciplina excluída com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

