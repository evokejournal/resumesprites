"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const pageTitles: { [key: string]: string } = {
  '/builder': 'Builder',
  '/templates': 'Templates',
  '/preview': 'Live Preview',
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
  '/subscribe': 'Subscribe',
  '/suggest-template': 'Suggest a Template'
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getPageTitle = (path: string): string => {
    const mainPath = Object.keys(pageTitles).find(p => path.startsWith(p));
    return mainPath ? pageTitles[mainPath] : '';
  }

  const pageTitle = getPageTitle(pathname);
  const isPreviewPage = pathname.startsWith('/preview');

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        {/* This header is only visible on mobile and contains the trigger to open the sidebar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold text-lg">{pageTitle}</span>
          {user && (
            <div className="ml-auto flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                <AvatarFallback className="text-xs">
                  {user.name ? getUserInitials(user.name) : user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.name || user.email?.split('@')[0]}
              </span>
            </div>
          )}
        </header>

        {/* This div makes the content area scrollable */}
        <div className={cn(
          "flex-1 overflow-y-auto relative",
          !isPreviewPage && "p-4 sm:p-6 lg:p-8"
        )}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
