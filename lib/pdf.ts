import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { GenerateExamRequest, VersaoProva } from "@/types/exam";
import { parseDataUrl } from "@/lib/upload";

interface PdfHeaderData extends GenerateExamRequest {
  generatedAt: Date;
}

const A4 = { width: 595.28, height: 841.89 };
const margin = 36;

function wrapText(text: string, maxChars: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= maxChars) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function drawTextLines({
  page,
  font,
  text,
  x,
  y,
  size,
  lineHeight,
  color = rgb(0.1, 0.12, 0.16),
  maxChars
}: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  x: number;
  y: number;
  size: number;
  lineHeight: number;
  color?: ReturnType<typeof rgb>;
  maxChars: number;
}) {
  const lines = wrapText(text, maxChars);
  lines.forEach((line, index) => {
    page.drawText(line, { x, y: y - index * lineHeight, size, font, color });
  });
  return y - lines.length * lineHeight;
}

async function drawHeader(pdfDoc: PDFDocument, page: PDFPage, header: PdfHeaderData, title: string) {
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const top = A4.height - margin;

  page.drawRectangle({
    x: margin,
    y: top - 92,
    width: A4.width - margin * 2,
    height: 92,
    color: rgb(0.94, 0.98, 1),
    borderColor: rgb(0.72, 0.84, 0.92),
    borderWidth: 0.8
  });

  const parsedLogo = parseDataUrl(header.logoBase64);
  if (parsedLogo) {
    try {
      const image = parsedLogo.mime === "image/png"
        ? await pdfDoc.embedPng(parsedLogo.bytes)
        : await pdfDoc.embedJpg(parsedLogo.bytes);
      const maxW = 58;
      const maxH = 58;
      const scale = Math.min(maxW / image.width, maxH / image.height);
      page.drawImage(image, {
        x: margin + 12,
        y: top - 72,
        width: image.width * scale,
        height: image.height * scale
      });
    } catch {
      page.drawRectangle({ x: margin + 12, y: top - 72, width: 58, height: 58, borderColor: rgb(0.5, 0.55, 0.6), borderWidth: 0.8 });
      page.drawText("LOGO", { x: margin + 25, y: top - 43, size: 8, font: bold, color: rgb(0.3, 0.35, 0.4) });
    }
  } else {
    page.drawRectangle({ x: margin + 12, y: top - 72, width: 58, height: 58, borderColor: rgb(0.5, 0.55, 0.6), borderWidth: 0.8 });
    page.drawText("LOGO", { x: margin + 25, y: top - 43, size: 8, font: bold, color: rgb(0.3, 0.35, 0.4) });
  }

  page.drawText(title, { x: margin + 82, y: top - 22, size: 13, font: bold, color: rgb(0.03, 0.19, 0.34) });
  page.drawText(`Escola: ${header.escola}`, { x: margin + 82, y: top - 39, size: 9, font: regular });
  page.drawText(`Professor(a): ${header.professor}`, { x: margin + 82, y: top - 54, size: 9, font: regular });
  page.drawText(`Disciplina: ${header.disciplina}`, { x: margin + 82, y: top - 69, size: 9, font: regular });
  page.drawText(`Data: ${header.dataProva}   Valor: ${header.valorAvaliacao}`, { x: margin + 82, y: top - 84, size: 9, font: regular });

  const fieldY = top - 112;
  page.drawText("Nome:", { x: margin, y: fieldY, size: 8.5, font: bold });
  page.drawLine({ start: { x: margin + 34, y: fieldY - 1 }, end: { x: margin + 235, y: fieldY - 1 }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
  page.drawText("Escola:", { x: margin + 248, y: fieldY, size: 8.5, font: bold });
  page.drawLine({ start: { x: margin + 288, y: fieldY - 1 }, end: { x: margin + 430, y: fieldY - 1 }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
  page.drawText("Turma:", { x: margin + 443, y: fieldY, size: 8.5, font: bold });
  page.drawLine({ start: { x: margin + 480, y: fieldY - 1 }, end: { x: A4.width - margin, y: fieldY - 1 }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });

  return fieldY - 20;
}

async function drawExamPage(pdfDoc: PDFDocument, version: VersaoProva, header: PdfHeaderData) {
  const page = pdfDoc.addPage([A4.width, A4.height]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const title = `Avaliação - Versão ${version.versao}`;
  let y = await drawHeader(pdfDoc, page, header, title);

  const quantity = version.questoes.length;
  const questionSize = quantity > 20 ? 6.4 : quantity > 15 ? 7 : 7.5;
  const alternativeSize = quantity > 20 ? 5.8 : quantity > 15 ? 6.4 : 6.8;
  const lineHeight = quantity > 20 ? 7.2 : 8.2;
  const colGap = 18;
  const colWidth = (A4.width - margin * 2 - colGap) / 2;
  const leftX = margin;
  const rightX = margin + colWidth + colGap;
  let x = leftX;
  const startY = y;

  version.questoes.forEach((questao, index) => {
    if (y < 58 && x === leftX) {
      x = rightX;
      y = startY;
    }

    const maxChars = x === leftX ? 60 : 60;
    y = drawTextLines({
      page,
      font: bold,
      text: `${index + 1}. ${questao.pergunta}`,
      x,
      y,
      size: questionSize,
      lineHeight,
      maxChars
    }) - 2;

    questao.alternativas.forEach((alternative) => {
      y = drawTextLines({
        page,
        font: regular,
        text: `${alternative.letra}) ${alternative.texto}`,
        x: x + 8,
        y,
        size: alternativeSize,
        lineHeight,
        maxChars: maxChars - 6
      }) - 1;
    });

    y -= 3;
  });

  page.drawLine({ start: { x: A4.width / 2, y: margin }, end: { x: A4.width / 2, y: startY + 7 }, thickness: 0.3, color: rgb(0.85, 0.85, 0.85) });
  page.drawText(`AvaliaTech • Versão ${version.versao}`, { x: margin, y: 22, size: 7, font: regular, color: rgb(0.4, 0.45, 0.5) });
}

async function drawAnswerKeyPage(pdfDoc: PDFDocument, version: VersaoProva, header: PdfHeaderData) {
  const page = pdfDoc.addPage([A4.width, A4.height]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = await drawHeader(pdfDoc, page, header, `Gabarito - Versão ${version.versao}`);

  page.drawText("Questão", { x: margin, y, size: 10, font: bold, color: rgb(0.03, 0.19, 0.34) });
  page.drawText("Resposta", { x: margin + 90, y, size: 10, font: bold, color: rgb(0.03, 0.19, 0.34) });
  page.drawText("Questão", { x: margin + 220, y, size: 10, font: bold, color: rgb(0.03, 0.19, 0.34) });
  page.drawText("Resposta", { x: margin + 310, y, size: 10, font: bold, color: rgb(0.03, 0.19, 0.34) });
  y -= 16;

  const middle = Math.ceil(version.questoes.length / 2);
  const left = version.questoes.slice(0, middle);
  const right = version.questoes.slice(middle);
  const rowHeight = 18;

  for (let index = 0; index < middle; index++) {
    const leftQuestion = left[index];
    const rightQuestion = right[index];
    const rowY = y - index * rowHeight;

    page.drawRectangle({ x: margin, y: rowY - 5, width: 180, height: 14, color: index % 2 === 0 ? rgb(0.98, 0.99, 1) : rgb(0.94, 0.97, 0.99) });
    page.drawText(String(index + 1).padStart(2, "0"), { x: margin + 8, y: rowY, size: 9, font: regular });
    page.drawText(leftQuestion.corretaFinal, { x: margin + 112, y: rowY, size: 9, font: bold });

    if (rightQuestion) {
      page.drawRectangle({ x: margin + 220, y: rowY - 5, width: 180, height: 14, color: index % 2 === 0 ? rgb(0.98, 0.99, 1) : rgb(0.94, 0.97, 0.99) });
      page.drawText(String(index + 1 + middle).padStart(2, "0"), { x: margin + 228, y: rowY, size: 9, font: regular });
      page.drawText(rightQuestion.corretaFinal, { x: margin + 332, y: rowY, size: 9, font: bold });
    }
  }

  page.drawText(`Gerado automaticamente em ${header.generatedAt.toLocaleDateString("pt-BR")}.`, {
    x: margin,
    y: 40,
    size: 8,
    font: regular,
    color: rgb(0.35, 0.4, 0.45)
  });
}

export async function createExamPdf(header: GenerateExamRequest, versionA: VersaoProva, versionB: VersaoProva) {
  const pdfDoc = await PDFDocument.create();
  const headerData: PdfHeaderData = { ...header, generatedAt: new Date() };

  pdfDoc.setTitle(`Avaliação ${header.disciplina}`);
  pdfDoc.setAuthor("AvaliaTech");
  pdfDoc.setSubject("Prova gerada automaticamente com versões e gabaritos");
  pdfDoc.setCreator("AvaliaTech");

  await drawExamPage(pdfDoc, versionA, headerData);
  await drawAnswerKeyPage(pdfDoc, versionA, headerData);
  await drawExamPage(pdfDoc, versionB, headerData);
  await drawAnswerKeyPage(pdfDoc, versionB, headerData);

  return pdfDoc.save();
}
