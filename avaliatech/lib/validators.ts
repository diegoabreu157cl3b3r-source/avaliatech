import { z } from "zod";
import { CORRETAS, DIFICULDADES, DIFICULDADES_IA, QUANTIDADES_PROVA } from "@/lib/constants";

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
  imagem: z.string().max(255).nullable().optional(),
  alternativa_a: z.string().min(1, "Informe a alternativa A."),
  alternativa_b: z.string().min(1, "Informe a alternativa B."),
  alternativa_c: z.string().min(1, "Informe a alternativa C."),
  alternativa_d: z.string().min(1, "Informe a alternativa D."),
  correta: z.enum(CORRETAS),
  disciplina: z.string().min(2, "Informe a disciplina."),
  assunto: z.string().min(2, "Informe o assunto."),
  dificuldade: z.enum(DIFICULDADES)
});

export const generateQuestionsSchema = z.object({
  disciplina: z.string().trim().min(2, "Informe a disciplina.").max(120),
  assunto: z.string().trim().min(2, "Informe o assunto.").max(120),
  dificuldade: z.enum(DIFICULDADES_IA),
  quantidade: z.coerce.number().pipe(
    z.union([z.literal(1), z.literal(5), z.literal(10), z.literal(15), z.literal(20)], {
      errorMap: () => ({ message: "A quantidade deve ser 1, 5, 10, 15 ou 20." })
    })
  ),
  descricao: z.string().max(1000, "A descrição deve ter no máximo 1000 caracteres.").optional().nullable()
});

export const generateExamSchema = z.object({
  escola: z.string().min(2, "Informe a escola."),
  professor: z.string().min(2, "Informe o professor."),
  disciplina: z.string().min(2, "Informe a disciplina."),
  assuntos: z.array(z.string().trim().min(2, "Informe um assunto.").max(120)).min(1, "Selecione pelo menos um assunto.").max(20),
  dificuldade: z.string().min(1, "Informe a dificuldade."),
  modoDificuldade: z.enum(["unica", "automatica", "personalizada"]).optional().default("unica"),
  distribuicao: z
    .object({
      facil: z.coerce.number().int().min(0, "A quantidade de questões fáceis não pode ser negativa."),
      media: z.coerce.number().int().min(0, "A quantidade de questões médias não pode ser negativa."),
      dificil: z.coerce.number().int().min(0, "A quantidade de questões difíceis não pode ser negativa.")
    })
    .optional()
    .nullable(),
  quantidadeQuestoes: z.coerce.number().refine((value) => QUANTIDADES_PROVA.includes(value as 10 | 15 | 20 | 25), {
    message: "A quantidade deve ser 10, 15, 20 ou 25."
  }),
  dataProva: z.string().min(8, "Informe a data da prova."),
  valorAvaliacao: z.string().min(1, "Informe o valor da avaliação."),
  logoBase64: z.string().optional().nullable(),
  logoMime: z.enum(["image/png", "image/jpeg"]).optional().nullable()
}).refine(
  (data) => {
    if (data.modoDificuldade === "personalizada") {
      if (!data.distribuicao) return false;
      const sum = data.distribuicao.facil + data.distribuicao.media + data.distribuicao.dificil;
      return sum === data.quantidadeQuestoes;
    }
    return true;
  },
  (data) => {
    const sum = data.distribuicao ? data.distribuicao.facil + data.distribuicao.media + data.distribuicao.dificil : 0;
    return {
      message: `Você selecionou ${data.quantidadeQuestoes} questões, mas a distribuição atual totaliza ${sum}.`,
      path: ["distribuicao"]
    };
  }
);

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
