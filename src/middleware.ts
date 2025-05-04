import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/signin" || path === "/signup" || path === "/";

  // Get both tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // If accessing protected route without tokens
  if (!isPublicPath && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If accessing auth pages with valid tokens
  if (isPublicPath && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/tickets/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};
