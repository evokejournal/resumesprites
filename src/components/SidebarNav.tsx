
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { LayoutGrid, FileText, Link as LinkIcon, LogOut, Eye, Sparkles, Settings, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useResume } from '@/context/ResumeContext';

export function SidebarNav() {
  const pathname = usePathname();
  const { resumeData } = useResume();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const previewHref = isMounted ? `/preview/${resumeData.template}` : '#';

  const menuItems = [
    { href: '/builder', label: 'Builder', icon: <LayoutGrid /> },
    { href: '/templates', label: 'Templates', icon: <FileText /> },
    { href: previewHref, label: 'Live Preview', icon: <Eye /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LinkIcon /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  const subscribeItem = { href: '/subscribe', label: 'Purchase for Life!' };
  const suggestItem = { href: '/suggest-template', label: 'Suggest a Template!' };

  return (
    <>
      <SidebarHeader className="hidden md:flex">
        <Link href="/" className="flex items-center gap-1 pl-2">
          <h1 className="text-2xl font-headline font-semibold flex items-baseline">
            <span>Resume</span><span className="font-pixelify text-3xl font-semibold text-primary">Sprites</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={item.label === 'Live Preview' ? pathname.startsWith('/preview') : pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href} className={item.href === '#' ? 'pointer-events-none' : ''}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(subscribeItem.href)}
              tooltip={{ children: subscribeItem.label, side: 'right' }}
              className="bg-gradient-to-t from-yellow-400 to-orange-500 text-white font-bold hover:opacity-95 justify-center text-base"
              size="lg"
            >
              <Link href={subscribeItem.href}>
                <Sparkles className="h-5 w-5" />
                <span>{subscribeItem.label}</span>
                <Sparkles className="h-5 w-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(suggestItem.href)}
              tooltip={{ children: suggestItem.label, side: 'right' }}
              variant="outline"
              className="justify-center text-base"
              size="lg"
            >
              <Link href={suggestItem.href}>
                <Lightbulb className="h-5 w-5" />
                <span>{suggestItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="profile picture" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Alex Doe</span>
              <span className="text-xs text-muted-foreground">alex.doe@example.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
