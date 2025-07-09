"use client";

import React from 'react';

interface FullScreenPreviewProps {
  children: React.ReactNode;
}

export function FullScreenPreview({ children }: FullScreenPreviewProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 