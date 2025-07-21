import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // This function should be called by a cron job or scheduled task
  // For Netlify, you can use Netlify Functions with scheduled triggers
  
  try {
    const now = new Date().toISOString()
    
    // Find all scheduled email sequences that should be sent now
    const { data: scheduledEmails, error } = await supabase
      .from('webinar_email_sequences')
      .select(`
        *,
        webinar_registrations (
          *,
          users (
            id,
            email,
            full_name,
            language
          ),
          webinars (
            id,
            title,
            scheduled_at,
            duration_minutes,
            webinar_url,
            recording_url,
            presenter_name
          )
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .limit(50) // Process in batches

    if (error) {
      throw new Error(`Failed to fetch scheduled emails: ${error.message}`)
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'No emails to process',
          processed: 0
        })
      }
    }

    let processed = 0
    let failed = 0

    // Process each email
    for (const emailSequence of scheduledEmails) {
      try {
        const registration = emailSequence.webinar_registrations
        const user = registration.users
        const webinar = registration.webinars

        // Send the email
        await sendEmail({
          to: user.email,
          subject: emailSequence.email_subject || 'Webinar Update',
          content: emailSequence.email_content || 'Thank you for your interest.',
          language: user.language || 'en'
        })

        // Update email sequence status
        await supabase
          .from('webinar_email_sequences')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', emailSequence.id)

        processed++
      } catch (emailError) {
        console.error(`Failed to send email ${emailSequence.id}:`, emailError)
        
        // Mark as failed
        await supabase
          .from('webinar_email_sequences')
          .update({
            status: 'failed'
          })
          .eq('id', emailSequence.id)

        failed++
      }
    }

    // Also check for webinars that need automatic follow-up sequences
    await processAutomaticSequences()

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email sequences processed',
        processed,
        failed,
        total: scheduledEmails.length
      })
    }
  } catch (error) {
    console.error('Error processing email sequences:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process email sequences',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

async function processAutomaticSequences() {
  const now = new Date()
  
  // Find webinars that ended recently and need no-show follow-ups
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000)

  const { data: recentWebinars, error } = await supabase
    .from('webinars')
    .select('*')
    .gte('scheduled_at', fourHoursAgo.toISOString())
    .lte('scheduled_at', twoHoursAgo.toISOString())
    .eq('status', 'completed')

  if (error || !recentWebinars) {
    console.error('Error fetching recent webinars:', error)
    return
  }

  for (const webinar of recentWebinars) {
    // Find registrations that didn't attend and haven't received follow-up
    const { data: noShows, error: noShowError } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('webinar_id', webinar.id)
      .eq('attended', false)
      .eq('no_show_follow_up_sent', false)

    if (noShowError || !noShows) {
      console.error('Error fetching no-shows:', noShowError)
      continue
    }

    // Trigger no-show follow-up for each
    for (const registration of noShows) {
      try {
        await fetch(`${process.env.URL}/.netlify/functions/trigger-webinar-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationId: registration.id,
            sequenceType: 'no_show_follow_up'
          })
        })
      } catch (error) {
        console.error('Error triggering no-show follow-up:', error)
      }
    }
  }

  // Find webinars that ended yesterday and need attendee follow-ups
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

  const { data: yesterdayWebinars, error: yesterdayError } = await supabase
    .from('webinars')
    .select('*')
    .gte('scheduled_at', twoDaysAgo.toISOString())
    .lte('scheduled_at', yesterday.toISOString())
    .eq('status', 'completed')

  if (yesterdayError || !yesterdayWebinars) {
    console.error('Error fetching yesterday webinars:', yesterdayError)
    return
  }

  for (const webinar of yesterdayWebinars) {
    // Find attendees who haven't received follow-up
    const { data: attendees, error: attendeeError } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('webinar_id', webinar.id)
      .eq('attended', true)

    if (attendeeError || !attendees) {
      console.error('Error fetching attendees:', attendeeError)
      continue
    }

    // Check if attendee follow-up already sent
    for (const registration of attendees) {
      const { data: existingFollowUp } = await supabase
        .from('webinar_email_sequences')
        .select('id')
        .eq('registration_id', registration.id)
        .eq('sequence_type', 'attendee_follow_up')
        .single()

      if (!existingFollowUp) {
        try {
          await fetch(`${process.env.URL}/.netlify/functions/trigger-webinar-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              registrationId: registration.id,
              sequenceType: 'attendee_follow_up'
            })
          })
        } catch (error) {
          console.error('Error triggering attendee follow-up:', error)
        }
      }
    }
  }
}

async function sendEmail(emailData: {
  to: string
  subject: string
  content: string
  language: string
}): Promise<void> {
  try {
    // Use the email service to send the email
    const { emailService } = await import('../../src/lib/email-service')
    
    const result = await emailService.sendEmail({
      to: emailData.to,
      subject: emailData.subject,
      htmlContent: emailData.content,
      textContent: emailData.content.replace(/<[^>]*>/g, '') // Strip HTML for text version
    })
    
    if (!result.success) {
      console.error('Failed to send sequence email:', result.error)
      throw new Error(`Email sending failed: ${result.error}`)
    }
    
    console.log('Sequence email sent successfully:', result.messageId)
  } catch (error) {
    console.error('Error sending sequence email:', error)
    throw error
  }
}

export { handler }