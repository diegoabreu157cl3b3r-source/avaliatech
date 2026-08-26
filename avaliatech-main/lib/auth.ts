import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/token";
import type { AuthUser } from "@/types/user";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyToken(token);

  if (!payload) return null;

  const rows = await query<AuthUser[]>(
    "SELECT id, nome, email FROM usuarios WHERE id = :id LIMIT 1",
    { id: payload.id }
  );

  return rows[0] ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
