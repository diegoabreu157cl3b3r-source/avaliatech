import type { AlternativaCorreta, Dificuldade, Questao } from "@/types/question";

export type ModoDificuldade = "unica" | "automatica" | "personalizada";

export interface DistribuicaoDificuldade {
  facil: number;
  media: number;
  dificil: number;
}

export interface Prova {
  id: number;
  usuario_id: number;
  escola: string;
  professor: string;
  disciplina: string;
  assunto: string;
  dificuldade: string;
  quantidade_questoes: number;
  versao: string;
  data_prova: string | null;
  valor_avaliacao: string | null;
  dados_json?: string | null;
  data_geracao: string;
  created_at: string;
}

export interface GenerateExamRequest {
  escola: string;
  professor: string;
  disciplina: string;
  assuntos: string[];
  dificuldade: string;
  modoDificuldade?: ModoDificuldade;
  distribuicao?: DistribuicaoDificuldade | null;
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

export interface QuestaoDaProva extends Pick<Questao, "id" | "pergunta" | "imagem" | "disciplina" | "assunto" | "dificuldade"> {
  alternativas: AlternativaEmbaralhada[];
  corretaFinal: AlternativaCorreta;
}

export interface VersaoProva {
  versao: "A" | "B";
  questoes: QuestaoDaProva[];
}

export interface ExamDataPayload {
  header: GenerateExamRequest;
  versionA: VersaoProva;
  versionB: VersaoProva;
  distribuicao?: DistribuicaoDificuldade | null;
}

export interface ExamFilters {
  search?: string;
  escola?: string;
  disciplina?: string;
  assunto?: string;
  dificuldade?: string;
  periodo?: "todos" | "7d" | "30d" | "90d";
  page?: number;
  limit?: number;
}

export interface ExamFilterOptions {
  escolas: string[];
  disciplinas: string[];
  assuntos: string[];
  dificuldades: string[];
}

