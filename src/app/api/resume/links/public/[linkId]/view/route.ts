import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const { linkId } = params;
    const viewData = await request.json();

    // Get the current link document
    const linkRef = adminDb.collection('links').doc(linkId);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkData = linkDoc.data();
    const currentViews = linkData?.views || [];

    // Add the new view
    const updatedViews = [...currentViews, viewData];

    // Update the link document
    await linkRef.update({
      views: updatedViews,
      lastViewed: viewData.timestamp
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }
} 