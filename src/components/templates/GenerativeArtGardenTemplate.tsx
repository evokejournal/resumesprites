
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ResumeData, Skill, Experience, PortfolioItem, Education, CustomItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, X, Info, Leaf, Briefcase, GraduationCap, Star, FolderGit2, Wrench } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

// Simple string hash function for deterministic "randomness"
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const SeedInfoModal = ({ content, onClose }: { content: React.ReactNode, onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl rounded-lg p-4 border border-gray-300 dark:border-gray-700"
        >
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-500" />
                </div>
                <div>{content}</div>
            </div>
        </motion.div>
    );
};


export function GenerativeArtGardenTemplate({ data }: TemplateProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [plantedSeeds, setPlantedSeeds] = useState<any[]>([]);
    const [activeSeedInfo, setActiveSeedInfo] = useState<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateCanvasDimensions = useCallback(() => {
        if (canvasRef.current) {
            const container = canvasRef.current.parentElement;
            if (container) {
                setDimensions({
                    width: container.clientWidth,
                    height: container.clientHeight,
                });
            }
        }
    }, []);
    
    useEffect(() => {
        updateCanvasDimensions();
        window.addEventListener('resize', updateCanvasDimensions);
        return () => window.removeEventListener('resize', updateCanvasDimensions);
    }, [updateCanvasDimensions]);

    const drawArt = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        plantedSeeds.forEach(seed => {
            const hash = simpleHash(seed.id);
            const x = (hash % (canvas.width * 0.8)) + (canvas.width * 0.1);
            const y = (hash % (canvas.height * 0.8)) + (canvas.height * 0.1);
            const hue = hash % 360;
            const saturation = 50 + (simpleHash(seed.id + 's') % 50);
            
            ctx.save();
            ctx.translate(x, y);

            if (seed.type === 'skill') {
                const size = 5 + (seed.level / 100) * 15;
                ctx.beginPath();
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, 60%, 0.7)`;
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * size, -Math.sin((18 + i * 72) / 180 * Math.PI) * size);
                    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * size * 0.4, -Math.sin((54 + i * 72) / 180 * Math.PI) * size * 0.4);
                }
                ctx.fill();
            } else if (seed.type === 'experience') {
                const size = 20 + (hash % 20);
                const branches = 3 + (hash % 3);
                ctx.strokeStyle = `hsla(${hue}, ${saturation}%, 50%, 0.8)`;
                ctx.lineWidth = 2;
                for (let i = 0; i < branches; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    const angle = (i / branches) * Math.PI * 2 + (hash % 1);
                    const length = size + (simpleHash(seed.id+i) % (size/2));
                    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
                    ctx.stroke();
                }
            } else { // Portfolio, Education, Custom
                const radius = 15 + (hash % 15);
                ctx.beginPath();
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, 70%, 0.6)`;
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, 50%, 0.8)`;
                ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });

    }, [plantedSeeds, dimensions]);

    useEffect(() => {
        drawArt();
    }, [drawArt]);

    const handlePlantSeed = (seed: any, type: string) => {
        if (plantedSeeds.some(s => s.id === seed.id)) {
            setActiveSeedInfo({ ...seed, type });
            return;
        };
        const newSeed = { ...seed, type };
        setPlantedSeeds(prev => [...prev, newSeed]);
        setActiveSeedInfo(newSeed);
    };

    const getSeedInfoContent = () => {
        if (!activeSeedInfo) return null;
        switch (activeSeedInfo.type) {
            case 'skill': return <div><p className="font-bold">{activeSeedInfo.name}</p><p className="text-sm">Proficiency: {activeSeedInfo.level}%</p></div>;
            case 'experience': return <div><p className="font-bold">{activeSeedInfo.role} at {activeSeedInfo.company}</p><p className="text-sm whitespace-pre-line">{activeSeedInfo.description}</p></div>;
            case 'portfolio': return <div><p className="font-bold">{activeSeedInfo.title}</p><p className="text-sm">{activeSeedInfo.description}</p></div>;
            case 'education': return <div><p className="font-bold">{activeSeedInfo.degree}</p><p className="text-sm">{activeSeedInfo.institution}</p></div>;
            case 'custom': return <div><p className="font-bold">{data.custom.title}</p><p className="text-sm">{activeSeedInfo.description}</p></div>;
            default: return null;
        }
    };

    const seedGroups = [
        { title: "Experience", items: data.experience, type: 'experience', icon: Briefcase },
        { title: "Skills", items: data.skills, type: 'skill', icon: Star },
        { title: "Portfolio", items: data.portfolio, type: 'portfolio', icon: FolderGit2 },
        { title: "Education", items: data.education, type: 'education', icon: GraduationCap },
        { title: data.custom.title, items: data.custom.items, type: 'custom', icon: Wrench },
    ].filter(g => g.items.length > 0);

    return (
        <div className="min-h-screen w-full bg-gray-900 flex text-white font-body">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-black/20 h-screen overflow-y-auto p-4 space-y-6">
                <header className="text-center space-y-2 pb-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold font-headline">{data.about.name}</h1>
                    <h2 className="text-md text-cyan-300">{data.about.jobTitle}</h2>
                    <p className="text-xs text-gray-400 whitespace-pre-line">{data.about.summary}</p>
                </header>
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Leaf className="text-green-400" /> Plant a Seed</h3>
                    <div className="space-y-4">
                        {seedGroups.map(group => (
                            <div key={group.title}>
                                <h4 className="font-bold text-gray-400 text-sm mb-2 flex items-center gap-2"><group.icon className="w-4 h-4" />{group.title}</h4>
                                <div className="space-y-1">
                                    {group.items.map((item: any) => (
                                        <button 
                                            key={item.id}
                                            onClick={() => handlePlantSeed(item, group.type)}
                                            className={cn(
                                                "w-full text-left text-xs px-2 py-1.5 rounded transition-colors",
                                                plantedSeeds.some(s => s.id === item.id)
                                                    ? 'bg-green-500/30 text-green-300'
                                                    : 'bg-gray-700/50 hover:bg-gray-600/50'
                                            )}
                                        >
                                            {item.name || item.role || item.title || item.degree || item.description.substring(0, 20)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Canvas */}
            <main className="flex-1 relative">
                <canvas 
                    ref={canvasRef} 
                    width={dimensions.width} 
                    height={dimensions.height}
                    className="absolute inset-0" 
                />
                <AnimatePresence>
                    {activeSeedInfo && <SeedInfoModal content={getSeedInfoContent()} onClose={() => setActiveSeedInfo(null)} />}
                </AnimatePresence>
                {plantedSeeds.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-gray-500 max-w-sm p-4 rounded-lg bg-black/20">
                           <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                           <h2 className="text-2xl font-bold font-headline text-white">Welcome to my Digital Garden</h2>
                           <p>Click on an item from the sidebar to plant a seed and grow a unique piece of art representing my career.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

    