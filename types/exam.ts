import type { AlternativaCorreta, Dificuldade, Questao } from "@/types/question";

export interface Prova {
  id: number;
  usuario_id: number;
  escola: string;
  professor: string;
  disciplina: string;
  assunto: string;
  dificuldade: Dificuldade;
  quantidade_questoes: number;
  versao: string;
  data_prova: string | null;
  valor_avaliacao: string | null;
  data_geracao: string;
  created_at: string;
}

export interface GenerateExamRequest {
  escola: string;
  professor: string;
  disciplina: string;
  assunto: string;
  dificuldade: Dificuldade;
  quantidadeQuestoes: 10 | 15 | 20 | 25;
  dataProva: string;
  valorAvaliacao: string;
  logoBase64?: string | null;
  logoMime?: "image/png" | "image/jpeg" | null;
}

export interface AlternativaEmbaralhada {
  letra: AlternativaCorreta;
  texto: string;
  original: AlternativaCorreta;
}

export interface QuestaoDaProva extends Pick<Questao, "id" | "pergunta" | "disciplina" | "assunto" | "dificuldade"> {
  alternativas: AlternativaEmbaralhada[];
  corretaFinal: AlternativaCorreta;
}

export interface VersaoProva {
  versao: "A" | "B";
  questoes: QuestaoDaProva[];
}
