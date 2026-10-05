import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { verifyToken } from "@/lib/token";

export async function protectPrivateRoutes(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = await verifyToken(token);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
