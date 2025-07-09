import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

const ACCENT_COLOR = { r: 0.98, g: 0.62, b: 0.36 }; // hsl(25 80% 65%)

export async function POST(req: NextRequest) {
  const { name, occupation, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  // Use built-in Times Roman font
  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Font sizes
  const heroSize = 79; // 64 + 15
  const nameOccSize = 48;
  const bodySize = 36;

  // Layout
  let y = 780;
  // Hello.
  page.drawText('Hello.', {
    x: 40, y,
    size: heroSize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= heroSize + 16;
  // I'm <name>.
  page.drawText(`I'm ${name}.`, {
    x: 40, y,
    size: nameOccSize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= nameOccSize + 8;
  // <occupation>.
  page.drawText(`${occupation}.`, {
    x: 40, y,
    size: nameOccSize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= nameOccSize + 32;
  // Please view my online resume
  const mainText = 'Please view my ';
  const linkText = 'online resume';
  const afterLink = '.';
  page.drawText(mainText, {
    x: 40, y,
    size: bodySize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  const mainTextWidth = timesFont.widthOfTextAtSize(mainText, bodySize);
  const linkTextWidth = timesFont.widthOfTextAtSize(linkText, bodySize);
  // Draw link text in accent color and underline
  page.drawText(linkText, {
    x: 40 + mainTextWidth, y,
    size: bodySize,
    font: timesFont,
    color: rgb(ACCENT_COLOR.r, ACCENT_COLOR.g, ACCENT_COLOR.b),
  });
  // Underline 'online resume'
  page.drawLine({
    start: { x: 40 + mainTextWidth, y: y - 4 },
    end: { x: 40 + mainTextWidth + linkTextWidth, y: y - 4 },
    thickness: 2,
    color: rgb(ACCENT_COLOR.r, ACCENT_COLOR.g, ACCENT_COLOR.b),
  });
  // Add link annotation using pdf-lib's low-level API
  const linkRect = [40 + mainTextWidth, y, 40 + mainTextWidth + linkTextWidth, y + bodySize];
  const linkAnnot = pdfDoc.context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: pdfDoc.context.obj(linkRect.map(n => PDFNumber.of(n))),
    Border: pdfDoc.context.obj([PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(0)]),
    A: pdfDoc.context.obj({
      Type: PDFName.of('Action'),
      S: PDFName.of('URI'),
      URI: PDFString.of(resumeUrl),
    }),
  });
  let annots = page.node.Annots();
  if (!annots) {
    annots = pdfDoc.context.obj([]);
    page.node.set(PDFName.of('Annots'), annots);
  }
  annots.push(linkAnnot);
  // Draw afterLink
  page.drawText(afterLink, {
    x: 40 + mainTextWidth + linkTextWidth, y,
    size: bodySize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= bodySize + 16;
  // The password is xxxx.
  const pwText = 'The password is ';
  const pwValue = password;
  page.drawText(pwText, {
    x: 40, y,
    size: bodySize,
    font: timesFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  const pwTextWidth = timesFont.widthOfTextAtSize(pwText, bodySize);
  page.drawText(pwValue + '.', {
    x: 40 + pwTextWidth, y,
    size: bodySize,
    font: timesFont,
    color: rgb(ACCENT_COLOR.r, ACCENT_COLOR.g, ACCENT_COLOR.b),
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume-link.pdf"',
    },
  });
} 