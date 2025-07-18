import { NextRequest } from 'next/server';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string, remoteIp?: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
      return true; // Skip verification if not configured
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      }),
    });

    const data: RecaptchaResponse = await response.json();
    
    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// reCAPTCHA configuration
export const recaptchaConfig = {
  // Site key for client-side (public)
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  
  // Secret key for server-side (private)
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  
  // Minimum score for v3 (0.0 to 1.0)
  minScore: 0.5,
  
  // Enable/disable reCAPTCHA
  enabled: process.env.NODE_ENV === 'production' || process.env.ENABLE_RECAPTCHA === 'true',
}; 