import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { questionSchema } from "@/lib/validators";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import type { Questao } from "@/types/question";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function getId(context: RouteContext) {
  const params = await context.params;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const id = await getId(context);
    if (!id) return fail("ID inválido.", 400);

    const rows = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade, created_at, updated_at
       FROM questoes
       WHERE id = :id AND usuario_id = :usuarioId
       LIMIT 1`,
      { id, usuarioId: user.id }
    );

    if (!rows[0]) return fail("Questão não encontrada.", 404);
    return ok(rows[0]);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const id = await getId(context);
    if (!id) return fail("ID inválido.", 400);

    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    const data = {
      pergunta: cleanText(parsed.data.pergunta),
      alternativa_a: cleanText(parsed.data.alternativa_a),
      alternativa_b: cleanText(parsed.data.alternativa_b),
      alternativa_c: cleanText(parsed.data.alternativa_c),
      alternativa_d: cleanText(parsed.data.alternativa_d),
      correta: parsed.data.correta,
      disciplina: cleanText(parsed.data.disciplina),
      assunto: cleanText(parsed.data.assunto),
      dificuldade: parsed.data.dificuldade
    };

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE questoes
       SET pergunta = :pergunta,
           alternativa_a = :alternativa_a,
           alternativa_b = :alternativa_b,
           alternativa_c = :alternativa_c,
           alternativa_d = :alternativa_d,
           correta = :correta,
           disciplina = :disciplina,
           assunto = :assunto,
           dificuldade = :dificuldade
       WHERE id = :id AND usuario_id = :usuarioId`,
      { id, usuarioId: user.id, ...data }
    );

    if (result.affectedRows === 0) return fail("Questão não encontrada.", 404);
    return ok({ id, ...data }, "Questão atualizada com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const id = await getId(context);
    if (!id) return fail("ID inválido.", 400);

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM questoes WHERE id = :id AND usuario_id = :usuarioId",
      { id, usuarioId: user.id }
    );

    if (result.affectedRows === 0) return fail("Questão não encontrada.", 404);
    return ok(null, "Questão excluída com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
