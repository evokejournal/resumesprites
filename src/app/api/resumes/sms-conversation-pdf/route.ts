import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('SMS PDF request body:', JSON.stringify(body, null, 2));
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
    
    // Colors matching the template
    const white = rgb(1, 1, 1);
    const blue = rgb(0.2, 0.6, 1);
    const gray = rgb(0.9, 0.9, 0.9);
    const darkGray = rgb(0.4, 0.4, 0.4);

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
    coverLetterPage.drawText("COVER LETTER", {
      x: (width - font.widthOfTextAtSize("COVER LETTER", 24)) / 2,
      y: height - 80,
      size: 24,
      font,
      color: blue,
    });

    // Cover letter content in SMS style
    let coverY = height - 120;
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
    const coverBubbleHeight = coverLines.length * 16 + 40;
    
    // Cover letter bubble
    coverLetterPage.drawRectangle({
      x: 50,
      y: coverY - coverBubbleHeight,
      width: width - 100,
      height: coverBubbleHeight,
      color: blue,
    });
    
    coverLines.forEach((line, index) => {
      if (coverY > 50) {
        coverLetterPage.drawText(line, {
          x: 70,
          y: coverY - 30 - (index * 16),
          size: 12,
          font,
          color: white,
        });
      }
    });

    // Create SMS conversation page second
    const conversationPage = pdfDoc.addPage([width, height]);
    conversationPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: white,
    });

    // Header section
    const headerY = height - 100;
    conversationPage.drawRectangle({
      x: 50,
      y: headerY - 60,
      width: width - 100,
      height: 80,
      color: gray,
    });

    // Profile picture placeholder
    conversationPage.drawCircle({
      x: 80,
      y: headerY - 20,
      size: 30,
      color: darkGray,
    });

    // Name and status
    conversationPage.drawText(resumeData.about.name || 'Your Name', {
      x: 130,
      y: headerY - 10,
      size: 20,
      font,
      color: darkGray,
    });

    conversationPage.drawText("Online", {
      x: 130,
      y: headerY - 30,
      size: 14,
      font,
      color: rgb(0.2, 0.8, 0.2),
    });

    // Conversation bubbles
    let currentY = headerY - 120;
    const bubblePadding = 20;
    const maxBubbleWidth = width - 150;

    // Recruiter message
    const recruiterMsg = `Hi there! I came across your profile. I'm looking for a top-tier ${resumeData.about.jobTitle || 'professional'}. Is that you?`;
    const recruiterLines = wrapText(recruiterMsg, font, 12, maxBubbleWidth - 40);
    const recruiterBubbleHeight = recruiterLines.length * 16 + 20;
    
    // Recruiter bubble (gray)
    conversationPage.drawRectangle({
      x: 50,
      y: currentY - recruiterBubbleHeight,
      width: Math.min(font.widthOfTextAtSize(recruiterMsg, 12) + 40, maxBubbleWidth),
      height: recruiterBubbleHeight,
      color: gray,
    });
    
    recruiterLines.forEach((line, index) => {
      conversationPage.drawText(line, {
        x: 70,
        y: currentY - 20 - (index * 16),
        size: 12,
        font,
        color: darkGray,
      });
    });

    currentY -= recruiterBubbleHeight + 20;

    // Candidate response
    const candidateMsg = `Hello! Yes, that's me. I'm ${resumeData.about.name || 'Your Name'}, a passionate ${resumeData.about.jobTitle || 'professional'}. It's great to connect!`;
    const candidateLines = wrapText(candidateMsg, font, 12, maxBubbleWidth - 40);
    const candidateBubbleHeight = candidateLines.length * 16 + 20;
    const candidateBubbleWidth = Math.min(font.widthOfTextAtSize(candidateMsg, 12) + 40, maxBubbleWidth);
    
    // Candidate bubble (blue, right-aligned)
    conversationPage.drawRectangle({
      x: width - 50 - candidateBubbleWidth,
      y: currentY - candidateBubbleHeight,
      width: candidateBubbleWidth,
      height: candidateBubbleHeight,
      color: blue,
    });
    
    candidateLines.forEach((line, index) => {
      conversationPage.drawText(line, {
        x: width - 50 - candidateBubbleWidth + 20,
        y: currentY - 20 - (index * 16),
        size: 12,
        font,
        color: white,
      });
    });

    currentY -= candidateBubbleHeight + 20;

    // About summary
    if (resumeData.about.summary && resumeData.about.summary.trim()) {
      const summaryLines = wrapText(resumeData.about.summary, font, 12, maxBubbleWidth - 40);
      const summaryBubbleHeight = summaryLines.length * 16 + 20;
      const summaryBubbleWidth = Math.min(font.widthOfTextAtSize(resumeData.about.summary, 12) + 40, maxBubbleWidth);
      
      conversationPage.drawRectangle({
        x: width - 50 - summaryBubbleWidth,
        y: currentY - summaryBubbleHeight,
        width: summaryBubbleWidth,
        height: summaryBubbleHeight,
        color: blue,
      });
      
      summaryLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: width - 50 - summaryBubbleWidth + 20,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: white,
        });
      });

      currentY -= summaryBubbleHeight + 20;
    }

    // Experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceMsg = "Impressive summary. Can you walk me through your experience?";
      const expLines = wrapText(experienceMsg, font, 12, maxBubbleWidth - 40);
      const expBubbleHeight = expLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - expBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(experienceMsg, 12) + 40, maxBubbleWidth),
        height: expBubbleHeight,
        color: gray,
      });
      
      expLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= expBubbleHeight + 20;

      // Experience items
      resumeData.experience.forEach((job: any) => {
        const role = job.role || 'Role';
        const company = job.company || 'Company';
        const startDate = job.startDate || 'Start';
        const endDate = job.endDate || 'End';
        const description = job.description || 'Description';
        const jobMsg = `${role} at ${company}\n${startDate} - ${endDate}\n${description}`;
        const jobLines = wrapText(jobMsg, font, 12, maxBubbleWidth - 40);
        const jobBubbleHeight = jobLines.length * 16 + 20;
        const jobBubbleWidth = Math.min(font.widthOfTextAtSize(jobMsg, 12) + 40, maxBubbleWidth);
        
        conversationPage.drawRectangle({
          x: width - 50 - jobBubbleWidth,
          y: currentY - jobBubbleHeight,
          width: jobBubbleWidth,
          height: jobBubbleHeight,
          color: blue,
        });
        
        jobLines.forEach((line, index) => {
          conversationPage.drawText(line, {
            x: width - 50 - jobBubbleWidth + 20,
            y: currentY - 20 - (index * 16),
            size: 12,
            font,
            color: white,
          });
        });

        currentY -= jobBubbleHeight + 20;
      });
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsMsg = "Solid background. What are your core skills?";
      const skillsQLines = wrapText(skillsMsg, font, 12, maxBubbleWidth - 40);
      const skillsQBubbleHeight = skillsQLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - skillsQBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(skillsMsg, 12) + 40, maxBubbleWidth),
        height: skillsQBubbleHeight,
        color: gray,
      });
      
      skillsQLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= skillsQBubbleHeight + 20;

      const skillsText = resumeData.skills.map((s: any) => s.name || 'Skill').join(', ');
      const skillsLines = wrapText(skillsText, font, 12, maxBubbleWidth - 40);
      const skillsBubbleHeight = skillsLines.length * 16 + 20;
      const skillsBubbleWidth = Math.min(font.widthOfTextAtSize(skillsText, 12) + 40, maxBubbleWidth);
      
      conversationPage.drawRectangle({
        x: width - 50 - skillsBubbleWidth,
        y: currentY - skillsBubbleHeight,
        width: skillsBubbleWidth,
        height: skillsBubbleHeight,
        color: blue,
      });
      
      skillsLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: width - 50 - skillsBubbleWidth + 20,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: white,
        });
      });

      currentY -= skillsBubbleHeight + 20;
    }

    // Education section
    if (resumeData.education && resumeData.education.length > 0) {
      const educationMsg = "Great skills! What about your education background?";
      const eduQLines = wrapText(educationMsg, font, 12, maxBubbleWidth - 40);
      const eduQBubbleHeight = eduQLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - eduQBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(educationMsg, 12) + 40, maxBubbleWidth),
        height: eduQBubbleHeight,
        color: gray,
      });
      
      eduQLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= eduQBubbleHeight + 20;

      // Education items
      resumeData.education.forEach((edu: any) => {
        const degree = edu.degree || 'Degree';
        const institution = edu.institution || 'Institution';
        const startDate = edu.startDate || 'Start';
        const endDate = edu.endDate || 'End';
        const eduMsg = `${degree} from ${institution}\n${startDate} - ${endDate}`;
        const eduLines = wrapText(eduMsg, font, 12, maxBubbleWidth - 40);
        const eduBubbleHeight = eduLines.length * 16 + 20;
        const eduBubbleWidth = Math.min(font.widthOfTextAtSize(eduMsg, 12) + 40, maxBubbleWidth);
        
        conversationPage.drawRectangle({
          x: width - 50 - eduBubbleWidth,
          y: currentY - eduBubbleHeight,
          width: eduBubbleWidth,
          height: eduBubbleHeight,
          color: blue,
        });
        
        eduLines.forEach((line, index) => {
          conversationPage.drawText(line, {
            x: width - 50 - eduBubbleWidth + 20,
            y: currentY - 20 - (index * 16),
            size: 12,
            font,
            color: white,
          });
        });

        currentY -= eduBubbleHeight + 20;
      });
    }

    // Portfolio section
    if (resumeData.portfolio && resumeData.portfolio.length > 0) {
      const portfolioMsg = "Impressive! Do you have any portfolio projects to showcase?";
      const portfolioQLines = wrapText(portfolioMsg, font, 12, maxBubbleWidth - 40);
      const portfolioQBubbleHeight = portfolioQLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - portfolioQBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(portfolioMsg, 12) + 40, maxBubbleWidth),
        height: portfolioQBubbleHeight,
        color: gray,
      });
      
      portfolioQLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= portfolioQBubbleHeight + 20;

      // Portfolio items
      resumeData.portfolio.forEach((project: any) => {
        const title = project.title || 'Project';
        const description = project.description || '';
        const url = project.url || '';
        const projectMsg = `${title}\n${description}${url ? `\nURL: ${url}` : ''}`;
        const projectLines = wrapText(projectMsg, font, 12, maxBubbleWidth - 40);
        const projectBubbleHeight = projectLines.length * 16 + 20;
        const projectBubbleWidth = Math.min(font.widthOfTextAtSize(projectMsg, 12) + 40, maxBubbleWidth);
        
        conversationPage.drawRectangle({
          x: width - 50 - projectBubbleWidth,
          y: currentY - projectBubbleHeight,
          width: projectBubbleWidth,
          height: projectBubbleHeight,
          color: blue,
        });
        
        projectLines.forEach((line, index) => {
          conversationPage.drawText(line, {
            x: width - 50 - projectBubbleWidth + 20,
            y: currentY - 20 - (index * 16),
            size: 12,
            font,
            color: white,
          });
        });

        currentY -= projectBubbleHeight + 20;
      });
    }

    // References section
    if (resumeData.references && resumeData.references.length > 0) {
      const referencesMsg = "Excellent work! Can you provide some references?";
      const refQLines = wrapText(referencesMsg, font, 12, maxBubbleWidth - 40);
      const refQBubbleHeight = refQLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - refQBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(referencesMsg, 12) + 40, maxBubbleWidth),
        height: refQBubbleHeight,
        color: gray,
      });
      
      refQLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= refQBubbleHeight + 20;

      // References items
      resumeData.references.forEach((ref: any) => {
        const name = ref.name || 'Name';
        const relation = ref.relation || 'Relation';
        const contact = ref.contact || '';
        const refMsg = `${name} (${relation})${contact ? `\n${contact}` : ''}`;
        const refLines = wrapText(refMsg, font, 12, maxBubbleWidth - 40);
        const refBubbleHeight = refLines.length * 16 + 20;
        const refBubbleWidth = Math.min(font.widthOfTextAtSize(refMsg, 12) + 40, maxBubbleWidth);
        
        conversationPage.drawRectangle({
          x: width - 50 - refBubbleWidth,
          y: currentY - refBubbleHeight,
          width: refBubbleWidth,
          height: refBubbleHeight,
          color: blue,
        });
        
        refLines.forEach((line, index) => {
          conversationPage.drawText(line, {
            x: width - 50 - refBubbleWidth + 20,
            y: currentY - 20 - (index * 16),
            size: 12,
            font,
            color: white,
          });
        });

        currentY -= refBubbleHeight + 20;
      });
    }

    // Custom section
    if (resumeData.custom && resumeData.custom.title && resumeData.custom.items.length > 0) {
      const customMsg = `Tell me about your ${resumeData.custom.title.toLowerCase()}.`;
      const customQLines = wrapText(customMsg, font, 12, maxBubbleWidth - 40);
      const customQBubbleHeight = customQLines.length * 16 + 20;
      
      conversationPage.drawRectangle({
        x: 50,
        y: currentY - customQBubbleHeight,
        width: Math.min(font.widthOfTextAtSize(customMsg, 12) + 40, maxBubbleWidth),
        height: customQBubbleHeight,
        color: gray,
      });
      
      customQLines.forEach((line, index) => {
        conversationPage.drawText(line, {
          x: 70,
          y: currentY - 20 - (index * 16),
          size: 12,
          font,
          color: darkGray,
        });
      });

      currentY -= customQBubbleHeight + 20;

      // Custom items
      resumeData.custom.items.forEach((item: any) => {
        const description = item.description || '';
        const customLines = wrapText(description, font, 12, maxBubbleWidth - 40);
        const customBubbleHeight = customLines.length * 16 + 20;
        const customBubbleWidth = Math.min(font.widthOfTextAtSize(description, 12) + 40, maxBubbleWidth);
        
        conversationPage.drawRectangle({
          x: width - 50 - customBubbleWidth,
          y: currentY - customBubbleHeight,
          width: customBubbleWidth,
          height: customBubbleHeight,
          color: blue,
        });
        
        customLines.forEach((line, index) => {
          conversationPage.drawText(line, {
            x: width - 50 - customBubbleWidth + 20,
            y: currentY - 20 - (index * 16),
            size: 12,
            font,
            color: white,
          });
        });

        currentY -= customBubbleHeight + 20;
      });
    }

    // Final message
    const finalMsg = "Perfect! I'm very impressed with your background. Let's schedule an interview!";
    const finalLines = wrapText(finalMsg, font, 12, maxBubbleWidth - 40);
    const finalBubbleHeight = finalLines.length * 16 + 20;
    
    conversationPage.drawRectangle({
      x: 50,
      y: currentY - finalBubbleHeight,
      width: Math.min(font.widthOfTextAtSize(finalMsg, 12) + 40, maxBubbleWidth),
      height: finalBubbleHeight,
      color: gray,
    });
    
    finalLines.forEach((line, index) => {
      conversationPage.drawText(line, {
        x: 70,
        y: currentY - 20 - (index * 16),
        size: 12,
        font,
        color: darkGray,
      });
    });

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-sms.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating SMS conversation PDF:', error);
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