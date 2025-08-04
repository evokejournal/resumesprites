"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { isAdminUser } from '@/lib/admin-config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Check if site is locked
  const isSiteLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    
    // If site is locked and user is not admin, redirect to home
    if (!loading && user && isSiteLocked && !isAdminUser(user)) {
      router.push('/?locked=true');
    }
  }, [user, loading, router, isSiteLocked]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 