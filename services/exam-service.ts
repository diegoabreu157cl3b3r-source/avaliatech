import type { GenerateExamRequest } from "@/types/exam";

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

