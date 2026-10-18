import nodemailer from "nodemailer";

type MailResult = { success: true; simulated: boolean };

interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
}

interface SendExamPdfEmailParams {
  to: string;
  examTitle: string;
  school?: string;
  professor?: string;
  pdfBuffer: Buffer;
  filename: string;
}

interface SendVerificationCodeParams {
  to: string;
  name: string;
  code: string;
}

interface SendContactEmailParams {
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
}

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

const defaultFrom =
  process.env.SMTP_FROM || "AvaliaTech <noreply@avaliatech.com>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendOrSimulate(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer; contentType: string }>;
}): Promise<MailResult> {
  const transporter = getMailTransporter();
  if (!transporter) {
    console.warn(
      `[AvaliaTech e-mail simulado] SMTP não configurado. Destinatário: ${options.to}; assunto: ${options.subject}`
    );
    return { success: true, simulated: true };
  }

  await transporter.sendMail({ from: defaultFrom, ...options });
  return { success: true, simulated: false };
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(resetUrl);
  return sendOrSimulate({
    to,
    subject: "Recuperação de Senha | AvaliaTech",
    text: `Olá, ${name}!\nUse este link para redefinir sua senha (válido por 1 hora):\n${resetUrl}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px"><h1>AvaliaTech</h1><h2>Recuperação de senha</h2><p>Olá, ${safeName}!</p><p>Use o link abaixo para criar uma nova senha. Ele expira em uma hora.</p><p><a href="${safeUrl}">Redefinir minha senha</a></p></div>`,
  });
}

export async function sendEmailVerificationCode({
  to,
  name,
  code,
}: SendVerificationCodeParams) {
  const safeName = escapeHtml(name);
  return sendOrSimulate({
    to,
    subject: "Confirme seu e-mail | AvaliaTech",
    text: `Olá, ${name}!\nSeu código de confirmação é ${code}. Ele expira em 10 minutos.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px"><h1>AvaliaTech</h1><h2>Confirme seu e-mail</h2><p>Olá, ${safeName}!</p><p>Seu código de confirmação:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px">${escapeHtml(code)}</p><p>Este código expira em 10 minutos.</p></div>`,
  });
}

export async function sendExamPdfEmail({
  to,
  examTitle,
  school,
  professor,
  pdfBuffer,
  filename,
}: SendExamPdfEmailParams) {
  return sendOrSimulate({
    to,
    subject: `Avaliação em PDF: ${examTitle} | AvaliaTech`,
    text: `Segue em anexo a avaliação de ${examTitle} gerada pelo AvaliaTech.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px"><h1>AvaliaTech</h1><h2>Avaliação em PDF: ${escapeHtml(examTitle)}</h2><p>Segue em anexo a avaliação com versões A e B e respectivos gabaritos.</p>${school ? `<p><strong>Escola:</strong> ${escapeHtml(school)}</p>` : ""}${professor ? `<p><strong>Professor(a):</strong> ${escapeHtml(professor)}</p>` : ""}<p>Arquivo: ${escapeHtml(filename)}</p></div>`,
    attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
  });
}

export async function sendContactEmail({
  name,
  email,
  subject,
  category,
  message,
}: SendContactEmailParams) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const destination = process.env.CONTACT_EMAIL || process.env.SMTP_USER || email;
  return sendOrSimulate({
    to: destination,
    subject: `[AvaliaTech] ${subject || "Mensagem de contato"}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
    html: `<div style="font-family:Arial,sans-serif"><h2>Mensagem de contato do AvaliaTech</h2><p><strong>Nome:</strong> ${safeName}</p><p><strong>E-mail:</strong> ${safeEmail}</p><p><strong>Mensagem:</strong><br>${safeMessage}</p></div>`,
  });
}
