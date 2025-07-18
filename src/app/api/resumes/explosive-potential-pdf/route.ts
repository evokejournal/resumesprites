import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background: teal
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(0, 0.5, 0.5) // #008080
  });

  // Card: Windows gray, outset border
  const cardWidth = 420;
  const cardHeight = 180;
  const cardX = (595 - cardWidth) / 2;
  const cardY = (842 - cardHeight) / 2;
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    color: rgb(0.75, 0.75, 0.75) // #C0C0C0
  });
  // Outset border (simulate with a darker border)
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    borderWidth: 2,
    borderColor: rgb(0.53, 0.53, 0.53) // #888
  });

  // Inner content: white, inset border
  const innerPad = 14;
  page.drawRectangle({
    x: cardX + innerPad, y: cardY + innerPad, width: cardWidth - 2 * innerPad, height: cardHeight - 2 * innerPad,
    color: rgb(1, 1, 1)
  });
  // Inset border (simulate with a lighter border)
  page.drawRectangle({
    x: cardX + innerPad, y: cardY + innerPad, width: cardWidth - 2 * innerPad, height: cardHeight - 2 * innerPad,
    borderWidth: 2,
    borderColor: rgb(0.9, 0.9, 0.9) // #e5e5e5
  });

  // Title: bold, black, centered
  const title = 'Minesweeper Resume';
  const titleSize = 20;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const titleX = cardX + (cardWidth - titleWidth) / 2;
  const titleY = cardY + cardHeight - 36;
  page.drawText(title, {
    x: titleX, y: titleY,
    size: titleSize,
    font,
    color: rgb(0, 0, 0)
  });

  // Subtitle: black, centered
  const subtitle = 'Click to reveal the password field';
  const subtitleSize = 12;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleSize);
  const subtitleX = cardX + (cardWidth - subtitleWidth) / 2;
  const subtitleY = titleY - 28;
  page.drawText(subtitle, {
    x: subtitleX, y: subtitleY,
    size: subtitleSize,
    font,
    color: rgb(0, 0, 0)
  });

  // Link area (blue, underlined)
  const linkText = 'My online resume can be viewed here';
  const linkSize = 13;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = cardX + (cardWidth - linkWidth) / 2;
  const linkY = subtitleY - 36;
  page.drawText(linkText, {
    x: linkX, y: linkY,
    size: linkSize,
    font,
    color: rgb(0.2, 0.4, 1) // Windows blue
  });
  // Add hyperlink annotation
  const linkRect = [linkX, linkY, linkX + linkWidth, linkY + linkSize];
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

  // Password text (black, centered)
  const passwordText = `Password: ${password}`;
  const passwordSize = 13;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  const passwordX = cardX + (cardWidth - passwordWidth) / 2;
  const passwordY = linkY - 32;
  page.drawText(passwordText, {
    x: passwordX, y: passwordY,
    size: passwordSize,
    font,
    color: rgb(0, 0, 0)
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="explosive-potential-password.pdf"',
    },
  });
} 