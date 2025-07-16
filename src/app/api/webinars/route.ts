import { NextRequest, NextResponse } from 'next/server'
import { WebinarModel } from '../../../lib/models/webinar'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showPast = searchParams.get('past') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    let webinars: WebinarModel[]

    if (showPast) {
      webinars = await WebinarModel.findAll(limit)
    } else {
      webinars = await WebinarModel.findUpcoming(limit)
    }

    // Convert to JSON format
    const webinarsData = webinars.map(webinar => webinar.toJSON())

    return NextResponse.json({
      success: true,
      webinars: webinarsData
    })
  } catch (error) {
    console.error('Error fetching webinars:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch webinars' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      presenterName,
      presenterBio,
      scheduledAt,
      durationMinutes = 90,
      maxAttendees,
      registrationDeadline,
      webinarUrl,
      tags,
      thumbnailUrl
    } = body

    // Validate required fields
    if (!title || !scheduledAt) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title and scheduled time are required' 
        },
        { status: 400 }
      )
    }

    const webinar = await WebinarModel.create({
      title,
      description,
      presenter_name: presenterName,
      presenter_bio: presenterBio,
      scheduled_at: scheduledAt,
      duration_minutes: durationMinutes,
      max_attendees: maxAttendees,
      registration_deadline: registrationDeadline,
      webinar_url: webinarUrl,
      tags,
      thumbnail_url: thumbnailUrl,
      status: 'scheduled'
    })

    return NextResponse.json({
      success: true,
      webinar: webinar.toJSON()
    })
  } catch (error) {
    console.error('Error creating webinar:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create webinar' 
      },
      { status: 500 }
    )
  }
}