"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  previewComponent: React.ReactNode;
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  name: string;
  onSelect: (templateId: string) => void;
  onPreview?: () => void;
}

export function TemplateCard({ template, isSelected, name, onSelect, onPreview }: TemplateCardProps) {
  const { generateResumeLink } = useResume();
  const { toast } = useToast();
  
  const handleSelectTemplate = () => {
    onSelect(template.id);
  };

  // State for Create URL modal and password
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Preview handler
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/preview/${template.id}`, '_blank');
  };

  // Mouse click handler
  const handleGenerateLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a password for your resume link.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      // Pass the template ID directly to ensure it's used in the link
      const newLink = await generateResumeLink(password, template.id);
      
      setPassword('');
      setModalOpen(false);
      toast({
        title: "Link generated!",
        description: `Your resume link has been created with ID: ${newLink.shortId}`,
      });
    } catch (error) {
      console.error('Link generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Keyboard handler
  const handleGenerateLinkKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateLinkClick(e as any);
    }
  };

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
    >
      <Card
        onClick={handleSelectTemplate}
        className={cn(
          "flex flex-col transition-all cursor-pointer relative overflow-hidden group w-full box-border hover:scale-[1.03]", 
          isSelected && "outline outline-2 outline-primary"
        )}
      >
        {isSelected && (
          <CheckCircle2
              className="absolute top-3 right-3 z-10 h-10 w-10 text-primary fill-white"
          />
        )}
        <CardHeader>
          <CardTitle className="h-14">{template.name}</CardTitle>
          <CardDescription className="h-16">{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="relative mt-auto">
            <div className="aspect-square overflow-hidden rounded-md border">
              {template.previewComponent}
            </div>
            {/* Animated Action Buttons inside the card */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden mt-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex gap-4">
                    <Button
                      onClick={onPreview}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <Link className="h-4 w-4 mr-2" />
                          Create URL
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Set Password & Confirm</DialogTitle>
                          <DialogDescription>
                            This link will use your current template and data snapshot.
                          </DialogDescription>
                        </DialogHeader>
                        <form autoComplete="off">
                          <div className="flex flex-col items-center gap-4 py-2">
                            <div className="mb-2">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Current Template</span>
                                <div className="w-32 h-20 flex items-center justify-center border rounded bg-muted">
                                  {template.previewComponent}
                                </div>
                                <span className="text-sm mt-1">{template.name}</span>
                              </div>
                            </div>
                            <div className="w-full">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder="Enter password for this link"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleGenerateLinkKey}
                                autoFocus
                                autoComplete="off"
                              />
                            </div>
                            <Button
                              onClick={handleGenerateLinkClick}
                              disabled={isGenerating || !password.trim()}
                              className="w-full mt-2"
                            >
                              {isGenerating ? 'Generating...' : 'Confirm & Generate'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
