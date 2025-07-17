import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { adminDb } from '@/lib/firebase-admin';

async function ensureUserDocument(token: any) {
  const userId = token.id as string || token.email;
  const userRef = adminDb.collection('users').doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    await userRef.set({
      id: userId,
      email: token.email,
      name: token.name || '',
      role: 'user',
      status: 'active',
      subscription: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      resumeCount: 0,
    });
  } else {
    // Optionally update lastLogin and ensure required fields
    const data = userSnap.data() || {};
    await userRef.set({
      id: userId,
      email: token.email,
      name: token.name || '',
      role: data.role || 'user',
      status: data.status || 'active',
      subscription: data.subscription || 'free',
      createdAt: data.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      resumeCount: data.resumeCount || 0,
    }, { merge: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureUserDocument(token);
    const userId = token.id as string || token.email;
    const resumeDocRef = adminDb.collection('users').doc(userId).collection('resume').doc('main');
    const resumeSnap = await resumeDocRef.get();
    if (resumeSnap.exists) {
      return NextResponse.json(resumeSnap.data());
    } else {
      // Return completely empty data for new users
      const initialData = {
        about: { name: '', jobTitle: '', summary: '', photo: '' },
        contact: { email: '', phone: '', website: '', location: '' },
        experience: [],
        education: [],
        skills: [],
        portfolio: [],
        interests: [],
        references: [],
        custom: { title: '', items: [] },
        coverLetter: '',
        template: ''
      };
      return NextResponse.json(initialData);
    }
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureUserDocument(token);
    const userId = token.id as string || token.email;
    const resumeData = await request.json();
    const resumeDocRef = adminDb.collection('users').doc(userId).collection('resume').doc('main');
    await resumeDocRef.set(resumeData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving resume data:', error);
    return NextResponse.json({ error: 'Failed to save resume data' }, { status: 500 });
  }
} 