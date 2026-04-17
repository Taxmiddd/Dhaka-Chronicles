import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const session = request.cookies.get("dc_session");
  const isStudioRoute = request.nextUrl.pathname.startsWith("/studio");

  if (isStudioRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already logged in and try to visit login page, go to studio
  if (request.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/studio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/login"],
};
