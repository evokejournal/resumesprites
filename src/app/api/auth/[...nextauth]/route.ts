import NextAuth from 'next-auth';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authConfig } from '@/lib/auth-config';
import { rateLimiters } from '@/lib/rate-limiter';
import { NextRequest } from 'next/server';

const handler = NextAuth({
  ...authConfig,
  providers: [
    {
      id: 'firebase',
      name: 'Firebase',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
          };
        } catch (error) {
          console.error('Firebase auth error:', error);
          return null;
        }
      }
    }
  ],
});

// Rate limiting wrapper for auth endpoints
async function rateLimitedHandler(req: NextRequest, context: any) {
  const rateLimitResult = await rateLimiters.auth(req);
  if (rateLimitResult) {
    return rateLimitResult;
  }
  return handler(req, context);
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST }; 