"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { templateComponentMap } from '@/lib/templates';
import type { ResumeData } from '@/lib/types';
import Head from 'next/head';

interface LinkData {
  id: string;
  shortId: string;
  password: string;
  resumeDataSnapshot: ResumeData;
  templateSnapshot: string;
  userId: string;
  createdAt: string;
  views: Array<{ timestamp: string; ip: string; userAgent: string }>;
  lastViewed?: string;
}

export default function PublicLinkPage() {
  const params = useParams();
  const shortId = params.id as string;
  const { toast } = useToast();
  
  const [link, setLink] = useState<LinkData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`/api/resume/links/public/by-short-id/${shortId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Resume link not found.');
          } else {
            setError('Failed to load resume link.');
          }
          return;
        }

        const linkData = await response.json();
        setLink(linkData);
        
        // Record the view
        await recordView(linkData.id);
      } catch (error) {
        console.error('Error fetching link:', error);
        setError('Failed to load resume link.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [shortId]);

  const recordView = async (linkId: string) => {
    try {
      await fetch(`/api/resume/links/public/${linkId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ip: 'Unknown', // In a real app, you'd get this from the request
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !password.trim()) return;

    setIsSubmitting(true);
    setError(undefined);
    
    // Simple password check
    if (password === link.password) {
      setIsAuthenticated(true);
    } else {
      setError("Incorrect password. Please try again.");
      toast({
        title: "Incorrect password",
        description: "Please check your password and try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  // Generate structured data for the resume
  const generateStructuredData = () => {
    if (!link || !isAuthenticated) return null;

    const resumeData = link.resumeDataSnapshot;
    
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": resumeData.about.name,
      "jobTitle": resumeData.about.jobTitle,
      "description": resumeData.about.summary,
      "email": resumeData.contact.email,
      "telephone": resumeData.contact.phone,
      "url": resumeData.contact.website,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": resumeData.contact.location
      },
      "worksFor": resumeData.experience.map(exp => ({
        "@type": "Organization",
        "name": exp.company,
        "jobTitle": exp.role,
        "startDate": exp.startDate,
        "endDate": exp.endDate
      })),
      "alumniOf": resumeData.education.map(edu => ({
        "@type": "Organization",
        "name": edu.institution,
        "description": edu.degree
      })),
      "knowsAbout": resumeData.skills.map(skill => skill.name),
      "sameAs": resumeData.portfolio.map(project => project.url)
    };
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Resume | ResumeSprites</title>
          <meta name="description" content="Loading professional resume..." />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  }

  if (!link) {
    return (
      <>
        <Head>
          <title>Resume Not Found | ResumeSprites</title>
          <meta name="description" content="The requested resume link could not be found." />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100">
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-emerald-700">Resume Link Not Found</h1>
            <p className="mb-6 text-gray-600 text-center">
              The resume link you are trying to access does not exist or has expired.
            </p>
            <p className="text-red-600 mb-2">{error}</p>
            <a href="/" className="w-full text-center text-emerald-700 hover:underline">
              Back to Home
            </a>
          </div>
        </div>
      </>
    );
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Protected Resume | ResumeSprites</title>
          <meta name="description" content="This resume is password protected. Enter the password to view." />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md flex flex-col items-center"
          >
            <h1 className="text-2xl font-bold mb-4 text-emerald-700">Enter Password</h1>
            <p className="mb-6 text-gray-600 text-center">
              This resume is protected. Please enter the password provided by the candidate.
            </p>
            <input
              type="password"
              className="border rounded px-4 py-2 w-full mb-4 text-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Checking...' : 'Access Resume'}
            </button>
          </form>
        </div>
      </>
    );
  }

  // Render the actual resume using the correct template and theme
  const TemplateComponent = templateComponentMap[link.templateSnapshot || 'youble'];
   
  if (!TemplateComponent) {
    return (
      <>
        <Head>
          <title>Template Not Found | ResumeSprites</title>
          <meta name="description" content="The requested resume template could not be found." />
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
            <p className="text-gray-600">The requested template is not available.</p>
          </div>
        </div>
      </>
    );
  }

  const structuredData = generateStructuredData();

  return (
    <>
      <Head>
        <title>{link.resumeDataSnapshot.about.name} - Professional Resume | ResumeSprites</title>
        <meta name="description" content={`Professional resume of ${link.resumeDataSnapshot.about.name} - ${link.resumeDataSnapshot.about.jobTitle}. View their experience, skills, and portfolio.`} />
        <meta name="keywords" content={`${link.resumeDataSnapshot.about.name}, ${link.resumeDataSnapshot.about.jobTitle}, professional resume, portfolio`} />
        <meta property="og:title" content={`${link.resumeDataSnapshot.about.name} - Professional Resume`} />
        <meta property="og:description" content={`Professional resume of ${link.resumeDataSnapshot.about.name} - ${link.resumeDataSnapshot.about.jobTitle}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://resumesprites.com/${shortId}`} />
        <meta name="twitter:title" content={`${link.resumeDataSnapshot.about.name} - Professional Resume`} />
        <meta name="twitter:description" content={`Professional resume of ${link.resumeDataSnapshot.about.name} - ${link.resumeDataSnapshot.about.jobTitle}`} />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}
      </Head>
      <div className="min-h-screen bg-white">
        <TemplateComponent {...link.resumeDataSnapshot} />
      </div>
    </>
  );
} 