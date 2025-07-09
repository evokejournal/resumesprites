'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface PeachPitPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export function PeachPitPasswordScreen({ onSubmit, isSubmitting, error }: PeachPitPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-orange-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto mb-6 p-4 bg-orange-100 rounded-full w-fit"
            >
              <Lock className="h-8 w-8 text-orange-600" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold text-orange-800 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Password Required
            </motion.h1>
            
            <motion.p 
              className="text-orange-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Enter the password to view this resume
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-orange-200 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
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
                <span>Authentication failed: {error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  View Resume
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div 
            className="text-center text-orange-500 text-sm mt-6 pt-4 border-t border-orange-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <p>This resume is protected by password authentication</p>
            <p className="mt-1">Please contact the candidate for the password</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 