import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get session from cookies
  const session = request.cookies.get('galaxy_kiro_session')
  
  // Parse URL parameters for attribution
  const searchParams = request.nextUrl.searchParams
  const campaign = searchParams.get('c')
  const medium = searchParams.get('m')
  const partner = searchParams.get('p')
  
  // Store attribution data in response headers
  const response = NextResponse.next()
  
  if (campaign || medium || partner) {
    response.headers.set('X-Campaign', campaign || '')
    response.headers.set('X-Medium', medium || '')
    response.headers.set('X-Partner', partner || '')
  }

  // Protected routes
  const protectedPaths = ['/soft-member', '/admin']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !session) {
    // Redirect to login with return URL
    const url = new URL('/login', request.url)
    url.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && session) {
    try {
      const sessionData = JSON.parse(session.value)
      if (sessionData.role !== 'admin') {
        // Redirect non-admins to soft member dashboard
        return NextResponse.redirect(new URL('/soft-member/dashboard', request.url))
      }
    } catch (error) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Soft member routes
  if (pathname.startsWith('/soft-member') && session) {
    try {
      const sessionData = JSON.parse(session.value)
      
      // Check if user is pending approval
      if (sessionData.status === 'pending_approval' && pathname !== '/approval-pending') {
        return NextResponse.redirect(new URL('/approval-pending', request.url))
      }
      
      // Check if hot lead is required for certain routes
      if (pathname === '/soft-member/network' && sessionData.status !== 'hot_lead') {
        return NextResponse.redirect(new URL('/soft-member/dashboard', request.url))
      }
    } catch (error) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}