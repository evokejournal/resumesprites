
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Star, FolderGit2, Users, Wrench, User, Bomb, Flag, ExternalLink, FileText } from 'lucide-react';

const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 12;
const TILE_SIZE = '2rem'; 

type CellData = {
  id: string;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  section: any | null;
  sectionType: string | null;
  Icon: React.ComponentType<{ className?: string }> | null;
};

interface RevealedSection {
  type: string;
  data: any;
}

interface TemplateProps {
  data: ResumeData;
}

export function ExplosivePotentialTemplate({ data }: TemplateProps) {
  const [board, setBoard] = useState<CellData[]>([]);
  const [revealedSections, setRevealedSections] = useState<RevealedSection[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [showCoverLetter, setShowCoverLetter] = useState(true);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentContainerRef.current && !showCoverLetter) {
        contentContainerRef.current.scrollTo({
            top: contentContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [revealedSections, showCoverLetter]);

  const mineCount = useMemo(() => board.filter(cell => cell.isMine).length, [board]);
  const flagCount = useMemo(() => board.filter(cell => cell.isFlagged).length, [board]);

  const orderedSections = useMemo(() => {
    const sections: (RevealedSection | false)[] = [
      data.about.summary ? { type: 'about', data: { ...data.about, title: 'About Me', id: 'about' } } : false,
      data.experience.length > 0 ? { type: 'experience', data: data.experience } : false,
      data.skills.length > 0 ? { type: 'skills', data: data.skills } : false,
      data.education.length > 0 ? { type: 'education', data: data.education } : false,
      data.portfolio.length > 0 ? { type: 'portfolio', data: data.portfolio } : false,
      data.references.length > 0 ? { type: 'reference', data: data.references } : false,
      (data.custom.title && data.custom.items.length > 0) ? { type: 'custom', data: data.custom } : false,
    ];
    return sections.filter(Boolean) as RevealedSection[];
  }, [data]);
  
  const getNeighbors = (index: number, width: number, height: number) => {
    const neighbors = [];
    const x = index % width;
    const y = Math.floor(index / width);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          neighbors.push(ny * width + nx);
        }
      }
    }
    return neighbors;
  };
  
  const initializeBoard = useCallback(() => {
    const sectionItemsForGrid = [
      data.about.summary && { type: 'about', data: { ...data.about, title: 'About Me' }, Icon: User },
      data.experience.length > 0 && { type: 'experience', data: data.experience, Icon: Briefcase },
      data.skills.length > 0 && { type: 'skills', data: data.skills, Icon: Star },
      data.education.length > 0 && { type: 'education', data: data.education, Icon: GraduationCap },
      data.portfolio.length > 0 && { type: 'portfolio', data: data.portfolio, Icon: FolderGit2 },
      data.references.length > 0 && { type: 'reference', data: data.references, Icon: Users },
      (data.custom.title && data.custom.items.length > 0) && { type: 'custom', data: data.custom, Icon: Wrench },
    ].filter(Boolean) as {type: string; data: any; Icon: React.ComponentType<{className?: string;}>}[];

    const totalCells = BOARD_WIDTH * BOARD_HEIGHT;
    let newBoard: CellData[] = Array.from({ length: totalCells }, (_, i) => ({
      id: `cell-${i}`, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0, section: null, sectionType: null, Icon: null
    }));

    const mineIndices = new Set<number>();
    const numMines = sectionItemsForGrid.length;
    while (mineIndices.size < numMines && mineIndices.size < totalCells) {
      mineIndices.add(Math.floor(Math.random() * totalCells));
    }

    let itemIndex = 0;
    mineIndices.forEach(index => {
      const gridItem = sectionItemsForGrid[itemIndex % sectionItemsForGrid.length];
      newBoard[index].isMine = true;
      newBoard[index].section = gridItem.data;
      newBoard[index].sectionType = gridItem.type;
      newBoard[index].Icon = gridItem.Icon;
      itemIndex++;
    });

    for (let i = 0; i < totalCells; i++) {
        if (!newBoard[i].isMine) {
            const neighbors = getNeighbors(i, BOARD_WIDTH, BOARD_HEIGHT);
            newBoard[i].adjacentMines = neighbors.filter(n => newBoard[n].isMine).length;
        }
    }

    setBoard(newBoard);
    setRevealedSections([]);
    setGameState('playing');
  }, [data]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);
  
  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || board[index].isRevealed || board[index].isFlagged || showCoverLetter) return;

    let newBoard = [...board];
    const revealedMinesBefore = newBoard.filter(c => c.isMine && c.isRevealed).length;

    const reveal = (idx: number) => {
        if (newBoard[idx].isRevealed) return;
        newBoard[idx].isRevealed = true;

        if (!newBoard[idx].isMine && newBoard[idx].adjacentMines === 0) {
            getNeighbors(idx, BOARD_WIDTH, BOARD_HEIGHT).forEach(neighbor => reveal(neighbor));
        }
    };
    
    reveal(index);
    
    const revealedMinesAfter = newBoard.filter(c => c.isMine && c.isRevealed).length;
    const newMinesRevealedCount = revealedMinesAfter - revealedMinesBefore;

    if (newMinesRevealedCount > 0) {
        const currentSectionsCount = revealedSections.length;
        const newSectionsToAdd = orderedSections.slice(currentSectionsCount, currentSectionsCount + newMinesRevealedCount);
        setRevealedSections(prev => [...prev, ...newSectionsToAdd]);
    }
    
    const allMinesRevealed = newBoard.filter(c => c.isMine).every(c => c.isRevealed);
    if (allMinesRevealed) {
      setGameState('won');
      newBoard = newBoard.map(cell => ({ ...cell, isRevealed: true }));
    }
    
    setBoard(newBoard);
  };
  
  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[index].isRevealed || showCoverLetter) return;

    let newBoard = [...board];
    const cell = newBoard[index];
    const isNowFlagging = !cell.isFlagged;

    cell.isFlagged = isNowFlagging;

    if (isNowFlagging && cell.isMine) {
      const revealedMinesBefore = newBoard.filter(
        (c) => c.isMine && c.isRevealed
      ).length;

      cell.isRevealed = true;

      const revealedMinesAfter = newBoard.filter(
        (c) => c.isMine && c.isRevealed
      ).length;
      const newMinesRevealedCount = revealedMinesAfter - revealedMinesBefore;

      if (newMinesRevealedCount > 0) {
        const currentSectionsCount = revealedSections.length;
        const newSectionsToAdd = orderedSections.slice(
          currentSectionsCount,
          currentSectionsCount + newMinesRevealedCount
        );
        setRevealedSections((prev) => [...prev, ...newSectionsToAdd]);
      }

      const allMinesRevealed = newBoard
        .filter((c) => c.isMine)
        .every((c) => c.isRevealed);
      if (allMinesRevealed) {
        setGameState('won');
        newBoard = newBoard.map((c) => ({ ...c, isRevealed: true }));
      }
    }

    setBoard(newBoard);
  };

  const SmileyIcon = () => {
    if (gameState === 'won') return <span className="text-3xl">😎</span>;
    return <span className="text-3xl">🙂</span>;
  };
  
  return (
    <div className="font-win-sans bg-[#008080] h-svh p-4 sm:p-8 text-black">
      {/* Cover Letter Button */}
      <button
        onClick={() => setShowCoverLetter(true)}
        className="fixed top-4 right-16 z-50 bg-win-gray border-2 border-outset p-3 hover:border-inset transition-all duration-200 shadow-lg"
        title="View Cover Letter"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="text-black"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </button>

      {/* Download Button */}
      <button
        onClick={async () => {
          const res = await fetch('/api/resumes/explosive-potential-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeData: data }),
          });
          if (!res.ok) return;
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resume-explosive.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }}
        className="fixed top-4 right-4 z-50 bg-win-gray border-2 border-outset p-3 hover:border-inset transition-all duration-200 shadow-lg"
        title="Download Resume PDF"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="text-black"
        >
          <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
        </svg>
      </button>

      <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="bg-win-gray p-2 border-2 border-outset w-fit">
            <div className="flex justify-between items-center bg-win-gray p-1 mb-2 border-2 border-inset">
              <div className="bg-black text-red-500 font-mono text-2xl p-1 w-20 text-center">
                {(mineCount - flagCount).toString().padStart(3, '0')}
              </div>
              <button onClick={initializeBoard} className="border-2 border-outset active:border-inset p-1">
                <SmileyIcon />
              </button>
              <div className="bg-black text-red-500 font-mono text-2xl p-1 w-20 text-center">
                {board.filter(c => c.isRevealed && c.isMine).length.toString().padStart(3, '0')}
              </div>
            </div>

            <div className="border-2 border-inset p-1">
              <div className="grid bg-gray-700 gap-px" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}>
                {board.map((cell, index) => (
                  <Tile key={cell.id} cell={cell} onClick={() => handleTileClick(index)} onRightClick={(e) => handleRightClick(e, index)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={contentContainerRef} className="w-full lg:w-1/2 max-w-xl h-full overflow-y-auto">
          <div className="p-1 space-y-4">
              <div className="bg-win-gray p-1 border-2 border-outset">
                  <div className="bg-white p-2 border-2 border-inset text-center">
                      <h2 
                        className="text-xl font-bold cursor-pointer hover:text-win-blue transition-colors"
                        onClick={() => setShowCoverLetter(true)}
                      >
                        {data.about.name}
                      </h2>
                      <h3 className="text-md">{data.about.jobTitle}</h3>
                  </div>
              </div>

              {showCoverLetter ? (
                // Cover Letter Modal Content
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-win-gray p-1 border-2 border-outset"
                >
                  <div className="bg-white p-3 border-2 border-inset">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Cover Letter
                      </h3>
                      <button
                        onClick={() => setShowCoverLetter(false)}
                        className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {data.coverLetter || 'No cover letter available.'}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Regular Revealed Sections
                <>
                  {revealedSections.map((section, index) => (
                      <motion.div
                          key={section.type || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="bg-win-gray p-1 border-2 border-outset"
                      >
                          <div className="bg-white p-3 border-2 border-inset">
                              <ContentDisplay section={section.data} type={section.type} />
                          </div>
                      </motion.div>
                  ))}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Tile = ({ cell, onClick, onRightClick }: { cell: CellData, onClick: () => void, onRightClick: (e: React.MouseEvent) => void }) => {
  const numberColors = [ '', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-blue-900', 'text-red-900', 'text-cyan-600', 'text-black', 'text-gray-500' ];

  const renderContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine && cell.Icon) {
        const IconComponent = cell.Icon;
        return <IconComponent className="h-4 w-4 text-black" />;
      }
      if (cell.adjacentMines > 0) {
        return <span className={cn("font-bold", numberColors[cell.adjacentMines])}>{cell.adjacentMines}</span>;
      }
      return null;
    }
    if (cell.isFlagged) {
      return <Flag className="h-5 w-5 text-red-600" />;
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={onRightClick}
      className={cn(
        "flex items-center justify-center font-mono font-bold text-xl",
        cell.isRevealed 
            ? "bg-win-gray border-gray-400 border" 
            : "bg-win-gray border-2 border-outset active:border-inset"
      )}
      style={{ width: TILE_SIZE, height: TILE_SIZE }}
      disabled={cell.isRevealed}
    >
      {renderContent()}
    </button>
  );
};

const ContentDisplay = ({ section, type }: { section: any, type: string | null }) => {
    if (!section || !type) return null;

    switch (type) {
        case 'about': return <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2"><User />{section.title}</h3>
            <p className="whitespace-pre-line text-sm">{section.summary}</p>
        </div>;
        case 'experience': return <div className="space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><Briefcase />Experience</h3>
            {(section as ResumeData['experience']).map(item => (
                <div key={item.id} className="space-y-1">
                    <h4 className="font-semibold text-lg">{item.role}</h4>
                    <p className="text-md font-semibold">{item.company}</p>
                    <p className="text-sm text-gray-600">{item.startDate} - {item.endDate}</p>
                    <p className="whitespace-pre-line mt-1 text-sm">{item.description}</p>
                </div>
            ))}
        </div>;
        case 'skills': return <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2"><Star />Skills</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {(section as ResumeData['skills']).map(skill => (
                    <div key={skill.id} className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                    </div>
                ))}
            </div>
        </div>;
        case 'education': return <div className="space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><GraduationCap />Education</h3>
            {(section as ResumeData['education']).map(item => (
                <div key={item.id} className="space-y-1">
                    <h4 className="font-semibold text-lg">{item.degree}</h4>
                    <p className="text-md">{item.institution}</p>
                    <p className="text-sm text-gray-600">{item.startDate} - {item.endDate}</p>
                </div>
            ))}
        </div>;
        case 'portfolio': return <div className="space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><FolderGit2 />Portfolio</h3>
            {(section as ResumeData['portfolio']).map(item => (
                 <div key={item.id} className="space-y-1">
                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline text-win-blue flex items-center gap-2">
                        {item.title}<ExternalLink className="w-4 h-4" />
                    </a>
                    <p className="mt-1 text-sm">{item.description}</p>
                 </div>
            ))}
        </div>;
        case 'reference': return <div className="space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><Users />References</h3>
            {(section as ResumeData['references']).map(item => (
                <div key={item.id} className="space-y-1">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p>{item.relation}</p>
                    <p className="text-sm text-gray-600">{item.contact}</p>
                </div>
            ))}
        </div>;
        case 'custom': return <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2"><Wrench />{section.title}</h3>
            {(section.items as ResumeData['custom']['items']).map(item => (
                <p key={item.id} className="mt-1 text-sm">{item.description}</p>
            ))}
        </div>;
        default: return <p>Select a section to view details.</p>;
    }
}
