import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface EmailSequenceData {
  registrationId: string
  sequenceType: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'no_show_follow_up' | 'attendee_follow_up'
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
    const { registrationId, sequenceType }: EmailSequenceData = JSON.parse(event.body || '{}')

    if (!registrationId || !sequenceType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Registration ID and sequence type are required' })
      }
    }

    // Get registration details with user and webinar info
    const { data: registration, error: regError } = await supabase
      .from('webinar_registrations')
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          phone,
          language
        ),
        webinars (
          id,
          title,
          description,
          scheduled_at,
          duration_minutes,
          webinar_url,
          presenter_name
        )
      `)
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Registration not found' })
      }
    }

    const user = registration.users
    const webinar = registration.webinars

    // Generate email content based on sequence type
    const emailContent = generateEmailContent(sequenceType, user, webinar, registration)

    // Calculate when to send the email
    const scheduledAt = calculateScheduledTime(sequenceType, webinar.scheduled_at)

    // Store email sequence record
    const { data: emailSequence, error: emailError } = await supabase
      .from('webinar_email_sequences')
      .insert({
        registration_id: registrationId,
        sequence_type: sequenceType,
        email_subject: emailContent.subject,
        email_content: emailContent.content,
        scheduled_at: scheduledAt,
        status: 'scheduled'
      })
      .select()
      .single()

    if (emailError) {
      throw new Error(`Failed to create email sequence: ${emailError.message}`)
    }

    // If it's immediate (confirmation), send right away
    if (sequenceType === 'confirmation') {
      await sendEmail(emailContent, user.email)
      
      // Update status to sent
      await supabase
        .from('webinar_email_sequences')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', emailSequence.id)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email sequence triggered successfully',
        emailSequenceId: emailSequence.id,
        scheduledAt
      })
    }
  } catch (error) {
    console.error('Error triggering webinar email:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to trigger email sequence',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

function generateEmailContent(
  sequenceType: string, 
  user: any, 
  webinar: any, 
  registration: any
): { subject: string; content: string } {
  const userName = user.full_name || user.email.split('@')[0]
  const webinarDate = new Date(webinar.scheduled_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  switch (sequenceType) {
    case 'confirmation':
      return {
        subject: `✅ You're registered for "${webinar.title}"`,
        content: `
          <h2>Welcome ${userName}!</h2>
          <p>You're successfully registered for our upcoming webinar:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${webinar.title}</h3>
            <p><strong>Date & Time:</strong> ${webinarDate}</p>
            <p><strong>Duration:</strong> ${webinar.duration_minutes} minutes</p>
            ${webinar.presenter_name ? `<p><strong>Presenter:</strong> ${webinar.presenter_name}</p>` : ''}
          </div>
          
          <h3>What to expect:</h3>
          <p>${webinar.description || 'An engaging session designed to help you unlock your potential.'}</p>
          
          <h3>Next Steps:</h3>
          <ul>
            <li>Add this event to your calendar</li>
            <li>We'll send you reminder emails before the webinar</li>
            <li>Join link will be provided 1 hour before the session</li>
          </ul>
          
          <p>We're excited to see you there!</p>
          
          <p>Best regards,<br>
          Galaxy Dream Team</p>
        `
      }

    case 'reminder_24h':
      return {
        subject: `⏰ Tomorrow: "${webinar.title}" - Don't miss out!`,
        content: `
          <h2>Hi ${userName},</h2>
          <p>Just a friendly reminder that your webinar is tomorrow!</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${webinar.title}</h3>
            <p><strong>Tomorrow at:</strong> ${webinarDate}</p>
            <p><strong>Duration:</strong> ${webinar.duration_minutes} minutes</p>
          </div>
          
          <h3>Prepare for maximum value:</h3>
          <ul>
            <li>Find a quiet space where you won't be interrupted</li>
            <li>Have a notebook ready for key insights</li>
            <li>Prepare any questions you'd like to ask</li>
            <li>Test your internet connection</li>
          </ul>
          
          <p>We'll send you the join link 1 hour before we start.</p>
          
          <p>See you tomorrow!<br>
          Galaxy Dream Team</p>
        `
      }

    case 'reminder_1h':
      return {
        subject: `🚀 Starting in 1 hour: "${webinar.title}" - Join link inside`,
        content: `
          <h2>Hi ${userName},</h2>
          <p>Your webinar starts in just 1 hour!</p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>${webinar.title}</h3>
            <p><strong>Starting in 1 hour</strong></p>
            ${webinar.webinar_url ? `
              <a href="${webinar.webinar_url}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Join Webinar Now
              </a>
            ` : '<p>Join link will be provided shortly.</p>'}
          </div>
          
          <h3>Quick reminders:</h3>
          <ul>
            <li>Join a few minutes early to test your connection</li>
            <li>Have your questions ready</li>
            <li>Bring a notebook for key insights</li>
          </ul>
          
          <p>We're excited to see you there!</p>
          
          <p>Best regards,<br>
          Galaxy Dream Team</p>
        `
      }

    case 'no_show_follow_up':
      return {
        subject: `We missed you at "${webinar.title}" - Here's your recording`,
        content: `
          <h2>Hi ${userName},</h2>
          <p>We noticed you weren't able to join us for "${webinar.title}" yesterday.</p>
          <p>No worries - life happens! We've got you covered.</p>
          
          ${webinar.recording_url ? `
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3>🎥 Watch the Full Recording</h3>
              <p>Get all the insights you missed, plus the Q&A session.</p>
              <a href="${webinar.recording_url}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Watch Recording Now
              </a>
            </div>
          ` : `
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>The recording will be available within 24 hours. We'll send it to you as soon as it's ready!</p>
            </div>
          `}
          
          <h3>What you'll discover in the recording:</h3>
          <ul>
            <li>Key strategies shared during the session</li>
            <li>Answers to participant questions</li>
            <li>Actionable steps you can implement immediately</li>
          </ul>
          
          <p>Plus, as a special thank you for your interest, we'd love to offer you a complimentary 15-minute consultation to discuss your personal development goals.</p>
          
          <p>Simply reply to this email to schedule your session.</p>
          
          <p>Best regards,<br>
          Galaxy Dream Team</p>
        `
      }

    case 'attendee_follow_up':
      return {
        subject: `Thank you for joining "${webinar.title}" - Your next steps`,
        content: `
          <h2>Thank you ${userName}!</h2>
          <p>It was wonderful having you join us for "${webinar.title}".</p>
          
          <h3>🎯 Your Next Steps:</h3>
          <ol>
            <li><strong>Implement what you learned:</strong> Choose one key insight and apply it this week</li>
            <li><strong>Join our community:</strong> Connect with other growth-minded individuals</li>
            <li><strong>Continue your journey:</strong> Explore our additional resources below</li>
          </ol>
          
          ${webinar.recording_url ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📹 Rewatch the Session</h3>
              <p>Review key points and share with colleagues:</p>
              <a href="${webinar.recording_url}" style="color: #007bff; text-decoration: none;">
                Access Recording →
              </a>
            </div>
          ` : ''}
          
          <h3>🚀 Ready to go deeper?</h3>
          <p>Based on your interest in personal development, you might enjoy:</p>
          <ul>
            <li>Our comprehensive assessment tools</li>
            <li>Personalized development plans</li>
            <li>One-on-one coaching sessions</li>
          </ul>
          
          <p>We'd love to offer you a complimentary consultation to discuss your goals and how we can support your growth journey.</p>
          
          <p>Simply reply to this email to schedule your session.</p>
          
          <p>Keep growing!<br>
          Galaxy Dream Team</p>
        `
      }

    default:
      return {
        subject: `Update about "${webinar.title}"`,
        content: `<p>Hi ${userName},</p><p>Thank you for your interest in our webinar.</p>`
      }
  }
}

function calculateScheduledTime(sequenceType: string, webinarScheduledAt: string): string {
  const webinarDate = new Date(webinarScheduledAt)
  
  switch (sequenceType) {
    case 'confirmation':
      return new Date().toISOString() // Send immediately
    
    case 'reminder_24h':
      // 24 hours before webinar
      return new Date(webinarDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
    
    case 'reminder_1h':
      // 1 hour before webinar
      return new Date(webinarDate.getTime() - 60 * 60 * 1000).toISOString()
    
    case 'no_show_follow_up':
      // 2 hours after webinar ends (assuming 90 min duration)
      return new Date(webinarDate.getTime() + 3.5 * 60 * 60 * 1000).toISOString()
    
    case 'attendee_follow_up':
      // 1 day after webinar
      return new Date(webinarDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
    
    default:
      return new Date().toISOString()
  }
}

async function sendEmail(emailContent: { subject: string; content: string }, toEmail: string): Promise<void> {
  // This is a placeholder for actual email sending
  // In a real implementation, you would integrate with:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Or another email service
  
  console.log('Sending email:', {
    to: toEmail,
    subject: emailContent.subject,
    content: emailContent.content
  })
  
  // For now, we'll just log the email
  // In production, replace this with actual email sending logic
}

export { handler }