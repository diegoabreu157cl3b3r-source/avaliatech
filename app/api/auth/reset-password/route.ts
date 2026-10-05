import crypto from "crypto";
import { db, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

interface ResetTokenRow {
  id: number;
  usuario_id: number;
  token_hash: string;
  expira_em: Date | string;
  usado: number | boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const novaSenha = typeof body?.novaSenha === "string" ? body.novaSenha : "";
    const confirmacaoSenha = typeof body?.confirmacaoSenha === "string" ? body.confirmacaoSenha : "";

    if (!token) {
      return fail("Token de recuperação não informado.", 400);
    }

    if (!novaSenha || novaSenha.length < 6) {
      return fail("A nova senha deve ter no mínimo 6 caracteres.", 422);
    }

    if (novaSenha !== confirmacaoSenha) {
      return fail("A confirmação de senha não confere com a nova senha.", 422);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const rows = await query<ResetTokenRow[]>(
      `SELECT id, usuario_id, expira_em, usado
       FROM recuperacao_senha
       WHERE token_hash = :tokenHash
       LIMIT 1`,
      { tokenHash }
    );

    const record = rows[0];

    if (!record) {
      return fail("Link de recuperação inválido ou inexistente.", 400);
    }

    if (Boolean(record.usado)) {
      return fail("Este link de recuperação já foi utilizado anteriormente.", 400);
    }

    const expiresAt = new Date(record.expira_em);
    if (isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
      return fail("Este link de recuperação expirou. Por favor, solicite uma nova redefinição.", 400);
    }

    // Gerar novo hash de senha com bcrypt
    const senhaHash = await hashPassword(novaSenha);

    // Atualizar senha do usuário
    await db.execute(
      "UPDATE usuarios SET senha_hash = :senhaHash WHERE id = :userId",
      { senhaHash, userId: record.usuario_id }
    );

    // Marcar token como utilizado
    await db.execute(
      "UPDATE recuperacao_senha SET usado = TRUE WHERE id = :id",
      { id: record.id }
    );

    return ok(null, "Senha alterada com sucesso! Você já pode realizar o login.");
  } catch (error) {
    return handleApiError(error);
  }
}

