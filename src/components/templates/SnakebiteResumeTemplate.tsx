
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const GRID_SIZE = 25;
const INITIAL_SPEED = 200; // ms per move
const SPEED_INCREMENT = 10; // ms faster per food
const MIN_SPEED = 80;
const SHOWCASE_SPEED = 50; // ms per move in showcase mode
const SHOWCASE_MIN_SPEED = 20; // minimum speed in showcase mode

// Utility to generate a random position for food
const randomFoodPosition = (snake: {x:number, y:number}[]) => {
  while (true) {
    const pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === pos.x && segment.y === pos.y)) {
      return pos;
    }
  }
};

const Confetti = ({ count = 400 }) => {
    const colors = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#cadc9f'];
    return (
      <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
        {Array.from({ length: count }).map((_, i) => {
          const color = colors[i % colors.length];
          const size = Math.random() * 8 + 4; // size from 4 to 12px
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                backgroundColor: color,
              }}
              animate={{
                x: (Math.random() - 0.5) * 1500, // Spread horizontally
                y: (Math.random() - 0.5) * 1500, // Spread vertically
                rotate: Math.random() * 360,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1.5, // 1.5-3.5 seconds duration
                ease: "easeOut",
                delay: Math.random() * 0.2,
              }}
            />
          );
        })}
      </div>
    );
};

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
  showcaseMode?: boolean;
}

const SectionDisplay = ({ sectionData }: { sectionData: any }) => {
    if (!sectionData) return null;
    const { type, content } = sectionData;

    const headingStyles = "font-mono font-bold text-xl";
    const textStyles = "text-base ml-4";
    const subTextStyles = "text-sm ml-4 my-1";
    const detailStyles = "opacity-80";

    switch (type) {
        case 'about':
            return (
                <div className="mb-4">
                    <h3 className={headingStyles}>› About Me</h3>
                    <p className={`${textStyles} mt-1 whitespace-pre-line text-sm`}>{content.summary}</p>
                </div>
            );
        case 'experience':
            return (
                <div className="mb-2">
                    <h3 className={headingStyles}>› Experience</h3>
                    {(content as ResumeData['experience']).map(job => (
                         <div key={job.id} className={subTextStyles}>
                            <p className="font-semibold text-base">{job.role} at {job.company}</p>
                            <p className={detailStyles}>{job.startDate} - {job.endDate}</p>
                        </div>
                    ))}
                </div>
            );
        case 'skills':
             return (
                <div className="mb-2">
                    <h3 className={headingStyles}>› Skills</h3>
                    <p className={textStyles}>{(content as ResumeData['skills']).map((s: any) => s.name).join(', ')}</p>
                </div>
            );
        case 'education':
            return (
                 <div className="mb-2">
                    <h3 className={headingStyles}>› Education</h3>
                     {(content as ResumeData['education']).map(edu => (
                        <div key={edu.id} className={subTextStyles}>
                            <p className="font-semibold text-base">{edu.degree}</p>
                            <p className="text-base">{edu.institution}</p>
                        </div>
                    ))}
                </div>
            );
        case 'portfolio':
             return (
                 <div className="mb-2">
                    <h3 className={headingStyles}>› Portfolio</h3>
                     {(content as ResumeData['portfolio']).map(item => (
                        <div key={item.id} className={subTextStyles}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-base hover:underline">{item.title}</a>
                        </div>
                    ))}
                </div>
            );
        case 'custom':
             return (
                 <div className="mb-2">
                    <h3 className={headingStyles}>› {content.title}</h3>
                    {(content.items as ResumeData['custom']['items']).map((item: any) => (
                         <p key={item.id} className={textStyles}>{item.description}</p>
                    ))}
                </div>
            );
        case 'references':
             return (
                 <div className="mb-2">
                    <h3 className={headingStyles}>› References</h3>
                    <p className={textStyles}>Available upon request.</p>
                </div>
            );
         case 'contact':
             return (
                 <div className="mb-2">
                    <h3 className={headingStyles}>› Contact</h3>
                    <p className={textStyles}>{content.email} | {content.phone} | {content.website}</p>
                </div>
            );
        default:
             return <p className="text-base">Section loaded.</p>;
    }
}


export function SnakebiteResumeTemplate({ data, pdfMode, showcaseMode }: TemplateProps) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(randomFoodPosition([{ x: 10, y: 10 }]));
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [speed, setSpeed] = useState(showcaseMode ? SHOWCASE_SPEED : INITIAL_SPEED);
  const [justAte, setJustAte] = useState(false);
  const [revealedSections, setRevealedSections] = useState<any[]>([]);
  const [showCoverLetter, setShowCoverLetter] = useState(!!(data.coverLetter && data.coverLetter.trim() !== ''));
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resumeChunks = useMemo(() => {
    const chunks: any[] = [];
    if (data.about?.summary) chunks.push({ type: 'about', content: { title: 'About Me', summary: data.about.summary }, id: 'about' });
    if (data.experience?.length > 0) chunks.push({ type: 'experience', content: data.experience, id: 'experience' });
    if (data.skills?.length > 0) chunks.push({ type: 'skills', content: data.skills, id: 'skills' });
    if (data.education?.length > 0) chunks.push({ type: 'education', content: data.education, id: 'education' });
    if (data.portfolio?.length > 0) chunks.push({ type: 'portfolio', content: data.portfolio, id: 'portfolio' });
    if (data.custom?.title && data.custom.items.length > 0) chunks.push({ type: 'custom', content: data.custom, id: 'custom' });
    if (data.references?.length > 0) chunks.push({ type: 'references', content: data.references, id: 'references' });
    if (data.contact?.email) chunks.push({ type: 'contact', content: data.contact, id: 'contact' });
    return chunks;
  }, [data]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const keyMap = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      s: 'DOWN',
      a: 'LEFT',
      d: 'RIGHT',
    };
    const newDir = keyMap[e.key as keyof typeof keyMap];
    
    if (newDir) {
      setDirection((prevDir) => {
        if ((newDir === 'UP' && prevDir === 'DOWN') ||
            (newDir === 'DOWN' && prevDir === 'UP') ||
            (newDir === 'LEFT' && prevDir === 'RIGHT') ||
            (newDir === 'RIGHT' && prevDir === 'LEFT')) {
          return prevDir;
        }
        return newDir as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Game Loop for movement
  useEffect(() => {
    if (gameState !== 'playing' || showCoverLetter) return;

    const gameTick = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (directionRef.current) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }
        
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
        
        const ateFood = head.x === food.x && head.y === food.y;

        newSnake.unshift(head);
        
        if (ateFood) {
            setJustAte(true);
        } else {
            newSnake.pop();
        }
        
        return newSnake;
      });
    };

    const intervalId = setInterval(gameTick, speed);
    return () => clearInterval(intervalId);
  }, [gameState, speed, food.x, food.y, showCoverLetter]);

  // Effect for handling logic when food is eaten
  useEffect(() => {
    if (justAte) {
      setRevealedSections((current) => {
        const nextIndex = current.length;
        if (nextIndex < resumeChunks.length) {
          const newRevealed = [...current, resumeChunks[nextIndex]];
          if (newRevealed.length === resumeChunks.length) {
            setGameState('won');
          }
          return newRevealed;
        }
        return current;
      });
      
      // In showcase mode, keep constant speed. In normal mode, increase speed when eating
      if (showcaseMode) {
        // Keep the same speed in showcase mode
        setSpeed(SHOWCASE_SPEED);
      } else {
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      }

      if (revealedSections.length + 1 < resumeChunks.length) {
          setFood(randomFoodPosition(snake));
      }

      setJustAte(false);
    }
  }, [justAte, resumeChunks, snake, revealedSections.length]);

  useEffect(() => {
      if (contentRef.current) {
          contentRef.current.scrollTo({
              top: contentRef.current.scrollHeight,
              behavior: 'smooth'
          });
      }
  }, [revealedSections]);

  // Disable game input when cover letter modal is open
  useEffect(() => {
    if (showCoverLetter) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, showCoverLetter]);

  return (
    <div 
        className="font-pixelify bg-[#9bbc0f] h-screen w-full flex flex-col items-center justify-center p-2 text-[#0f380f] relative"
        tabIndex={0}
    >
        {showCoverLetter && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#9bbc0f]/90">
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-video border-4 border-[#0f380f] rounded-lg bg-[#8bac0f] shadow-2xl p-6 flex flex-col items-center font-[Pixelify_Sans,monospace]" style={{ boxShadow: '0 0 0 8px #cadc9f, 0 0 0 12px #0f380f' }}>
              <button
                className="absolute top-2 right-2 bg-[#0f380f] text-[#cadc9f] rounded px-2 py-1 text-lg font-bold hover:bg-[#306230] transition"
                onClick={() => setShowCoverLetter(false)}
                aria-label="Close cover letter"
                style={{ fontFamily: 'inherit' }}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center tracking-widest" style={{ fontFamily: 'inherit' }}>
                COVER LETTER
              </h2>
              <div className="w-full flex-1 overflow-y-auto bg-[#cadc9f] text-[#0f380f] rounded p-4 text-lg leading-relaxed whitespace-pre-line font-[inherit]" style={{ fontFamily: 'inherit' }}>
                {data.coverLetter}
              </div>
              {/* Pixel grid overlay */}
              <div className="absolute inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(15,56,15,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,56,15,0.08) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }} />
            </div>
          </div>
        )}
        {/* Cover Letter Button */}
        <button
          onClick={() => setShowCoverLetter(true)}
          className="fixed top-4 right-16 z-50 bg-[#0f380f] text-[#cadc9f] rounded p-3 shadow-lg hover:bg-[#306230] transition-all duration-200"
          title="View Cover Letter"
          style={{ fontFamily: 'inherit' }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>

        {/* Download Button */}
        <button
          onClick={async () => {
            setIsDownloading(true);
            const res = await fetch('/api/resumes/generic-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ resumeData: data }),
            });
            if (!res.ok) {
              setIsDownloading(false);
              return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setIsDownloading(false);
          }}
          className="fixed top-4 right-4 z-50 bg-[#0f380f] text-[#cadc9f] rounded p-3 shadow-lg hover:bg-[#306230] transition-all duration-200"
          title="Download Resume PDF"
          style={{ fontFamily: 'inherit' }}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
            </svg>
          )}
        </button>
        {gameState === 'won' && <Confetti />}
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-video bg-[#8bac0f] rounded-lg shadow-2xl overflow-hidden border-4 border-black/20">
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
                {/* Resume Content in the background */}
                <div 
                    ref={contentRef} 
                    className={cn(
                        "scrollbar-hide absolute inset-0 p-4 overflow-y-auto text-[#306230] opacity-75",
                        gameState === 'playing' && "pointer-events-none"
                    )}
                >
                     <h2 className="font-[Pixelify_Sans,monospace] text-4xl">{data.about.name}</h2>
                     <p className="font-mono text-xl font-semibold opacity-90">{data.about.jobTitle}</p>
                     <div className="h-4" />
                     <AnimatePresence>
                        {revealedSections.map((section) => (
                             <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                             >
                                <SectionDisplay sectionData={section} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {/* Snake and Food on top */}
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className={cn(
                          "bg-[#0f380f]",
                          gameState === 'won' && "opacity-40 transition-opacity duration-500"
                        )}
                        style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }}
                    />
                ))}
                
                {gameState === 'playing' && (
                    <div
                        className="bg-[#0f380f] rounded-full"
                        style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
                    />
                )}
            </div>
        </div>
        <div className="mt-4 text-center text-lg">
            <p>Use arrow keys to control the snake.</p>
            <p>Reveal my resume by eating the dots!</p>
        </div>
    </div>
  );
}
