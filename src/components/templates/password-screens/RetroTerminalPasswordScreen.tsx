'use client';

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RetroTerminalPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

const bootSequence = [
  { text: 'Booting ResumeSprites OS v1.3.37...', delay: 200 },
  { text: 'Initializing security protocols...', delay: 400 },
  { text: 'Loading authentication module...', delay: 300 },
  { text: 'Mounting /dev/password...', delay: 400 },
  { text: 'Checking access permissions... [  0%]', delay: 200 },
  { text: 'Checking access permissions... [ 25%]', delay: 300, replace: true },
  { text: 'Checking access permissions... [ 68%]', delay: 400, replace: true },
  { text: 'Checking access permissions... [100%]', delay: 200, replace: true },
  { text: 'Access permissions check... OK', delay: 200, replace: true },
  { text: 'Establishing secure connection...', delay: 500 },
  { text: 'Connection established.', delay: 200 },
  { text: 'Welcome, visitor. Authentication required.', delay: 100 },
];

export function RetroTerminalPasswordScreen({ onSubmit, isSubmitting, error }: RetroTerminalPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [bootingText, setBootingText] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [shouldStartBoot, setShouldStartBoot] = useState(false);

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

      if (!isCancelled) {
        setTimeout(() => setIsBooted(true), 500);
      }
    };

    boot();

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [shouldStartBoot, isBooted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-4 font-mono overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Boot sequence */}
        <AnimatePresence>
          {!isBooted && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-1"
            >
              {bootingText.map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm"
                >
                  {text}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password prompt */}
        <AnimatePresence>
          {isBooted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="border border-green-400 p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-green-400 mb-2">ACCESS DENIED</h1>
                  <p className="text-green-300 text-sm">{'>'} Authentication required to view resume data</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                                     <div className="flex items-center space-x-2">
                     <span className="text-green-400">visitor@resumesprites:~$</span>
                     <input
                       type="password"
                       placeholder="Enter password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="flex-1 bg-black border-none text-green-400 placeholder-green-600 px-2 py-1 font-mono focus:outline-none"
                       autoComplete="new-password"
                       autoFocus
                     />
                   </div>

                   {error && (
                     <motion.div 
                       className="text-red-400 text-sm"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.2 }}
                     >
                       {'>'} Error: {error}
                     </motion.div>
                   )}

                   <div className="flex items-center space-x-2">
                     <span className="text-green-400">visitor@resumesprites:~$</span>
                     <button
                       type="submit"
                       className="bg-green-400 text-black font-mono px-4 py-1 border border-green-400 hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                       disabled={isSubmitting || !password.trim()}
                     >
                       {isSubmitting ? 'authenticating...' : 'authenticate'}
                     </button>
                   </div>
                </form>

                                 <div className="mt-6 text-green-300 text-xs">
                   <p>{'>'} Type 'help' for available commands</p>
                   <p>{'>'} Use TAB for command completion</p>
                   <p>{'>'} Press ENTER to submit</p>
                 </div>
              </div>

              <div className="text-green-600 text-xs">
                <p>ResumeSprites Terminal v1.3.37 - (c) 2024 ResumeSprites Inc.</p>
                <p>Type 'help' for more information.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 