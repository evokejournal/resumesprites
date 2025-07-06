import React from 'react';

export function LemonadeStandPreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="300" height="300" rx="6" fill="#FEF3C7" />
      <circle cx="50" cy="50" r="100" fill="#FDE68A" />
      <circle cx="280" cy="280" r="80" fill="#FCD34D" />

      {/* Lemonade Stand */}
      <rect x="70" y="150" width="160" height="10" fill="#A16207" />
      <rect x="75" y="160" width="150" height="80" fill="#FBE6A7" stroke="#CA8A04" strokeWidth="2" />
      <rect x="85" y="130" width="10" height="30" fill="#CA8A04" />
      <rect x="205" y="130" width="10" height="30" fill="#CA8A04" />
      <rect x="75" y="120" width="150" height="10" fill="#A16207" />
      <text x="150" y="110" textAnchor="middle" fontSize="12" fill="white" stroke="black" strokeWidth="0.5" fontWeight="bold">LEMONADE</text>

      {/* Glass of Lemonade */}
      <path d="M120 180 L 130 220 H 170 L 180 180 Z" fill="#FEF9C3" stroke="#FBBF24" strokeWidth="2" />
      
      {/* Lemon Slice */}
      <circle cx="175" cy="175" r="15" fill="#FACC15" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="175" cy="175" r="12" fill="#FEF08A" />

      {/* Main Text */}
      <text x="150" y="50" textAnchor="middle" fontSize="14" fill="#854D0E" fontWeight="bold">When Life Gives You Lemons...</text>
      <text x="150" y="70" textAnchor="middle" fontSize="10" fill="#A16207">{`You Hire ${displayName}`}</text>
    </svg>
  );
}
