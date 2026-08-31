import { requireAuth } from "@/lib/auth";
import { fail, handleApiError, ok, validationFail } from "@/lib/response";
import { generateQuestionsSchema } from "@/lib/validators";
import { parseAndValidateAIQuestions, requestQuestionsFromOllama } from "@/services/ai-service";

export async function POST(request: Request) {
  try {
    await requireAuth();
    const parsed = generateQuestionsSchema.safeParse(await request.json());
    if (!parsed.success) return validationFail(parsed.error);

    const raw = await requestQuestionsFromOllama(parsed.data);
    const questions = parseAndValidateAIQuestions(raw, parsed.data);
    return ok({ questions });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
      if (error.message === "AI_NOT_CONFIGURED") return fail("A geração por IA ainda não foi configurada no servidor.", 503);
      if (error.message === "AI_MODEL_NOT_FOUND") return fail("O modelo de IA configurado não foi encontrado.", 503);
      if (error.message === "AI_TIMEOUT" || error.message === "AI_UNAVAILABLE") return fail("Não foi possível gerar as questões. Verifique se o serviço de IA está disponível.", 503);
      if (error.message === "AI_INVALID_RESPONSE") return fail("A IA retornou um formato inválido. Tente gerar as questões novamente.", 422);
    }
    return handleApiError(error);
  }
}
