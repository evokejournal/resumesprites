
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 25;
const INITIAL_SPEED = 200; // ms per move
const SPEED_INCREMENT = 10; // ms faster per food
const MIN_SPEED = 80;

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

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

const SectionDisplay = ({ sectionData }: { sectionData: any }) => {
    if (!sectionData) return null;
    const { type, content } = sectionData;

    switch (type) {
        case 'about':
            return (
                <div className="mb-4">
                    <h2 className="text-xl font-bold">{content.name}</h2>
                    <p className="text-lg">{content.jobTitle}</p>
                    <p className="text-xs mt-1 whitespace-pre-line">{content.summary}</p>
                </div>
            );
        case 'experience':
            return (
                <div className="mb-2">
                    <h3 className="font-bold">› Experience</h3>
                    {(content as ResumeData['experience']).map(job => (
                         <div key={job.id} className="text-xs ml-4 my-1">
                            <p className="font-semibold">{job.role} at {job.company}</p>
                            <p className="opacity-80">{job.startDate} - {job.endDate}</p>
                        </div>
                    ))}
                </div>
            );
        case 'skills':
             return (
                <div className="mb-2">
                    <h3 className="font-bold">› Skills</h3>
                    <p className="text-xs ml-4">{(content as ResumeData['skills']).map((s: any) => s.name).join(', ')}</p>
                </div>
            );
        case 'education':
            return (
                 <div className="mb-2">
                    <h3 className="font-bold">› Education</h3>
                     {(content as ResumeData['education']).map(edu => (
                        <div key={edu.id} className="text-xs ml-4 my-1">
                            <p className="font-semibold">{edu.degree}</p>
                            <p>{edu.institution}</p>
                        </div>
                    ))}
                </div>
            );
        case 'portfolio':
             return (
                 <div className="mb-2">
                    <h3 className="font-bold">› Portfolio</h3>
                     {(content as ResumeData['portfolio']).map(item => (
                        <div key={item.id} className="text-xs ml-4 my-1">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{item.title}</a>
                        </div>
                    ))}
                </div>
            );
        case 'custom':
             return (
                 <div className="mb-2">
                    <h3 className="font-bold">› {content.title}</h3>
                    {(content.items as ResumeData['custom']['items']).map((item: any) => (
                         <p key={item.id} className="text-xs ml-4">{item.description}</p>
                    ))}
                </div>
            );
        case 'references':
             return (
                 <div className="mb-2">
                    <h3 className="font-bold">› References</h3>
                    <p className="text-xs ml-4">Available upon request.</p>
                </div>
            );
         case 'contact':
             return (
                 <div className="mb-2">
                    <h3 className="font-bold">› Contact</h3>
                    <p className="text-xs ml-4">{content.email} | {content.phone} | {content.website}</p>
                </div>
            );
        default:
             return <p className="text-xs">Section loaded.</p>;
    }
}


export function SnakebiteResumeTemplate({ data, pdfMode }: TemplateProps) {
  const [snake, setSnake] = useState([{ x: 12, y: 12 }]);
  const [food, setFood] = useState({ x: 18, y: 12 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [revealedSections, setRevealedSections] = useState<any[]>([]);
  const [nextSectionIndex, setNextSectionIndex] = useState(0);

  const resumeChunks = useMemo(() => {
    const chunks: any[] = [];
    if (data.about?.summary) chunks.push({ type: 'about', content: data.about, id: 'about' });
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
    if (pdfMode) return;
    e.preventDefault();
    if (gameState !== 'playing') return;
    switch (e.key) {
      case 'ArrowUp': setDirection(d => d !== 'DOWN' ? 'UP' : d); break;
      case 'ArrowDown': setDirection(d => d !== 'UP' ? 'DOWN' : d); break;
      case 'ArrowLeft': setDirection(d => d !== 'RIGHT' ? 'LEFT' : d); break;
      case 'ArrowRight': setDirection(d => d !== 'LEFT' ? 'RIGHT' : d); break;
    }
  }, [gameState, pdfMode]);

  useEffect(() => {
    if (pdfMode) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, pdfMode]);
  
  useEffect(() => {
    if (pdfMode) return;
    if (gameState !== 'playing') {
        return;
    }

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        let head = { ...newSnake[0] };

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall wrapping logic
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
        
        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            if (nextSectionIndex < resumeChunks.length) {
                setRevealedSections(prev => [...prev, resumeChunks[nextSectionIndex]]);
                
                const newIndex = nextSectionIndex + 1;
                setNextSectionIndex(newIndex);
                
                if (newIndex >= resumeChunks.length) {
                  setGameState('won');
                } else {
                  setFood(randomFoodPosition(newSnake));
                }
            }
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, speed, food, gameState, resumeChunks, nextSectionIndex, pdfMode]);

  if (pdfMode) {
    return (
      <div className="font-pixelify bg-[#9bbc0f] min-h-screen w-full p-8 text-[#0f380f]">
        <div className="max-w-4xl mx-auto bg-[#8bac0f] rounded-lg shadow-2xl p-8 border-4 border-black/20">
          <div className="space-y-6">
            {resumeChunks.map((section) => (
              <div key={section.id}>
                <SectionDisplay sectionData={section} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
        className="font-pixelify bg-[#9bbc0f] h-screen w-full flex flex-col items-center justify-center p-2 text-[#0f380f]"
        tabIndex={0}
    >
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-video bg-[#8bac0f] rounded-lg shadow-2xl overflow-hidden border-4 border-black/20">
            {/* Game Grid and Content Area */}
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
                {/* Resume Content in the background */}
                <div className="absolute inset-0 p-4 overflow-y-auto text-[#3f6212] opacity-75 pointer-events-none">
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
                        className="bg-[#0f380f]"
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
        <div className="mt-4 text-center">
            <p>Use arrow keys to control the snake.</p>
            <p>Reveal my resume by eating the dots!</p>
        </div>
    </div>
  );
}
