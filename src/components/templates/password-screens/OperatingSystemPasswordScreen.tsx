'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface OperatingSystemPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export function OperatingSystemPasswordScreen({ onSubmit, isSubmitting, error }: OperatingSystemPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="font-win-sans antialiased bg-[#008080] min-h-screen overflow-hidden text-black">
      {/* Desktop background */}
      <div className="absolute inset-0 bg-[#008080]"></div>
      
      {/* Password dialog window */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-4 border-[#888] shadow-lg max-w-md w-full"
        >
          {/* Window title bar */}
          <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-bold">Password Required</span>
            </div>
            <div className="flex gap-1">
              <button className="w-4 h-4 bg-[#C0C0C0] border-2 border-outset flex items-center justify-center text-black text-xs font-bold">
                _
              </button>
              <button className="w-4 h-4 bg-[#C0C0C0] border-2 border-outset flex items-center justify-center text-black text-xs font-bold">
                □
              </button>
              <button className="w-4 h-4 bg-[#C0C0C0] border-2 border-outset flex items-center justify-center text-black text-xs font-bold">
                ×
              </button>
            </div>
          </div>

          {/* Window content */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#C0C0C0] border-2 border-inset flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#000080]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#000080]">Authentication Required</h2>
                <p className="text-sm text-gray-600">Please enter the password to view this resume.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-bold mb-2">Password:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-[#888] px-3 py-2 bg-white focus:border-[#000080] outline-none"
                    autoComplete="off"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#000080]"
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
                  className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Error: {error}
                </motion.div>
              )}

              {/* Button bar */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#C0C0C0] border-2 border-outset hover:border-inset transition-all text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C0C0C0] border-2 border-outset hover:border-inset transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !password.trim()}
                >
                  {isSubmitting ? 'Checking...' : 'OK'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-[#C0C0C0] border-t-2 border-white flex items-center px-1 z-[1000]">
        <button className="h-full px-2 flex items-center gap-1 bg-[#C0C0C0] border-2 border-outset">
          <div className="w-6 h-6 bg-[#008080] flex items-center justify-center">
            <div className="w-4 h-4 bg-white"></div>
          </div>
          <b className="text-sm">Start</b>
        </button>
        <div className="flex-1"></div>
        <div className="h-full px-2 flex items-center text-sm border-2 border-inset">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
} 