
import React from 'react';

export function OperationPreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" rx="6" fill="#A7F3D0" />
      
      {/* Board */}
      <rect x="50" y="50" width="200" height="200" rx="10" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="4" />
      
      {/* Patient outline */}
      <path d="M150 80 C 100 80, 80 120, 90 160 C 95 190, 95 220, 125 240 C 150 250, 175 250, 200 240 C 225 220, 225 190, 210 160 C 220 120, 200 80, 150 80 Z" fill="#FDBA74" />
      
      {/* Buzzer */}
      <circle cx="80" cy="80" r="15" fill="#DC2626" />
      <circle cx="80" cy="80" r="12" fill="#F87171" />
      
      {/* Organs */}
      <path d="M145 110 L 155 110 L 150 120 Z" fill="#EF4444" /> {/* Heart */}
      <rect x="160" y="140" width="15" height="10" rx="3" fill="#60A5FA" /> {/* Brain-like */}
      
      {/* Tweezers */}
      <line x1="210" y1="90" x2="170" y2="120" stroke="#71717A" strokeWidth="3" />
      <line x1="210" y1="95" x2="175" y2="120" stroke="#71717A" strokeWidth="3" />
      
      {/* Title */}
      <text x="150" y="40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#B91C1C">
        Operation: Management
      </text>
    </svg>
  );
}
