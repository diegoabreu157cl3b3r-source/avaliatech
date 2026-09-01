export type Dificuldade = "Fácil" | "Média" | "Difícil";
export type AlternativaCorreta = "A" | "B" | "C" | "D";

export interface Questao {
  id: number;
  usuario_id: number;
  pergunta: string;
  imagem: string | null;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  correta: AlternativaCorreta;
  disciplina: string;
  assunto: string;
  dificuldade: Dificuldade;
  created_at: string;
  updated_at: string;
}

export interface QuestaoFormData {
  pergunta: string;
  imagem?: string | null;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  correta: AlternativaCorreta;
  disciplina: string;
  assunto: string;
  dificuldade: Dificuldade;
}

export interface QuestaoFilters {
  page?: number;
  limit?: number;
  search?: string;
  disciplina?: string;
  assunto?: string;
  dificuldade?: string;
}

export interface AIQuestion extends Omit<QuestaoFormData, "imagem"> {}

export interface GenerateQuestionsRequest {
  disciplina: string;
  assunto: string;
  dificuldade: Dificuldade;
  quantidade: 1 | 5 | 10 | 15 | 20;
  descricao?: string | null;
}

export interface GenerateQuestionsResponse {
  questions: AIQuestion[];
}
