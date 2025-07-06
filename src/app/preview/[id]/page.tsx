
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
import { CreepyLampTemplate } from '@/components/templates/CreepyLampTemplate';
import { MirrorMirrorTemplate } from '@/components/templates/MirrorMirrorTemplate';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const { resumeData, isHydrated } = useResume();
  const [isCoverLetterOpen, setCoverLetterOpen] = useState(false);

  // Open cover letter if it exists
  React.useEffect(() => {
    if (resumeData.coverLetter) {
      setCoverLetterOpen(true);
    }
  }, [resumeData.coverLetter]);

  if (!isHydrated) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">Loading Live Preview...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderTemplate = () => {
    const props = {
      data: resumeData,
      isCoverLetterOpen: isCoverLetterOpen,
      setCoverLetterOpen: setCoverLetterOpen,
    };

    switch (resumeData.template) {
      case 'mirror-mirror':
        return <MirrorMirrorTemplate {...props} />;
      case 'creepy-lamp':
        return <CreepyLampTemplate {...props} />;
      case 'code-syntax':
        return <CodeSyntaxTemplate {...props} />;
      case 'retro-terminal':
        return <RetroTerminalTemplate {...props} />;
      case 'operating-system':
        return <OperatingSystemTemplate {...props} />;
      case 'scarlet-timeline':
        return <ScarletTimelineTemplate {...props} />;
      case 'typographic-grid':
        return <TypographicGridTemplate {...props} />;
      case 'obsidian':
        return <ObsidianTemplate {...props} />;
      case 'muted-elegance':
        return <MutedEleganceTemplate {...props} />;
      case 'peach-pit':
        return <PeachPitTemplate {...props} />;
      case 'extremely-professional':
        return <ExtremelyProfessionalTemplate {...props} />;
      case 'youble':
        return <YoubleTemplate {...props} />;
      case 'for-tax-purposes':
        return <ForTaxPurposesTemplate {...props} />;
      case 'explosive-potential':
        return <ExplosivePotentialTemplate {...props} />;
      case 'sms-conversation':
        return <SmsConversationTemplate {...props} />;
      case 'career-path':
      default:
        return <CareerPathTemplate {...props} />;
    }
  };

  return (
    <MainLayout>
      {renderTemplate()}
    </MainLayout>
  );
}
