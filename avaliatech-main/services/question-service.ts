import { http } from "@/services/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Questao, QuestaoFilters, QuestaoFormData } from "@/types/question";

function buildQuery(filters: QuestaoFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function listQuestions(filters: QuestaoFilters = {}) {
  const query = buildQuery(filters);
  return http<ApiResponse<PaginatedResponse<Questao>>>(`/api/questions${query ? `?${query}` : ""}`);
}

export function createQuestion(data: QuestaoFormData) {
  return http<ApiResponse<Questao>>("/api/questions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateQuestion(id: number, data: QuestaoFormData) {
  return http<ApiResponse<Questao>>(`/api/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteQuestion(id: number) {
  return http<ApiResponse<null>>(`/api/questions/${id}`, { method: "DELETE" });
}

export async function uploadQuestionImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch("/api/uploads/questions", { method: "POST", body: formData });
  const data = await response.json() as ApiResponse<{ url: string }>;
  if (!response.ok) throw new Error(data.message ?? "Não foi possível enviar a imagem.");
  if (!data.data?.url) throw new Error("O servidor não retornou a URL da imagem.");
  return data.data.url;
}
