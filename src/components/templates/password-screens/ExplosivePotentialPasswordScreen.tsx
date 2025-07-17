'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Bomb } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExplosivePotentialPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
  name?: string;
}

export function ExplosivePotentialPasswordScreen({ onSubmit, isSubmitting, error, name }: ExplosivePotentialPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="font-win-sans bg-[#008080] h-svh p-4 text-black">
      <div className="h-full flex flex-col items-center justify-start pt-8">
        {/* Main Window */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-win-gray p-2 border-2 border-outset w-full max-w-md"
        >
          {/* Window Title Bar */}
          <div className="bg-win-blue text-white p-1 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bomb className="w-4 h-4" />
              <span className="font-bold">{name ? `${name}'s Resume` : 'Resume'}</span>
            </div>
            <div className="flex gap-1">
              <button className="w-4 h-4 bg-win-gray border border-outset active:border-inset flex items-center justify-center text-xs">_</button>
              <button className="w-4 h-4 bg-win-gray border border-outset active:border-inset flex items-center justify-center text-xs">□</button>
              <button className="w-4 h-4 bg-win-gray border border-outset active:border-inset flex items-center justify-center text-xs">×</button>
            </div>
          </div>

          {/* Window Content */}
          <div className="bg-white p-4 border-2 border-inset">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-win-gray border-2 border-outset mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-lg font-bold mb-2">Secure Access Required</h2>
              <p className="text-sm text-gray-600">
                This resume is password protected.<br />
                Enter the password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-bold mb-2">
                  Password:
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-black px-3 py-2 font-win-sans text-black placeholder-gray-500 focus:outline-none"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-red-100 border-2 border-inset p-3 text-red-800 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    {error}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="bg-win-gray border-2 border-outset active:border-inset px-4 py-1 font-win-sans text-black"
                  onClick={() => setPassword('')}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-win-gray border-2 border-outset active:border-inset px-4 py-1 font-win-sans text-black disabled:opacity-50"
                  disabled={isSubmitting || !password.trim()}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-3 h-3 border border-black border-t-transparent rounded-full"></div>
                      Checking...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Continue
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 