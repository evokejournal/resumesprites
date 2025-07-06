import React from 'react';

export function MineHirePreview({ name }: { name?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: '"MS Sans Serif", "Tahoma", sans-serif' }}>
        <rect width="300" height="300" rx="6" fill="#C0C0C0" />
        
        {/* Main Panel */}
        <rect x="50" y="50" width="200" height="200" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
        <path d="M50 50 H 250 V 250 H 50Z" stroke="white" strokeWidth="2" />

        {/* Header */}
        <rect x="60" y="60" width="180" height="30" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
        <path d="M60 60 H 240 V 90 H 60Z" stroke="white" strokeWidth="1" />
        <text x="142" y="80" fontSize="18">🙂</text>
        <rect x="70" y="65" width="30" height="20" fill="black" />
        <rect x="200" y="65" width="30" height="20" fill="black" />
        
        {/* Grid */}
        <rect x="60" y="100" width="180" height="140" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
        <g>
            <rect x="70" y="110" width="20" height="20" fill="#C0C0C0" stroke="white" strokeWidth="1" />
            <rect x="95" y="110" width="20" height="20" fill="#C0C0C0" stroke="white" strokeWidth="1" />
            <text x="101" y="125" fill="#1d4ed8" fontWeight="bold">1</text>
            <rect x="120" y="110" width="20" height="20" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
            
            <rect x="70" y="135" width="20" height="20" fill="#C0C0C0" stroke="white" strokeWidth="1" />
            <rect x="95" y="135" width="20" height="20" fill="#C0C0C0" stroke="white" strokeWidth="1" />
            <path d="M100 148 V 138 L 102 140 L 104 138 L 106 140 L 108 138 V 145" stroke="#ef4444" strokeWidth="1.5"/>
            
            <rect x="120" y="135" width="20" height="20" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
             <text x="126" y="150" fill="#15803d" fontWeight="bold">2</text>
        </g>
    </svg>
  );
}
