"use client";

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { cn } from '@/lib/utils';

const themes = {
  original: {
    bg: 'bg-[#FDFBF5]',
    text: 'text-black',
    subtleText: 'text-black/70',
    strongText: 'text-black/80',
    hr: 'bg-black',
    linkHover: 'hover:underline',
  },
  charcoal: {
    bg: 'bg-[#262626]',
    text: 'text-neutral-200',
    subtleText: 'text-neutral-400',
    strongText: 'text-neutral-100',
    hr: 'bg-amber-300',
    linkHover: 'hover:text-amber-300',
  },
  coral: {
    bg: 'bg-sky-50',
    text: 'text-slate-800',
    subtleText: 'text-slate-600',
    strongText: 'text-slate-900',
    hr: 'bg-coral-500',
    linkHover: 'hover:text-coral-500',
  },
  blueprint: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    subtleText: 'text-blue-800/80',
    strongText: 'text-blue-900',
    hr: 'bg-blue-600',
    linkHover: 'hover:text-blue-700',
  },
  rosewater: {
    bg: 'bg-rose-50',
    text: 'text-rose-950',
    subtleText: 'text-rose-900/80',
    strongText: 'text-rose-950',
    hr: 'bg-rose-400',
    linkHover: 'hover:text-rose-500',
  },
};

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

const Section = ({ title, children, className, theme }: { title: string, children: React.ReactNode, className?: string, theme: typeof themes.original }) => (
    <div className={cn("py-4", className)}>
        <h2 className="font-gloock text-7xl mb-3 hyphens-auto lowercase">{title}</h2>
        <div className={cn("space-y-3 text-sm", theme.subtleText)}>
            {children}
        </div>
        <hr className={cn("mt-4 h-[8px] border-0", theme.hr)} />
    </div>
);

export function TypographicGridTemplate({ data, pdfMode }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, custom, interests, references } = data;
    const theme = themes[data.theme as keyof typeof themes] || themes.original;

    return (
        <div className={cn("min-h-screen p-8 sm:p-12 md:p-16 font-sans", theme.bg, theme.text)}>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-12">
                {/* Left Gutter */}
                <aside className="md:col-span-1 py-4">
                    <h2 className="font-gloock text-7xl mb-3 hyphens-auto lowercase">about me</h2>
                    <div className={cn("space-y-1 text-sm", theme.subtleText)}>
                        <p className={cn("font-bold", theme.text)}>{about.name}</p>
                        <p>{about.jobTitle}</p>
                        <a href={`mailto:${contact.email}`} className={cn(theme.linkHover, "block")}>{contact.email}</a>
                        <p>{contact.phone}</p>
                        <p>{contact.location}</p>
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn(theme.linkHover, "block")}>{contact.website}</a>
                    </div>
                     <hr className={cn("mt-4 h-[8px] border-0", theme.hr)} />
                     <div className={cn("mt-4 text-sm whitespace-pre-line", theme.subtleText)}>
                       {about.summary}
                     </div>
                </aside>

                {/* Main Content Grid */}
                <main className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                   <div className="flex flex-col">
                        {experience.length > 0 && (
                            <Section title="work experience" theme={theme}>
                                {experience.map(job => (
                                    <div key={job.id}>
                                        <p className="text-xs text-black/50">{job.startDate} - {job.endDate}</p>
                                        <p className={cn("font-semibold", theme.strongText)}>{job.company}</p>
                                        <p>{job.role}</p>
                                    </div>
                                ))}
                            </Section>
                        )}
                        {portfolio.length > 0 && (
                            <Section title="Portfolio" theme={theme}>
                                {portfolio.map(item => (
                                     <div key={item.id}>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("font-semibold", theme.strongText, theme.linkHover)}>{item.title}</a>
                                        <p className="text-xs">{item.description}</p>
                                    </div>
                                ))}
                            </Section>
                        )}
                         {interests.length > 0 && (
                            <Section title="Interests" theme={theme}>
                                <p>{interests.map(i => i.name).join(', ')}</p>
                            </Section>
                        )}
                   </div>

                   <div className="flex flex-col">
                        {education.length > 0 && (
                            <Section title="Education" theme={theme}>
                                 {education.map(item => (
                                    <div key={item.id}>
                                        <p className="text-xs text-black/50">{item.startDate} - {item.endDate}</p>
                                        <p className={cn("font-semibold", theme.strongText)}>{item.institution}</p>
                                        <p>{item.degree}</p>
                                    </div>
                                ))}
                            </Section>
                        )}
                        {skills.length > 0 && (
                            <Section title="Skills" theme={theme}>
                                {skills.map(skill => (
                                    <p key={skill.id}>{skill.name}</p>
                                ))}
                            </Section>
                        )}
                        {custom.items.length > 0 && (
                            <Section title={custom.title} theme={theme}>
                                {custom.items.map(item => (
                                    <p key={item.id}>{item.description}</p>
                                ))}
                            </Section>
                        )}
                         {references.length > 0 && (
                            <Section title="References" theme={theme}>
                                {references.map(ref => (
                                    <div key={ref.id} className="text-sm">
                                        <p className={cn("font-semibold", theme.strongText)}>{ref.name}</p>
                                        <p>{ref.relation}</p>
                                        <p>{ref.contact}</p>
                                    </div>
                                ))}
                            </Section>
                        )}
                   </div>
                </main>
            </div>
        </div>
    );
}
