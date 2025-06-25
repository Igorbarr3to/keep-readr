import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });

                if (!user || !credentials?.password) return null;

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                return { id: user.id, email: user.email };
            }
        })
    ],
session: {
    strategy: 'jwt',
    },
pages: {
    signIn: '/signIn',
    },
callbacks: {
        async session({ session, token }) {
        if (token.sub) {
            session.user.id = token.sub;
        }
        return session;
    },
        async jwt({ token, user }) {
        if (user) {
            token.sub = user.id;
        }
        return token;
    },
}
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };