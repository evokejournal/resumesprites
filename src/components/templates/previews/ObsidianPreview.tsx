import React from 'react';

interface ObsidianPreviewProps {
  theme?: { colors: string[] };
  name?: string;
}

export function ObsidianPreview({ theme, name }: ObsidianPreviewProps) {
  const defaultColors = ['#FBBF24', '#374151', '#E5E7EB'];
  const colors = theme?.colors || defaultColors;
  const [primary, accent, background] = colors;
  const isDark = parseInt(background.substring(1, 3), 16) < 128;
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const mutedTextColor = isDark ? '#D1D5DB' : '#6B7280';
  const paperBg = isDark ? 'rgba(0,0,0,0.5)' : 'white';
  const displayName = name || 'John Smith';
  const [firstName, ...lastName] = displayName.split(' ');

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
        <rect width="300" height="300" rx="6" fill={background} />
        <rect x="40" y="25" width="250" height="250" rx="12" fill={paperBg} />
        
        {/* Vertical Text */}
        <text x="10" y="255" fontSize="24" fontWeight="800" fill={textColor} transform="rotate(-90 22 255)" textAnchor="middle">RESUME</text>

        {/* Image */}
        <rect x="55" y="45" width="70" height="88" rx="8" fill={mutedTextColor} />
        
        {/* Name */}
        <text x="140" y="65" fontSize="24" fontWeight="800" fill={textColor}>{firstName.toUpperCase()}</text>
        <text x="140" y="90" fontSize="24" fontWeight="800" fill={textColor}>{lastName.join(' ').toUpperCase()}</text>
        
        {/* Contact Bar */}
        <rect x="140" y="105" width="130" height="28" rx="8" fill={accent} />
        <text x="148" y="123" fontSize="10" fill={isDark ? "black" : "white"} fontWeight="bold">CONTACT</text>

        {/* Left Col Content */}
        <rect x="55" y="145" width="80" height="70" rx="8" fill={accent} />
        <text x="63" y="160" fontSize="8" fill={isDark ? "black" : "white"}>A passionate...</text>
        <text x="63" y="170" fill={isDark ? "black" : "white"} fontSize="8">Full-Stack Dev...</text>

        <text x="55" y="235" fontSize="10" fontWeight="bold" fill={textColor}>Skills</text>
        <circle cx="110" cy="232" r="3" fill={accent} />
        <circle cx="118" cy="232" r="3" fill={accent} />
        <circle cx="126" cy="232" r="3" fill={mutedTextColor} />

        {/* Right Col Content */}
        <text x="145" y="155" fontSize="10" fontWeight="bold" fill={textColor}>Experience</text>
        <text x="145" y="168" fontSize="8" fill={mutedTextColor}>Senior Dev @ Tech Inc.</text>
        <text x="145" y="178" fontSize="8" fill={mutedTextColor}>2020 - Present</text>

        <text x="145" y="200" fontSize="10" fontWeight="bold" fill={textColor}>Education</text>
        <text x="145" y="213" fontSize="8" fill={mutedTextColor}>B.S. Computer Science</text>
        <text x="145" y="223" fontSize="8" fill={mutedTextColor}>State University</text>
    </svg>
  );
}
