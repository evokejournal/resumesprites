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
    
    // Colors matching the Windows template
    const white = rgb(1, 1, 1);
    const black = rgb(0, 0, 0);
    const teal = rgb(0, 0.5, 0.5);
    const winGray = rgb(0.9, 0.9, 0.9);
    const darkGray = rgb(0.4, 0.4, 0.4);

    // Create cover letter page first
    const coverLetterPage = pdfDoc.addPage([width, height]);
    coverLetterPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: teal,
    });

    // Cover letter window
    const windowMargin = 50;
    const windowWidth = width - (windowMargin * 2);
    const windowHeight = height - (windowMargin * 2);
    const titleBarHeight = 30;
    
    coverLetterPage.drawRectangle({
      x: windowMargin - 2,
      y: windowMargin - 2,
      width: windowWidth + 4,
      height: windowHeight + 4,
      color: darkGray,
    });
    
    coverLetterPage.drawRectangle({
      x: windowMargin,
      y: windowMargin,
      width: windowWidth,
      height: windowHeight,
      color: winGray,
    });

    // Cover letter title bar
    coverLetterPage.drawRectangle({
      x: windowMargin,
      y: height - windowMargin - titleBarHeight,
      width: windowWidth,
      height: titleBarHeight,
      color: teal,
    });

    coverLetterPage.drawText("Cover Letter - " + (resumeData.about.name || 'Your Name'), {
      x: windowMargin + 10,
      y: height - windowMargin - 20,
      size: 14,
      font,
      color: white,
    });

    // Cover letter content
    let coverY = height - windowMargin - titleBarHeight - 40;
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

    const coverLines = wrapText(coverLetterText, font, 14, windowWidth - 40);
    coverLines.forEach(line => {
      if (coverY > windowMargin + 40) {
        coverLetterPage.drawText(line, {
          x: windowMargin + 20,
          y: coverY,
          size: 14,
          font,
          color: black,
        });
        coverY -= coverLineHeight;
      }
    });

    // Create Windows-style resume page second
    const resumePage = pdfDoc.addPage([width, height]);
    resumePage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: teal,
    });

    // Resume window
    resumePage.drawRectangle({
      x: windowMargin - 2,
      y: windowMargin - 2,
      width: windowWidth + 4,
      height: windowHeight + 4,
      color: darkGray,
    });
    
    resumePage.drawRectangle({
      x: windowMargin,
      y: windowMargin,
      width: windowWidth,
      height: windowHeight,
      color: winGray,
    });

    // Resume title bar
    resumePage.drawRectangle({
      x: windowMargin,
      y: height - windowMargin - titleBarHeight,
      width: windowWidth,
      height: titleBarHeight,
      color: teal,
    });

    resumePage.drawText("Resume - " + (resumeData.about.name || 'Your Name'), {
      x: windowMargin + 10,
      y: height - windowMargin - 20,
      size: 14,
      font,
      color: white,
    });

    // Resume content
    let currentY = height - windowMargin - titleBarHeight - 40;
    const lineHeight = 20;
    const sectionSpacing = 30;

    // Name and title
    resumePage.drawText(resumeData.about.name || 'Your Name', {
      x: windowMargin + 20,
      y: currentY,
      size: 24,
      font,
      color: black,
    });
    currentY -= lineHeight;

    resumePage.drawText(resumeData.about.jobTitle || 'Your Title', {
      x: windowMargin + 20,
      y: currentY,
      size: 18,
      font,
      color: black,
    });
    currentY -= sectionSpacing;

    // About section
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      // Section header
      resumePage.drawRectangle({
        x: windowMargin + 20,
        y: currentY - 25,
        width: windowWidth - 40,
        height: 25,
        color: winGray,
        borderWidth: 1,
        borderColor: black,
      });

      resumePage.drawText("About", {
        x: windowMargin + 25,
        y: currentY - 10,
        size: 16,
        font,
        color: black,
      });
      currentY -= 35;

      const aboutLines = wrapText(resumeData.about.summary, font, 14, windowWidth - 40);
      aboutLines.forEach(line => {
        resumePage.drawText(line, {
          x: windowMargin + 30,
          y: currentY,
          size: 14,
          font,
          color: black,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      // Section header
      resumePage.drawRectangle({
        x: windowMargin + 20,
        y: currentY - 25,
        width: windowWidth - 40,
        height: 25,
        color: winGray,
        borderWidth: 1,
        borderColor: black,
      });

      resumePage.drawText("Experience", {
        x: windowMargin + 25,
        y: currentY - 10,
        size: 16,
        font,
        color: black,
      });
      currentY -= 35;

      resumeData.experience.forEach((job: any) => {
        const role = job.role || 'Role';
        const company = job.company || 'Company';
        resumePage.drawText(`${role} at ${company}`, {
          x: windowMargin + 30,
          y: currentY,
          size: 16,
          font,
          color: black,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      // Section header
      resumePage.drawRectangle({
        x: windowMargin + 20,
        y: currentY - 25,
        width: windowWidth - 40,
        height: 25,
        color: winGray,
        borderWidth: 1,
        borderColor: black,
      });

      resumePage.drawText("Skills", {
        x: windowMargin + 25,
        y: currentY - 10,
        size: 16,
        font,
        color: black,
      });
      currentY -= 35;

      const skillsText = resumeData.skills.map((s: any) => s.name || 'Skill').join(', ');
      resumePage.drawText(skillsText, {
        x: windowMargin + 30,
        y: currentY,
        size: 14,
        font,
        color: black,
      });
      currentY -= sectionSpacing;
    }

    // Education section
    if (resumeData.education && resumeData.education.length > 0) {
      // Section header
      resumePage.drawRectangle({
        x: windowMargin + 20,
        y: currentY - 25,
        width: windowWidth - 40,
        height: 25,
        color: winGray,
        borderWidth: 1,
        borderColor: black,
      });

      resumePage.drawText("Education", {
        x: windowMargin + 25,
        y: currentY - 10,
        size: 16,
        font,
        color: black,
      });
      currentY -= 35;

      resumeData.education.forEach((edu: any) => {
        const degree = edu.degree || 'Degree';
        const institution = edu.institution || 'Institution';
        resumePage.drawText(`${degree} - ${institution}`, {
          x: windowMargin + 30,
          y: currentY,
          size: 16,
          font,
          color: black,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Contact section
    if (resumeData.contact && (resumeData.contact.email || resumeData.contact.phone)) {
      // Section header
      resumePage.drawRectangle({
        x: windowMargin + 20,
        y: currentY - 25,
        width: windowWidth - 40,
        height: 25,
        color: winGray,
        borderWidth: 1,
        borderColor: black,
      });

      resumePage.drawText("Contact", {
        x: windowMargin + 25,
        y: currentY - 10,
        size: 16,
        font,
        color: black,
      });
      currentY -= 35;

      const email = resumeData.contact.email || '';
      const phone = resumeData.contact.phone || '';
      const contactText = email && phone ? `${email} | ${phone}` : email || phone;
      resumePage.drawText(contactText, {
        x: windowMargin + 30,
        y: currentY,
        size: 14,
        font,
        color: black,
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-explosive.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating explosive potential PDF:', error);
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