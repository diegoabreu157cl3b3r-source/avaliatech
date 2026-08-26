import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import sharp from "sharp";
import type { GenerateExamRequest, QuestaoDaProva, VersaoProva } from "@/types/exam";
import { parseDataUrl } from "@/lib/upload";
import { readQuestionImage } from "@/lib/question-image";

interface PdfHeaderData extends GenerateExamRequest { generatedAt: Date; }
interface PositionedImage { image: PDFImage; width: number; height: number; }
interface QuestionLayout { questionLines: string[]; alternativeLines: string[][]; image: PositionedImage | null; height: number; questionFontSize: number; alternativeFontSize: number; questionLineHeight: number; alternativeLineHeight: number; }
interface ColumnState { x: number; y: number; questionCount: number; }

const PAGE = { width: 595.28, height: 841.89 };
const LAYOUT = {
  margin: 42.52, footerY: 22, footerReserve: 34, columnGap: 16, columnsPerPage: 2, questionsPerColumn: 5,
  minimumQuestionFontSize: 9, standardQuestionFontSize: 10, maximumQuestionFontSize: 12, titleFontSize: 10.5, titleLineHeight: 13,
  titleToText: 4, textToImage: 4, imageToAlternatives: 4, questionGap: 10,
  imageMaxWidth: 135, imageMaxHeight: 90, imageHorizontalPadding: 8,
};
const TEXT_COLOR = rgb(.1, .12, .16);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" "); const lines: string[] = []; let current = "";
  for (const word of words) { const next = current ? `${current} ${word}` : word; if (!current || font.widthOfTextAtSize(next, size) <= maxWidth) current = next; else { lines.push(current); current = word; } }
  if (current) lines.push(current); return lines.length ? lines : [""];
}

function drawTextLines(page: PDFPage, font: PDFFont, lines: string[], x: number, y: number, size: number, lineHeight: number) {
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * lineHeight, size, font, color: TEXT_COLOR }));
  return y - lines.length * lineHeight;
}

export function calculateImageHeight(image: PDFImage | null, columnWidth: number): PositionedImage | null {
  if (!image) return null;
  const maxWidth = Math.min(LAYOUT.imageMaxWidth, columnWidth - LAYOUT.imageHorizontalPadding * 2);
  const scale = Math.min(1, maxWidth / image.width, LAYOUT.imageMaxHeight / image.height);
  return { image, width: image.width * scale, height: image.height * scale };
}

export function calculateQuestionHeight(questionLines: string[], alternativeLines: string[][], image: PositionedImage | null, questionLineHeight: number, alternativeLineHeight: number) {
  const alternatives = alternativeLines.reduce((total, lines) => total + lines.length * alternativeLineHeight, 0);
  return LAYOUT.titleLineHeight + LAYOUT.titleToText + questionLines.length * questionLineHeight
    + LAYOUT.textToImage + (image ? image.height + LAYOUT.imageToAlternatives : 0) + alternatives + LAYOUT.questionGap;
}

async function embedQuestionImage(pdfDoc: PDFDocument, path: string | null | undefined, columnWidth: number) {
  const bytes = await readQuestionImage(path); if (!bytes || !path) return null;
  try {
    const extension = path.split(".").pop()?.toLowerCase();
    const image = extension === "png" ? await pdfDoc.embedPng(bytes)
      : extension === "webp" ? await pdfDoc.embedPng(await sharp(bytes).png().toBuffer())
      : await pdfDoc.embedJpg(bytes);
    return calculateImageHeight(image, columnWidth);
  } catch { return null; }
}

export function drawImage(page: PDFPage, image: PositionedImage, columnX: number, columnWidth: number, y: number) {
  const x = columnX + (columnWidth - image.width) / 2;
  page.drawImage(image.image, { x, y: y - image.height, width: image.width, height: image.height });
  return y - image.height;
}

export function drawAlternatives(page: PDFPage, font: PDFFont, alternatives: string[][], x: number, y: number, size: number, lineHeight: number) {
  let cursor = y; alternatives.forEach((lines) => { cursor = drawTextLines(page, font, lines, x, cursor, size, lineHeight); }); return cursor;
}

export async function drawHeader(pdfDoc: PDFDocument, page: PDFPage, header: PdfHeaderData, title: string) {
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica); const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); const top = PAGE.height - LAYOUT.margin;
  page.drawRectangle({ x: LAYOUT.margin, y: top - 92, width: PAGE.width - LAYOUT.margin * 2, height: 92, color: rgb(.94, .98, 1), borderColor: rgb(.72, .84, .92), borderWidth: .8 });
  const logo = parseDataUrl(header.logoBase64);
  if (logo) { try { const image = logo.mime === "image/png" ? await pdfDoc.embedPng(logo.bytes) : await pdfDoc.embedJpg(logo.bytes); const scale = Math.min(58 / image.width, 58 / image.height); page.drawImage(image, { x: LAYOUT.margin + 12, y: top - 72, width: image.width * scale, height: image.height * scale }); } catch { page.drawText("LOGO", { x: LAYOUT.margin + 25, y: top - 43, size: 8, font: bold }); } } else page.drawText("LOGO", { x: LAYOUT.margin + 25, y: top - 43, size: 8, font: bold });
  page.drawText(title, { x: LAYOUT.margin + 82, y: top - 22, size: 13, font: bold, color: rgb(.03, .19, .34) });
  page.drawText(`Escola: ${header.escola}`, { x: LAYOUT.margin + 82, y: top - 39, size: 9, font: regular }); page.drawText(`Professor(a): ${header.professor}`, { x: LAYOUT.margin + 82, y: top - 54, size: 9, font: regular }); page.drawText(`Disciplina: ${header.disciplina}`, { x: LAYOUT.margin + 82, y: top - 69, size: 9, font: regular }); page.drawText(`Data: ${header.dataProva}   Valor: ${header.valorAvaliacao}`, { x: LAYOUT.margin + 82, y: top - 84, size: 9, font: regular });
  const fieldY = top - 112; page.drawText("Nome:", { x: LAYOUT.margin, y: fieldY, size: 8.5, font: bold }); page.drawLine({ start: { x: LAYOUT.margin + 34, y: fieldY - 1 }, end: { x: LAYOUT.margin + 235, y: fieldY - 1 }, thickness: .5 }); page.drawText("Escola:", { x: LAYOUT.margin + 248, y: fieldY, size: 8.5, font: bold }); page.drawLine({ start: { x: LAYOUT.margin + 288, y: fieldY - 1 }, end: { x: LAYOUT.margin + 430, y: fieldY - 1 }, thickness: .5 }); page.drawText("Turma:", { x: LAYOUT.margin + 443, y: fieldY, size: 8.5, font: bold }); page.drawLine({ start: { x: LAYOUT.margin + 480, y: fieldY - 1 }, end: { x: PAGE.width - LAYOUT.margin, y: fieldY - 1 }, thickness: .5 });
  return fieldY - 20;
}

function drawFooter(page: PDFPage, font: PDFFont, version: string) { page.drawText(`AvaliaTech • Versão ${version}`, { x: LAYOUT.margin, y: LAYOUT.footerY, size: 7, font, color: rgb(.4, .45, .5) }); }
function formatQuestionValue(value: string, count: number) { const numeric = Number(value.replace(/[^0-9,.-]/g, "").replace(".", "").replace(",", ".")); return Number.isFinite(numeric) && numeric > 0 ? `${(numeric / count).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} pt` : "valor"; }

function preferredFontSize(question: QuestaoDaProva) {
  const textLength = question.pergunta.length + question.alternativas.reduce((total, alternative) => total + alternative.texto.length, 0);
  if (textLength <= 220) return LAYOUT.maximumQuestionFontSize;
  if (textLength <= 620) return LAYOUT.standardQuestionFontSize;
  return LAYOUT.minimumQuestionFontSize;
}

async function createQuestionLayout(pdfDoc: PDFDocument, question: QuestaoDaProva, regular: PDFFont, columnWidth: number, questionFontSize: number): Promise<QuestionLayout> {
  const alternativeFontSize = Math.max(LAYOUT.minimumQuestionFontSize, questionFontSize - .5);
  const questionLineHeight = questionFontSize * 1.2;
  const alternativeLineHeight = alternativeFontSize * 1.16;
  const questionLines = wrapText(question.pergunta, regular, questionFontSize, columnWidth);
  const alternativeLines = question.alternativas.map((alternative) => wrapText(`${alternative.letra}) ${alternative.texto}`, regular, alternativeFontSize, columnWidth - 10));
  const image = await embedQuestionImage(pdfDoc, question.imagem, columnWidth);
  return { questionLines, alternativeLines, image, questionFontSize, alternativeFontSize, questionLineHeight, alternativeLineHeight, height: calculateQuestionHeight(questionLines, alternativeLines, image, questionLineHeight, alternativeLineHeight) };
}

async function createColumnLayouts(pdfDoc: PDFDocument, questions: QuestaoDaProva[], regular: PDFFont, columnWidth: number, availableHeight: number) {
  const fontSizes = questions.map(preferredFontSize);
  let layouts = await Promise.all(questions.map((question, index) => createQuestionLayout(pdfDoc, question, regular, columnWidth, fontSizes[index])));
  while (layouts.reduce((total, layout) => total + layout.height, 0) > availableHeight) {
    const candidate = layouts.map((layout, index) => ({ index, height: layout.height })).filter(({ index }) => fontSizes[index] > LAYOUT.minimumQuestionFontSize).sort((a, b) => b.height - a.height)[0];
    if (!candidate) break;
    fontSizes[candidate.index] -= 1;
    layouts[candidate.index] = await createQuestionLayout(pdfDoc, questions[candidate.index], regular, columnWidth, fontSizes[candidate.index]);
  }
  return layouts;
}

export function drawQuestion(page: PDFPage, layout: QuestionLayout, number: number, value: string, column: ColumnState, columnWidth: number, bold: PDFFont, regular: PDFFont) {
  let y = column.y; y = drawTextLines(page, bold, [`QUESTÃO ${String(number).padStart(2, "0")} (${value})`], column.x, y, LAYOUT.titleFontSize, LAYOUT.titleLineHeight) - LAYOUT.titleToText;
  y = drawTextLines(page, regular, layout.questionLines, column.x, y, layout.questionFontSize, layout.questionLineHeight) - LAYOUT.textToImage;
  if (layout.image) y = drawImage(page, layout.image, column.x, columnWidth, y) - LAYOUT.imageToAlternatives;
  y = drawAlternatives(page, regular, layout.alternativeLines, column.x + 10, y, layout.alternativeFontSize, layout.alternativeLineHeight); column.y = y - LAYOUT.questionGap; column.questionCount += 1;
}

async function drawExamPage(pdfDoc: PDFDocument, version: VersaoProva, header: PdfHeaderData) {
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica); const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); const title = `Avaliação - Versão ${version.versao}`;
  const columnWidth = (PAGE.width - LAYOUT.margin * 2 - LAYOUT.columnGap) / LAYOUT.columnsPerPage;
  const questionsPerPage = LAYOUT.questionsPerColumn * LAYOUT.columnsPerPage;
  for (let pageOffset = 0; pageOffset < version.questoes.length; pageOffset += questionsPerPage) {
    const page = pdfDoc.addPage([PAGE.width, PAGE.height]); const bodyTop = await drawHeader(pdfDoc, page, header, title);
    const availableHeight = bodyTop - (LAYOUT.margin + LAYOUT.footerReserve);
    const pageQuestions = version.questoes.slice(pageOffset, pageOffset + questionsPerPage);
    const leftQuestions = pageQuestions.slice(0, LAYOUT.questionsPerColumn);
    const rightQuestions = pageQuestions.slice(LAYOUT.questionsPerColumn);
    const columns: ColumnState[] = [{ x: LAYOUT.margin, y: bodyTop, questionCount: 0 }, { x: LAYOUT.margin + columnWidth + LAYOUT.columnGap, y: bodyTop, questionCount: 0 }];
    const layoutsByColumn = await Promise.all([createColumnLayouts(pdfDoc, leftQuestions, regular, columnWidth, availableHeight), createColumnLayouts(pdfDoc, rightQuestions, regular, columnWidth, availableHeight)]);
    for (let columnIndex = 0; columnIndex < LAYOUT.columnsPerPage; columnIndex++) {
      layoutsByColumn[columnIndex].forEach((layout, questionIndex) => drawQuestion(page, layout, pageOffset + columnIndex * LAYOUT.questionsPerColumn + questionIndex + 1, formatQuestionValue(header.valorAvaliacao, version.questoes.length), columns[columnIndex], columnWidth, bold, regular));
    }
    drawFooter(page, regular, version.versao);
  }
}

async function drawAnswerKeyPage(pdfDoc: PDFDocument, version: VersaoProva, header: PdfHeaderData) {
  const page = pdfDoc.addPage([PAGE.width, PAGE.height]); const regular = await pdfDoc.embedFont(StandardFonts.Helvetica); const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); let y = await drawHeader(pdfDoc, page, header, `Gabarito - Versão ${version.versao}`);
  page.drawText("Questão", { x: LAYOUT.margin, y, size: 10, font: bold, color: rgb(.03, .19, .34) }); page.drawText("Resposta", { x: LAYOUT.margin + 90, y, size: 10, font: bold, color: rgb(.03, .19, .34) }); page.drawText("Questão", { x: LAYOUT.margin + 220, y, size: 10, font: bold, color: rgb(.03, .19, .34) }); page.drawText("Resposta", { x: LAYOUT.margin + 310, y, size: 10, font: bold, color: rgb(.03, .19, .34) }); y -= 16;
  const middle = Math.ceil(version.questoes.length / 2); const left = version.questoes.slice(0, middle); const right = version.questoes.slice(middle);
  for (let index = 0; index < middle; index++) { const rowY = y - index * 18; const rowColor = index % 2 === 0 ? rgb(.98, .99, 1) : rgb(.94, .97, .99); page.drawRectangle({ x: LAYOUT.margin, y: rowY - 5, width: 180, height: 14, color: rowColor }); page.drawText(String(index + 1).padStart(2, "0"), { x: LAYOUT.margin + 8, y: rowY, size: 9, font: regular }); page.drawText(left[index].corretaFinal, { x: LAYOUT.margin + 112, y: rowY, size: 9, font: bold }); if (right[index]) { page.drawRectangle({ x: LAYOUT.margin + 220, y: rowY - 5, width: 180, height: 14, color: rowColor }); page.drawText(String(index + 1 + middle).padStart(2, "0"), { x: LAYOUT.margin + 228, y: rowY, size: 9, font: regular }); page.drawText(right[index].corretaFinal, { x: LAYOUT.margin + 332, y: rowY, size: 9, font: bold }); } }
  page.drawText(`Gerado automaticamente em ${header.generatedAt.toLocaleDateString("pt-BR")}.`, { x: LAYOUT.margin, y: 40, size: 8, font: regular, color: rgb(.35, .4, .45) });
}

export async function createExamPdf(header: GenerateExamRequest, versionA: VersaoProva, versionB: VersaoProva) { const pdfDoc = await PDFDocument.create(); const headerData: PdfHeaderData = { ...header, generatedAt: new Date() }; pdfDoc.setTitle(`Avaliação ${header.disciplina}`); pdfDoc.setAuthor("AvaliaTech"); await drawExamPage(pdfDoc, versionA, headerData); await drawAnswerKeyPage(pdfDoc, versionA, headerData); await drawExamPage(pdfDoc, versionB, headerData); await drawAnswerKeyPage(pdfDoc, versionB, headerData); return pdfDoc.save(); }
