
import React from 'react';
import { CareerPathPreview } from "@/components/templates/previews/CareerPathPreview";
import { RetroTerminalPreview } from "@/components/templates/previews/RetroTerminalPreview";
import { OperatingSystemPreview } from "@/components/templates/previews/OperatingSystemPreview";
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
import { SnakebiteResumePreview } from "@/components/templates/previews/SnakebiteResumePreview";

import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { YoubleTemplate } from "@/components/templates/GoobleItTemplate";
import { MineHireTemplate } from "@/components/templates/MineHireTemplate";
import { ObsidianTemplate } from "@/components/templates/ObsidianTemplate";
import { PeachPitTemplate } from "@/components/templates/PeachPitTemplate";
import { ForTaxPurposesTemplate } from "@/components/templates/ReceiptRollTemplate";
import { RetroTerminalTemplate } from "@/components/templates/RetroTerminalTemplate";
import { SmsConversationTemplate } from "@/components/templates/SmsConversationTemplate";
import { SnakebiteResumeTemplate } from "@/components/templates/SnakebiteResumeTemplate";
import { TypographicGridTemplate } from "@/components/templates/TypographicGridTemplate";
import { OperationTemplate } from "@/components/templates/OperationTemplate";
import { MutedEleganceTemplate } from "@/components/templates/MutedEleganceTemplate";
import { CareerPathTemplate } from "@/components/templates/CareerPathTemplate";
import { CodeSyntaxTemplate } from "@/components/templates/CodeSyntaxTemplate";
import { ExplosivePotentialTemplate } from "@/components/templates/ExplosivePotentialTemplate";
import { ExtremelyProfessionalTemplate } from "@/components/templates/ExtremelyProfessionalTemplate";

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
    id: "muted-elegance",
    name: "Muted Elegance",
    description: "Soft neutral tones with minimalist serif fonts, smooth fades and scroll reveals.",
    previewComponent: <MutedElegancePreview />,
  },
  {
    id: "snakebite-resume",
    name: "Snakebite Resume",
    description: "A playful, retro snake game-inspired resume. Unlock sections as you play!",
    previewComponent: <SnakebiteResumePreview />,
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
  'sms-conversation': SmsConversationTemplate,
  'snakebite-resume': SnakebiteResumeTemplate,
  'typographic-grid': TypographicGridTemplate,
  'operation': OperationTemplate,
  'muted-elegance': MutedEleganceTemplate,
  'career-path': CareerPathTemplate,
  'code-syntax': CodeSyntaxTemplate,
  'explosive-potential': ExplosivePotentialTemplate,
  'extremely-professional': ExtremelyProfessionalTemplate,
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

export const templateStyleMap: Record<string, { background: string; fontFamily: string; textColor: string }> = {
  'modern': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'youble': { background: '#fff', fontFamily: 'Arial, sans-serif', textColor: '#222' },
  'mine-hire': { background: '#f7f6e7', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'obsidian': { background: '#18181b', fontFamily: 'Inter, sans-serif', textColor: '#fff' },
  'peach-pit': { background: '#fff7f0', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'for-tax-purposes': { background: '#fff', fontFamily: 'Menlo, monospace', textColor: '#222' },
  'retro-terminal': { background: '#18181b', fontFamily: 'Menlo, monospace', textColor: '#00ff00' },
  'sms-conversation': { background: '#f5f5f5', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'snakebite-resume': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'typographic-grid': { background: '#fff', fontFamily: 'Georgia, serif', textColor: '#222' },
  'operation': { background: '#f3f4f6', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'muted-elegance': { background: '#f8fafc', fontFamily: 'Georgia, serif', textColor: '#222' },
  'career-path': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'code-syntax': { background: '#18181b', fontFamily: 'Menlo, monospace', textColor: '#a6e22e' },
  'explosive-potential': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'extremely-professional': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'operating-system': { background: '#e5e7eb', fontFamily: 'Inter, sans-serif', textColor: '#222' },
};

export function getTemplateStyle(templateId: string) {
  return templateStyleMap[templateId] || templateStyleMap['modern'];
}
