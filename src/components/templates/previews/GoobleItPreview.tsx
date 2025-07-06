import React from 'react';

interface YoublePreviewProps {
    name?: string;
}

export function YoublePreview({ name }: YoublePreviewProps) {
  const displayName = name || 'John Smith';
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" rx="6" fill="white" />
      {/* Logo */}
      <text x="100" y="80" fontSize="24" fontFamily="Space Grotesk, sans-serif" fontWeight="bold">
        <tspan fill="#EA4335">Y</tspan>
        <tspan fill="#4285F4">o</tspan>
        <tspan fill="#34A853">u</tspan>
        <tspan fill="#FBBC05">b</tspan>
        <tspan fill="#EA4335">l</tspan>
        <tspan fill="#4285F4">e</tspan>
      </text>
      {/* Search bar */}
      <rect x="50" y="120" width="200" height="30" rx="15" stroke="#DFE1E5" fill="white" />
      <text x="65" y="140" fontSize="10" fill="#70757A">{displayName}</text>
      {/* Search results */}
      <text x="50" y="180" fontSize="12" fill="#1A0DAB">{displayName} - Full-Stack Developer</text>
      <text x="50" y="195" fontSize="8" fill="#006621">{`youble.com/${displayName.toLowerCase().replace(' ', '-')}`}</text>
      <rect x="50" y="205" width="200" height="3" rx="1.5" fill="#70757A" />
      <rect x="50" y="212" width="180" height="3" rx="1.5" fill="#70757A" />
    </svg>
  );
}
