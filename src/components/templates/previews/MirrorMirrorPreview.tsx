import React from 'react';

export function MirrorMirrorPreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';

  const RightHalf = () => (
    <g transform="translate(150, 0)">
      <text x="0" y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill="black">{displayName}</text>
      <text x="0" y="70" textAnchor="middle" fontSize="10" fill="#4B5563">Full-Stack Developer</text>
      
      <text x="0" y="110" textAnchor="middle" fontSize="14" fontWeight="bold" fill="black">Experience</text>
      <text x="0" y="130" textAnchor="middle" fontSize="10" fill="#1F2937">Senior Developer</text>
      <text x="0" y="142" textAnchor="middle" fontSize="8" fill="#6B7280">Tech Solutions Inc.</text>

      <text x="0" y="170" textAnchor="middle" fontSize="14" fontWeight="bold" fill="black">Skills</text>
      <rect x="-60" y="180" width="45" height="15" rx="7.5" fill="#E5E7EB" />
      <rect x="-10" y="180" width="45" height="15" rx="7.5" fill="#E5E7EB" />
      <rect x="40" y="180" width="45" height="15" rx="7.5" fill="#E5E7EB" />
    </g>
  );

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'serif' }}>
      <rect width="300" height="300" rx="6" fill="white" />
      
      {/* Mirrored Left Side */}
      <g transform="scale(-1, 1) translate(-300, 0)">
        <RightHalf />
      </g>
      
      {/* Normal Right Side */}
      <RightHalf />
    </svg>
  );
}
