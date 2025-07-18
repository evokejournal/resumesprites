import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Courier);

  // Background: VS Code dark
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(0.12, 0.12, 0.12) // #1E1E1E
  });

  // Card/panel
  const cardWidth = 420;
  const cardHeight = 220;
  const cardX = (595 - cardWidth) / 2;
  const cardY = (842 - cardHeight) / 2;
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    color: rgb(0.15, 0.15, 0.15) // #252526
  });
  // Border
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    borderWidth: 2,
    borderColor: rgb(0.27, 0.27, 0.27) // #444
  });

  // Title: green, code comment style
  const title = '// Authentication Required';
  const titleSize = 20;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const titleX = cardX + (cardWidth - titleWidth) / 2;
  const titleY = cardY + cardHeight - 40;
  page.drawText(title, {
    x: titleX, y: titleY,
    size: titleSize,
    font,
    color: rgb(0.65, 0.85, 0.18) // #a6e22e
  });

  // Subtitle: code comment style
  const subtitle = '// This resume is protected. Enter the password to continue.';
  const subtitleSize = 12;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleSize);
  const subtitleX = cardX + (cardWidth - subtitleWidth) / 2;
  const subtitleY = titleY - 30;
  page.drawText(subtitle, {
    x: subtitleX, y: subtitleY,
    size: subtitleSize,
    font,
    color: rgb(1, 1, 1)
  });

  // Link box area
  const boxY = subtitleY - 60;
  const boxHeight = 40;
  // Box background
  page.drawRectangle({
    x: cardX + 20, y: boxY, width: cardWidth - 40, height: boxHeight,
    color: rgb(0.12, 0.12, 0.12)
  });
  // Box border
  page.drawRectangle({
    x: cardX + 20, y: boxY, width: cardWidth - 40, height: boxHeight,
    borderWidth: 1,
    borderColor: rgb(0.27, 0.27, 0.27)
  });

  // Hyperlinked text (green)
  const linkText = 'My online resume can be viewed here';
  const linkSize = 13;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = cardX + (cardWidth - linkWidth) / 2;
  const linkY = boxY + 22;
  page.drawText(linkText, {
    x: linkX, y: linkY,
    size: linkSize,
    font,
    color: rgb(0.65, 0.85, 0.18) // #a6e22e
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

  // Password text (white, monospace)
  const passwordText = `Password: ${password}`;
  const passwordSize = 13;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  const passwordX = cardX + (cardWidth - passwordWidth) / 2;
  const passwordY = boxY - 30;
  page.drawText(passwordText, {
    x: passwordX, y: passwordY,
    size: passwordSize,
    font,
    color: rgb(1, 1, 1)
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="code-syntax-password.pdf"',
    },
  });
} 