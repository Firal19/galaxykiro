import { NextRequest, NextResponse } from 'next/server'
import { leadScoringService } from '@/lib/lead-scoring-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, interests, source, referralData } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists - skip for demo
    // const existingProfile = leadScoringService.getProfileByEmail(email)
    // if (existingProfile) {
    //   return NextResponse.json(
    //     { error: 'User already exists with this email' },
    //     { status: 409 }
    //   )
    // }

    // Create new user profile
    const newProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      phone: phone || null,
      interests: interests || [],
      status: 'pending_approval',
      role: 'soft_member',
      score: 0,
      source: source || 'direct',
      referralData: referralData || null,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      approvalWindow: 'fast_track', // 3 hours
      metadata: {
        registrationSource: source,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      }
    }

    // Store in lead scoring service (would be Supabase in production)
    // leadScoringService.createProfile(newProfile)

    // Track registration event
    await leadScoringService.updateEngagement('registration' as any, {
      method: 'registration'
    })

    // Create session for approval pending
    const sessionData = {
      id: newProfile.id,
      email: newProfile.email,
      name: newProfile.name,
      role: newProfile.role,
      status: newProfile.status,
      loginTime: new Date().toISOString()
    }

    // In production, you would:
    // 1. Create user in Supabase Auth
    // 2. Insert profile into profiles table
    // 3. Send welcome email
    // 4. Set up approval workflow

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for next steps.',
      user: {
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.name,
        status: newProfile.status
      },
      session: sessionData,
      redirectTo: '/approval-pending'
    })

  } catch (error) {
    console.error('Registration error:', error)
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