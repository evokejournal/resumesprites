import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { adminDb } from '@/lib/firebase-admin';

async function ensureUserDocument(token: any) {
  const userRef = adminDb.collection('users').doc(token.id as string || token.email);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    await userRef.set({
      email: token.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUserDocument(token);
    const userId = token.id as string || token.email;
    const { id } = params;
    const { customAnchorText, action } = await request.json();

    // Get the link document
    const linkRef = adminDb.collection('links').doc(id);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkData = linkDoc.data();
    if (linkData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get current anchor texts array
    const currentAnchorTexts = linkData.customAnchorTexts || [];
    let updatedAnchorTexts: string[];

    if (action === 'add') {
      // Add new anchor text (max 3)
      if (currentAnchorTexts.length >= 3) {
        return NextResponse.json({ error: 'Maximum 3 anchor texts allowed' }, { status: 400 });
      }
      if (!currentAnchorTexts.includes(customAnchorText)) {
        updatedAnchorTexts = [...currentAnchorTexts, customAnchorText];
      } else {
        return NextResponse.json({ error: 'Anchor text already exists' }, { status: 400 });
      }
    } else if (action === 'remove') {
      // Remove specific anchor text
      updatedAnchorTexts = currentAnchorTexts.filter((text: string) => text !== customAnchorText);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update the anchor texts
    await linkRef.update({
      customAnchorTexts: updatedAnchorTexts,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      customAnchorTexts: updatedAnchorTexts 
    });
  } catch (error) {
    console.error('Error updating anchor texts:', error);
    return NextResponse.json({ error: 'Failed to update anchor texts' }, { status: 500 });
  }
} 