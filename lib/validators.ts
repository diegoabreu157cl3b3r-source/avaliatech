import { z } from "zod";
import { CORRETAS, DIFICULDADES, QUANTIDADES_PROVA } from "@/lib/constants";

export const cadastroSchema = z
  .object({
    nome: z.string().min(3, "Informe pelo menos 3 caracteres."),
    email: z.string().email("Informe um e-mail válido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmarSenha: z.string().min(6, "Confirme a senha.")
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não conferem."
  });

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha.")
});

export const questionSchema = z.object({
  pergunta: z.string().min(5, "Informe a pergunta."),
  alternativa_a: z.string().min(1, "Informe a alternativa A."),
  alternativa_b: z.string().min(1, "Informe a alternativa B."),
  alternativa_c: z.string().min(1, "Informe a alternativa C."),
  alternativa_d: z.string().min(1, "Informe a alternativa D."),
  correta: z.enum(CORRETAS),
  disciplina: z.string().min(2, "Informe a disciplina."),
  assunto: z.string().min(2, "Informe o assunto."),
  dificuldade: z.enum(DIFICULDADES)
});

export const generateExamSchema = z.object({
  escola: z.string().min(2, "Informe a escola."),
  professor: z.string().min(2, "Informe o professor."),
  disciplina: z.string().min(2, "Informe a disciplina."),
  assunto: z.string().min(2, "Informe o assunto."),
  dificuldade: z.enum(DIFICULDADES),
  quantidadeQuestoes: z.coerce.number().refine((value) => QUANTIDADES_PROVA.includes(value as 10 | 15 | 20 | 25), {
    message: "A quantidade deve ser 10, 15, 20 ou 25."
  }),
  dataProva: z.string().min(8, "Informe a data da prova."),
  valorAvaliacao: z.string().min(1, "Informe o valor da avaliação."),
  logoBase64: z.string().optional().nullable(),
  logoMime: z.enum(["image/png", "image/jpeg"]).optional().nullable()
});

export const profileSchema = z.object({
  nome: z.string().min(3, "Informe pelo menos 3 caracteres."),
  email: z.string().email("Informe um e-mail válido."),
  senhaAtual: z.string().optional().or(z.literal("")),
  novaSenha: z.string().optional().or(z.literal("")),
  confirmarNovaSenha: z.string().optional().or(z.literal("")),
  logoBase64: z.string().optional().nullable(),
  logoMime: z.enum(["image/png", "image/jpeg"]).optional().nullable()
}).superRefine((data, ctx) => {
  const wantsPasswordChange = Boolean(data.senhaAtual || data.novaSenha || data.confirmarNovaSenha);
  if (!wantsPasswordChange) return;

  if (!data.senhaAtual) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["senhaAtual"], message: "Informe a senha atual." });
  }

  if (!data.novaSenha || data.novaSenha.length < 6) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["novaSenha"], message: "A nova senha deve ter pelo menos 6 caracteres." });
  }

  if (data.novaSenha !== data.confirmarNovaSenha) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmarNovaSenha"], message: "As senhas não conferem." });
  }
});
