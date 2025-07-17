'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmsConversationPasswordScreenProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export function SmsConversationPasswordScreen({ onSubmit, isSubmitting, error }: SmsConversationPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center p-4">
      <div className="w-full max-w-md mt-16">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center relative">
            <Lock className="w-7 h-7 text-gray-500" />
            <span className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900 leading-tight">Password Protected</div>
            <div className="text-gray-600 text-sm">Please enter the password to continue.</div>
          </div>
        </div>

        {/* Chat bubble for password entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-5 mb-4 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-12 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                autoComplete="off"
                autoFocus
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Checking...' : 'Access Resume'}
            </button>
          </form>
        </motion.div>

        {/* Error bubble */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-100 text-red-700 rounded-2xl rounded-bl-none px-4 py-3 mb-2 shadow-sm"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
} 