import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, userId, template } = body;

    const docRef = await addDoc(collection(db, 'resumes'), {
      ...resumeData,
      userId,
      template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Resume saved successfully' 
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save resume' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resumeId = searchParams.get('id');

    if (resumeId) {
      // Get specific resume
      const docRef = doc(db, 'resumes', resumeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return NextResponse.json({ 
          success: true, 
          resume: { id: docSnap.id, ...docSnap.data() } 
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Resume not found' },
          { status: 404 }
        );
      }
    } else if (userId) {
      // Get all resumes for user
      const q = query(collection(db, 'resumes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const resumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json({ 
        success: true, 
        resumes 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'User ID or Resume ID required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, resumeData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resume ID required' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'resumes', id);
    await updateDoc(docRef, {
      ...resumeData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Resume updated successfully' 
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resume ID required' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'resumes', id);
    await deleteDoc(docRef);

    return NextResponse.json({ 
      success: true, 
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete resume' },
      { status: 500 }
    );
  }
} 