"use client";

import { MainLayout } from "@/components/MainLayout";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { useResume } from "@/context/ResumeContext";
import { templates } from "@/lib/templates";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { templateComponentMap } from "@/lib/templates";
import { useRouter } from 'next/navigation';

export default function TemplatesPageClient() {
  const { resumeData, updateField, generateResumeLink, isHydrated } = useResume();
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(resumeData.template || null);
  // Preview modal state
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const router = useRouter();
  const handleOpenPreview = (templateId: string) => router.push(`/templates/preview/${templateId}`);
  const handleClosePreview = () => setPreviewTemplateId(null);
  const PreviewComponent = previewTemplateId ? templateComponentMap[previewTemplateId] : null;

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

  const handlePreview = () => {
    if (selectedTemplateId) {
      window.open(`/preview/${selectedTemplateId}`, '_blank');
    }
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplateId);
  
  // Masonry layout logic
  const columns = 3;
  const columnedTemplates = Array.from({ length: columns }, () => [] as typeof templates);
  templates.forEach((template, i) => {
    columnedTemplates[i % columns].push(template);
  });

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
        <div className="space-y-6 relative">
          <div>
            <h1 className="text-3xl font-headline font-bold">Choose Your Template</h1>
            <p className="text-muted-foreground">Select a template that best represents your professional style.</p>
          </div>
          
          {/* Masonry layout for template cards */}
          <div className="flex gap-8">
            {columnedTemplates.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-8 flex-1">
                {col.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={resumeData.template === template.id}
                    name={resumeData.about.name}
                    onSelect={handleSelectTemplate}
                    onPreview={() => handleOpenPreview(template.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 