'use client';

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

const themes = {
  original: {
    bg: 'bg-stone-50',
    text: 'text-stone-800',
    heading: 'text-stone-700',
    strong: 'text-stone-900',
    subtle: 'text-stone-600',
    muted: 'text-stone-500',
    border: 'border-stone-300',
    borderLight: 'border-stone-200',
    accentBg: 'bg-stone-200/80',
    accentText: 'text-stone-700',
    linkHover: 'hover:text-stone-500',
    linkHoverStrong: 'hover:text-stone-800',
  },
  lavender: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    heading: 'text-slate-700',
    strong: 'text-slate-900',
    subtle: 'text-slate-600',
    muted: 'text-slate-500',
    border: 'border-slate-300',
    borderLight: 'border-slate-200',
    accentBg: 'bg-violet-200/80',
    accentText: 'text-violet-800',
    linkHover: 'hover:text-violet-600',
    linkHoverStrong: 'hover:text-violet-700',
  },
  sage: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-800',
    heading: 'text-zinc-700',
    strong: 'text-zinc-900',
    subtle: 'text-zinc-600',
    muted: 'text-zinc-500',
    border: 'border-zinc-300',
    borderLight: 'border-zinc-200',
    accentBg: 'bg-emerald-200/80',
    accentText: 'text-emerald-800',
    linkHover: 'hover:text-emerald-600',
    linkHoverStrong: 'hover:text-emerald-700',
  },
  ocean: {
    bg: 'bg-sky-50',
    text: 'text-sky-950',
    heading: 'text-sky-900',
    strong: 'text-sky-950',
    subtle: 'text-sky-800',
    muted: 'text-sky-700',
    border: 'border-sky-300',
    borderLight: 'border-sky-200',
    accentBg: 'bg-sky-200/80',
    accentText: 'text-sky-800',
    linkHover: 'hover:text-sky-600',
    linkHoverStrong: 'hover:text-sky-700',
  },
  clay: {
    bg: 'bg-orange-50',
    text: 'text-orange-950',
    heading: 'text-orange-900',
    strong: 'text-orange-950',
    subtle: 'text-orange-800',
    muted: 'text-orange-700',
    border: 'border-orange-300',
    borderLight: 'border-orange-200',
    accentBg: 'bg-orange-200/80',
    accentText: 'text-orange-800',
    linkHover: 'hover:text-orange-600',
    linkHoverStrong: 'hover:text-orange-700',
  },
};

interface TemplateProps {
  data: ResumeData;
}

const Section = ({ title, children, className, theme, scrollDirection }: { title: string, children: React.ReactNode, className?: string, theme: typeof themes.original, scrollDirection: 'up' | 'down' }) => {
  const y = scrollDirection === 'down' ? 50 : -50;
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={cn("font-serif text-3xl font-medium mb-6 border-b pb-3", theme.heading, theme.border)}>{title}</h2>
      {children}
    </motion.section>
  );
};

export function MutedEleganceTemplate({ data }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;
  const theme = themes[data.theme as keyof typeof themes] || themes.original;
  const scrollDirection = useScrollDirection();

  return (
    <div className={cn("font-sans min-h-screen", theme.bg, theme.text)}>
      <div className="max-w-4xl mx-auto p-8 sm:p-12 md:p-16">
        <header className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("font-serif text-5xl md:text-6xl font-medium", theme.strong)}
          >
            {about.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn("mt-2 text-xl", theme.muted)}
          >
            {about.jobTitle}
          </motion.p>
        </header>

        <main className="space-y-16">
          {about.summary && (
            <Section title="About Me" theme={theme} scrollDirection={scrollDirection}>
              <p className={cn("text-base leading-relaxed whitespace-pre-line", theme.subtle)}>
                {about.summary}
              </p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience" theme={theme} scrollDirection={scrollDirection}>
              <div className="space-y-8">
                {experience.map(job => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={cn("text-xl font-semibold", theme.text)}>{job.role}</h3>
                      <p className={cn("text-sm", theme.muted)}>{job.startDate} - {job.endDate}</p>
                    </div>
                    <p className={cn("text-md font-medium", theme.subtle)}>{job.company}</p>
                    <p className={cn("mt-2 text-sm leading-relaxed whitespace-pre-line", theme.subtle)}>{job.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" theme={theme} scrollDirection={scrollDirection}>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <span key={skill.id} className={cn("px-4 py-1.5 rounded-full text-sm font-medium", theme.accentBg, theme.accentText)}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
              <Section title="Education" theme={theme} scrollDirection={scrollDirection}>
                  <div className="space-y-6">
                  {education.map(edu => (
                      <div key={edu.id}>
                      <h3 className={cn("text-xl font-semibold", theme.text)}>{edu.degree}</h3>
                      <p className={cn("text-md font-medium", theme.subtle)}>{edu.institution}</p>
                      <p className={cn("text-sm", theme.muted)}>{edu.startDate} - {edu.endDate}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}

          {portfolio.length > 0 && (
              <Section title="Portfolio" theme={theme} scrollDirection={scrollDirection}>
                  <div className="space-y-6">
                  {portfolio.map(item => (
                      <div key={item.id}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("text-xl font-semibold transition-colors flex items-center gap-2", theme.text, theme.linkHover)}>
                          {item.title}
                          <ExternalLink className="size-4" />
                      </a>
                      <p className={cn("mt-1 text-sm", theme.subtle)}>{item.description}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}

          {custom.items.length > 0 && custom.title && (
              <Section title={custom.title} theme={theme} scrollDirection={scrollDirection}>
                  <div className={cn("space-y-4 text-sm whitespace-pre-line", theme.subtle)}>
                      {custom.items.map(item => <p key={item.id}>{item.description}</p>)}
                  </div>
              </Section>
          )}
          
          {references.length > 0 && (
              <Section title="References" theme={theme} scrollDirection={scrollDirection}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {references.map(ref => (
                      <div key={ref.id}>
                      <h4 className={cn("font-semibold", theme.text)}>{ref.name}</h4>
                      <p className={cn("text-sm", theme.subtle)}>{ref.relation}</p>
                      <p className={cn("text-sm", theme.muted)}>{ref.contact}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}
        </main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={cn("text-center mt-20 pt-8 border-t", theme.borderLight)}
          >
           <p className={cn("font-serif text-2xl font-medium mb-4", theme.heading)}>Get in Touch</p>
           <div className={cn("flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm", theme.muted)}>
              <a href={`mailto:${contact.email}`} className={cn("flex items-center gap-2", theme.linkHoverStrong)}><Mail className="size-4" />{contact.email}</a>
              {contact.phone && <span className="flex items-center gap-2"><Phone className="size-4" />{contact.phone}</span>}
              {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2", theme.linkHoverStrong)}><Globe className="size-4" />{contact.website}</a>}
              {contact.location && <span className="flex items-center gap-2"><MapPin className="size-4" />{contact.location}</span>}
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
