import { NextRequest } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { fail, ok } from "@/lib/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(120),
  category: z.enum([
    "Dúvida sobre a plataforma",
    "Problema técnico",
    "Sugestão de melhoria",
    "Relato de erro",
    "Outro assunto"
  ]),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(200).optional().default("")
});

const rateWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requestLog.get(ip);
  if (!current || current.resetAt <= now) {
    requestLog.set(ip, { count: 1, resetAt: now + rateWindowMs });
    return false;
  }
  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) return fail("A mensagem enviada é muito grande.", 413);

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return fail("Muitas tentativas de envio. Aguarde alguns minutos e tente novamente.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Não foi possível interpretar os dados enviados.", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Confira os campos do formulário e tente novamente.", 422, parsed.error.flatten().fieldErrors);
  }

  // Bots que preencherem o campo invisível recebem resposta genérica sem envio de e-mail.
  if (parsed.data.website.trim()) return ok(null, "Mensagem recebida.");

  const { name, email, subject, category, message } = parsed.data;
  try {
    await sendContactEmail({
      name,
      email: email.toLowerCase(),
      subject: subject.replace(/[\r\n]+/g, " "),
      category,
      message
    });
    return ok(null, "Mensagem enviada com sucesso.");
  } catch (error) {
    console.error("[contact] Falha ao enviar mensagem de contato:", error instanceof Error ? error.message : "erro desconhecido");
    if (error instanceof Error && error.message === "CONTACT_EMAIL_NOT_CONFIGURED") {
      return fail("O canal de contato ainda não está configurado. Tente novamente mais tarde.", 503);
    }
    return fail("Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.", 502);
  }
}
