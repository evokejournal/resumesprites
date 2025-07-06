import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import type { ResumeData } from '@/lib/types';

interface UseFirebaseReturn {
  user: User | null;
  loading: boolean;
  saveResume: (resumeData: ResumeData, template: string) => Promise<string>;
  getResumes: (userId: string) => Promise<any[]>;
  getResume: (id: string) => Promise<any>;
  updateResume: (id: string, resumeData: ResumeData) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  subscribeToResumes: (userId: string, callback: (resumes: any[]) => void) => () => void;
}

export function useFirebase(): UseFirebaseReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveResume = async (resumeData: ResumeData, template: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const docRef = await addDoc(collection(db, 'resumes'), {
      ...resumeData,
      userId: user.uid,
      template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  };

  const getResumes = async (userId: string): Promise<any[]> => {
    const q = query(collection(db, 'resumes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  const getResume = async (id: string): Promise<any> => {
    const docRef = doc(db, 'resumes', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Resume not found');
    }
  };

  const updateResume = async (id: string, resumeData: ResumeData): Promise<void> => {
    const docRef = doc(db, 'resumes', id);
    await updateDoc(docRef, {
      ...resumeData,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteResume = async (id: string): Promise<void> => {
    const docRef = doc(db, 'resumes', id);
    await deleteDoc(docRef);
  };

  const subscribeToResumes = (userId: string, callback: (resumes: any[]) => void) => {
    const q = query(collection(db, 'resumes'), where('userId', '==', userId));
    
    return onSnapshot(q, (querySnapshot) => {
      const resumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(resumes);
    });
  };

  return {
    user,
    loading,
    saveResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
    subscribeToResumes,
  };
} 