import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';
import { sendPasswordResetEmail } from '@/lib/email-service';
import { rateLimiters } from '@/lib/rate-limiter';
import { logAuthFailure } from '@/lib/security-logger';
import { verifyRecaptcha, getClientIP } from '@/lib/recaptcha';
import { adminDb } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.auth(request);
    if (rateLimitResult) {
      logAuthFailure(request, 'Rate limit exceeded');
      return rateLimitResult;
    }

    const { email, recaptchaToken } = await request.json();

    if (!email) {
      logAuthFailure(request, 'Missing email');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify reCAPTCHA if enabled
    if (recaptchaToken) {
      const clientIP = getClientIP(request);
      const recaptchaValid = await verifyRecaptcha(recaptchaToken, clientIP);
      if (!recaptchaValid) {
        logAuthFailure(request, 'reCAPTCHA verification failed');
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }
    }

    // Check if user exists
    const auth = getAuth(adminApp);
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Don't reveal if user exists or not for security
        return NextResponse.json({ 
          success: true, 
          message: 'If an account with this email exists, a password reset link has been sent.' 
        });
      }
      throw error;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in Firestore
    await adminDb.collection('passwordResets').doc(resetToken).set({
      userId: userRecord.uid,
      email: userRecord.email,
      token: resetToken,
      expiresAt: resetExpiry,
      used: false,
      createdAt: new Date(),
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail({
        email: userRecord.email!,
        resetToken,
        name: userRecord.displayName,
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Clean up the token if email fails
      await adminDb.collection('passwordResets').doc(resetToken).delete();
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with this email exists, a password reset link has been sent.' 
    });

  } catch (error: any) {
    console.error('Password reset error:', error);
    logAuthFailure(request, error.message || 'Password reset failed');
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 });
  }
} 