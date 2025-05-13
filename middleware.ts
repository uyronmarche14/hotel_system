import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const userToken = request.cookies.get('token')?.value || ''
  
  const isUserAuthenticated = Boolean(userToken)
  
  // Get the pathname from the URL
  const { pathname } = request.nextUrl
  console.log('Middleware checking path:', pathname, 'user token:', isUserAuthenticated);
  
  // Define authentication routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password')
  
  // Define protected routes that require user authentication
  const isUserProtectedRoute = 
    pathname === '/profile' || 
    pathname.startsWith('/profile/') || 
    pathname.startsWith('/bookings') || 
    pathname.startsWith('/dashboard')
  
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
    refererUrl.pathname.startsWith('/bookings')
  );
  
  // Redirect to login if accessing a user protected route without a user token
  if (isUserProtectedRoute && !isUserAuthenticated) {
    console.log('Redirecting to login, protected route without user token');
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    // Set a flag in the URL for the client to know this was a redirect
    loginUrl.searchParams.set('session_expired', 'true')
    
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect to dashboard if accessing auth routes with a valid user token
  if (isAuthRoute && isUserAuthenticated) {
    console.log('Redirecting to dashboard, auth route with user token');
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
    '/login',
    '/register',
    '/forgot-password',
  ],
} 
 