import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { ExamDataPayload, ExamFilters, GenerateExamRequest, Prova } from "@/types/exam";
import { http } from "@/services/http";

export async function generateExamPdf(data: GenerateExamRequest) {
  const response = await fetch("/api/exams/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message ?? "Não foi possível gerar a prova.");
  }

  return response.blob();
}

export async function downloadHistoricalExamPdf(id: number): Promise<Blob> {
  const response = await fetch(`/api/exams/${id}/pdf`, {
    method: "GET",
    headers: { "Cache-Control": "no-cache" }
  });

  if (!response.ok) {
    let errorMessage = "Não foi possível baixar o PDF da prova.";
    try {
      const json = await response.json();
      if (json.message) errorMessage = json.message;
    } catch {
      // Not JSON
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

export function getExams(filters: ExamFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.escola) params.set("escola", filters.escola);
  if (filters.disciplina) params.set("disciplina", filters.disciplina);
  if (filters.assunto) params.set("assunto", filters.assunto);
  if (filters.dificuldade && filters.dificuldade !== "Todas") params.set("dificuldade", filters.dificuldade);
  if (filters.periodo && filters.periodo !== "todos") params.set("periodo", filters.periodo);

  const query = params.toString();
  return http<ApiResponse<PaginatedResponse<Prova>>>(`/api/exams${query ? `?${query}` : ""}`);
}

export function getExamDetails(id: number) {
  return http<ApiResponse<{ exam: Prova; dataPayload: ExamDataPayload }>>(`/api/exams/${id}`);
}

export function deleteExam(id: number) {
  return http<ApiResponse<null>>(`/api/exams/${id}`, {
    method: "DELETE"
  });
}


