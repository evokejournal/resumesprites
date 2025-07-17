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
    const linksQuery = adminDb.collection('links').where('userId', '==', userId);
    const linksSnap = await linksQuery.get();
    const links = linksSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
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
    const linkData = await request.json();
    
    console.log('Creating link with data:', { shortId: linkData.shortId, userId });
    
    // Add userId and timestamp
    const newLink = {
      ...linkData,
      userId,
      createdAt: new Date().toISOString(),
      views: [],
    };
    const docRef = await adminDb.collection('links').add(newLink);
    const createdLink = { id: docRef.id, ...newLink };
    
    console.log('Created link successfully:', { id: createdLink.id, shortId: createdLink.shortId });
    return NextResponse.json(createdLink);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    const userId = token.id as string || token.email;
    
    // Verify ownership before deleting
    const linkDoc = await adminDb.collection('links').doc(linkId).get();
    if (!linkDoc.exists) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkData = linkDoc.data();
    if (linkData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await adminDb.collection('links').doc(linkId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
} 