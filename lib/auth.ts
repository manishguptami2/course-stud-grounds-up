import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

// Validate required environment variables
const nextAuthSecret = process.env.NEXTAUTH_SECRET
const nextAuthUrl = process.env.NEXTAUTH_URL

if (!nextAuthSecret) {
  console.error('❌ NEXTAUTH_SECRET is not set in environment variables!')
  console.error('Please add NEXTAUTH_SECRET to AWS Amplify environment variables.')
}

if (!nextAuthUrl) {
  console.error('❌ NEXTAUTH_URL is not set in environment variables!')
  console.error('Please add NEXTAUTH_URL to AWS Amplify environment variables.')
}

if (!nextAuthSecret || !nextAuthUrl) {
  console.error('Current environment variables:')
  console.error('NEXTAUTH_SECRET:', nextAuthSecret ? '✅ Set' : '❌ Missing')
  console.error('NEXTAUTH_URL:', nextAuthUrl ? `✅ Set (${nextAuthUrl})` : '❌ Missing')
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret || 'fallback-secret-change-in-production',
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

