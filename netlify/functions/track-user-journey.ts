import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { InteractionModel } from '../../src/lib/models/interaction'
import { ContentEngagementModel } from '../../src/lib/models/content-engagement'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface UserJourneyEvent {
  eventType: 'page_view' | 'section_view' | 'scroll_depth' | 'time_on_page' | 'cta_click' | 'content_engagement' | 'tool_interaction' | 'exit_intent'
  eventData: Record<string, unknown>
  sessionId: string
  userId?: string
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  timestamp?: string
}

interface JourneyAnalytics {
  sessionDuration: number
  pageViews: number
  sectionsViewed: string[]
  toolsInteracted: string[]
  ctasClicked: string[]
  contentEngaged: string[]
  scrollDepth: number
  timeOnPage: Record<string, number>
  engagementScore: number
  conversionEvents: string[]
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
      return await handleTrackEvent(event)
    } else if (event.httpMethod === 'GET') {
      return await handleGetJourney(event)
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

async function handleTrackEvent(event: any): Promise<HandlerResponse> {
  const journeyEvent: UserJourneyEvent = JSON.parse(event.body || '{}')

  // Validate required fields
  if (!journeyEvent.eventType || !journeyEvent.sessionId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required fields',
        details: 'eventType and sessionId are required',
      }),
    }
  }

  // Create interaction record
  const interaction = await InteractionModel.create({
    user_id: journeyEvent.userId,
    session_id: journeyEvent.sessionId,
    event_type: journeyEvent.eventType,
    event_data: journeyEvent.eventData || {},
    page_url: journeyEvent.pageUrl,
    referrer: journeyEvent.referrer,
    user_agent: journeyEvent.userAgent,
    ip_address: journeyEvent.ipAddress
  })

  // Handle specific event types
  let additionalData: any = {}

  switch (journeyEvent.eventType) {
    case 'content_engagement':
      if (journeyEvent.eventData?.contentId && journeyEvent.userId) {
        const contentEngagement = await ContentEngagementModel.findOrCreate(
          journeyEvent.userId,
          journeyEvent.eventData.contentId as string,
          journeyEvent.eventData.contentType as string || 'article',
          journeyEvent.sessionId,
          journeyEvent.eventData.contentCategory as string
        )

        if (journeyEvent.eventData.timeSpent) {
          await contentEngagement.updateTimeSpent(journeyEvent.eventData.timeSpent as number)
        }
        if (journeyEvent.eventData.scrollDepth) {
          await contentEngagement.updateScrollDepth(journeyEvent.eventData.scrollDepth as number)
        }
        if (journeyEvent.eventData.interactionType) {
          await contentEngagement.incrementInteraction(journeyEvent.eventData.interactionType as string)
        }

        additionalData.contentEngagement = contentEngagement.toJSON()
      }
      break

    case 'page_view':
      // Track page view for lead scoring
      if (journeyEvent.userId) {
        await LeadScoresModel.updateScore(journeyEvent.userId)
        const leadScore = await LeadScoresModel.findByUserId(journeyEvent.userId)
        additionalData.leadScore = leadScore?.toJSON()
      }
      break

    case 'cta_click':
      // High-value interaction for lead scoring
      if (journeyEvent.userId) {
        await LeadScoresModel.updateScore(journeyEvent.userId)
        const leadScore = await LeadScoresModel.findByUserId(journeyEvent.userId)
        additionalData.leadScore = leadScore?.toJSON()
        
        // Check if this triggers a tier change
        const user = await UserModel.findById(journeyEvent.userId)
        if (user && leadScore) {
          const newTier = await LeadScoresModel.getTierFromScore(leadScore.totalScore)
          if (newTier !== user.currentTier) {
            await user.updateTier(newTier)
            additionalData.tierChanged = true
            additionalData.newTier = newTier
            additionalData.previousTier = user.currentTier
          }
        }
      }
      break

    case 'tool_interaction':
      // Track tool usage for engagement scoring
      if (journeyEvent.userId) {
        await LeadScoresModel.updateScore(journeyEvent.userId)
        const leadScore = await LeadScoresModel.findByUserId(journeyEvent.userId)
        additionalData.leadScore = leadScore?.toJSON()
      }
      break

    case 'scroll_depth':
      // Update user's last activity
      if (journeyEvent.userId) {
        const user = await UserModel.findById(journeyEvent.userId)
        if (user) {
          await user.updateEngagementScore(user.engagementScore + 0.5) // Small increment for scroll engagement
        }
      }
      break

    case 'time_on_page':
      // Significant time on page increases engagement
      if (journeyEvent.userId && journeyEvent.eventData?.timeSpent && (journeyEvent.eventData.timeSpent as number) > 300) {
        await LeadScoresModel.updateScore(journeyEvent.userId)
        const leadScore = await LeadScoresModel.findByUserId(journeyEvent.userId)
        additionalData.leadScore = leadScore?.toJSON()
      }
      break
  }

  // Calculate real-time journey analytics
  const journeyAnalytics = await calculateJourneyAnalytics(journeyEvent.sessionId, journeyEvent.userId)
  additionalData.journeyAnalytics = journeyAnalytics

  // Trigger real-time updates via Supabase
  if (journeyEvent.userId) {
    await supabase
      .channel('user-journey')
      .send({
        type: 'broadcast',
        event: 'journey-update',
        payload: {
          userId: journeyEvent.userId,
          sessionId: journeyEvent.sessionId,
          eventType: journeyEvent.eventType,
          journeyAnalytics,
          ...additionalData
        }
      })
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Journey event tracked successfully',
      data: {
        interaction: interaction.toJSON(),
        journeyAnalytics,
        ...additionalData
      },
    }),
  }
}

async function handleGetJourney(event: any): Promise<HandlerResponse> {
  const { sessionId, userId } = event.queryStringParameters || {}

  if (!sessionId && !userId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required parameters',
        details: 'Either sessionId or userId is required',
      }),
    }
  }

  let interactions: any[] = []
  let journeyAnalytics: JourneyAnalytics

  if (sessionId) {
    const sessionInteractions = await InteractionModel.findBySessionId(sessionId)
    interactions = sessionInteractions.map(i => i.toJSON())
    journeyAnalytics = await calculateJourneyAnalytics(sessionId, userId)
  } else if (userId) {
    const userInteractions = await InteractionModel.findByUserId(userId, 100)
    interactions = userInteractions.map(i => i.toJSON())
    journeyAnalytics = await calculateUserJourneyAnalytics(userId)
  } else {
    journeyAnalytics = {
      sessionDuration: 0,
      pageViews: 0,
      sectionsViewed: [],
      toolsInteracted: [],
      ctasClicked: [],
      contentEngaged: [],
      scrollDepth: 0,
      timeOnPage: {},
      engagementScore: 0,
      conversionEvents: []
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      data: {
        interactions,
        journeyAnalytics,
        sessionId,
        userId
      },
    }),
  }
}

async function calculateJourneyAnalytics(sessionId: string, userId?: string): Promise<JourneyAnalytics> {
  const interactions = await InteractionModel.findBySessionId(sessionId)
  
  const analytics: JourneyAnalytics = {
    sessionDuration: 0,
    pageViews: 0,
    sectionsViewed: [],
    toolsInteracted: [],
    ctasClicked: [],
    contentEngaged: [],
    scrollDepth: 0,
    timeOnPage: {},
    engagementScore: 0,
    conversionEvents: []
  }

  if (interactions.length === 0) return analytics

  // Calculate session duration
  const firstInteraction = interactions[interactions.length - 1]
  const lastInteraction = interactions[0]
  analytics.sessionDuration = lastInteraction.timestamp.getTime() - firstInteraction.timestamp.getTime()

  // Process each interaction
  interactions.forEach(interaction => {
    const eventData = interaction.eventData

    switch (interaction.eventType) {
      case 'page_view':
        analytics.pageViews++
        if (eventData.page_url) {
          analytics.timeOnPage[eventData.page_url as string] = 
            (analytics.timeOnPage[eventData.page_url as string] || 0) + 1
        }
        break

      case 'section_view':
        if (eventData.section && !analytics.sectionsViewed.includes(eventData.section as string)) {
          analytics.sectionsViewed.push(eventData.section as string)
        }
        break

      case 'tool_interaction':
      case 'tool_start':
      case 'tool_complete':
        if (eventData.tool_name && !analytics.toolsInteracted.includes(eventData.tool_name as string)) {
          analytics.toolsInteracted.push(eventData.tool_name as string)
        }
        if (interaction.eventType === 'tool_complete') {
          analytics.conversionEvents.push(`tool_completed:${eventData.tool_name}`)
        }
        break

      case 'cta_click':
        if (eventData.cta_id && !analytics.ctasClicked.includes(eventData.cta_id as string)) {
          analytics.ctasClicked.push(eventData.cta_id as string)
        }
        break

      case 'content_engagement':
        if (eventData.content_id && !analytics.contentEngaged.includes(eventData.content_id as string)) {
          analytics.contentEngaged.push(eventData.content_id as string)
        }
        break

      case 'scroll_depth':
        if (eventData.depth && (eventData.depth as number) > analytics.scrollDepth) {
          analytics.scrollDepth = eventData.depth as number
        }
        break

      case 'form_submission':
        analytics.conversionEvents.push(`form_submitted:${eventData.form_id}`)
        break

      case 'webinar_registration':
        analytics.conversionEvents.push(`webinar_registered:${eventData.webinar_id}`)
        break
    }
  })

  // Calculate engagement score
  analytics.engagementScore = calculateEngagementScore(analytics)

  return analytics
}

async function calculateUserJourneyAnalytics(userId: string): Promise<JourneyAnalytics> {
  const interactions = await InteractionModel.findByUserId(userId, 500)
  
  const analytics: JourneyAnalytics = {
    sessionDuration: 0,
    pageViews: 0,
    sectionsViewed: [],
    toolsInteracted: [],
    ctasClicked: [],
    contentEngaged: [],
    scrollDepth: 0,
    timeOnPage: {},
    engagementScore: 0,
    conversionEvents: []
  }

  if (interactions.length === 0) return analytics

  // Group interactions by session to calculate total session duration
  const sessionGroups = interactions.reduce((groups, interaction) => {
    if (!groups[interaction.sessionId]) {
      groups[interaction.sessionId] = []
    }
    groups[interaction.sessionId].push(interaction)
    return groups
  }, {} as Record<string, typeof interactions>)

  // Calculate total session duration across all sessions
  Object.values(sessionGroups).forEach(sessionInteractions => {
    if (sessionInteractions.length > 1) {
      const first = sessionInteractions[sessionInteractions.length - 1]
      const last = sessionInteractions[0]
      analytics.sessionDuration += last.timestamp.getTime() - first.timestamp.getTime()
    }
  })

  // Process all interactions
  interactions.forEach(interaction => {
    const eventData = interaction.eventData

    switch (interaction.eventType) {
      case 'page_view':
        analytics.pageViews++
        break

      case 'section_view':
        if (eventData.section && !analytics.sectionsViewed.includes(eventData.section as string)) {
          analytics.sectionsViewed.push(eventData.section as string)
        }
        break

      case 'tool_interaction':
      case 'tool_start':
      case 'tool_complete':
        if (eventData.tool_name && !analytics.toolsInteracted.includes(eventData.tool_name as string)) {
          analytics.toolsInteracted.push(eventData.tool_name as string)
        }
        if (interaction.eventType === 'tool_complete') {
          analytics.conversionEvents.push(`tool_completed:${eventData.tool_name}`)
        }
        break

      case 'cta_click':
        if (eventData.cta_id && !analytics.ctasClicked.includes(eventData.cta_id as string)) {
          analytics.ctasClicked.push(eventData.cta_id as string)
        }
        break

      case 'content_engagement':
        if (eventData.content_id && !analytics.contentEngaged.includes(eventData.content_id as string)) {
          analytics.contentEngaged.push(eventData.content_id as string)
        }
        break

      case 'form_submission':
        analytics.conversionEvents.push(`form_submitted:${eventData.form_id}`)
        break

      case 'webinar_registration':
        analytics.conversionEvents.push(`webinar_registered:${eventData.webinar_id}`)
        break
    }
  })

  // Get user's current lead score
  const leadScore = await LeadScoresModel.findByUserId(userId)
  analytics.engagementScore = leadScore?.totalScore || 0

  return analytics
}

function calculateEngagementScore(analytics: JourneyAnalytics): number {
  let score = 0

  // Page views (0.5 points each, max 10)
  score += Math.min(10, analytics.pageViews * 0.5)

  // Tool interactions (5 points each, max 30)
  score += Math.min(30, analytics.toolsInteracted.length * 5)

  // Content engagement (4 points each, max 20)
  score += Math.min(20, analytics.contentEngaged.length * 4)

  // CTA clicks (2 points each, max 10)
  score += Math.min(10, analytics.ctasClicked.length * 2)

  // Time on site (max 10 for 5+ minutes)
  const timeInMinutes = analytics.sessionDuration / (1000 * 60)
  if (timeInMinutes >= 5) {
    score += 10
  } else {
    score += timeInMinutes * 2
  }

  // Scroll depth (max 5)
  score += Math.min(5, analytics.scrollDepth / 20)

  // Conversion events (10 points each)
  score += analytics.conversionEvents.length * 10

  return Math.round(score)
}