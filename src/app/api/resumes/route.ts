import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getTemplateStyle } from '@/lib/templates';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { rateLimiters } from '@/lib/rate-limiter';
import { validateWithErrors, pdfGenerationSchema, getResumeSchema, updateResumeSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.api(req);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  const body = await req.json();
  
  // Validate input
  const validation = validateWithErrors(pdfGenerationSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.errors },
      { status: 400 }
    );
  }
  
  const { name, occupation, company, address, content, templateId, resumeUrl, password } = validation.data;
  const style = getTemplateStyle(templateId);

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Colors
  const bgColor = style.background.startsWith('#') ? hexToRgb(style.background) : { r: 1, g: 1, b: 1 };
  const textColor = style.textColor.startsWith('#') ? hexToRgb(style.textColor) : { r: 0, g: 0, b: 0 };

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

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.api(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resumeId = searchParams.get('id');
    
    // Validate query parameters
    const validation = validateWithErrors(getResumeSchema, { userId, id: resumeId });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.errors },
        { status: 400 }
      );
    }

    if (resumeId) {
      // Get specific resume
      const docRef = adminDb.collection('resumes').doc(resumeId);
      const docSnap = await docRef.get();
      
      if (docSnap.exists) {
        return NextResponse.json({ 
          success: true, 
          resume: { id: docSnap.id, ...docSnap.data() } 
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Resume not found' },
          { status: 404 }
        );
      }
    } else if (userId) {
      // Get all resumes for user
      const q = adminDb.collection('resumes').where('userId', '==', userId);
      const querySnapshot = await q.get();
      
      const resumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json({ 
        success: true, 
        resumes 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'User ID or Resume ID required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.api(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateWithErrors(updateResumeSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { id, resumeData } = validation.data;

    const docRef = adminDb.collection('resumes').doc(id);
    await docRef.update({
      ...resumeData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Resume updated successfully' 
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.api(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resume ID required' },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection('resumes').doc(id);
    await docRef.delete();

    return NextResponse.json({ 
      success: true, 
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete resume' },
      { status: 500 }
    );
  }
} 