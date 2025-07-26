import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { UserModel } from '../../src/lib/models/user'
import { InteractionModel } from '../../src/lib/models/interaction'

// Initialize Supabase client for real-time subscriptions and direct operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface EmailSequenceRequest {
  userId: string
  sequenceType: 'new_subscriber' | 'tool_user' | 'webinar_attendee' | 'tier_upgrade' | 'assessment_complete' | 'custom'
  triggerEvent: string
  customData?: Record<string, unknown>
  delay?: number // in minutes
  immediate?: boolean
}

interface EmailTemplate {
  id: string
  subject: string
  content: string
  variables: Record<string, unknown>
  delay: number
  conditions?: Record<string, unknown>
}

// Email sequence configurations
const EMAIL_SEQUENCES = {
  new_subscriber: [
    {
      id: 'welcome',
      subject: 'Welcome to Galaxy Dream Team - Your Journey Begins Now!',
      delay: 0,
      content: 'welcome_email_template'
    },
    {
      id: 'first_assessment',
      subject: 'Discover Your Hidden Potential - Take Your First Assessment',
      delay: 60, // 1 hour
      content: 'first_assessment_template'
    },
    {
      id: 'value_delivery_1',
      subject: 'The #1 Mistake That Keeps People Stuck (And How to Avoid It)',
      delay: 1440, // 24 hours
      content: 'value_delivery_1_template'
    },
    {
      id: 'social_proof',
      subject: 'How Sarah Transformed Her Life in 90 Days',
      delay: 2880, // 48 hours
      content: 'social_proof_template'
    },
    {
      id: 'tool_introduction',
      subject: 'Your Personal Growth Toolkit Awaits',
      delay: 4320, // 72 hours
      content: 'tool_introduction_template'
    },
    {
      id: 'webinar_invitation',
      subject: 'Exclusive Invitation: Join Our Next Masterclass',
      delay: 7200, // 5 days
      content: 'webinar_invitation_template'
    },
    {
      id: 'week_one_check_in',
      subject: 'Your First Week Journey - How Are You Feeling?',
      delay: 10080, // 7 days
      content: 'week_one_checkin_template'
    }
  ],
  tool_user: [
    {
      id: 'tool_completion_celebration',
      subject: 'Congratulations! You\'ve Unlocked New Insights',
      delay: 0,
      content: 'tool_completion_template'
    },
    {
      id: 'next_tool_suggestion',
      subject: 'Ready for Your Next Transformation?',
      delay: 1440, // 24 hours
      content: 'next_tool_template'
    },
    {
      id: 'progress_tracking',
      subject: 'Your Growth Progress Report',
      delay: 4320, // 3 days
      content: 'progress_tracking_template'
    },
    {
      id: 'advanced_tools_unlock',
      subject: 'You\'ve Unlocked Advanced Assessment Tools!',
      delay: 7200, // 5 days
      content: 'advanced_tools_template'
    },
    {
      id: 'community_invitation',
      subject: 'Join Our Community of Growth-Minded Individuals',
      delay: 10080, // 7 days
      content: 'community_invitation_template'
    },
    {
      id: 'office_visit_invitation',
      subject: 'Ready for Personalized Guidance? Let\'s Meet!',
      delay: 20160, // 14 days
      content: 'office_visit_template'
    }
  ],
  webinar_attendee: [
    {
      id: 'webinar_thank_you',
      subject: 'Thank You for Attending - Your Action Plan Inside',
      delay: 60, // 1 hour after webinar
      content: 'webinar_thank_you_template'
    },
    {
      id: 'implementation_guide',
      subject: 'Your Step-by-Step Implementation Guide',
      delay: 1440, // 24 hours
      content: 'implementation_guide_template'
    },
    {
      id: 'q_and_a_follow_up',
      subject: 'Answers to Your Webinar Questions',
      delay: 2880, // 48 hours
      content: 'qa_followup_template'
    },
    {
      id: 'success_stories',
      subject: 'Real Results from Real People',
      delay: 4320, // 3 days
      content: 'success_stories_template'
    },
    {
      id: 'next_webinar_invitation',
      subject: 'Join Our Next Deep-Dive Session',
      delay: 10080, // 7 days
      content: 'next_webinar_template'
    },
    {
      id: 'personal_consultation_offer',
      subject: 'Exclusive Offer: Personal Consultation Available',
      delay: 20160, // 14 days
      content: 'consultation_offer_template'
    },
    {
      id: 'transformation_challenge',
      subject: 'Ready for the 21-Day Transformation Challenge?',
      delay: 30240, // 21 days
      content: 'transformation_challenge_template'
    }
  ],
  tier_upgrade: [
    {
      id: 'tier_congratulations',
      subject: 'Congratulations! You\'ve Reached a New Level',
      delay: 0,
      content: 'tier_upgrade_template'
    },
    {
      id: 'new_benefits_unlock',
      subject: 'Your New Benefits Are Now Available',
      delay: 60, // 1 hour
      content: 'new_benefits_template'
    },
    {
      id: 'exclusive_content_access',
      subject: 'Exclusive Content Just for You',
      delay: 1440, // 24 hours
      content: 'exclusive_content_template'
    }
  ],
  assessment_complete: [
    {
      id: 'results_deep_dive',
      subject: 'Your Assessment Results - Deep Dive Analysis',
      delay: 0,
      content: 'results_analysis_template'
    },
    {
      id: 'action_plan',
      subject: 'Your Personalized Action Plan',
      delay: 1440, // 24 hours
      content: 'action_plan_template'
    },
    {
      id: 'related_tools',
      subject: 'Tools to Accelerate Your Progress',
      delay: 4320, // 3 days
      content: 'related_tools_template'
    }
  ]
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      },
      body: '',
    }
  }

  try {
    if (event.httpMethod === 'POST') {
      return await handleTriggerSequence(event)
    } else if (event.httpMethod === 'GET') {
      return await handleGetSequenceStatus(event)
    } else {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Method not allowed' }),
      }
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

async function handleTriggerSequence(event: any): Promise<HandlerResponse> {
  const sequenceRequest: EmailSequenceRequest = JSON.parse(event.body || '{}')

  // Validate required fields
  if (!sequenceRequest.userId || !sequenceRequest.sequenceType || !sequenceRequest.triggerEvent) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required fields',
        details: 'userId, sequenceType, and triggerEvent are required',
      }),
    }
  }

  // Get user information
  const user = await UserModel.findById(sequenceRequest.userId)
  if (!user) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'User not found',
        details: 'The specified user ID does not exist',
      }),
    }
  }

  // Get email sequence configuration
  const sequenceConfig = EMAIL_SEQUENCES[sequenceRequest.sequenceType as keyof typeof EMAIL_SEQUENCES]
  if (!sequenceConfig) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Invalid sequence type',
        details: `Sequence type '${sequenceRequest.sequenceType}' is not supported`,
      }),
    }
  }

  // Track the sequence trigger event
  await InteractionModel.create({
    user_id: sequenceRequest.userId,
    session_id: `email-sequence-${Date.now()}`,
    event_type: 'email_sequence_triggered',
    event_data: {
      sequence_type: sequenceRequest.sequenceType,
      trigger_event: sequenceRequest.triggerEvent,
      custom_data: sequenceRequest.customData || {},
      immediate: sequenceRequest.immediate || false
    }
  })

  // Schedule emails in the sequence
  const scheduledEmails = []
  const baseDelay = sequenceRequest.delay || 0

  for (const emailTemplate of sequenceConfig) {
    const scheduledTime = new Date(Date.now() + (baseDelay + emailTemplate.delay) * 60 * 1000)
    
    // In a real implementation, this would integrate with an email service
    // For now, we'll simulate scheduling by storing the email data
    const emailData = {
      id: `${sequenceRequest.userId}-${sequenceRequest.sequenceType}-${emailTemplate.id}`,
      userId: sequenceRequest.userId,
      templateId: emailTemplate.id,
      subject: personalizeEmailSubject(emailTemplate.subject, user, sequenceRequest.customData),
      content: emailTemplate.content,
      scheduledTime: scheduledTime.toISOString(),
      status: 'scheduled',
      sequenceType: sequenceRequest.sequenceType,
      triggerEvent: sequenceRequest.triggerEvent
    }

    // Store email schedule in Supabase (you would create an email_queue table)
    // For now, we'll just track it as an interaction
    await InteractionModel.create({
      user_id: sequenceRequest.userId,
      session_id: `email-schedule-${Date.now()}`,
      event_type: 'email_scheduled',
      event_data: emailData
    })

    scheduledEmails.push(emailData)

    // If immediate, send the first email right away
    if (sequenceRequest.immediate && emailTemplate.delay === 0) {
      await sendImmediateEmail(emailData, user)
    }
  }

  // Trigger real-time notification about sequence start
  await supabase
    .channel('email-sequences')
    .send({
      type: 'broadcast',
      event: 'sequence-triggered',
      payload: {
        userId: sequenceRequest.userId,
        sequenceType: sequenceRequest.sequenceType,
        triggerEvent: sequenceRequest.triggerEvent,
        emailCount: scheduledEmails.length,
        firstEmailTime: scheduledEmails[0]?.scheduledTime,
        timestamp: new Date().toISOString()
      }
    })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Email sequence triggered successfully',
      data: {
        userId: sequenceRequest.userId,
        sequenceType: sequenceRequest.sequenceType,
        triggerEvent: sequenceRequest.triggerEvent,
        emailsScheduled: scheduledEmails.length,
        scheduledEmails: scheduledEmails.map(email => ({
          id: email.id,
          templateId: email.templateId,
          subject: email.subject,
          scheduledTime: email.scheduledTime,
          status: email.status
        })),
        immediate: sequenceRequest.immediate || false
      },
    }),
  }
}

async function handleGetSequenceStatus(event: any): Promise<HandlerResponse> {
  const { userId, sequenceType } = event.queryStringParameters || {}

  if (!userId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required parameters',
        details: 'userId is required',
      }),
    }
  }

  // Get user's email sequence history
  const sequenceInteractions = await InteractionModel.findByUserId(userId, 100)
  const emailSequences = sequenceInteractions.filter(interaction => 
    interaction.eventType === 'email_sequence_triggered' || 
    interaction.eventType === 'email_scheduled' ||
    interaction.eventType === 'email_sent'
  )

  // Group by sequence type
  const sequencesByType: Record<string, any[]> = {}
  emailSequences.forEach(interaction => {
    const eventData = interaction.eventData
    const seqType = (eventData.sequence_type as string) || (eventData.sequenceType as string) || 'unknown'
    
    if (!sequencesByType[seqType]) {
      sequencesByType[seqType] = []
    }
    sequencesByType[seqType].push({
      eventType: interaction.eventType,
      data: eventData,
      timestamp: interaction.timestamp
    })
  })

  // Filter by specific sequence type if requested
  const responseData = sequenceType 
    ? { [sequenceType]: sequencesByType[sequenceType] || [] }
    : sequencesByType

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      data: {
        userId,
        sequenceType: sequenceType || 'all',
        sequences: responseData,
        totalSequences: Object.keys(sequencesByType).length,
        availableSequenceTypes: Object.keys(EMAIL_SEQUENCES)
      },
    }),
  }
}

function personalizeEmailSubject(
  subject: string, 
  user: UserModel, 
  customData?: Record<string, unknown>
): string {
  let personalizedSubject = subject

  // Replace common placeholders
  personalizedSubject = personalizedSubject.replace(/\{firstName\}/g, user.fullName?.split(' ')[0] || 'Friend')
  personalizedSubject = personalizedSubject.replace(/\{fullName\}/g, user.fullName || 'Friend')
  personalizedSubject = personalizedSubject.replace(/\{city\}/g, user.city || '')

  // Replace custom data placeholders
  if (customData) {
    Object.entries(customData).forEach(([key, value]) => {
      const placeholder = new RegExp(`\\{${key}\\}`, 'g')
      personalizedSubject = personalizedSubject.replace(placeholder, String(value))
    })
  }

  return personalizedSubject
}

async function sendImmediateEmail(emailData: any, user: UserModel): Promise<void> {
  try {
    // Use the email service to send the email
    const { emailService } = await import('../../src/lib/email-service')
    
    // Find the email template from the sequence
    let template: any = null
    for (const sequence of Object.values(EMAIL_SEQUENCES)) {
      template = sequence.find((t: any) => t.id === emailData.templateId)
      if (template) break
    }
    
    if (!template) {
      throw new Error(`Email template ${emailData.templateId} not found`)
    }

    // Personalize the content
    const personalizedContent = personalizeEmailContent(emailData.content || template.content, user, emailData.customData)
    const personalizedSubject = personalizeEmailSubject(emailData.subject || template.subject, user, emailData.customData)

    const result = await emailService.sendEmail({
      to: user.email,
      subject: personalizedSubject,
      htmlContent: personalizedContent,
      textContent: personalizedContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
    })

    if (!result.success) {
      throw new Error(`Email sending failed: ${result.error}`)
    }

    console.log(`Immediate email sent successfully to ${user.email}:`, result.messageId)

    // Track email as sent
    await InteractionModel.create({
      user_id: user.id,
      session_id: `email-sent-${Date.now()}`,
      event_type: 'email_sent',
      event_data: {
        ...emailData,
        sentTime: new Date().toISOString(),
        status: 'sent',
        immediate: true,
        messageId: result.messageId
      }
    })
  } catch (error) {
    console.error('Error sending immediate email:', error)
    throw error
  }
}

function personalizeEmailContent(
  content: string, 
  user: UserModel, 
  customData?: Record<string, unknown>
): string {
  let personalizedContent = content

  // Replace common placeholders
  personalizedContent = personalizedContent.replace(/\{firstName\}/g, user.fullName?.split(' ')[0] || 'Friend')
  personalizedContent = personalizedContent.replace(/\{fullName\}/g, user.fullName || 'Friend')
  personalizedContent = personalizedContent.replace(/\{city\}/g, user.city || '')

  // Replace custom data placeholders
  if (customData) {
    Object.entries(customData).forEach(([key, value]) => {
      const placeholder = new RegExp(`\\{${key}\\}`, 'g')
      personalizedContent = personalizedContent.replace(placeholder, String(value))
    })
  }

  return personalizedContent
}