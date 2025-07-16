import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'
import { InteractionModel } from '../../src/lib/models/interaction'

// Initialize Supabase client for real-time subscriptions and direct operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface EngagementUpdate {
  userId: string
  sessionId: string
  engagementType: 'page_view' | 'scroll_depth' | 'time_on_page' | 'cta_click' | 'content_engagement' | 'tool_interaction'
  engagementData: {
    pageUrl?: string
    scrollDepth?: number
    timeSpent?: number
    ctaId?: string
    contentId?: string
    toolId?: string
    interactionValue?: number
  }
  timestamp?: string
}

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
    const engagementUpdate: EngagementUpdate = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!engagementUpdate.userId || !engagementUpdate.sessionId || !engagementUpdate.engagementType) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'userId, sessionId, and engagementType are required',
        }),
      }
    }

    // Get current user
    const user = await UserModel.findById(engagementUpdate.userId)
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

    // Calculate engagement score increment based on interaction type
    let scoreIncrement = 0
    let interactionEventData: Record<string, unknown> = {}

    switch (engagementUpdate.engagementType) {
      case 'page_view':
        scoreIncrement = 0.5
        interactionEventData = {
          page_url: engagementUpdate.engagementData.pageUrl,
          engagement_value: scoreIncrement
        }
        break

      case 'scroll_depth':
        // Score based on scroll depth (max 1 point for 100% scroll)
        const scrollDepth = engagementUpdate.engagementData.scrollDepth || 0
        scoreIncrement = Math.min(1, scrollDepth / 100)
        interactionEventData = {
          scroll_depth: scrollDepth,
          page_url: engagementUpdate.engagementData.pageUrl,
          engagement_value: scoreIncrement
        }
        break

      case 'time_on_page':
        // Score based on time spent (1 point per minute, max 5 points per page)
        const timeSpent = engagementUpdate.engagementData.timeSpent || 0
        const timeInMinutes = timeSpent / 60
        scoreIncrement = Math.min(5, timeInMinutes)
        interactionEventData = {
          time_spent: timeSpent,
          time_in_minutes: timeInMinutes,
          page_url: engagementUpdate.engagementData.pageUrl,
          engagement_value: scoreIncrement
        }
        break

      case 'cta_click':
        scoreIncrement = 2
        interactionEventData = {
          cta_id: engagementUpdate.engagementData.ctaId,
          page_url: engagementUpdate.engagementData.pageUrl,
          engagement_value: scoreIncrement
        }
        break

      case 'content_engagement':
        scoreIncrement = 1.5
        interactionEventData = {
          content_id: engagementUpdate.engagementData.contentId,
          page_url: engagementUpdate.engagementData.pageUrl,
          engagement_value: scoreIncrement
        }
        break

      case 'tool_interaction':
        scoreIncrement = 3
        interactionEventData = {
          tool_id: engagementUpdate.engagementData.toolId,
          engagement_value: scoreIncrement
        }
        break

      default:
        scoreIncrement = engagementUpdate.engagementData.interactionValue || 0.5
        interactionEventData = {
          custom_engagement: true,
          engagement_value: scoreIncrement
        }
    }

    // Update user's engagement score
    const newEngagementScore = user.engagementScore + scoreIncrement
    await user.updateEngagementScore(newEngagementScore)

    // Track the engagement interaction
    await InteractionModel.create({
      user_id: engagementUpdate.userId,
      session_id: engagementUpdate.sessionId,
      event_type: 'engagement_update',
      event_data: {
        engagement_type: engagementUpdate.engagementType,
        score_increment: scoreIncrement,
        new_total_score: newEngagementScore,
        ...interactionEventData
      },
      page_url: engagementUpdate.engagementData.pageUrl,
      timestamp: engagementUpdate.timestamp || new Date().toISOString()
    })

    // Update lead score (this will recalculate based on all interactions)
    await LeadScoresModel.updateScore(engagementUpdate.userId)

    // Get updated lead score and check for tier changes
    const leadScore = await LeadScoresModel.findByUserId(engagementUpdate.userId)
    const updatedUser = await UserModel.findById(engagementUpdate.userId)

    let tierChanged = false
    let newTier = updatedUser?.currentTier
    let previousTier = user.currentTier

    if (leadScore && updatedUser) {
      const calculatedTier = await LeadScoresModel.getTierFromScore(leadScore.totalScore)
      if (calculatedTier !== updatedUser.currentTier) {
        await updatedUser.updateTier(calculatedTier)
        tierChanged = true
        newTier = calculatedTier
        previousTier = updatedUser.currentTier
      }
    }

    // Trigger real-time updates via Supabase
    await supabase
      .channel('engagement-updates')
      .send({
        type: 'broadcast',
        event: 'engagement-score-updated',
        payload: {
          userId: engagementUpdate.userId,
          sessionId: engagementUpdate.sessionId,
          engagementType: engagementUpdate.engagementType,
          scoreIncrement,
          newEngagementScore,
          leadScore: leadScore?.toJSON(),
          tierChanged,
          newTier,
          previousTier,
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
        message: 'Engagement score updated successfully',
        data: {
          userId: engagementUpdate.userId,
          engagementType: engagementUpdate.engagementType,
          scoreIncrement,
          previousScore: user.engagementScore,
          newEngagementScore,
          leadScore: leadScore?.toJSON(),
          tierChanged,
          newTier,
          previousTier,
          user: updatedUser?.toJSON()
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