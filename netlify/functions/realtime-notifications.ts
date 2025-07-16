import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'

// Initialize Supabase client for real-time subscriptions and direct operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface NotificationRequest {
  type: 'tier_change' | 'assessment_complete' | 'engagement_milestone' | 'webinar_reminder' | 'custom'
  userId: string
  data: Record<string, unknown>
  channels?: string[]
  immediate?: boolean
}

interface TierChangeNotification {
  userId: string
  previousTier: 'browser' | 'engaged' | 'soft-member'
  newTier: 'browser' | 'engaged' | 'soft-member'
  score: number
  timestamp: string
}

interface AssessmentCompleteNotification {
  userId: string
  toolName: string
  scores: Record<string, number>
  insights: Array<{ category: string; message: string; recommendation: string }>
  timestamp: string
}

interface EngagementMilestoneNotification {
  userId: string
  milestone: string
  value: number
  description: string
  timestamp: string
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
      return await handleSendNotification(event)
    } else if (event.httpMethod === 'GET') {
      return await handleGetNotificationStatus(event)
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

async function handleSendNotification(event: any): Promise<HandlerResponse> {
  const notificationRequest: NotificationRequest = JSON.parse(event.body || '{}')

  // Validate required fields
  if (!notificationRequest.type || !notificationRequest.userId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required fields',
        details: 'type and userId are required',
      }),
    }
  }

  // Get user information
  const user = await UserModel.findById(notificationRequest.userId)
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

  let notificationPayload: Record<string, unknown> = {}
  let channels: string[] = notificationRequest.channels || ['user-notifications']

  // Process different notification types
  switch (notificationRequest.type) {
    case 'tier_change':
      notificationPayload = await processTierChangeNotification(
        notificationRequest.data as TierChangeNotification,
        user
      )
      channels = ['tier-changes', `user-${user.id}`, 'user-notifications']
      break

    case 'assessment_complete':
      notificationPayload = await processAssessmentCompleteNotification(
        notificationRequest.data as AssessmentCompleteNotification,
        user
      )
      channels = ['assessment-updates', `user-${user.id}`, 'user-notifications']
      break

    case 'engagement_milestone':
      notificationPayload = await processEngagementMilestoneNotification(
        notificationRequest.data as EngagementMilestoneNotification,
        user
      )
      channels = ['engagement-milestones', `user-${user.id}`, 'user-notifications']
      break

    case 'webinar_reminder':
      notificationPayload = await processWebinarReminderNotification(
        notificationRequest.data,
        user
      )
      channels = ['webinar-reminders', `user-${user.id}`, 'user-notifications']
      break

    case 'custom':
      notificationPayload = {
        type: 'custom',
        userId: user.id,
        data: notificationRequest.data,
        timestamp: new Date().toISOString()
      }
      break

    default:
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid notification type',
          details: `Notification type '${notificationRequest.type}' is not supported`,
        }),
      }
  }

  // Send real-time notifications via Supabase
  const notificationResults = []
  for (const channel of channels) {
    try {
      const result = await supabase
        .channel(channel)
        .send({
          type: 'broadcast',
          event: notificationRequest.type,
          payload: notificationPayload
        })
      
      notificationResults.push({
        channel,
        success: true,
        result
      })
    } catch (error) {
      notificationResults.push({
        channel,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // If immediate notification is requested, also trigger email/SMS
  if (notificationRequest.immediate) {
    await triggerImmediateNotification(notificationRequest, user, notificationPayload)
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notificationType: notificationRequest.type,
        userId: user.id,
        channels,
        payload: notificationPayload,
        results: notificationResults,
        immediate: notificationRequest.immediate || false
      },
    }),
  }
}

async function handleGetNotificationStatus(event: any): Promise<HandlerResponse> {
  const { userId, channel } = event.queryStringParameters || {}

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

  // Get user's notification preferences and recent notifications
  const user = await UserModel.findById(userId)
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

  // Get recent tier changes and milestones
  const leadScore = await LeadScoresModel.findByUserId(userId)
  const recentTierChange = leadScore?.hasRecentTierChange(24) // Within 24 hours

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
        channel: channel || 'all',
        user: user.toPublicProfile(),
        leadScore: leadScore?.toJSON(),
        recentTierChange,
        notificationPreferences: user.toJSON().communication_preferences,
        availableChannels: [
          'user-notifications',
          'tier-changes',
          'assessment-updates',
          'engagement-milestones',
          'webinar-reminders',
          `user-${userId}`
        ]
      },
    }),
  }
}

async function processTierChangeNotification(
  data: TierChangeNotification,
  user: UserModel
): Promise<Record<string, unknown>> {
  const tierMessages = {
    browser: 'Welcome! You\'re exploring your potential.',
    engaged: 'Great progress! You\'re actively engaged in your growth journey.',
    'soft-member': 'Congratulations! You\'ve become a committed member of our community.'
  }

  const nextSteps = {
    browser: 'Try our assessment tools to discover more about your potential.',
    engaged: 'Join our next webinar to accelerate your growth.',
    'soft-member': 'Schedule an office visit to create your personalized development plan.'
  }

  return {
    type: 'tier_change',
    userId: user.id,
    userProfile: user.toPublicProfile(),
    previousTier: data.previousTier,
    newTier: data.newTier,
    score: data.score,
    message: tierMessages[data.newTier],
    nextStep: nextSteps[data.newTier],
    celebrationMessage: `You've progressed from ${data.previousTier} to ${data.newTier}!`,
    timestamp: data.timestamp,
    actionRequired: data.newTier === 'soft-member'
  }
}

async function processAssessmentCompleteNotification(
  data: AssessmentCompleteNotification,
  user: UserModel
): Promise<Record<string, unknown>> {
  const toolDisplayNames: Record<string, string> = {
    'potential-quotient-calculator': 'Potential Quotient Calculator',
    'limiting-belief-identifier': 'Limiting Belief Identifier',
    'transformation-readiness-score': 'Transformation Readiness Score',
    'success-factor-calculator': 'Success Factor Calculator',
    'habit-strength-analyzer': 'Habit Strength Analyzer'
  }

  const topInsight = data.insights.find(insight => insight.category === 'overall') || data.insights[0]

  return {
    type: 'assessment_complete',
    userId: user.id,
    userProfile: user.toPublicProfile(),
    toolName: data.toolName,
    toolDisplayName: toolDisplayNames[data.toolName] || data.toolName,
    totalScore: data.scores.total,
    scoreBreakdown: data.scores.breakdown,
    topInsight: topInsight?.message,
    recommendation: topInsight?.recommendation,
    insightsCount: data.insights.length,
    completionMessage: `You've completed the ${toolDisplayNames[data.toolName] || data.toolName}!`,
    shareableResult: true,
    timestamp: data.timestamp
  }
}

async function processEngagementMilestoneNotification(
  data: EngagementMilestoneNotification,
  user: UserModel
): Promise<Record<string, unknown>> {
  const milestoneMessages: Record<string, string> = {
    'first_assessment': 'You completed your first assessment!',
    'five_tools_used': 'You\'ve used 5 different tools!',
    'high_engagement': 'You\'re highly engaged with our content!',
    'content_explorer': 'You\'ve explored multiple content categories!',
    'time_milestone': 'You\'ve spent significant time on your growth journey!'
  }

  const milestoneRewards: Record<string, string> = {
    'first_assessment': 'Unlock advanced assessment tools',
    'five_tools_used': 'Access to exclusive content library',
    'high_engagement': 'Priority webinar registration',
    'content_explorer': 'Personalized content recommendations',
    'time_milestone': 'Free consultation opportunity'
  }

  return {
    type: 'engagement_milestone',
    userId: user.id,
    userProfile: user.toPublicProfile(),
    milestone: data.milestone,
    value: data.value,
    description: data.description,
    message: milestoneMessages[data.milestone] || `Milestone achieved: ${data.milestone}`,
    reward: milestoneRewards[data.milestone] || 'Special recognition',
    celebrationEmoji: '🎉',
    timestamp: data.timestamp
  }
}

async function processWebinarReminderNotification(
  data: Record<string, unknown>,
  user: UserModel
): Promise<Record<string, unknown>> {
  return {
    type: 'webinar_reminder',
    userId: user.id,
    userProfile: user.toPublicProfile(),
    webinarTitle: data.webinarTitle,
    webinarDate: data.webinarDate,
    webinarTime: data.webinarTime,
    reminderType: data.reminderType, // '24h', '1h', '15min'
    joinLink: data.joinLink,
    message: `Reminder: Your webinar "${data.webinarTitle}" starts soon!`,
    timestamp: new Date().toISOString()
  }
}

async function triggerImmediateNotification(
  request: NotificationRequest,
  user: UserModel,
  payload: Record<string, unknown>
): Promise<void> {
  // This would integrate with email service (SendGrid, Mailgun, etc.)
  // and SMS service (Twilio, etc.) for immediate notifications
  
  const communicationPrefs = user.toJSON().communication_preferences as Record<string, boolean>
  
  // Email notification
  if (communicationPrefs.email && user.email) {
    // TODO: Integrate with email service
    console.log(`Would send email to ${user.email}:`, payload)
  }
  
  // SMS notification
  if (communicationPrefs.sms && user.phone) {
    // TODO: Integrate with SMS service
    console.log(`Would send SMS to ${user.phone}:`, payload)
  }
  
  // Push notification
  if (communicationPrefs.push) {
    // TODO: Integrate with push notification service
    console.log(`Would send push notification to user ${user.id}:`, payload)
  }
}