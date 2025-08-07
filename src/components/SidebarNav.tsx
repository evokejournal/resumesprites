
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
import { LayoutGrid, FileText, Link as LinkIcon, LogOut, Eye, Sparkles, Settings, Lightbulb, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/admin-config';

export function SidebarNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/');
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { href: '/builder', label: 'Builder', icon: <LayoutGrid /> },
    { href: '/templates', label: 'Templates', icon: <FileText /> },
    { href: '/dashboard', label: 'Link Dashboard', icon: <LinkIcon /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  const subscribeItem = { href: '/subscribe', label: 'Upgrade to Pro' };
  const suggestItem = { href: '/suggest-template', label: 'Suggest Template' };

  // Add admin menu item if user is admin
  const isAdmin = isAdminUser(user) || user?.email === 'berostwo@gmail.com';
  if (isAdmin) {
    menuItems.push({ href: '/admin', label: 'Admin', icon: <Shield /> });
  }

  if (!isMounted) {
    return null;
  }

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
              <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
              <AvatarFallback>
                {user?.name ? getUserInitials(user.name) : user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
