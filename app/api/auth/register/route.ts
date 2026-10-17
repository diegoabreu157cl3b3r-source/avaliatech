import { createHash, randomInt } from "node:crypto";
import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { cadastroSchema } from "@/lib/validators";
import { cleanEmail, cleanText } from "@/lib/sanitizers";
import { hashPassword } from "@/lib/password";
import { sendEmailVerificationCode } from "@/lib/email";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
try {
const body = await request.json();
const parsed = cadastroSchema.safeParse(body);

if (!parsed.success) {
  return validationFail(parsed.error);
}

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
  `INSERT INTO usuarios
    (nome, email, senha_hash, email_verificado)
   VALUES (:nome, :email, :senhaHash, 0)`,
  { nome, email, senhaHash }
);

const codigo = randomInt(100000, 1000000).toString();
const codigoHash = createHash("sha256")
  .update(codigo)
  .digest("hex");

const expiracao = new Date(Date.now() + 10 * 60 * 1000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

await db.execute(
  `INSERT INTO verificacoes_email
    (usuario_id, codigo_hash, expira_em, tentativas, enviado_em)
   VALUES (:usuarioId, :codigoHash, :expiracao, 0, UTC_TIMESTAMP())
   ON DUPLICATE KEY UPDATE
    codigo_hash = VALUES(codigo_hash),
    expira_em = VALUES(expira_em),
    tentativas = 0,
    enviado_em = UTC_TIMESTAMP()`,
  {
    usuarioId: result.insertId,
    codigoHash,
    expiracao
  }
);

try {
  await sendEmailVerificationCode({
    to: email,
    name: nome,
    code: codigo
  });
} catch (emailError) {
  console.error(
    "Falha ao enviar código de verificação:",
    emailError
  );

  return fail(
    "Seu cadastro foi criado, mas não conseguimos enviar o código. Verifique a configuração do e-mail e tente solicitar outro código.",
    503
  );
}

return ok(
  {
    email,
    verificationRequired: true
  },
  "Cadastro realizado! Enviamos um código de confirmação para seu e-mail.",
  201
);

} catch (error) {
return handleApiError(error);
}
}