
import React from 'react';

import { YoubleTemplate } from "@/components/templates/GoobleItTemplate";
import { ForTaxPurposesTemplate } from "@/components/templates/ReceiptRollTemplate";
import { RetroTerminalTemplate } from "@/components/templates/RetroTerminalTemplate";
import { SmsConversationTemplate } from "@/components/templates/SmsConversationTemplate";
import { SnakebiteResumeTemplate } from "@/components/templates/SnakebiteResumeTemplate";
import { CodeSyntaxTemplate } from "@/components/templates/CodeSyntaxTemplate";
import { ExplosivePotentialTemplate } from "@/components/templates/ExplosivePotentialTemplate";
import { BouncingResumeTemplate } from "@/components/templates/BouncingResumeTemplate";
import { OperatingSystemTemplate } from "@/components/templates/OperatingSystemTemplate";

import { RetroTerminalPreview } from "@/components/templates/previews/RetroTerminalPreview";
import { OperatingSystemPreview } from "@/components/templates/previews/OperatingSystemPreview";
import { YoublePreview } from "@/components/templates/previews/GoobleItPreview";
import { ForTaxPurposesPreview } from "@/components/templates/previews/ReceiptRollPreview";
import { ExplosivePotentialPreview } from "@/components/templates/previews/ExplosivePotentialPreview";
import { SmsConversationPreview } from '@/components/templates/previews/SmsConversationPreview';
import { CodeSyntaxPreview } from '@/components/templates/previews/CodeSyntaxPreview';
import { SnakebiteResumePreview } from "@/components/templates/previews/SnakebiteResumePreview";
import { BouncingResumePreview } from "@/components/templates/previews/BouncingResumePreview";

export const templates = [
  {
    id: "youble",
    name: "I'm Feelin' Lucky",
    description: "A playful, interactive resume designed to look like a search engine results page.",
    previewComponent: <YoublePreview />,
  },
  {
    id: "operating-system",
    name: "System Requirements",
    description: "A nostalgic, interactive desktop experience from the 90s.",
    previewComponent: <OperatingSystemPreview />,
  },
  {
    id: "for-tax-purposes",
    name: "For Tax Purposes",
    description: "A creative resume formatted like a long, printed store receipt.",
    previewComponent: <ForTaxPurposesPreview />,
  },
  {
    id: "code-syntax",
    name: "Hello, World!",
    description: "A resume that looks like it's written in a code editor, complete with syntax highlighting.",
    previewComponent: <CodeSyntaxPreview />,
  },
  {
    id: "snakebite-resume",
    name: "Reptile Function",
    description: "A playful, retro snake game-inspired resume. Unlock sections as you play!",
    previewComponent: <SnakebiteResumePreview />,
  },
  {
    id: "bouncing-resume",
    name: "Widescreen Credentials",
    description: "A dynamic, bouncing logo resume that reveals content as it bounces around the screen.",
    previewComponent: <BouncingResumePreview />,
  },
  {
    id: "explosive-potential",
    name: "Explosive Potential",
    description: "A playful, interactive Minesweeper-style resume where every click reveals your skills.",
    previewComponent: <ExplosivePotentialPreview />,
  },
  {
    id: "sms-conversation",
    name: "SMS Conversation",
    description: "Your resume unfolds as an automated, engaging text message chat.",
    previewComponent: <SmsConversationPreview />,
  },
  {
    id: "retro-terminal",
    name: "Terminally Employable",
    description: "An old-school, interactive terminal for the tech-savvy.",
    previewComponent: <RetroTerminalPreview />,
  },
];

export const templateComponentMap: Record<string, React.ComponentType<any>> = {
  'youble': YoubleTemplate,
  'for-tax-purposes': ForTaxPurposesTemplate,
  'retro-terminal': RetroTerminalTemplate,
  'sms-conversation': SmsConversationTemplate,
  'snakebite-resume': SnakebiteResumeTemplate,
  'code-syntax': CodeSyntaxTemplate,
  'explosive-potential': ExplosivePotentialTemplate,
  'operating-system': OperatingSystemTemplate,
  'bouncing-resume': BouncingResumeTemplate,
};

export function getTemplateComponent(templateName: string): React.ComponentType<any> {
  const Component = templateComponentMap[templateName];
  if (!Component) {
    console.warn(`Template component not found for: ${templateName}, falling back to youble`);
    return templateComponentMap['youble'] || YoubleTemplate;
  }
  return Component;
}

export const templateStyleMap: Record<string, { background: string; fontFamily: string; textColor: string }> = {
  'youble': { background: '#fff', fontFamily: 'Arial, sans-serif', textColor: '#222' },
  'for-tax-purposes': { background: '#fff', fontFamily: 'Menlo, monospace', textColor: '#222' },
  'retro-terminal': { background: '#18181b', fontFamily: 'Menlo, monospace', textColor: '#00ff00' },
  'sms-conversation': { background: '#f5f5f5', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'snakebite-resume': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'bouncing-resume': { background: '#000', fontFamily: 'Orbitron, sans-serif', textColor: '#fff' },
  'code-syntax': { background: '#18181b', fontFamily: 'Menlo, monospace', textColor: '#a6e22e' },
  'explosive-potential': { background: '#fff', fontFamily: 'Inter, sans-serif', textColor: '#222' },
  'operating-system': { background: '#e5e7eb', fontFamily: 'Inter, sans-serif', textColor: '#222' },
};

export function getTemplateStyle(templateId: string) {
  return templateStyleMap[templateId] || templateStyleMap['youble'];
}
