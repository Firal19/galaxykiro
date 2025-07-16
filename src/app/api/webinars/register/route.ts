import { NextRequest, NextResponse } from 'next/server'
import { WebinarModel, WebinarRegistrationModel } from '../../../../lib/models/webinar'
import { UserModel } from '../../../../lib/models/user'
import { InteractionModel } from '../../../../lib/models/interaction'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      webinarId,
      registrationData,
      registrationSource = 'website'
    } = body

    // Validate required fields
    if (!webinarId || !registrationData?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Webinar ID and email are required' 
        },
        { status: 400 }
      )
    }

    // Find or create user with progressive capture
    const { user, isNew } = await UserModel.findOrCreate(
      registrationData.email,
      {
        email: registrationData.email,
        full_name: registrationData.full_name,
        phone: registrationData.phone,
        capture_level: registrationData.phone ? 2 : 1,
        entry_point: 'webinar_registration'
      }
    )

    // Update user capture level if they provided more info
    let captureLevel = 1
    if (registrationData.phone && registrationData.full_name) {
      captureLevel = 2
    }
    if (registrationData.company || registrationData.role) {
      captureLevel = 3
    }

    if (captureLevel > user.captureLevel) {
      await user.updateCaptureLevel(captureLevel, {
        full_name: registrationData.full_name,
        phone: registrationData.phone
      })
    }

    // Check if webinar exists and is open for registration
    const webinar = await WebinarModel.findById(webinarId)
    if (!webinar) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Webinar not found' 
        },
        { status: 404 }
      )
    }

    if (!webinar.isRegistrationOpen()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Registration is closed for this webinar' 
        },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await WebinarRegistrationModel.findByUserAndWebinar(
      user.id,
      webinarId
    )

    if (existingRegistration) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You are already registered for this webinar' 
        },
        { status: 400 }
      )
    }

    // Check if webinar is full
    const registrationCount = await webinar.getRegistrationCount()
    if (webinar.maxAttendees && registrationCount >= webinar.maxAttendees) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This webinar is full' 
        },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await WebinarRegistrationModel.create({
      webinar_id: webinarId,
      user_id: user.id,
      registration_source: registrationSource,
      registration_data: {
        interests: registrationData.interests || [],
        experience_level: registrationData.experience_level,
        goals: registrationData.goals || [],
        company: registrationData.company,
        role: registrationData.role,
        how_heard: registrationData.how_heard,
        questions: registrationData.questions
      }
    })

    // Track interaction
    const sessionId = request.headers.get('x-session-id') || 'unknown'
    await InteractionModel.trackWebinarRegistration(
      sessionId,
      webinarId,
      webinar.title,
      user.id
    )

    // Update user engagement score (webinar registration = 25 points)
    const newScore = user.engagementScore + 25
    await user.updateEngagementScore(newScore)

    // Update user tier if needed
    if (newScore >= 70 && user.currentTier !== 'soft-member') {
      await user.updateTier('soft-member')
    } else if (newScore >= 30 && user.currentTier === 'browser') {
      await user.updateTier('engaged')
    }

    // Trigger email sequence
    await triggerEmailSequence(registration.id, 'confirmation')

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      message: 'Registration successful! Check your email for confirmation.',
      userTier: user.currentTier,
      engagementScore: newScore
    })
  } catch (error) {
    console.error('Error registering for webinar:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      },
      { status: 500 }
    )
  }
}

async function triggerEmailSequence(registrationId: string, sequenceType: string) {
  try {
    // This would typically call an email service
    // For now, we'll just log and potentially call a Netlify function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/trigger-webinar-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationId,
        sequenceType
      })
    })

    if (!response.ok) {
      console.error('Failed to trigger email sequence:', await response.text())
    }
  } catch (error) {
    console.error('Error triggering email sequence:', error)
  }
}