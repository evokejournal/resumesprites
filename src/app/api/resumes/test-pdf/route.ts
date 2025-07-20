import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test PDF request body:', body);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    
    // Use standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Simple test content
    page.drawText("Test PDF Generation", {
      x: 50,
      y: height - 100,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText("If you can see this, PDF generation is working!", {
      x: 50,
      y: height - 150,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating test PDF:', error);
    return NextResponse.json({ error: 'Failed to generate test PDF', details: error.message }, { status: 500 });
  }
} 