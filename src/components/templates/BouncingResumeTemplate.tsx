
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, Briefcase, GraduationCap, Star, FolderGit2, Wrench, Users, AtSign } from 'lucide-react';

const Logo = ({ color, name }: { color: string, name: string }) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const svgWidth = 340;
    const svgHeight = 170;

    return (
        <svg
            viewBox="0 0 200 100"
            width={svgWidth}
            height={svgHeight}
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="100"
                y="35"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className="font-bungee"
                fontStyle="italic"
            >
                {firstName.toUpperCase()}
            </text>
            <text
                x="100"
                y="60"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className="font-bungee"
                fontStyle="italic"
            >
                {lastName.toUpperCase()}
            </text>

            <g transform="translate(0, 48)">
                <path
                    d="M 50, 25
                       C 60, 10, 140, 10, 150, 25
                       L 150, 25
                       C 140, 40, 60, 40, 50, 25 Z"
                />
                <text
                    x="100"
                    y="27"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="black"
                    className="font-orbitron"
                >
                    RESUME
                </text>
            </g>
        </svg>
    );
};


const colors = [
  '#FFFFFF', // White
  '#FFFF00', // Yellow
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#800080', // Purple
  '#FFA500', // Orange
  '#00FFFF', // Cyan
  '#FF69B4', // Pink
  '#A9A9A9', // Gray
];

export function BouncingResumeTemplate({ data }: { data: ResumeData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2.5, y: 2.5 });
  const [revealedSections, setRevealedSections] = useState<any[]>([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const resumeChunks = useMemo(() => {
    const chunks: any[] = [];
    chunks.push({ type: 'heading', content: data.about.name, id: 'name-heading', Icon: User });
    chunks.push({ type: 'body', content: data.about.jobTitle, id: 'jobTitle-body' });

    if (data.about.summary) {
        chunks.push({ type: 'heading', content: 'About Me', id: 'about-heading', Icon: User });
        chunks.push({ type: 'body', content: data.about.summary, id: 'about-body' });
    }
    if (data.experience?.length > 0) {
        chunks.push({ type: 'heading', content: 'Experience', id: 'experience-heading', Icon: Briefcase });
        chunks.push({ type: 'body', content: data.experience.map(job => `${job.role} at ${job.company}`).join('\n'), id: 'experience-body' });
    }
    if (data.skills?.length > 0) {
        chunks.push({ type: 'heading', content: 'Skills', id: 'skills-heading', Icon: Star });
        chunks.push({ type: 'body', content: data.skills.map(s => s.name).join(' / '), id: 'skills-body' });
    }
    if (data.education?.length > 0) {
        chunks.push({ type: 'heading', content: 'Education', id: 'education-heading', Icon: GraduationCap });
        chunks.push({ type: 'body', content: data.education.map(edu => `${edu.degree} - ${edu.institution}`).join('\n'), id: 'education-body' });
    }
    if (data.portfolio?.length > 0) {
        chunks.push({ type: 'heading', content: 'Portfolio', id: 'portfolio-heading', Icon: FolderGit2 });
        chunks.push({ type: 'body', content: data.portfolio.map(p => p.title).join(', '), id: 'portfolio-body' });
    }
    if (data.references?.length > 0) {
        chunks.push({ type: 'heading', content: 'References', id: 'references-heading', Icon: Users });
        chunks.push({ type: 'body', content: data.references.map(ref => `${ref.name} (${ref.relation})`).join('\n'), id: 'references-body' });
    }
    if (data.custom?.title && data.custom.items.length > 0) {
        chunks.push({ type: 'heading', content: data.custom.title, id: 'custom-heading', Icon: Wrench });
        chunks.push({ type: 'body', content: data.custom.items.map(item => item.description).join('\n'), id: 'custom-body' });
    }
    if (data.contact?.email) {
        chunks.push({ type: 'heading', content: 'Contact', id: 'contact-heading', Icon: AtSign });
        chunks.push({ type: 'body', content: `${data.contact.email} | ${data.contact.phone}`, id: 'contact-body' });
    }
    return chunks;
  }, [data]);

  useEffect(() => {
    let animationFrameId: number;

    const moveLogo = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      const logoWidth = 340;
      const logoHeight = 170;

      let newX = position.x + velocity.x;
      let newY = position.y + velocity.y;
      let newVelX = velocity.x;
      let newVelY = velocity.y;
      
      let wallHit = false;

      if (newX <= 0 || newX + logoWidth >= containerWidth) {
        newVelX *= -1;
        if (newX <= 0) newX = 0;
        else newX = containerWidth - logoWidth;
        wallHit = true;
      }

      if (newY <= 0 || newY + logoHeight >= containerHeight) {
        newVelY *= -1;
        if (newY <= 0) newY = 0;
        else newY = containerHeight - logoHeight;
        wallHit = true;
      }
      
      if (wallHit) {
          setCurrentColorIndex(prev => (prev + 1) % colors.length);
          
          setRevealedSections(prev => {
              const nextSectionIndex = prev.length;
              if (nextSectionIndex < resumeChunks.length) {
                  const newSection = { ...resumeChunks[nextSectionIndex] };
                  return [...prev, newSection];
              }
              return prev;
          });
      }
      
      setPosition({ x: newX, y: newY });
      setVelocity({x: newVelX, y: newVelY});

      animationFrameId = requestAnimationFrame(moveLogo);
    };
    
    animationFrameId = requestAnimationFrame(moveLogo);
    return () => cancelAnimationFrame(animationFrameId);
  }, [velocity, position, resumeChunks, currentColorIndex]);

  const renderContent = (section: any) => {
    if (!section || !section.type) return null;
    const Icon = section.Icon;
    switch (section.type) {
        case 'heading': 
          return (
            <h3 className="text-2xl mt-4 font-bungee text-white flex items-center justify-start gap-3" style={{ fontStyle: 'italic'}}>
              {Icon && <Icon className="w-6 h-6"/>}
              <span>{section.content}</span>
            </h3>
          );
        case 'body': 
          return <div className="text-lg whitespace-pre-line text-white font-orbitron">{section.content}</div>;
        default: 
          return null;
    }
  };

  return (
    <div ref={containerRef} className="bg-black h-screen w-full relative overflow-hidden select-none cursor-default">
      <div
        className="absolute"
        style={{
          left: position.x,
          top: position.y,
          color: colors[currentColorIndex],
          transition: 'color 0.3s ease-in-out',
        }}
      >
        <Logo color={colors[currentColorIndex]} name={data.about.name} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none space-y-2">
        <div className="w-full max-w-3xl text-left">
            <AnimatePresence>
                {revealedSections.map((section) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-1"
                    >
                      {renderContent(section)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
