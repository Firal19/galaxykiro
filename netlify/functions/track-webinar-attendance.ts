import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface AttendanceData {
  webinarId: string
  userId: string
  attended: boolean
  attendanceDurationMinutes?: number
  engagementScore?: number
  joinTime?: string
  leaveTime?: string
  interactions?: {
    chatMessages?: number
    questionsAsked?: number
    pollResponses?: number
    reactionsUsed?: number
  }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const attendanceData: AttendanceData = JSON.parse(event.body || '{}')

    if (!attendanceData.webinarId || !attendanceData.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webinar ID and User ID are required' })
      }
    }

    // Find the registration
    const { data: registration, error: regError } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('webinar_id', attendanceData.webinarId)
      .eq('user_id', attendanceData.userId)
      .single()

    if (regError || !registration) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Registration not found' })
      }
    }

    // Calculate engagement score based on interactions
    let engagementScore = attendanceData.engagementScore || 0
    
    if (attendanceData.interactions) {
      const interactions = attendanceData.interactions
      engagementScore += (interactions.chatMessages || 0) * 2
      engagementScore += (interactions.questionsAsked || 0) * 5
      engagementScore += (interactions.pollResponses || 0) * 3
      engagementScore += (interactions.reactionsUsed || 0) * 1
    }

    // Calculate attendance duration if join/leave times provided
    let attendanceDuration = attendanceData.attendanceDurationMinutes || 0
    if (attendanceData.joinTime && attendanceData.leaveTime) {
      const joinTime = new Date(attendanceData.joinTime)
      const leaveTime = new Date(attendanceData.leaveTime)
      attendanceDuration = Math.round((leaveTime.getTime() - joinTime.getTime()) / (1000 * 60))
    }

    // Update registration with attendance data
    const { data: updatedRegistration, error: updateError } = await supabase
      .from('webinar_registrations')
      .update({
        attended: attendanceData.attended,
        attendance_duration_minutes: attendanceDuration,
        engagement_score: engagementScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', registration.id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update attendance: ${updateError.message}`)
    }

    // Update user engagement score
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('engagement_score, current_tier')
      .eq('id', attendanceData.userId)
      .single()

    if (!userError && user) {
      // Add points for webinar attendance (base 15 points + engagement bonus)
      const attendancePoints = 15 + Math.min(engagementScore, 10) // Cap engagement bonus at 10
      const newEngagementScore = user.engagement_score + attendancePoints

      // Update user engagement score
      await supabase
        .from('users')
        .update({
          engagement_score: newEngagementScore,
          last_activity: new Date().toISOString()
        })
        .eq('id', attendanceData.userId)

      // Update user tier if needed
      let newTier = user.current_tier
      if (newEngagementScore >= 70 && user.current_tier !== 'soft-member') {
        newTier = 'soft-member'
      } else if (newEngagementScore >= 30 && user.current_tier === 'browser') {
        newTier = 'engaged'
      }

      if (newTier !== user.current_tier) {
        await supabase
          .from('users')
          .update({ current_tier: newTier })
          .eq('id', attendanceData.userId)
      }
    }

    // Trigger appropriate follow-up email sequence
    if (attendanceData.attended) {
      // Trigger attendee follow-up sequence
      await triggerEmailSequence(registration.id, 'attendee_follow_up')
    } else {
      // Check if this is after the webinar ended (for no-shows)
      const { data: webinar } = await supabase
        .from('webinars')
        .select('scheduled_at, duration_minutes')
        .eq('id', attendanceData.webinarId)
        .single()

      if (webinar) {
        const webinarEndTime = new Date(webinar.scheduled_at)
        webinarEndTime.setMinutes(webinarEndTime.getMinutes() + (webinar.duration_minutes || 90))
        
        if (new Date() > webinarEndTime && !registration.no_show_follow_up_sent) {
          await triggerEmailSequence(registration.id, 'no_show_follow_up')
          
          // Mark no-show follow-up as sent
          await supabase
            .from('webinar_registrations')
            .update({ no_show_follow_up_sent: true })
            .eq('id', registration.id)
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Attendance tracked successfully',
        registration: updatedRegistration,
        engagementScore,
        attendanceDuration
      })
    }
  } catch (error) {
    console.error('Error tracking webinar attendance:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to track attendance',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

async function triggerEmailSequence(registrationId: string, sequenceType: string) {
  try {
    const response = await fetch(`${process.env.URL}/.netlify/functions/trigger-webinar-email`, {
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

export { handler }