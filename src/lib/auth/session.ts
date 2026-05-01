import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { SessionUser } from '@/types'

const SECRET_KEY = process.env.AUTH_SECRET!
const encodedKey = new TextEncoder().encode(SECRET_KEY)
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// ---- Encrypt / Decrypt ----

export async function encrypt(payload: SessionUser & { expiresAt: Date }) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(
  token: string | undefined
): Promise<(SessionUser & { expiresAt: Date }) | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionUser & { expiresAt: Date }
  } catch {
    return null
  }
}

// ---- Session CRUD ----

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const token = await encrypt({ ...user, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('dc_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('dc_session')?.value
  const payload = await decrypt(token)
  if (!payload) return null
  const { expiresAt, ...user } = payload
  if (new Date(expiresAt) < new Date()) {
    await deleteSession()
    return null
  }
  return user
}

export async function updateSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('dc_session')?.value
  const payload = await decrypt(token)
  if (!payload) return null

  const { expiresAt: _old, ...user } = payload
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const newToken = await encrypt({ ...user, expiresAt })

  cookieStore.set('dc_session', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('dc_session')
}
