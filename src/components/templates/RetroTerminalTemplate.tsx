'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedText } from './AnimatedText';

const bootSequence = [
  { text: 'Booting ResumeSprites OS v1.3.37...', delay: 200 },
  { text: 'Initializing kernel...', delay: 400 },
  { text: 'Loading user profile: [alex.doe]', delay: 300 },
  { text: 'Mounting /dev/resume...', delay: 400 },
  { text: 'Checking data integrity... [  0%]', delay: 200 },
  { text: 'Checking data integrity... [ 25%]', delay: 300, replace: true },
  { text: 'Checking data integrity... [ 68%]', delay: 400, replace: true },
  { text: 'Checking data integrity... [100%]', delay: 200, replace: true },
  { text: 'Data integrity check... OK', delay: 200, replace: true },
  { text: 'Establishing secure connection...', delay: 500 },
  { text: 'Connection established.', delay: 200 },
  { text: 'Welcome, visitor.', delay: 100 },
];

interface RetroTerminalTemplateProps {
  data: ResumeData;
}

export function RetroTerminalTemplate({ data }: RetroTerminalTemplateProps) {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [command, setCommand] = useState('');
  const [bootingText, setBootingText] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [shouldStartBoot, setShouldStartBoot] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const availableCommands = useMemo(() => {
    const commandList: string[] = [];
    commandList.push('coverletter', 'about', 'contact', 'experience', 'education', 'skills', 'portfolio', 'references');
    if (data.custom?.title && data.custom.items.length > 0) {
      commandList.push(data.custom.title.toLowerCase());
    }
    commandList.push('help', 'clear');
    return commandList;
  }, [data]);

  const runCommand = useCallback((cmd: string) => {
    const newHistory = [...history, <div key={history.length}><span className="text-cyan-400">visitor@resumesprites:~$</span> {cmd}</div>];
    let output;

    switch (cmd.toLowerCase().trim()) {
      case 'help':
        output = (
          <div className="space-y-1">
            <p>Available commands:</p>
            <ul className="list-disc list-inside pl-4 columns-2">
              {availableCommands.map(c => <li key={c}>{c}</li>)}
            </ul>
          </div>
        );
        break;
      case 'coverletter':
        output = data.coverLetter && data.coverLetter.trim() ? (
          <div className="space-y-2">
            <p><span className="text-yellow-400 font-bold">Cover Letter</span></p>
            <div className="whitespace-pre-line">{data.coverLetter}</div>
          </div>
        ) : <p>No cover letter available.</p>;
        break;
      case 'about':
        output = (
          <div className="space-y-2">
            <p><span className="text-yellow-400 font-bold">{data.about.name}</span> - {data.about.jobTitle}</p>
            <div className="whitespace-pre-line">{data.about.summary}</div>
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="grid grid-cols-2 gap-x-4">
            <p>Email: <a href={`mailto:${data.contact.email}`} className="text-yellow-400 hover:underline">{data.contact.email}</a></p>
            <p>Phone: <span className="text-yellow-400">{data.contact.phone}</span></p>
            <p>Website: <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">{data.contact.website}</a></p>
            <p>Location: <span className="text-yellow-400">{data.contact.location}</span></p>
          </div>
        );
        break;
      case 'experience':
        output = data.experience.length > 0 ? (
          <div className="space-y-3">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <p>{'>'} <span className="font-bold text-yellow-400">{exp.role}</span> at {exp.company}</p>
                <p className="pl-4 text-gray-400">{exp.startDate} - {exp.endDate}</p>
                <div className="pl-4 whitespace-pre-line">{exp.description}</div>
              </div>
            ))}
          </div>
        ) : <p>No experience data found.</p>;
        break;
      case 'skills':
        output = data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.skills.map(skill => (
              <p key={skill.id}>{skill.name} [{''.padStart(Math.round(skill.level / 10), '█').padEnd(10, '░')}]</p>
            ))}
          </div>
        ) : <p>No skills data found.</p>;
        break;
      case 'education':
        output = data.education.length > 0 ? (
           <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id}>
                <p>{'>'} <span className="font-bold text-yellow-400">{edu.degree}</span> - {edu.institution}</p>
                <p className="pl-4 text-gray-400">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        ) : <p>No education data found.</p>;
        break;
      case 'portfolio':
         output = data.portfolio.length > 0 ? (
           <div className="space-y-3">
            {data.portfolio.map(item => (
              <div key={item.id}>
                <p>{'>'} <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-400 hover:underline">{item.title}</a></p>
                <div className="pl-4">{item.description}</div>
              </div>
            ))}
          </div>
        ) : <p>No portfolio data found.</p>;
        break;
      case 'references':
        output = data.references.length > 0 ? (
          <div className="space-y-2">
            {data.references.map(ref => (
              <p key={ref.id}>&gt; <span className="font-bold">{ref.name}</span> ({ref.relation}) - {ref.contact}</p>
            ))}
          </div>
        ) : <p>References available upon request.</p>;
        break;
      case data.custom.title.toLowerCase():
         output = data.custom.items.length > 0 ? (
           <div className="space-y-2">
            {data.custom.items.map(item => (
              <div key={item.id} className="whitespace-pre-line flex">
                <span>-&nbsp;</span>
                {item.description}
              </div>
            ))}
          </div>
        ) : <p>Section not found.</p>;
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        output = <p>{`Command not found: ${cmd}. Type 'help' for a list of commands.`}</p>;
    }
    
    newHistory.push(<div key={history.length + 1} className="py-2">{output}</div>);
    setHistory(newHistory);
  }, [history, data, availableCommands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      runCommand(command);
    }
    setCommand('');
  };

  useEffect(() => {
    setShouldStartBoot(true);
  }, []);

  useEffect(() => {
    if (!shouldStartBoot || isBooted) return;

    let isCancelled = false;
    const timeouts: NodeJS.Timeout[] = [];

    const boot = async () => {
      for (const step of bootSequence) {
        if (isCancelled) return;
        
        await new Promise(resolve => {
            const t = setTimeout(resolve, step.delay);
            timeouts.push(t);
        });

        if (isCancelled) return;
        
        setBootingText(prev => {
            if (step.replace) {
                const newText = [...prev];
                newText[newText.length - 1] = step.text;
                return newText;
            }
            return [...prev, step.text];
        });
      }

      if (isCancelled) return;
      
      await new Promise(resolve => {
          const t = setTimeout(resolve, 500);
          timeouts.push(t);
      });

      if (isCancelled) return;
      
      setIsBooted(true);
      setHistory([
        <div key="welcome">
          <p>Type 'help' to see a list of available commands.</p>
        </div>
      ]);
    };

    boot();

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [shouldStartBoot, isBooted, runCommand]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, bootingText]);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className="relative font-code bg-black text-green-400 min-h-screen p-4 overflow-hidden"
      onClick={focusInput}
    >
      <div className="absolute inset-0 bg-black opacity-10 scanlines"></div>
      <div style={{ textShadow: '0 0 5px rgba(50, 205, 50, 0.5)' }}>
        <div ref={terminalRef} className="h-full w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)'}}>
          {!isBooted ? (
            <div>
              {bootingText.map((line, index) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          ) : (
            <div>
              {history.map((item, index) => <div key={index}>{item}</div>)}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center">
                    <span className="text-cyan-400">visitor@resumesprites:~$</span>
                    <div className="ml-2 flex items-center">
                        <span className="text-green-400">{command}</span>
                        <div className="w-2 h-4 bg-green-400 animate-blink"></div>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    id="command-input"
                    type="text"
                    className="absolute inset-0 w-full h-full bg-transparent border-none text-transparent focus:outline-none caret-transparent cursor-text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                />
              </form>
            </div>
          )}
        </div>
        {isBooted && (
          <footer className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-800">
             <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                    <span className="text-yellow-400">Commands:</span>
                    {availableCommands.filter(c => c !== 'clear').map(cmd => (
                    <button key={cmd} onClick={() => runCommand(cmd)} className="hover:underline text-cyan-400">[{cmd}]</button>
                    ))}
                </div>
                <button onClick={() => runCommand('clear')} className="text-destructive hover:underline text-xs">[clear]</button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
