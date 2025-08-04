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
    
    // Ensure all sections exist with fallbacks
    if (!resumeData.about) {
      resumeData.about = { name: 'Your Name', jobTitle: 'Your Title', summary: '', photo: '' };
    }
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
    
    // Colors matching the template
    const black = rgb(0, 0, 0);
    const white = rgb(1, 1, 1);
    const colors = [
      rgb(1, 1, 1), // White
      rgb(1, 1, 0), // Yellow
      rgb(1, 0, 0), // Red
      rgb(0, 0, 1), // Blue
      rgb(0, 1, 0), // Green
      rgb(0.5, 0, 0.5), // Purple
      rgb(1, 0.65, 0), // Orange
      rgb(0, 1, 1), // Cyan
      rgb(1, 0.41, 0.71), // Pink
      rgb(0.66, 0.66, 0.66), // Gray
    ];

    // Create cover letter page first
    const coverLetterPage = pdfDoc.addPage([width, height]);
    
    // Set black background for cover letter
    coverLetterPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: black,
    });

    // Cover letter header
    coverLetterPage.drawText("COVER LETTER", {
      x: (width - font.widthOfTextAtSize("COVER LETTER", 32)) / 2,
      y: height - 100,
      size: 32,
      font,
      color: white,
    });

    // Cover letter content
    let coverY = height - 150;
    const coverLineHeight = 18;

    coverLetterPage.drawText("Dear Hiring Manager,", {
      x: 50,
      y: coverY,
      size: 16,
      font,
      color: white,
    });
    coverY -= coverLineHeight * 2;

    const coverLetterText = resumeData.coverLetter || 
      `I am writing to express my strong interest in the position at your company. With my background in ${resumeData.about.jobTitle || 'my field'}, I believe I would be a valuable addition to your team.

Throughout my career, I have demonstrated a strong ability to deliver exceptional results and drive innovation. My experience includes diverse projects and challenges that have honed my skills and prepared me for this opportunity.

I am particularly drawn to this role because it aligns perfectly with my passion for excellence and innovation. I am excited about the possibility of contributing to your organization's success.

Thank you for considering my application. I look forward to discussing how my skills and experience can benefit your team.

Best regards,
${resumeData.about.name || 'Your Name'}
${resumeData.about.jobTitle || 'Your Title'}
${resumeData.contact?.email || ''}`;

    const coverLines = wrapText(coverLetterText, font, 14, width - 100);
    coverLines.forEach(line => {
      if (coverY > 50) {
        coverLetterPage.drawText(line, {
          x: 50,
          y: coverY,
          size: 14,
          font,
          color: white,
        });
        coverY -= coverLineHeight;
      }
    });

    // Create resume page second
    const resumePage = pdfDoc.addPage([width, height]);
    
    // Set black background for resume
    resumePage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: black,
    });

    // Draw bouncing logo at the top (matching template design)
    const logoColor = colors[0]; // White
    const logoWidth = 200;
    const logoHeight = 100;
    const logoX = (width - logoWidth) / 2;
    const logoY = height - 150;

    // Draw logo background (simplified version)
    resumePage.drawRectangle({
      x: logoX,
      y: logoY,
      width: logoWidth,
      height: logoHeight,
      color: logoColor,
      opacity: 0.1,
    });

    // Draw name in logo (split first and last name)
    const nameParts = (resumeData.about.name || 'Your Name').split(' ');
    const firstName = nameParts[0] || 'Your';
    const lastName = nameParts.slice(1).join(' ') || 'Name';
    
    const nameFontSize = 24;
    const firstNameText = firstName.toUpperCase();
    const lastNameText = lastName.toUpperCase();
    
    // Draw first name
    const firstNameWidth = font.widthOfTextAtSize(firstNameText, nameFontSize);
    resumePage.drawText(firstNameText, {
      x: logoX + (logoWidth - firstNameWidth) / 2,
      y: logoY + 60,
      size: nameFontSize,
      font,
      color: logoColor,
    });

    // Draw last name
    const lastNameWidth = font.widthOfTextAtSize(lastNameText, nameFontSize);
    resumePage.drawText(lastNameText, {
      x: logoX + (logoWidth - lastNameWidth) / 2,
      y: logoY + 35,
      size: nameFontSize,
      font,
      color: logoColor,
    });

    // Draw "RESUME" text in the curved area
    const resumeText = "RESUME";
    const resumeFontSize = 16;
    const resumeWidth = font.widthOfTextAtSize(resumeText, resumeFontSize);
    resumePage.drawText(resumeText, {
      x: logoX + (logoWidth - resumeWidth) / 2,
      y: logoY + 10,
      size: resumeFontSize,
      font,
      color: black,
    });

    // Draw resume content sections
    let currentY = logoY - 50;
    const lineHeight = 20;
    const sectionSpacing = 30;

    // Name and title
    resumePage.drawText(resumeData.about.name || 'Your Name', {
      x: 50,
      y: currentY,
      size: 28,
      font,
      color: white,
    });
    currentY -= lineHeight;

    resumePage.drawText(resumeData.about.jobTitle || 'Your Title', {
      x: 50,
      y: currentY,
      size: 18,
      font,
      color: white,
    });
    currentY -= sectionSpacing;

    // About section
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      resumePage.drawText("ABOUT ME", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      const aboutLines = wrapText(resumeData.about.summary, font, 16, width - 100);
      aboutLines.forEach(line => {
        resumePage.drawText(line, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      resumePage.drawText("EXPERIENCE", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      resumeData.experience.forEach((job: any) => {
        const role = job.role || 'Role';
        const company = job.company || 'Company';
        const startDate = job.startDate || '';
        const endDate = job.endDate || 'Present';
        const description = job.description || '';
        
        // Job title and company
        resumePage.drawText(`${role} at ${company}`, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
        
        // Dates
        if (startDate || endDate) {
          const dateText = `${startDate} - ${endDate}`;
          resumePage.drawText(dateText, {
            x: 50,
            y: currentY,
            size: 14,
            font,
            color: white,
          });
          currentY -= lineHeight;
        }
        
        // Description
        if (description) {
          const descLines = wrapText(description, font, 14, width - 100);
          descLines.forEach(line => {
            resumePage.drawText(line, {
              x: 70,
              y: currentY,
              size: 14,
              font,
              color: white,
            });
            currentY -= lineHeight;
          });
        }
        currentY -= 10; // Extra spacing between jobs
      });
      currentY -= sectionSpacing;
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      resumePage.drawText("SKILLS", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      const skillsText = resumeData.skills.map((s: any) => s.name || 'Skill').join(' / ');
      const skillsLines = wrapText(skillsText, font, 16, width - 100);
      skillsLines.forEach(line => {
        resumePage.drawText(line, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
      });
      currentY -= sectionSpacing;
    }

    // Education section
    if (resumeData.education && resumeData.education.length > 0) {
      resumePage.drawText("EDUCATION", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      resumeData.education.forEach((edu: any) => {
        const degree = edu.degree || 'Degree';
        const institution = edu.institution || 'Institution';
        const startDate = edu.startDate || '';
        const endDate = edu.endDate || '';
        
        resumePage.drawText(`${degree} - ${institution}`, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
        
        if (startDate || endDate) {
          const dateText = `${startDate} - ${endDate}`;
          resumePage.drawText(dateText, {
            x: 50,
            y: currentY,
            size: 14,
            font,
            color: white,
          });
          currentY -= lineHeight;
        }
      });
      currentY -= sectionSpacing;
    }

    // Portfolio section
    if (resumeData.portfolio && resumeData.portfolio.length > 0) {
      resumePage.drawText("PORTFOLIO", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      resumeData.portfolio.forEach((project: any) => {
        const title = project.title || 'Project';
        const description = project.description || '';
        const url = project.url || '';
        
        resumePage.drawText(title, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
        
        if (description) {
          const descLines = wrapText(description, font, 14, width - 100);
          descLines.forEach(line => {
            resumePage.drawText(line, {
              x: 70,
              y: currentY,
              size: 14,
              font,
              color: white,
            });
            currentY -= lineHeight;
          });
        }
        
        if (url) {
          resumePage.drawText(`URL: ${url}`, {
            x: 70,
            y: currentY,
            size: 14,
            font,
            color: white,
          });
          currentY -= lineHeight;
        }
        currentY -= 10; // Extra spacing between projects
      });
      currentY -= sectionSpacing;
    }

    // References section
    if (resumeData.references && resumeData.references.length > 0) {
      resumePage.drawText("REFERENCES", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      resumeData.references.forEach((ref: any) => {
        const name = ref.name || 'Name';
        const relation = ref.relation || 'Relation';
        const contact = ref.contact || '';
        
        resumePage.drawText(`${name} (${relation})`, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
        
        if (contact) {
          resumePage.drawText(contact, {
            x: 70,
            y: currentY,
            size: 14,
            font,
            color: white,
          });
          currentY -= lineHeight;
        }
      });
      currentY -= sectionSpacing;
    }

    // Custom section
    if (resumeData.custom && resumeData.custom.title && resumeData.custom.items.length > 0) {
      resumePage.drawText(resumeData.custom.title.toUpperCase(), {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      resumeData.custom.items.forEach((item: any) => {
        const description = item.description || '';
        const descLines = wrapText(description, font, 16, width - 100);
        descLines.forEach(line => {
          resumePage.drawText(line, {
            x: 50,
            y: currentY,
            size: 16,
            font,
            color: white,
          });
          currentY -= lineHeight;
        });
      });
      currentY -= sectionSpacing;
    }

    // Contact section
    if (resumeData.contact && (resumeData.contact.email || resumeData.contact.phone || resumeData.contact.website || resumeData.contact.location)) {
      resumePage.drawText("CONTACT", {
        x: 50,
        y: currentY,
        size: 20,
        font,
        color: white,
      });
      currentY -= lineHeight;

      const contactInfo = [];
      if (resumeData.contact.email) contactInfo.push(resumeData.contact.email);
      if (resumeData.contact.phone) contactInfo.push(resumeData.contact.phone);
      if (resumeData.contact.website) contactInfo.push(resumeData.contact.website);
      if (resumeData.contact.location) contactInfo.push(resumeData.contact.location);
      
      const contactText = contactInfo.join(' | ');
      const contactLines = wrapText(contactText, font, 16, width - 100);
      contactLines.forEach(line => {
        resumePage.drawText(line, {
          x: 50,
          y: currentY,
          size: 16,
          font,
          color: white,
        });
        currentY -= lineHeight;
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-bouncing.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating bouncing resume PDF:', error);
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