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
