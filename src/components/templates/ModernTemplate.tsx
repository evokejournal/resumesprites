"use client";

import type { ResumeData } from '@/lib/types';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { SkillBar } from './SkillBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateProps {
  data: ResumeData;
  isCoverLetterOpen: boolean;
  setCoverLetterOpen: (open: boolean) => void;
}

export function ModernTemplate({ data, isCoverLetterOpen, setCoverLetterOpen }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;

  return (
    <>
      {data.coverLetter && (
        <Dialog open={isCoverLetterOpen} onOpenChange={setCoverLetterOpen}>
          <DialogContent className="sm:max-w-2xl bg-white text-neutral-800 font-body">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline text-teal-600">Cover Letter from {about.name}</DialogTitle>
              <DialogDescription className="text-neutral-500">A message from the candidate.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
                <div className="p-4 whitespace-pre-line text-sm text-neutral-700">
                    {data.coverLetter}
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-8 md:p-12 font-body bg-white text-neutral-800">
        <header className="text-center border-b-2 border-teal-500 pb-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-teal-600">{about.name}</h1>
          <h2 className="text-2xl font-light text-neutral-500 mt-2">{about.jobTitle}</h2>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <aside className="md:col-span-1 space-y-8">
            <section>
              <h3 className="text-xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Mail className="size-4 text-teal-600" /> {contact.email}</li>
                <li className="flex items-center gap-3"><Phone className="size-4 text-teal-600" /> {contact.phone}</li>
                <li className="flex items-center gap-3"><Globe className="size-4 text-teal-600" /> {contact.website}</li>
                <li className="flex items-center gap-3"><MapPin className="size-4 text-teal-600" /> {contact.location}</li>
              </ul>
            </section>

            {skills && skills.length > 0 && (
              <section>
                <h3 className="text-xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">Skills</h3>
                <ul className="space-y-4">
                  {skills.map(skill => (
                    <li key={skill.id}>
                      <p className="text-sm mb-1">{skill.name}</p>
                      <SkillBar level={skill.level} barColor="bg-teal-500" bgColor="bg-neutral-200" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h3 className="text-xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">Education</h3>
                {education.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold">{edu.institution}</h4>
                    <p className="text-sm text-neutral-500">{edu.degree}</p>
                    <p className="text-xs text-neutral-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {references && references.length > 0 && (
              <section>
                <h3 className="text-xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">References</h3>
                {references.map(ref => (
                  <div key={ref.id} className="mb-4">
                    <h4 className="font-bold">{ref.name}</h4>
                    <p className="text-sm text-neutral-500">{ref.relation}</p>
                    <p className="text-xs text-neutral-500">{ref.contact}</p>
                  </div>
                ))}
              </section>
            )}
          </aside>

          <div className="md:col-span-2 space-y-8">
            {about && about.summary && (
              <section>
                <h3 className="text-2xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">About Me</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{about.summary}</p>
              </section>
            )}

            {experience && experience.length > 0 && (
              <section>
                <h3 className="text-2xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">Experience</h3>
                <div className="space-y-6">
                  {experience.map(job => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-lg font-bold">{job.role}</h4>
                        <p className="text-sm text-neutral-500">{job.startDate} - {job.endDate}</p>
                      </div>
                      <p className="text-md text-teal-600 font-medium">{job.company}</p>
                      <p className="text-sm mt-2 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {portfolio && portfolio.length > 0 && (
              <section>
                <h3 className="text-2xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">Portfolio</h3>
                <div className="space-y-4">
                  {portfolio.map(item => (
                    <div key={item.id}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-teal-600 transition-colors flex items-center gap-2">
                        {item.title} <ExternalLink className="size-4" />
                      </a>
                      <p className="text-sm text-neutral-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {custom && custom.items.length > 0 && (
              <section>
                <h3 className="text-2xl font-headline font-semibold text-teal-600 border-b border-teal-500/30 pb-2 mb-4">{custom.title}</h3>
                <div className="space-y-2">
                  {custom.items.map(item => (
                    <p key={item.id} className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
