import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { questionSchema } from "@/lib/validators";
import { cleanText } from "@/lib/sanitizers";
import { isQuestionImageUrl, removeQuestionImage } from "@/lib/question-image";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import type { Questao } from "@/types/question";

interface RouteContext { params: Promise<{ id: string }>; }

async function getId(context: RouteContext) {
  const id = Number((await context.params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const questionColumns = "id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade, created_at, updated_at";

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const id = await getId(context);
    if (!id) return fail("ID inválido.", 400);
    const rows = await query<Questao[]>(`SELECT ${questionColumns} FROM questoes WHERE id = :id AND usuario_id = :usuarioId LIMIT 1`, { id, usuarioId: user.id });
    return rows[0] ? ok(rows[0]) : fail("Questão não encontrada.", 404);
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
    const parsed = questionSchema.safeParse(await request.json());
    if (!parsed.success) return validationFail(parsed.error);
    if (!isQuestionImageUrl(parsed.data.imagem)) return fail("Caminho de imagem inválido.", 422);

    const current = await query<Pick<Questao, "imagem">[]>("SELECT imagem FROM questoes WHERE id = :id AND usuario_id = :usuarioId LIMIT 1", { id, usuarioId: user.id });
    if (!current[0]) return fail("Questão não encontrada.", 404);
    const data = {
      pergunta: cleanText(parsed.data.pergunta), imagem: parsed.data.imagem === undefined ? current[0].imagem : parsed.data.imagem,
      alternativa_a: cleanText(parsed.data.alternativa_a), alternativa_b: cleanText(parsed.data.alternativa_b),
      alternativa_c: cleanText(parsed.data.alternativa_c), alternativa_d: cleanText(parsed.data.alternativa_d),
      correta: parsed.data.correta, disciplina: cleanText(parsed.data.disciplina),
      assunto: cleanText(parsed.data.assunto), dificuldade: parsed.data.dificuldade
    };
    await db.execute<ResultSetHeader>(
      `UPDATE questoes SET pergunta = :pergunta, imagem = :imagem, alternativa_a = :alternativa_a, alternativa_b = :alternativa_b,
       alternativa_c = :alternativa_c, alternativa_d = :alternativa_d, correta = :correta, disciplina = :disciplina,
       assunto = :assunto, dificuldade = :dificuldade WHERE id = :id AND usuario_id = :usuarioId`,
      { id, usuarioId: user.id, ...data }
    );
    if (current[0].imagem && current[0].imagem !== data.imagem) await removeQuestionImage(current[0].imagem);
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
    const current = await query<Pick<Questao, "imagem">[]>("SELECT imagem FROM questoes WHERE id = :id AND usuario_id = :usuarioId LIMIT 1", { id, usuarioId: user.id });
    if (!current[0]) return fail("Questão não encontrada.", 404);
    await db.execute<ResultSetHeader>("DELETE FROM questoes WHERE id = :id AND usuario_id = :usuarioId", { id, usuarioId: user.id });
    await removeQuestionImage(current[0].imagem);
    return ok(null, "Questão excluída com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
