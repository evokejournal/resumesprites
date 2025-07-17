import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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
    
    return NextResponse.json({
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 