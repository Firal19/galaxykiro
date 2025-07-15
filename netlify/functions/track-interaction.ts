import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { InteractionModel } from '../../src/lib/models/interaction'
import { ContentEngagementModel } from '../../src/lib/models/content-engagement'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { 
      eventType, 
      eventData, 
      sessionId, 
      userId, 
      pageUrl, 
      referrer, 
      userAgent,
      ipAddress 
    } = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!eventType || !sessionId) {
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
      user_id: userId,
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData || {},
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
      ip_address: ipAddress
    })

    // Handle specific event types that require additional processing
    let additionalData: any = {}

    switch (eventType) {
      case 'content_engagement':
        if (eventData?.contentId && eventData?.contentType) {
          // Create or update content engagement record
          const contentEngagement = await ContentEngagementModel.findOrCreate(
            userId,
            eventData.contentId,
            eventData.contentType,
            sessionId,
            eventData.contentCategory
          )

          // Update engagement metrics
          if (eventData.timeSpent) {
            await contentEngagement.updateTimeSpent(eventData.timeSpent)
          }
          if (eventData.scrollDepth) {
            await contentEngagement.updateScrollDepth(eventData.scrollDepth)
          }
          if (eventData.interactionType) {
            await contentEngagement.incrementInteraction(eventData.interactionType)
          }

          additionalData.contentEngagement = contentEngagement.toJSON()
        }
        break

      case 'tool_start':
      case 'tool_complete':
      case 'cta_click':
      case 'content_download':
      case 'webinar_registration':
        // These events affect lead scoring, so update if user is identified
        if (userId) {
          await LeadScoresModel.updateScore(userId)
          const leadScore = await LeadScoresModel.findByUserId(userId)
          additionalData.leadScore = leadScore?.toJSON()
        }
        break
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Interaction tracked successfully',
        data: {
          interaction: interaction.toJSON(),
          ...additionalData
        },
      }),
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