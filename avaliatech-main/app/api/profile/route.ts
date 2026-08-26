import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import { cleanEmail, cleanText } from "@/lib/sanitizers";
import { hashPassword, verifyPassword } from "@/lib/password";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import { isValidLogo } from "@/lib/upload";

interface ProfileRow {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  logo_base64: string | null;
  logo_mime: "image/png" | "image/jpeg" | null;
}

export async function GET() {
  try {
    const user = await requireAuth();
    const rows = await query<Omit<ProfileRow, "senha_hash">[]>(
      "SELECT id, nome, email, logo_base64, logo_mime FROM usuarios WHERE id = :id LIMIT 1",
      { id: user.id }
    );

    if (!rows[0]) return fail("Perfil não encontrado.", 404);
    return ok(rows[0]);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    const nome = cleanText(parsed.data.nome);
    const email = cleanEmail(parsed.data.email);

    if (!isValidLogo(parsed.data.logoBase64)) {
      return fail("A logo deve ser PNG, JPG ou JPEG e ter no máximo 2 MB.", 422);
    }

    const currentRows = await query<ProfileRow[]>(
      "SELECT id, nome, email, senha_hash, logo_base64, logo_mime FROM usuarios WHERE id = :id LIMIT 1",
      { id: user.id }
    );
    const current = currentRows[0];
    if (!current) return fail("Perfil não encontrado.", 404);

    const emailExists = await query<{ id: number }[]>(
      "SELECT id FROM usuarios WHERE email = :email AND id <> :id LIMIT 1",
      { email, id: user.id }
    );
    if (emailExists.length > 0) return fail("Este e-mail já está sendo usado por outro usuário.", 409);

    const shouldChangePassword = Boolean(parsed.data.senhaAtual || parsed.data.novaSenha);
    let senhaHash = current.senha_hash;

    if (shouldChangePassword) {
      const validCurrentPassword = await verifyPassword(parsed.data.senhaAtual ?? "", current.senha_hash);
      if (!validCurrentPassword) return fail("Senha atual incorreta.", 401);
      senhaHash = await hashPassword(parsed.data.novaSenha ?? "");
    }

    const logoBase64 = parsed.data.logoBase64 ?? current.logo_base64;
    const logoMime = parsed.data.logoMime ?? current.logo_mime;

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE usuarios
       SET nome = :nome, email = :email, senha_hash = :senhaHash, logo_base64 = :logoBase64, logo_mime = :logoMime
       WHERE id = :id`,
      { id: user.id, nome, email, senhaHash, logoBase64, logoMime }
    );

    if (result.affectedRows === 0) return fail("Perfil não encontrado.", 404);
    return ok({ id: user.id, nome, email, logo_base64: logoBase64, logo_mime: logoMime }, "Perfil atualizado com sucesso.");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
