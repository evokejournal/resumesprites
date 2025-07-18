import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Courier);

  // Background: receipt cream
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(0.99, 0.99, 0.95) // #fdfdf2
  });

  // Receipt width and start Y
  const receiptWidth = 340;
  const receiptX = (595 - receiptWidth) / 2;
  let y = 780;

  // Title: bold, uppercase, centered
  const title = 'PASSWORD REQUIRED';
  const titleSize = 18;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: receiptX + (receiptWidth - titleWidth) / 2,
    y,
    size: titleSize,
    font,
    color: rgb(0, 0, 0)
  });
  y -= 32;

  // Subtitle
  const subtitle = 'Enter password to access resume';
  const subtitleSize = 12;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleSize);
  page.drawText(subtitle, {
    x: receiptX + (receiptWidth - subtitleWidth) / 2,
    y,
    size: subtitleSize,
    font,
    color: rgb(0, 0, 0)
  });
  y -= 28;

  // Separator (asterisks)
  const sep = '***************************************';
  page.drawText(sep, {
    x: receiptX,
    y,
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  y -= 18;

  // Link line (blue, underlined)
  const linkText = 'My online resume can be viewed here';
  const linkSize = 12;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = receiptX + (receiptWidth - linkWidth) / 2;
  page.drawText(linkText, {
    x: linkX, y,
    size: linkSize,
    font,
    color: rgb(0.2, 0.4, 1)
  });
  // Add hyperlink annotation
  const linkRect = [linkX, y, linkX + linkWidth, y + linkSize];
  const linkAnnot = pdfDoc.context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: pdfDoc.context.obj(linkRect.map(n => PDFNumber.of(n))),
    Border: pdfDoc.context.obj([PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(1)]),
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
  y -= 28;

  // Password line
  const passwordText = `Password: ${password}`;
  const passwordSize = 12;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  page.drawText(passwordText, {
    x: receiptX + (receiptWidth - passwordWidth) / 2,
    y,
    size: passwordSize,
    font,
    color: rgb(0, 0, 0)
  });
  y -= 24;

  // Separator (asterisks)
  page.drawText(sep, {
    x: receiptX,
    y,
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="for-tax-purposes-password.pdf"',
    },
  });
} 