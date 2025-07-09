import { NextRequest, NextResponse } from 'next/server';
import { getTemplateStyle } from '@/lib/templates';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  if (h.length === 6) {
    return {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255,
    };
  }
  return { r: 1, g: 1, b: 1 };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  // Perceived luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function splitTextIntoLines(text: string, maxLen: number) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > maxLen) {
      lines.push(line.trim());
      line = '';
    }
    line += word + ' ';
  }
  if (line) lines.push(line.trim());
  return lines;
}

export async function POST(req: NextRequest) {
  const { name, occupation, company, address, content, templateId, resumeUrl, password } = await req.json();
  const style = getTemplateStyle(templateId);

  // Colors
  const bgColor = style.background.startsWith('#') ? hexToRgb(style.background) : { r: 1, g: 1, b: 1 };
  let textColor = style.textColor.startsWith('#') ? hexToRgb(style.textColor) : { r: 0, g: 0, b: 0 };

  // Ensure contrast: if background is light, use dark text; if dark, use white or template color
  const bgLum = luminance(bgColor);
  if (bgLum > 0.7) {
    textColor = { r: 0.1, g: 0.1, b: 0.1 }; // dark text
  } else if (bgLum < 0.3) {
    textColor = { r: 1, g: 1, b: 1 }; // white text
  }

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Background
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(bgColor.r, bgColor.g, bgColor.b) });

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = 800;

  // Header
  page.drawText(name, { x: 50, y, size: 18, font, color: rgb(textColor.r, textColor.g, textColor.b) });
  y -= 24;
  page.drawText(occupation, { x: 50, y, size: 14, font, color: rgb(textColor.r, textColor.g, textColor.b) });
  y -= 32;

  // Company info
  if (company) {
    page.drawText(company, { x: 50, y, size: 12, font, color: rgb(textColor.r, textColor.g, textColor.b) });
    y -= 18;
  }
  if (address) {
    page.drawText(address, { x: 50, y, size: 12, font, color: rgb(textColor.r, textColor.g, textColor.b) });
    y -= 18;
  }
  y -= 10;

  // Body (cover letter content)
  const bodyLines = splitTextIntoLines(content, 80);
  for (const line of bodyLines) {
    page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(textColor.r, textColor.g, textColor.b) });
    y -= 18;
  }
  y -= 24;

  // Footer: Resume link and password
  const footerText = `My online resume and portfolio can be found here: ${resumeUrl}`;
  const passwordText = `The password is: ${password}`;
  page.drawText(footerText, { x: 50, y, size: 14, font, color: rgb(textColor.r, textColor.g, textColor.b) });
  y -= 22;
  page.drawText(passwordText, { x: 50, y, size: 16, font, color: rgb(textColor.r, textColor.g, textColor.b) });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cover-letter.pdf"',
    },
  });
} 