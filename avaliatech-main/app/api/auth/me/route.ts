import { getCurrentUser } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Usuário não autenticado.", 401);
    return ok({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
