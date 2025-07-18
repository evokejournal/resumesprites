import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Courier);

  // Background: black
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(0, 0, 0)
  });

  // Card: black, green border
  const cardWidth = 420;
  const cardHeight = 180;
  const cardX = (595 - cardWidth) / 2;
  const cardY = (842 - cardHeight) / 2;
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    color: rgb(0, 0, 0)
  });
  // Green border
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    borderWidth: 2,
    borderColor: rgb(0, 1, 0) // #00ff00
  });

  // Title: bright green, monospace
  const title = 'TERMINAL AUTHENTICATION';
  const titleSize = 18;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const titleX = cardX + (cardWidth - titleWidth) / 2;
  const titleY = cardY + cardHeight - 36;
  page.drawText(title, {
    x: titleX, y: titleY,
    size: titleSize,
    font,
    color: rgb(0, 1, 0)
  });

  // Subtitle: bright green, monospace
  const subtitle = 'Enter password to access resume';
  const subtitleSize = 12;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleSize);
  const subtitleX = cardX + (cardWidth - subtitleWidth) / 2;
  const subtitleY = titleY - 28;
  page.drawText(subtitle, {
    x: subtitleX, y: subtitleY,
    size: subtitleSize,
    font,
    color: rgb(0, 1, 0)
  });

  // Link area (bright green)
  const linkText = 'My online resume can be viewed here';
  const linkSize = 13;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = cardX + (cardWidth - linkWidth) / 2;
  const linkY = subtitleY - 36;
  page.drawText(linkText, {
    x: linkX, y: linkY,
    size: linkSize,
    font,
    color: rgb(0, 1, 0)
  });
  // Add hyperlink annotation
  const linkRect = [linkX, linkY, linkX + linkWidth, linkY + linkSize];
  const linkAnnot = pdfDoc.context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: pdfDoc.context.obj(linkRect.map(n => PDFNumber.of(n)) ),
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

  // Password text (bright green, monospace)
  const passwordText = `Password: ${password}`;
  const passwordSize = 13;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  const passwordX = cardX + (cardWidth - passwordWidth) / 2;
  const passwordY = linkY - 32;
  page.drawText(passwordText, {
    x: passwordX, y: passwordY,
    size: passwordSize,
    font,
    color: rgb(0, 1, 0)
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="retro-terminal-password.pdf"',
    },
  });
} 