import type { AlternativaCorreta, Questao } from "@/types/question";
import type { DistribuicaoDificuldade, QuestaoDaProva, VersaoProva } from "@/types/exam";

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

/**
 * Calcula balanceamento equilibrado (~30% Fácil, 50% Média, 20% Difícil)
 * para 10, 15, 20 e 25 questões, garantindo que a soma seja exata.
 */
export function calculateAutoDistribution(totalQuantity: number): DistribuicaoDificuldade {
  switch (totalQuantity) {
    case 10:
      return { facil: 3, media: 5, dificil: 2 };
    case 15:
      return { facil: 4, media: 8, dificil: 3 };
    case 20:
      return { facil: 6, media: 10, dificil: 4 };
    case 25:
      return { facil: 7, media: 13, dificil: 5 };
    default: {
      const facil = Math.round(totalQuantity * 0.3);
      const dificil = Math.round(totalQuantity * 0.2);
      const media = totalQuantity - facil - dificil;
      return { facil, media, dificil };
    }
  }
}

export function selectQuestionsByDistribution(
  allQuestions: Questao[],
  distribution: DistribuicaoDificuldade
): Questao[] {
  const easy = allQuestions.filter((q) => q.dificuldade === "Fácil");
  const medium = allQuestions.filter((q) => q.dificuldade === "Média");
  const hard = allQuestions.filter((q) => q.dificuldade === "Difícil");

  const selectedEasy = selectRandomQuestions(easy, distribution.facil);
  const selectedMedium = selectRandomQuestions(medium, distribution.media);
  const selectedHard = selectRandomQuestions(hard, distribution.dificil);

  // Combina e embaralha levemente para a prova ter uma mesclagem agradável de dificuldades
  return shuffleArray([...selectedEasy, ...selectedMedium, ...selectedHard]);
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

