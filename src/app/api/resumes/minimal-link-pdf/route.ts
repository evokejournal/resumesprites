import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFName, PDFNumber, PDFString, StandardFonts } from 'pdf-lib';

// Template-specific styling functions
function getTemplateStyle(templateId: string) {
  switch (templateId) {
    case 'snakebite-resume':
      return {
        backgroundColor: { r: 0.61, g: 0.74, b: 0.06 }, // #9bbc0f
        cardBackground: { r: 0.55, g: 0.67, b: 0.06 }, // #8bac0f
        borderColor: { r: 0.06, g: 0.22, b: 0.06 }, // #0f380f
        textColor: { r: 0.06, g: 0.22, b: 0.06 }, // #0f380f
        accentColor: { r: 0.06, g: 0.22, b: 0.06 }, // #0f380f
        inputBackground: { r: 0.79, g: 0.86, b: 0.62 }, // #cadc9f
        font: StandardFonts.Courier,
        title: "Resume",
        subtitle: "Enter password to unlock my resume"
      };
    
    case 'bouncing-resume':
      return {
        backgroundColor: { r: 0, g: 0, b: 0 }, // black
        cardBackground: { r: 0, g: 0, b: 0 }, // black
        borderColor: { r: 1, g: 1, b: 1 }, // white
        textColor: { r: 1, g: 1, b: 1 }, // white
        accentColor: { r: 0, g: 1, b: 1 }, // cyan
        font: StandardFonts.Helvetica,
        title: "Widescreen Credentials",
        subtitle: "Enter password to unlock my resume"
      };
    
    case 'youble':
      return {
        backgroundColor: { r: 1, g: 1, b: 1 }, // white
        cardBackground: { r: 1, g: 1, b: 1 }, // white (no card for youble)
        borderColor: { r: 0.9, g: 0.9, b: 0.9 }, // #e5e5e5
        textColor: { r: 0.26, g: 0.52, b: 0.95 }, // #4285F4
        accentColor: { r: 0.26, g: 0.52, b: 0.95 }, // #4285F4
        font: StandardFonts.Helvetica,
        title: "Youble",
        subtitle: "Who are you searching for?",
        isYouble: true // Special flag for Youble styling
      };
    
    case 'operating-system':
      return {
        backgroundColor: { r: 0, g: 0.5, b: 0.5 }, // #008080
        cardBackground: { r: 1, g: 1, b: 1 }, // white
        borderColor: { r: 0.53, g: 0.53, b: 0.53 }, // #888
        textColor: { r: 0, g: 0, b: 0.5 }, // #000080
        accentColor: { r: 0.75, g: 0.75, b: 0.75 }, // #C0C0C0
        font: StandardFonts.Helvetica,
        title: "Authentication Required",
        subtitle: "Please enter the password to view this resume."
      };
    
    case 'for-tax-purposes':
      return {
        backgroundColor: { r: 0.95, g: 0.95, b: 0.95 }, // #f2f2f2
        cardBackground: { r: 0.99, g: 0.99, b: 0.95 }, // #fdfdf2
        borderColor: { r: 0.8, g: 0.8, b: 0.8 }, // #ccc
        textColor: { r: 0, g: 0, b: 0 }, // black
        accentColor: { r: 0.4, g: 0.4, b: 0.4 }, // #666
        font: StandardFonts.Courier,
        title: "PASSWORD REQUIRED",
        subtitle: "Enter password to access resume"
      };
    
    case 'code-syntax':
      return {
        backgroundColor: { r: 0.12, g: 0.12, b: 0.12 }, // #1E1E1E
        cardBackground: { r: 0.15, g: 0.15, b: 0.15 }, // #252526
        borderColor: { r: 0.4, g: 0.4, b: 0.4 }, // #666
        textColor: { r: 1, g: 1, b: 1 }, // white
        accentColor: { r: 0.4, g: 0.8, b: 0.4 }, // #66d966
        font: StandardFonts.Courier,
        title: "// Authentication Required",
        subtitle: "// This resume is protected. Enter the password to continue."
      };
    
    case 'explosive-potential':
      return {
        backgroundColor: { r: 1, g: 1, b: 1 }, // white
        cardBackground: { r: 0.98, g: 0.98, b: 0.98 }, // #fafafa
        borderColor: { r: 0.9, g: 0.9, b: 0.9 }, // #e5e5e5
        textColor: { r: 0.2, g: 0.2, b: 0.2 }, // #333
        accentColor: { r: 0.2, g: 0.6, b: 1 }, // #3399ff
        font: StandardFonts.Helvetica,
        title: "Minesweeper Resume",
        subtitle: "Click to reveal the password field"
      };
    
    case 'sms-conversation':
      return {
        backgroundColor: { r: 0.96, g: 0.96, b: 0.96 }, // #f5f5f5
        cardBackground: { r: 1, g: 1, b: 1 }, // white
        borderColor: { r: 0.9, g: 0.9, b: 0.9 }, // #e5e5e5
        textColor: { r: 0.2, g: 0.2, b: 0.2 }, // #333
        accentColor: { r: 0.2, g: 0.8, b: 0.4 }, // #33cc66
        font: StandardFonts.Helvetica,
        title: "SMS Authentication",
        subtitle: "Enter password to view conversation"
      };
    
    case 'retro-terminal':
      return {
        backgroundColor: { r: 0.06, g: 0.06, b: 0.06 }, // #0f0f0f
        cardBackground: { r: 0.06, g: 0.06, b: 0.06 }, // #0f0f0f
        borderColor: { r: 0, g: 1, b: 0 }, // #00ff00
        textColor: { r: 0, g: 1, b: 0 }, // #00ff00
        accentColor: { r: 0, g: 1, b: 0 }, // #00ff00
        font: StandardFonts.Courier,
        title: "TERMINAL AUTHENTICATION",
        subtitle: "Enter password to access resume"
      };
    

    

    
    default:
      return {
        backgroundColor: { r: 1, g: 1, b: 1 }, // white
        cardBackground: { r: 0.98, g: 0.98, b: 0.98 }, // #fafafa
        borderColor: { r: 0.9, g: 0.9, b: 0.9 }, // #e5e5e5
        textColor: { r: 0.2, g: 0.2, b: 0.2 }, // #333
        accentColor: { r: 0.2, g: 0.6, b: 1 }, // #3399ff
        font: StandardFonts.Helvetica,
        title: "Password Required",
        subtitle: "Enter password to access resume"
      };
  }
}

export async function POST(req: NextRequest) {
  const { name, occupation, resumeUrl, password, templateId } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const style = getTemplateStyle(templateId);
  const font = await pdfDoc.embedFont(style.font);

  // Background
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(style.backgroundColor.r, style.backgroundColor.g, style.backgroundColor.b)
  });

  // Special handling for Youble template
  if (style.isYouble) {
    // Youble logo in center
    const logoSize = 60;
    const logoY = 842 / 2 - 50;
    
    // Draw "Youble" text with colored letters
    const letters = ['Y', 'o', 'u', 'b', 'l', 'e'];
    const colors = [
      { r: 0.92, g: 0.26, b: 0.21 }, // #EA4335 - red
      { r: 0.26, g: 0.52, b: 0.95 }, // #4285F4 - blue
      { r: 0.20, g: 0.66, b: 0.33 }, // #34A853 - green
      { r: 0.98, g: 0.74, b: 0.02 }, // #FBBC05 - yellow
      { r: 0.92, g: 0.26, b: 0.21 }, // #EA4335 - red
      { r: 0.26, g: 0.52, b: 0.95 }, // #4285F4 - blue
    ];
    
    let currentX = (595 - (letters.length * logoSize * 0.6)) / 2;
    
    for (let i = 0; i < letters.length; i++) {
      page.drawText(letters[i], {
        x: currentX, y: logoY,
        size: logoSize,
        font: font,
        color: rgb(colors[i].r, colors[i].g, colors[i].b)
      });
      currentX += logoSize * 0.6;
    }
    
    // Subtitle
    const subtitleSize = 16;
    const subtitleWidth = font.widthOfTextAtSize(style.subtitle, subtitleSize);
    const subtitleX = (595 - subtitleWidth) / 2;
    const subtitleY = logoY - 80;
    
    page.drawText(style.subtitle, {
      x: subtitleX, y: subtitleY,
      size: subtitleSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4) // gray
    });
    
    // Contact box area (replaced with hyperlinked text)
    const contactBoxY = subtitleY - 120;
    const contactBoxHeight = 60;
    
    // Draw contact box background
    page.drawRectangle({
      x: 97, y: contactBoxY, width: 401, height: contactBoxHeight,
      color: rgb(0.98, 0.98, 0.98) // #fafafa
    });
    
    // Draw contact box border
    page.drawRectangle({
      x: 97, y: contactBoxY, width: 401, height: contactBoxHeight,
      borderWidth: 1,
      borderColor: rgb(0.9, 0.9, 0.9) // #e5e5e5
    });

    // Hyperlinked text
    const linkText = "My online resume can be viewed here";
    const linkSize = 14;
    const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
    const linkX = (595 - linkWidth) / 2;
    const linkY = contactBoxY + 35;
    
    // Draw the text
    page.drawText(linkText, {
      x: linkX, y: linkY,
      size: linkSize,
      font: font,
      color: rgb(style.accentColor.r, style.accentColor.g, style.accentColor.b)
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
    const passwordSize = 12;
    const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
    const passwordX = (595 - passwordWidth) / 2;
    const passwordY = contactBoxY - 30;
    
    page.drawText(passwordText, {
      x: passwordX, y: passwordY,
      size: passwordSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4) // gray
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

  // Special handling for Bouncing Resume template
  if (templateId === 'bouncing-resume') {
    // Draw bouncing logo in center
    const logoSize = 40;
    const logoY = 842 / 2 - 20;
    
    // Draw the bouncing logo with colorful text
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    // First name in cyan
    page.drawText(firstName.toUpperCase(), {
      x: (595 - font.widthOfTextAtSize(firstName.toUpperCase(), logoSize)) / 2,
      y: logoY + 20,
      size: logoSize,
      font: font,
      color: rgb(0, 1, 1) // cyan
    });
    
    // Last name in yellow
    page.drawText(lastName.toUpperCase(), {
      x: (595 - font.widthOfTextAtSize(lastName.toUpperCase(), logoSize)) / 2,
      y: logoY - 20,
      size: logoSize,
      font: font,
      color: rgb(1, 1, 0) // yellow
    });
    
    // Draw the curved background shape (simplified as a rectangle)
    const curveY = logoY - 60;
    page.drawRectangle({
      x: 150, y: curveY + 10, width: 300, height: 30,
      color: rgb(0, 1, 1) // cyan
    });
    
    // "RESUME" text on the curve
    page.drawText("RESUME", {
      x: (595 - font.widthOfTextAtSize("RESUME", 16)) / 2,
      y: curveY + 27,
      size: 16,
      font: font,
      color: rgb(0, 0, 0) // black
    });
    
    // Subtitle
    const subtitleSize = 16;
    const subtitleWidth = font.widthOfTextAtSize(style.subtitle, subtitleSize);
    const subtitleX = (595 - subtitleWidth) / 2;
    const subtitleY = curveY - 40;
    
    page.drawText(style.subtitle, {
      x: subtitleX, y: subtitleY,
      size: subtitleSize,
      font: font,
      color: rgb(1, 1, 1) // white
    });
    
    // Contact box area (replaced with hyperlinked text)
    const contactBoxY = subtitleY - 120;
    const contactBoxHeight = 60;
    
    // Draw contact box background
    page.drawRectangle({
      x: 97, y: contactBoxY, width: 401, height: contactBoxHeight,
      color: rgb(0, 0, 0) // black
    });
    
    // Draw contact box border
    page.drawRectangle({
      x: 97, y: contactBoxY, width: 401, height: contactBoxHeight,
      borderWidth: 2,
      borderColor: rgb(1, 1, 1) // white
    });

    // Hyperlinked text
    const linkText = "My online resume can be viewed here";
    const linkSize = 14;
    const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
    const linkX = (595 - linkWidth) / 2;
    const linkY = contactBoxY + 35;
    
    // Draw the text
    page.drawText(linkText, {
      x: linkX, y: linkY,
      size: linkSize,
      font: font,
      color: rgb(0, 1, 1) // cyan
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
    const passwordSize = 12;
    const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
    const passwordX = (595 - passwordWidth) / 2;
    const passwordY = contactBoxY - 30;
    
    page.drawText(passwordText, {
      x: passwordX, y: passwordY,
      size: passwordSize,
      font: font,
      color: rgb(1, 1, 1) // white
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

  // Calculate center position for the card (for other templates)
  const cardWidth = 400;
  const cardHeight = 300;
  const cardX = (595 - cardWidth) / 2;
  const cardY = (842 - cardHeight) / 2;

  // Draw card background
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    color: rgb(style.cardBackground.r, style.cardBackground.g, style.cardBackground.b)
  });

  // Draw card border
  page.drawRectangle({
    x: cardX, y: cardY, width: cardWidth, height: cardHeight,
    borderWidth: 2,
    borderColor: rgb(style.borderColor.r, style.borderColor.g, style.borderColor.b)
  });

  // Title
  const titleSize = 24;
  const titleWidth = font.widthOfTextAtSize(style.title, titleSize);
  const titleX = cardX + (cardWidth - titleWidth) / 2;
  const titleY = cardY + cardHeight - 50;
  
  page.drawText(style.title, {
    x: titleX, y: titleY,
    size: titleSize,
    font: font,
    color: rgb(style.textColor.r, style.textColor.g, style.textColor.b)
  });

  // Subtitle
  const subtitleSize = 12;
  const subtitleWidth = font.widthOfTextAtSize(style.subtitle, subtitleSize);
  const subtitleX = cardX + (cardWidth - subtitleWidth) / 2;
  const subtitleY = titleY - 30;
  
  page.drawText(style.subtitle, {
    x: subtitleX, y: subtitleY,
    size: subtitleSize,
    font: font,
    color: rgb(style.textColor.r, style.textColor.g, style.textColor.b)
  });

  // Contact box area (replaced with hyperlinked text)
  const contactBoxY = subtitleY - 80;
  const contactBoxHeight = 60;
  
  // Draw contact box background
  page.drawRectangle({
    x: cardX + 20, y: contactBoxY, width: cardWidth - 40, height: contactBoxHeight,
    color: rgb(style.backgroundColor.r, style.backgroundColor.g, style.backgroundColor.b)
  });
  
  // Draw contact box border
  page.drawRectangle({
    x: cardX + 20, y: contactBoxY, width: cardWidth - 40, height: contactBoxHeight,
    borderWidth: 1,
    borderColor: rgb(style.borderColor.r, style.borderColor.g, style.borderColor.b)
  });

  // Hyperlinked text
  const linkText = "My online resume can be viewed here";
  const linkSize = 14;
  const linkWidth = font.widthOfTextAtSize(linkText, linkSize);
  const linkX = cardX + (cardWidth - linkWidth) / 2;
  const linkY = contactBoxY + 35;
  
  // Draw the text
  page.drawText(linkText, {
    x: linkX, y: linkY,
    size: linkSize,
    font: font,
    color: rgb(style.accentColor.r, style.accentColor.g, style.accentColor.b)
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
  const passwordSize = 12;
  const passwordWidth = font.widthOfTextAtSize(passwordText, passwordSize);
  const passwordX = cardX + (cardWidth - passwordWidth) / 2;
  const passwordY = contactBoxY - 30;
  
  page.drawText(passwordText, {
    x: passwordX, y: passwordY,
    size: passwordSize,
    font: font,
    color: rgb(style.textColor.r, style.textColor.g, style.textColor.b)
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