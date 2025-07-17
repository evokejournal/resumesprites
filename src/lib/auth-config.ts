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
      console.log('JWT callback:', { tokenId: token.id, userId: user?.id });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback:', { tokenId: token.id, sessionUserId: session.user?.id });
      if (token && session.user) {
        const extendedSession = session as ExtendedSession;
        extendedSession.user.id = token.id as string;
      }
      return session as ExtendedSession;
    },
  },
}; 