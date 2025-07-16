import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { leadScoringEngine } from '../../src/lib/lead-scoring-engine'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'

interface BatchUpdateRequest {
  userIds: string[]
}

interface RecalculateAllRequest {
  confirm: boolean
}

interface AnalyticsResponse {
  success: boolean
  data?: any
  error?: string
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    const path = event.path.split('/').pop()

    switch (event.httpMethod) {
      case 'GET':
        return await handleGetRequest(path, event, headers)
      case 'POST':
        return await handlePostRequest(path, event, headers)
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        }
    }
  } catch (error) {
    console.error('Error in lead scoring analytics:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

async function handleGetRequest(path: string | undefined, event: HandlerEvent, headers: any) {
  switch (path) {
    case 'analytics':
      const analytics = await leadScoringEngine.getScoringAnalytics()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: analytics })
      }

    case 'distribution':
      const distribution = await LeadScoresModel.getScoreDistribution()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: distribution })
      }

    case 'tier-progression':
      const progression = await LeadScoresModel.getTierProgressionStats()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: progression })
      }

    case 'recent-changes':
      const hours = event.queryStringParameters?.hours ? 
        parseInt(event.queryStringParameters.hours) : 24
      const recentChanges = await LeadScoresModel.findRecentTierChanges(hours)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: recentChanges.map(score => score.toJSON()) 
        })
      }

    case 'top-scores':
      const limit = event.queryStringParameters?.limit ? 
        parseInt(event.queryStringParameters.limit) : 10
      const topScores = await LeadScoresModel.findTopScores(limit)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: topScores.map(score => score.toJSON()) 
        })
      }

    case 'tier':
      const tier = event.queryStringParameters?.tier as 'browser' | 'engaged' | 'soft-member'
      if (!tier || !['browser', 'engaged', 'soft-member'].includes(tier)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Valid tier parameter required' })
        }
      }
      const tierScores = await LeadScoresModel.findByTier(tier)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: tierScores.map(score => score.toJSON()) 
        })
      }

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'Endpoint not found' })
      }
  }
}

async function handlePostRequest(path: string | undefined, event: HandlerEvent, headers: any) {
  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Request body required' })
    }
  }

  switch (path) {
    case 'batch-update':
      const { userIds }: BatchUpdateRequest = JSON.parse(event.body)
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'userIds array is required' })
        }
      }

      if (userIds.length > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Maximum 100 users per batch update' 
          })
        }
      }

      const batchResults = await leadScoringEngine.batchUpdateScores(userIds)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: {
            processed: userIds.length,
            tierChanges: batchResults.length,
            results: batchResults
          }
        })
      }

    case 'recalculate-all':
      const { confirm }: RecalculateAllRequest = JSON.parse(event.body)
      
      if (!confirm) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Confirmation required for recalculating all scores' 
          })
        }
      }

      const recalculateResults = await leadScoringEngine.recalculateAllScores()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: recalculateResults
        })
      }

    case 'calculate-score':
      const { userId } = JSON.parse(event.body)
      
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'userId is required' })
        }
      }

      const activityData = await leadScoringEngine.collectUserActivityData(userId)
      const scoreBreakdown = leadScoringEngine.calculateScore(activityData)
      const tier = leadScoringEngine.getTierFromScore(scoreBreakdown.totalScore)
      const readinessLevel = leadScoringEngine.getReadinessLevel(scoreBreakdown.totalScore)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          data: {
            userId,
            activityData,
            scoreBreakdown,
            tier,
            readinessLevel
          }
        })
      }

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'Endpoint not found' })
      }
  }
}