import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || ''
  const isTokenPresent = Boolean(token)
  
  // Get the pathname from the URL
  const { pathname } = request.nextUrl
  console.log('Middleware checking path:', pathname, 'token present:', isTokenPresent);
  
  // Define authentication routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password')
  
  // Define protected routes that require authentication
  const isProtectedRoute = 
    pathname === '/profile' || 
    pathname.startsWith('/profile/') || 
    pathname.startsWith('/bookings') || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin')
  
  // Check for the special navigation header that indicates navigation via back button
  const isBackNavigation = request.headers.get('Sec-Fetch-Dest') === 'document' &&
    request.headers.get('Sec-Fetch-Mode') === 'navigate' &&
    request.headers.get('Sec-Fetch-Site') === 'same-origin';
  
  // Get the referer to check where the navigation is coming from
  const referer = request.headers.get('referer') || '';
  const refererUrl = referer ? new URL(referer) : null;
  const isComingFromProtectedRoute = refererUrl && (
    refererUrl.pathname.startsWith('/dashboard') ||
    refererUrl.pathname.startsWith('/profile') ||
    refererUrl.pathname.startsWith('/bookings') ||
    refererUrl.pathname.startsWith('/admin')
  );
  
  // Redirect to login if accessing a protected route without a token
  if (isProtectedRoute && !isTokenPresent) {
    console.log('Redirecting to login, protected route without token');
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    // Set a flag in the URL for the client to know this was a redirect
    loginUrl.searchParams.set('session_expired', 'true')
    
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect to dashboard if accessing auth routes with a valid token
  if (isAuthRoute && isTokenPresent) {
    console.log('Redirecting to dashboard, auth route with token');
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // For normal navigation, just proceed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all authenticated and protected routes
    '/profile',
    '/profile/:path*',
    '/bookings/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
} 
 