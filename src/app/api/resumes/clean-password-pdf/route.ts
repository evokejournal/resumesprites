import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { name, occupation, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const primaryColor = rgb(0.85, 0.6, 0.4); // Coral orange
  const accentColor = rgb(0.95, 0.8, 0.6); // Light coral
  const textColor = rgb(0.2, 0.2, 0.2); // Dark gray
  const lightGray = rgb(0.95, 0.95, 0.95); // Very light gray

  // Background with subtle gradient effect
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(1, 1, 1) // White
  });

  // Top accent bar
  page.drawRectangle({
    x: 0, y: 780, width: 595, height: 62,
    color: primaryColor
  });

  // Decorative elements removed - keeping just the orange header strip

  // Main content card
  const cardWidth = 480;
  const cardHeight = 320;
  const cardX = (595 - cardWidth) / 2;
  const cardY = 400;

  // Card background with subtle shadow effect
  page.drawRectangle({
    x: cardX + 4, y: cardY - 4, width: cardWidth, height: cardHeight,
    color: lightGray
  });
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    color: rgb(1, 1, 1)
  });

  // Card border
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    borderWidth: 2,
    borderColor: accentColor
  });

  // Content positioning
  const contentX = cardX + 60;
  let y = cardY + cardHeight - 60;

  // Greeting with decorative element
  const greeting = 'Hello,';
  const greetingSize = 18;
  page.drawText(greeting, {
    x: contentX,
    y,
    size: greetingSize,
    font,
    color: textColor
  });

  // Decorative line after greeting
  page.drawRectangle({
    x: contentX, y: y - 15, width: 40, height: 2,
    color: primaryColor
  });

  y -= 50;

  // Name introduction with larger, bolder text
  const nameIntro = `I'm ${name}`;
  const nameIntroSize = 28;
  page.drawText(nameIntro, {
    x: contentX,
    y,
    size: nameIntroSize,
    font: fontBold,
    color: primaryColor
  });

  y -= 50;

  // Occupation text
  const occupationText = occupation || 'Professional';
  const occupationSize = 16;
  page.drawText(occupationText, {
    x: contentX,
    y,
    size: occupationSize,
    font,
    color: textColor
  });

  y -= 50;

  // Combined portfolio text and button as one hyperlinked element
  const fullText = 'my online portfolio can be found here';
  const textSize = 16;
  const fullTextWidth = fontBold.widthOfTextAtSize(fullText, textSize); // Use bold font for width calculation
  const buttonHeight = 40;
  const buttonX = contentX;
  const buttonY = y - 10;

  // Button background for the entire text - ensure full width
  page.drawRectangle({
    x: buttonX - 15,
    y: buttonY - 5,
    width: fullTextWidth + 30,
    height: buttonHeight,
    color: primaryColor
  });

  // Full text (white) - ensure it fits within button
  page.drawText(fullText, {
    x: buttonX,
    y: buttonY + 8,
    size: textSize,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  // Add hyperlink annotation for the entire button
  const linkRect = [buttonX - 15, buttonY - 5, buttonX + fullTextWidth + 15, buttonY + buttonHeight - 5];
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

  y -= 80;

  // Password section with integrated design - properly contained within card
  const passwordBoxWidth = 160;
  const passwordBoxHeight = 35;
  const passwordBoxX = contentX;
  const passwordBoxY = y - 10;

  // Calculate available space within the card
  const cardRightEdge = cardX + cardWidth - 60; // 60px margin from right edge
  const availableWidth = cardRightEdge - contentX;
  
  // Adjust password box width if needed
  const finalPasswordBoxWidth = Math.min(passwordBoxWidth, availableWidth);
  const adjustedPasswordBoxX = contentX;

  // Password box background
  page.drawRectangle({
    x: adjustedPasswordBoxX, y: passwordBoxY, width: finalPasswordBoxWidth, height: passwordBoxHeight,
    color: lightGray
  });
  page.drawRectangle({
    x: adjustedPasswordBoxX, y: passwordBoxY, width: finalPasswordBoxWidth, height: passwordBoxHeight,
    borderWidth: 1,
    borderColor: accentColor
  });

  // Password label inside the box (left side)
  const passwordLabel = 'Password:';
  const passwordLabelSize = 14;
  page.drawText(passwordLabel, {
    x: adjustedPasswordBoxX + 15,
    y: passwordBoxY + 8,
    size: passwordLabelSize,
    font,
    color: textColor
  });

  // Password value inside the box (right side) - ensure it fits
  const passwordTextWidth = fontBold.widthOfTextAtSize(password, 16);
  const maxPasswordX = adjustedPasswordBoxX + finalPasswordBoxWidth - passwordTextWidth - 15;
  const passwordX = Math.min(adjustedPasswordBoxX + 90, maxPasswordX);
  
  page.drawText(password, {
    x: passwordX,
    y: passwordBoxY + 8,
    size: 16,
    font: fontBold,
    color: primaryColor
  });

  // Bottom decorative element
  const bottomY = cardY - 40;
  page.drawRectangle({
    x: cardX + 20, y: bottomY, width: cardWidth - 40, height: 3,
    color: accentColor
  });

  // ResumeSprites email logo
  try {
    const logoPath = path.join(process.cwd(), 'public', 'email-logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      
      const logoWidth = 80;
      const logoHeight = 40;
      const logoX = (595 - logoWidth) / 2;
      const logoY = bottomY - 50;
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoWidth,
        height: logoHeight,
      });
    }
  } catch (error) {
    console.error('Error embedding logo:', error);
    // Fallback to text if logo fails to load
    const fallbackText = 'ResumeSprites';
    const fallbackSize = 12;
    const fallbackWidth = font.widthOfTextAtSize(fallbackText, fallbackSize);
    page.drawText(fallbackText, {
      x: (595 - fallbackWidth) / 2,
      y: bottomY - 30,
      size: fallbackSize,
      font: fontBold,
      color: primaryColor
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume-password.pdf"',
    },
  });
} 