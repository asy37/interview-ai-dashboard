import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { mockUsers } from '@/lib/mock-data'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = mockUsers.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar,
          }
        }
        return null
      },
    }),
    // Mock SSO providers
    GoogleProvider({
      clientId: 'mock-google-client-id',
      clientSecret: 'mock-google-client-secret',
    }),
    AzureADProvider({
      clientId: 'mock-azure-client-id',
      clientSecret: 'mock-azure-client-secret',
      tenantId: 'mock-tenant-id',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'mock-secret-key-for-development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
