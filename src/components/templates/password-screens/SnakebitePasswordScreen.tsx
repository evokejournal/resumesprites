import React, { useState, useRef } from 'react';

interface SnakebitePasswordScreenProps {
  onSubmit: (password: string) => void;
  error?: string;
  loading?: boolean;
  name?: string;
}

export function SnakebitePasswordScreen({ onSubmit, error, loading, name }: SnakebitePasswordScreenProps) {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit(password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#9bbc0f] font-[Pixelify_Sans,monospace] p-4 pt-20">
      <div className="relative w-full max-w-xs bg-[#8bac0f] border-4 border-[#0f380f] rounded-lg shadow-lg p-6 flex flex-col items-center">
        <h2 className="text-2xl text-[#0f380f] font-bold mb-2 tracking-widest text-center" style={{ fontFamily: 'inherit' }}>
          {name ? `${name}'s Resume` : 'Resume'}
        </h2>
        <p className="text-[#0f380f] text-center mb-4 text-sm tracking-wide" style={{ fontFamily: 'inherit' }}>
          Enter password to unlock my resume
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-3">
          <input
            ref={inputRef}
            type="password"
            className="w-full px-4 py-2 rounded border-2 border-[#0f380f] bg-[#cadc9f] text-[#0f380f] font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-[#8bac0f] font-[inherit] tracking-widest"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            style={{ fontFamily: 'inherit', letterSpacing: '0.1em' }}
          />
          <button
            type="submit"
            className="w-full bg-[#0f380f] text-[#cadc9f] font-bold py-2 rounded mt-2 shadow hover:bg-[#306230] transition disabled:opacity-60 font-[inherit]"
            disabled={loading || !password}
            style={{ fontFamily: 'inherit' }}
          >
            {loading ? 'Checking...' : 'UNLOCK'}
          </button>
          {error && (
            <div className="w-full text-center text-xs text-red-700 bg-red-100 rounded p-2 mt-2 font-[inherit]">
              {error}
            </div>
          )}
        </form>
        {/* Pixel grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(15,56,15,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,56,15,0.08) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }} />
      </div>
    </div>
  );
} 