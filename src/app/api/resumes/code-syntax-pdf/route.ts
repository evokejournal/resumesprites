import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData } = body;
    
    if (!resumeData || !resumeData.about || !resumeData.about.name) {
      console.error('Invalid resume data:', body);
      return NextResponse.json({ error: 'Invalid resume data' }, { status: 400 });
    }
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    const { width, height } = page.getSize();
    
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
    const darkBg = rgb(0.12, 0.12, 0.12);
    const codeBg = rgb(0.15, 0.15, 0.15);
    const white = rgb(1, 1, 1);
    const green = rgb(0.2, 0.8, 0.2);
    const blue = rgb(0.2, 0.4, 1);
    const purple = rgb(0.8, 0.2, 0.8);
    const orange = rgb(1, 0.6, 0.2);
    const red = rgb(1, 0.2, 0.2);
    const gray = rgb(0.6, 0.6, 0.6);

    // Set dark background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: darkBg,
    });

    // Code container background
    page.drawRectangle({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      color: codeBg,
    });

    // Header section
    const headerY = height - 120;
    page.drawText("// My name is " + (resumeData.about.name || 'Your Name') + ", and this is my resume.", {
      x: 80,
      y: headerY,
      size: 14,
      font,
      color: gray,
    });

    // Profile picture placeholder
    page.drawCircle({
      x: 100,
      y: headerY - 60,
      size: 40,
      color: green,
      opacity: 0.3,
    });

    // "Hello, World!" title
    page.drawText("Hello, World!", {
      x: 160,
      y: headerY - 40,
      size: 32,
      font,
      color: green,
    });

    // Code content
    let currentY = headerY - 120;
    const lineHeight = 20;
    const lineNumberWidth = 40;

    // Function to draw a code line with line number
    const drawCodeLine = (lineNum: number, content: string, color: any = white) => {
      // Line number
      page.drawText(lineNum.toString().padStart(2, ' '), {
        x: 70,
        y: currentY,
        size: 12,
        font,
        color: gray,
      });
      
      // Content
      page.drawText(content, {
        x: 120,
        y: currentY,
        size: 12,
        font,
        color: color,
      });
      
      currentY -= lineHeight;
    };

    // Start of code
    drawCodeLine(1, "const candidate = {");
    
    // About section
    drawCodeLine(2, "  about: {");
    drawCodeLine(3, `    name: '${resumeData.about.name || 'Your Name'}',`, orange);
    drawCodeLine(4, `    title: '${resumeData.about.jobTitle || 'Your Title'}',`, orange);
    drawCodeLine(5, "  },");
    
    // Contact section
    drawCodeLine(6, "  contact: {");
    if (resumeData.contact?.email) {
      drawCodeLine(7, `    email: '${resumeData.contact.email}',`, orange);
    }
    if (resumeData.contact?.phone) {
      drawCodeLine(8, `    phone: '${resumeData.contact.phone}',`, orange);
    }
    drawCodeLine(9, "  },");
    
    // Summary as comment
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      drawCodeLine(10, "  /**");
      const summaryLines = resumeData.about.summary.split('\n');
      summaryLines.forEach((line: string, index: number) => {
        drawCodeLine(11 + index, `   * ${line}`, gray);
      });
      drawCodeLine(11 + summaryLines.length, "   */");
      currentY -= lineHeight;
    }

    // Experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      drawCodeLine(12, "  getExperience() {");
      drawCodeLine(13, "    return [");
      resumeData.experience.forEach((job: any, index: number) => {
        drawCodeLine(14 + (index * 6), "      {");
        drawCodeLine(15 + (index * 6), `        company: '${job.company || 'Company'}',`, orange);
        drawCodeLine(16 + (index * 6), `        role: '${job.role || 'Role'}',`, orange);
        drawCodeLine(17 + (index * 6), `        duration: '${job.startDate || 'Start'} - ${job.endDate || 'End'}',`, orange);
        drawCodeLine(18 + (index * 6), `        description: '${(job.description || 'Description').replace(/'/g, "\\'")}',`, orange);
        drawCodeLine(19 + (index * 6), "      },");
      });
      drawCodeLine(14 + (resumeData.experience.length * 6), "    ];");
      drawCodeLine(15 + (resumeData.experience.length * 6), "  },");
      currentY -= lineHeight;
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      drawCodeLine(16, "  skills: [");
      resumeData.skills.forEach((skill: any, index: number) => {
        drawCodeLine(17 + index, `    '${skill.name || 'Skill'}', // ${skill.level || 0}% proficiency`, orange);
      });
      drawCodeLine(17 + resumeData.skills.length, "  ],");
      currentY -= lineHeight;
    }

    // Education section
    if (resumeData.education && resumeData.education.length > 0) {
      drawCodeLine(18, "  getEducation() {");
      drawCodeLine(19, "    return [");
      resumeData.education.forEach((edu: any, index: number) => {
        drawCodeLine(20 + (index * 4), "      {");
        drawCodeLine(21 + (index * 4), `        degree: '${edu.degree || 'Degree'}',`, orange);
        drawCodeLine(22 + (index * 4), `        institution: '${edu.institution || 'Institution'}',`, orange);
        drawCodeLine(23 + (index * 4), "      },");
      });
      drawCodeLine(20 + (resumeData.education.length * 4), "    ];");
      drawCodeLine(21 + (resumeData.education.length * 4), "  },");
      currentY -= lineHeight;
    }

    // Portfolio section
    if (resumeData.portfolio && resumeData.portfolio.length > 0) {
      drawCodeLine(22, "  // Portfolio Projects");
      drawCodeLine(23, "  portfolio: [");
      resumeData.portfolio.forEach((item: any, index: number) => {
        drawCodeLine(24 + index, `    '${item.title || 'Project'}',`, orange);
      });
      drawCodeLine(24 + resumeData.portfolio.length, "  ],");
      currentY -= lineHeight;
    }

    // Custom section
    if (resumeData.custom && resumeData.custom.title && resumeData.custom.items && resumeData.custom.items.length > 0) {
      drawCodeLine(25, `  // ${resumeData.custom.title}`);
      drawCodeLine(26, "  getCustomSection() {");
      drawCodeLine(27, "    return `");
      resumeData.custom.items.forEach((item: any, index: number) => {
        drawCodeLine(28 + index, `      ${item.description || 'Custom item'}`, orange);
      });
      drawCodeLine(28 + resumeData.custom.items.length, "    `;");
      drawCodeLine(29 + resumeData.custom.items.length, "  },");
      currentY -= lineHeight;
    }

    // References section
    if (resumeData.references && resumeData.references.length > 0) {
      drawCodeLine(30, "  // References available upon request");
      drawCodeLine(31, "  references: [");
      resumeData.references.forEach((ref: any, index: number) => {
        drawCodeLine(32 + index, `    '${ref.name || 'Name'} - ${ref.relation || 'Relation'}',`, orange);
      });
      drawCodeLine(32 + resumeData.references.length, "  ],");
      currentY -= lineHeight;
    }

    // End of object
    drawCodeLine(33, "};");

    // Add cover letter page
    const coverLetterPage = pdfDoc.addPage([612, 792]);
    coverLetterPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: darkBg,
    });

    // Cover letter code container
    coverLetterPage.drawRectangle({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      color: codeBg,
    });

    // Cover letter header
    coverLetterPage.drawText("// Cover Letter for " + (resumeData.about.name || 'Your Name'), {
      x: 80,
      y: height - 100,
      size: 16,
      font,
      color: purple,
    });

    // Cover letter content as code
    let coverY = height - 140;
    const coverLineHeight = 16;

    const coverLetterText = resumeData.coverLetter || 
      `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in ${resumeData.about.jobTitle}, I believe I would be a valuable addition to your team.

Throughout my career, I have demonstrated a strong ability to deliver exceptional results and drive innovation. My experience includes diverse projects and challenges that have honed my skills and prepared me for this opportunity.

I am particularly drawn to this role because it aligns perfectly with my passion for excellence and innovation. I am excited about the possibility of contributing to your organization's success.

Thank you for considering my application. I look forward to discussing how my skills and experience can benefit your team.

Best regards,
${resumeData.about.name}
${resumeData.about.jobTitle}
${resumeData.contact?.email || ''}`;

    const coverLines = coverLetterText.split('\n');
    coverLines.forEach((line: string, index: number) => {
      if (coverY > 50) {
        // Line number
        coverLetterPage.drawText((index + 1).toString().padStart(2, ' '), {
          x: 70,
          y: coverY,
          size: 12,
          font,
          color: gray,
        });
        
        // Content
        coverLetterPage.drawText(line || ' ', {
          x: 120,
          y: coverY,
          size: 12,
          font,
          color: white,
        });
        
        coverY -= coverLineHeight;
      }
    });

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-code.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating code syntax PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
} 