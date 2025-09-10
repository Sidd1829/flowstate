import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be accessible without authentication
const publicPaths = ['/'];

// Add paths that should always require authentication
const protectedPaths = ['/dashboard', '/companies'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and images
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files like favicon.ico
  ) {
    return NextResponse.next();
  }

  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, we'll let the client-side AuthProvider handle the logic
  // since we're using localStorage and cannot access it from middleware
  // The middleware mainly serves as a documentation of route protection
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // Let the client handle authentication check
    return NextResponse.next();
  }

  // For any other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
