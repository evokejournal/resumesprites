
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ResumeData, GeneratedLink } from '@/lib/types';
import { initialResumeData } from '@/lib/data';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { generateShortId } from '@/lib/utils';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => void;
  generatedLinks: GeneratedLink[];
  generateResumeLink: (password: string, templateOverride?: string) => Promise<GeneratedLink>;
  deleteGeneratedLink: (id: string) => Promise<void>;
  refreshLinks: () => Promise<void>;
  isHydrated: boolean;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // Data sanitization function to clean data before saving to Firestore
  const sanitizeResumeData = (data: ResumeData): ResumeData => {
    const clean = (obj: any): any => {
      if (obj === null || obj === undefined) return '';
      if (typeof obj === 'string') {
        return obj.trim();
      }
      if (typeof obj === 'number') return obj;
      if (typeof obj === 'boolean') return obj;
      if (Array.isArray(obj)) {
        return obj.map(clean).filter(item => item !== null && item !== undefined);
      }
      if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const cleanedValue = clean(value);
          if (cleanedValue !== null && cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
        return cleaned;
      }
      return String(obj);
    };

    // Create a copy of the data and exclude the photo field
    const dataWithoutPhoto = {
      ...data,
      about: {
        ...data.about,
        photo: '' // Clear photo field to prevent Firestore issues
      }
    };

    return clean(dataWithoutPhoto) as ResumeData;
  };

  // Generate a unique short ID
  const generateUniqueShortId = async (): Promise<string> => {
    const linksColRef = collection(db, 'links');
    let shortId: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      shortId = generateShortId();
      attempts++;
      
      // Check if this shortId already exists
      const existingQuery = query(linksColRef, where('shortId', '==', shortId));
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        return shortId;
      }
    } while (attempts < maxAttempts);

    // If we can't find a unique ID after max attempts, append a number
    return generateShortId() + Math.floor(Math.random() * 1000);
  };

  // On login, load data from Firestore
  useEffect(() => {
    if (!user) {
      setResumeData(initialResumeData);
      setGeneratedLinks([]);
      setIsHydrated(true);
      setLoading(false);
      setHasLoadedInitialData(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHasLoadedInitialData(false);
    const loadData = async () => {
      try {
        console.log('Loading resume data from Firestore for user:', user.uid);
        
        // Create doc references inside the effect
        const resumeDocRef = doc(db, 'users', user.uid, 'resume', 'main');
        const linksColRef = collection(db, 'links');
        
        // Load resumeData
        const resumeSnap = await getDoc(resumeDocRef);
        if (resumeSnap.exists()) {
          const loadedData = resumeSnap.data() as ResumeData;
          console.log('Resume data loaded from Firestore:', { 
            hasData: !!loadedData.about.name,
            template: loadedData.template,
            experienceCount: loadedData.experience.length 
          });
          setResumeData(loadedData);
        } else {
          console.log('No existing resume data found, creating initial data');
          await setDoc(resumeDocRef, initialResumeData);
          setResumeData(initialResumeData);
        }
        setHasLoadedInitialData(true);
        
        // Load generatedLinks for current user
        const userLinksQuery = query(linksColRef, where('userId', '==', user.uid));
        const linksSnap = await getDocs(userLinksQuery);
        const links = linksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedLink));
        setGeneratedLinks(links);
        
        setIsHydrated(true);
        setLoading(false);
      } catch (err: any) {
        console.error('Firebase connectivity error:', err);
        // If Firebase is unavailable, use local state and continue
        if (err.message?.includes('CORS') || err.message?.includes('502') || err.code === 'unavailable') {
          console.warn('Firebase unavailable, using local state only');
          setIsOffline(true);
          setResumeData(initialResumeData);
          setGeneratedLinks([]);
          setIsHydrated(true);
          setLoading(false);
        } else {
          setError('Failed to load data from Firebase.');
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  // Save resumeData to Firestore whenever it changes
  useEffect(() => {
    if (user && isHydrated && !loading && hasLoadedInitialData) {
      // Don't save if we're still loading data or haven't loaded initial data yet
      const sanitizedData = sanitizeResumeData(resumeData);
      
      console.log('Auto-saving resume data to Firestore...', { 
        userId: user.uid, 
        hasData: !!resumeData.about.name,
        template: resumeData.template 
      });
      
      const resumeDocRef = doc(db, 'users', user.uid, 'resume', 'main');
      setDoc(resumeDocRef, sanitizedData)
        .then(() => {
          console.log('Resume data saved successfully to Firestore');
        })
        .catch((err) => {
        console.error('Failed to save resume data:', err);
        console.error('Error details:', {
          code: err.code,
          message: err.message,
          details: err.details
        });
        if (err.message?.includes('CORS') || err.message?.includes('502') || err.code === 'unavailable') {
          console.warn('Firebase connectivity issue detected. Resume data not saved');
          setIsOffline(true);
        } else {
          setError('Failed to save resume data.');
        }
      });
    }
  }, [resumeData, user, isHydrated, loading, hasLoadedInitialData]);

  const updateField = <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => {
    setResumeData(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const generateResumeLink = async (password: string, templateOverride?: string): Promise<GeneratedLink> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const linksColRef = collection(db, 'links');
      const shortId = await generateUniqueShortId();
      const now = new Date().toISOString();
      
      // Use the override template if provided, otherwise use the current template
      const templateToUse = templateOverride || resumeData.template;
      
      const newLink: Omit<GeneratedLink, 'id'> = {
        shortId,
        password,
        resumeDataSnapshot: sanitizeResumeData(resumeData),
        templateSnapshot: templateToUse,
        createdAt: now,
        views: [],
        userId: user.uid,
      };

      // Save to Firestore
      const docRef = await addDoc(linksColRef, newLink);
      const generatedLink: GeneratedLink = { id: docRef.id, ...newLink };

      // Update local state
      setGeneratedLinks(prev => [generatedLink, ...prev]);
      
      return generatedLink;
    } catch (err: any) {
      console.error('Failed to generate resume link:', err);
      throw err;
    }
  };

  const deleteGeneratedLink = async (id: string): Promise<void> => {
    if (!user) return;
    
    try {
      const linksColRef = collection(db, 'links');
      // Find and delete the link from Firestore
      const userLinksQuery = query(linksColRef, where('userId', '==', user.uid));
      const linksSnap = await getDocs(userLinksQuery);
      const linkDoc = linksSnap.docs.find(doc => doc.id === id);
      if (linkDoc) {
        await deleteDoc(linkDoc.ref);
      }
      
      // Update local state
      setGeneratedLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
      // Still update local state even if Firestore deletion fails
      setGeneratedLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    }
  };

  const refreshLinks = async (): Promise<void> => {
    if (!user) {
      return;
    }
    
    try {
      const linksColRef = collection(db, 'links');
      // Reload generatedLinks from Firestore
      const userLinksQuery = query(linksColRef, where('userId', '==', user.uid));
      const linksSnap = await getDocs(userLinksQuery);
      const links = linksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedLink));
      setGeneratedLinks(links);
    } catch (err: any) {
      console.error('Failed to refresh links:', err);
      throw err;
    }
  };

  return (
    <ResumeContext.Provider value={{ 
      resumeData, 
      setResumeData, 
      updateField, 
      generatedLinks,
      generateResumeLink,
      deleteGeneratedLink,
      refreshLinks,
      isHydrated, 
      loading, 
      error, 
      isOffline 
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
