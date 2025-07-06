import React from 'react';

interface ScarletTimelinePreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function ScarletTimelinePreview({ theme, name }: ScarletTimelinePreviewProps) {
  const defaultColors = ['#A41F24', '#000000', '#F3EEE1'];
  const colors = theme?.colors || defaultColors;
  const [primary, accent, background] = colors;
  const textColor = accent;
  const mutedTextColor = primary;
  const displayName = name || 'John Smith';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Background */}
      <rect width="300" height="300" rx="6" fill={background} />
      
      {/* Central Strip (offset left) */}
      <rect x="110" y="0" width="80" height="300" fill={primary} />

      {/* Header */}
      <text x="20" y="40" fontSize="14" fontWeight="bold" fill={textColor}>{displayName}</text>
      <text x="20" y="55" fontSize="10" fill={mutedTextColor}>Job Title</text>

      {/* Right side content */}
      <rect x="200" y="80" width="70" height="8" fill={primary} />
      <text x="200" y="100" fontSize="10" fontWeight="bold" fill={textColor}>Experience</text>
      <text x="200" y="112" fontSize="8" fill={mutedTextColor}>Senior Dev...</text>

      {/* Left side content */}
      <g textAnchor="end">
        <rect x="20" y="150" width="80" height="8" fill={primary} />
        <text x="100" y="170" fontSize="10" fontWeight="bold" fill={textColor}>Education</text>
        <text x="100" y="182" fontSize="8" fill={mutedTextColor}>State University...</text>
      </g>
      
      {/* Right side content 2 */}
      <rect x="200" y="220" width="50" height="8" fill={primary} />
      <text x="200" y="240" fontSize="10" fontWeight="bold" fill={textColor}>Skills</text>
      <text x="200" y="252" fontSize="8" fill={mutedTextColor}>React, Node...</text>

    </svg>
  );
}
