import { createHash, randomInt } from "node:crypto";
import { db, query } from "@/lib/db";
import { cleanEmail } from "@/lib/sanitizers";
import { sendEmailVerificationCode } from "@/lib/email";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

interface UserRecord {
id: number;
nome: string;
email_verificado: number;
}

interface RecentVerification {
id: number;
}

export async function POST(request: Request) {
try {
const body = await request.json();

if (typeof body.email !== "string") {
  return fail("Informe um e-mail válido.", 400);
}

const email = cleanEmail(body.email);

const users = await query<UserRecord[]>(
  `SELECT id, nome, email_verificado
   FROM usuarios
   WHERE email = :email
   LIMIT 1`,
  { email }
);

const user = users[0];

// Não revela se o endereço está cadastrado.
if (!user || user.email_verificado === 1) {
  return ok(
    { requested: true },
    "Se houver uma conta pendente para esse e-mail, enviaremos um novo código."
  );
}

const recent = await query<RecentVerification[]>(
  `SELECT id
   FROM verificacoes_email
   WHERE usuario_id = :usuarioId
     AND enviado_em > UTC_TIMESTAMP() - INTERVAL 60 SECOND
   LIMIT 1`,
  { usuarioId: user.id }
);

if (recent.length > 0) {
  return fail(
    "Aguarde 60 segundos antes de solicitar outro código.",
    429
  );
}

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
    usuarioId: user.id,
    codigoHash,
    expiracao
  }
);

try {
  await sendEmailVerificationCode({
    to: email,
    name: user.nome,
    code: codigo
  });
} catch (error) {
  console.error("Falha ao reenviar código de confirmação:", error);

  return fail(
    "Não foi possível enviar o e-mail. Tente novamente mais tarde.",
    503
  );
}

return ok(
  { requested: true },
  "Novo código enviado! Confira sua caixa de entrada."
);

} catch (error) {
return handleApiError(error);
}
}