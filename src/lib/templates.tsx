
import React from 'react';
import { CareerPathPreview } from "@/components/templates/previews/CareerPathPreview";
import { RetroTerminalPreview } from "@/components/templates/previews/RetroTerminalPreview";
import { OperatingSystemPreview } from "@/components/templates/previews/OperatingSystemPreview";
import { ScarletTimelinePreview } from "@/components/templates/previews/ScarletTimelinePreview";
import { TypographicGridPreview } from "@/components/templates/previews/TypographicGridPreview";
import { ObsidianPreview } from "@/components/templates/previews/ObsidianPreview";
import { MutedElegancePreview } from "@/components/templates/previews/MutedElegancePreview";
import { PeachPitPreview } from "@/components/templates/previews/PeachPitPreview";
import { ExtremelyProfessionalPreview } from "@/components/templates/previews/ExtremelyProfessionalPreview";
import { YoublePreview } from "@/components/templates/previews/GoobleItPreview";
import { ForTaxPurposesPreview } from "@/components/templates/previews/ReceiptRollPreview";
import { ExplosivePotentialPreview } from "@/components/templates/previews/ExplosivePotentialPreview";
import { SmsConversationPreview } from '@/components/templates/previews/SmsConversationPreview';
import { CodeSyntaxPreview } from '@/components/templates/previews/CodeSyntaxPreview';
import { DigitalDashboardPreview } from "@/components/templates/previews/DigitalDashboardPreview";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { YoubleTemplate } from "@/components/templates/GoobleItTemplate";
import { MineHireTemplate } from "@/components/templates/MineHireTemplate";
import { ObsidianTemplate } from "@/components/templates/ObsidianTemplate";
import { PeachPitTemplate } from "@/components/templates/PeachPitTemplate";
import { ForTaxPurposesTemplate } from "@/components/templates/ReceiptRollTemplate";
import { RetroTerminalTemplate } from "@/components/templates/RetroTerminalTemplate";
import { ScarletTimelineTemplate } from "@/components/templates/ScarletTimelineTemplate";
import { SmsConversationTemplate } from "@/components/templates/SmsConversationTemplate";
import { SnakebiteResumeTemplate } from "@/components/templates/SnakebiteResumeTemplate";
import { TypographicGridTemplate } from "@/components/templates/TypographicGridTemplate";
import { OperationTemplate } from "@/components/templates/OperationTemplate";
import { MutedEleganceTemplate } from "@/components/templates/MutedEleganceTemplate";
import { CareerPathTemplate } from "@/components/templates/CareerPathTemplate";
import { CodeSyntaxTemplate } from "@/components/templates/CodeSyntaxTemplate";
import { ExplosivePotentialTemplate } from "@/components/templates/ExplosivePotentialTemplate";
import { ExtremelyProfessionalTemplate } from "@/components/templates/ExtremelyProfessionalTemplate";
import { DigitalDashboardTemplate } from "@/components/templates/DigitalDashboardTemplate";
import { OperatingSystemTemplate } from "@/components/templates/OperatingSystemTemplate";

export const templates = [
  {
    id: "code-syntax",
    name: "Code Syntax",
    description: "A resume that looks like it's written in a code editor, complete with syntax highlighting.",
    previewComponent: <CodeSyntaxPreview />,
  },
  {
    id: "sms-conversation",
    name: "SMS Conversation",
    description: "Your resume unfolds as an automated, engaging text message chat.",
    previewComponent: <SmsConversationPreview />,
  },
  {
    id: "youble",
    name: "Just Youble It",
    description: "A playful, interactive resume designed to look like a search engine results page.",
    previewComponent: <YoublePreview />,
  },
  {
    id: "operating-system",
    name: "Operating System",
    description: "A nostalgic, interactive desktop experience from the 90s.",
    previewComponent: <OperatingSystemPreview />,
  },
  {
    id: "explosive-potential",
    name: "Explosive Potential",
    description: "A playful, interactive Minesweeper-style resume where every click reveals your skills.",
    previewComponent: <ExplosivePotentialPreview />,
  },
  {
    id: "for-tax-purposes",
    name: "For Tax Purposes",
    description: "A creative resume formatted like a long, printed store receipt.",
    previewComponent: <ForTaxPurposesPreview />,
  },
  {
    id: "retro-terminal",
    name: "Retro Terminal",
    description: "An old-school, interactive terminal for the tech-savvy.",
    previewComponent: <RetroTerminalPreview />,
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "A modern, bold layout with a striking visual structure and rounded elements.",
    previewComponent: <ObsidianPreview />,
  },
  {
    id: "typographic-grid",
    name: "Typographic Grid",
    description: "A clean, editorial-style layout with a focus on typography.",
    previewComponent: <TypographicGridPreview />,
  },
  {
    id: "peach-pit",
    name: "Peach Pit",
    description: "An elegant, minimalist design with a warm color palette and clean typography.",
    previewComponent: <PeachPitPreview />,
  },
  {
    id: "extremely-professional",
    name: "Extremely Professional",
    description: "A warm, professional template that looks and feels like a classic resume.",
    previewComponent: <ExtremelyProfessionalPreview />,
  },
  {
    id: "career-path",
    name: "Career Path",
    description: "An interactive, single-page resume that visualizes your career journey.",
    previewComponent: <CareerPathPreview />,
  },
  {
    id: "scarlet-timeline",
    name: "Scarlet Timeline",
    description: "A bold, stylish design with an animated, flowing timeline.",
    previewComponent: <ScarletTimelinePreview />,
  },
  {
    id: "muted-elegance",
    name: "Muted Elegance",
    description: "Soft neutral tones with minimalist serif fonts, smooth fades and scroll reveals.",
    previewComponent: <MutedElegancePreview />,
  },
  {
    id: "digital-dashboard",
    name: "Digital Dashboard",
    description: "A modern, card-based dashboard layout with widgets for each section.",
    previewComponent: <DigitalDashboardPreview />,
  },
];

export const templateComponentMap: Record<string, React.ComponentType<any>> = {
  'modern': ModernTemplate,
  'youble': YoubleTemplate,
  'mine-hire': MineHireTemplate,
  'obsidian': ObsidianTemplate,
  'peach-pit': PeachPitTemplate,
  'for-tax-purposes': ForTaxPurposesTemplate,
  'retro-terminal': RetroTerminalTemplate,
  'scarlet-timeline': ScarletTimelineTemplate,
  'sms-conversation': SmsConversationTemplate,
  'snakebite-resume': SnakebiteResumeTemplate,
  'typographic-grid': TypographicGridTemplate,
  'operation': OperationTemplate,
  'muted-elegance': MutedEleganceTemplate,
  'career-path': CareerPathTemplate,
  'code-syntax': CodeSyntaxTemplate,
  'explosive-potential': ExplosivePotentialTemplate,
  'extremely-professional': ExtremelyProfessionalTemplate,
  'digital-dashboard': DigitalDashboardTemplate,
  'operating-system': OperatingSystemTemplate,
};

export function getTemplateComponent(templateName: string): React.ComponentType<any> {
  const Component = templateComponentMap[templateName];
  if (!Component) {
    console.warn(`Template component not found for: ${templateName}, falling back to modern`);
    return templateComponentMap['modern'] || ModernTemplate;
  }
  return Component;
}
