import { SignJWT, jwtVerify } from "jose";

export interface AuthPayload {
  id: number;
  nome: string;
  email: string;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.id))
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "7d")
    .sign(getSecret());
}

export async function verifyToken(token?: string | null): Promise<AuthPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: Number(payload.id),
      nome: String(payload.nome),
      email: String(payload.email)
    };
  } catch {
    return null;
  }
}
