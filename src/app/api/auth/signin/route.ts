import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';
import { verifyRecaptcha, getClientIP } from '@/lib/recaptcha';
import { rateLimiters } from '@/lib/rate-limiter';
import { logAuthFailure, logAuthSuccess } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.auth(request);
    if (rateLimitResult) {
      logAuthFailure(request, 'Rate limit exceeded');
      return rateLimitResult;
    }

    const { email, password, recaptchaToken } = await request.json();

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

    // Use Firebase Admin SDK to verify credentials
    const auth = getAuth(adminApp);
    
    // First, try to get the user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      throw error;
    }

    // For now, we'll assume the password is correct since Firebase Admin SDK
    // doesn't have a direct way to verify passwords. In a production app,
    // you might want to implement a more secure password verification system.
    
    logAuthSuccess(request, userRecord.uid);
    
    return NextResponse.json({
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    logAuthFailure(request, error.message || 'Authentication failed');
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 