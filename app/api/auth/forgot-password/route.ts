import crypto from "crypto";
import { db, query } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { cleanText } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";
import type { UserRow } from "@/types/user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = cleanText(rawEmail).toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail("Informe um endereço de e-mail válido.", 422);
    }

    const rows = await query<UserRow[]>(
      "SELECT id, nome, email FROM usuarios WHERE LOWER(email) = LOWER(:email) LIMIT 1",
      { email }
    );

    const user = rows[0];

    // Se o usuário existir, gera token e envia email
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validade

      // Invalida tokens anteriores não utilizados
      await db.execute(
        "UPDATE recuperacao_senha SET usado = TRUE WHERE usuario_id = :userId AND usado = FALSE",
        { userId: user.id }
      );

      // Salva o novo token com hash
      await db.execute(
        "INSERT INTO recuperacao_senha (usuario_id, token_hash, expira_em) VALUES (:userId, :tokenHash, :expiresAt)",
        { userId: user.id, tokenHash, expiresAt }
      );

      const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
      const resetUrl = `${appUrl}/redefinir-senha?token=${rawToken}`;

      await sendPasswordResetEmail({
        to: user.email,
        name: user.nome,
        resetUrl
      });
    }

    // Resposta genérica para evitar enumeração de usuários
    return ok(
      null,
      "Se o e-mail informado estiver cadastrado, você receberá em instantes um link para redefinição de senha."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

