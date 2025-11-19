import NextAuth from '@auth/nextjs'
import CredentialsProvider from '@auth/core/providers/credentials'
import { NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/src/lib/db/db-pg'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) return null
        const email = credentials.email
        const password = credentials.password

        const user = await getUserByEmail(email)
        // If user not found but matches demo env vars, create demo user
        if (!user) {
          if (process.env.DEMO_USER_EMAIL === email && process.env.DEMO_USER_PASSWORD === password) {
            const hashed = bcrypt.hashSync(password, 8)
            const created = await createUser({ email, password_hash: hashed, role: 'user' })
            return { id: created.id, email: created.email, role: created.role }
          }
          return null
        }

        if (!user.password_hash) return null
        const ok = bcrypt.compareSync(password, user.password_hash)
        if (!ok) return null
        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // attach role and id
        // @ts-ignore
        token.role = (user as any).role
        // @ts-ignore
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = session.user || {}
      // @ts-ignore
      session.user.id = token.id
      // @ts-ignore
      session.user.role = token.role
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
