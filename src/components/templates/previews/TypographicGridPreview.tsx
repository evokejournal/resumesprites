import React from 'react';

interface TypographicGridPreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function TypographicGridPreview({ name }: { name?: string }) {
  const colors = ['#000000', '#4A4A4A', '#FDFBF5'];
  const [primary, accent, background] = colors;
  const displayName = name || 'Jane Doe';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'serif' }}>
      <rect width="300" height="300" rx="6" fill={background} />

      {/* Left Gutter */}
      <text x="25" y="50" fontSize="18" fontWeight="bold" fill={primary}>about me</text>
      <rect x="25" y="60" width="50" height="8" rx="2" fill={primary} />
      <text x="25" y="80" fontSize="8" fill={accent}>{displayName}</text>
      <text x="25" y="90" fontSize="8" fill={accent}>Job Title</text>

      {/* Main Grid */}
      <g>
        <text x="110" y="50" fontSize="18" fontWeight="bold" fill={primary}>work expe-</text>
        <text x="110" y="68" fontSize="18" fontWeight="bold" fill={primary}>rience</text>
        <rect x="110" y="78" width="80" height="8" rx="2" fill={primary} />
      </g>
      <g>
        <text x="110" y="150" fontSize="18" fontWeight="bold" fill={primary}>portfolio</text>
        <rect x="110" y="160" width="80" height="8" rx="2" fill={primary} />
      </g>
      <g>
        <text x="210" y="110" fontSize="18" fontWeight="bold" fill={primary}>education</text>
        <rect x="210" y="120" width="80" height="8" rx="2" fill={primary} />
      </g>
       <g>
        <text x="210" y="210" fontSize="18" fontWeight="bold" fill={primary}>skills</text>
        <rect x="210" y="220" width="80" height="8" rx="2" fill={primary} />
      </g>

    </svg>
  );
}
