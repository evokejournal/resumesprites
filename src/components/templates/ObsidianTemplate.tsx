'use client';

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const themes = {
  original: {
    bg: 'from-gray-200 to-gray-300',
    paper: 'bg-white/80',
    text: 'text-gray-800',
    mainHeading: 'text-gray-800',
    subHeading: 'text-gray-600',
    strong: 'text-gray-800',
    accent: 'bg-gray-800',
    accentText: 'text-white',
    highlight: 'text-amber-400',
    quoteIcon: 'fill-amber-400',
    skillDot: 'bg-gray-800',
    skillDotEmpty: 'bg-gray-300',
  },
  ruby: {
    bg: 'from-red-100 to-gray-100',
    paper: 'bg-white/80',
    text: 'text-gray-800',
    mainHeading: 'text-red-700',
    subHeading: 'text-gray-600',
    strong: 'text-gray-900',
    accent: 'bg-red-700',
    accentText: 'text-white',
    highlight: 'text-red-500',
    quoteIcon: 'fill-red-500',
    skillDot: 'bg-red-700',
    skillDotEmpty: 'bg-red-200',
  },
  jade: {
    bg: 'from-gray-800 to-gray-900',
    paper: 'bg-black/50',
    text: 'text-gray-200',
    mainHeading: 'text-white',
    subHeading: 'text-gray-400',
    strong: 'text-white',
    accent: 'bg-teal-500',
    accentText: 'text-black',
    highlight: 'text-teal-400',
    quoteIcon: 'fill-teal-400',
    skillDot: 'bg-teal-400',
    skillDotEmpty: 'bg-gray-600',
  },
  sapphire: {
    bg: 'from-blue-100 to-slate-200',
    paper: 'bg-white/80',
    text: 'text-gray-800',
    mainHeading: 'text-blue-800',
    subHeading: 'text-gray-600',
    strong: 'text-blue-900',
    accent: 'bg-blue-700',
    accentText: 'text-white',
    highlight: 'text-cyan-400',
    quoteIcon: 'fill-cyan-400',
    skillDot: 'bg-blue-700',
    skillDotEmpty: 'bg-blue-200',
  },
  quartz: {
    bg: 'from-pink-100 to-fuchsia-100',
    paper: 'bg-white/80',
    text: 'text-gray-800',
    mainHeading: 'text-fuchsia-800',
    subHeading: 'text-gray-600',
    strong: 'text-fuchsia-900',
    accent: 'bg-fuchsia-700',
    accentText: 'text-white',
    highlight: 'text-pink-400',
    quoteIcon: 'fill-pink-400',
    skillDot: 'bg-fuchsia-700',
    skillDotEmpty: 'bg-fuchsia-200',
  },
};

const QuoteIcon = ({ className }: { className?: string }) => (
    <svg width="48" height="34" viewBox="0 0 48 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.8801 0.400024H0.880127V33.28H18.8801V16.84H6.52013V11.08H18.8801V0.400024Z" />
        <path d="M47.32 0.400024H29.32V33.28H47.32V16.84H34.96V11.08H47.32V0.400024Z" />
    </svg>
);

const SkillDots = ({ level, theme }: { level: number, theme: typeof themes.original }) => {
    const totalDots = 5;
    const filledDots = Math.round((level / 100) * totalDots);
    return (
      <div className="flex gap-1.5">
        {[...Array(totalDots)].map((_, i) => (
          <span key={i} className={cn(`h-2.5 w-2.5 rounded-full`, i < filledDots ? theme.skillDot : theme.skillDotEmpty)} />
        ))}
      </div>
    );
};


interface TemplateProps {
  data: ResumeData;
}

export function ObsidianTemplate({ data }: TemplateProps) {
    const { about, contact, experience, education, skills, custom } = data;
    const [firstName, ...lastName] = about.name.split(' ');
    const theme = themes[data.theme as keyof typeof themes] || themes.original;

    return (
        <div className={cn("min-h-screen bg-gradient-to-br font-body p-4 sm:p-8", theme.bg, theme.text)}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
            >
                <div className={cn("relative w-full backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden", theme.paper)}>
                    {/* Header */}
                    <header className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="md:col-span-1">
                            <Image
                                src="https://placehold.co/400x500.png"
                                alt={about.name}
                                width={400}
                                height={500}
                                data-ai-hint="professional portrait"
                                className="rounded-2xl object-cover aspect-[4/5] shadow-md"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <h1 className={cn("font-archivo text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none", theme.mainHeading)}>
                                {firstName}<br/>{lastName.join(' ')}
                            </h1>
                            <div className={cn("text-white rounded-2xl p-4 flex items-center justify-between", theme.accent, theme.accentText)}>
                                <div className='flex items-center gap-4'>
                                    <ArrowRight className={cn("h-6 w-6", theme.highlight)} />
                                    <span className="font-headline text-lg">Contact</span>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                    <p>{contact.phone}</p>
                                    <p>{contact.location}</p>
                                    <p>{contact.website}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Body */}
                    <main className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Left Column */}
                        <div className="md:col-span-1 space-y-8">
                           {about.summary && (
                             <div className={cn("rounded-2xl p-6 relative", theme.accent, theme.accentText)}>
                                <div className="absolute -top-4 left-4">
                                  <QuoteIcon className={theme.quoteIcon} />
                                </div>
                                <p className="mt-8 text-sm leading-relaxed">{about.summary}</p>
                            </div>
                           )}
                           {skills.length > 0 && (
                             <div>
                                <h3 className={cn("font-headline text-2xl font-bold mb-4", theme.strong)}>Skills</h3>
                                <div className="space-y-3">
                                    {skills.map(skill => (
                                        <div key={skill.id} className="flex justify-between items-center text-sm">
                                            <span>{skill.name}</span>
                                            <SkillDots level={skill.level} theme={theme} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                           )}
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div>
                                {custom.items.length > 0 && (
                                    <div className='mb-8'>
                                        <h3 className={cn("font-headline text-2xl font-bold mb-4", theme.strong)}>{custom.title || 'Awards'}</h3>
                                        <div className="space-y-4">
                                            {custom.items.map(item => (
                                                <div key={item.id}>
                                                    <p className="font-bold">{item.description.split('\n')[0]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                 {education.length > 0 && (
                                    <div>
                                        <h3 className={cn("font-headline text-2xl font-bold mb-4", theme.strong)}>Education</h3>
                                        <div className="space-y-4">
                                            {education.map(edu => (
                                                <div key={edu.id}>
                                                    <p className="font-bold text-sm">{edu.degree}</p>
                                                    <p className={cn("text-xs", theme.subHeading)}>{edu.institution}</p>
                                                    <p className={cn("text-xs", theme.subHeading)}>{edu.startDate} - {edu.endDate}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                             <div>
                                {experience.length > 0 && (
                                    <div>
                                        <h3 className={cn("font-headline text-2xl font-bold mb-4", theme.strong)}>Experience</h3>
                                        <div className="space-y-6">
                                            {experience.map(job => (
                                                <div key={job.id}>
                                                    <p className="font-bold text-sm">{job.role}</p>
                                                    <p className={cn("text-xs font-semibold", theme.subHeading)}>{job.company}</p>
                                                    <p className={cn("text-xs mb-1", theme.subHeading)}>{job.startDate} - {job.endDate}</p>
                                                    <p className={cn("text-xs whitespace-pre-line", theme.subHeading)}>{job.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                    <div className="absolute bottom-0 left-0 p-6 sm:p-10 flex items-end pointer-events-none z-0">
                        <h2 className={cn("font-archivo text-6xl sm:text-7xl md:text-8xl font-black uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap leading-none opacity-10", theme.strong)}>
                            Resume
                        </h2>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
