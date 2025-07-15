import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { UserModel } from '../../src/lib/models/user'
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
    const { userId, forceRecalculation } = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'userId is required',
        }),
      }
    }

    // Find user
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

    // Get current lead score
    let leadScore = await LeadScoresModel.findByUserId(userId)
    const previousScore = leadScore?.totalScore || 0
    const previousTier = leadScore?.tier || 'browser'

    // Calculate new score using Supabase function
    const newScore = await LeadScoresModel.calculateScore(userId)
    const newTier = await LeadScoresModel.getTierFromScore(newScore)

    // Update lead score
    await LeadScoresModel.updateScore(userId)

    // Get updated lead score
    leadScore = await LeadScoresModel.findByUserId(userId)

    // Update user engagement score and tier if changed
    await user.updateEngagementScore(newScore)
    if (newTier !== previousTier) {
      await user.updateTier(newTier)
    }

    // Get updated user data
    const updatedUser = await UserModel.findById(userId)

    // Determine if this is a significant change
    const scoreIncrease = newScore - previousScore
    const tierChanged = newTier !== previousTier
    const significantIncrease = scoreIncrease >= 10

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
          user: updatedUser?.toJSON(),
          leadScore: leadScore?.toJSON(),
          changes: {
            scoreIncrease,
            tierChanged,
            significantIncrease,
            previousScore,
            newScore,
            previousTier,
            newTier
          }
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