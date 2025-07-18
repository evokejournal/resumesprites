import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background: solid black
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(0, 0, 0)
  });

  // Logo: first name in cyan, last name in yellow, centered
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');
  const logoSize = 40;
  const logoY = 842 / 2 + 60;

  // First name (cyan)
  page.drawText(firstName.toUpperCase(), {
    x: (595 - font.widthOfTextAtSize(firstName.toUpperCase(), logoSize)) / 2,
    y: logoY,
    size: logoSize,
    font,
    color: rgb(0, 1, 1)
  });

  // Last name (yellow)
  page.drawText(lastName.toUpperCase(), {
    x: (595 - font.widthOfTextAtSize(lastName.toUpperCase(), logoSize)) / 2,
    y: logoY - 40,
    size: logoSize,
    font,
    color: rgb(1, 1, 0)
  });

  // Curved cyan shape (simplified as a rectangle for PDF)
  const curveY = logoY - 80;
  page.drawRectangle({
    x: 150, y: curveY + 10, width: 300, height: 30,
    color: rgb(0, 1, 1)
  });

  // 'RESUME' text on the curve
  page.drawText('RESUME', {
    x: (595 - font.widthOfTextAtSize('RESUME', 16)) / 2,
    y: curveY + 20,
    size: 16,
    font,
    color: rgb(0, 0, 0)
  });

  // Subtitle
  const subtitle = 'Enter password to access resume';
  const subtitleSize = 16;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleSize);
  const subtitleX = (595 - subtitleWidth) / 2;
  const subtitleY = curveY - 40;
  page.drawText(subtitle, {
    x: subtitleX, y: subtitleY,
    size: subtitleSize,
    font,
    color: rgb(1, 1, 1)
  });

  // Card for link and password
  const cardY = subtitleY - 120;
  const cardHeight = 80;
  // Card background
  page.drawRectangle({
    x: 97, y: cardY, width: 401, height: cardHeight,
    color: rgb(0, 0, 0)
  });
  // Card border
  page.drawRectangle({
    x: 97, y: cardY, width: 401, height: cardHeight,
    borderWidth: 2,
    borderColor: rgb(1, 1, 1)
  });

  // Hyperlinked text
  const linkText = 'My online resume can be viewed here';
  const linkSize = 14;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = (595 - linkWidth) / 2;
  const linkY = cardY + 50;
  page.drawText(linkText, {
    x: linkX, y: linkY,
    size: linkSize,
    font,
    color: rgb(0, 1, 1)
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

  // Password text
  const passwordText = `Password: ${password}`;
  const passwordSize = 14;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  const passwordX = (595 - passwordWidth) / 2;
  const passwordY = cardY + 20;
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
      'Content-Disposition': 'attachment; filename="bouncing-resume-password.pdf"',
    },
  });
} 