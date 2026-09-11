import { GoogleGenAI, Type } from "@google/genai";
import type { AIQuestion, GenerateQuestionsRequest } from "@/types/question";

export class GeminiServiceError extends Error {
  statusCode: number;
  apiCode?: string;
  model: string;

  constructor(message: string, statusCode: number, model: string, apiCode?: string) {
    super(message);
    this.name = "GeminiServiceError";
    this.statusCode = statusCode;
    this.model = model;
    this.apiCode = apiCode;
  }
}

function createPrompt({ disciplina, assunto, dificuldade, quantidade, descricao }: GenerateQuestionsRequest) {
  const additionalInstructions = descricao?.trim()
    ? `\n\nInstruções adicionais do professor:\n"${descricao.trim()}"\nUse as instruções adicionais para orientar o estilo, contexto e elaboração das questões, mantendo estritamente os parâmetros obrigatórios.`
    : "";

  const instrucaoDificuldade =
    dificuldade === "Mista"
      ? `Dificuldade: Mista (distribua as ${quantidade} questões de forma equilibrada e variada entre os níveis "Fácil", "Média" e "Difícil". No campo "dificuldade" de cada questão individual no JSON, classifique obrigatoriamente como "Fácil", "Média" ou "Difícil").`
      : `Dificuldade: ${dificuldade} (todas as questões devem ter o campo "dificuldade" exatamente como "${dificuldade}").`;

  return `Gere exatamente ${quantidade} questões objetivas, diferentes entre si, para um banco de questões escolar.
Disciplina: ${disciplina}
Assunto: ${assunto}
${instrucaoDificuldade}${additionalInstructions}

Responda SOMENTE com JSON válido, sem Markdown, sem comentários e sem campos extras, exatamente neste formato:
{"questions":[{"pergunta":"...","alternativa_a":"...","alternativa_b":"...","alternativa_c":"...","alternativa_d":"...","correta":"A","disciplina":"${disciplina}","assunto":"${assunto}","dificuldade":"${dificuldade === "Mista" ? "Fácil" : dificuldade}"}]}

Cada questão deve ter quatro alternativas distintas, apenas uma correta e a letra de correta deve ser A, B, C ou D. O campo "dificuldade" de cada questão individual no array JSON deve ser obrigatoriamente "Fácil", "Média" ou "Difícil".`;
}

const questionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pergunta: { type: Type.STRING },
          alternativa_a: { type: Type.STRING },
          alternativa_b: { type: Type.STRING },
          alternativa_c: { type: Type.STRING },
          alternativa_d: { type: Type.STRING },
          correta: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
          disciplina: { type: Type.STRING },
          assunto: { type: Type.STRING },
          dificuldade: { type: Type.STRING, enum: ["Fácil", "Média", "Difícil"] }
        },
        required: ["pergunta", "alternativa_a", "alternativa_b", "alternativa_c", "alternativa_d", "correta", "disciplina", "assunto", "dificuldade"]
      }
    }
  },
  required: ["questions"]
} as const;

function parseAndClassifyGeminiError(error: unknown, model: string): GeminiServiceError {
  if (error instanceof GeminiServiceError) {
    return error;
  }

  let rawStatus = 500;
  let rawCode = "UNKNOWN";
  let rawMessage = "Erro inesperado ao comunicar com o serviço de IA.";

  if (error && typeof error === "object") {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.status === "number") {
      rawStatus = errObj.status;
    }

    if (typeof errObj.message === "string") {
      rawMessage = errObj.message;
      try {
        const json = JSON.parse(errObj.message);
        if (json?.error) {
          if (typeof json.error.code === "number") rawStatus = json.error.code;
          rawCode = json.error.status || String(json.error.code);
          rawMessage = json.error.message || errObj.message;
        }
      } catch {
        // Not JSON formatted message
      }
    }
  }

  // Safe logging without exposing API keys or secrets
  console.error(`[Gemini AI Error] Model: ${model} | HTTP Status: ${rawStatus} | Code: ${rawCode} | Message: ${rawMessage}`);

  // Timeout / network abortion
  if (/timeout|aborted|ETIMEDOUT|ECONNRESET/i.test(rawMessage)) {
    return new GeminiServiceError(
      "Tempo limite esgotado ao aguardar resposta da IA. Tente novamente.",
      504,
      model,
      "TIMEOUT"
    );
  }

  // 401 / 403 or Invalid API key
  if (
    rawStatus === 401 ||
    rawStatus === 403 ||
    /API key not valid|API_KEY_INVALID|PERMISSION_DENIED|UNAUTHENTICATED/i.test(rawMessage)
  ) {
    return new GeminiServiceError(
      "Chave de API da Gemini inválida ou sem permissão de acesso.",
      401,
      model,
      rawCode || "INVALID_API_KEY"
    );
  }

  // 429 - Quota or rate limit exceeded
  if (rawStatus === 429 || /RESOURCE_EXHAUSTED|quota|rate limit/i.test(rawMessage)) {
    return new GeminiServiceError(
      "Limite de requisições ou cota da Gemini excedido. Tente novamente em instantes.",
      429,
      model,
      rawCode || "RATE_LIMIT_EXCEEDED"
    );
  }

  // 404 - Model not found / discontinued
  if (rawStatus === 404 || /NOT_FOUND|no longer available|is not found/i.test(rawMessage)) {
    return new GeminiServiceError(
      `O modelo de IA configurado (${model}) não está disponível ou foi descontinuado pelo Google.`,
      400,
      model,
      rawCode || "MODEL_NOT_FOUND"
    );
  }

  // 400 - Invalid request / argument
  if (rawStatus === 400 || /INVALID_ARGUMENT/i.test(rawMessage)) {
    return new GeminiServiceError(
      "Requisição inválida para o serviço de IA.",
      400,
      model,
      rawCode || "INVALID_ARGUMENT"
    );
  }

  // 502 / 503 / 500 - Service unavailable / high demand
  if (rawStatus === 503 || rawStatus === 502 || /UNAVAILABLE|high demand/i.test(rawMessage)) {
    return new GeminiServiceError(
      "O serviço da Gemini está temporariamente indisponível ou com alta demanda. Tente novamente mais tarde.",
      503,
      model,
      rawCode || "SERVICE_UNAVAILABLE"
    );
  }

  return new GeminiServiceError(
    "Falha ao comunicar com o provedor de IA.",
    502,
    model,
    rawCode
  );
}

export async function requestQuestionsFromGemini(input: GenerateQuestionsRequest): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";

  if (!apiKey || apiKey === "sua_chave_aqui") {
    throw new GeminiServiceError(
      "GEMINI_API_KEY não configurada no servidor.",
      503,
      model,
      "AI_NOT_CONFIGURED"
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 60_000 } });
    const response = await ai.models.generateContent({
      model,
      contents: createPrompt(input),
      config: {
        responseMimeType: "application/json",
        responseSchema: questionResponseSchema
      }
    });

    if (!response.text) throw new Error("AI_INVALID_RESPONSE");
    return response.text;
  } catch (error) {
    if (error instanceof Error && error.message === "AI_INVALID_RESPONSE") throw error;
    throw parseAndClassifyGeminiError(error, model);
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
    if (candidate.disciplina !== input.disciplina || candidate.assunto !== input.assunto) {
      throw new Error("AI_INVALID_RESPONSE");
    }

    if (input.dificuldade === "Mista") {
      if (candidate.dificuldade !== "Fácil" && candidate.dificuldade !== "Média" && candidate.dificuldade !== "Difícil") {
        throw new Error("AI_INVALID_RESPONSE");
      }
    } else {
      if (candidate.dificuldade !== input.dificuldade) {
        throw new Error("AI_INVALID_RESPONSE");
      }
    }

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
      dificuldade: candidate.dificuldade as "Fácil" | "Média" | "Difícil"
    } as AIQuestion;
  });
}
