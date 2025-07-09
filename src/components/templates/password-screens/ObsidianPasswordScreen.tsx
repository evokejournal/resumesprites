'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ObsidianPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

const theme = {
  bg: 'from-zinc-900 to-zinc-800',
  paper: 'bg-zinc-800',
  text: 'text-white',
  mainHeading: 'text-white',
  subHeading: 'text-zinc-400',
  strong: 'text-white',
  accent: 'bg-zinc-700',
  accentText: 'text-white',
  highlight: 'text-amber-400',
  quoteIcon: 'fill-amber-400',
  skillDot: 'bg-zinc-600',
  skillDotEmpty: 'bg-zinc-700',
};

export function ObsidianPasswordScreen({ onSubmit, isSubmitting, error }: ObsidianPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br font-body p-4 sm:p-8", theme.bg, theme.text)}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className={cn("relative w-full backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden", theme.paper)}>
          {/* Header */}
          <header className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mb-6 p-4 rounded-full w-fit bg-zinc-700/50"
            >
              <Lock className="h-12 w-12 text-amber-400" />
            </motion.div>
            
            <motion.h1 
              className={cn("font-archivo text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none mb-4", theme.mainHeading)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              ACCESS REQUIRED
            </motion.h1>
            
            <motion.p 
              className={cn("text-lg", theme.subHeading)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Enter the password to unlock this resume
            </motion.p>
          </header>

          {/* Password form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Password input with accent styling */}
              <div className={cn("rounded-2xl p-6 relative", theme.accent, theme.accentText)}>
                <div className="flex items-center gap-4 mb-4">
                  <ArrowRight className={cn("h-6 w-6", theme.highlight)} />
                  <span className="font-headline text-lg">Authentication</span>
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-amber-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-xl text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-red-400">Authentication failed: {error}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                className="w-full bg-white text-zinc-900 font-bold px-6 py-4 rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting || !password.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-900"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Unlock Resume
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div 
              className="text-center text-zinc-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p>This resume is protected by password authentication</p>
              <p className="mt-1">Enter the correct password to view the full content</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 