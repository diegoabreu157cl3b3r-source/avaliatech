import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";

export interface DashboardStats {
  totalQuestoes: number;
  totalDisciplinas: number;
  totalAssuntos: number;
  totalProvas: number;
  recentQuestions: Array<{
    id: number;
    pergunta: string;
    disciplina: string;
    assunto: string;
    dificuldade: string;
    created_at: string;
  }>;
}

export function getDashboardStats() {
  return http<ApiResponse<DashboardStats>>("/api/dashboard/stats");
}
