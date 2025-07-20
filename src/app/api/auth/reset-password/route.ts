import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limiter';
import { logAuthFailure, logAuthSuccess } from '@/lib/security-logger';
import { verifyRecaptcha, getClientIP } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.auth(request);
    if (rateLimitResult) {
      logAuthFailure(request, 'Rate limit exceeded');
      return rateLimitResult;
    }

    const { token, newPassword, recaptchaToken } = await request.json();

    if (!token || !newPassword) {
      logAuthFailure(request, 'Missing token or password');
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
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

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Get reset token from Firestore
    const resetDoc = await adminDb.collection('passwordResets').doc(token).get();
    
    if (!resetDoc.exists) {
      logAuthFailure(request, 'Invalid reset token');
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const resetData = resetDoc.data()!;
    
    // Check if token is expired
    if (new Date() > resetData.expiresAt.toDate()) {
      logAuthFailure(request, 'Expired reset token');
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Check if token has been used
    if (resetData.used) {
      logAuthFailure(request, 'Token already used');
      return NextResponse.json({ error: 'Reset token has already been used' }, { status: 400 });
    }

    // Update password in Firebase Auth
    const auth = getAuth(adminApp);
    await auth.updateUser(resetData.userId, {
      password: newPassword,
    });

    // Mark token as used
    await adminDb.collection('passwordResets').doc(token).update({
      used: true,
      usedAt: new Date(),
    });

    logAuthSuccess(request, resetData.userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });

  } catch (error: any) {
    console.error('Password reset completion error:', error);
    logAuthFailure(request, error.message || 'Password reset failed');
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Password is too weak. Please choose a stronger password.' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
} 