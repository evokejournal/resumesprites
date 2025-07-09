"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { GeneratedLink, ResumeData } from '@/lib/types';
import { getTemplateComponent } from '@/lib/templates';
import {
  CodeSyntaxPasswordScreen,
  RetroTerminalPasswordScreen,
  OperatingSystemPasswordScreen,
  ObsidianPasswordScreen,
  ModernPasswordScreen,
  YoublePasswordScreen,
  PeachPitPasswordScreen,
  SmsConversationPasswordScreen,
  ReceiptRollPasswordScreen,
  ExplosivePotentialPasswordScreen,
  SnakebitePasswordScreen
} from '@/components/templates/password-screens';

export default function ResumeViewPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const { toast } = useToast();
  
  const [link, setLink] = useState<GeneratedLink | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Load link data on mount
  useEffect(() => {
    const loadLink = async () => {
      if (!shortId) return;
      
      try {
        // Search for the link in all users' collections
        const linksRef = collection(db, 'links');
        const q = query(linksRef, where('shortId', '==', shortId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          toast({
            title: "Link not found",
            description: "This resume link does not exist or has been deleted.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const linkDoc = querySnapshot.docs[0];
        const linkData = { id: linkDoc.id, ...linkDoc.data() } as GeneratedLink;
        setLink(linkData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading link:', error);
        toast({
          title: "Error",
          description: "Failed to load resume link. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadLink();
  }, [shortId, toast]);

  // Record view when authenticated
  useEffect(() => {
    if (isAuthenticated && link) {
      recordView();
    }
  }, [isAuthenticated, link]);

  const recordView = async () => {
    if (!link) return;
    
    try {
      const view = {
        timestamp: new Date().toISOString(),
        ip: 'Unknown', // In a real app, you'd get this from the request
        userAgent: navigator.userAgent,
      };

      // Update the link with the new view
      const linksRef = collection(db, 'links');
      const q = query(linksRef, where('shortId', '==', shortId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const linkDoc = querySnapshot.docs[0];
        const currentViews = linkDoc.data().views || [];
        await updateDoc(linkDoc.ref, {
          views: [...currentViews, view],
          lastViewed: view.timestamp,
        });
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handlePasswordSubmit = async (submittedPassword: string) => {
    if (!submittedPassword.trim() || !link) return;

    setIsSubmitting(true);
    setError(undefined);
    
    // Simple password check
    if (submittedPassword === link.password) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Resume Not Found</h2>
            <p className="text-muted-foreground text-center">
              This resume link does not exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    const getPasswordScreen = () => {
      switch (link.templateSnapshot) {
        case 'code-syntax':
          return (
            <CodeSyntaxPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'retro-terminal':
          return (
            <RetroTerminalPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'operating-system':
          return (
            <OperatingSystemPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'obsidian':
          return (
            <ObsidianPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'modern':
          return (
            <ModernPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'youble':
          return (
            <YoublePasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'peach-pit':
          return (
            <PeachPitPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'sms-conversation':
          return (
            <SmsConversationPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
        case 'for-tax-purposes':
          return (
            <ReceiptRollPasswordScreen
              onSubmit={handlePasswordSubmit}
              loading={isSubmitting}
              error={error}
            />
          );
        case 'explosive-potential':
          return (
            <ExplosivePotentialPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
              name={link?.resumeDataSnapshot?.about?.name}
            />
          );
        case 'snakebite-resume':
          return (
            <SnakebitePasswordScreen
              onSubmit={handlePasswordSubmit}
              loading={isSubmitting}
              error={error}
              name={link?.resumeDataSnapshot?.about?.name}
            />
          );
        default:
          return (
            <ModernPasswordScreen
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          );
      }
    };

    return getPasswordScreen();
  }

  // Render the animated template
  const TemplateComponent = getTemplateComponent(link.templateSnapshot);
  
  return (
    <div className="min-h-screen bg-background">
      <TemplateComponent 
        data={link.resumeDataSnapshot} 
        isPreview={false}
      />
    </div>
  );
} 