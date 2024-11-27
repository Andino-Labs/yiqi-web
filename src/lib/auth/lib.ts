import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from '../prisma'
import { Google } from 'arctic'

export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + '/api/auth/google/callback'
)

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'andino-auth-cookie',
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  }
})
