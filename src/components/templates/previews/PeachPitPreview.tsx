import React from 'react';

interface PeachPitPreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function PeachPitPreview({ name }: { name?: string }) {
  const colors = ['#FA8072', '#3D3D3D', '#FFF8F5'];
  const [primary, accent, background] = colors;
  const displayName = name || 'Patricia Smith';
  
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
      <rect width="300" height="300" rx="6" fill={background} />
      
      {/* Header */}
      <rect y="0" width="300" height="100" fill={primary} />
      <text x="30" y="60" fontSize="32" fill={accent} fontWeight="100">Hello.</text>
      
      <rect x="160" y="30" width="110" height="4" rx="2" fill={accent} opacity="0.7" />
      <rect x="160" y="40" width="110" height="4" rx="2" fill={accent} opacity="0.7" />
      <rect x="160" y="50" width="80" height="4" rx="2" fill={accent} opacity="0.7" />

      {/* Body */}
      <text x="30" y="140" fontSize="14" fontWeight="bold" fill={accent}>{`I'm ${displayName}.`}</text>
      
      {/* Sections */}
      <g>
        <rect x="30" y="170" width="70" height="12" fill={primary} />
        <text x="35" y="179" fontSize="6" fill={accent} fontWeight="bold">EXPERIENCE</text>
        <rect x="30" y="190" width="100" height="3" rx="1.5" fill={accent} opacity="0.3" />
        <rect x="30" y="200" width="110" height="3" rx="1.5" fill={accent} opacity="0.3" />
      </g>
      
      <g>
        <rect x="160" y="170" width="60" height="12" fill={primary} />
        <text x="165" y="179"fontSize="6" fill={accent} fontWeight="bold">EDUCATION</text>
        <rect x="160" y="190" width="100" height="3" rx="1.5" fill={accent} opacity="0.3" />
        <rect x="160" y="200" width="90" height="3" rx="1.5" fill={accent} opacity="0.3" />
      </g>
    </svg>
  );
}
