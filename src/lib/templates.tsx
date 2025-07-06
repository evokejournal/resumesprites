
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
import { CreepyLampPreview } from '@/components/templates/previews/CreepyLampPreview';
import { MirrorMirrorPreview } from '@/components/templates/previews/MirrorMirrorPreview';

export const templates = [
  {
    id: "mirror-mirror",
    name: "Mirror, Mirror",
    description: "A striking, symmetrical layout that mirrors your resume content across a central axis.",
    previewComponent: <MirrorMirrorPreview />,
  },
  {
    id: "creepy-lamp",
    name: "Creepy Lamp",
    description: "A spooky, interactive resume revealed by the flickering light of a swinging lamp.",
    previewComponent: <CreepyLampPreview />,
  },
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
];
