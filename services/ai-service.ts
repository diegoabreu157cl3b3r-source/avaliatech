import type { AIQuestion, GenerateQuestionsRequest } from "@/types/question";

interface OllamaResponse {
  response?: string;
  message?: { content?: string };
}

function createPrompt({ disciplina, assunto, dificuldade, quantidade }: GenerateQuestionsRequest) {
  return `Gere exatamente ${quantidade} questões objetivas, diferentes entre si, para um banco de questões escolar.
Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dificuldade}

Responda SOMENTE com JSON válido, sem Markdown, sem comentários e sem campos extras, exatamente neste formato:
{"questions":[{"pergunta":"...","alternativa_a":"...","alternativa_b":"...","alternativa_c":"...","alternativa_d":"...","correta":"A","disciplina":"${disciplina}","assunto":"${assunto}","dificuldade":"${dificuldade}"}]}

Cada questão deve ter quatro alternativas distintas, apenas uma correta e a letra de correta deve ser A, B, C ou D.`;
}

export async function requestQuestionsFromOllama(input: GenerateQuestionsRequest) {
  const baseUrl = process.env.OLLAMA_BASE_URL?.replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL;
  if (!baseUrl || !model) throw new Error("AI_NOT_CONFIGURED");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: createPrompt(input), stream: false, format: "json" }),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(response.status === 404 ? "AI_MODEL_NOT_FOUND" : "AI_UNAVAILABLE");
    const payload = await response.json() as OllamaResponse;
    const content = payload.response ?? payload.message?.content;
    if (!content) throw new Error("AI_INVALID_RESPONSE");
    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("AI_TIMEOUT");
    if (error instanceof Error && error.message.startsWith("AI_")) throw error;
    throw new Error("AI_UNAVAILABLE");
  } finally {
    clearTimeout(timeout);
  }
}

export function parseAndValidateAIQuestions(raw: string, input: GenerateQuestionsRequest): AIQuestion[] {
  let data: unknown;
  try { data = JSON.parse(raw); } catch { throw new Error("AI_INVALID_RESPONSE"); }
  if (!data || typeof data !== "object" || !Array.isArray((data as { questions?: unknown }).questions)) {
    throw new Error("AI_INVALID_RESPONSE");
  }
  const questions = (data as { questions: unknown[] }).questions;
  if (questions.length !== input.quantidade) throw new Error("AI_INVALID_RESPONSE");

  const seenQuestions = new Set<string>();
  return questions.map((item) => {
    if (!item || typeof item !== "object") throw new Error("AI_INVALID_RESPONSE");
    const candidate = item as Record<string, unknown>;
    const keys = ["pergunta", "alternativa_a", "alternativa_b", "alternativa_c", "alternativa_d", "correta", "disciplina", "assunto", "dificuldade"];
    if (Object.keys(candidate).length !== keys.length || !keys.every((key) => key in candidate)) throw new Error("AI_INVALID_RESPONSE");
    if (!keys.filter((key) => key !== "correta").every((key) => typeof candidate[key] === "string" && candidate[key].trim().length > 0)) throw new Error("AI_INVALID_RESPONSE");
    if (candidate.correta !== "A" && candidate.correta !== "B" && candidate.correta !== "C" && candidate.correta !== "D") throw new Error("AI_INVALID_RESPONSE");
    if (candidate.disciplina !== input.disciplina || candidate.assunto !== input.assunto || candidate.dificuldade !== input.dificuldade) throw new Error("AI_INVALID_RESPONSE");

    const alternatives = [candidate.alternativa_a, candidate.alternativa_b, candidate.alternativa_c, candidate.alternativa_d]
      .map((value) => (value as string).trim().toLocaleLowerCase("pt-BR"));
    if (new Set(alternatives).size !== 4) throw new Error("AI_INVALID_RESPONSE");
    const normalizedQuestion = (candidate.pergunta as string).trim().toLocaleLowerCase("pt-BR");
    if (seenQuestions.has(normalizedQuestion)) throw new Error("AI_INVALID_RESPONSE");
    seenQuestions.add(normalizedQuestion);
    return {
      pergunta: (candidate.pergunta as string).trim(),
      alternativa_a: (candidate.alternativa_a as string).trim(),
      alternativa_b: (candidate.alternativa_b as string).trim(),
      alternativa_c: (candidate.alternativa_c as string).trim(),
      alternativa_d: (candidate.alternativa_d as string).trim(),
      correta: candidate.correta,
      disciplina: input.disciplina,
      assunto: input.assunto,
      dificuldade: input.dificuldade
    } as AIQuestion;
  });
}
