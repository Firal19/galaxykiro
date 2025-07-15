import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { ToolUsageModel } from '../../src/lib/models/tool-usage'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'
import { InteractionModel } from '../../src/lib/models/interaction'
import { AssessmentSubmissionSchema } from '../../src/lib/validations'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Assessment scoring algorithms
const ASSESSMENT_CONFIGS = {
  'potential-quotient-calculator': {
    maxScore: 100,
    categories: ['growth-mindset', 'self-awareness', 'resilience', 'adaptability'],
    insights: {
      high: 'You demonstrate exceptional potential with strong growth mindset indicators.',
      medium: 'You show good potential with room for development in key areas.',
      low: 'You have untapped potential waiting to be unlocked through focused development.'
    }
  },
  'limiting-belief-identifier': {
    maxScore: 100,
    categories: ['self-worth', 'capability', 'opportunity', 'deserving'],
    insights: {
      high: 'You have identified significant limiting beliefs that may be holding you back.',
      medium: 'Some limiting beliefs are present but manageable with awareness.',
      low: 'You have relatively few limiting beliefs affecting your progress.'
    }
  },
  'breakthrough-readiness-score': {
    maxScore: 100,
    categories: ['motivation', 'commitment', 'resources', 'support'],
    insights: {
      high: 'You are highly ready for breakthrough and transformation.',
      medium: 'You are moderately ready with some preparation needed.',
      low: 'You need more preparation before attempting major breakthroughs.'
    }
  },
  'success-factor-calculator': {
    maxScore: 100,
    categories: ['habits', 'mindset', 'environment', 'skills', 'relationships'],
    insights: {
      high: 'Your success factors are well-aligned for achievement.',
      medium: 'You have good success factors with some areas to strengthen.',
      low: 'Several success factors need attention to improve your outcomes.'
    }
  },
  'habit-strength-analyzer': {
    maxScore: 100,
    categories: ['consistency', 'triggers', 'rewards', 'environment'],
    insights: {
      high: 'Your habits are strong and well-established.',
      medium: 'Your habits are developing but need reinforcement.',
      low: 'Your habits need significant strengthening and structure.'
    }
  }
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
    const { 
      userId, 
      sessionId, 
      toolId, 
      toolName, 
      responses, 
      completionRate,
      timeSpent 
    } = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!userId || !sessionId || !toolId || !toolName || !responses) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'userId, sessionId, toolId, toolName, and responses are required',
        }),
      }
    }

    // Validate assessment submission
    const validation = AssessmentSubmissionSchema.safeParse({
      toolName,
      responses,
      completionRate: completionRate || 1.0
    })

    if (!validation.success) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Validation failed',
          details: validation.error.issues,
        }),
      }
    }

    // Find or create tool usage record
    let toolUsage = await ToolUsageModel.findById(toolId)
    
    if (!toolUsage) {
      // Create new tool usage record
      toolUsage = await ToolUsageModel.create({
        user_id: userId,
        tool_id: toolId,
        tool_name: toolName,
        responses: responses,
        completion_rate: completionRate || 1.0,
        time_spent: timeSpent || 0
      })
    } else {
      // Update existing tool usage
      await toolUsage.updateProgress(responses, completionRate || 1.0, timeSpent || 0)
    }

    // Calculate scores and generate insights
    const assessmentConfig = ASSESSMENT_CONFIGS[toolName as keyof typeof ASSESSMENT_CONFIGS]
    let scores = { total: 0, breakdown: {} as Record<string, number> }
    let insights: Array<{ category: string; message: string; recommendation: string }> = []

    if (assessmentConfig) {
      // Calculate scores based on responses
      scores = calculateAssessmentScores(responses, assessmentConfig)
      
      // Generate personalized insights
      insights = generatePersonalizedInsights(scores, assessmentConfig, toolName)
    }

    // Complete the assessment if completion rate is 1.0
    if ((completionRate || 1.0) >= 1.0) {
      await toolUsage.completeAssessment(scores, insights)
      
      // Track completion interaction
      await InteractionModel.create({
        user_id: userId,
        session_id: sessionId,
        event_type: 'tool_complete',
        event_data: {
          tool_id: toolId,
          tool_name: toolName,
          completion_rate: completionRate || 1.0,
          time_spent: timeSpent || 0,
          total_score: scores.total
        }
      })
    } else {
      // Track progress interaction
      await InteractionModel.create({
        user_id: userId,
        session_id: sessionId,
        event_type: 'tool_progress',
        event_data: {
          tool_id: toolId,
          tool_name: toolName,
          completion_rate: completionRate || 0,
          time_spent: timeSpent || 0
        }
      })
    }

    // Update lead score
    await LeadScoresModel.updateScore(userId)

    // Get updated data
    const updatedToolUsage = await ToolUsageModel.findById(toolUsage.id)
    const leadScore = await LeadScoresModel.findByUserId(userId)
    const user = await UserModel.findById(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Assessment processed successfully',
        data: {
          toolUsage: updatedToolUsage?.toJSON(),
          scores,
          insights,
          leadScore: leadScore?.toJSON(),
          user: user?.toJSON(),
          isCompleted: (completionRate || 1.0) >= 1.0
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

// Helper function to calculate assessment scores
function calculateAssessmentScores(
  responses: any[], 
  config: typeof ASSESSMENT_CONFIGS[keyof typeof ASSESSMENT_CONFIGS]
): { total: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {}
  let totalScore = 0

  // Initialize category scores
  config.categories.forEach(category => {
    breakdown[category] = 0
  })

  // Calculate scores based on responses
  responses.forEach((response, index) => {
    const categoryIndex = index % config.categories.length
    const category = config.categories[categoryIndex]
    
    let responseScore = 0
    
    if (typeof response.response === 'number') {
      responseScore = response.response
    } else if (typeof response.response === 'string') {
      // Convert string responses to numeric scores
      const value = response.response.toLowerCase()
      if (value.includes('strongly agree') || value.includes('always')) {
        responseScore = 5
      } else if (value.includes('agree') || value.includes('often')) {
        responseScore = 4
      } else if (value.includes('neutral') || value.includes('sometimes')) {
        responseScore = 3
      } else if (value.includes('disagree') || value.includes('rarely')) {
        responseScore = 2
      } else if (value.includes('strongly disagree') || value.includes('never')) {
        responseScore = 1
      } else {
        responseScore = 3 // Default neutral
      }
    } else if (Array.isArray(response.response)) {
      responseScore = response.response.length // Score based on number of selections
    }

    breakdown[category] += responseScore
  })

  // Normalize scores to percentage
  config.categories.forEach(category => {
    const maxPossibleScore = Math.ceil(responses.length / config.categories.length) * 5
    breakdown[category] = Math.min(100, (breakdown[category] / maxPossibleScore) * 100)
    totalScore += breakdown[category]
  })

  totalScore = totalScore / config.categories.length

  return { total: Math.round(totalScore), breakdown }
}

// Helper function to generate personalized insights
function generatePersonalizedInsights(
  scores: { total: number; breakdown: Record<string, number> },
  config: typeof ASSESSMENT_CONFIGS[keyof typeof ASSESSMENT_CONFIGS],
  toolName: string
): Array<{ category: string; message: string; recommendation: string }> {
  const insights: Array<{ category: string; message: string; recommendation: string }> = []

  // Overall insight based on total score
  let overallLevel: 'high' | 'medium' | 'low' = 'low'
  if (scores.total >= 70) overallLevel = 'high'
  else if (scores.total >= 40) overallLevel = 'medium'

  insights.push({
    category: 'overall',
    message: config.insights[overallLevel],
    recommendation: getOverallRecommendation(scores.total, toolName)
  })

  // Category-specific insights
  Object.entries(scores.breakdown).forEach(([category, score]) => {
    let level: 'high' | 'medium' | 'low' = 'low'
    if (score >= 70) level = 'high'
    else if (score >= 40) level = 'medium'

    insights.push({
      category,
      message: getCategoryMessage(category, score, level),
      recommendation: getCategoryRecommendation(category, level, toolName)
    })
  })

  return insights
}

function getOverallRecommendation(score: number, toolName: string): string {
  if (score >= 70) {
    return `Excellent work! Consider exploring our advanced ${toolName.replace('-', ' ')} strategies.`
  } else if (score >= 40) {
    return `Good foundation! Focus on strengthening your weaker areas for better results.`
  } else {
    return `Great starting point! Consider our foundational development programs.`
  }
}

function getCategoryMessage(category: string, score: number, level: 'high' | 'medium' | 'low'): string {
  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  if (level === 'high') {
    return `Your ${categoryName} is a significant strength (${Math.round(score)}%).`
  } else if (level === 'medium') {
    return `Your ${categoryName} shows good potential with room for growth (${Math.round(score)}%).`
  } else {
    return `Your ${categoryName} presents an opportunity for development (${Math.round(score)}%).`
  }
}

function getCategoryRecommendation(category: string, level: 'high' | 'medium' | 'low', toolName: string): string {
  const recommendations = {
    'growth-mindset': {
      high: 'Continue challenging yourself with new learning opportunities.',
      medium: 'Practice reframing challenges as growth opportunities.',
      low: 'Start with small daily learning challenges to build your growth mindset.'
    },
    'self-awareness': {
      high: 'Use your self-awareness to mentor others and deepen your insights.',
      medium: 'Regular reflection and feedback will enhance your self-awareness.',
      low: 'Begin with daily self-reflection practices and seek feedback from others.'
    },
    'habits': {
      high: 'Your strong habits can be a model for other areas of your life.',
      medium: 'Focus on consistency and environmental design to strengthen habits.',
      low: 'Start with one small habit and use the 21-day installation process.'
    },
    'mindset': {
      high: 'Your positive mindset is a powerful asset for achieving goals.',
      medium: 'Work on maintaining your mindset during challenging times.',
      low: 'Practice daily affirmations and mindset exercises to build strength.'
    }
  }

  return recommendations[category as keyof typeof recommendations]?.[level] || 
         `Focus on developing your ${category.replace('-', ' ')} through consistent practice.`
}