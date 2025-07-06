import React from 'react';

interface ExtremelyProfessionalPreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function ExtremelyProfessionalPreview({ theme, name }: ExtremelyProfessionalPreviewProps) {
  const defaultColors = ['#475569', '#1E293B', '#F8FAFC'];
  const colors = theme?.colors || defaultColors;
  const [primary, accent, background] = colors;
  const isDark = parseInt(background.substring(1, 3), 16) < 128;
  const paperBg = isDark ? '#171717' : '#F8FAFC';
  const textColor = isDark ? '#F9FAFB' : '#1E293B';
  const mutedTextColor = isDark ? '#A1A1AA' : '#94A3B8';
  const displayName = name || 'John Smith';
  
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'serif' }}>
      <rect width="300" height="300" rx="6" fill={background} />
      <rect x="25" y="25" width="250" height="250" rx="4" fill={paperBg} />
      
      {/* Header */}
      <text x="150" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill={accent}>{displayName}</text>
      <text x="150" y="65" textAnchor="middle" fontSize="10" fill={primary}>Job Title</text>
      <rect x="40" y="80" width="220" height="2" rx="1" fill={isDark ? '#3f3f46' : '#E2E8F0'} />

      {/* Left Column */}
      <rect x="40" y="95" width="70" height="165" fill={paperBg} />
      <rect x="50" y="105" width="50" height="5" rx="2.5" fill={primary} />
      <rect x="50" y="120" width="40" height="3" rx="1.5" fill={mutedTextColor} />
      <rect x="50" y="130" width="40" height="3" rx="1.5" fill={mutedTextColor} />
      <rect x="50" y="155" width="50" height="5" rx="2.5" fill={primary} />
      <rect x="50" y="170" width="40" height="3" rx="1.5" fill={mutedTextColor} />
      
      {/* Right Column */}
      <rect x="120" y="95" width="140" height="165" fill={paperBg} />
      <rect x="130" y="105" width="80" height="6" rx="3" fill={primary} />
      <rect x="130" y="120" width="120" height="4" rx="2" fill={mutedTextColor} />
      <rect x="130" y="130" width="120" height="4" rx="2" fill={mutedTextColor} />
      <rect x="130" y="150" width="80" height="6" rx="3" fill={primary} />
      <rect x="130" y="165" width="120" height="4" rx="2" fill={mutedTextColor} />
      <rect x="130" y="175" width="100" height="4" rx="2" fill={mutedTextColor} />
    </svg>
  );
}
