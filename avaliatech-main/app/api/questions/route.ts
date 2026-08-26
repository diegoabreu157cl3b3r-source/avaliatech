import type { ResultSetHeader } from "mysql2";
import type { ExecuteValues } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { questionSchema } from "@/lib/validators";
import { cleanOptionalText, cleanText } from "@/lib/sanitizers";
import { isQuestionImageUrl } from "@/lib/question-image";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import type { Questao } from "@/types/question";

function buildFilters(searchParams: URLSearchParams, userId: number) {
  const where = ["usuario_id = :usuarioId"];
  const params: Record<string, ExecuteValues> = { usuarioId: userId };

  const search = cleanOptionalText(searchParams.get("search"));
  const disciplina = cleanOptionalText(searchParams.get("disciplina"));
  const assunto = cleanOptionalText(searchParams.get("assunto"));
  const dificuldade = cleanOptionalText(searchParams.get("dificuldade"));

  if (search) {
    where.push("(pergunta LIKE :search OR disciplina LIKE :search OR assunto LIKE :search)");
    params.search = `%${search}%`;
  }

  if (disciplina) {
    where.push("disciplina = :disciplina");
    params.disciplina = disciplina;
  }

  if (assunto) {
    where.push("assunto = :assunto");
    params.assunto = assunto;
  }

  if (dificuldade) {
    where.push("dificuldade = :dificuldade");
    params.dificuldade = dificuldade;
  }

  return { where: where.join(" AND "), params };
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 50);
    const offset = (page - 1) * limit;
    const { where, params } = buildFilters(searchParams, user.id);

    const countRows = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM questoes WHERE ${where}`,
      params
    );

    const rows = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade, created_at, updated_at
       FROM questoes
       WHERE ${where}
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);
    if (!isQuestionImageUrl(parsed.data.imagem)) return fail("Caminho de imagem inválido.", 422);

    const data = {
      pergunta: cleanText(parsed.data.pergunta),
      imagem: parsed.data.imagem ?? null,
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
      `INSERT INTO questoes
       (usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade)
       VALUES (:usuarioId, :pergunta, :imagem, :alternativa_a, :alternativa_b, :alternativa_c, :alternativa_d, :correta, :disciplina, :assunto, :dificuldade)`,
      { usuarioId: user.id, ...data }
    );

    return ok({ id: result.insertId, ...data }, "Questão cadastrada com sucesso.", 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}
