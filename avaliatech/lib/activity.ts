import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export type TipoAtividade =
  | "questao_criada"
  | "questao_editada"
  | "questao_excluida"
  | "prova_gerada"
  | "prova_excluida";

export async function logActivity(
  usuarioId: number,
  tipo: TipoAtividade,
  titulo: string,
  descricao?: string | null
): Promise<void> {
  try {
    await db.execute<ResultSetHeader>(
      `INSERT INTO atividades (usuario_id, tipo, titulo, descricao, created_at)
       VALUES (:usuarioId, :tipo, :titulo, :descricao, NOW())`,
      {
        usuarioId,
        tipo,
        titulo: titulo.slice(0, 255),
        descricao: descricao ? descricao.slice(0, 1000) : null
      }
    );
  } catch (error) {
    // Silently continue if the table does not yet exist on older schemas
    console.warn("[logActivity] Não foi possível registrar atividade:", error);
  }
}
