import { SignJWT, jwtVerify } from 'jose'
import { getEnvVar } from '../utils'

const JWT_SECRET = new TextEncoder().encode(getEnvVar('JWT_SECRET'))

export async function generateOptOutToken(
  userId: string,
  email: string
): Promise<string> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5d') // 5 days expiration
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function verifyOptOutToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      valid: true,
      userId: payload.userId as string,
      email: payload.email as string
    }
  } catch (error) {
    console.error('Error verifying opt-out token', error)
    return { valid: false, userId: null, email: null }
  }
}
