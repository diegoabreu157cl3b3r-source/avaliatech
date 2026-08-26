import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";
import type { Usuario } from "@/types/user";

export interface ProfileUpdateRequest {
  nome: string;
  email: string;
  senhaAtual?: string;
  novaSenha?: string;
  confirmarNovaSenha?: string;
  logoBase64?: string | null;
  logoMime?: "image/png" | "image/jpeg" | null;
}

export function getProfile() {
  return http<ApiResponse<Usuario>>("/api/profile");
}

export function updateProfile(data: ProfileUpdateRequest) {
  return http<ApiResponse<Usuario>>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
