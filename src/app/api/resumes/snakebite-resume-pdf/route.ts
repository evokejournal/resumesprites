import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData } = body;
    
    if (!resumeData) {
      console.error('No resume data provided:', body);
      return NextResponse.json({ error: 'No resume data provided' }, { status: 400 });
    }
    
    // Ensure about section exists with fallbacks
    if (!resumeData.about) {
      resumeData.about = { name: 'Your Name', jobTitle: 'Your Title', summary: '', photo: '' };
    }
    
    // Ensure other sections exist
    if (!resumeData.contact) resumeData.contact = { email: '', phone: '', website: '', location: '' };
    if (!resumeData.experience) resumeData.experience = [];
    if (!resumeData.education) resumeData.education = [];
    if (!resumeData.skills) resumeData.skills = [];
    if (!resumeData.portfolio) resumeData.portfolio = [];
    if (!resumeData.references) resumeData.references = [];
    if (!resumeData.custom) resumeData.custom = { title: '', items: [] };
    
    const pdfDoc = await PDFDocument.create();
    const { width, height } = { width: 612, height: 792 }; // US Letter size
    
    // Embed fonts
    let font;
    try {
      const fontBytes = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf').then(res => res.arrayBuffer());
      font = await pdfDoc.embedFont(fontBytes);
    } catch (error) {
      // Fallback to standard font
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    // Colors matching the Game Boy template
    const gameBoyGreen = rgb(0.13, 0.55, 0.13); // #219621
    const darkGreen = rgb(0.07, 0.35, 0.07); // #125812
    const lightGreen = rgb(0.2, 0.65, 0.2); // #33A633

    // Create cover letter page first
    const coverLetterPage = pdfDoc.addPage([width, height]);
    coverLetterPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: gameBoyGreen,
    });

    // Cover letter screen border
    const screenMargin = 40;
    const screenWidth = width - (screenMargin * 2);
    const screenHeight = height - (screenMargin * 2);
    
    coverLetterPage.drawRectangle({
      x: screenMargin - 4,
      y: screenMargin - 4,
      width: screenWidth + 8,
      height: screenHeight + 8,
      color: darkGreen,
    });
    
    coverLetterPage.drawRectangle({
      x: screenMargin - 2,
      y: screenMargin - 2,
      width: screenWidth + 4,
      height: screenHeight + 4,
      color: lightGreen,
    });
    
    coverLetterPage.drawRectangle({
      x: screenMargin,
      y: screenMargin,
      width: screenWidth,
      height: screenHeight,
      color: gameBoyGreen,
    });

    // Cover letter header
    coverLetterPage.drawText("COVER LETTER", {
      x: (width - font.widthOfTextAtSize("COVER LETTER", 24)) / 2,
      y: height - 120,
      size: 24,
      font,
      color: darkGreen,
    });

    // Cover letter content
    let coverY = height - 160;
    const coverLineHeight = 18;

    const coverLetterText = resumeData.coverLetter || 
      `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in ${resumeData.about.jobTitle || 'my field'}, I believe I would be a valuable addition to your team.

Throughout my career, I have demonstrated a strong ability to deliver exceptional results and drive innovation. My experience includes diverse projects and challenges that have honed my skills and prepared me for this opportunity.

I am particularly drawn to this role because it aligns perfectly with my passion for excellence and innovation. I am excited about the possibility of contributing to your organization's success.

Thank you for considering my application. I look forward to discussing how my skills and experience can benefit your team.

Best regards,
${resumeData.about.name || 'Your Name'}
${resumeData.about.jobTitle || 'Your Title'}
${resumeData.contact?.email || ''}`;

    const coverLines = wrapText(coverLetterText, font, 14, screenWidth - 40);
    coverLines.forEach(line => {
      if (coverY > screenMargin + 40) {
        coverLetterPage.drawText(line, {
          x: screenMargin + 20,
          y: coverY,
          size: 14,
          font,
          color: darkGreen,
        });
        coverY -= coverLineHeight;
      }
    });

    // Create Game Boy resume page second
    const resumePage = pdfDoc.addPage([width, height]);
    resumePage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: gameBoyGreen,
    });

    // Game Boy screen border
    resumePage.drawRectangle({
      x: screenMargin - 4,
      y: screenMargin - 4,
      width: screenWidth + 8,
      height: screenHeight + 8,
      color: darkGreen,
    });
    
    resumePage.drawRectangle({
      x: screenMargin - 2,
      y: screenMargin - 2,
      width: screenWidth + 4,
      height: screenHeight + 4,
      color: lightGreen,
    });
    
    resumePage.drawRectangle({
      x: screenMargin,
      y: screenMargin,
      width: screenWidth,
      height: screenHeight,
      color: gameBoyGreen,
    });

    // Draw pixel grid overlay
    const pixelSize = 4;
    for (let x = screenMargin; x < screenMargin + screenWidth; x += pixelSize) {
      for (let y = screenMargin; y < screenMargin + screenHeight; y += pixelSize) {
        resumePage.drawRectangle({
          x,
          y,
          width: 1,
          height: 1,
          color: darkGreen,
          opacity: 0.1,
        });
      }
    }

    // Resume content
    let currentY = height - 120;
    const lineHeight = 20;
    const sectionSpacing = 30;

    // Title
    resumePage.drawText("› RESUME", {
      x: screenMargin + 20,
      y: currentY,
      size: 24,
      font,
      color: darkGreen,
    });
    currentY -= lineHeight * 2;

    // Name and title
    resumePage.drawText(`› ${resumeData.about.name || 'Your Name'}`, {
      x: screenMargin + 20,
      y: currentY,
      size: 20,
      font,
      color: darkGreen,
    });
    currentY -= lineHeight;

    resumePage.drawText(`› ${resumeData.about.jobTitle || 'Your Title'}`, {
      x: screenMargin + 40,
      y: currentY,
      size: 16,
      font,
      color: darkGreen,
    });
    currentY -= sectionSpacing;

    // About section
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      resumePage.drawText("› About", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      const aboutLines = wrapText(resumeData.about.summary, font, 14, screenWidth - 40);
      aboutLines.forEach(line => {
        resumePage.drawText(line, {
          x: screenMargin + 40,
          y: currentY,
          size: 14,
          font,
          color: darkGreen,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      resumePage.drawText("› Experience", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      resumeData.experience.forEach((job: any) => {
        const role = job.role || 'Role';
        const company = job.company || 'Company';
        resumePage.drawText(`${role} at ${company}`, {
          x: screenMargin + 40,
          y: currentY,
          size: 16,
          font,
          color: darkGreen,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      resumePage.drawText("› Skills", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      const skillsText = resumeData.skills.map((s: any) => s.name || 'Skill').join(' / ');
      resumePage.drawText(skillsText, {
        x: screenMargin + 40,
        y: currentY,
        size: 14,
        font,
        color: darkGreen,
      });
      currentY -= sectionSpacing;
    }

    // Education section
    if (resumeData.education && resumeData.education.length > 0) {
      resumePage.drawText("› Education", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      resumeData.education.forEach((edu: any) => {
        const degree = edu.degree || 'Degree';
        const institution = edu.institution || 'Institution';
        resumePage.drawText(`${degree} - ${institution}`, {
          x: screenMargin + 40,
          y: currentY,
          size: 16,
          font,
          color: darkGreen,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Portfolio section
    if (resumeData.portfolio && resumeData.portfolio.length > 0) {
      resumePage.drawText("› Portfolio", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      resumeData.portfolio.forEach((item: any) => {
        const title = item.title || 'Project';
        resumePage.drawText(title, {
          x: screenMargin + 40,
          y: currentY,
          size: 16,
          font,
          color: darkGreen,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Contact section
    if (resumeData.contact && (resumeData.contact.email || resumeData.contact.phone)) {
      resumePage.drawText("› Contact", {
        x: screenMargin + 20,
        y: currentY,
        size: 20,
        font,
        color: darkGreen,
      });
      currentY -= lineHeight;

      const email = resumeData.contact.email || '';
      const phone = resumeData.contact.phone || '';
      const contactText = email && phone ? `${email} | ${phone}` : email || phone;
      resumePage.drawText(contactText, {
        x: screenMargin + 40,
        y: currentY,
        size: 14,
        font,
        color: darkGreen,
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-snakebite.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating snakebite resume PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  // Clean the text by replacing newlines with spaces and removing extra whitespace
  const cleanText = text.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
} 