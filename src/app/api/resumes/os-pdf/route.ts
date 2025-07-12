import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Win95 color palette
const WIN95_BG = rgb(0, 0.5, 0.5); // #008080
const WIN95_WINDOW = rgb(0.75, 0.75, 0.75); // #C0C0C0
const WIN95_TITLEBAR = rgb(0, 0, 0.5); // #000080
const WIN95_TITLEBAR_TEXT = rgb(1, 1, 1); // white
const WIN95_BORDER = rgb(0.53, 0.53, 0.53); // #888
const WIN95_TEXT = rgb(0, 0, 0); // black
const WIN95_ACCENT = rgb(0.18, 0.19, 0.57); // #2E3192

const SECTION_ORDER = [
  { key: 'about', label: 'About Me' },
  { key: 'contact', label: 'Contact' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'references', label: 'References' },
  { key: 'custom', label: 'Custom' },
];

function getSectionContent(section, data, font, fontBold, fontSize, contentWidth) {
  switch (section) {
    case 'about': {
      const lines = [];
      if (data.about?.name) lines.push({ text: data.about.name, bold: true });
      if (data.about?.summary) lines.push(...splitTextIntoLines(data.about.summary, font, fontSize, contentWidth).map(text => ({ text, bold: false })));
      return lines;
    }
    case 'contact': {
      const lines = [];
      if (data.contact?.email) lines.push({ text: `Email: `, bold: true, append: data.contact.email });
      if (data.contact?.phone) lines.push({ text: `Phone: `, bold: true, append: data.contact.phone });
      if (data.contact?.website) lines.push({ text: `Website: `, bold: true, append: data.contact.website });
      if (data.contact?.location) lines.push({ text: `Location: `, bold: true, append: data.contact.location });
      return lines;
    }
    case 'experience': {
      const lines = [];
      for (const e of data.experience || []) {
        lines.push({ text: `${e.role} @ ${e.company} (${e.startDate}-${e.endDate})`, bold: true });
        if (e.description) lines.push(...splitTextIntoLines(e.description, font, fontSize, contentWidth - 16).map(text => ({ text: '  ' + text, bold: false })));
        lines.push({ text: '', bold: false });
      }
      return lines;
    }
    case 'education': {
      const lines = [];
      for (const e of data.education || []) {
        lines.push({ text: `${e.degree} - ${e.institution} (${e.startDate}-${e.endDate})`, bold: true });
      }
      return lines;
    }
    case 'skills': {
      if (!data.skills?.length) return [];
      return [{ text: data.skills.map(s => s.name).join(', '), bold: false }];
    }
    case 'portfolio': {
      const lines = [];
      for (const p of data.portfolio || []) {
        lines.push({ text: p.title, bold: true });
        if (p.url) lines.push({ text: p.url, bold: false });
        if (p.description) lines.push(...splitTextIntoLines(p.description, font, fontSize, contentWidth - 16).map(text => ({ text: '  ' + text, bold: false })));
        lines.push({ text: '', bold: false });
      }
      return lines;
    }
    case 'references': {
      const lines = [];
      for (const r of data.references || []) {
        lines.push({ text: `${r.name} (${r.relation})`, bold: true, append: r.contact ? ` - ${r.contact}` : '' });
      }
      return lines;
    }
    case 'custom': {
      if (!data.custom?.items?.length) return [];
      const lines = [{ text: data.custom.title, bold: true }];
      lines.push(...data.custom.items.map(i => ({ text: '- ' + i.description, bold: false })));
      return lines;
    }
    default:
      return [];
  }
}

function getSectionHasContent(section, data) {
  // Use font/fontBold/fontSize/contentWidth defaults for this check
  const lines = getSectionContent(section, data, { widthOfTextAtSize: () => 0 }, { widthOfTextAtSize: () => 0 }, 12, 400);
  return lines && lines.some(l => l.text && l.text.trim().length > 0);
}

function splitTextIntoLines(text, font, fontSize, maxWidth) {
  // Simple word wrap for PDF
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function POST(req: NextRequest) {
  const { resumeData } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN = 32;
  const WINDOW_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const TITLEBAR_HEIGHT = 28;
  const WINDOW_PADDING = 18;
  const CONTENT_WIDTH = WINDOW_WIDTH - WINDOW_PADDING * 2;
  const LINE_HEIGHT = 18;
  const SECTION_SPACING = 18;
  const FONT_SIZE = 12;

  let sections = [];
  // Cover letter first, if present
  if (resumeData.coverLetter && resumeData.coverLetter.trim()) {
    sections.push({
      key: 'coverLetter',
      label: 'Cover Letter',
      content: splitTextIntoLines(resumeData.coverLetter, font, FONT_SIZE, CONTENT_WIDTH).map(text => ({ text, bold: false })),
      forceOwnPage: true,
    });
  }
  // Other sections in order
  for (const s of SECTION_ORDER) {
    if (getSectionHasContent(s.key, resumeData)) {
      sections.push({
        key: s.key,
        label: s.label,
        content: getSectionContent(s.key, resumeData, font, fontBold, FONT_SIZE, CONTENT_WIDTH),
        forceOwnPage: false,
      });
    }
  }

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function startNewPage() {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.content;
    const windowHeight = TITLEBAR_HEIGHT + WINDOW_PADDING * 2 + lines.length * LINE_HEIGHT;
    // If cover letter or forceOwnPage, always start on a new page
    if (section.forceOwnPage) {
      if (i !== 0) startNewPage();
    } else {
      // If not enough space, start new page
      if (y - windowHeight < MARGIN) {
        startNewPage();
      }
    }
    // Draw window background
    page.drawRectangle({
      x: MARGIN, y: y - windowHeight, width: WINDOW_WIDTH, height: windowHeight,
      color: WIN95_WINDOW,
      borderColor: WIN95_BORDER,
      borderWidth: 2,
    });
    // Draw title bar
    page.drawRectangle({
      x: MARGIN, y: y - TITLEBAR_HEIGHT, width: WINDOW_WIDTH, height: TITLEBAR_HEIGHT,
      color: WIN95_TITLEBAR,
    });
    // Draw title text
    page.drawText(`C:\\RESUME\\${section.label.replace(/ /g, '_').toLowerCase()}.txt`, {
      x: MARGIN + 12, y: y - TITLEBAR_HEIGHT + 7,
      size: FONT_SIZE,
      font: fontBold,
      color: WIN95_TITLEBAR_TEXT,
    });
    // Draw content
    let contentY = y - TITLEBAR_HEIGHT - WINDOW_PADDING;
    for (const line of lines) {
      if (line.append) {
        // Bold prefix, normal append
        const prefixWidth = fontBold.widthOfTextAtSize(line.text, FONT_SIZE);
        page.drawText(line.text, {
          x: MARGIN + WINDOW_PADDING, y: contentY,
          size: FONT_SIZE,
          font: fontBold,
          color: WIN95_TEXT,
        });
        page.drawText(line.append, {
          x: MARGIN + WINDOW_PADDING + prefixWidth, y: contentY,
          size: FONT_SIZE,
          font: font,
          color: WIN95_TEXT,
        });
      } else {
        page.drawText(line.text, {
          x: MARGIN + WINDOW_PADDING, y: contentY,
          size: FONT_SIZE,
          font: line.bold ? fontBold : font,
          color: WIN95_TEXT,
        });
      }
      contentY -= LINE_HEIGHT;
    }
    y -= windowHeight + SECTION_SPACING;
  }

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume-operating-system.pdf"',
    },
  });
} 