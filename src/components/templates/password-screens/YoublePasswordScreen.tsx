'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface YoublePasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

const YoubleLogo = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="text-4xl font-bold">
      <span className="text-[#4285F4]">Y</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">u</span>
      <span className="text-[#4285F4]">b</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </div>
  </div>
);

export function YoublePasswordScreen({ onSubmit, isSubmitting, error }: YoublePasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="bg-white min-h-screen p-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <YoubleLogo />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mx-auto mb-4 p-3 bg-[#4285F4]/10 rounded-full w-fit"
            >
              <Lock className="h-8 w-8 text-[#4285F4]" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-[#4285F4] mb-2">
              Password Required
            </h1>
            <p className="text-gray-600">
              This resume is protected. Please enter the password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Password input styled like Google search */}
            <div className="relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-full focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 outline-none transition-all"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4285F4] transition-colors"
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
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Authentication failed: {error}</span>
                </div>
              </motion.div>
            )}

            {/* Submit button styled like Google search button */}
            <motion.button
              type="submit"
              className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting || !password.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Access Resume
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div 
            className="text-center text-gray-500 text-sm mt-6 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p>This resume is protected by password authentication</p>
            <p className="mt-1">Contact the candidate for access credentials</p>
          </motion.div>
        </motion.div>

        {/* Bottom links like Google */}
        <motion.div 
          className="text-center text-gray-500 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>ResumeSprites - Professional Resume Platform</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 