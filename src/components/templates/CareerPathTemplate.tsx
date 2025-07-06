'use client';

import React, { useState, useMemo } from 'react';
import type { ResumeData } from '@/lib/types';
import { User, Briefcase, GraduationCap, Star, FolderGit2, Users, Wrench, Mail, Phone, MapPin, X, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const themes = {
  original: {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    sectionText: 'text-slate-600',
    headerText: 'text-slate-900',
    subHeaderText: 'text-slate-600',
    contactText: 'text-slate-500',
    accent: 'text-blue-600',
    accentHover: 'hover:text-blue-700',
    timelineBg: 'bg-slate-300',
    nodeBg: 'bg-slate-100',
    nodeBorder: 'border-slate-400',
    nodeBorderActive: 'border-slate-800',
    nodeIcon: 'text-slate-500',
    nodeIconActive: 'text-slate-800',
    cardBg: 'bg-white',
    cardIcon: 'text-emerald-500',
    skillBg: 'bg-slate-200',
    skillText: 'text-slate-800',
    refBg: 'bg-slate-100',
  },
  forest: {
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    sectionText: 'text-stone-600',
    headerText: 'text-stone-900',
    subHeaderText: 'text-stone-600',
    contactText: 'text-stone-500',
    accent: 'text-green-700',
    accentHover: 'hover:text-green-800',
    timelineBg: 'bg-stone-300',
    nodeBg: 'bg-stone-100',
    nodeBorder: 'border-stone-400',
    nodeBorderActive: 'border-stone-800',
    nodeIcon: 'text-stone-500',
    nodeIconActive: 'text-stone-800',
    cardBg: 'bg-white',
    cardIcon: 'text-lime-600',
    skillBg: 'bg-stone-200',
    skillText: 'text-stone-800',
    refBg: 'bg-stone-100',
  },
  sunrise: {
    bg: 'bg-orange-50',
    text: 'text-stone-800',
    sectionText: 'text-stone-600',
    headerText: 'text-stone-900',
    subHeaderText: 'text-stone-600',
    contactText: 'text-stone-500',
    accent: 'text-amber-600',
    accentHover: 'hover:text-amber-700',
    timelineBg: 'bg-orange-200',
    nodeBg: 'bg-orange-50',
    nodeBorder: 'border-orange-400',
    nodeBorderActive: 'border-orange-800',
    nodeIcon: 'text-orange-500',
    nodeIconActive: 'text-orange-800',
    cardBg: 'bg-white',
    cardIcon: 'text-yellow-500',
    skillBg: 'bg-orange-100',
    skillText: 'text-orange-900',
    refBg: 'bg-orange-100',
  },
  ocean: {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    sectionText: 'text-sky-700',
    headerText: 'text-sky-950',
    subHeaderText: 'text-sky-800',
    contactText: 'text-sky-600',
    accent: 'text-sky-600',
    accentHover: 'hover:text-sky-700',
    timelineBg: 'bg-slate-300',
    nodeBg: 'bg-sky-50',
    nodeBorder: 'border-slate-400',
    nodeBorderActive: 'border-sky-800',
    nodeIcon: 'text-slate-500',
    nodeIconActive: 'text-sky-800',
    cardBg: 'bg-white',
    cardIcon: 'text-sky-500',
    skillBg: 'bg-sky-100',
    skillText: 'text-sky-800',
    refBg: 'bg-sky-100',
  },
  lavender: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    sectionText: 'text-slate-600',
    headerText: 'text-slate-900',
    subHeaderText: 'text-slate-700',
    contactText: 'text-slate-500',
    accent: 'text-violet-600',
    accentHover: 'hover:text-violet-700',
    timelineBg: 'bg-stone-300',
    nodeBg: 'bg-slate-50',
    nodeBorder: 'border-stone-400',
    nodeBorderActive: 'border-violet-800',
    nodeIcon: 'text-stone-500',
    nodeIconActive: 'text-violet-800',
    cardBg: 'bg-white',
    cardIcon: 'text-violet-500',
    skillBg: 'bg-violet-100',
    skillText: 'text-violet-800',
    refBg: 'bg-violet-100',
  },
};

type Theme = typeof themes.original;

const AboutSection: React.FC<{ data: ResumeData['about'], theme: Theme }> = ({ data, theme }) => (
  <div>
    <p className={cn("whitespace-pre-line", theme.sectionText)}>{data.summary}</p>
  </div>
);

const ExperienceSection: React.FC<{ data: ResumeData['experience'], theme: Theme }> = ({ data, theme }) => (
    <div className="space-y-6">
      {data.map(job => (
        <div key={job.id}>
          <h4 className={cn("font-bold text-lg", theme.text)}>{job.role}</h4>
          <p className={cn("font-medium", theme.accent)}>{job.company} | {job.startDate} - {job.endDate}</p>
          <p className={cn("mt-2 whitespace-pre-line", theme.sectionText)}>{job.description}</p>
        </div>
      ))}
    </div>
);

const EducationSection: React.FC<{ data: ResumeData['education'], theme: Theme }> = ({ data, theme }) => (
    <div className="space-y-4">
      {data.map(edu => (
        <div key={edu.id}>
          <h4 className={cn("font-bold text-lg", theme.text)}>{edu.degree}</h4>
          <p className={cn("font-medium", theme.accent)}>{edu.institution}</p>
          <p className={cn("text-sm", theme.contactText)}>{edu.startDate} - {edu.endDate}</p>
        </div>
      ))}
    </div>
);

const SkillsSection: React.FC<{ data: ResumeData['skills'], theme: Theme }> = ({ data, theme }) => (
    <div className="flex flex-wrap gap-2">
      {data.map(skill => (
        <span key={skill.id} className={cn("px-3 py-1 rounded-full text-sm font-medium", theme.skillBg, theme.skillText)}>
          {skill.name}
        </span>
      ))}
    </div>
);

const PortfolioSection: React.FC<{ data: ResumeData['portfolio'], theme: Theme }> = ({ data, theme }) => (
    <div className="space-y-4">
      {data.map(item => (
        <div key={item.id}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("font-bold text-lg hover:underline flex items-center gap-2", theme.accent, theme.accentHover)}>
            {item.title} <ExternalLink className="size-4" />
          </a>
          <p className={theme.sectionText}>{item.description}</p>
        </div>
      ))}
    </div>
);

const ReferencesSection: React.FC<{ data: ResumeData['references'], theme: Theme }> = ({ data, theme }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(ref => (
        <div key={ref.id} className={cn("p-4 rounded-lg", theme.refBg)}>
          <h4 className={cn("font-bold", theme.text)}>{ref.name}</h4>
          <p className={cn("text-sm font-medium", theme.accent)}>{ref.relation}</p>
          <p className={cn("text-sm", theme.contactText)}>{ref.contact}</p>
        </div>
      ))}
    </div>
);

const CustomSectionComponent: React.FC<{ data: ResumeData['custom'], theme: Theme }> = ({ data, theme }) => (
  <div className="space-y-2">
    {data.items.map(item => (
      <p key={item.id} className={theme.sectionText}>{item.description}</p>
    ))}
  </div>
);

interface CareerPathTemplateProps {
  data: ResumeData;
}

export function CareerPathTemplate({ data }: CareerPathTemplateProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>('experience');
  const theme = themes[data.theme as keyof typeof themes] || themes.original;

  const sections = useMemo(() => [
    { id: 'about', label: 'About', icon: User, component: <AboutSection data={data.about} theme={theme} />, hasContent: !!data.about.summary },
    { id: 'experience', label: 'Experience', icon: Briefcase, component: <ExperienceSection data={data.experience} theme={theme} />, hasContent: data.experience.length > 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, component: <EducationSection data={data.education} theme={theme} />, hasContent: data.education.length > 0 },
    { id: 'skills', label: 'Skills', icon: Star, component: <SkillsSection data={data.skills} theme={theme} />, hasContent: data.skills.length > 0 },
    { id: 'portfolio', label: 'Portfolio', icon: FolderGit2, component: <PortfolioSection data={data.portfolio} theme={theme} />, hasContent: data.portfolio.length > 0 },
    { id: 'references', label: 'References', icon: Users, component: <ReferencesSection data={data.references} theme={theme} />, hasContent: data.references.length > 0 },
    { id: 'custom', label: data.custom.title, icon: Wrench, component: <CustomSectionComponent data={data.custom} theme={theme} />, hasContent: data.custom.items.length > 0 },
  ].filter(section => section.hasContent), [data, theme]);

  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    return sections.find(s => s.id === activeSectionId);
  }, [activeSectionId, sections]);
  
  return (
    <div className={cn("min-h-screen font-body p-4 sm:p-8 md:p-12", theme.bg, theme.text)}>
      <div className="max-w-5xl mx-auto">
        <header className="text-center py-8">
          <h1 className={cn("text-5xl md:text-6xl font-headline font-bold", theme.headerText)} style={{fontFamily: 'serif'}}>{data.about.name}</h1>
          <h2 className={cn("text-xl md:text-2xl mt-2", theme.subHeaderText)}>{data.about.jobTitle}</h2>
          <div className={cn("flex justify-center items-center flex-wrap gap-4 md:gap-6 mt-4 text-sm", theme.contactText)}>
            <a href={`mailto:${data.contact.email}`} className={cn("flex items-center gap-2", theme.accentHover)}><Mail className="size-4" />{data.contact.email}</a>
            <span className="flex items-center gap-2"><Phone className="size-4" />{data.contact.phone}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4" />{data.contact.location}</span>
          </div>
        </header>

        <nav className="relative flex items-center justify-center py-8">
          <div className={cn("absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2", theme.timelineBg)}></div>
          <div className="relative flex items-center justify-around w-full max-w-2xl">
            {sections.map((section) => (
              <div key={section.id} className="relative z-10 flex flex-col items-center group">
                <button 
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative",
                    theme.nodeBg,
                    activeSectionId === section.id ? `${theme.nodeBorderActive} scale-110` : `${theme.nodeBorder} hover:border-slate-500`
                  )}
                  aria-label={`View ${section.label}`}
                >
                  <section.icon className={cn(
                    "size-6 transition-colors z-10",
                    activeSectionId === section.id ? theme.nodeIconActive : theme.nodeIcon
                  )} />
                </button>
                <span className={cn(
                    "absolute top-14 text-xs font-medium transition-opacity duration-300 opacity-0 group-hover:opacity-100",
                    activeSectionId === section.id && 'opacity-100'
                )}>{section.label}</span>
              </div>
            ))}
          </div>
        </nav>
        
        <main className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeSection && (
              <motion.div
                key={activeSection.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                className="absolute w-full"
              >
                <div className={cn("p-6 sm:p-8 rounded-xl shadow-2xl relative", theme.cardBg)}>
                    <button onClick={() => setActiveSectionId(null)} className={cn("absolute top-4 right-4 z-20", theme.contactText, theme.accentHover)}>
                        <X className="size-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <activeSection.icon className={cn("size-6", theme.cardIcon)} />
                      <h3 className={cn("text-2xl font-bold", theme.text)}>{activeSection.label}</h3>
                    </div>
                    {activeSection.component}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
