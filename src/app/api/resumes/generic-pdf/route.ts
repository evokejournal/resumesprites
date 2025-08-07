import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ResumeData } from '@/lib/types';

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

// Helper function to split text into lines
function splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is too long, split it
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData } = body;
    
    if (!resumeData) {
      return NextResponse.json({ error: 'No resume data provided' }, { status: 400 });
    }
    
    // Ensure all sections exist with fallbacks
    const data: ResumeData = {
      about: resumeData.about || { name: 'Your Name', jobTitle: 'Your Title', summary: '', photo: '' },
      contact: resumeData.contact || { email: '', phone: '', website: '', location: '' },
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      portfolio: resumeData.portfolio || [],
      interests: resumeData.interests || [],
      references: resumeData.references || [],
      custom: resumeData.custom || { title: '', items: [] },
      template: resumeData.template || '',
      coverLetter: resumeData.coverLetter || ''
    };
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    
    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Colors
    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.6, 0.6, 0.6);
    
    // Margins and spacing
    const margin = 72; // 1 inch margins
    const contentWidth = 612 - (margin * 2);
    let y = 792 - margin; // Start from top margin
    
    // Header Section
    const name = data.about.name || 'Your Name';
    const jobTitle = data.about.jobTitle || 'Your Title';
    
    // Name (large and bold)
    page.drawText(name, {
      x: margin,
      y,
      size: 24,
      font: boldFont,
      color: black
    });
    y -= 30;
    
    // Job Title
    page.drawText(jobTitle, {
      x: margin,
      y,
      size: 16,
      font: font,
      color: darkGray
    });
    y -= 25;
    
    // Contact Information
    const contactInfo = [];
    if (data.contact.email) contactInfo.push(data.contact.email);
    if (data.contact.phone) contactInfo.push(data.contact.phone);
    if (data.contact.website) contactInfo.push(data.contact.website);
    if (data.contact.location) contactInfo.push(data.contact.location);
    
    if (contactInfo.length > 0) {
      page.drawText(contactInfo.join(' • '), {
        x: margin,
        y,
        size: 10,
        font: font,
        color: lightGray
      });
      y -= 20;
    }
    
    y -= 10; // Extra spacing
    
    // About Section
    if (data.about.summary) {
      page.drawText('SUMMARY', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      const summaryLines = splitTextIntoLines(data.about.summary, contentWidth, font, 11);
      for (const line of summaryLines) {
        page.drawText(line, {
          x: margin,
          y,
          size: 11,
          font: font,
          color: black
        });
        y -= 15;
      }
      y -= 10;
    }
    
    // Experience Section
    if (data.experience && data.experience.length > 0) {
      page.drawText('EXPERIENCE', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      for (const job of data.experience) {
        // Job title and company
        page.drawText(job.role, {
          x: margin,
          y,
          size: 12,
          font: boldFont,
          color: black
        });
        y -= 16;
        
        page.drawText(job.company, {
          x: margin,
          y,
          size: 11,
          font: font,
          color: darkGray
        });
        y -= 15;
        
        // Date range
        const dateRange = `${job.startDate} - ${job.endDate || 'Present'}`;
        page.drawText(dateRange, {
          x: margin,
          y,
          size: 10,
          font: font,
          color: lightGray
        });
        y -= 15;
        
        // Description
        if (job.description) {
          const descLines = splitTextIntoLines(job.description, contentWidth, font, 10);
          for (const line of descLines) {
            page.drawText(line, {
              x: margin + 10, // Indent description
              y,
              size: 10,
              font: font,
              color: black
            });
            y -= 13;
          }
        }
        y -= 5;
      }
      y -= 10;
    }
    
    // Education Section
    if (data.education && data.education.length > 0) {
      page.drawText('EDUCATION', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      for (const edu of data.education) {
        page.drawText(edu.degree, {
          x: margin,
          y,
          size: 12,
          font: boldFont,
          color: black
        });
        y -= 16;
        
        page.drawText(edu.institution, {
          x: margin,
          y,
          size: 11,
          font: font,
          color: darkGray
        });
        y -= 15;
        
        if (edu.endDate) {
          page.drawText(edu.endDate, {
            x: margin,
            y,
            size: 10,
            font: font,
            color: lightGray
          });
          y -= 15;
        }
        y -= 5;
      }
      y -= 10;
    }
    
    // Skills Section
    if (data.skills && data.skills.length > 0) {
      page.drawText('SKILLS', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      const skillNames = data.skills.map(skill => skill.name).join(', ');
      const skillLines = splitTextIntoLines(skillNames, contentWidth, font, 11);
      for (const line of skillLines) {
        page.drawText(line, {
          x: margin,
          y,
          size: 11,
          font: font,
          color: black
        });
        y -= 15;
      }
      y -= 10;
    }
    
    // Portfolio Section
    if (data.portfolio && data.portfolio.length > 0) {
      page.drawText('PORTFOLIO', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      for (const project of data.portfolio) {
        page.drawText(project.title, {
          x: margin,
          y,
          size: 12,
          font: boldFont,
          color: black
        });
        y -= 16;
        
        if (project.description) {
          const descLines = splitTextIntoLines(project.description, contentWidth, font, 10);
          for (const line of descLines) {
            page.drawText(line, {
              x: margin + 10,
              y,
              size: 10,
              font: font,
              color: black
            });
            y -= 13;
          }
        }
        y -= 5;
      }
      y -= 10;
    }
    
    // Custom Section
    if (data.custom && data.custom.title && data.custom.items.length > 0) {
      page.drawText(data.custom.title.toUpperCase(), {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      for (const item of data.custom.items) {
        page.drawText(item.description, {
          x: margin,
          y,
          size: 12,
          font: boldFont,
          color: black
        });
        y -= 16;
        
        if (item.description) {
          const descLines = splitTextIntoLines(item.description, contentWidth, font, 10);
          for (const line of descLines) {
            page.drawText(line, {
              x: margin + 10,
              y,
              size: 10,
              font: font,
              color: black
            });
            y -= 13;
          }
        }
        y -= 5;
      }
      y -= 10;
    }
    
    // References Section
    if (data.references && data.references.length > 0) {
      page.drawText('REFERENCES', {
        x: margin,
        y,
        size: 14,
        font: boldFont,
        color: black
      });
      y -= 20;
      
      for (const ref of data.references) {
        page.drawText(ref.name, {
          x: margin,
          y,
          size: 12,
          font: boldFont,
          color: black
        });
        y -= 16;
        
        page.drawText(ref.relation, {
          x: margin,
          y,
          size: 11,
          font: font,
          color: darkGray
        });
        y -= 15;
        
        if (ref.contact) {
          page.drawText(ref.contact, {
            x: margin,
            y,
            size: 10,
            font: font,
            color: lightGray
          });
          y -= 15;
        }
        y -= 5;
      }
    }
    
    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"'
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 