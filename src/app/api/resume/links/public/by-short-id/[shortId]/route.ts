import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;
    console.log('Fetching public link for shortId:', shortId);

    // Query Firestore for the link by shortId
    const linksQuery = adminDb.collection('links').where('shortId', '==', shortId);
    const linksSnap = await linksQuery.get();

    console.log('Query result - empty:', linksSnap.empty, 'size:', linksSnap.size);

    if (linksSnap.empty) {
      console.log('No link found for shortId:', shortId);
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkDoc = linksSnap.docs[0];
    const linkData = {
      id: linkDoc.id,
      ...linkDoc.data()
    };

    console.log('Found link data:', { id: linkData.id, shortId: (linkData as any).shortId });
    return NextResponse.json(linkData);
  } catch (error) {
    console.error('Error fetching public link:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
} 