"use client";

import type { ResumeData } from '@/lib/types';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { SkillBar } from './SkillBar';
import { cn } from '@/lib/utils';

const theme = {
  bg: 'bg-[#F8FAFC]',
  text: 'text-[#1E293B]',
  accent: 'text-[#475569]',
  border: 'border-[#E2E8F0]',
  header: 'text-2xl font-bold',
  subheader: 'text-lg font-semibold',
};

interface TemplateProps {
  data: ResumeData;
}

export function ExtremelyProfessionalTemplate({ data }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;

  return (
    <div className={cn("p-4 sm:p-8 md:p-12 font-body min-h-screen", theme.bg, theme.text)}>
      <main className={cn("max-w-4xl mx-auto shadow-lg p-6 sm:p-8 md:p-12", "bg-white")}>
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className={cn("text-4xl md:text-5xl font-bold font-serif", "text-slate-900")}>{about.name}</h1>
          <h2 className={cn("text-xl md:text-2xl mt-2", "text-slate-600")}>{about.jobTitle}</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
          {/* Left Column */}
          <aside className="md:col-span-1 space-y-8">
            <section>
              <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Contact</h3>
              <ul className="space-y-2 text-sm">
                {contact.email && <li className="flex items-start gap-3"><Mail className={cn("size-4 mt-1", "text-slate-500")} /> <a href={`mailto:${contact.email}`} className={cn("break-all", "hover:text-slate-600")}>{contact.email}</a></li>}
                {contact.phone && <li className="flex items-start gap-3"><Phone className={cn("size-4 mt-1", "text-slate-500")} /> {contact.phone}</li>}
                {contact.website && <li className="flex items-start gap-3"><Globe className={cn("size-4 mt-1", "text-slate-500")} /> <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn("break-all", "hover:text-slate-600")}>{contact.website}</a></li>}
                {contact.location && <li className="flex items-start gap-3"><MapPin className={cn("size-4 mt-1", "text-slate-500")} /> {contact.location}</li>}
              </ul>
            </section>

            {skills && skills.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Skills</h3>
                <ul className="space-y-4">
                  {skills.map(skill => (
                    <li key={skill.id}>
                      <p className="text-sm font-medium mb-1">{skill.name}</p>
                      <SkillBar level={skill.level} barColor="bg-slate-500" bgColor="bg-slate-200" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Education</h3>
                {education.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold">{edu.institution}</h4>
                    <p className={cn("text-sm", "text-slate-600")}>{edu.degree}</p>
                    <p className={cn("text-xs", "text-slate-500")}>{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}
            
            {references && references.length > 0 && (
              <section>
                <h3 className={cn("text-lg font-semibold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>References</h3>
                {references.map(ref => (
                  <div key={ref.id} className="mb-4">
                    <h4 className="font-bold">{ref.name}</h4>
                    <p className={cn("text-sm", "text-slate-600")}>{ref.relation}</p>
                    <p className={cn("text-xs", "text-slate-500")}>{ref.contact}</p>
                  </div>
                ))}
              </section>
            )}
          </aside>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-10">
            {about && about.summary && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Profile</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{about.summary}</p>
              </section>
            )}

            {experience && experience.length > 0 && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Experience</h3>
                <div className="space-y-6">
                  {experience.map(job => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={cn("text-lg font-semibold", "text-slate-700")}>{job.role}</h4>
                        <p className={cn("text-sm text-right", "text-slate-500")}>{job.startDate} - {job.endDate}</p>
                      </div>
                      <p className={cn("text-md font-medium", "text-slate-600")}>{job.company}</p>
                      <p className="text-sm mt-2 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {portfolio && portfolio.length > 0 && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>Portfolio</h3>
                <div className="space-y-4">
                  {portfolio.map(item => (
                    <div key={item.id}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("text-lg font-semibold transition-colors flex items-center gap-2", "text-slate-700", "hover:text-slate-600")}>
                        {item.title} <ExternalLink className="size-4" />
                      </a>
                      <p className={cn("text-sm", "text-slate-600")}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {custom && custom.items.length > 0 && custom.title && (
              <section>
                <h3 className={cn("text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-4", "text-slate-700", "border-slate-200")}>{custom.title}</h3>
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
