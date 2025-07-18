
import React from 'react';
import dynamic from 'next/dynamic';

// Lazy load template components
const YoubleTemplate = dynamic(() => import('@/components/templates/GoobleItTemplate').then(mod => ({ default: mod.YoubleTemplate })), { ssr: false });
const OperatingSystemTemplate = dynamic(() => import('@/components/templates/OperatingSystemTemplate').then(mod => ({ default: mod.OperatingSystemTemplate })), { ssr: false });
const ForTaxPurposesTemplate = dynamic(() => import('@/components/templates/ReceiptRollTemplate').then(mod => ({ default: mod.ForTaxPurposesTemplate })), { ssr: false });
const CodeSyntaxTemplate = dynamic(() => import('@/components/templates/CodeSyntaxTemplate').then(mod => ({ default: mod.CodeSyntaxTemplate })), { ssr: false });
const SnakebiteResumeTemplate = dynamic(() => import('@/components/templates/SnakebiteResumeTemplate').then(mod => ({ default: mod.SnakebiteResumeTemplate })), { ssr: false });
const BouncingResumeTemplate = dynamic(() => import('@/components/templates/BouncingResumeTemplate').then(mod => ({ default: mod.BouncingResumeTemplate })), { ssr: false });
const ExplosivePotentialTemplate = dynamic(() => import('@/components/templates/ExplosivePotentialTemplate').then(mod => ({ default: mod.ExplosivePotentialTemplate })), { ssr: false });
const SmsConversationTemplate = dynamic(() => import('@/components/templates/SmsConversationTemplate').then(mod => ({ default: mod.SmsConversationTemplate })), { ssr: false });
const RetroTerminalTemplate = dynamic(() => import('@/components/templates/RetroTerminalTemplate').then(mod => ({ default: mod.RetroTerminalTemplate })), { ssr: false });

// Lazy load preview components
const YoublePreview = dynamic(() => import('@/components/templates/previews/GoobleItPreview').then(mod => ({ default: mod.YoublePreview })), { ssr: false });
const OperatingSystemPreview = dynamic(() => import('@/components/templates/previews/OperatingSystemPreview').then(mod => ({ default: mod.OperatingSystemPreview })), { ssr: false });
const ForTaxPurposesPreview = dynamic(() => import('@/components/templates/previews/ReceiptRollPreview').then(mod => ({ default: mod.ForTaxPurposesPreview })), { ssr: false });
const CodeSyntaxPreview = dynamic(() => import('@/components/templates/previews/CodeSyntaxPreview').then(mod => ({ default: mod.CodeSyntaxPreview })), { ssr: false });
const SnakebiteResumePreview = dynamic(() => import('@/components/templates/previews/SnakebiteResumePreview').then(mod => ({ default: mod.SnakebiteResumePreview })), { ssr: false });
const BouncingResumePreview = dynamic(() => import('@/components/templates/previews/BouncingResumePreview').then(mod => ({ default: mod.BouncingResumePreview })), { ssr: false });
const ExplosivePotentialPreview = dynamic(() => import('@/components/templates/previews/ExplosivePotentialPreview').then(mod => ({ default: mod.ExplosivePotentialPreview })), { ssr: false });
const SmsConversationPreview = dynamic(() => import('@/components/templates/previews/SmsConversationPreview').then(mod => ({ default: mod.SmsConversationPreview })), { ssr: false });
const RetroTerminalPreview = dynamic(() => import('@/components/templates/previews/RetroTerminalPreview').then(mod => ({ default: mod.RetroTerminalPreview })), { ssr: false });

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
    name: "Typing...",
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
