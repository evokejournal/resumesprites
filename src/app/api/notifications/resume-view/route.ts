import { NextRequest, NextResponse } from 'next/server';
import { sendResumeViewEmail } from '@/lib/email-service';
import { rateLimiters } from '@/lib/rate-limiter';
import { adminDb } from '@/lib/firebase-admin';
import { getClientIP } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { linkId, resumeTitle, userEmail, userName } = await request.json();

    if (!linkId || !resumeTitle || !userEmail || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get viewer information
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const timestamp = new Date().toISOString();

    // Get resume URL from the link
    const linkDoc = await adminDb.collection('links').doc(linkId).get();
    if (!linkDoc.exists) {
      return NextResponse.json({ error: 'Resume link not found' }, { status: 404 });
    }

    const linkData = linkDoc.data()!;
    const resumeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${linkData.shortId}`;

    // Send resume view notification email (non-blocking)
    try {
      await sendResumeViewEmail({
        userEmail,
        userName,
        resumeTitle,
        viewerInfo: {
          ip: clientIP,
          userAgent,
          timestamp,
        },
        resumeUrl,
      });
    } catch (emailError) {
      console.error('Failed to send resume view email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Resume view notification sent' 
    });

  } catch (error: any) {
    console.error('Resume view notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
} 