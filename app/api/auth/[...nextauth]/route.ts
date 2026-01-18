import { MOCK_USER } from '@/constants';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { userService } from '../../../../lib/postgres-database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Nexus Account',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Try database authentication first
          const user = await userService.getByEmail(credentials.email);

          if (user && user.password) {
            const isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (isValidPassword) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                phone: user.phone,
              };
            }
          }
        } catch (error) {
          console.error('Database auth error:', error);
        }

        // Fallback to mock user for development
        if (
          credentials.email === MOCK_USER.email &&
          credentials.password === MOCK_USER.password
        ) {
          return {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            email: MOCK_USER.email,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in database
          let dbUser = await userService.getByEmail(user.email!);

          if (!dbUser) {
            // Create new user from Google OAuth
            dbUser = await userService.create({
              email: user.email!,
              name: user.name!,
              image: user.image,
              provider: 'google',
            });
          }

          // Update user object with database info
          user.id = dbUser.id;
          (user as any).phone = dbUser.phone;
        } catch (error) {
          console.error('Google OAuth user creation error:', error);
          // Allow sign in even if database operation fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
