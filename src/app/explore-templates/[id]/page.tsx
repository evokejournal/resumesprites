
"use client";

import { previewResumeData } from '@/lib/data';
import React, { useState } from 'react';
import { RetroTerminalTemplate } from '@/components/templates/RetroTerminalTemplate';
import { OperatingSystemTemplate } from '@/components/templates/OperatingSystemTemplate';
import { YoubleTemplate } from '@/components/templates/GoobleItTemplate';
import { ForTaxPurposesTemplate } from '@/components/templates/ReceiptRollTemplate';
import { ExplosivePotentialTemplate } from '@/components/templates/ExplosivePotentialTemplate';
import { SmsConversationTemplate } from '@/components/templates/SmsConversationTemplate';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CodeSyntaxTemplate } from '@/components/templates/CodeSyntaxTemplate';
import { SnakebiteResumeTemplate } from '@/components/templates/SnakebiteResumeTemplate';
import { BouncingResumeTemplate } from '@/components/templates/BouncingResumeTemplate';


export default function PublicPreviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const resumeData = { ...previewResumeData, template: id || 'youble' };
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
      case 'code-syntax':
        return <CodeSyntaxTemplate {...props} />;
      case 'retro-terminal':
        return <RetroTerminalTemplate {...props} />;
      case 'operating-system':
        return <OperatingSystemTemplate {...props} />;
      case 'youble':
        return <YoubleTemplate {...props} />;
      case 'for-tax-purposes':
        return <ForTaxPurposesTemplate {...props} />;
      case 'explosive-potential':
        return <ExplosivePotentialTemplate {...props} />;
      case 'sms-conversation':
        return <SmsConversationTemplate {...props} />;
      case 'snakebite-resume':
        return <SnakebiteResumeTemplate {...props} />;
      case 'bouncing-resume':
        return <BouncingResumeTemplate {...props} />;
      default:
        return <YoubleTemplate {...props} />;
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
