import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth-config';
import { rateLimiters } from '@/lib/rate-limiter';
import { NextRequest } from 'next/server';

const handler = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'text' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password,
          isSignUp: credentials?.isSignUp,
          name: credentials?.name 
        });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const isSignUp = credentials.isSignUp === 'true';
        const name = credentials.name;

        console.log('Processing auth request:', { isSignUp, name });

        try {
          // Use our API routes for authentication
          const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
          
          const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              name: name,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Authentication failed');
          }

          const userData = await response.json();
          
          console.log('Auth successful:', { 
            id: userData.id, 
            email: userData.email 
          });
          
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    }
  ],
});

// Rate limiting wrapper for auth endpoints
async function rateLimitedHandler(req: NextRequest, context: any) {
  // Temporarily disable rate limiting for debugging
  // const rateLimitResult = await rateLimiters.auth(req);
  // if (rateLimitResult) {
  //   return rateLimitResult;
  // }
  return handler(req, context);
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST }; 