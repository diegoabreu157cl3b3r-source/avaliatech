export interface Usuario {
  id: number;
  nome: string;
  email: string;
  logo_base64?: string | null;
  logo_mime?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}
