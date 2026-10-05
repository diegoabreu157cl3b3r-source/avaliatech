import nodemailer from "nodemailer";

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

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
}

const defaultFrom = process.env.SMTP_FROM || "AvaliaTech <noreply@avaliatech.com>";

export async function sendPasswordResetEmail({ to, name, resetUrl }: SendPasswordResetEmailParams) {
  const transporter = getMailTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07131C; color: #F8FAFC; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #0D1B26; border: 1px solid #1A3042; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 800; color: #F5B82E; letter-spacing: -0.5px; }
          .title { font-size: 20px; font-weight: 700; color: #F8FAFC; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #94A3B8; margin-bottom: 24px; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { display: inline-block; background-color: #F5B82E; color: #07131C; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; }
          .footer { font-size: 12px; color: #64748B; text-align: center; margin-top: 32px; border-top: 1px solid #1A3042; pt: 16px; }
          .link-fallback { word-break: break-all; color: #F5B82E; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo">AvaliaTech</span>
          </div>
          <h1 class="title">Recuperação de Senha</h1>
          <p class="text">Olá, <strong>${name}</strong>!</p>
          <p class="text">Recebemos uma solicitação para redefinir a senha da sua conta no AvaliaTech. Para criar uma nova senha, clique no botão abaixo:</p>
          <div class="btn-container">
            <a href="${resetUrl}" class="btn" target="_blank">Redefinir Minha Senha</a>
          </div>
          <p class="text" style="font-size: 12px;">Este link é válido por <strong>1 hora</strong> e pode ser utilizado apenas uma vez. Se você não solicitou a redefinição de senha, ignore este e-mail com segurança.</p>
          <p class="text" style="font-size: 12px;">Se o botão não funcionar, copie e cole o seguinte link no seu navegador:<br><a href="${resetUrl}" class="link-fallback">${resetUrl}</a></p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AvaliaTech. Plataforma de Gestão e Geração de Avaliações.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Olá, ${name}!\n\nRecebemos uma solicitação para redefinir a senha da sua conta no AvaliaTech.\nAcesse o link abaixo para criar uma nova senha (válido por 1 hora):\n\n${resetUrl}\n\nSe você não solicitou, desconsidere esta mensagem.`;

  if (!transporter) {
    console.log(`\n========================================`);
    console.log(`[EMAIL SIMULADO (Sem SMTP configurado)]`);
    console.log(`Para: ${to}`);
    console.log(`Assunto: Recuperação de Senha — AvaliaTech`);
    console.log(`Link de recuperação: ${resetUrl}`);
    console.log(`========================================\n`);
    return { success: true, simulated: true };
  }

  await transporter.sendMail({
    from: defaultFrom,
    to,
    subject: "Recuperação de Senha — AvaliaTech",
    text,
    html
  });

  return { success: true, simulated: false };
}

export async function sendExamPdfEmail({
  to,
  examTitle,
  school,
  professor,
  pdfBuffer,
  filename
}: SendExamPdfEmailParams) {
  const transporter = getMailTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07131C; color: #F8FAFC; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #0D1B26; border: 1px solid #1A3042; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 800; color: #F5B82E; letter-spacing: -0.5px; }
          .title { font-size: 20px; font-weight: 700; color: #F8FAFC; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #94A3B8; margin-bottom: 20px; }
          .badge-box { background-color: #112433; border: 1px solid #1E3448; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .badge-row { font-size: 13px; color: #CBD5E1; margin: 6px 0; }
          .footer { font-size: 12px; color: #64748B; text-align: center; margin-top: 32px; border-top: 1px solid #1A3042; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo">AvaliaTech</span>
          </div>
          <h1 class="title">Avaliação em PDF — ${examTitle}</h1>
          <p class="text">Olá!</p>
          <p class="text">Segue em anexo a avaliação diagramada gerada pela plataforma AvaliaTech, contendo as <strong>versões A e B</strong> com gabaritos automáticos prontos para impressão.</p>
          <div class="badge-box">
            <div class="badge-row"><strong>Disciplina:</strong> ${examTitle}</div>
            ${school ? `<div class="badge-row"><strong>Instituição:</strong> ${school}</div>` : ""}
            ${professor ? `<div class="badge-row"><strong>Professor(a):</strong> ${professor}</div>` : ""}
            <div class="badge-row"><strong>Formato:</strong> PDF Diagramado (Versões A/B + Gabaritos)</div>
          </div>
          <p class="text" style="font-size: 12px;">O arquivo PDF encontra-se anexado a este e-mail (<strong>${filename}</strong>).</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AvaliaTech. Plataforma de Gestão e Geração de Avaliações.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Olá!\n\nSegue em anexo a avaliação de ${examTitle} gerada pelo AvaliaTech (Versões A/B com gabarito).\nArquivo: ${filename}`;

  if (!transporter) {
    console.log(`\n========================================`);
    console.log(`[EMAIL SIMULADO (Sem SMTP configurado)]`);
    console.log(`Para: ${to}`);
    console.log(`Assunto: Avaliação em PDF: ${examTitle} — AvaliaTech`);
    console.log(`Anexo: ${filename} (${pdfBuffer.length} bytes)`);
    console.log(`========================================\n`);
    return { success: true, simulated: true };
  }

  await transporter.sendMail({
    from: defaultFrom,
    to,
    subject: `Avaliação em PDF: ${examTitle} — AvaliaTech`,
    text,
    html,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ]
  });

  return { success: true, simulated: false };
}

