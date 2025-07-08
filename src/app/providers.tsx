"use client";

import type { ReactNode } from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ResumeProvider>
        {children}
        <Toaster />
      </ResumeProvider>
    </AuthProvider>
  );
}
