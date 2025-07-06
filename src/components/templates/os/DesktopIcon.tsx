"use client";

import React from 'react';

interface DesktopIconProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onDoubleClick: () => void;
}

export function DesktopIcon({ label, Icon, onDoubleClick }: DesktopIconProps) {
  return (
    <button
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center w-24 h-24 p-2 text-white text-center text-sm focus:bg-blue-800/50 focus:outline-none rounded-sm"
    >
      <Icon className="w-10 h-10" />
      <span className="mt-1 leading-tight">{label}</span>
    </button>
  );
}
