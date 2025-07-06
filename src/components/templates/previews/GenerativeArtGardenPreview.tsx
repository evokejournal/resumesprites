
import React from 'react';

export function GenerativeArtGardenPreview() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" rx="6" fill="#111827" />
      
      {/* Sidebar */}
      <rect x="20" y="20" width="80" height="260" rx="4" fill="#1F2937" />
      <rect x="30" y="30" width="60" height="6" rx="3" fill="#E5E7EB" />
      <rect x="30" y="40" width="40" height="4" rx="2" fill="#60A5FA" />
      
      <rect x="30" y="60" width="60" height="4" rx="2" fill="#4B5563" />
      <rect x="30" y="80" width="50" height="12" rx="2" fill="#4ADE80" opacity="0.4" />
      <rect x="30" y="98" width="50" height="12" rx="2" fill="#374151" />

      {/* "Flowers" on canvas */}
      <circle cx="180" cy="100" r="25" fill="#EC4899" opacity="0.6" />
      <circle cx="180" cy="100" r="10" fill="#F472B6" />

      <path d="M220 220 L 200 180 M 220 220 L 240 180 M 220 220 L 220 250" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="180" r="8" fill="#FDE68A" />
      <circle cx="240" cy="180" r="8" fill="#FDE68A" />
      
      <g transform="translate(150, 200) rotate(20)">
        <rect x="-15" y="-15" width="30" height="30" fill="#818CF8" opacity="0.7" />
        <rect x="-10" y="-10" width="20" height="20" fill="#A78BFA" />
      </g>
    </svg>
  );
}

    