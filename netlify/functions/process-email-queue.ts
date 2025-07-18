import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * This function processes the email queue and sends scheduled emails.
 * It should be triggered by a scheduled event (e.g., every 5 minutes).
 * 
 * For Netlify, you can use a scheduled function with a cron expression:
 * @see https://docs.netlify.com/functions/scheduled-functions/
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const now = new Date().toISOString()
    
    // Find all scheduled emails that should be sent now
    const { data: scheduledEmails, error } = await supabase
      .from('email_queue')
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          language
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .limit(50) // Process in batches for better performance

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
    for (const email of scheduledEmails) {
      try {
        const user = email.users
        
        // Get email template
        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('*')
          .eq('id', email.template_id)
          .single()
        
        if (templateError || !template) {
          throw new Error(`Template not found: ${email.template_id}`)
        }
        
        // Personalize email content
        const personalizedEmail = personalizeEmail(
          template,
          email.personalization_data || {}
        )
        
        // Send the email
        await sendEmail({
          to: user.email,
          subject: personalizedEmail.subject,
          htmlContent: personalizedEmail.htmlContent,
          textContent: personalizedEmail.textContent,
          language: user.language || 'en'
        })

        // Update email status
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', email.id)
        
        // Track email metrics
        await supabase
          .from('email_metrics')
          .insert({
            email_id: `${email.template_id}-${Date.now()}`,
            user_id: user.id,
            template_id: email.template_id,
            sequence_id: email.sequence_id,
            sent: true,
            delivered: true, // Assuming delivery for now, will be updated by webhook
            opened: false,
            clicked: false,
            bounced: false,
            unsubscribed: false,
            sent_at: new Date().toISOString()
          })

        processed++
      } catch (emailError) {
        console.error(`Failed to send email ${email.id}:`, emailError)
        
        // Mark as failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
          })
          .eq('id', email.id)

        failed++
      }
    }

    // Check for sequences that need to be triggered based on user behavior
    await processAutomaticSequenceTriggers()

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email queue processed',
        processed,
        failed,
        total: scheduledEmails.length
      })
    }
  } catch (error) {
    console.error('Error processing email queue:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process email queue',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

/**
 * Personalizes email content by replacing template variables with actual values
 */
function personalizeEmail(
  template: any,
  personalization: Record<string, any>
): { subject: string; htmlContent: string; textContent: string } {
  let subject = template.subject
  let htmlContent = template.html_content
  let textContent = template.text_content

  // Replace variables
  const replacements = {
    firstName: personalization.firstName || 'Friend',
    fullName: personalization.fullName || 'Friend',
    city: personalization.city || '',
    userTier: personalization.userTier || 'Browser',
    engagementScore: personalization.engagementScore?.toString() || '0',
    ...personalization.customData
  }

  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    subject = subject.replace(regex, String(value))
    htmlContent = htmlContent.replace(regex, String(value))
    textContent = textContent.replace(regex, String(value))
  })

  return { subject, htmlContent, textContent }
}

/**
 * Sends an email using the configured email service provider
 */
async function sendEmail(emailData: {
  to: string
  subject: string
  htmlContent: string
  textContent: string
  language: string
}): Promise<void> {
  // This is a placeholder for actual email sending
  // In a real implementation, you would integrate with:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Or another email service
  
  console.log('Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
    language: emailData.language
  })
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // For now, we'll just log the email
  // In production, replace this with actual email sending logic
  
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  const msg = {
    to: emailData.to,
    from: process.env.FROM_EMAIL,
    subject: emailData.subject,
    html: emailData.htmlContent,
    text: emailData.textContent,
  }
  
  await sgMail.send(msg)
  */
}

/**
 * Processes automatic sequence triggers based on user behavior
 */
async function processAutomaticSequenceTriggers(): Promise<void> {
  try {
    // Find users who completed tools in the last hour but haven't received the tool user sequence
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: toolCompletions, error: toolError } = await supabase
      .from('tool_usage')
      .select('user_id, tool_name, created_at')
      .gte('created_at', oneHourAgo)
      .eq('completion_rate', 1.0)
    
    if (toolError || !toolCompletions) {
      console.error('Error fetching tool completions:', toolError)
      return
    }
    
    // For each tool completion, check if user already has the sequence triggered
    for (const completion of toolCompletions) {
      const { data: existingSequence } = await supabase
        .from('interactions')
        .select('id')
        .eq('user_id', completion.user_id)
        .eq('event_type', 'email_sequence_triggered')
        .eq('event_data->sequence_id', 'tool_user_series')
        .gte('created_at', oneHourAgo)
        .single()
      
      // If no sequence has been triggered, trigger it
      if (!existingSequence) {
        await triggerEmailSequence({
          userId: completion.user_id,
          sequenceId: 'tool_user_series',
          triggerEvent: 'tool_completed',
          customData: {
            toolName: completion.tool_name,
            completedAt: completion.created_at
          }
        })
      }
    }
    
    // Find users who attended webinars in the last 2 hours but haven't received the webinar attendee sequence
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    
    const { data: webinarAttendees, error: webinarError } = await supabase
      .from('webinar_registrations')
      .select('user_id, webinar_id, attended_at, webinars:webinar_id(title)')
      .eq('attended', true)
      .gte('attended_at', twoHoursAgo)
    
    if (webinarError || !webinarAttendees) {
      console.error('Error fetching webinar attendees:', webinarError)
      return
    }
    
    // For each webinar attendee, check if user already has the sequence triggered
    for (const attendee of webinarAttendees) {
      const { data: existingSequence } = await supabase
        .from('interactions')
        .select('id')
        .eq('user_id', attendee.user_id)
        .eq('event_type', 'email_sequence_triggered')
        .eq('event_data->sequence_id', 'webinar_attendee_series')
        .gte('created_at', twoHoursAgo)
        .single()
      
      // If no sequence has been triggered, trigger it
      if (!existingSequence) {
        await triggerEmailSequence({
          userId: attendee.user_id,
          sequenceId: 'webinar_attendee_series',
          triggerEvent: 'webinar_attended',
          customData: {
            webinarId: attendee.webinar_id,
            webinarTitle: (attendee.webinars as any)?.title || 'Our Webinar',
            attendedAt: attendee.attended_at
          }
        })
      }
    }
    
    // Find users who upgraded tiers in the last day but haven't received the tier upgrade sequence
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: tierUpgrades, error: tierError } = await supabase
      .from('interactions')
      .select('user_id, event_data')
      .eq('event_type', 'tier_changed')
      .gte('created_at', oneDayAgo)
    
    if (tierError || !tierUpgrades) {
      console.error('Error fetching tier upgrades:', tierError)
      return
    }
    
    // For each tier upgrade, check if it's an actual upgrade and if user already has the sequence triggered
    for (const upgrade of tierUpgrades) {
      const eventData = upgrade.event_data as any
      
      // Only trigger for actual upgrades (not downgrades)
      if (eventData.old_tier === 'browser' && eventData.new_tier === 'engaged' ||
          eventData.old_tier === 'engaged' && eventData.new_tier === 'soft-member') {
        
        const { data: existingSequence } = await supabase
          .from('interactions')
          .select('id')
          .eq('user_id', upgrade.user_id)
          .eq('event_type', 'email_sequence_triggered')
          .eq('event_data->sequence_id', 'tier_upgrade')
          .gte('created_at', oneDayAgo)
          .single()
        
        // If no sequence has been triggered, trigger it
        if (!existingSequence) {
          await triggerEmailSequence({
            userId: upgrade.user_id,
            sequenceId: 'tier_upgrade',
            triggerEvent: 'tier_upgraded',
            customData: {
              oldTier: eventData.old_tier,
              newTier: eventData.new_tier,
              upgradedAt: (upgrade as any).created_at
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('Error processing automatic sequence triggers:', error)
  }
}

/**
 * Triggers an email sequence for a user
 */
async function triggerEmailSequence(data: {
  userId: string
  sequenceId: string
  triggerEvent: string
  customData?: Record<string, any>
}): Promise<void> {
  try {
    // Call the trigger-email-sequence function
    await fetch(`${process.env.URL}/.netlify/functions/trigger-email-sequence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: data.userId,
        sequenceType: data.sequenceId,
        triggerEvent: data.triggerEvent,
        customData: data.customData,
        immediate: true
      })
    })
  } catch (error) {
    console.error(`Error triggering ${data.sequenceId} sequence for user ${data.userId}:`, error)
  }
}