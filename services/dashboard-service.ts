import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";
import type { Prova } from "@/types/exam";

export interface DificuldadeStat {
  dificuldade: "Fácil" | "Média" | "Difícil";
  total: number;
  porcentagem: number;
}

export interface DisciplinaStat {
  disciplina: string;
  total: number;
  porcentagem: number;
}

export interface AtividadeRecente {
  id: number;
  tipo: "questao_criada" | "questao_editada" | "questao_excluida" | "prova_gerada" | "prova_excluida";
  titulo: string;
  descricao?: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalQuestoes: number;
  totalDisciplinas: number;
  totalAssuntos: number;
  totalProvas: number;
  questoesPorDificuldade: DificuldadeStat[];
  questoesPorDisciplina: DisciplinaStat[];
  recentQuestions: Array<{
    id: number;
    pergunta: string;
    disciplina: string;
    assunto: string;
    dificuldade: string;
    created_at: string;
  }>;
  recentActivities: AtividadeRecente[];
  recentExams?: Prova[];
}

export function getDashboardStats() {
  return http<ApiResponse<DashboardStats>>("/api/dashboard/stats");
}

