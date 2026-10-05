import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/token";
import type { AuthUser, Usuario } from "@/types/user";

/**
 * Obtém o usuário atual autenticado.
 * Por padrão, utiliza as claims criptograficamente assinadas e verificadas do JWT,
 * eliminando uma consulta repetitiva ao banco de dados em cada chamada de API.
 */
export async function getCurrentUser(fromDb = false): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyToken(token);

  if (!payload) return null;

  if (!fromDb) {
    return {
      id: payload.id,
      nome: payload.nome,
      email: payload.email
    };
  }

  const rows = await query<AuthUser[]>(
    "SELECT id, nome, email FROM usuarios WHERE id = :id LIMIT 1",
    { id: payload.id }
  );

  return rows[0] ?? null;
}

export async function getUserFromDb(id: number): Promise<Usuario | null> {
  const rows = await query<Usuario[]>(
    "SELECT id, nome, email, logo_base64, logo_mime, created_at, updated_at FROM usuarios WHERE id = :id LIMIT 1",
    { id }
  );
  return rows[0] ?? null;
}

export async function requireAuth(fromDb = false) {
  const user = await getCurrentUser(fromDb);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
