import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";
import type { Assunto, Disciplina, DisciplinaWithAssuntos } from "@/types/discipline";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();

    // 1 e 2. Buscar disciplinas e assuntos do usuário em paralelo
    const [disciplines, subjects] = await Promise.all([
      query<Disciplina[]>(
        `SELECT d.id, d.usuario_id, d.nome, d.created_at, d.updated_at,
                COUNT(DISTINCT a.id) AS total_assuntos,
                COUNT(DISTINCT q.id) AS total_questoes
         FROM disciplinas d
         LEFT JOIN assuntos a ON a.disciplina_id = d.id AND a.usuario_id = d.usuario_id
         LEFT JOIN questoes q ON (q.disciplina_id = d.id OR (q.disciplina = d.nome AND q.usuario_id = d.usuario_id))
         WHERE d.usuario_id = :usuarioId
         GROUP BY d.id
         ORDER BY d.nome ASC`,
        { usuarioId: user.id }
      ),
      query<Assunto[]>(
        `SELECT a.id, a.disciplina_id, a.usuario_id, a.nome, a.created_at, a.updated_at,
                COUNT(q.id) AS total_questoes
         FROM assuntos a
         LEFT JOIN questoes q ON (q.assunto_id = a.id OR (q.assunto = a.nome AND q.disciplina_id = a.disciplina_id AND q.usuario_id = a.usuario_id))
         WHERE a.usuario_id = :usuarioId
         GROUP BY a.id
         ORDER BY a.nome ASC`,
        { usuarioId: user.id }
      )
    ]);

    // 3. Montar a lista aninhada
    const result: DisciplinaWithAssuntos[] = disciplines.map((disc) => ({
      ...disc,
      total_assuntos: Number(disc.total_assuntos || 0),
      total_questoes: Number(disc.total_questoes || 0),
      assuntos: subjects
        .filter((sub) => sub.disciplina_id === disc.id)
        .map((sub) => ({
          ...sub,
          total_questoes: Number(sub.total_questoes || 0)
        }))
    }));

    return ok(result);
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
    const rawName = typeof body?.nome === "string" ? body.nome : "";
    const nome = cleanText(rawName);

    if (!nome || nome.length < 2) {
      return fail("O nome da disciplina deve ter pelo menos 2 caracteres.", 422);
    }

    if (nome.length > 120) {
      return fail("O nome da disciplina não pode exceder 120 caracteres.", 422);
    }

    // Verificar se já existe uma disciplina com esse nome para o usuário
    const existing = await query<Disciplina[]>(
      "SELECT id FROM disciplinas WHERE usuario_id = :usuarioId AND LOWER(nome) = LOWER(:nome) LIMIT 1",
      { usuarioId: user.id, nome }
    );

    if (existing.length > 0) {
      return fail("Você já possui uma disciplina cadastrada com este nome.", 409);
    }

    const [insertResult] = await db.execute<ResultSetHeader>(
      "INSERT INTO disciplinas (usuario_id, nome) VALUES (:usuarioId, :nome)",
      { usuarioId: user.id, nome }
    );

    const newDisc: DisciplinaWithAssuntos = {
      id: insertResult.insertId,
      usuario_id: user.id,
      nome,
      total_assuntos: 0,
      total_questoes: 0,
      assuntos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return ok(newDisc, "Disciplina cadastrada com sucesso.", 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }
    return handleApiError(error);
  }
}

