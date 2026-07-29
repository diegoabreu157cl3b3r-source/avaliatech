import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { ok } from "@/lib/response";

export async function POST() {
  const response = ok(null, "Logout realizado com sucesso.");
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
