
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { Window } from './os/Window';
import { DesktopIcon } from './os/DesktopIcon';
import { Calculator } from './os/Calculator';
import * as Icons from './os/icons';
import { useIsMobile } from '@/hooks/use-mobile';
import { DownloadIcon } from './os/icons';

interface WindowState {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  zIndex: number;
  x: number;
  y: number;
}

interface OperatingSystemTemplateProps {
  data: ResumeData;
}

export function OperatingSystemTemplate({ data }: OperatingSystemTemplateProps) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [time, setTime] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Auto-open cover letter on landing
  useEffect(() => {
    if (data.coverLetter && data.coverLetter.trim() !== '') {
      const coverLetterContent = (
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Cover Letter</h3>
          <div className="whitespace-pre-line text-sm leading-relaxed">
            {data.coverLetter}
          </div>
        </div>
      );
      
      setTimeout(() => {
        openWindow('coverLetter', 'cover_letter.txt', Icons.CoverLetterIcon, coverLetterContent);
      }, 500); // Small delay to let the page settle
    }
  }, [data.coverLetter]);

  const openWindow = useCallback((id: string, title: string, icon: React.ComponentType, content: React.ReactNode) => {
    setWindows(prev => {
      const existingWindowIndex = prev.findIndex(w => w.id === id);
      const zIndex = nextZIndex + 1;
      setNextZIndex(zIndex);

      if (existingWindowIndex !== -1) {
        const updatedWindows = [...prev];
        updatedWindows[existingWindowIndex].zIndex = zIndex;
        return updatedWindows;
      } else {
        const newWindow: WindowState = {
          id,
          title,
          icon,
          content,
          zIndex,
          x: isMobile ? 20 : Math.random() * 150 + 200,
          y: isMobile ? 80 : Math.random() * 150 + 100,
        };
        return [...prev, newWindow];
      }
    });
  }, [nextZIndex, isMobile]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => {
      const windowToFocus = prev.find(w => w.id === id);
      if (windowToFocus && windowToFocus.zIndex < nextZIndex) {
        const newZIndex = nextZIndex + 1;
        setNextZIndex(newZIndex);
        return prev.map(w => (w.id === id ? { ...w, zIndex: newZIndex } : w));
      }
      return prev;
    });
  };

  const handleDownloadResume = async () => {
    // Call the API to generate and download the PDF
    const res = await fetch('/api/resumes/os-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData: data }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-operating-system.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const desktopItems = [
    { id: 'coverLetter', title: 'Cover Letter', icon: Icons.CoverLetterIcon, content: (
      <div className="space-y-3 min-h-[300px]">
        <h3 className="font-bold text-lg">Cover Letter</h3>
        <div className="whitespace-pre-line text-sm leading-relaxed flex-1">
          {data.coverLetter || 'No cover letter available.'}
        </div>
      </div>
    ), hasContent: !!data.coverLetter && data.coverLetter.trim() !== '' },
    { id: 'about', title: 'About Me', icon: Icons.NotepadIcon, content: (
      <div>
        {data.about.photo ? (
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 flex-shrink-0 bg-win-gray p-0.5 border-2 border-inset">
              <img src={data.about.photo} alt={data.about.name} className="w-full h-full object-cover" data-ai-hint="profile picture" />
            </div>
            <h2 className="text-2xl font-bold">{data.about.name}</h2>
          </div>
        ) : (
          <h2 className="text-2xl font-bold mb-2">{data.about.name}</h2>
        )}
        <p className="whitespace-pre-line">{data.about.summary}</p>
      </div>
    ), hasContent: !!data.about.summary },
    { id: 'contact', title: 'Contact', icon: Icons.AddressBookIcon, content: <div className="space-y-1">
        <p>Email: {data.contact.email}</p>
        <p>Phone: {data.contact.phone}</p>
        <p>Website: {data.contact.website}</p>
        <p>Location: {data.contact.location}</p>
    </div>, hasContent: true },
    { id: 'experience', title: 'Experience', icon: Icons.BriefcaseIcon, content: <div className="space-y-3">{data.experience.map(e => <div key={e.id}><b>{e.role}</b> @ {e.company} ({e.startDate}-{e.endDate})<p className="whitespace-pre-line text-xs pl-2">{e.description}</p></div>)}</div>, hasContent: data.experience.length > 0 },
    { id: 'education', title: 'Education', icon: Icons.DiplomaIcon, content: <div className="space-y-2">{data.education.map(e => <div key={e.id}><b>{e.degree}</b> - {e.institution} ({e.startDate}-{e.endDate})</div>)}</div>, hasContent: data.education.length > 0 },
    { id: 'skills', title: 'Skills', icon: Icons.ToolboxIcon, content: <ul className="list-disc list-inside columns-2">{data.skills.map(s => <li key={s.id}>{s.name}</li>)}</ul>, hasContent: data.skills.length > 0 },
    { id: 'portfolio', title: 'Portfolio', icon: Icons.FolderIcon, content: <div className="space-y-3">{data.portfolio.map(p => <div key={p.id}><a href={p.url} target="_blank" rel="noreferrer noopener" className="text-blue-800 underline"><b>{p.title}</b></a><p className="text-xs pl-2">{p.description}</p></div>)}</div>, hasContent: data.portfolio.length > 0 },
    { id: 'references', title: 'References', icon: Icons.UsersIcon, content: <div className="space-y-2">{data.references.map(r => <div key={r.id}><b>{r.name}</b> ({r.relation}) - {r.contact}</div>)}</div>, hasContent: data.references.length > 0 },
    { id: 'custom', title: data.custom.title, icon: Icons.StarIcon, content: <ul className="list-disc list-inside">{data.custom.items.map(i => <li key={i.id}>{i.description}</li>)}</ul>, hasContent: data.custom.items.length > 0 },
    { id: 'calculator', title: 'Calculator', icon: Icons.CalculatorIcon, content: <Calculator />, hasContent: true },
    { id: 'download', title: 'Download Resume', icon: DownloadIcon, content: null, hasContent: true },
  ];

  return (
    <div className="font-win-sans antialiased bg-[#008080] min-h-screen overflow-hidden text-black">
      <div className="p-2 flex flex-col flex-wrap items-start content-start h-screen">
        {desktopItems.filter(item => item.hasContent).map((item, index) => (
          <DesktopIcon
            key={item.id}
            label={item.title}
            Icon={item.icon}
            onDoubleClick={item.id === 'download' ? handleDownloadResume : () => openWindow(item.id, `${item.title.toLowerCase().replace(' ', '_')}.txt`, item.icon, item.content)}
          />
        ))}
      </div>

      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={`C:\\RESUME\\${win.title}`}
          zIndex={win.zIndex}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          initialX={win.x}
          initialY={win.y}
          isMobile={isMobile}
        >
          {win.content}
        </Window>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-9 bg-win-gray border-t-2 border-white flex items-center px-1 z-[1000]">
        <button className="h-full px-2 flex items-center gap-1 bg-win-gray border-2 border-outset">
          <Icons.WindowsFlagIcon className="w-6 h-6" />
          <b className="text-sm">Start</b>
        </button>

        <div className="flex-1 h-full flex items-center gap-1 pl-2">
            {windows.map(win => (
                <button
                    key={win.id}
                    onClick={() => focusWindow(win.id)}
                    className="h-full px-2 text-sm flex items-center gap-1 bg-win-gray border-2 border-outset max-w-36 data-[active=true]:border-inset"
                    data-active={win.zIndex === nextZIndex}
                >
                    <win.icon className="w-4 h-4" />
                    <span className="truncate">{win.title}</span>
                </button>
            ))}
        </div>

        <div className="h-full px-2 flex items-center text-sm border-2 border-inset">
          {time}
        </div>
      </div>
    </div>
  );
}
