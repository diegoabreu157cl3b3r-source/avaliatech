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

export function formatExamDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  const matchIso = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchIso) {
    const [, year, month, day] = matchIso;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  const matchBr = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchBr) {
    const [, day, month, year] = matchBr;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  return trimmed;
}

function drawLabelValue(
  page: PDFPage,
  boldFont: PDFFont,
  regularFont: PDFFont,
  label: string,
  value: string,
  x: number,
  y: number,
  size = 8.5,
  color = TEXT_COLOR
) {
  page.drawText(label, { x, y, size, font: boldFont, color: rgb(0.08, 0.15, 0.25) });
  const labelWidth = boldFont.widthOfTextAtSize(label, size);
  page.drawText(` ${value}`, { x: x + labelWidth, y, size, font: regularFont, color });
}

export async function drawHeader(pdfDoc: PDFDocument, page: PDFPage, header: PdfHeaderData, title: string) {
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const top = PAGE.height - LAYOUT.margin;
  const boxHeight = 90;
  const boxWidth = PAGE.width - LAYOUT.margin * 2;
  const boxY = top - boxHeight;

  // Header background card
  page.drawRectangle({
    x: LAYOUT.margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.95, 0.98, 1),
    borderColor: rgb(0.72, 0.84, 0.92),
    borderWidth: 0.8
  });

  // Logo handling & vertical centering
  const logoMaxW = 64;
  const logoMaxH = 64;
  const logoAreaW = 76;
  const logo = parseDataUrl(header.logoBase64);

  if (logo) {
    try {
      const image = logo.mime === "image/png" ? await pdfDoc.embedPng(logo.bytes) : await pdfDoc.embedJpg(logo.bytes);
      const scale = Math.min(logoMaxW / image.width, logoMaxH / image.height, 1);
      const w = image.width * scale;
      const h = image.height * scale;
      const imgX = LAYOUT.margin + (logoAreaW - w) / 2 + 2;
      const imgY = boxY + (boxHeight - h) / 2;
      page.drawImage(image, { x: imgX, y: imgY, width: w, height: h });
    } catch {
      page.drawText("LOGO", { x: LAYOUT.margin + 26, y: boxY + boxHeight / 2 - 4, size: 9, font: bold, color: rgb(0.4, 0.5, 0.6) });
    }
  } else {
    page.drawText("LOGO", { x: LAYOUT.margin + 26, y: boxY + boxHeight / 2 - 4, size: 9, font: bold, color: rgb(0.4, 0.5, 0.6) });
  }

  // Vertical separator between logo and info
  page.drawLine({
    start: { x: LAYOUT.margin + logoAreaW + 6, y: top - 10 },
    end: { x: LAYOUT.margin + logoAreaW + 6, y: boxY + 10 },
    thickness: 0.5,
    color: rgb(0.78, 0.86, 0.92)
  });

  const textStartX = LAYOUT.margin + logoAreaW + 18;
  const col2X = LAYOUT.margin + 295;

  // Title
  page.drawText(title, {
    x: textStartX,
    y: top - 20,
    size: 12.5,
    font: bold,
    color: rgb(0.03, 0.19, 0.34)
  });

  // Line 1: Escola (spans across)
  drawLabelValue(page, bold, regular, "Escola:", header.escola, textStartX, top - 37);

  // Line 2: Professor(a) (Col 1) | Disciplina (Col 2)
  drawLabelValue(page, bold, regular, "Professor(a):", header.professor, textStartX, top - 53);
  drawLabelValue(page, bold, regular, "Disciplina:", header.disciplina, col2X, top - 53);

  // Line 3: Data (Col 1) | Valor (Col 2)
  drawLabelValue(page, bold, regular, "Data:", formatExamDate(header.dataProva), textStartX, top - 69);
  drawLabelValue(page, bold, regular, "Valor:", header.valorAvaliacao, col2X, top - 69);

  // Student Fill-in Fields below the box
  const fieldY = boxY - 18;
  page.drawText("Nome:", { x: LAYOUT.margin, y: fieldY, size: 8.5, font: bold, color: TEXT_COLOR });
  page.drawLine({
    start: { x: LAYOUT.margin + 34, y: fieldY - 1 },
    end: { x: LAYOUT.margin + 240, y: fieldY - 1 },
    thickness: 0.5,
    color: rgb(0.4, 0.45, 0.5)
  });

  page.drawText("Escola:", { x: LAYOUT.margin + 252, y: fieldY, size: 8.5, font: bold, color: TEXT_COLOR });
  page.drawLine({
    start: { x: LAYOUT.margin + 292, y: fieldY - 1 },
    end: { x: LAYOUT.margin + 420, y: fieldY - 1 },
    thickness: 0.5,
    color: rgb(0.4, 0.45, 0.5)
  });

  page.drawText("Turma:", { x: LAYOUT.margin + 432, y: fieldY, size: 8.5, font: bold, color: TEXT_COLOR });
  page.drawLine({
    start: { x: LAYOUT.margin + 468, y: fieldY - 1 },
    end: { x: PAGE.width - LAYOUT.margin, y: fieldY - 1 },
    thickness: 0.5,
    color: rgb(0.4, 0.45, 0.5)
  });

  return fieldY - 18;
}

export async function drawSubsequentHeader(
  pdfDoc: PDFDocument,
  page: PDFPage,
  header: PdfHeaderData,
  version: string,
  pageIndex: number,
  totalPages: number
) {
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const top = PAGE.height - LAYOUT.margin;

  page.drawText(`AvaliaTech — Prova Versão ${version}`, {
    x: LAYOUT.margin,
    y: top - 10,
    size: 10,
    font: bold,
    color: rgb(0.03, 0.19, 0.34)
  });

  page.drawText(`${header.disciplina} • ${header.escola}`, {
    x: LAYOUT.margin + 175,
    y: top - 10,
    size: 8.5,
    font: regular,
    color: rgb(0.35, 0.4, 0.45)
  });

  const pageLabel = `Página ${pageIndex} de ${totalPages}`;
  const pageLabelWidth = regular.widthOfTextAtSize(pageLabel, 8.5);
  page.drawText(pageLabel, {
    x: PAGE.width - LAYOUT.margin - pageLabelWidth,
    y: top - 10,
    size: 8.5,
    font: regular,
    color: rgb(0.35, 0.4, 0.45)
  });

  page.drawLine({
    start: { x: LAYOUT.margin, y: top - 18 },
    end: { x: PAGE.width - LAYOUT.margin, y: top - 18 },
    thickness: 0.6,
    color: rgb(0.72, 0.84, 0.92)
  });

  return top - 32;
}

function drawFooter(page: PDFPage, font: PDFFont, version: string, pageIndex?: number, totalPages?: number) {
  const text = pageIndex && totalPages
    ? `AvaliaTech • Versão ${version} • Página ${pageIndex} de ${totalPages}`
    : `AvaliaTech • Versão ${version}`;
  page.drawText(text, {
    x: LAYOUT.margin,
    y: LAYOUT.footerY,
    size: 7,
    font,
    color: rgb(0.4, 0.45, 0.5)
  });
}
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
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const title = `Avaliação - Versão ${version.versao}`;
  const columnWidth = (PAGE.width - LAYOUT.margin * 2 - LAYOUT.columnGap) / LAYOUT.columnsPerPage;
  const questionsPerPage = LAYOUT.questionsPerColumn * LAYOUT.columnsPerPage;
  const totalPagesInVersion = Math.ceil(version.questoes.length / questionsPerPage);

  for (let pageOffset = 0; pageOffset < version.questoes.length; pageOffset += questionsPerPage) {
    const pageIndex = Math.floor(pageOffset / questionsPerPage) + 1;
    const isFirstPage = pageOffset === 0;
    const page = pdfDoc.addPage([PAGE.width, PAGE.height]);

    let bodyTop: number;
    if (isFirstPage) {
      bodyTop = await drawHeader(pdfDoc, page, header, title);
    } else {
      bodyTop = await drawSubsequentHeader(pdfDoc, page, header, version.versao, pageIndex, totalPagesInVersion);
    }

    const availableHeight = bodyTop - (LAYOUT.margin + LAYOUT.footerReserve);
    const pageQuestions = version.questoes.slice(pageOffset, pageOffset + questionsPerPage);
    const leftQuestions = pageQuestions.slice(0, LAYOUT.questionsPerColumn);
    const rightQuestions = pageQuestions.slice(LAYOUT.questionsPerColumn);
    const columns: ColumnState[] = [
      { x: LAYOUT.margin, y: bodyTop, questionCount: 0 },
      { x: LAYOUT.margin + columnWidth + LAYOUT.columnGap, y: bodyTop, questionCount: 0 }
    ];
    const layoutsByColumn = await Promise.all([
      createColumnLayouts(pdfDoc, leftQuestions, regular, columnWidth, availableHeight),
      createColumnLayouts(pdfDoc, rightQuestions, regular, columnWidth, availableHeight)
    ]);
    for (let columnIndex = 0; columnIndex < LAYOUT.columnsPerPage; columnIndex++) {
      layoutsByColumn[columnIndex].forEach((layout, questionIndex) =>
        drawQuestion(
          page,
          layout,
          pageOffset + columnIndex * LAYOUT.questionsPerColumn + questionIndex + 1,
          formatQuestionValue(header.valorAvaliacao, version.questoes.length),
          columns[columnIndex],
          columnWidth,
          bold,
          regular
        )
      );
    }
    drawFooter(page, regular, version.versao, pageIndex, totalPagesInVersion);
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
