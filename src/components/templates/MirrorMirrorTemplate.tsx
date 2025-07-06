
'use client';

import React, { useEffect } from 'react';
import type { ResumeData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, animate } from 'framer-motion';

// SVG filter for the water effect. It's defined once and reused.
const WateryFilter = () => {
  const baseFrequency = useMotionValue("0.01 0.04");

  useEffect(() => {
    const controls = animate(baseFrequency, ["0.01 0.04", "0.02 0.05", "0.01 0.04"], {
      duration: 20,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    return controls.stop;
  }, [baseFrequency]);

  return (
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id="water-ripple">
          <motion.feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" />
        </filter>
      </defs>
    </svg>
  );
};

// A shared component to render the resume content.
// It takes an alignment prop to control the text and flex alignment.
const ResumeContent = ({ data, className, alignment }: { data: ResumeData, className?: string, alignment: 'left' | 'right' }) => {
  const { about, contact, experience, skills } = data;
  
  // Determine alignment classes based on the prop
  const alignmentClasses = alignment === 'right' ? 'text-right items-end' : 'text-left items-start';
  const flexJustifyClass = alignment === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={cn("w-full flex flex-col", alignmentClasses, className)}>
      {/* Header */}
      <header className={cn("mb-16 flex flex-col", alignmentClasses)}>
        <h1 className="text-5xl md:text-6xl font-extrabold">{about.name}</h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-2">{about.jobTitle}</p>
      </header>

      {/* Contact */}
      <section className={cn("mb-16 flex flex-col", alignmentClasses)}>
        <h2 className="text-3xl font-bold mb-4">Contact</h2>
        <div className="text-base text-gray-700 space-y-1">
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>{contact.website}</p>
        </div>
      </section>

      {/* About */}
      <section className={cn("mb-16 flex flex-col", alignmentClasses)}>
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-base text-gray-700 max-w-2xl leading-relaxed">{about.summary}</p>
      </section>

      {/* Experience */}
      <section className={cn("mb-16 flex flex-col", alignmentClasses)}>
        <h2 className="text-3xl font-bold mb-4">Experience</h2>
        <div className="space-y-8 max-w-2xl">
          {experience.map(job => (
            <div key={job.id} className={cn("flex flex-col", alignmentClasses)}>
              <h3 className="text-xl font-bold">{job.role}</h3>
              <p className="text-gray-500">{job.company} / {job.startDate} - {job.endDate}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className={cn("flex flex-col", alignmentClasses)}>
        <h2 className="text-3xl font-bold mb-4">Skills</h2>
        <div className={cn("flex flex-wrap gap-3", flexJustifyClass)}>
          {skills.map(skill => (
            <Badge key={skill.id} variant="secondary" className="px-4 py-1 text-base font-normal bg-gray-200 text-black hover:bg-gray-300">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
};

interface TemplateProps {
  data: ResumeData;
}

export function MirrorMirrorTemplate({ data }: TemplateProps) {
  // Padding for the left (mirrored) side. Outer padding is large, inner padding is minimal.
  const paddingForMirroredSide = "py-8 md:py-12 pl-8 md:pl-12 pr-px";
  // Padding for the right (normal) side. Outer padding is large, inner padding is minimal.
  const paddingForNormalSide = "py-8 md:py-12 pr-8 md:pr-12 pl-px";
  
  return (
    <>
      <WateryFilter />
      <div className="bg-white text-black min-h-screen w-full flex font-serif">
        {/* Mirrored Left Side */}
        <div 
          className="w-1/2 transform -scale-x-100 overflow-hidden blur-[1px] opacity-90"
          style={{ filter: 'url(#water-ripple)' }}
        >
          <ResumeContent data={data} className={paddingForMirroredSide} alignment="right" />
        </div>
        
        {/* Normal Right Side */}
        <div className="w-1/2 overflow-hidden">
          <ResumeContent data={data} className={paddingForNormalSide} alignment="left" />
        </div>
      </div>
    </>
  );
}
