import React from 'react';

export function DigitalDashboardPreview() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: '#f5f7fa', borderRadius: 12 }}>
      <rect x="0" y="0" width="320" height="180" rx="12" fill="#f5f7fa" />
      {/* Profile Card */}
      <rect x="18" y="18" width="60" height="80" rx="10" fill="#fff" stroke="#d1d5db" strokeWidth="2" />
      <circle cx="48" cy="38" r="14" fill="#dbeafe" />
      <rect x="30" y="60" width="36" height="8" rx="2" fill="#dbeafe" />
      {/* Experience Card */}
      <rect x="90" y="18" width="210" height="36" rx="10" fill="#fff" stroke="#d1d5db" strokeWidth="2" />
      <rect x="100" y="28" width="60" height="8" rx="2" fill="#60a5fa" />
      <rect x="170" y="28" width="60" height="8" rx="2" fill="#dbeafe" />
      {/* Skills Card */}
      <rect x="18" y="110" width="60" height="52" rx="10" fill="#fff" stroke="#d1d5db" strokeWidth="2" />
      <rect x="28" y="120" width="40" height="6" rx="2" fill="#60a5fa" />
      <rect x="28" y="132" width="30" height="6" rx="2" fill="#dbeafe" />
      {/* Education Card */}
      <rect x="90" y="62" width="210" height="100" rx="10" fill="#fff" stroke="#d1d5db" strokeWidth="2" />
      <rect x="100" y="75" width="60" height="8" rx="2" fill="#60a5fa" />
      <rect x="170" y="75" width="60" height="8" rx="2" fill="#dbeafe" />
      <rect x="100" y="90" width="120" height="8" rx="2" fill="#dbeafe" />
      {/* Dashboard Title */}
      <text x="160" y="170" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="#60a5fa">Dashboard</text>
    </svg>
  );
} 