
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Helper component for a single row
const ReceiptRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between">
        <span className="truncate">{label}</span>
        <span>{value}</span>
    </div>
);

// Helper component for the barcode
const Barcode = ({ text }: { text: string }) => {
    const bars = useMemo(() => {
        let seed = 0;
        for (let i = 0; i < text.length; i++) {
            seed = (seed + text.charCodeAt(i)) % 1000;
        }
        
        const pseudoRandom = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        
        return Array.from({ length: 30 }, () => Math.floor(pseudoRandom() * 8) + 1);
    }, [text]);

    return (
        <div className="flex items-end justify-center h-16 gap-[2px]">
            {bars.map((height, index) => (
                <div
                    key={index}
                    className="bg-black"
                    style={{
                        height: `${height * 10 + 20}%`,
                        width: `${Math.random() > 0.5 ? 2 : 1}px`
                    }}
                />
            ))}
        </div>
    );
};


interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
  showcaseMode?: boolean;
}

const getNodeTextLength = (node: React.ReactNode): number => {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node).length;
    }
    if (Array.isArray(node)) {
        return node.reduce((acc, child) => acc + getNodeTextLength(child), 0);
    }
    if (React.isValidElement(node) && node.props.children) {
        return getNodeTextLength(node.props.children);
    }
    if (React.isValidElement(node) && node.type === Barcode) {
        return 50; 
    }
    return 0;
};


export function ForTaxPurposesTemplate({ data, pdfMode, showcaseMode }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, custom, coverLetter } = data;
    const [lines, setLines] = useState<React.ReactNode[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [isPrintingCoverLetter, setIsPrintingCoverLetter] = useState(false);
    const [coverLetterAnimationKey, setCoverLetterAnimationKey] = useState(0);
    const paperRef = useRef<HTMLDivElement>(null);

    const handlePrintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPrinting || isPrintingCoverLetter) return;
        setAnimationKey(k => k + 1);
    };

    const handleCoverLetterPrintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPrinting || isPrintingCoverLetter) return;
        setCoverLetterAnimationKey(k => k + 1);
    };
    
    const allContent = useMemo(() => {
        const separator = <p className="text-xs text-center">{"****************************************"}</p>;
        const contentList: React.ReactNode[] = [];

        contentList.push(<h1 className="text-2xl font-bold tracking-widest text-center">{about.name.toUpperCase()}</h1>);
        contentList.push(<p className="text-xs text-center">{about.jobTitle}</p>);
        if (contact.website) contentList.push(<p className="text-xs text-center">{contact.website}</p>);
        if (contact.phone) contentList.push(<p className="text-xs text-center">TEL: {contact.phone}</p>);
        contentList.push(separator);

        const now = new Date();
        const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        contentList.push(<ReceiptRow label="DATE/TIME:" value={`${formattedDate} ${formattedTime}`} />);
        contentList.push(<ReceiptRow label="CUST NAME:" value={about.name.toUpperCase()} />);
        contentList.push(<ReceiptRow label="APPLYING FOR:" value={about.jobTitle} />);
        contentList.push(separator);

        if (about.summary) {
            contentList.push(<h2 className="font-bold text-center my-2">PROFESSIONAL SUMMARY</h2>);
            contentList.push(<p className="text-xs text-center whitespace-pre-line">{about.summary}</p>);
            contentList.push(separator);
        }

        if (experience.length > 0) {
            contentList.push(<h2 className="font-bold my-2 text-center">WORK EXPERIENCE</h2>);
            experience.forEach(job => {
                contentList.push(<p className="font-bold text-xs">{job.role.toUpperCase()}</p>);
                contentList.push(<p className="text-xs">{job.company}</p>);
                contentList.push(<p className="text-xs text-gray-600">{job.startDate} - {job.endDate}</p>);
                job.description.split('\n').forEach(line => {
                    if (line) contentList.push(<div className="text-xs flex"><span className="mr-2">*</span><span>{line.replace(/^- /, '')}</span></div>);
                });
                contentList.push(<div className="h-2" />);
            });
            contentList.push(separator);
        }

        if (skills.length > 0) {
            contentList.push(<h2 className="font-bold my-2 text-center">SKILLS INVENTORY</h2>);
            skills.forEach(skill => {
                contentList.push(<div className="text-xs flex"><span className="truncate">{skill.name}</span><span className="flex-1 border-b border-dotted border-black mx-1"></span><span>{skill.level}.00%</span></div>);
            });
            contentList.push(separator);
        }

        if (education.length > 0) {
            contentList.push(<h2 className="font-bold my-2 text-center">EDUCATION</h2>);
            education.forEach(edu => {
                contentList.push(<p className="font-bold text-xs">{edu.degree.toUpperCase()}</p>);
                contentList.push(<p className="text-xs">{edu.institution}</p>);
                contentList.push(<p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>);
                contentList.push(<div className="h-2" />);
            });
            contentList.push(separator);
        }

        if (custom.items.length > 0 && custom.title) {
            contentList.push(<h2 className="font-bold my-2 text-center">{custom.title.toUpperCase()}</h2>);
            custom.items.forEach(item => {
                 item.description.split('\n').forEach(line => {
                    if (line) contentList.push(<div className="text-xs flex"><span className="mr-2">*</span><span>{line.replace(/^- /, '')}</span></div>);
                });
            });
            contentList.push(separator);
        }
        
        contentList.push(<Barcode text={`${about.name}-${now.toISOString()}`} />);
        contentList.push(<p className="text-xs text-center mt-2">THANK YOU FOR YOUR CONSIDERATION!</p>);
        contentList.push(<p className="text-xs text-center">PLEASE VISIT AGAIN!</p>);
        
        return contentList;
    }, [data]);

    const coverLetterContent = useMemo(() => {
        if (!coverLetter || coverLetter.trim() === '') {
            return [
                <p className="text-xs text-center">NO COVER LETTER AVAILABLE</p>
            ];
        }

        const separator = <p className="text-xs text-center">{"****************************************"}</p>;
        const contentList: React.ReactNode[] = [];

        const now = new Date();
        const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        contentList.push(<h1 className="text-2xl font-bold tracking-widest text-center">COVER LETTER</h1>);
        contentList.push(<p className="text-xs text-center">{about.name.toUpperCase()}</p>);
        contentList.push(<p className="text-xs text-center">{about.jobTitle}</p>);
        contentList.push(separator);
        contentList.push(<ReceiptRow label="DATE/TIME:" value={`${formattedDate} ${formattedTime}`} />);
        contentList.push(<ReceiptRow label="FROM:" value={about.name.toUpperCase()} />);
        contentList.push(<ReceiptRow label="POSITION:" value={about.jobTitle} />);
        contentList.push(separator);

        // Split cover letter into paragraphs and print each line
        const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
            const lines = paragraph.split('\n').filter(line => line.trim());
            lines.forEach(line => {
                if (line.trim()) {
                    contentList.push(<p className="text-xs whitespace-pre-line">{line.trim()}</p>);
                }
            });
            contentList.push(<div className="h-1" />);
        });

        contentList.push(separator);
        contentList.push(<Barcode text={`${about.name}-COVER-${now.toISOString()}`} />);
        contentList.push(<p className="text-xs text-center mt-2">THANK YOU FOR YOUR CONSIDERATION!</p>);
        contentList.push(<p className="text-xs text-center">PLEASE VISIT AGAIN!</p>);
        
        return contentList;
    }, [data, coverLetter]);

    useEffect(() => {
        if (pdfMode) return;
        if (animationKey === 0) return;
        
        let isCancelled = false;
        const timeouts: NodeJS.Timeout[] = [];
        
        setLines([]);
        setIsPrinting(true);

        // Speed multiplier for showcase mode
        const speedMultiplier = showcaseMode ? 0.1 : 1; // 10x faster in showcase
        let accumulatedDelay = showcaseMode ? 50 : 500;

        allContent.forEach((lineContent) => {
            const baseLineDelay = showcaseMode ? 8 : 80;
            const baseCharDelay = showcaseMode ? 1 : 10;
            const lineDelay = baseLineDelay + getNodeTextLength(lineContent) * baseCharDelay;
            accumulatedDelay += lineDelay;

            const timeout = setTimeout(() => {
                if (isCancelled) return;
                setLines(prev => [...prev, lineContent]);
            }, accumulatedDelay);
            timeouts.push(timeout);
        });
        
        const finalTimeout = setTimeout(() => {
          if (isCancelled) return;
          setIsPrinting(false);
        }, accumulatedDelay + (showcaseMode ? 50 : 500));
        timeouts.push(finalTimeout);

        return () => {
            isCancelled = true;
            timeouts.forEach(clearTimeout);
        };
    }, [allContent, animationKey, pdfMode]);

    useEffect(() => {
        if (pdfMode) return;
        if (coverLetterAnimationKey === 0) return;
        
        let isCancelled = false;
        const timeouts: NodeJS.Timeout[] = [];
        
        setLines([]);
        setIsPrintingCoverLetter(true);

        let accumulatedDelay = showcaseMode ? 50 : 500;

        coverLetterContent.forEach((lineContent) => {
            const baseLineDelay = showcaseMode ? 4 : 40;
            const baseCharDelay = showcaseMode ? 0.5 : 5;
            const lineDelay = baseLineDelay + getNodeTextLength(lineContent) * baseCharDelay;
            accumulatedDelay += lineDelay;

            const timeout = setTimeout(() => {
                if (isCancelled) return;
                setLines(prev => [...prev, lineContent]);
            }, accumulatedDelay);
            timeouts.push(timeout);
        });
        
        const finalTimeout = setTimeout(() => {
          if (isCancelled) return;
          setIsPrintingCoverLetter(false);
        }, accumulatedDelay + (showcaseMode ? 50 : 500));
        timeouts.push(finalTimeout);

        return () => {
            isCancelled = true;
            timeouts.forEach(clearTimeout);
        };
    }, [coverLetterContent, coverLetterAnimationKey, pdfMode]);

    useEffect(() => {
        if (pdfMode) return;
        // Automatically scroll to the bottom as the receipt "prints"
        if (isPrinting || isPrintingCoverLetter) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        }
        // One final scroll after printing has finished to get to the very bottom
        if (!isPrinting && !isPrintingCoverLetter && (animationKey > 0 || coverLetterAnimationKey > 0)) {
            const timer = setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100); // Small delay to ensure the last line is rendered
            return () => clearTimeout(timer);
        }
    }, [lines, isPrinting, isPrintingCoverLetter, animationKey, coverLetterAnimationKey, pdfMode]);
    
    useEffect(() => {
        if (pdfMode) return;
        document.documentElement.classList.add('scrollbar-hide');
        return () => {
            document.documentElement.classList.remove('scrollbar-hide');
        };
    }, [pdfMode]);

    if (pdfMode) {
        return (
            <div className="bg-gray-200 font-code py-12 px-2 flex flex-col items-center min-h-screen text-black">
                <div className="w-full max-w-sm">
                    <div className="relative -mt-2 w-[94%] mx-auto z-10">
                        <div ref={paperRef} className="w-full text-black shadow-lg bg-[#fdfdf2]">
                            <div className="relative z-10 p-4 space-y-1">
                                {allContent.map((line, index) => (
                                    <div key={`pdf-${index}`}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                            <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 z-0"></div>
                        </div>
                        <div
                            className="w-full h-4 bg-repeat-x"
                            style={{
                                backgroundImage:
                                'url(\'data:image/svg+xml;utf8,<svg width="20" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 10 L20 0 Z" fill="%23fdfdf2"/></svg>\')',
                                backgroundSize: '15px 7.5px',
                                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 font-code py-12 px-2 flex flex-col items-center min-h-screen text-black">
            <div className="w-full max-w-sm">
                 <div>
                    <div className="relative h-20 bg-gray-700 rounded-t-lg shadow-inner p-2">
                        <div className="flex justify-between items-center h-full px-4">
                            <button 
                                disabled={isPrinting || isPrintingCoverLetter}
                                onClick={handleCoverLetterPrintClick}
                                className="bg-green-600 text-white font-mono text-sm uppercase px-3 py-2 rounded-sm shadow-md hover:bg-green-700 active:bg-green-800 whitespace-nowrap z-10 disabled:bg-gray-500 h-10"
                            >
                                Print Cover Letter
                            </button>
                            <button 
                                disabled={isPrinting || isPrintingCoverLetter}
                                onClick={handlePrintClick}
                                className="bg-red-600 text-white font-mono text-sm uppercase px-3 py-2 rounded-sm shadow-md hover:bg-red-700 active:bg-red-800 whitespace-nowrap z-10 disabled:bg-gray-500 h-10"
                            >
                                Print Resume
                            </button>
                        </div>
                    </div>
                    <div className="h-6 bg-black rounded-b-md shadow-lg flex items-center p-2">
                        <div className="w-full h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>
                
                {(animationKey > 0 || coverLetterAnimationKey > 0) && (
                    <div className="relative -mt-2 w-[94%] mx-auto z-10">
                        <div ref={paperRef} className="w-full text-black shadow-lg bg-[#fdfdf2]">
                            <div className="relative z-10 p-4 space-y-1">
                                <AnimatePresence>
                                    {lines.map((line, index) => (
                                        <motion.div 
                                            key={`${animationKey}-${coverLetterAnimationKey}-${index}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 z-0"></div>
                        </div>
                        <div
                            className="w-full h-4 bg-repeat-x"
                            style={{
                                backgroundImage:
                                'url(\'data:image/svg+xml;utf8,<svg width="20" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 10 L20 0 Z" fill="%23fdfdf2"/></svg>\')',
                                backgroundSize: '15px 7.5px',
                                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
