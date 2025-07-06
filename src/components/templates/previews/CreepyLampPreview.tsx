import React from 'react';

export function CreepyLampPreview() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" rx="6" fill="black" />
      
      {/* Lamp */}
      <path d="M120 40 L 180 40 L 190 80 L 110 80 Z" fill="#4A5568" />
      <rect x="148" y="20" width="4" height="20" fill="#2D3748" />

      {/* Pull Chain */}
      <rect x="175" y="80" width="2" height="20" fill="#A0AEC0" />
      <circle cx="176" cy="102" r="4" fill="#A0AEC0" />

      {/* Light cone */}
      <path d="M150 80 L 80 300 L 220 300 Z" fill="url(#lightGradient)" />
      
      <defs>
        <radialGradient id="lightGradient" cx="0.5" cy="0.1" r="0.9">
          <stop offset="0%" stopColor="#F7E6C4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F7E6C4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Faded Text */}
      <rect x="100" y="150" width="100" height="8" fill="#F7E6C4" opacity="0.1" />
      <rect x="100" y="165" width="80" height="4" fill="#F7E6C4" opacity="0.1" />
      <rect x="100" y="190" width="100" height="4" fill="#F7E6C4" opacity="0.05" />
      <rect x="100" y="200" width="100" height="4" fill="#F7E6C4" opacity="0.05" />
    </svg>
  );
}
