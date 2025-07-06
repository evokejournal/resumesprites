
import React from 'react';

export function SnakebiteResumePreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: '"Pixelify Sans", monospace' }}>
      <rect width="300" height="300" rx="6" fill="#9bbc0f" />
      <rect x="30" y="30" width="240" height="240" fill="#8bac0f" stroke="#3f6212" strokeOpacity="0.3" strokeWidth="4" />
      
      {/* Faint Resume Text */}
      <text x="40" y="60" fontSize="10" fill="#3f6212" opacity="0.3">{displayName}</text>
      <text x="40" y="75" fontSize="8" fill="#3f6212" opacity="0.3">Senior Developer</text>
      <rect x="40" y="90" width="220" height="3" fill="#3f6212" opacity="0.2" />
      <rect x="40" y="100" width="220" height="3" fill="#3f6212" opacity="0.2" />
      <rect x="40" y="110" width="180" height="3" fill="#3f6212" opacity="0.2" />
      
      {/* Snake */}
      <rect x="100" y="140" width="12" height="12" fill="#0f380f" />
      <rect x="112" y="140" width="12" height="12" fill="#0f380f" />
      <rect x="124" y="140" width="12" height="12" fill="#0f380f" />
      <rect x="136" y="140" width="12" height="12" fill="#0f380f" />
      <rect x="148" y="140" width="12" height="12" fill="#0f380f" />
      
      {/* Food */}
      <rect x="200" y="140" width="12" height="12" rx="6" fill="#0f380f" />
    </svg>
  );
}
