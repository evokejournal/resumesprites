
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

export function BouncingResumeTemplate({ data, pdfMode, showcaseMode }: { data: ResumeData; pdfMode?: boolean; showcaseMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  // Speed multiplier for showcase mode
  const baseVelocity = showcaseMode ? 8 : 2.5; // 3.2x faster in showcase
  const [velocity, setVelocity] = useState({ x: baseVelocity, y: baseVelocity });
  const [revealedSections, setRevealedSections] = useState<any[]>([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showCoverLetter, setShowCoverLetter] = useState(!showcaseMode); // Don't show cover letter in showcase mode
  const [isDownloading, setIsDownloading] = useState(false);

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
      if (!containerRef.current || showCoverLetter) return; // Pause animation when cover letter is shown

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
  }, [velocity, position, resumeChunks, currentColorIndex, showCoverLetter]);

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

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/resumes/bouncing-resume-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-bouncing.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
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

      {/* Cover Letter Button - Hidden in showcase mode */}
      {!showcaseMode && (
        <button
          onClick={() => setShowCoverLetter(true)}
          className="fixed top-4 right-16 z-40 bg-black border-2 border-white rounded-lg p-3 hover:bg-white hover:text-black transition-all duration-200 group"
          style={{ 
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            fontFamily: 'Orbitron, monospace'
          }}
          title="View Cover Letter"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-white group-hover:text-black transition-colors duration-200"
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="fixed top-4 right-4 z-40 bg-black border-2 border-white rounded-lg p-3 hover:bg-white hover:text-black transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          fontFamily: 'Orbitron, monospace'
        }}
        title="Download Resume PDF"
      >
        {isDownloading ? (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-white group-hover:text-black transition-colors duration-200 animate-spin"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17V7h2v7.17l3.59-3.59L17 12l-5 5z"/>
          </svg>
        ) : (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-white group-hover:text-black transition-colors duration-200"
          >
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
          </svg>
        )}
      </button>

      {/* Cover Letter Modal - Hidden in showcase mode */}
      <AnimatePresence>
        {showCoverLetter && !showcaseMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black border-2 border-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                fontFamily: 'Orbitron, monospace'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCoverLetter(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
                aria-label="Close cover letter"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h1 
                  className="text-4xl font-bungee text-white mb-2" 
                  style={{ 
                    fontStyle: 'italic',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  COVER LETTER
                </h1>
                <div className="w-32 h-1 bg-white mx-auto"></div>
              </div>

              {/* Content */}
              <div className="text-white space-y-4 text-lg">
                <div className="mb-4">
                  <p className="mb-2">Dear Hiring Manager,</p>
                </div>

                <div className="space-y-3">
                  <p>
                    I am writing to express my strong interest in the position at your company. 
                    With my background in {data.about.jobTitle}, I believe I would be a valuable 
                    addition to your team.
                  </p>

                  <p>
                    Throughout my career, I have demonstrated a strong ability to {data.skills?.length > 0 ? 
                    `excel in areas such as ${data.skills.slice(0, 3).map(s => s.name).join(', ')}` : 
                    'deliver exceptional results and drive innovation'}. My experience includes 
                    {data.experience?.length > 0 ? ` working with companies like ${data.experience[0]?.company}` : 
                    ' diverse projects and challenges'} that have honed my skills and prepared me for this opportunity.
                  </p>

                  <p>
                    I am particularly drawn to this role because it aligns perfectly with my passion for 
                    {data.about.summary ? data.about.summary.split(' ').slice(0, 8).join(' ') : 'excellence and innovation'}. 
                    I am excited about the possibility of contributing to your organization's success.
                  </p>

                  <p>
                    Thank you for considering my application. I look forward to discussing how my skills 
                    and experience can benefit your team.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/30">
                  <p className="mb-1">Best regards,</p>
                  <p className="font-bold text-xl">{data.about.name}</p>
                  <p className="text-sm opacity-80">{data.about.jobTitle}</p>
                  {data.contact?.email && (
                    <p className="text-sm opacity-80">{data.contact.email}</p>
                  )}
                </div>
              </div>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
