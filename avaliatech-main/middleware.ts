import type { NextRequest } from "next/server";
import { protectPrivateRoutes } from "@/middleware/auth-middleware";

export async function middleware(request: NextRequest) {
  return protectPrivateRoutes(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/questoes/:path*", "/gerar-prova/:path*", "/perfil/:path*", "/provas/:path*"]
};
