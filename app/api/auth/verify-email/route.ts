import { createHash, timingSafeEqual } from "node:crypto";
import { db, query } from "@/lib/db";
import { cleanEmail } from "@/lib/sanitizers";
import { fail, handleApiError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

interface VerificationRecord {
id: number;
email_verificado: number;
codigo_hash: string;
tentativas: number;
}

export async function POST(request: Request) {
try {
const body = await request.json();

if (
  typeof body.email !== "string" ||
  typeof body.codigo !== "string"
) {
  return fail("Informe o e-mail e o código de confirmação.", 400);
}

const email = cleanEmail(body.email);
const codigo = body.codigo.trim();

if (!/^\d{6}$/.test(codigo)) {
  return fail("O código deve conter exatamente 6 números.", 400);
}

const users = await query<VerificationRecord[]>(
  `SELECT
     u.id,
     u.email_verificado,
     v.codigo_hash,
     v.tentativas
   FROM usuarios u
   LEFT JOIN verificacoes_email v
     ON v.usuario_id = u.id
   WHERE u.email = :email
   LIMIT 1`,
  { email }
);

const user = users[0];

if (!user) {
  return fail("E-mail ou código inválido.", 400);
}

if (user.email_verificado === 1) {
  return ok(
    { verified: true },
    "Este e-mail já está confirmado."
  );
}

if (!user.codigo_hash) {
  return fail(
    "Não encontramos um código ativo. Solicite um novo código.",
    400
  );
}

if (user.tentativas >= 5) {
  return fail(
    "Limite de tentativas atingido. Solicite um novo código.",
    429
  );
}

const records = await query<{ valido: number }[]>(
  `SELECT 1 AS valido
   FROM verificacoes_email
   WHERE usuario_id = :usuarioId
     AND expira_em > UTC_TIMESTAMP()
   LIMIT 1`,
  { usuarioId: user.id }
);

if (records.length === 0) {
  return fail(
    "O código expirou. Solicite um novo código.",
    400
  );
}

const codigoHash = createHash("sha256")
  .update(codigo)
  .digest("hex");

const hashCorreto = Buffer.from(user.codigo_hash, "hex");
const hashRecebido = Buffer.from(codigoHash, "hex");

const codigoValido =
  hashCorreto.length === hashRecebido.length &&
  timingSafeEqual(hashCorreto, hashRecebido);

if (!codigoValido) {
  await db.execute(
    `UPDATE verificacoes_email
     SET tentativas = tentativas + 1
     WHERE usuario_id = :usuarioId`,
    { usuarioId: user.id }
  );

  return fail("Código incorreto. Confira e tente novamente.", 400);
}

const connection = await db.getConnection();

try {
  await connection.beginTransaction();

  await connection.execute(
    `UPDATE usuarios
     SET email_verificado = 1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :usuarioId`,
    { usuarioId: user.id }
  );

  await connection.execute(
    `DELETE FROM verificacoes_email
     WHERE usuario_id = :usuarioId`,
    { usuarioId: user.id }
  );

  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}

return ok(
  { verified: true },
  "E-mail confirmado com sucesso! Agora você pode entrar."
);

} catch (error) {
return handleApiError(error);
}
}