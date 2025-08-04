import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAdmin } from '@/lib/admin-config';

// Routes that should remain accessible when site is locked
const PUBLIC_ROUTES = [
  '/',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/[...nextauth]',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/email-logo.png',
];

// Check if the site should be locked (you can control this via environment variable)
const isSiteLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If site is not locked, allow all traffic
  if (!isSiteLocked) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes that are needed for the hero page
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    // Check if user is admin for API routes
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (isAdmin(token?.email)) {
        return NextResponse.next();
      }
    } catch (error) {
      // If token check fails, block access
    }
    
    // Return site locked response for non-admin API requests
    return NextResponse.json(
      { error: 'Site is currently locked for Kickstarter campaign' },
      { status: 403 }
    );
  }

  // For all other routes, redirect to hero page with locked message
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set('locked', 'true');
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (HMR for webpack)
     * - _next/web-vitals (web vitals)
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|_next/web-vitals).*)',
  ],
}; 