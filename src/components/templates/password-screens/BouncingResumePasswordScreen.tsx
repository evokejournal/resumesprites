import React, { useState, useRef } from 'react';
import { useRecaptcha } from '@/hooks/use-recaptcha';

interface BouncingResumePasswordScreenProps {
  onSubmit: (password: string, recaptchaToken?: string) => void;
  error?: string;
  loading?: boolean;
  name?: string;
}

export function BouncingResumePasswordScreen({ onSubmit, error, loading, name }: BouncingResumePasswordScreenProps) {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { execute: executeRecaptcha } = useRecaptcha();

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

  const colors = [
    '#FFFFFF', // White
    '#FFFF00', // Yellow
    '#FF0000', // Red
    '#0000FF', // Blue
    '#00FF00', // Green
    '#800080', // Purple
    '#FFA500', // Orange
    '#00FFFF', // Cyan
    '#FF69B4', // Pink
    '#A9A9A9', // Gray
  ];

  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // Change color every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % colors.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black font-orbitron p-4 pt-20">
      <div className="relative w-full max-w-xs bg-black border-2 border-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <h2 
          className="text-2xl text-white font-bold mb-2 tracking-widest text-center font-bungee" 
          style={{ 
            fontFamily: 'Bungee, cursive',
            fontStyle: 'italic',
            color: colors[currentColorIndex],
            transition: 'color 0.3s ease-in-out'
          }}
        >
          {name ? `${name.toUpperCase()}` : 'RESUME'}
        </h2>
        <p className="text-white text-center mb-4 text-sm tracking-wide font-orbitron">
          Enter password to unlock my resume
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-3">
          <input
            ref={inputRef}
            type="password"
            className="w-full px-4 py-2 rounded border-2 border-white bg-black text-white font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-white font-orbitron tracking-widest"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="off"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              letterSpacing: '0.1em',
              color: colors[currentColorIndex],
              transition: 'color 0.3s ease-in-out'
            }}
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-2 rounded mt-2 shadow hover:bg-gray-200 transition disabled:opacity-60 font-orbitron"
            disabled={loading || !password}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {loading ? 'Checking...' : 'UNLOCK'}
          </button>
          {error && (
            <div className="w-full text-center text-xs text-red-400 bg-red-900 rounded p-2 mt-2 font-orbitron">
              {error}
            </div>
          )}
        </form>
        
        {/* Bouncing logo animation */}
        <div className="mt-6 relative w-32 h-16">
          <div
            className="absolute animate-bounce"
            style={{
              color: colors[currentColorIndex],
              transition: 'color 0.3s ease-in-out',
              animationDuration: '2s',
              animationIterationCount: 'infinite'
            }}
          >
            <svg
              viewBox="0 0 200 100"
              width="128"
              height="64"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="100"
                y="35"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className="font-bungee"
                fontStyle="italic"
              >
                {name ? name.split(' ')[0].toUpperCase() : 'RESUME'}
              </text>
              <text
                x="100"
                y="60"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className="font-bungee"
                fontStyle="italic"
              >
                {name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ').toUpperCase() : 'UNLOCK'}
              </text>

              <g transform="translate(0, 48)">
                <path
                  d="M 50, 25
                     C 60, 10, 140, 10, 150, 25
                     L 150, 25
                     C 140, 40, 60, 40, 50, 25 Z"
                />
                <text
                  x="100"
                  y="27"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="black"
                  className="font-orbitron"
                >
                  RESUME
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 