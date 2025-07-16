import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { leadScoringEngine, TierChangeResult } from '../../src/lib/lead-scoring-engine'
import { supabase } from '../../lib/supabase'

interface UpdateLeadScoreRequest {
  userId: string
  triggerSequences?: boolean
}

interface UpdateLeadScoreResponse {
  success: boolean
  userId: string
  tierChange?: TierChangeResult
  error?: string
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Request body is required' 
        })
      }
    }

    const { userId, triggerSequences = true }: UpdateLeadScoreRequest = JSON.parse(event.body)

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'userId is required' 
        })
      }
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        })
      }
    }

    // Update lead score
    const tierChangeResult = await leadScoringEngine.updateLeadScore(userId)

    // If tier changed and sequences should be triggered
    if (tierChangeResult && triggerSequences) {
      // Trigger email sequences
      for (const sequence of tierChangeResult.triggeredSequences) {
        try {
          await fetch(`${process.env.URL}/.netlify/functions/trigger-email-sequence`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId,
              sequenceType: sequence,
              tierChange: {
                from: tierChangeResult.previousTier,
                to: tierChangeResult.newTier,
                score: tierChangeResult.totalScore
              }
            })
          })
        } catch (error) {
          console.error(`Failed to trigger sequence ${sequence} for user ${userId}:`, error)
        }
      }

      // Update personalization settings
      try {
        await supabase
          .from('users')
          .update({
            personalization_settings: {
              tier: tierChangeResult.newTier,
              updates: tierChangeResult.personalizationUpdates,
              lastUpdated: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
      } catch (error) {
        console.error(`Failed to update personalization for user ${userId}:`, error)
      }
    }

    const response: UpdateLeadScoreResponse = {
      success: true,
      userId,
      tierChange: tierChangeResult || undefined
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    }

  } catch (error) {
    console.error('Error updating lead score:', error)

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}