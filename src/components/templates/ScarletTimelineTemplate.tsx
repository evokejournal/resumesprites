
"use client";

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = {
  original: {
    bg: 'bg-[#f3eee1]',
    timelineBg: 'bg-[#a41f24]',
    text: 'text-black',
    subtleText: 'text-black/60',
    sectionTitleBg: 'bg-[#a41f24]',
    sectionTitleText: 'text-[#f3eee1]',
    linkHover: 'hover:text-[#a41f24]',
    modalBg: 'bg-[#f3eee1]',
    modalBorder: 'border-[#a41f24]',
    modalHeader: 'bg-[#a41f24]/10',
    modalHeaderText: 'text-[#a41f24]',
  },
  cobalt: {
    bg: 'bg-slate-50',
    timelineBg: 'bg-blue-700',
    text: 'text-slate-900',
    subtleText: 'text-slate-600',
    sectionTitleBg: 'bg-blue-700',
    sectionTitleText: 'text-white',
    linkHover: 'hover:text-blue-700',
    modalBg: 'bg-white',
    modalBorder: 'border-blue-700',
    modalHeader: 'bg-blue-700/10',
    modalHeaderText: 'text-blue-700',
  },
  emerald: {
    bg: 'bg-stone-50',
    timelineBg: 'bg-emerald-800',
    text: 'text-stone-900',
    subtleText: 'text-stone-600',
    sectionTitleBg: 'bg-emerald-800',
    sectionTitleText: 'text-white',
    linkHover: 'hover:text-emerald-800',
    modalBg: 'bg-white',
    modalBorder: 'border-emerald-800',
    modalHeader: 'bg-emerald-800/10',
    modalHeaderText: 'text-emerald-800',
  },
  amethyst: {
    bg: 'bg-purple-50',
    timelineBg: 'bg-purple-800',
    text: 'text-purple-950',
    subtleText: 'text-purple-900/60',
    sectionTitleBg: 'bg-purple-800',
    sectionTitleText: 'text-white',
    linkHover: 'hover:text-purple-800',
    modalBg: 'bg-white',
    modalBorder: 'border-purple-800',
    modalHeader: 'bg-purple-800/10',
    modalHeaderText: 'text-purple-800',
  },
  goldleaf: {
    bg: 'bg-yellow-50',
    timelineBg: 'bg-yellow-700',
    text: 'text-stone-900',
    subtleText: 'text-stone-600',
    sectionTitleBg: 'bg-yellow-700',
    sectionTitleText: 'text-white',
    linkHover: 'hover:text-yellow-700',
    modalBg: 'bg-white',
    modalBorder: 'border-yellow-700',
    modalHeader: 'bg-yellow-700/10',
    modalHeaderText: 'text-yellow-700',
  },
};

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

const SectionTitle = ({ title, className, theme }: { title: string, className?: string, theme: typeof themes.original }) => (
    <div className={cn("inline-block mb-4 shadow-md", className, theme.sectionTitleBg)}>
        <h3 className={cn("font-bold uppercase tracking-wider px-4 py-1 text-sm", theme.sectionTitleText)}>
            {title}
        </h3>
    </div>
);

const TimelineEntry = ({ onRightSide, children, animationDelay, pdfMode }: { onRightSide: boolean, children: React.ReactNode, animationDelay: number, pdfMode?: boolean }) => {
    return pdfMode ? (
        <div
            className={cn(
                "my-12 flex w-1/2 relative",
                onRightSide ? "ml-[50%] -translate-x-12 pl-6" : "mr-[50%] translate-x-12 pr-6"
            )}
        >
            <div className={cn("w-full", onRightSide ? 'text-left' : 'text-right')}>
                {children}
            </div>
        </div>
    ) : (
        <motion.div
            className={cn(
                "my-12 flex w-1/2 relative",
                onRightSide ? "ml-[50%] -translate-x-12 pl-6" : "mr-[50%] translate-x-12 pr-6"
            )}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.6 }}
        >
            <div className={cn("w-full", onRightSide ? 'text-left' : 'text-right')}>
                {children}
            </div>
        </motion.div>
    );
};

export function ScarletTimelineTemplate({ data, pdfMode }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, references, custom } = data;
    const theme = themes[data.theme as keyof typeof themes] || themes.original;
    
    const sections = [
        { id: 'experience', data: experience, title: 'Work History' },
        { id: 'education', data: education, title: 'Education' },
        { id: 'skills', data: skills, title: 'Skills' },
        { id: 'portfolio', data: portfolio, title: 'Portfolio' },
        { id: 'custom', data: custom.items, title: custom.title },
        { id: 'references', data: references, title: 'References' },
    ].filter(s => s.data && (Array.isArray(s.data) ? s.data.length > 0 : s.data));
    
    const firstSectionIsOnRight = true;
    const headerPosition = firstSectionIsOnRight ? 'left-8 text-left' : 'right-8 text-right';

    return (
        <div className={cn("relative min-h-screen w-full overflow-x-hidden py-24 px-4 font-serif antialiased", theme.bg, theme.text)} style={{'--font-family-serif': 'Georgia, "Times New Roman", Times, serif'} as React.CSSProperties}>
            {pdfMode ? (
                <div
                    className={cn("absolute top-0 left-1/2 z-0 h-full w-48 -translate-x-full", theme.timelineBg)}
                />
            ) : (
                <motion.div
                    className={cn("absolute top-0 left-1/2 z-0 h-full w-48 -translate-x-full", theme.timelineBg)}
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
            )}

            <div className="relative z-10 mx-auto max-w-5xl">
                {pdfMode ? (
                    <div 
                        className={cn("absolute top-0", headerPosition)}
                        style={{ top: '-4rem' }}
                    >
                         <h1 className="text-4xl font-bold uppercase tracking-wider text-black/80">{about.name}</h1>
                         <h2 className={cn("text-xl", theme.subtleText)}>{about.jobTitle}</h2>
                         <div className={cn("mt-2 text-sm space-y-1", theme.subtleText)}>
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                         </div>
                    </div>
                ) : (
                    <motion.div 
                        className={cn("absolute top-0", headerPosition)}
                        style={{ top: '-4rem' }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                         <h1 className="text-4xl font-bold uppercase tracking-wider text-black/80">{about.name}</h1>
                         <h2 className={cn("text-xl", theme.subtleText)}>{about.jobTitle}</h2>
                         <div className={cn("mt-2 text-sm space-y-1", theme.subtleText)}>
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                         </div>
                    </motion.div>
                )}

                <div>
                    {sections.map((section, index) => {
                        const onRightSide = index % 2 === 0;
                        return (
                            <TimelineEntry
                                key={section.id}
                                onRightSide={onRightSide}
                                animationDelay={1.2 + index * 0.3}
                                pdfMode={pdfMode}
                            >
                                <SectionTitle title={section.title} theme={theme} />
                                <div className="space-y-4 text-sm text-black/70">
                                    {section.id === 'experience' && (section.data as ResumeData['experience']).map(job => (
                                        <div key={job.id}>
                                            <h4 className="font-bold text-black/90">{job.role}</h4>
                                            <p className="font-semibold text-black/60">{job.company}</p>
                                            <p className="text-xs text-black/50">{job.startDate} - {job.endDate}</p>
                                            <p className="mt-1 whitespace-pre-line text-xs">{job.description}</p>
                                        </div>
                                    ))}
                                    {section.id === 'education' && (section.data as ResumeData['education']).map(item => (
                                        <div key={item.id} className="mb-3">
                                            <p className="font-bold text-black/90">{item.institution}</p>
                                            <p>{item.degree}</p>
                                            <p className="text-xs text-black/50">{item.startDate} - {item.endDate}</p>
                                        </div>
                                    ))}
                                    {section.id === 'skills' && (section.data as ResumeData['skills']).map(skill => (
                                       <div key={skill.id}>
                                           <p className="font-bold">{skill.name} - {skill.level}%</p>
                                       </div>
                                    ))}
                                    {section.id === 'portfolio' && (section.data as ResumeData['portfolio']).map(item => (
                                        <div key={item.id}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("font-bold flex items-center gap-2", theme.linkHover)} style={{justifyContent: onRightSide ? 'flex-start' : 'flex-end'}}>
                                                {item.title} <ExternalLink size={14} />
                                            </a>
                                            <p className="mt-1 whitespace-pre-line text-xs">{item.description}</p>
                                        </div>
                                    ))}
                                    {section.id === 'references' && (section.data as ResumeData['references']).map(ref => (
                                        <div key={ref.id}>
                                            <p className="font-bold text-black/90">{ref.name}</p>
                                            <p className="text-black/60">{ref.relation} | {ref.contact}</p>
                                        </div>
                                    ))}
                                    {section.id === 'custom' && (section.data as ResumeData['custom']['items']).map(item => (
                                        <p key={item.id} className="mb-2 whitespace-pre-line">{item.description}</p>
                                    ))}
                                </div>
                            </TimelineEntry>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
