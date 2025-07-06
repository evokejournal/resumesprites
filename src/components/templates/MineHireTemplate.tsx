
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CoverLetterModal } from '@/components/CoverLetterModal';
import { Briefcase, GraduationCap, Star, FolderGit2, Users, Wrench, User, FileText, ExternalLink } from 'lucide-react';

// --- HELPER ICONS --- //
const SmileyIcon = ({ status } : { status: 'playing' | 'won' }) => {
    if (status === 'won') return <span className="text-3xl">😎</span>;
    return <span className="text-3xl">🙂</span>;
};


// --- BOARD SETUP --- //
const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 16;

type CellData = {
  id: string;
  type: 'skill' | 'experience' | 'education' | 'portfolio' | 'custom' | 'reference' | 'about' | 'empty';
  content: any;
  icon: React.ComponentType<{ className?: string }> | null;
  state: 'hidden' | 'revealed';
};

// --- TEMPLATE PROPS --- //
interface TemplateProps {
  data: ResumeData;
  isCoverLetterOpen: boolean;
  setCoverLetterOpen: (open: boolean) => void;
}

export function MineHireTemplate({ data, isCoverLetterOpen, setCoverLetterOpen }: TemplateProps) {
  const [board, setBoard] = useState<CellData[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [revealedContent, setRevealedContent] = useState<CellData['content'] | null>(null);
  const [contentType, setContentType] = useState<CellData['type'] | null>(null);

  const contentTileCount = useMemo(() => board.filter(c => c.type !== 'empty').length, [board]);
  const revealedTileCount = useMemo(() => board.filter(c => c.type !== 'empty' && c.state === 'revealed').length, [board]);

  const getNeighbors = (index: number) => {
    const neighbors = [];
    const x = index % BOARD_WIDTH;
    const y = Math.floor(index / BOARD_WIDTH);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < BOARD_WIDTH && ny >= 0 && ny < BOARD_HEIGHT) {
          neighbors.push(ny * BOARD_WIDTH + nx);
        }
      }
    }
    return neighbors;
  };
  
  const initializeBoard = useCallback(() => {
    const resumeItems = [
      { type: 'about' as const, content: { title: 'About Me', summary: data.about.summary }, icon: User },
      ...data.experience.map(item => ({ type: 'experience' as const, content: item, icon: Briefcase })),
      ...data.education.map(item => ({ type: 'education' as const, content: item, icon: GraduationCap })),
      ...data.portfolio.map(item => ({ type: 'portfolio' as const, content: item, icon: FolderGit2 })),
      ...data.references.map(item => ({ type: 'reference' as const, content: item, icon: Users })),
      ...data.custom.items.map(item => ({ type: 'custom' as const, content: { ...item, title: data.custom.title }, icon: Wrench })),
      ...data.skills.map(item => ({ type: 'skill' as const, content: item, icon: Star })),
    ].filter(item => item.content && (item.content.summary || item.content.company || item.content.degree || item.content.title || item.content.name || item.content.description));

    const totalCells = BOARD_WIDTH * BOARD_HEIGHT;
    let newBoard: Partial<CellData>[] = Array(totalCells).fill({ type: 'empty', content: null, icon: null });

    const itemsToPlace = resumeItems.slice(0, totalCells);
    for (let i = 0; i < itemsToPlace.length; i++) {
        newBoard[i] = itemsToPlace[i];
    }
    
    for (let i = newBoard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
    }

    const finalBoard = newBoard.map((cell, index) => ({
      ...cell,
      id: `cell-${index}`,
      state: 'hidden',
    }));

    setBoard(finalBoard as CellData[]);
    setRevealedContent(null);
    setContentType(null);
    setGameState('playing');
  }, [data]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);
  
  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    const newBoard = [...board];
    const cell = newBoard[index];
    
    if (cell.state !== 'hidden') return;

    cell.state = 'revealed';
    setRevealedContent(cell.content);
    setContentType(cell.type);

    if (cell.type === 'empty') {
      const queue = [index];
      const visited = new Set([index]);

      while (queue.length > 0) {
        const currentIndex = queue.shift()!;
        
        getNeighbors(currentIndex).forEach(neighborIndex => {
          if (!visited.has(neighborIndex)) {
            visited.add(neighborIndex);
            const neighborCell = newBoard[neighborIndex];
            if (neighborCell.state === 'hidden') {
              neighborCell.state = 'revealed';
              if (neighborCell.type === 'empty') {
                queue.push(neighborIndex);
              }
            }
          }
        });
      }
    }
    
    setBoard(newBoard);
    
    const contentTiles = newBoard.filter(c => c.type !== 'empty');
    const allRevealed = contentTiles.every(c => c.state === 'revealed');
    if (allRevealed) {
      setGameState('won');
    }
  };
  
  const handleRightClick = (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      if(gameState !== 'playing') return;
      handleTileClick(index);
  };
  
  const ContentDisplay = () => {
      if (!revealedContent) {
          return (
            <div className="text-center p-4">
              <p className="font-bold">Welcome to MineHire!</p>
              <p className="text-sm text-gray-600">Click any tile to explore. Both left and right-click work!</p>
            </div>
          );
      }
      
      switch (contentType) {
          case 'skill': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><Star />{revealedContent.name}</h3><p>Proficiency: {revealedContent.level}%</p></div>;
          case 'experience': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><Briefcase />{revealedContent.role}</h3><p>{revealedContent.company}</p><p className="text-sm text-gray-500">{revealedContent.startDate} - {revealedContent.endDate}</p><p className="whitespace-pre-line mt-2 text-sm">{revealedContent.description}</p></div>
          case 'education': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><GraduationCap />{revealedContent.degree}</h3><p>{revealedContent.institution}</p><p className="text-sm text-gray-500">{revealedContent.startDate} - {revealedContent.endDate}</p></div>
          case 'portfolio': return <div className="p-4"><a href={revealedContent.url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg flex items-center gap-2 hover:underline text-blue-600"><FolderGit2 />{revealedContent.title}<ExternalLink className="w-4 h-4" /></a><p className="mt-2 text-sm">{revealedContent.description}</p></div>
          case 'custom': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><Wrench />{revealedContent.title}</h3><p className="whitespace-pre-line mt-2 text-sm">{revealedContent.description}</p></div>;
          case 'about': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><User />{revealedContent.title}</h3><p className="whitespace-pre-line mt-2 text-sm">{revealedContent.summary}</p></div>
          case 'reference': return <div className="p-4"><h3 className="font-bold text-lg flex items-center gap-2"><Users />{revealedContent.name}</h3><p>{revealedContent.relation}</p><p className="text-sm text-gray-500">{revealedContent.contact}</p></div>
          case 'empty': return <div className="p-4"><p className="text-gray-500">Empty field. Keep exploring!</p></div>
          default: return null;
      }
  }

  return (
    <>
      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onOpenChange={setCoverLetterOpen}
        title="TOP SECRET: Cover Letter"
        content={data.coverLetter}
      />
      <div className="bg-[#C0C0C0] min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
        <div className="bg-[#C0C0C0] p-2 border-2 border-outset border-t-white border-l-white border-b-gray-800 border-r-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#C0C0C0] p-1 mb-2 border-2 border-inset border-t-gray-800 border-l-gray-800 border-b-white border-r-white">
                <div className="bg-black text-red-500 font-mono text-2xl p-1 w-16 text-center">
                    {contentTileCount.toString().padStart(3, '0')}
                </div>
                <button onClick={initializeBoard}>
                    <SmileyIcon status={gameState}/>
                </button>
                <div className="bg-black text-red-500 font-mono text-2xl p-1 w-16 text-center">
                   {revealedTileCount.toString().padStart(3, '0')}
                </div>
            </div>

            {/* Game Board */}
            <div className="border-2 border-inset border-t-gray-800 border-l-gray-800 border-b-white border-r-white">
                <div className="grid gap-[1px] bg-gray-700" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}>
                    {board.map((cell, index) => (
                        <Tile key={cell.id} cell={cell} onClick={() => handleTileClick(index)} onRightClick={(e) => handleRightClick(e, index)} />
                    ))}
                </div>
            </div>
        </div>

        {/* Info Panel */}
        <div className="w-full max-w-lg mt-4">
             <div className="bg-[#C0C0C0] p-2 border-2 border-outset border-t-white border-l-white border-b-gray-800 border-r-gray-800">
                <div className="bg-white min-h-[100px] border-2 border-inset border-t-gray-800 border-l-gray-800 border-b-white border-r-white">
                    <ContentDisplay />
                </div>
             </div>
        </div>
      </div>
    </>
  );
}

// --- TILE SUB-COMPONENT --- //
const Tile = ({ cell, onClick, onRightClick }: { cell: CellData, onClick: () => void, onRightClick: (e: React.MouseEvent) => void }) => {
    const renderContent = () => {
        if (cell.state === 'revealed') {
            if (cell.type !== 'empty' && cell.icon) {
                const Icon = cell.icon;
                return <div className="p-0.5"><Icon className="w-full h-full text-gray-700" /></div>;
            }
            return null; // Empty revealed tile
        }
        return null; // Hidden tile
    };

    return (
        <button
            onClick={onClick}
            onContextMenu={onRightClick}
            className={cn(
                "w-6 h-6 flex items-center justify-center text-lg font-mono",
                cell.state !== 'revealed' && "bg-[#C0C0C0] border-2 border-outset border-t-white border-l-white border-b-gray-800 border-r-gray-800 active:border-inset active:border-t-gray-800 active:border-l-gray-800",
                cell.state === 'revealed' && "bg-[#C0C0C0] border border-gray-500"
            )}
            disabled={cell.state === 'revealed'}
        >
            {renderContent()}
        </button>
    );
};
