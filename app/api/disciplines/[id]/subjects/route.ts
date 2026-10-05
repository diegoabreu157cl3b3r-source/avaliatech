import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Assunto, Disciplina } from "@/types/discipline";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const disciplineId = Number(id);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0) {
      return fail("Identificador de disciplina inválido.", 400);
    }

    const rows = await query<Assunto[]>(
      `SELECT a.id, a.disciplina_id, a.usuario_id, a.nome, a.created_at, a.updated_at,
              COUNT(q.id) AS total_questoes
       FROM assuntos a
       LEFT JOIN questoes q ON (q.assunto_id = a.id OR (q.assunto = a.nome AND q.disciplina_id = a.disciplina_id AND q.usuario_id = a.usuario_id))
       WHERE a.disciplina_id = :disciplineId AND a.usuario_id = :usuarioId
       GROUP BY a.id
       ORDER BY a.nome ASC`,
      { disciplineId, usuarioId: user.id }
    );

    return ok(rows.map((r) => ({ ...r, total_questoes: Number(r.total_questoes || 0) })));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const disciplineId = Number(id);

    if (!Number.isInteger(disciplineId) || disciplineId <= 0) {
      return fail("Identificador de disciplina inválido.", 400);
    }

    // Verificar se a disciplina pertence ao usuário
    const discRows = await query<Disciplina[]>(
      "SELECT id FROM disciplinas WHERE id = :id AND usuario_id = :usuarioId LIMIT 1",
      { id: disciplineId, usuarioId: user.id }
    );

    if (discRows.length === 0) {
      return fail("Disciplina não encontrada ou não pertence ao seu usuário.", 404);
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

    // Verificar se o assunto já existe nesta disciplina
    const existingRows = await query<Assunto[]>(
      "SELECT id FROM assuntos WHERE disciplina_id = :disciplineId AND LOWER(nome) = LOWER(:nome) LIMIT 1",
      { disciplineId, nome }
    );

    if (existingRows.length > 0) {
      return fail("Este assunto já está cadastrado nesta disciplina.", 409);
    }

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO assuntos (disciplina_id, usuario_id, nome) VALUES (:disciplineId, :usuarioId, :nome)",
      { disciplineId, usuarioId: user.id, nome }
    );

    const newSubject: Assunto = {
      id: result.insertId,
      disciplina_id: disciplineId,
      usuario_id: user.id,
      nome,
      total_questoes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return ok(newSubject, "Assunto cadastrado com sucesso.", 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

