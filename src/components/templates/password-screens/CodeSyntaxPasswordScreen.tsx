'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRecaptcha } from '@/hooks/use-recaptcha';

interface CodeSyntaxPasswordScreenProps {
  onSubmit: (password: string, recaptchaToken?: string) => void;
  error?: string;
  loading?: boolean;
  name?: string;
}

export function CodeSyntaxPasswordScreen({ onSubmit, error, loading, name }: CodeSyntaxPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { execute: executeRecaptcha } = useRecaptcha();

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      try {
        const recaptchaToken = await executeRecaptcha();
        onSubmit(password, recaptchaToken);
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        onSubmit(password); // Fallback without reCAPTCHA
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-black border border-green-400 p-6 rounded-none">
          <div className="mb-4">
            <div className="text-green-400 text-sm mb-2">
              <span className="text-red-400">$</span> cat resume_access.txt
            </div>
            <div className="text-green-400 text-xs">
              {name ? `Resume for: ${name}` : 'Resume Access Required'}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-green-400 text-sm mb-2">
              <span className="text-red-400">$</span> sudo unlock_resume
            </div>
            <div className="text-green-400 text-xs mb-2">
              [sudo] password for user:
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="password"
                  className="bg-black text-green-400 border-none outline-none flex-1 font-mono text-sm"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
                <span 
                  className={`text-green-400 font-mono text-sm ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transition: 'opacity 0.1s' }}
                >
                  |
                </span>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-400 text-black font-mono text-sm py-2 px-4 rounded-none hover:bg-green-300 transition disabled:opacity-50"
                disabled={loading || !password}
              >
                {loading ? 'Authenticating...' : 'Enter'}
              </button>
            </form>
          </div>
          
          {error && (
            <div className="text-red-400 text-xs bg-red-900 p-2 border border-red-400">
              <div className="font-bold">ERROR:</div>
              <div>{error}</div>
            </div>
          )}
          
          <div className="text-green-400 text-xs mt-4">
            <div className="text-red-400">$</div>
            <div>Access granted: resume unlocked</div>
          </div>
        </div>
      </div>
    </div>
  );
} 