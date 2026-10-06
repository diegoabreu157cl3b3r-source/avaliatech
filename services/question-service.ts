import { http } from "@/services/http";
import { invalidateDisciplinesCache } from "@/services/discipline-service";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { GenerateQuestionsRequest, GenerateQuestionsResponse, Questao, QuestaoFilters, QuestaoFormData } from "@/types/question";

function buildQuery(filters: QuestaoFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function listQuestions(filters: QuestaoFilters = {}, signal?: AbortSignal) {
  const query = buildQuery(filters);
  return http<ApiResponse<PaginatedResponse<Questao>>>(`/api/questions${query ? `?${query}` : ""}`, { signal });
}

export async function createQuestion(data: QuestaoFormData) {
  const response = await http<ApiResponse<Questao>>("/api/questions", {
    method: "POST",
    body: JSON.stringify(data)
  });
  invalidateDisciplinesCache();
  return response;
}

export function generateQuestionsWithAI(data: GenerateQuestionsRequest) {
  return http<ApiResponse<GenerateQuestionsResponse>>("/api/ai/generate-questions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateQuestion(id: number, data: QuestaoFormData) {
  const response = await http<ApiResponse<Questao>>(`/api/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  invalidateDisciplinesCache();
  return response;
}

export async function deleteQuestion(id: number) {
  const response = await http<ApiResponse<null>>(`/api/questions/${id}`, { method: "DELETE" });
  invalidateDisciplinesCache();
  return response;
}

export interface DifficultyAvailability {
  total: number;
  facil: number;
  media: number;
  dificil: number;
}

export function getQuestionsAvailability(
  disciplina: string,
  assuntos?: string[],
  signal?: AbortSignal
) {
  const params = new URLSearchParams();
  if (disciplina) params.set("disciplina", disciplina);
  if (assuntos && assuntos.length > 0) {
    params.set("assuntos", assuntos.join(","));
  }
  return http<ApiResponse<DifficultyAvailability>>(
    `/api/questions/availability?${params.toString()}`,
    { signal }
  );
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
