"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';
import { cn } from '@/lib/utils';

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

  const getPageTitle = (path: string): string => {
    const mainPath = Object.keys(pageTitles).find(p => path.startsWith(p));
    return mainPath ? pageTitles[mainPath] : '';
  }

  const pageTitle = getPageTitle(pathname);
  const isPreviewPage = pathname.startsWith('/preview');

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
        </header>

        {/* This div makes the content area scrollable */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          !isPreviewPage && "p-4 sm:p-6 lg:p-8"
        )}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
