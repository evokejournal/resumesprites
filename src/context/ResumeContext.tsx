
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ResumeData, GeneratedLink } from '@/lib/types';
import { initialResumeData, mockDashboardLinks } from '@/lib/data';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => void;
  generatedLinks: GeneratedLink[];
  addGeneratedLink: (link: GeneratedLink) => void;
  deleteGeneratedLink: (id: string) => void;
  isHydrated: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>({...initialResumeData, template: 'mirror-mirror'});
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedResumeData = window.localStorage.getItem('resumeData');
      if (storedResumeData) {
        setResumeData(JSON.parse(storedResumeData));
      }

      const storedGeneratedLinks = window.localStorage.getItem('generatedLinks');
      if (storedGeneratedLinks) { // Load if it exists, even if empty
        setGeneratedLinks(JSON.parse(storedGeneratedLinks));
      } else {
        // If nothing in storage, initialize it with mocks
        const initialLinks = mockDashboardLinks.map(link => ({
            ...link,
            password: 'password123',
            resumeDataSnapshot: initialResumeData,
        }));
        setGeneratedLinks(initialLinks);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem('resumeData', JSON.stringify(resumeData));
      } catch (error) {
        console.error("Failed to save resumeData to localStorage", error);
      }
    }
  }, [resumeData, isHydrated]);

  // Save generated links to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem('generatedLinks', JSON.stringify(generatedLinks));
      } catch (error) {
        console.error("Failed to save generatedLinks to localStorage", error);
      }
    }
  }, [generatedLinks, isHydrated]);

  const updateField = <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => {
    setResumeData(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const addGeneratedLink = (link: GeneratedLink) => {
    setGeneratedLinks(prevLinks => [link, ...prevLinks]);
  };

  const deleteGeneratedLink = (id: string) => {
    setGeneratedLinks(prevLinks => prevLinks.filter(link => link.id !== id));
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateField, generatedLinks, addGeneratedLink, deleteGeneratedLink, isHydrated }}>
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
