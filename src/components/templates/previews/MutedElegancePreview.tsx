import React from 'react';

interface MutedElegancePreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function MutedElegancePreview({ theme, name }: MutedElegancePreviewProps) {
  const defaultColors = ['#78716C', '#44403C', '#F5F5F4'];
  const colors = theme?.colors || defaultColors;
  const [primary, accent, background] = colors;
  const displayName = name || 'John Smith';
  
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'serif' }}>
      <rect width="300" height="300" rx="6" fill={background} />
      
      {/* Header */}
      <text x="150" y="50" textAnchor="middle" fontSize="22" fontWeight="500" fill={accent}>{displayName}</text>
      <text x="150" y="70" textAnchor="middle" fontSize="12" fill={primary}>Full-Stack Developer</text>
      
      {/* Section 1 */}
      <text x="30" y="115" fontSize="14" fill={accent}>About Me</text>
      <rect x="30" y="125" width="240" height="1" fill={primary} opacity="0.5" />
      <rect x="30" y="140" width="240" height="3" rx="1.5" fill={primary} opacity="0.8" />
      <rect x="30" y="150" width="240" height="3" rx="1.5" fill={primary} opacity="0.8" />
      <rect x="30" y="160" width="180" height="3" rx="1.5" fill={primary} opacity="0.8" />

      {/* Section 2 */}
      <text x="30" y="200" fontSize="14" fill={accent}>Experience</text>
      <rect x="30" y="210" width="240" height="1" fill={primary} opacity="0.5" />
      <rect x="30" y="225" width="240" height="3" rx="1.5" fill={primary} opacity="0.8" />
      <rect x="30" y="235" width="190" height="3" rx="1.5" fill={primary} opacity="0.8" />

    </svg>
  );
}
