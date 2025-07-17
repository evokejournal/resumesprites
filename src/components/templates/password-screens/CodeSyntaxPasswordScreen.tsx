'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeSyntaxPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export function CodeSyntaxPasswordScreen({ onSubmit, isSubmitting, error }: CodeSyntaxPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="font-code bg-[#1E1E1E] text-white min-h-screen p-4 sm:p-8 relative overflow-hidden">
      {/* Animated background elements similar to the template */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-green-400 font-mono text-xs">// Loading...</div>
        <div className="absolute top-40 right-20 text-purple-400 font-mono text-xs">const resume = await load();</div>
        <div className="absolute bottom-32 left-1/4 text-blue-400 font-mono text-xs">if (authenticated) {`{`}</div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto bg-[#252526] p-6 rounded-lg shadow-2xl border border-gray-700">
        <div className="text-center mb-8 border-b border-gray-700 pb-4">
          <motion.p 
            className="text-gray-400 mt-2 font-code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            // This resume is protected. Enter the password to continue.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Code-style input container */}
            <div className="bg-[#1E1E1E] border border-gray-600 rounded-md p-4 font-code">
              <div className="flex items-center mb-2">
                <span className="text-gray-500 text-sm mr-2">1</span>
                <span className="text-purple-400 text-sm">const</span>
                <span className="text-blue-400 text-sm ml-1">password</span>
                <span className="text-white text-sm">=</span>
                <span className="text-orange-400 text-sm ml-1">prompt</span>
                <span className="text-white text-sm">(</span>
                <span className="text-orange-400 text-sm">'Enter password'</span>
                <span className="text-white text-sm">);</span>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-gray-600 text-white placeholder-gray-400 rounded-md px-4 py-3 font-code focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm mr-2">2</span>
                <span className="text-purple-400 text-sm">if</span>
                <span className="text-white text-sm ml-1">(</span>
                <span className="text-blue-400 text-sm">password</span>
                <span className="text-white text-sm">===</span>
                <span className="text-orange-400 text-sm">'correct'</span>
                <span className="text-white text-sm">) {`{`}</span>
              </div>
            </div>

            {error && (
              <motion.div 
                className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-md font-code text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-red-400">// Error: {error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-code px-6 py-3 rounded-md transition-colors border border-green-500 focus:ring-2 focus:ring-green-400/20 outline-none"
              disabled={isSubmitting || !password.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⟳</span>
                  Checking password...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Access Resume
                </span>
              )}
            </motion.button>

            <div className="text-center text-gray-500 text-sm font-code">
              <span className="text-gray-600">// Click to authenticate and view the resume</span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 