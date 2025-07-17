import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use Firebase Admin SDK to create user
    const auth = getAuth(adminApp);
    
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    return NextResponse.json({
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
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