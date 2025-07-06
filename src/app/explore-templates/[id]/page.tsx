
"use client";

import { initialResumeData } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CodeSyntaxTemplate } from '@/components/templates/CodeSyntaxTemplate';
import { CreepyLampTemplate } from '@/components/templates/CreepyLampTemplate';
import { MirrorMirrorTemplate } from '@/components/templates/MirrorMirrorTemplate';

export default function PublicPreviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const resumeData = { ...initialResumeData, template: id };
  const [isCoverLetterOpen, setCoverLetterOpen] = useState(false);

  React.useEffect(() => {
    if (resumeData.coverLetter) {
      setCoverLetterOpen(true);
    }
  }, [resumeData.coverLetter]);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link href="/explore-templates" passHref>
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </Link>
        <Link href="/builder" passHref>
          <Button>
            Sign Up to Use This Template
          </Button>
        </Link>
      </div>
      {renderTemplate()}
    </div>
  );
}
