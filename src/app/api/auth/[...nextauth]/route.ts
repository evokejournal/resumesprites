import NextAuth from 'next-auth';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authConfig } from '@/lib/auth-config';

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

export { handler as GET, handler as POST }; 