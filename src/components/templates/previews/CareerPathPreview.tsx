import React from 'react';

interface CareerPathPreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function CareerPathPreview({ name }: CareerPathPreviewProps) {
  const colors = ['#94A3B8', '#3B82F6', '#F1F5F9'];
  const [primary, accent, background] = colors;
  const isDark = parseInt(background.substring(1, 3), 16) < 128; // Simple check if background is dark
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const mutedTextColor = isDark ? '#94A3B8' : '#475569';
  const displayName = name || 'John Smith';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
      <rect width="300" height="300" rx="6" fill={background} />
      
      {/* Header */}
      <text x="30" y="50" fontSize="18" fontWeight="bold" fill={textColor}>{displayName}</text>
      <text x="30" y="68" fontSize="12" fill={mutedTextColor}>Full-Stack Developer</text>
      
      {/* Timeline */}
      <rect x="40" y="150" width="220" height="1" rx="0.5" fill={primary} />
      <g>
        <circle cx="70" cy="150" r="8" fill={background} stroke={primary} strokeWidth="2" />
        <text x="60" y="170" fontSize="8" fill={mutedTextColor}>About</text>
      </g>
      <g>
        <circle cx="120" cy="150" r="10" fill={background} stroke={textColor} strokeWidth="2" />
        <text x="105" y="170" fontSize="8" fill={textColor}>Experience</text>
      </g>
      <g>
        <circle cx="170" cy="150" r="8" fill={background} stroke={primary} strokeWidth="2" />
        <text x="160" y="170" fontSize="8" fill={mutedTextColor}>Skills</text>
      </g>
      <g>
        <circle cx="220" cy="150" r="8" fill={background} stroke={primary} strokeWidth="2" />
        <text x="208" y="170" fontSize="8" fill={mutedTextColor}>Portfolio</text>
      </g>

      {/* Content Card */}
      <rect x="50" y="190" width="200" height="85" rx="8" fill={isDark ? "rgba(255,255,255,0.1)" : "white"} />
      <text x="65" y="210" fontSize="12" fontWeight="bold" fill={accent}>Senior Developer</text>
      <text x="65" y="225" fontSize="10" fill={mutedTextColor}>Tech Solutions Inc.</text>
      <rect x="65" y="235" width="170" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.2)" : "#E2E8F0"} />
      <rect x="65" y="245" width="170" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.2)" : "#E2E8F0"} />
      <rect x="65" y="255" width="140" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.2)" : "#E2E8F0"} />
    </svg>
  );
}
