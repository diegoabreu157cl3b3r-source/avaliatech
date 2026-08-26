import { query } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { cleanEmail } from "@/lib/sanitizers";
import { verifyPassword } from "@/lib/password";
import { createToken } from "@/lib/token";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";

interface UserWithPassword {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    const email = cleanEmail(parsed.data.email);
    const users = await query<UserWithPassword[]>(
      "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = :email LIMIT 1",
      { email }
    );

    const user = users[0];
    if (!user) {
      return fail("E-mail ou senha inválidos.", 401);
    }

    const passwordIsValid = await verifyPassword(parsed.data.senha, user.senha_hash);
    if (!passwordIsValid) {
      return fail("E-mail ou senha inválidos.", 401);
    }

    const token = await createToken({ id: user.id, nome: user.nome, email: user.email });
    const response = ok({ user: { id: user.id, nome: user.nome, email: user.email } }, "Login realizado com sucesso.");
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
