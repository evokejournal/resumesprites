import React from 'react';

export function RetroTerminalPreview() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'monospace' }}>
      <rect width="300" height="300" rx="6" fill="#0D0D0D" />
      <text x="20" y="40" fill="#32CD32" fontSize="12">
        Booting Linkstone OS...
      </text>
      <text x="20" y="60" fill="#32CD32" fontSize="12">
        Welcome, visitor.
      </text>
      <text x="20" y="90" fill="#32CD32" fontSize="12">
        Type 'help' for commands.
      </text>
      <text x="20" y="120" fill="#87D3F8" fontSize="12">
        visitor@linkstone:~$ <tspan fill="#32CD32">experience</tspan>
      </text>
      <text x="20" y="145" fill="#FBBF24" fontSize="12" fontWeight="bold">
        &gt; Senior Developer @ Tech Inc.
      </text>
      <text x="30" y="165" fill="#32CD32" fontSize="12">
        - Led the team...
      </text>
      <text x="30" y="180" fill="#32CD32" fontSize="12">
        - Mentored juniors...
      </text>
      <text x="20" y="210" fill="#87D3F8" fontSize="12">
        visitor@linkstone:~$ <tspan fill="#32CD32" className="animate-blink">█</tspan>
      </text>
      <style>
        {`.animate-blink { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}
      </style>
    </svg>
  );
}
