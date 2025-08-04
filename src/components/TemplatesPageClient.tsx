"use client";

import { MainLayout } from "@/components/MainLayout";
import { useResume } from "@/context/ResumeContext";
import { templates } from "@/lib/templates";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, Link, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { templateComponentMap } from "@/lib/templates";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TemplatesPageClient() {
  const { resumeData, updateField, generateResumeLink, isHydrated } = useResume();
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(resumeData.template || null);
  const router = useRouter();

  // Keep selectedTemplateId in sync with resumeData.template
  useEffect(() => {
    if (resumeData.template) {
      setSelectedTemplateId(resumeData.template);
    }
  }, [resumeData.template]);

  const handleSelectTemplate = (templateId: string) => {
    updateField('template', templateId);
    setSelectedTemplateId(templateId);
  };

  const handlePreview = (templateId: string) => {
    window.open(`/preview/${templateId}`, '_blank');
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplateId);

  // Don't render until data is hydrated
  if (!isHydrated) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-headline font-bold">Choose Your Template</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Choose Your Template</h1>
            <p className="text-muted-foreground">Select a template that best represents your professional style.</p>
          </div>
          
          {/* Horizontal tabs layout */}
          <div className="space-y-6">
            {templates.map((template) => (
              <TemplateTab
                key={template.id}
                template={template}
                isSelected={resumeData.template === template.id}
                name={resumeData.about.name}
                onSelect={handleSelectTemplate}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

// New TemplateTab component for horizontal layout
function TemplateTab({ template, isSelected, name, onSelect, onPreview }: {
  template: any;
  isSelected: boolean;
  name: string;
  onSelect: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}) {
  const { generateResumeLink } = useResume();
  const { toast } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectTemplate = () => {
    onSelect(template.id);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(template.id);
  };

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
      const newLink = await generateResumeLink(password, template.id, companyName.trim());
      
      setPassword('');
      setCompanyName('');
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
      <div
        onClick={handleSelectTemplate}
        className={cn(
          "flex items-start gap-6 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50 relative",
          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        {/* Action buttons (only show when selected) */}
        <AnimatePresence mode="wait">
          {isSelected ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-2 flex-shrink-0"
              onClick={e => e.stopPropagation()}
            >
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
              >
                Preview
              </Button>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
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
                        <Label htmlFor="companyName">Company Name (optional)</Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Enter company name for easy reference"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          autoComplete="off"
                        />
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
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ width: 0 }}
              animate={{ width: 0 }}
              exit={{ width: 0 }}
              className="flex-shrink-0"
            />
          )}
        </AnimatePresence>
        
        {/* Template preview */}
        <motion.div 
          layout
          transition={{ 
            layout: { 
              duration: 0.3, 
              ease: 'easeInOut' 
            } 
          }}
          className="w-40 h-40 rounded-md border overflow-hidden flex-shrink-0"
        >
          {template.previewComponent}
        </motion.div>
        
        {/* Template info */}
        <motion.div 
          layout
          transition={{ 
            layout: { 
              duration: 0.3, 
              ease: 'easeInOut' 
            } 
          }}
          className="flex-1 min-w-0 flex flex-col justify-start"
        >
          <h3 className="font-semibold text-xl">{template.name}</h3>
          <p className="text-muted-foreground text-sm">{template.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
} 