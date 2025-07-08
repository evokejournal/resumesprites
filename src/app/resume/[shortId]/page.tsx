"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { GeneratedLink, ResumeData } from '@/lib/types';
import { getTemplateComponent } from '@/lib/templates';

export default function ResumeViewPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const { toast } = useToast();
  
  const [link, setLink] = useState<GeneratedLink | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !link) return;

    setIsSubmitting(true);
    
    // Simple password check
    if (password === link.password) {
      setIsAuthenticated(true);
      toast({
        title: "Access granted",
        description: "Welcome to the resume!",
      });
    } else {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Password Protected Resume</CardTitle>
            <CardDescription>
              Enter the password to view this resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !password.trim()}
              >
                {isSubmitting ? 'Checking...' : 'View Resume'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the animated template
  const TemplateComponent = getTemplateComponent(link.templateSnapshot);
  
  return (
    <div className="min-h-screen bg-background">
      <TemplateComponent 
        data={link.resumeDataSnapshot} 
        theme={link.resumeDataSnapshot.theme}
        isPreview={false}
      />
    </div>
  );
} 