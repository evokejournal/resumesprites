
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CoverLetterModal } from '@/components/CoverLetterModal';
import { Heart, Brain, Bone, Star, FolderGit2, Briefcase, GraduationCap, Users, Wrench, ShieldQuestion } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  isCoverLetterOpen: boolean;
  setCoverLetterOpen: (open: boolean) => void;
}

const organConfig = {
    experience: { Icon: Brain, label: 'Experience' },
    skills: { Icon: Heart, label: 'Core Skills' },
    education: { Icon: GraduationCap, label: 'Education' },
    portfolio: { Icon: FolderGit2, label: 'Portfolio' },
    references: { Icon: Users, label: 'References' },
    custom: { Icon: Wrench, label: 'Custom Tools' },
    default: { Icon: ShieldQuestion, label: 'Section' },
};

const Organ = ({ id, Icon, position, onSuccessfulExtraction, className }: { id: string, Icon: React.ComponentType<{className?: string}>, position: { top: string, left: string }, onSuccessfulExtraction: (id: string) => void, className?: string }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSuccessfulExtraction(id)}
        className={cn("absolute w-12 h-12 md:w-16 md:h-16 text-red-700 hover:text-red-500 transition-colors z-20", className)}
        style={{ top: position.top, left: position.left }}
        aria-label={`Extract ${id}`}
    >
        <Icon className="w-full h-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
    </motion.button>
);

export function OperationTemplate({ data, isCoverLetterOpen, setCoverLetterOpen }: TemplateProps) {
    const [buzzerOn, setBuzzerOn] = useState(false);
    const [revealedSection, setRevealedSection] = useState<any>(null);
    const buzzTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseLeavePatient = () => {
        setBuzzerOn(true);
        if (buzzTimeoutRef.current) {
            clearTimeout(buzzTimeoutRef.current);
        }
        buzzTimeoutRef.current = setTimeout(() => {
            setBuzzerOn(false);
        }, 500);
    };

    const handleMouseEnterPatient = () => {
        if (buzzTimeoutRef.current) {
            clearTimeout(buzzTimeoutRef.current);
        }
        setBuzzerOn(false);
    };

    const sections = useMemo(() => [
        { id: 'experience', data: data.experience, ...organConfig.experience },
        { id: 'skills', data: data.skills, ...organConfig.skills },
        { id: 'education', data: data.education, ...organConfig.education },
        { id: 'portfolio', data: data.portfolio, ...organConfig.portfolio },
        { id: 'references', data: data.references, ...organConfig.references },
        { id: 'custom', data: data.custom, ...organConfig.custom },
    ].filter(s => s.data && (Array.isArray(s.data) ? s.data.length > 0 : (s.data.title && s.data.items.length > 0))), [data]);

    const organPositions = [
        { top: '25%', left: '48%' }, { top: '35%', left: '62%' }, { top: '50%', left: '55%' },
        { top: '65%', left: '45%' }, { top: '40%', left: '35%' }, { top: '55%', left: '28%' }
    ];

    const handleSuccessfulExtraction = (id: string) => {
        const section = sections.find(s => s.id === id);
        setRevealedSection(section);
    };
    
    return (
        <div className="min-h-screen bg-green-200 flex flex-col items-center justify-center p-4 font-body overflow-hidden cursor-crosshair">
            <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-4 text-center font-bungee shadow-black [text-shadow:2px_2px_#000]">Operation: Management</h1>

            <div className="relative w-full max-w-lg aspect-[1/1.5] md:aspect-auto md:h-[70vh] md:w-auto">
                {/* Background board */}
                <div className="absolute inset-0 bg-yellow-100 rounded-3xl shadow-lg border-4 border-yellow-200"></div>

                {/* Patient outline - this is the "safe" zone */}
                <svg
                    onMouseLeave={handleMouseLeavePatient}
                    onMouseEnter={handleMouseEnterPatient}
                    viewBox="0 0 300 450"
                    className="absolute inset-0 w-full h-full z-10"
                >
                    <path
                        d="M150 20 C 50 20, 20 100, 40 200 C 50 280, 50 350, 100 430 C 150 450, 200 450, 250 430 C 300 350, 300 280, 260 200 C 280 100, 250 20, 150 20 Z"
                        fill="rgba(255, 0, 0, 0)" // Invisible fill to capture mouse events
                    />
                </svg>

                 {/* Patient Graphic */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[85%] h-[90%] bg-orange-200 rounded-full blur-sm" style={{ clipPath: 'url(#patient-clip)' }}></div>
                </div>

                {/* Organs */}
                {sections.map((section, index) => (
                    <Organ
                        key={section.id}
                        id={section.id}
                        Icon={section.Icon}
                        position={organPositions[index % organPositions.length]}
                        onSuccessfulExtraction={handleSuccessfulExtraction}
                        className={cn(revealedSection?.id === section.id && "animate-pulse")}
                    />
                ))}

                {/* Buzzer */}
                <div
                    className={cn(
                        "absolute top-10 left-10 w-16 h-16 rounded-full bg-red-800 border-4 border-gray-400 transition-all duration-100",
                        buzzerOn && "bg-red-500 shadow-[0_0_20px_10px_rgba(255,0,0,0.7)]"
                    )}
                >
                </div>
            </div>
            
            <AnimatePresence>
                {revealedSection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setRevealedSection(null)}
                    >
                        <div className="bg-yellow-50 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-red-600 font-bungee">{revealedSection.label}</h2>
                                <button onClick={() => setRevealedSection(null)} className="text-gray-500 hover:text-gray-800">&times;</button>
                            </div>
                            <div className="space-y-4 text-sm">
                                {revealedSection.id === 'experience' && (revealedSection.data as ResumeData['experience']).map(item => (
                                    <div key={item.id}><h4 className="font-bold">{item.role}</h4><p>{item.company}</p><p className="whitespace-pre-line text-xs">{item.description}</p></div>
                                ))}
                                {revealedSection.id === 'skills' && <div className="flex flex-wrap gap-2">{(revealedSection.data as ResumeData['skills']).map(item => <span key={item.id} className="bg-green-200 px-2 py-1 rounded">{item.name}</span>)}</div>}
                                {revealedSection.id === 'education' && (revealedSection.data as ResumeData['education']).map(item => (
                                    <div key={item.id}><h4 className="font-bold">{item.degree}</h4><p>{item.institution}</p></div>
                                ))}
                                {revealedSection.id === 'portfolio' && (revealedSection.data as ResumeData['portfolio']).map(item => (
                                    <div key={item.id}><a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{item.title}</a><p className="text-xs">{item.description}</p></div>
                                ))}
                                {revealedSection.id === 'references' && (revealedSection.data as ResumeData['references']).map(item => (
                                    <div key={item.id}><h4 className="font-bold">{item.name}</h4><p>{item.relation}</p></div>
                                ))}
                                {revealedSection.id === 'custom' && (revealedSection.data as ResumeData['custom']).items.map(item => (
                                    <p key={item.id}>{item.description}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <svg className="absolute w-0 h-0">
                <clipPath id="patient-clip" clipPathUnits="objectBoundingBox">
                     <path d="M0.5 0.044 C 0.167 0.044, 0.067 0.222, 0.133 0.444 C 0.167 0.622, 0.167 0.778, 0.333 0.956 C 0.5 1, 0.667 1, 0.833 0.956 C 1 0.778, 1 0.622, 0.867 0.444 C 0.933 0.222, 0.833 0.044, 0.5 0.044 Z" />
                </clipPath>
            </svg>
        </div>
    );
}
