import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/db-pg';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'email@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await getUserByEmail(credentials.email);
                if (!user || !user.password_hash) return null;
                const valid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );
                if (!valid) return null;
                return {
                    id: String(user.id),
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
    },
});

export { handler as GET, handler as POST };
