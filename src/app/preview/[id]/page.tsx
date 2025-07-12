
"use client";

import { useResume } from '@/context/ResumeContext';
import React, { useState } from 'react';
import { FullScreenPreview } from '@/components/FullScreenPreview';
import { Loader2 } from 'lucide-react';

import { templateComponentMap } from '@/lib/templates';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function PreviewPage() {
  const { resumeData, isHydrated } = useResume();
  const params = useParams();
  const templateId = params.id as string;
  const [isCoverLetterOpen, setCoverLetterOpen] = useState(false);

  if (!isHydrated) {
    return (
      <ProtectedRoute>
        <FullScreenPreview>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        </FullScreenPreview>
      </ProtectedRoute>
    );
  }

  const TemplateComponent = templateComponentMap[templateId];

  if (!TemplateComponent) {
    return (
      <ProtectedRoute>
        <FullScreenPreview>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-muted-foreground">Template not found.</p>
            </div>
          </div>
        </FullScreenPreview>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <FullScreenPreview>
        <div className="min-h-screen">
          <TemplateComponent 
            data={resumeData} 
            isCoverLetterOpen={isCoverLetterOpen}
            setCoverLetterOpen={setCoverLetterOpen}
          />
        </div>
      </FullScreenPreview>
    </ProtectedRoute>
  );
}
