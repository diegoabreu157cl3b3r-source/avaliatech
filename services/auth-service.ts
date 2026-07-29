import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";
import type { AuthUser, CadastroRequest, LoginRequest } from "@/types/user";

export function login(data: LoginRequest) {
  return http<ApiResponse<{ user: AuthUser }>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function register(data: CadastroRequest) {
  return http<ApiResponse<{ user: AuthUser }>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function logout() {
  return http<ApiResponse<null>>("/api/auth/logout", { method: "POST" });
}
