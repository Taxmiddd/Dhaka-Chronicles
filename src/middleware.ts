import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export const runtime = 'experimental-edge';

export async function middleware(request: NextRequest) {
  // Update the session and get the base response
  const response = await updateSession(request);
  
  // Get user from the refreshed session
  // Note: we can't easily get the user role in middleware without an extra DB query
  // For now, we just check for a valid session. Role-based checks happen in the Layouts.
  const hasSession = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token');
  
  const isStudioRoute = request.nextUrl.pathname.startsWith("/studio");
  const isLoginRoute = request.nextUrl.pathname === "/login";

  if (isStudioRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return Response.redirect(url);
  }

  if (isLoginRoute && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/studio";
    return Response.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
