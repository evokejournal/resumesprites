'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModernPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export function ModernPasswordScreen({ onSubmit, isSubmitting, error }: ModernPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="font-body bg-gradient-to-br from-slate-50 to-slate-100 text-neutral-800 min-h-screen p-4 sm:p-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-teal-400 font-mono text-xs">// Secure Access</div>
        <div className="absolute top-40 right-20 text-teal-400 font-mono text-xs">// Protected Content</div>
        <div className="absolute bottom-32 left-1/4 text-teal-400 font-mono text-xs">// Authentication Required</div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-2xl border border-slate-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-teal-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-headline font-bold text-teal-600 mb-2"
            >
              Secure Access
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-neutral-500 text-sm"
            >
              This resume is password protected. Please enter the password to continue.
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-neutral-800 placeholder-neutral-400 rounded-lg px-4 py-3 font-body focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-teal-600 transition-colors"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  {error}
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-teal-500/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting || !password.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Access Resume
                </span>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-slate-200 text-center"
          >
            <p className="text-xs text-neutral-400">
              Your data is protected with industry-standard encryption
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 