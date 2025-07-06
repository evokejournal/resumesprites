import React from 'react';

export function ForTaxPurposesPreview({ name }: { name?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'monospace' }}>
        {/* Background */}
        <rect width="300" height="300" rx="6" fill="#E5E7EB" />

        {/* Printer Body */}
        <rect x="50" y="40" width="200" height="60" rx="5" fill="#4B5563" />
        <rect x="60" y="50" width="180" height="40" rx="3" fill="#374151" />
        
        {/* Printer Mouth */}
        <rect x="70" y="90" width="160" height="15" fill="#1F2937" />
        
        {/* Print Button */}
        <rect x="205" y="55" width="30" height="15" rx="2" fill="#DC2626" />
        <text x="220" y="65" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">PRINT</text>

        {/* Receipt Paper */}
        <path d="M80 100 H 220 V 270 L 215 265 L 210 270 L 205 265 L 200 270 L 195 265 L 190 270 L 185 265 L 180 270 L 175 265 L 170 270 L 165 265 L 160 270 L 155 265 L 150 270 L 145 265 L 140 270 L 135 265 L 130 270 L 125 265 L 120 270 L 115 265 L 110 270 L 105 265 L 100 270 L 95 265 L 90 270 L 85 265 L 80 270 V 100 Z" fill="#fdfdf2" />
        
        {/* Receipt Content */}
        <text x="150" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="black">LINKSTONE.</text>
        <text x="150" y="130" textAnchor="middle" fontSize="6" fill="black">*****************</text>
        <text x="90" y="145" fontSize="6" fill="black">EXPERIENCE</text>
        <text x="210" y="145" textAnchor="end" fontSize="6" fill="black">100.00</text>
        <text x="90" y="160" fontSize="6" fill="black">SKILLS</text>
        <text x="210" y="160" textAnchor="end" fontSize="6" fill="black">95.00</text>
        <text x="150" y="175" textAnchor="middle" fontSize="6" fill="black">*****************</text>
        <text x="90" y="190" fontSize="7" fontWeight="bold" fill="black">TOTAL</text>
        <text x="210" y="190" textAnchor="end" fontSize="7" fontWeight="bold" fill="black">HIRE ME</text>
    </svg>
  );
}
