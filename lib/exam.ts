import type { AlternativaCorreta, Questao } from "@/types/question";
import type { QuestaoDaProva, VersaoProva } from "@/types/exam";

const letras: AlternativaCorreta[] = ["A", "B", "C", "D"];

export function shuffleArray<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function selectRandomQuestions(questions: Questao[], quantity: number) {
  return shuffleArray(questions).slice(0, quantity);
}

export function buildQuestionForExam(question: Questao): QuestaoDaProva {
  const alternatives = [
    { letra: "A" as const, texto: question.alternativa_a, original: "A" as const },
    { letra: "B" as const, texto: question.alternativa_b, original: "B" as const },
    { letra: "C" as const, texto: question.alternativa_c, original: "C" as const },
    { letra: "D" as const, texto: question.alternativa_d, original: "D" as const }
  ];

  const shuffled = shuffleArray(alternatives).map((alternative, index) => ({
    ...alternative,
    letra: letras[index]
  }));

  const correct = shuffled.find((alternative) => alternative.original === question.correta);

  if (!correct) {
    throw new Error(`Não foi possível recalcular o gabarito da questão ${question.id}`);
  }

  return {
    id: question.id,
    pergunta: question.pergunta,
    imagem: question.imagem,
    disciplina: question.disciplina,
    assunto: question.assunto,
    dificuldade: question.dificuldade,
    alternativas: shuffled,
    corretaFinal: correct.letra
  };
}

export function buildExamVersions(selectedQuestions: Questao[]) {
  const versionA: VersaoProva = {
    versao: "A",
    questoes: selectedQuestions.map(buildQuestionForExam)
  };

  const versionB: VersaoProva = {
    versao: "B",
    questoes: shuffleArray(selectedQuestions).map(buildQuestionForExam)
  };

  return { versionA, versionB };
}
