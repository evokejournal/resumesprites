'use client';

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const themes = {
  original: {
    bg: 'bg-[#FFF8F5]',
    text: 'text-[#3D3D3D]',
    headerBg: 'bg-[#FA8072]',
    accentBg: 'bg-[#FA8072]',
    accentText: 'text-white',
    linkHover: 'hover:text-[#FA8072]',
  },
  mint: {
    bg: 'bg-green-50',
    text: 'text-gray-800',
    headerBg: 'bg-emerald-300',
    accentBg: 'bg-emerald-400',
    accentText: 'text-white',
    linkHover: 'hover:text-emerald-500',
  },
  butter: {
    bg: 'bg-amber-50',
    text: 'text-indigo-900',
    headerBg: 'bg-amber-300',
    accentBg: 'bg-indigo-800',
    accentText: 'text-white',
    linkHover: 'hover:text-indigo-600',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    headerBg: 'bg-sky-300',
    accentBg: 'bg-sky-500',
    accentText: 'text-white',
    linkHover: 'hover:text-sky-600',
  },
  lilac: {
    bg: 'bg-violet-50',
    text: 'text-violet-900',
    headerBg: 'bg-violet-300',
    accentBg: 'bg-violet-500',
    accentText: 'text-white',
    linkHover: 'hover:text-violet-600',
  },
};

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

const Section = ({ title, children, className, theme, pdfMode }: { title: string, children: React.ReactNode, className?: string, theme: typeof themes.original, pdfMode?: boolean }) => (
    pdfMode ? (
        <section className={`mb-10 ${className}`}>
            <div className={cn("inline-block", theme.accentBg)}>
                <h2 className={cn("text-xs font-bold uppercase tracking-widest px-2 py-1", theme.accentText)}>{title}</h2>
            </div>
            <div className="text-sm">
                {children}
            </div>
        </section>
    ) : (
        <motion.section 
            className={`mb-10 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
        >
            <div className={cn("inline-block", theme.accentBg)}>
                <h2 className={cn("text-xs font-bold uppercase tracking-widest px-2 py-1", theme.accentText)}>{title}</h2>
            </div>
            <div className="text-sm">
                {children}
            </div>
        </motion.section>
    )
);

export function PeachPitTemplate({ data, pdfMode }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, references, custom } = data;
    const theme = themes[data.theme as keyof typeof themes] || themes.original;

    return (
        <div className={cn("font-sans min-h-screen", theme.bg, theme.text)}>
            <header className={cn("w-full py-24 sm:py-32 md:py-40 px-8 sm:px-12 md:px-16", theme.headerBg)}>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <div className="flex-shrink-0">
                        {pdfMode ? (
                            <h1 className="text-9xl font-thin tracking-tighter">Hello.</h1>
                        ) : (
                            <motion.h1 
                                className="text-9xl font-thin tracking-tighter"
                                initial={{ opacity: 0, y: -20, rotate: 5 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  rotate: 0,
                                  transition: {
                                    type: 'spring',
                                    stiffness: 80,
                                    damping: 8,
                                    mass: 0.8,
                                  },
                                }}
                            >
                                Hello.
                            </motion.h1>
                        )}
                    </div>
                    <div className="md:w-2/5 md:max-w-xs text-sm leading-relaxed whitespace-pre-line">
                        <p>{about.summary}</p>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto">
                <main className="p-8 sm:p-12 md:p-16">
                    <div className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h2 className="text-3xl font-bold">{about.name}</h2>
                            <p className="text-lg">{about.jobTitle}</p>
                        </div>
                         <div className="text-left sm:text-right text-sm font-semibold">
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                            <p>{contact.website}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
                        {/* Left Column */}
                        <div>
                            {experience.length > 0 && (
                                <Section title="Experience" theme={theme} pdfMode={pdfMode}>
                                    <div className="space-y-6">
                                        {experience.map(job => (
                                            <div key={job.id}>
                                                <h3 className="font-bold text-base">{job.company}</h3>
                                                <p>{job.role}</p>
                                                <p className="text-xs mb-1">{job.startDate} - {job.endDate}</p>
                                                <p className="whitespace-pre-line text-xs">{job.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                            {references.length > 0 && (
                                <Section title="References" theme={theme} pdfMode={pdfMode}>
                                    <div className="space-y-4">
                                        {references.map(ref => (
                                            <div key={ref.id}>
                                                <p className="font-bold">{ref.name}</p>
                                                <p>{ref.relation}</p>
                                                <p className="text-xs">{ref.contact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                        </div>
                        {/* Right Column */}
                         <div>
                            {education.length > 0 && (
                                <Section title="Education" theme={theme} pdfMode={pdfMode}>
                                    <div className="space-y-6">
                                        {education.map(edu => (
                                             <div key={edu.id}>
                                                <h3 className="font-bold text-base">{edu.degree}</h3>
                                                <p>{edu.institution}</p>
                                                <p className="text-xs">{edu.startDate} - {edu.endDate}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                             {skills.length > 0 && (
                                <Section title="Skills" theme={theme} pdfMode={pdfMode}>
                                    <ul className="space-y-1">
                                        {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                                    </ul>
                                </Section>
                            )}
                             {portfolio.length > 0 && (
                                <Section title="Portfolio" theme={theme} pdfMode={pdfMode}>
                                    <div className="space-y-4">
                                        {portfolio.map(item => (
                                            <div key={item.id}>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("font-bold", theme.linkHover)}>{item.title}</a>
                                                <p className="text-xs mt-1">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                            {custom.items.length > 0 && (
                                <Section title={custom.title || 'Accomplishments'} theme={theme} pdfMode={pdfMode}>
                                    <ul className="space-y-1 list-disc list-inside">
                                        {custom.items.map(item => <li key={item.id}>{item.description}</li>)}
                                    </ul>
                                </Section>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
