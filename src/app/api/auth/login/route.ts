import { NextRequest, NextResponse } from 'next/server'
import { leadScoringService } from '@/lib/lead-scoring-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes, check hardcoded credentials
    const isAdmin = email === 'admin@galaxykiro.com' && password === 'admin123'
    const isDemoUser = email === 'demo@galaxykiro.com' && password === 'demo123'

    if (!isAdmin && !isDemoUser) {
      // Check if user exists in our system
      const profile = leadScoringService.getProfileByEmail(email)
      if (!profile) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // In production, verify password hash
      // For demo, accept any password for existing users
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    // Create session data
    let sessionData
    if (isAdmin) {
      sessionData = {
        id: 'admin_user',
        email: 'admin@galaxykiro.com',
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        loginTime: new Date().toISOString()
      }
    } else if (isDemoUser) {
      sessionData = {
        id: 'demo_user',
        email: 'demo@galaxykiro.com',
        name: 'Demo User',
        role: 'soft_member',
        status: 'hot_lead',
        loginTime: new Date().toISOString()
      }
    } else {
      const profile = leadScoringService.getProfileByEmail(email)
      sessionData = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        status: profile.status,
        loginTime: new Date().toISOString()
      }
    }

    // Track login event
    leadScoringService.trackInteraction({
      eventType: 'user_login',
      userId: sessionData.id,
      email: sessionData.email,
      role: sessionData.role
    })

    // Set response headers for session
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: sessionData.id,
        email: sessionData.email,
        name: sessionData.name,
        role: sessionData.role,
        status: sessionData.status
      },
      session: sessionData,
      redirectTo: sessionData.role === 'admin' ? '/admin/dashboard' : 
                  sessionData.status === 'pending_approval' ? '/approval-pending' : 
                  '/soft-member/dashboard'
    })

    // Set session cookie (httpOnly in production)
    const cookieValue = JSON.stringify(sessionData)
    response.cookies.set('galaxy_kiro_session', cookieValue, {
      httpOnly: false, // Set to true in production
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}