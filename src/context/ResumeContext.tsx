
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { ResumeData, GeneratedLink } from '@/lib/types';
import { initialResumeData } from '@/lib/data';
import { generateShortId } from '@/lib/utils';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => void;
  generatedLinks: GeneratedLink[];
  generateResumeLink: (password: string, templateOverride?: string, companyName?: string) => Promise<GeneratedLink>;
  deleteGeneratedLink: (id: string) => Promise<void>;
  addAnchorText: (id: string, customAnchorText: string) => Promise<void>;
  removeAnchorText: (id: string, customAnchorText: string) => Promise<void>;
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

    return clean(data) as ResumeData;
  };

  // Generate a unique short ID
  const generateUniqueShortId = async (): Promise<string> => {
    let shortId: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      shortId = generateShortId();
      attempts++;
      
      // For now, we'll assume the generated ID is unique
      // In a production app, you'd want to check against existing IDs via API
      return shortId;
    } while (attempts < maxAttempts);
    
    throw new Error('Failed to generate unique short ID');
  };

  // Load resume data from API when user changes
  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setHasLoadedInitialData(false);
    const loadData = async () => {
      try {
        console.log('Loading resume data from API for user:', user.id || user.email);
        
        // Load resume data from API
        const resumeResponse = await fetch('/api/resume/data', {
          credentials: 'include'
        });
        
        if (!resumeResponse.ok) {
          throw new Error('Failed to load resume data');
        }
        
        const loadedData = await resumeResponse.json();
        console.log('Resume data loaded from API:', { 
          hasData: !!loadedData.about.name,
          template: loadedData.template,
          experienceCount: loadedData.experience.length 
        });
        setResumeData(loadedData);
        setHasLoadedInitialData(true);
        
        // Load links from API
        const linksResponse = await fetch('/api/resume/links', {
          credentials: 'include'
        });
        
        if (!linksResponse.ok) {
          throw new Error('Failed to load links');
        }
        
        const links = await linksResponse.json();
        setGeneratedLinks(links);
        
        setIsHydrated(true);
        setLoading(false);
      } catch (err: any) {
        console.error('API connectivity error:', err);
        // If API is unavailable, use local state and continue
        if (err.message?.includes('CORS') || err.message?.includes('502') || err.code === 'unavailable') {
          console.warn('API unavailable, using local state only');
          setIsOffline(true);
          setResumeData(initialResumeData);
          setGeneratedLinks([]);
          setIsHydrated(true);
          setLoading(false);
        } else {
          setError('Failed to load data from API.');
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  // Save resumeData to API whenever it changes
  useEffect(() => {
    if (user && isHydrated && !loading && hasLoadedInitialData) {
      // Don't save if we're still loading data or haven't loaded initial data yet
      const sanitizedData = sanitizeResumeData(resumeData);
      
      console.log('Auto-saving resume data to API...', { 
        userId: user.id || user.email || '', 
        hasData: !!resumeData.about.name,
        template: resumeData.template 
      });
      
      fetch('/api/resume/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sanitizedData)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to save resume data');
          }
          console.log('Resume data saved successfully to API');
        })
        .catch((err) => {
        console.error('Failed to save resume data:', err);
        console.error('Error details:', {
          code: err.code,
          message: err.message,
          details: err.details
        });
        if (err.message?.includes('CORS') || err.message?.includes('502') || err.code === 'unavailable') {
          console.warn('API connectivity issue detected. Resume data not saved');
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

  const generateResumeLink = async (password: string, templateOverride?: string, companyName?: string): Promise<GeneratedLink> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const shortId = await generateUniqueShortId();
      
      // Use the override template if provided, otherwise use the current template
      const templateToUse = templateOverride || resumeData.template;
      
      const newLink: Omit<GeneratedLink, 'id'> = {
        shortId,
        password,
        companyName: companyName || undefined,
        resumeDataSnapshot: sanitizeResumeData(resumeData),
        templateSnapshot: templateToUse,
        createdAt: new Date().toISOString(),
        views: [],
        userId: user.id || user.email || '',
      };

      // Save to API
      const response = await fetch('/api/resume/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newLink)
      });

      if (!response.ok) {
        throw new Error('Failed to create link');
      }

      const generatedLink: GeneratedLink = await response.json();

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
      const response = await fetch(`/api/resume/links?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }
      
      // Update local state
      setGeneratedLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
      // Still update local state even if API deletion fails
      setGeneratedLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    }
  };

  const refreshLinks = async (): Promise<void> => {
    if (!user) {
      return;
    }
    
    try {
      const response = await fetch('/api/resume/links', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const links = await response.json();
      setGeneratedLinks(links);
    } catch (err: any) {
      console.error('Failed to refresh links:', err);
      throw err;
    }
  };

  const addAnchorText = async (id: string, customAnchorText: string): Promise<void> => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume/links/${id}/hyperlink`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ customAnchorText, action: 'add' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add anchor text');
      }
      
      const result = await response.json();
      
      // Update local state
      setGeneratedLinks(prevLinks => 
        prevLinks.map(link => 
          link.id === id 
            ? { ...link, customAnchorTexts: result.customAnchorTexts } 
            : link
        )
      );
    } catch (err) {
      console.error('Failed to add anchor text:', err);
      throw err;
    }
  };

  const removeAnchorText = async (id: string, customAnchorText: string): Promise<void> => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume/links/${id}/hyperlink`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ customAnchorText, action: 'remove' })
      });

      if (!response.ok) {
        throw new Error('Failed to remove anchor text');
      }
      
      const result = await response.json();
      
      // Update local state
      setGeneratedLinks(prevLinks => 
        prevLinks.map(link => 
          link.id === id 
            ? { ...link, customAnchorTexts: result.customAnchorTexts } 
            : link
        )
      );
    } catch (err) {
      console.error('Failed to remove anchor text:', err);
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
      addAnchorText,
      removeAnchorText,
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
