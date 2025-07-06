import React from 'react';

export function CodeSyntaxPreview({ name }: { name?: string }) {
  const displayName = name || 'Alex Doe';

  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'monospace' }}>
      <rect width="300" height="300" rx="6" fill="#1E1E1E" />
      <rect x="25" y="25" width="250" height="250" rx="4" fill="#252526" />
      
      <text x="150" y="70" textAnchor="middle" fontSize="24" fill="#4ADE80" style={{ fontFamily: '"Pixelify Sans", monospace' }}>
        Hello, World!
      </text>

      <text x="40" y="110" fill="#C792EA">const</text>
      <text x="90" y="110" fill="#82AAFF">candidate</text>
      <text x="170" y="110" fill="white">=</text>
      <text x="185" y="110" fill="white">{'{'}</text>
      
      <text x="55" y="130" fill="#C3E88D">about:</text>
      <text x="105" y="130" fill="white">{'{ ... }'}</text>

      <text x="55" y="150" fill="#C3E88D">getExperience()</text>
      <text x="170" y="150" fill="white">{'{'}</text>

      <rect x="70" y="165" width="160" height="3" rx="1.5" fill="#545454" />
      <rect x="70" y="175" width="160" height="3" rx="1.5" fill="#545454" />

      <text x="170" y="195" fill="white">{'}'}</text>
      
      <text x="40" y="215" fill="white">{'}'};</text>
    </svg>
  );
}
