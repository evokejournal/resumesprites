import React from 'react';

export function ExplosivePotentialPreview({ name }: { name?: string }) {
  const displayName = name || 'John Smith';
  const jobTitle = 'Full-Stack Dev';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: '"MS Sans Serif", "Tahoma", sans-serif' }}>
        <rect width="300" height="300" rx="6" fill="#008080" />
        
        {/* Game Panel on the left */}
        <g transform="translate(25, 70)">
            <rect x="0" y="0" width="110" height="160" fill="#C0C0C0" />
            <path d="M 0 0 H 110 V 160 H 0 Z" stroke="white" strokeWidth="2" />
            <path d="M 2 158 H 108 V 2 H 2 Z" stroke="#808080" strokeWidth="2" />

            {/* Header */}
            <g transform="translate(5, 5)">
                <rect x="0" y="0" width="100" height="25" fill="#C0C0C0" />
                <path d="M 0 0 H 100 V 25 H 0 Z" stroke="#808080" strokeWidth="1.5" />
                <path d="M 1.5 1.5 V 23.5 H 98.5 V 1.5 Z" stroke="white" strokeWidth="1.5" />
                
                <text x="42" y="20" fontSize="16">🙂</text>
                <rect x="5" y="5" width="20" height="15" fill="black" />
                <rect x="75" y="5" width="20" height="15" fill="black" />
            </g>
            
            {/* Grid */}
            <g transform="translate(5, 35)">
                <rect x="0" y="0" width="100" height="120" fill="#C0C0C0" />
                <path d="M 0 0 H 100 V 120 H 0 Z" stroke="#808080" strokeWidth="1.5" />
                <path d="M 1.5 1.5 V 118.5 H 98.5 V 1.5 Z" stroke="white" strokeWidth="1.5" />

                {/* Simplified grid tiles */}
                <rect x="5" y="5" width="15" height="15" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5" />
                <text x="9" y="16" fill="#1d4ed8" fontWeight="bold" fontSize="10">1</text>
                
                <rect x="25" y="5" width="15" height="15" fill="#C0C0C0" strokeWidth="1" strokeLinejoin="miter" stroke="white" />
                <path d="M 25 20 H 40 V 5" stroke="#808080" strokeWidth="1" />
                
                <rect x="5" y="25" width="15" height="15" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5" />
                <circle cx="12.5" cy="32.5" r="4" fill="black" />
            </g>
        </g>
        
        {/* Content Panel on the right */}
        <g transform="translate(150, 70)">
            <rect x="0" y="0" width="125" height="120" fill="#C0C0C0" />
            <path d="M 0 0 H 125 V 120 H 0 Z" stroke="white" strokeWidth="2" />
            <path d="M 2 118 H 123 V 2 H 2 Z" stroke="#808080" strokeWidth="2" />

            <g transform="translate(5, 5)">
                <rect x="0" y="0" width="115" height="110" fill="white" />
                <path d="M 0 0 H 115 V 110 H 0 Z" stroke="#808080" strokeWidth="1.5" />
                <path d="M 1.5 1.5 V 108.5 H 113.5 V 1.5 Z" stroke="white" strokeWidth="1.5" />
                
                <text x="57.5" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="black">{displayName}</text>
                <text x="57.5" y="40" textAnchor="middle" fontSize="9" fill="black">{jobTitle}</text>
                
                <rect x="10" y="50" width="95" height="1" fill="#C0C0C0" />
                
                <text x="10" y="65" fontSize="9" fontWeight="bold" fill="black">Experience</text>
                <text x="10" y="78" fontSize="8" fill="black">Senior Dev @ Tech Inc</text>
            </g>
        </g>
    </svg>
  );
}
