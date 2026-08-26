import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { cadastroSchema } from "@/lib/validators";
import { cleanEmail, cleanText } from "@/lib/sanitizers";
import { hashPassword } from "@/lib/password";
import { createToken } from "@/lib/token";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cadastroSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    const nome = cleanText(parsed.data.nome);
    const email = cleanEmail(parsed.data.email);

    const exists = await query<{ id: number }[]>(
      "SELECT id FROM usuarios WHERE email = :email LIMIT 1",
      { email }
    );

    if (exists.length > 0) {
      return fail("Este e-mail já está cadastrado.", 409);
    }

    const senhaHash = await hashPassword(parsed.data.senha);

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO usuarios (nome, email, senha_hash) VALUES (:nome, :email, :senhaHash)`,
      { nome, email, senhaHash }
    );

    const token = await createToken({ id: result.insertId, nome, email });
    const response = ok({ user: { id: result.insertId, nome, email } }, "Cadastro realizado com sucesso.", 201);
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
