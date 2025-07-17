import React, { useState, useRef } from 'react';

interface ReceiptRollPasswordScreenProps {
  onSubmit: (password: string) => void;
  error?: string;
  loading?: boolean;
}

export function ReceiptRollPasswordScreen({ onSubmit, error, loading }: ReceiptRollPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit(password);
  };

  return (
    <div className="bg-gray-200 font-code py-12 px-2 flex flex-col items-center min-h-screen text-black">
      <div className="w-full max-w-sm">
        {/* Printer */}
        <div>
          <div className="relative h-20 bg-gray-700 rounded-t-lg shadow-inner p-2">
            <div className="flex justify-center items-center h-full px-4">
              <span className="text-white font-mono text-lg tracking-widest">ENTER PASSWORD</span>
            </div>
          </div>
          <div className="h-6 bg-black rounded-b-md shadow-lg flex items-center p-2">
            <div className="w-full h-1 bg-gray-800 rounded-full"></div>
          </div>
        </div>
        {/* Receipt Paper */}
        <div className="relative -mt-2 w-[94%] mx-auto z-10">
          <div className="w-full text-black shadow-lg bg-[#fdfdf2]">
            <form onSubmit={handleSubmit} className="relative z-10 p-6 flex flex-col items-center gap-4">
              <label htmlFor="receipt-password" className="text-xs font-bold tracking-widest text-center mb-2">PASSWORD REQUIRED</label>
              <input
                id="receipt-password"
                ref={inputRef}
                type="password"
                className="w-full px-3 py-2 border border-gray-400 rounded bg-white font-mono text-base text-center focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-gray-800 text-white font-mono px-6 py-2 rounded shadow hover:bg-black transition disabled:opacity-60"
                disabled={loading || !password}
              >
                {loading ? 'Checking...' : 'Unlock'}
              </button>
              {error && (
                <div className="w-full text-center text-xs text-red-600 bg-red-100 rounded p-2 mt-2">
                  {error}
                </div>
              )}
            </form>
            <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 z-0"></div>
          </div>
          <div
            className="w-full h-4 bg-repeat-x"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;utf8,<svg width=\'20\' height=\'10\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M0 0 L10 10 L20 0 Z\' fill=\'%23fdfdf2\'/></svg>")',
              backgroundSize: '15px 7.5px',
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
            }}
          />
        </div>
      </div>
    </div>
  );
} 