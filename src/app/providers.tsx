"use client";

import type { ReactNode } from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ResumeProvider>
      {children}
      <Toaster />
    </ResumeProvider>
  );
}
