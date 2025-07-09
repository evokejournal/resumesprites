"use client";

import { useRouter, useParams } from 'next/navigation';
import { useResume } from '@/context/ResumeContext';
import { templateComponentMap } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { resumeData } = useResume();
  const templateId = params.templateId as string;
  const TemplateComponent = templateComponentMap[templateId];

  return (
    <div className="relative w-full h-full min-h-screen">
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50"
        onClick={() => router.push('/templates')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="w-full h-full flex items-center justify-center">
        {TemplateComponent ? (
          <div className="w-full h-full">
            <TemplateComponent data={resumeData} />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Template not found.</div>
        )}
      </div>
    </div>
  );
} 