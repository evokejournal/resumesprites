import React from 'react';

export function BouncingResumePreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';
  const [firstName, ...lastNameParts] = displayName.split(' ');
  const lastName = lastNameParts.join(' ');


  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" rx="6" fill="black" />
      
      {/* Centered text (represents revealed content) */}
      <text x="150" y="130" textAnchor="middle" fontSize="14" fill="#ff0000" fontWeight="bold" style={{fontFamily: 'Orbitron, sans-serif'}}>{displayName}</text>
      <text x="150" y="150" textAnchor="middle" fontSize="10" fill="#00ff00" style={{fontFamily: 'Orbitron, sans-serif'}}>Senior Developer</text>
      
      {/* Bouncing Logo */}
      <g transform="translate(180, 50) scale(0.6)">
         <text
            x="100"
            y="35"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            className="font-bungee"
            fill="#00ffff"
            fontStyle="italic"
        >
            {firstName.toUpperCase()}
        </text>
        <text
            x="100"
            y="60"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            className="font-bungee"
            fill="#00ffff"
            fontStyle="italic"
        >
            {lastName.toUpperCase()}
        </text>

        <g transform="translate(0, 48)">
            <path
                d="M 50, 25 C 60, 10, 140, 10, 150, 25 L 150, 25 C 140, 40, 60, 40, 50, 25 Z"
                fill="#00ffff"
            />
            <text
                x="100"
                y="27"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="bold"
                fill="black"
                className="font-orbitron"
            >
                RESUME
            </text>
        </g>
      </g>
    </svg>
  );
}
