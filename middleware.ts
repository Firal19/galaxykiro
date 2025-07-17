import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { applySecurityHeaders, applyCorsHeaders, rateLimit } from './src/lib/security'

// Initialize Supabase client for middleware
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
  localeDetection: true
})

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // If missing locale, let next-intl handle the redirect
  if (pathnameIsMissingLocale) {
    return intlMiddleware(request)
  }

  // Extract locale from pathname
  const locale = pathname.split('/')[1] as string
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    return intlMiddleware(request)
  }

  const response = NextResponse.next()
  
  // Add locale to headers for use in components
  response.headers.set('x-locale', locale)
  
  // Get session from request cookies
  const sessionCookie = request.cookies.get('sb-access-token')
  const refreshCookie = request.cookies.get('sb-refresh-token')
  
  let user = null
  let userTier: 'browser' | 'engaged' | 'soft-member' = 'browser'
  let captureLevel = 1

  // Verify session if tokens exist
  if (sessionCookie && refreshCookie) {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser(sessionCookie.value)
      
      if (!error && authUser) {
        // Get user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, email, capture_level, current_tier, engagement_score')
          .eq('id', authUser.id)
          .single()

        if (!profileError && userProfile) {
          user = userProfile
          userTier = userProfile.current_tier
          captureLevel = userProfile.capture_level
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  // Add user context to headers for use in components
  response.headers.set('x-user-id', user?.id || '')
  response.headers.set('x-user-tier', userTier)
  response.headers.set('x-capture-level', captureLevel.toString())
  response.headers.set('x-is-authenticated', user ? 'true' : 'false')

  // Remove locale from pathname for route checking
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  // Routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/tools/advanced',
    '/webinars/registered'
  ]

  // Routes that require specific capture levels
  const level2Routes = ['/tools/intermediate']
  const level3Routes = ['/tools/advanced', '/profile/complete']

  // Routes that require specific tiers
  const engagedRoutes = ['/content/premium']
  const softMemberRoutes = ['/community', '/coaching']

  // Check if route is protected (using path without locale)
  if (protectedRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!user) {
      // Redirect to sign-in with return URL (preserve locale)
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url)
      signInUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Check capture level requirements
  if (level2Routes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!user || captureLevel < 2) {
      const captureUrl = new URL(`/${locale}/auth/capture`, request.url)
      captureUrl.searchParams.set('level', '2')
      captureUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(captureUrl)
    }
  }

  if (level3Routes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!user || captureLevel < 3) {
      const captureUrl = new URL(`/${locale}/auth/capture`, request.url)
      captureUrl.searchParams.set('level', '3')
      captureUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(captureUrl)
    }
  }

  // Check tier requirements
  if (engagedRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!user || (userTier !== 'engaged' && userTier !== 'soft-member')) {
      const upgradeUrl = new URL(`/${locale}/upgrade`, request.url)
      upgradeUrl.searchParams.set('tier', 'engaged')
      upgradeUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(upgradeUrl)
    }
  }

  if (softMemberRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!user || userTier !== 'soft-member') {
      const upgradeUrl = new URL(`/${locale}/upgrade`, request.url)
      upgradeUrl.searchParams.set('tier', 'soft-member')
      upgradeUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(upgradeUrl)
    }
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Apply CORS headers for API routes
    applyCorsHeaders(response);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: response.headers });
    }

    // Apply rate limiting
    const rateLimitResponse = rateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }
  
  // Apply security headers to all responses
  applySecurityHeaders(response);

  // Track page views for analytics (non-blocking)
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // This would typically be done client-side or via a separate analytics service
    // to avoid blocking the middleware
    response.headers.set('x-track-page-view', 'true')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}