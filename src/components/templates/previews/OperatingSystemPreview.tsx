import React from 'react';

export function OperatingSystemPreview() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: '"MS Sans Serif", "Tahoma", sans-serif' }}>
      {/* Desktop Background */}
      <rect width="300" height="300" rx="6" fill="#008080" />
      
      {/* Taskbar */}
      <rect y="272" width="300" height="28" fill="#C0C0C0" />
      <rect y="272" width="300" height="2" fill="white" />
      <rect x="2" y="274" width="60" height="22" fill="#C0C0C0" />
      <path d="M 2 274 H 62 V 296 H 2 V 274 M 4 276 V 294 H 60 V 276 H 4 Z" fill="white" />
      <path d="M 4 294 H 60 L 60 276 L 62 274 V 296 H 2 V 294 Z" fill="#808080" />
      <text x="12" y="290" fill="black" fontSize="12" fontWeight="bold">Start</text>

      {/* Desktop Icon 1 */}
      <rect x="20" y="20" width="32" height="32" fill="white" />
      <rect x="22" y="22" width="28" height="28" fill="#4F4F4F" />
      <text x="12" y="65" fill="white" fontSize="10">AboutMe.txt</text>

      {/* Desktop Icon 2 */}
      <rect x="20" y="80" width="32" height="32" fill="#FFC90E" />
      <rect x="18" y="84" width="36" height="28" fill="#FFC90E" />
      <text x="22" y="125" fill="white" fontSize="10">Portfolio</text>
      
      {/* Window */}
      <rect x="70" y="60" width="200" height="150" fill="#C0C0C0" />
      <path d="M 70 60 H 270 V 210 H 70 V 60 M 72 62 V 208 H 268 V 62 H 72 Z" fill="white" />
      <path d="M 72 208 H 268 L 268 62 L 270 60 V 210 H 70 V 208 Z" fill="#808080" />
      <rect x="72" y="62" width="196" height="18" fill="#000080" />
      <text x="78" y="75" fill="white" fontSize="10" fontWeight="bold">C:\RESUME\experience.txt</text>
      <rect x="252" y="64" width="14" height="14" fill="#C0C0C0" />
      <text x="256" y="74" fill="black" fontSize="10" fontWeight="bold">X</text>

      <text x="80" y="95" fill="black" fontSize="10" fontWeight="bold">Senior Developer @ Tech Inc.</text>
      <text x="80" y="108" fill="black" fontSize="10">- Led the front-end team...</text>
      <text x="80" y="121" fill="black" fontSize="10">- Mentored junior developers...</text>
      <text x="80" y="134" fill="black" fontSize="10">- Improved perf by 30%.</text>
    </svg>
  );
}
