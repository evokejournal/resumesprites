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
    
    // Colors matching the search engine template
    const white = rgb(1, 1, 1);
    const blue = rgb(0.2, 0.4, 1);
    const green = rgb(0.1, 0.6, 0.1);
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.95, 0.95, 0.95);

    // Create cover letter page first
    const coverLetterPage = pdfDoc.addPage([width, height]);
    coverLetterPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: white,
    });

    // Cover letter header
    coverLetterPage.drawRectangle({
      x: 0,
      y: height - 80,
      width,
      height: 80,
      color: lightGray,
    });

    // Youble logo on cover letter page
    const logoText = "Youble";
    coverLetterPage.drawText(logoText, {
      x: 50,
      y: height - 60,
      size: 24,
      font,
      color: blue,
    });

    // Cover letter search result
    coverLetterPage.drawText("Cover Letter | " + (resumeData.about.name || 'Your Name'), {
      x: 50,
      y: height - 120,
      size: 16,
      font,
      color: blue,
    });

    coverLetterPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+cover-letter`, {
      x: 50,
      y: height - 135,
      size: 12,
      font,
      color: green,
    });

    // Cover letter content
    let coverY = height - 160;
    const coverLineHeight = 16;

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

    const coverLines = wrapText(coverLetterText, font, 12, width - 100);
    coverLines.forEach(line => {
      if (coverY > 50) {
        coverLetterPage.drawText(line, {
          x: 50,
          y: coverY,
          size: 12,
          font,
          color: gray,
        });
        coverY -= coverLineHeight;
      }
    });

    // Create search results page second
    const searchPage = pdfDoc.addPage([width, height]);
    searchPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: white,
    });

    // Header
    searchPage.drawRectangle({
      x: 0,
      y: height - 80,
      width,
      height: 80,
      color: lightGray,
    });

    // Youble logo
    searchPage.drawText(logoText, {
      x: 50,
      y: height - 60,
      size: 24,
      font,
      color: blue,
    });

    // Search bar
    const searchQuery = resumeData.about.name || 'Your Name';
    searchPage.drawRectangle({
      x: 200,
      y: height - 70,
      width: 300,
      height: 40,
      color: white,
    });

    searchPage.drawText(searchQuery, {
      x: 220,
      y: height - 55,
      size: 16,
      font,
      color: gray,
    });

    // Search results
    let currentY = height - 120;
    const resultSpacing = 80;

    // About result
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      searchPage.drawText("About " + (resumeData.about.name || 'Your Name'), {
        x: 50,
        y: currentY,
        size: 16,
        font,
        color: blue,
      });

      searchPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+about`, {
        x: 50,
        y: currentY - 15,
        size: 12,
        font,
        color: green,
      });

      const aboutLines = wrapText(resumeData.about.summary, font, 12, width - 100);
      aboutLines.forEach((line, index) => {
        if (index < 3) { // Limit to 3 lines
          searchPage.drawText(line, {
            x: 50,
            y: currentY - 35 - (index * 14),
            size: 12,
            font,
            color: gray,
          });
        }
      });

      currentY -= resultSpacing;
    }

    // Experience result
    if (resumeData.experience && resumeData.experience.length > 0) {
      searchPage.drawText("Professional Experience", {
        x: 50,
        y: currentY,
        size: 16,
        font,
        color: blue,
      });

      searchPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+experience`, {
        x: 50,
        y: currentY - 15,
        size: 12,
        font,
        color: green,
      });

      const experienceText = resumeData.experience.map((job: any) => 
        `${job.role || 'Role'} at ${job.company || 'Company'}`
      ).join(' ... ');

      searchPage.drawText(experienceText, {
        x: 50,
        y: currentY - 35,
        size: 12,
        font,
        color: gray,
      });

      currentY -= resultSpacing;
    }

    // Skills result
    if (resumeData.skills && resumeData.skills.length > 0) {
      searchPage.drawText("Skills and Expertise", {
        x: 50,
        y: currentY,
        size: 16,
        font,
        color: blue,
      });

      searchPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+skills`, {
        x: 50,
        y: currentY - 15,
        size: 12,
        font,
        color: green,
      });

      const skillsText = `Core competencies include: ${resumeData.skills.slice(0, 5).map((s: any) => s.name || 'Skill').join(', ')} and more.`;
      searchPage.drawText(skillsText, {
        x: 50,
        y: currentY - 35,
        size: 12,
        font,
        color: gray,
      });

      currentY -= resultSpacing;
    }

    // Education result
    if (resumeData.education && resumeData.education.length > 0) {
      searchPage.drawText("Education and Qualifications", {
        x: 50,
        y: currentY,
        size: 16,
        font,
        color: blue,
      });

      searchPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+education`, {
        x: 50,
        y: currentY - 15,
        size: 12,
        font,
        color: green,
      });

      const educationText = resumeData.education.map((edu: any) => 
        `${edu.degree || 'Degree'}, ${edu.institution || 'Institution'}`
      ).join(' ... ');

      searchPage.drawText(educationText, {
        x: 50,
        y: currentY - 35,
        size: 12,
        font,
        color: gray,
      });

      currentY -= resultSpacing;
    }

    // Portfolio result
    if (resumeData.portfolio && resumeData.portfolio.length > 0) {
      searchPage.drawText("Portfolio Projects", {
        x: 50,
        y: currentY,
        size: 16,
        font,
        color: blue,
      });

      searchPage.drawText(`https://youble.com/search?q=${(resumeData.about.name || 'your-name').toLowerCase().replace(' ', '-')}+portfolio`, {
        x: 50,
        y: currentY - 15,
        size: 12,
        font,
        color: green,
      });

      const portfolioText = resumeData.portfolio.map((item: any) => 
        `${item.title || 'Project'}: ${item.description || 'Description'}`
      ).join(' ... ');

      searchPage.drawText(portfolioText, {
        x: 50,
        y: currentY - 35,
        size: 12,
        font,
        color: gray,
      });

      currentY -= resultSpacing;
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-goobleit.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating goobleit PDF:', error);
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