import React from 'react';

export function SmsConversationPreview({ name }: { name?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
        <rect width="300" height="300" rx="6" fill="#F3F4F6" />
        
        {/* Phone Body */}
        <rect x="75" y="30" width="150" height="240" rx="15" fill="#1F2937" />
        <rect x="80" y="35" width="140" height="230" rx="10" fill="white" />

        {/* Header */}
        <rect x="80" y="35" width="140" height="25" rx="0" fill="#F9FAFB"/>
        <circle cx="100" cy="47" r="8" fill="#D1D5DB" />
        <rect x="115" y="44" width="60" height="6" rx="3" fill="#D1D5DB" />
        
        {/* Chat Bubbles */}
        <rect x="90" y="70" width="100" height="20" rx="10" fill="#E5E7EB" />
        <rect x="130" y="100" width="80" height="20" rx="10" fill="#3B82F6" />
        <rect x="90" y="130" width="120" height="20" rx="10" fill="#E5E7EB" />

        {/* Typing indicator */}
        <g transform="translate(90, 160)">
          <circle cx="5" cy="10" r="3" fill="#9CA3AF" />
          <circle cx="15" cy="10" r="3" fill="#9CA3AF" />
          <circle cx="25" cy="10" r="3" fill="#9CA3AF" />
        </g>
    </svg>
  );
}
