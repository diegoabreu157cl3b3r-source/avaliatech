import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import { generateQuestionsSchema } from "@/lib/validators";
import { cleanOptionalText, cleanText } from "@/lib/sanitizers";
import { GeminiServiceError, parseAndValidateAIQuestions, requestQuestionsFromGemini } from "@/services/ai-service";
import type { GenerateQuestionsRequest } from "@/types/question";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAuth();
    const parsed = generateQuestionsSchema.safeParse(await request.json());
    if (!parsed.success) return validationFail(parsed.error);

    const sanitizedData: GenerateQuestionsRequest = {
      disciplina: cleanText(parsed.data.disciplina),
      assunto: cleanText(parsed.data.assunto),
      dificuldade: parsed.data.dificuldade,
      quantidade: parsed.data.quantidade as 1 | 5 | 10 | 15 | 20,
      descricao: cleanOptionalText(parsed.data.descricao) || undefined
    };

    const raw = await requestQuestionsFromGemini(sanitizedData);
    const questions = parseAndValidateAIQuestions(raw, sanitizedData);
    return ok({ questions });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Usuário não autenticado.", 401);
    }

    if (error instanceof GeminiServiceError) {
      return fail(error.message, error.statusCode);
    }

    if (error instanceof Error && error.message.startsWith("AI_INVALID_RESPONSE")) {
      return fail("A IA retornou um formato inválido. Tente gerar as questões novamente.", 422);
    }

    return handleApiError(error);
  }
}
