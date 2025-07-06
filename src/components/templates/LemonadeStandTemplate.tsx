'use client';

import React, { useState, useMemo } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CoverLetterModal } from '@/components/CoverLetterModal';
import { Button } from '@/components/ui/button';
import { X, Hand, Droplets, Citrus, Milestone, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  isCoverLetterOpen: boolean;
  setCoverLetterOpen: (open: boolean) => void;
}

const LemonIcon = () => <Citrus className="w-5 h-5 text-yellow-400" />;
const SugarIcon = () => <Droplets className="w-5 h-5 text-blue-300" />;
const WaterIcon = () => <Milestone className="w-5 h-5 text-gray-400" />;
const SpecialIcon = () => <Sparkles className="w-5 h-5 text-pink-400" />;


export function LemonadeStandTemplate({ data, isCoverLetterOpen, setCoverLetterOpen }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, custom } = data;
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const recipeItems = useMemo(() => [
        { id: 'experience', label: 'Lemons', icon: LemonIcon, data: experience, hasContent: experience.length > 0 },
        { id: 'skills', label: 'Sugar', icon: SugarIcon, data: skills, hasContent: skills.length > 0 },
        { id: 'education', label: 'Water', icon: WaterIcon, data: education, hasContent: education.length > 0 },
        { id: 'portfolio', label: 'Special Sauce', icon: SpecialIcon, data: portfolio, hasContent: portfolio.length > 0 },
        ...(custom.title && custom.items.length > 0 ? [{ id: 'custom', label: custom.title, icon: SpecialIcon, data: custom.items, hasContent: true }] : []),
    ].filter(item => item.hasContent), [experience, skills, education, portfolio, custom]);

    const activeContent = useMemo(() => {
        if (!activeSection) return null;
        return recipeItems.find(item => item.id === activeSection);
    }, [activeSection, recipeItems]);
    
    return (
        <>
            <CoverLetterModal 
                isOpen={isCoverLetterOpen}
                onOpenChange={setCoverLetterOpen}
                title={`A Glass of Lemonade from ${about.name}`}
                content={data.coverLetter}
            />
            <div className="font-gloock min-h-screen bg-amber-50 text-stone-800 p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
                {/* Background Decoration */}
                <Citrus className="absolute -top-16 -left-16 w-64 h-64 text-yellow-200/50 opacity-50 rotate-12" />
                <Sparkles className="absolute -bottom-24 -right-20 w-72 h-72 text-pink-200/50 opacity-50 -rotate-12" />

                <div className="relative z-10 w-full max-w-5xl">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="text-5xl sm:text-7xl font-bold">When life gives you lemons...</h1>
                        <p className="text-xl sm:text-2xl mt-2 text-stone-600">...you hire {about.name}!</p>
                    </header>

                    {/* Main Interactive Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Recipe Card */}
                        <aside className="md:col-span-1">
                            <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6 border-2 border-stone-300 h-full">
                                <h2 className="text-3xl font-bold mb-4 text-stone-700">The Recipe</h2>
                                <ul className="space-y-3">
                                    {recipeItems.map(item => (
                                        <li key={item.id}>
                                            <button 
                                                onClick={() => setActiveSection(item.id)}
                                                className={cn(
                                                    "w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all",
                                                    activeSection === item.id 
                                                        ? 'bg-yellow-300 shadow-inner' 
                                                        : 'hover:bg-yellow-100'
                                                )}
                                            >
                                                <item.icon />
                                                <span className="text-lg font-semibold">{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t-2 border-dashed border-stone-300 my-6"></div>
                                <h3 className="text-xl font-bold mb-2">Contact</h3>
                                <div className="text-sm space-y-1 text-stone-600">
                                    <p>{contact.email}</p>
                                    <p>{contact.phone}</p>
                                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{contact.website}</a>
                                </div>
                            </div>
                        </aside>

                        {/* Content Display */}
                        <main className="md:col-span-2 min-h-[30rem] relative">
                            <AnimatePresence>
                                {activeContent ? (
                                    <motion.div
                                        key={activeContent.id}
                                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        className="absolute inset-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-xl p-8 border-2 border-stone-300"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setActiveSection(null)}
                                            className="absolute top-2 right-2 rounded-full"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                        <div className="flex items-center gap-4 mb-4">
                                            <activeContent.icon />
                                            <h2 className="text-3xl font-bold">{activeContent.label}</h2>
                                        </div>
                                        <div className="overflow-y-auto h-[calc(100%-4rem)] pr-2 space-y-4 text-sm text-stone-700">
                                            {activeContent.id === 'experience' && (activeContent.data as ResumeData['experience']).map(job => (
                                                <div key={job.id}><h4 className="font-bold">{job.role} at {job.company}</h4><p className="whitespace-pre-line">{job.description}</p></div>
                                            ))}
                                            {activeContent.id === 'skills' && <div className="flex flex-wrap gap-2">{ (activeContent.data as ResumeData['skills']).map(skill => (
                                                <span key={skill.id} className="bg-yellow-200 px-3 py-1 rounded-full">{skill.name}</span>
                                            ))}</div>}
                                            {activeContent.id === 'education' && (activeContent.data as ResumeData['education']).map(edu => (
                                                <div key={edu.id}><h4 className="font-bold">{edu.degree}</h4><p>{edu.institution}</p></div>
                                            ))}
                                            {activeContent.id === 'portfolio' && (activeContent.data as ResumeData['portfolio']).map(item => (
                                                <div key={item.id}><a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{item.title}</a><p>{item.description}</p></div>
                                            ))}
                                            {activeContent.id === 'custom' && (activeContent.data as ResumeData['custom']['items']).map(item => (
                                                <p key={item.id}>{item.description}</p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-stone-500 p-8">
                                        <Hand className="w-16 h-16 mb-4" />
                                        <h3 className="text-2xl font-bold">Select an ingredient!</h3>
                                        <p>Click on an item from the recipe to learn more about my skills and experience.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
