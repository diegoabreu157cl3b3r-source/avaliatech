import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Assunto } from "@/types/discipline";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string; subjectId: string }>;
}

export async function PUT(request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id, subjectId } = await context.params;
    const disciplineId = Number(id);
    const subId = Number(subjectId);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0 || !Number.isInteger(subId) || subId <= 0) {
      return fail("Identificadores inválidos.", 400);
    }

    const body = await request.json();
    const rawName = typeof body?.nome === "string" ? body.nome : "";
    const nome = cleanText(rawName);

    if (!nome || nome.length < 2) {
      return fail("O nome do assunto deve ter pelo menos 2 caracteres.", 422);
    }

    if (nome.length > 120) {
      return fail("O nome do assunto não pode exceder 120 caracteres.", 422);
    }

    // Verificar se o assunto existe e pertence ao usuário
    const currentRows = await query<Assunto[]>(
      "SELECT id, nome, disciplina_id FROM assuntos WHERE id = :id AND disciplina_id = :disciplineId AND usuario_id = :usuarioId LIMIT 1",
      { id: subId, disciplineId, usuarioId: user.id }
    );

    const current = currentRows[0];
    if (!current) {
      return fail("Assunto não encontrado ou não pertence à sua disciplina.", 404);
    }

    // Verificar duplicação de nome na mesma disciplina
    const duplicateRows = await query<Assunto[]>(
      "SELECT id FROM assuntos WHERE disciplina_id = :disciplineId AND LOWER(nome) = LOWER(:nome) AND id != :id LIMIT 1",
      { disciplineId, nome, id: subId }
    );

    if (duplicateRows.length > 0) {
      return fail("Você já possui outro assunto com este nome nesta disciplina.", 409);
    }

    const oldName = current.nome;

    await db.execute(
      "UPDATE assuntos SET nome = :nome WHERE id = :id AND usuario_id = :usuarioId",
      { nome, id: subId, usuarioId: user.id }
    );

    // Atualizar nome textual nas questões vinculadas
    await db.execute(
      `UPDATE questoes
       SET assunto = :nome
       WHERE usuario_id = :usuarioId AND (assunto_id = :id OR (assunto = :oldName AND disciplina_id = :disciplineId))`,
      { nome, usuarioId: user.id, id: subId, oldName, disciplineId }
    );

    return ok({ id: subId, disciplina_id: disciplineId, nome }, "Assunto atualizado com sucesso.");
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
    const { id, subjectId } = await context.params;
    const disciplineId = Number(id);
    const subId = Number(subjectId);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0 || !Number.isInteger(subId) || subId <= 0) {
      return fail("Identificadores inválidos.", 400);
    }

    const currentRows = await query<Assunto[]>(
      "SELECT id, nome FROM assuntos WHERE id = :id AND disciplina_id = :disciplineId AND usuario_id = :usuarioId LIMIT 1",
      { id: subId, disciplineId, usuarioId: user.id }
    );

    const current = currentRows[0];
    if (!current) {
      return fail("Assunto não encontrado ou não pertence à sua disciplina.", 404);
    }

    // Verificar se existem questões vinculadas ao assunto
    const questionsCountRows = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM questoes
       WHERE usuario_id = :usuarioId AND (assunto_id = :id OR (assunto = :nome AND disciplina_id = :disciplineId))`,
      { usuarioId: user.id, id: subId, nome: current.nome, disciplineId }
    );

    const questionsCount = Number(questionsCountRows[0]?.total || 0);
    if (questionsCount > 0) {
      return fail(
        `Não é possível excluir este assunto pois existem ${questionsCount} questão(ões) vinculada(s) a ele. Remova ou reatribua as questões antes de prosseguir.`,
        409
      );
    }

    await db.execute(
      "DELETE FROM assuntos WHERE id = :id AND usuario_id = :usuarioId",
      { id: subId, usuarioId: user.id }
    );

    return ok(null, "Assunto excluído com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

