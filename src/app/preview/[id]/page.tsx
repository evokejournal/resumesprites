
"use client";

import { useResume } from '@/context/ResumeContext';
import React, { useState } from 'react';
import { CareerPathTemplate } from '@/components/templates/CareerPathTemplate';
import { RetroTerminalTemplate } from '@/components/templates/RetroTerminalTemplate';
import { OperatingSystemTemplate } from '@/components/templates/OperatingSystemTemplate';
import { ScarletTimelineTemplate } from '@/components/templates/ScarletTimelineTemplate';
import { TypographicGridTemplate } from '@/components/templates/TypographicGridTemplate';
import { ObsidianTemplate } from '@/components/templates/ObsidianTemplate';
import { MutedEleganceTemplate } from '@/components/templates/MutedEleganceTemplate';
import { PeachPitTemplate } from '@/components/templates/PeachPitTemplate';
import { ExtremelyProfessionalTemplate } from '@/components/templates/ExtremelyProfessionalTemplate';
import { YoubleTemplate } from '@/components/templates/GoobleItTemplate';
import { ForTaxPurposesTemplate } from '@/components/templates/ReceiptRollTemplate';
import { ExplosivePotentialTemplate } from '@/components/templates/ExplosivePotentialTemplate';
import { SmsConversationTemplate } from '@/components/templates/SmsConversationTemplate';
import { MainLayout } from '@/components/MainLayout';
import { Loader2 } from 'lucide-react';
import { CodeSyntaxTemplate } from '@/components/templates/CodeSyntaxTemplate';
import { DigitalDashboardTemplate } from '@/components/templates/DigitalDashboardTemplate';
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
        <MainLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const TemplateComponent = templateComponentMap[templateId];

  if (!TemplateComponent) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-muted-foreground">Template not found.</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen">
          <TemplateComponent 
            data={resumeData} 
            isCoverLetterOpen={isCoverLetterOpen}
            setCoverLetterOpen={setCoverLetterOpen}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
