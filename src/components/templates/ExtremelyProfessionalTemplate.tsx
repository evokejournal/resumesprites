"use client";

import type { ResumeData } from '@/lib/types';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { SkillBar } from './SkillBar';
import { cn } from '@/lib/utils';

const themes = {
  original: {
    bg: 'bg-slate-50',
    paper: 'bg-white',
    mainText: 'text-slate-800',
    heading: 'text-slate-700',
    subHeading: 'text-slate-600',
    mutedText: 'text-slate-500',
    border: 'border-slate-200',
    skillBar: 'bg-slate-500',
    skillBg: 'bg-slate-200',
    link: 'hover:text-slate-600',
    strong: 'text-slate-900',
  },
  navy: {
    bg: 'bg-amber-50',
    paper: 'bg-white',
    mainText: 'text-gray-800',
    heading: 'text-blue-900',
    subHeading: 'text-blue-800',
    mutedText: 'text-gray-500',
    border: 'border-blue-200',
    skillBar: 'bg-blue-800',
    skillBg: 'bg-blue-100',
    link: 'hover:text-blue-700',
    strong: 'text-blue-900',
  },
  graphite: {
    bg: 'bg-neutral-900',
    paper: 'bg-neutral-800',
    mainText: 'text-neutral-200',
    heading: 'text-teal-400',
    subHeading: 'text-neutral-300',
    mutedText: 'text-neutral-400',
    border: 'border-neutral-700',
    skillBar: 'bg-teal-500',
    skillBg: 'bg-neutral-700',
    link: 'hover:text-teal-300',
    strong: 'text-white',
  },
  burgundy: {
    bg: 'bg-rose-50',
    paper: 'bg-white',
    mainText: 'text-gray-800',
    heading: 'text-rose-900',
    subHeading: 'text-rose-800',
    mutedText: 'text-gray-500',
    border: 'border-rose-200',
    skillBar: 'bg-rose-800',
    skillBg: 'bg-rose-100',
    link: 'hover:text-rose-700',
    strong: 'text-rose-900',
  },
  olive: {
    bg: 'bg-lime-50',
    paper: 'bg-white',
    mainText: 'text-gray-800',
    heading: 'text-lime-900',
    subHeading: 'text-lime-800',
    mutedText: 'text-gray-500',
    border: 'border-lime-200',
    skillBar: 'bg-lime-800',
    skillBg: 'bg-lime-100',
    link: 'hover:text-lime-700',
    strong: 'text-lime-900',
  },
};

interface TemplateProps {
  data: ResumeData;
}

export function ExtremelyProfessionalTemplate({ data }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;
  const theme = themes[data.theme as keyof typeof themes] || themes.original;

  return (
    <div className={cn("p-4 sm:p-8 md:p-12 font-body min-h-screen", theme.bg, theme.mainText)}>
      <main className={cn("max-w-4xl mx-auto shadow-lg p-6 sm:p-8 md:p-12", theme.paper)}>
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className={cn("text-4xl md:text-5xl font-bold font-serif", theme.strong)}>{about.name}</h1>
          <h2 className={cn("text-xl md:text-2xl mt-2", theme.subHeading)}>{about.jobTitle}</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
          {/* Left Column */}
          <aside className="md:col-span-1 space-y-8">
            <section>
              <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Contact</h3>
              <ul className="space-y-2 text-sm">
                {contact.email && <li className="flex items-start gap-3"><Mail className={cn("size-4 mt-1", theme.mutedText)} /> <a href={`mailto:${contact.email}`} className={cn("break-all", theme.link)}>{contact.email}</a></li>}
                {contact.phone && <li className="flex items-start gap-3"><Phone className={cn("size-4 mt-1", theme.mutedText)} /> {contact.phone}</li>}
                {contact.website && <li className="flex items-start gap-3"><Globe className={cn("size-4 mt-1", theme.mutedText)} /> <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn("break-all", theme.link)}>{contact.website}</a></li>}
                {contact.location && <li className="flex items-start gap-3"><MapPin className={cn("size-4 mt-1", theme.mutedText)} /> {contact.location}</li>}
              </ul>
            </section>

            {skills && skills.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Skills</h3>
                <ul className="space-y-4">
                  {skills.map(skill => (
                    <li key={skill.id}>
                      <p className="text-sm font-medium mb-1">{skill.name}</p>
                      <SkillBar level={skill.level} barColor={theme.skillBar} bgColor={theme.skillBg} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Education</h3>
                {education.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold">{edu.institution}</h4>
                    <p className={cn("text-sm", theme.subHeading)}>{edu.degree}</p>
                    <p className={cn("text-xs", theme.mutedText)}>{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}
            
            {references && references.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>References</h3>
                {references.map(ref => (
                  <div key={ref.id} className="mb-4">
                    <h4 className="font-bold">{ref.name}</h4>
                    <p className={cn("text-sm", theme.subHeading)}>{ref.relation}</p>
                    <p className={cn("text-xs", theme.mutedText)}>{ref.contact}</p>
                  </div>
                ))}
              </section>
            )}
          </aside>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-10">
            {about && about.summary && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Profile</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{about.summary}</p>
              </section>
            )}

            {experience && experience.length > 0 && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Experience</h3>
                <div className="space-y-6">
                  {experience.map(job => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={cn("text-lg font-semibold", theme.heading)}>{job.role}</h4>
                        <p className={cn("text-sm text-right", theme.mutedText)}>{job.startDate} - {job.endDate}</p>
                      </div>
                      <p className={cn("text-md font-medium", theme.subHeading)}>{job.company}</p>
                      <p className="text-sm mt-2 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {portfolio && portfolio.length > 0 && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>Portfolio</h3>
                <div className="space-y-4">
                  {portfolio.map(item => (
                    <div key={item.id}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("text-lg font-semibold transition-colors flex items-center gap-2", theme.heading, theme.link)}>
                        {item.title} <ExternalLink className="size-4" />
                      </a>
                      <p className={cn("text-sm", theme.subHeading)}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {custom && custom.items.length > 0 && custom.title && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", theme.heading, theme.border)}>{custom.title}</h3>
                <div className="space-y-2">
                  {custom.items.map(item => (
                    <p key={item.id} className="text-sm leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
