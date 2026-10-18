import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  DistribuicaoDificuldade,
  ExamDataPayload,
  ExamFilters,
  GenerateExamRequest,
  Prova,
} from "@/types/exam";
import { http } from "@/services/http";

export interface ExamDistributionResponse {
  distribution: DistribuicaoDificuldade;
  counts: {
    facil: number;
    media: number;
    dificil: number;
    total: number;
  };
  totalAvailable: number;
  hasEnoughTotal: boolean;
  isAdjusted: boolean;
}

export async function generateExamPdf(data: GenerateExamRequest): Promise<Blob> {
  const response = await fetch("/api/exams/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Não foi possível gerar a prova.";
    try {
      const json = await response.json();
      if (typeof json?.message === "string") message = json.message;
    } catch {
      // A resposta de erro pode não ser JSON.
    }
    throw new Error(message);
  }

  return response.blob();
}

/**
 * Retorna o conteúdo de `data` diretamente, para que o formulário possa
 * acessar result.distribution, result.counts etc. sem desembrulhar o envelope.
 */
export async function getExamDistribution(
  data: {
    disciplina: string;
    assuntos: string[];
    quantidadeQuestoes: 10 | 15 | 20 | 25;
  },
  signal?: AbortSignal
): Promise<ExamDistributionResponse> {
  const response = await http<ApiResponse<ExamDistributionResponse>>(
    "/api/exams/distribution",
    {
      method: "POST",
      body: JSON.stringify(data),
      signal,
    }
  );

  if (!response.data) {
    throw new Error(response.message || "Não foi possível calcular a distribuição.");
  }

  return response.data;
}

export async function downloadHistoricalExamPdf(id: number): Promise<Blob> {
  const response = await fetch(`/api/exams/${id}/pdf`, {
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
  });

  if (!response.ok) {
    let errorMessage = "Não foi possível baixar o PDF da prova.";
    try {
      const json = await response.json();
      if (json?.message) errorMessage = json.message;
    } catch {
      // A resposta de erro pode não ser JSON.
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

export function getExams(filters: ExamFilters = {}, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.escola) params.set("escola", filters.escola);
  if (filters.disciplina) params.set("disciplina", filters.disciplina);
  if (filters.assunto) params.set("assunto", filters.assunto);
  if (filters.dificuldade && filters.dificuldade !== "Todas") {
    params.set("dificuldade", filters.dificuldade);
  }
  if (filters.periodo && filters.periodo !== "todos") {
    params.set("periodo", filters.periodo);
  }

  const query = params.toString();
  return http<ApiResponse<PaginatedResponse<Prova>>>(
    `/api/exams${query ? `?${query}` : ""}`,
    { signal }
  );
}

export function getExamDetails(id: number) {
  return http<ApiResponse<{ exam: Prova; dataPayload: ExamDataPayload }>>(
    `/api/exams/${id}`
  );
}

export function deleteExam(id: number) {
  return http<ApiResponse<null>>(`/api/exams/${id}`, {
    method: "DELETE",
  });
}

export function sendExamByEmail(id: number, email: string) {
  return http<ApiResponse<null>>(`/api/exams/${id}/send-email`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
