import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';
import { verifyRecaptcha, getClientIP } from '@/lib/recaptcha';
import { rateLimiters } from '@/lib/rate-limiter';
import { logAuthFailure, logAuthSuccess } from '@/lib/security-logger';
import { sendWelcomeEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.auth(request);
    if (rateLimitResult) {
      logAuthFailure(request, 'Rate limit exceeded');
      return rateLimitResult;
    }

    const { email, password, name, recaptchaToken } = await request.json();

    if (!email || !password) {
      logAuthFailure(request, 'Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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

    // Use Firebase Admin SDK to create user
    const auth = getAuth(adminApp);
    
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    logAuthSuccess(request, userRecord.uid);

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail({
        name: name || userRecord.displayName || 'User',
        email: userRecord.email!,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    logAuthFailure(request, error.message || 'Failed to create account');
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    } else if (error.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Password is too weak. Please choose a stronger password' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
} 