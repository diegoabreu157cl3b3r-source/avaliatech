import type { ResultSetHeader } from "mysql2";
import { db, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateExamSchema } from "@/lib/validators";
import { cleanText } from "@/lib/sanitizers";
import { buildExamVersions, selectRandomQuestions } from "@/lib/exam";
import { createExamPdf } from "@/lib/pdf";
import { fail, handleApiError, validationFail } from "@/lib/response";
import { isValidLogo } from "@/lib/upload";
import type { Questao } from "@/types/question";
import type { GenerateExamRequest } from "@/types/exam";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = generateExamSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    if (!isValidLogo(parsed.data.logoBase64)) {
      return fail("A logo deve ser PNG, JPG ou JPEG e ter no máximo 2 MB.", 422);
    }

    const data: GenerateExamRequest = {
      escola: cleanText(parsed.data.escola),
      professor: cleanText(parsed.data.professor),
      disciplina: cleanText(parsed.data.disciplina),
      assunto: cleanText(parsed.data.assunto),
      dificuldade: parsed.data.dificuldade,
      quantidadeQuestoes: parsed.data.quantidadeQuestoes as 10 | 15 | 20 | 25,
      dataProva: parsed.data.dataProva,
      valorAvaliacao: cleanText(parsed.data.valorAvaliacao),
      logoBase64: parsed.data.logoBase64 ?? null,
      logoMime: parsed.data.logoMime ?? null
    };

    const compatibleQuestions = await query<Questao[]>(
      `SELECT id, usuario_id, pergunta, imagem, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
              disciplina, assunto, dificuldade, created_at, updated_at
       FROM questoes
       WHERE usuario_id = :usuarioId
         AND disciplina = :disciplina
         AND assunto = :assunto
         AND dificuldade = :dificuldade`,
      {
        usuarioId: user.id,
        disciplina: data.disciplina,
        assunto: data.assunto,
        dificuldade: data.dificuldade
      }
    );

    if (compatibleQuestions.length < data.quantidadeQuestoes) {
      return fail(
        `Questões insuficientes. Foram encontradas ${compatibleQuestions.length} questões compatíveis, mas a prova solicita ${data.quantidadeQuestoes}.`,
        422
      );
    }

    const selectedQuestions = selectRandomQuestions(compatibleQuestions, data.quantidadeQuestoes);
    const { versionA, versionB } = buildExamVersions(selectedQuestions);

    await db.execute<ResultSetHeader>(
      `INSERT INTO provas
       (usuario_id, escola, professor, disciplina, assunto, dificuldade, quantidade_questoes, versao, data_prova, valor_avaliacao, data_geracao)
       VALUES (:usuarioId, :escola, :professor, :disciplina, :assunto, :dificuldade, :quantidade, 'A/B', :dataProva, :valorAvaliacao, NOW())`,
      {
        usuarioId: user.id,
        escola: data.escola,
        professor: data.professor,
        disciplina: data.disciplina,
        assunto: data.assunto,
        dificuldade: data.dificuldade,
        quantidade: data.quantidadeQuestoes,
        dataProva: data.dataProva,
        valorAvaliacao: data.valorAvaliacao
      }
    );

    const pdfBytes = await createExamPdf(data, versionA, versionB);
    const filename = `avaliatech-${data.disciplina.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
