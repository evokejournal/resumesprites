import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { User } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

// Extend the Session type to include the user id
interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Auth configuration that automatically handles different environments
export const authConfig: Partial<NextAuthOptions> = {
  // Automatically determine the NextAuth URL based on environment
  url: process.env.NODE_ENV === 'production'
    ? process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL || 'http://localhost:9002',
  
  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: 'jwt' as const,
  },
  
  pages: {
    signIn: '/auth',
  },
  
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}; 