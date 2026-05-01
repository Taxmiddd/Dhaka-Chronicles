import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

// Paths that require authentication
const ADMIN_PATHS = ['/admin']

// Paths accessible only when NOT logged in
const AUTH_ONLY_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken = request.cookies.get('dc_session')?.value
  const session = await decrypt(sessionToken)
  const isAuthenticated = !!session

  // Redirect authenticated users away from auth pages
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Protect admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Refresh session on each request
  const response = NextResponse.next()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}
