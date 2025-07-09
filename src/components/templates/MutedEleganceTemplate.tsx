'use client';

import React from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

const theme = {
  bg: 'bg-f8fafc',
  text: 'text-gray-900',
  section: 'bg-white',
  accent: 'text-gray-700',
  border: 'border-gray-200',
  header: 'text-2xl font-bold',
  subheader: 'text-lg font-semibold',
};

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

const Section = ({ title, children, className, theme, scrollDirection, pdfMode }: { title: string, children: React.ReactNode, className?: string, theme: typeof theme, scrollDirection: 'up' | 'down', pdfMode?: boolean }) => {
  const y = scrollDirection === 'down' ? 50 : -50;
  return pdfMode ? (
    <section className={className}>
      <h2 className={cn("font-serif text-3xl font-medium mb-6 border-b pb-3", theme.header, theme.border)}>{title}</h2>
      {children}
    </section>
  ) : (
    <motion.section
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={cn("font-serif text-3xl font-medium mb-6 border-b pb-3", theme.header, theme.border)}>{title}</h2>
      {children}
    </motion.section>
  );
};

export function MutedEleganceTemplate({ data, pdfMode }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;
  const scrollDirection = useScrollDirection();

  return (
    <div className={cn("font-sans min-h-screen", theme.bg, theme.text)}>
      <div className="max-w-4xl mx-auto p-8 sm:p-12 md:p-16">
        <header className="text-center mb-16">
          {pdfMode ? (
            <>
              <h1 className={cn("font-serif text-5xl md:text-6xl font-medium", theme.header)}>
                {about.name}
              </h1>
              <p className={cn("mt-2 text-xl", theme.accent)}>
                {about.jobTitle}
              </p>
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("font-serif text-5xl md:text-6xl font-medium", theme.header)}
              >
                {about.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn("mt-2 text-xl", theme.accent)}
              >
                {about.jobTitle}
              </motion.p>
            </>
          )}
        </header>

        <main className="space-y-16">
          {about.summary && (
            <Section title="About Me" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
              <p className={cn("text-base leading-relaxed whitespace-pre-line", theme.accent)}>
                {about.summary}
              </p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
              <div className="space-y-8">
                {experience.map(job => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={cn("text-xl font-semibold", theme.text)}>{job.role}</h3>
                      <p className={cn("text-sm", theme.accent)}>{job.startDate} - {job.endDate}</p>
                    </div>
                    <p className={cn("text-md font-medium", theme.accent)}>{job.company}</p>
                    <p className={cn("mt-2 text-sm leading-relaxed whitespace-pre-line", theme.accent)}>{job.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <span key={skill.id} className={cn("px-4 py-1.5 rounded-full text-sm font-medium", theme.section, theme.accent)}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
              <Section title="Education" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
                  <div className="space-y-6">
                  {education.map(edu => (
                      <div key={edu.id}>
                      <h3 className={cn("text-xl font-semibold", theme.text)}>{edu.degree}</h3>
                      <p className={cn("text-md font-medium", theme.accent)}>{edu.institution}</p>
                      <p className={cn("text-sm", theme.accent)}>{edu.startDate} - {edu.endDate}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}

          {portfolio.length > 0 && (
              <Section title="Portfolio" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
                  <div className="space-y-6">
                  {portfolio.map(item => (
                      <div key={item.id}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn("text-xl font-semibold transition-colors flex items-center gap-2", theme.text, theme.accent)}>
                          {item.title}
                          <ExternalLink className="size-4" />
                      </a>
                      <p className={cn("mt-1 text-sm", theme.accent)}>{item.description}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}

          {custom.items.length > 0 && custom.title && (
              <Section title={custom.title} theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
                  <div className={cn("space-y-4 text-sm whitespace-pre-line", theme.accent)}>
                      {custom.items.map(item => <p key={item.id}>{item.description}</p>)}
                  </div>
              </Section>
          )}
          
          {references.length > 0 && (
              <Section title="References" theme={theme} scrollDirection={scrollDirection} pdfMode={pdfMode}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {references.map(ref => (
                      <div key={ref.id}>
                      <h4 className={cn("font-semibold", theme.text)}>{ref.name}</h4>
                      <p className={cn("text-sm", theme.accent)}>{ref.relation}</p>
                      <p className={cn("text-sm", theme.accent)}>{ref.contact}</p>
                      </div>
                  ))}
                  </div>
              </Section>
          )}
        </main>
        
        {pdfMode ? (
          <footer className={cn("text-center mt-20 pt-8 border-t", theme.border)}>
           <p className={cn("font-serif text-2xl font-medium mb-4", theme.header)}>Get in Touch</p>
           <div className={cn("flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm", theme.accent)}>
              <a href={`mailto:${contact.email}`} className={cn("flex items-center gap-2", theme.accent)}><Mail className="size-4" />{contact.email}</a>
              {contact.phone && <span className="flex items-center gap-2"><Phone className="size-4" />{contact.phone}</span>}
              {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2", theme.accent)}><Globe className="size-4" />{contact.website}</a>}
              {contact.location && <span className="flex items-center gap-2"><MapPin className="size-4" />{contact.location}</span>}
          </div>
        </footer>
        ) : (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn("text-center mt-20 pt-8 border-t", theme.border)}
            >
             <p className={cn("font-serif text-2xl font-medium mb-4", theme.header)}>Get in Touch</p>
             <div className={cn("flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm", theme.accent)}>
                <a href={`mailto:${contact.email}`} className={cn("flex items-center gap-2", theme.accent)}><Mail className="size-4" />{contact.email}</a>
                {contact.phone && <span className="flex items-center gap-2"><Phone className="size-4" />{contact.phone}</span>}
                {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2", theme.accent)}><Globe className="size-4" />{contact.website}</a>}
                {contact.location && <span className="flex items-center gap-2"><MapPin className="size-4" />{contact.location}</span>}
            </div>
          </motion.footer>
        )}
      </div>
    </div>
  );
}
