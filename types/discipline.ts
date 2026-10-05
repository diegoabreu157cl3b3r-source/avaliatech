export interface Disciplina {
  id: number;
  usuario_id: number;
  nome: string;
  total_assuntos?: number;
  total_questoes?: number;
  assuntos?: Assunto[];
  created_at: string;
  updated_at: string;
}

export interface Assunto {
  id: number;
  disciplina_id: number;
  usuario_id: number;
  nome: string;
  total_questoes?: number;
  created_at: string;
  updated_at: string;
}

export interface DisciplinaWithAssuntos extends Disciplina {
  assuntos: Assunto[];
}

export interface CreateDisciplinaInput {
  nome: string;
}

export interface UpdateDisciplinaInput {
  nome: string;
}

export interface CreateAssuntoInput {
  nome: string;
}

export interface UpdateAssuntoInput {
  nome: string;
}

