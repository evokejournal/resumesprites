'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData } from '@/lib/types';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Photo } from './Photo';

const YoubleLogo = ({ size = 'large' }: { size?: 'large' | 'small' }) => (
    <h1 className={`font-headline select-none ${size === 'large' ? 'text-6xl md:text-8xl' : 'text-2xl'}`}>
        <span style={{ color: '#EA4335' }}>Y</span>
        <span style={{ color: '#4285F4' }}>o</span>
        <span style={{ color: '#34A853' }}>u</span>
        <span style={{ color: '#FBBC05' }}>b</span>
        <span style={{ color: '#EA4335' }}>l</span>
        <span style={{ color: '#4285F4' }}>e</span>
    </h1>
);

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
}

export function YoubleTemplate({ data, pdfMode }: TemplateProps) {
    const { about, contact, experience, education, skills, portfolio, references, custom, coverLetter } = data;
    const [query, setQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState(data.about.name);
    const [showResults, setShowResults] = useState(false);
    const [showResultsContent, setShowResultsContent] = useState(false);
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!showResults && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showResults]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchQuery = query || about.name;
        setSubmittedQuery(searchQuery);
        setShowResults(true);
        setShowResultsContent(false);
        setTimeout(() => {
            setShowResultsContent(true);
        }, 300);
    };

    const handleBack = () => {
        setShowResults(false);
        setShowResultsContent(false);
    };

    const SearchResult = ({ title, url, snippet }: { title: string, url: string, snippet: React.ReactNode }) => (
        <div className="mb-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-lg text-[#1a0dab] hover:underline block truncate">
                <h3>{title}</h3>
            </a>
            <p className="text-sm text-[#006621]">{url}</p>
            <div className="text-sm text-[#4d5156] mt-1">{snippet}</div>
        </div>
    );

    const CoverLetterResult = () => {
        if (!coverLetter || coverLetter.trim() === '') {
            return (
                <div className="mb-6">
                    <h3 className="text-lg text-[#1a0dab]">Cover Letter | {about.name}</h3>
                    <p className="text-sm text-[#006621]">https://youble.com/search?q={about.name.toLowerCase().replace(' ', '-')}+cover-letter</p>
                    <div className="text-sm text-[#4d5156] mt-1">
                        No cover letter available for this candidate.
                    </div>
                </div>
            );
        }

        const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());
        return (
            <div className="mb-6">
                <h3 className="text-lg text-[#1a0dab]">Cover Letter | {about.name}</h3>
                <p className="text-sm text-[#006621]">https://youble.com/search?q={about.name.toLowerCase().replace(' ', '-')}+cover-letter</p>
                <div className="text-sm text-[#4d5156] mt-1">
                    {paragraphs.map((paragraph, index) => (
                        <div key={index} className="mb-2">
                            {paragraph.trim()}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (pdfMode) {
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center font-sans p-8">
                <div className="mb-8">
                    <YoubleLogo />
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-2xl w-full">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#4285F4]">{about.name}</h1>
                            <p className="text-gray-600">{about.jobTitle}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                            <p>{contact.website}</p>
                            <p>{contact.location}</p>
                        </div>
                    </div>
                    <div className="mb-4 text-gray-500">{currentDate}</div>
                    <div className="mb-8 text-gray-700 whitespace-pre-line text-base">
                        {coverLetter || 'No cover letter provided.'}
                    </div>
                    <div className="pt-6 border-t text-center text-gray-700">
                        <p className="text-lg font-semibold">My interactive resume can be viewed online here:</p>
                        {/* The actual link and password will be injected by the PDF API */}
                        <div className="mt-2 text-md">(Link and password will appear here)</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!showResults) {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
                <YoubleLogo />
                <p className="text-gray-600 mt-2 mb-6">Who are you searching for?</p>
                <form onSubmit={handleSearch} className="w-full max-w-xl">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Try searching for "${about.name}"`}
                            className="w-full border border-gray-300 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button type="submit" className="bg-[#f8f9fa] border border-[#f8f9fa] text-[#3c4043] text-sm py-2 px-4 rounded hover:shadow-md">
                            Youble Search
                        </button>
                        <button type="submit" className="bg-[#f8f9fa] border border-[#f8f9fa] text-[#3c4043] text-sm py-2 px-4 rounded hover:shadow-md">
                            I'm Feelin' Lucky
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Cover Letter Button */}
            <button
              onClick={() => setShowCoverLetter(true)}
              className="fixed top-4 right-16 z-50 bg-white border border-gray-300 rounded-full p-3 hover:bg-gray-50 transition-all duration-200 shadow-lg"
              title="View Cover Letter"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="text-gray-600"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </button>

            {/* Download Button */}
            <button
              onClick={async () => {
                setIsDownloading(true);
                const res = await fetch('/api/resumes/goobleit-pdf', {
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
                a.download = 'resume-goobleit.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                setIsDownloading(false);
              }}
              className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-full p-3 hover:bg-gray-50 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download Resume PDF"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="text-gray-600"
                >
                  <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
                </svg>
              )}
            </button>

            {/* Header */}
            <header className="border-b border-gray-200 p-4 flex items-center gap-4 sticky top-0 bg-white z-10">
                <button onClick={handleBack} className="w-auto">
                   <YoubleLogo size="small" />
                </button>
                <form onSubmit={handleSearch} className="flex-grow max-w-2xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={submittedQuery}
                            readOnly
                            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 shadow-md bg-gray-100 text-black"
                        />
                         <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                    </div>
                </form>
            </header>
            
            {/* Results */}
            <AnimatePresence>
                {showResultsContent && (
                    <motion.main
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-3xl mx-auto p-4 md:p-6"
                    >
                        {showCoverLetter ? (
                            // Cover Letter Modal Content
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs text-gray-600">About 1 result (0.42 seconds)</p>
                                    <button
                                        onClick={() => setShowCoverLetter(false)}
                                        className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        ✕ Close
                                    </button>
                                </div>
                                
                                {/* Cover Letter as Search Result */}
                                <CoverLetterResult />
                            </div>
                        ) : (
                            // Regular Search Results
                            <>
                                <p className="text-xs text-gray-600 mb-4">About 1 result (0.42 seconds)</p>

                                {/* About Section */}
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-8">
                                    <div className="flex items-start gap-4">
                                        <Photo 
                                            photo={about.photo} 
                                            name={about.name} 
                                            size="lg" 
                                            className="rounded-lg flex-shrink-0"
                                        />
                                        <div>
                                            <h2 
                                                className="text-xl font-semibold cursor-pointer hover:text-[#1a0dab] transition-colors"
                                                onClick={() => setShowCoverLetter(true)}
                                            >
                                                {about.name}
                                            </h2>
                                            <p className="text-gray-600">{about.jobTitle}</p>
                                            <p className="text-sm mt-2">{about.summary}</p>
                                            <div className="text-xs mt-3 space-x-4 text-gray-500">
                                                <span>{contact.email}</span>
                                                <span>{contact.phone}</span>
                                                <span>{contact.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Sections as Search Results */}
                                {experience.length > 0 && (
                                    <SearchResult
                                        title={`Work Experience | ${about.name}`}
                                        url={`https://youble.com/search?q=${about.name.toLowerCase().replace(' ', '-')}+experience`}
                                        snippet={
                                            <ul className="list-disc list-inside">
                                                {experience.map(e => <li key={e.id}>{`${e.role} at ${e.company} (${e.startDate} - ${e.endDate})`}</li>)}
                                            </ul>
                                        }
                                    />
                                )}

                                {education.length > 0 && (
                                     <SearchResult
                                        title={`Education and Qualifications`}
                                        url={`https://youble.com/search?q=${about.name.toLowerCase().replace(' ', '-')}+education`}
                                        snippet={education.map(e => `${e.degree}, ${e.institution}`).join(' ... ')}
                                    />
                                )}
                                
                                {skills.length > 0 && (
                                     <SearchResult
                                        title={`Top Skills for ${about.name}`}
                                        url={`https://youble.com/search?q=${about.name.toLowerCase().replace(' ', '-')}+skills`}
                                        snippet={`Core competencies include: ${skills.slice(0, 5).map(s => s.name).join(', ')} and more.`}
                                    />
                                )}

                                {portfolio.length > 0 && (
                                    <SearchResult
                                        title={`Portfolio Projects`}
                                        url={`https://youble.com/search?q=${about.name.toLowerCase().replace(' ', '-')}+portfolio`}
                                        snippet={
                                             <ul className="list-disc list-inside">
                                                {portfolio.map(p => <li key={p.id}>{p.title}: {p.description}</li>)}
                                            </ul>
                                        }
                                    />
                                )}
                                
                                {custom.items.length > 0 && custom.title && (
                                    <SearchResult
                                        title={custom.title}
                                        url={`https://youble.com/search?q=${custom.title.toLowerCase()}`}
                                        snippet={
                                             <ul className="list-disc list-inside">
                                                {custom.items.map(i => <li key={i.id}>{i.description}</li>)}
                                            </ul>
                                        }
                                    />
                                )}

                                {references.length > 0 && (
                                    <SearchResult
                                        title={`Professional References`}
                                        url={`https://www.linkedin.com/in/${about.name.toLowerCase().replace(' ', '-')}/recommendations`}
                                        snippet={`References from professionals like ${references[0].name} (${references[0].relation}) available upon request.`}
                                    />
                                )}
                            </>
                        )}
                    </motion.main>
                )}
            </AnimatePresence>
        </div>
    );
}
