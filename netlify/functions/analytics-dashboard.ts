import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { InteractionModel } from '../../src/lib/models/interaction'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'
import { ContentEngagementModel } from '../../src/lib/models/content-engagement'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ConversionMetrics {
  totalVisitors: number
  browserToEngaged: number
  engagedToSoftMember: number
  conversionRate: number
  averageEngagementScore: number
  topPerformingCTAs: Array<{ id: string; clicks: number; conversionRate: number }>
  topPerformingTools: Array<{ name: string; completions: number; engagementScore: number }>
}

interface BehavioralPattern {
  pattern: string
  frequency: number
  conversionRate: number
  averageEngagementScore: number
  recommendedOptimizations: string[]
}

interface KPIData {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topTrafficSources: Array<{ source: string; visitors: number; conversionRate: number }>
  tierDistribution: { browser: number; engaged: number; softMember: number }
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
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
    const { type, timeRange = '7d' } = event.queryStringParameters || {}

    if (!type) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required parameter: type',
          details: 'Valid types: conversion, patterns, kpis',
        }),
      }
    }

    // Calculate time range
    const timeRangeHours = {
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30,
      '90d': 24 * 90
    }[timeRange] || 24 * 7

    const startDate = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString()

    let data: any

    switch (type) {
      case 'conversion':
        data = await getConversionMetrics(startDate)
        break
      case 'patterns':
        data = await getBehavioralPatterns(startDate)
        break
      case 'kpis':
        data = await getKPIData(startDate)
        break
      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Invalid type parameter',
            details: 'Valid types: conversion, patterns, kpis',
          }),
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
        data,
        timeRange,
        generatedAt: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error('Analytics dashboard error:', error)
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

async function getConversionMetrics(startDate: string): Promise<ConversionMetrics> {
  // Get total visitors in time range
  const { data: totalVisitorsData, error: visitorsError } = await supabase
    .from('users')
    .select('id, current_tier, created_at')
    .gte('created_at', startDate)

  if (visitorsError) {
    throw new Error(`Failed to get total visitors: ${visitorsError.message}`)
  }

  const totalVisitors = totalVisitorsData.length

  // Calculate tier conversions
  const browserToEngaged = totalVisitorsData.filter(user => 
    user.current_tier === 'engaged' || user.current_tier === 'soft-member'
  ).length

  const engagedToSoftMember = totalVisitorsData.filter(user => 
    user.current_tier === 'soft-member'
  ).length

  const conversionRate = totalVisitors > 0 ? engagedToSoftMember / totalVisitors : 0

  // Get average engagement score
  const { data: leadScoresData, error: scoresError } = await supabase
    .from('lead_scores')
    .select('total_score')
    .gte('updated_at', startDate)

  if (scoresError) {
    throw new Error(`Failed to get lead scores: ${scoresError.message}`)
  }

  const averageEngagementScore = leadScoresData.length > 0 
    ? leadScoresData.reduce((sum, score) => sum + score.total_score, 0) / leadScoresData.length 
    : 0

  // Get top performing CTAs
  const { data: ctaData, error: ctaError } = await supabase
    .from('interactions')
    .select('event_data')
    .eq('event_type', 'cta_click')
    .gte('timestamp', startDate)

  if (ctaError) {
    throw new Error(`Failed to get CTA data: ${ctaError.message}`)
  }

  const ctaStats: Record<string, { clicks: number; conversions: number }> = {}
  
  ctaData.forEach(interaction => {
    const ctaId = interaction.event_data?.cta_id as string
    if (ctaId) {
      if (!ctaStats[ctaId]) {
        ctaStats[ctaId] = { clicks: 0, conversions: 0 }
      }
      ctaStats[ctaId].clicks++
    }
  })

  const topPerformingCTAs = Object.entries(ctaStats)
    .map(([id, stats]) => ({
      id,
      clicks: stats.clicks,
      conversionRate: stats.clicks > 0 ? stats.conversions / stats.clicks : 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  // Get top performing tools
  const { data: toolData, error: toolError } = await supabase
    .from('tool_usage')
    .select('tool_name, is_completed, results')
    .gte('created_at', startDate)

  if (toolError) {
    throw new Error(`Failed to get tool data: ${toolError.message}`)
  }

  const toolStats: Record<string, { completions: number; totalEngagement: number }> = {}
  
  toolData.forEach(tool => {
    if (!toolStats[tool.tool_name]) {
      toolStats[tool.tool_name] = { completions: 0, totalEngagement: 0 }
    }
    if (tool.is_completed) {
      toolStats[tool.tool_name].completions++
      // Estimate engagement score from tool completion
      toolStats[tool.tool_name].totalEngagement += 5
    }
  })

  const topPerformingTools = Object.entries(toolStats)
    .map(([name, stats]) => ({
      name,
      completions: stats.completions,
      engagementScore: stats.completions > 0 ? stats.totalEngagement / stats.completions : 0
    }))
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 5)

  return {
    totalVisitors,
    browserToEngaged,
    engagedToSoftMember,
    conversionRate,
    averageEngagementScore,
    topPerformingCTAs,
    topPerformingTools
  }
}

async function getBehavioralPatterns(startDate: string): Promise<BehavioralPattern[]> {
  // Get user interactions to analyze patterns
  const { data: interactions, error: interactionsError } = await supabase
    .from('interactions')
    .select('user_id, event_type, event_data, timestamp')
    .gte('timestamp', startDate)
    .order('timestamp', { ascending: true })

  if (interactionsError) {
    throw new Error(`Failed to get interactions: ${interactionsError.message}`)
  }

  // Get user conversion data
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, current_tier, engagement_score')
    .gte('created_at', startDate)

  if (usersError) {
    throw new Error(`Failed to get users: ${usersError.message}`)
  }

  // Group interactions by user to identify patterns
  const userJourneys: Record<string, any[]> = {}
  interactions.forEach(interaction => {
    if (!userJourneys[interaction.user_id]) {
      userJourneys[interaction.user_id] = []
    }
    userJourneys[interaction.user_id].push(interaction)
  })

  // Analyze common patterns
  const patterns: Record<string, {
    users: string[]
    conversions: number
    totalEngagement: number
  }> = {}

  Object.entries(userJourneys).forEach(([userId, journey]) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    // Identify journey pattern
    const eventSequence = journey.map(j => j.event_type).slice(0, 5).join(' → ')
    const patternKey = eventSequence || 'single_interaction'

    if (!patterns[patternKey]) {
      patterns[patternKey] = { users: [], conversions: 0, totalEngagement: 0 }
    }

    patterns[patternKey].users.push(userId)
    patterns[patternKey].totalEngagement += user.engagement_score || 0

    if (user.current_tier === 'soft-member') {
      patterns[patternKey].conversions++
    }
  })

  // Convert to behavioral patterns with recommendations
  const behavioralPatterns: BehavioralPattern[] = Object.entries(patterns)
    .map(([pattern, data]) => {
      const frequency = data.users.length
      const conversionRate = frequency > 0 ? data.conversions / frequency : 0
      const averageEngagementScore = frequency > 0 ? data.totalEngagement / frequency : 0

      // Generate recommendations based on pattern analysis
      const recommendations = generateOptimizationRecommendations(pattern, conversionRate, averageEngagementScore)

      return {
        pattern,
        frequency,
        conversionRate,
        averageEngagementScore,
        recommendedOptimizations: recommendations
      }
    })
    .filter(p => p.frequency >= 2) // Only include patterns with at least 2 users
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10)

  return behavioralPatterns
}

async function getKPIData(startDate: string): Promise<KPIData> {
  // Get total users
  const { count: totalUsers, error: totalUsersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  if (totalUsersError) {
    throw new Error(`Failed to get total users: ${totalUsersError.message}`)
  }

  // Get active users (users with activity in the time range)
  const { count: activeUsers, error: activeUsersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('last_activity', startDate)

  if (activeUsersError) {
    throw new Error(`Failed to get active users: ${activeUsersError.message}`)
  }

  // Get new users today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const { count: newUsersToday, error: newUsersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString())

  if (newUsersError) {
    throw new Error(`Failed to get new users today: ${newUsersError.message}`)
  }

  // Get conversion rate
  const { data: tierData, error: tierError } = await supabase
    .from('users')
    .select('current_tier')
    .gte('created_at', startDate)

  if (tierError) {
    throw new Error(`Failed to get tier data: ${tierError.message}`)
  }

  const tierDistribution = {
    browser: tierData.filter(u => u.current_tier === 'browser').length,
    engaged: tierData.filter(u => u.current_tier === 'engaged').length,
    softMember: tierData.filter(u => u.current_tier === 'soft-member').length
  }

  const conversionRate = tierData.length > 0 ? tierDistribution.softMember / tierData.length : 0

  // Calculate average session duration
  const { data: sessionData, error: sessionError } = await supabase
    .from('interactions')
    .select('session_id, timestamp')
    .gte('timestamp', startDate)
    .order('timestamp', { ascending: true })

  if (sessionError) {
    throw new Error(`Failed to get session data: ${sessionError.message}`)
  }

  // Group by session and calculate durations
  const sessionDurations: Record<string, { start: Date; end: Date }> = {}
  sessionData.forEach(interaction => {
    const timestamp = new Date(interaction.timestamp)
    if (!sessionDurations[interaction.session_id]) {
      sessionDurations[interaction.session_id] = { start: timestamp, end: timestamp }
    } else {
      if (timestamp < sessionDurations[interaction.session_id].start) {
        sessionDurations[interaction.session_id].start = timestamp
      }
      if (timestamp > sessionDurations[interaction.session_id].end) {
        sessionDurations[interaction.session_id].end = timestamp
      }
    }
  })

  const sessionDurationValues = Object.values(sessionDurations)
    .map(session => session.end.getTime() - session.start.getTime())
    .filter(duration => duration > 0)

  const averageSessionDuration = sessionDurationValues.length > 0 
    ? sessionDurationValues.reduce((sum, duration) => sum + duration, 0) / sessionDurationValues.length 
    : 0

  // Calculate bounce rate (sessions with only one interaction)
  const singleInteractionSessions = Object.keys(sessionDurations).filter(sessionId => {
    const sessionInteractions = sessionData.filter(i => i.session_id === sessionId)
    return sessionInteractions.length === 1
  }).length

  const bounceRate = Object.keys(sessionDurations).length > 0 
    ? singleInteractionSessions / Object.keys(sessionDurations).length 
    : 0

  // Get top traffic sources (from attribution data in interactions)
  const { data: attributionData, error: attributionError } = await supabase
    .from('interactions')
    .select('event_data')
    .eq('event_type', 'page_view')
    .gte('timestamp', startDate)

  if (attributionError) {
    throw new Error(`Failed to get attribution data: ${attributionError.message}`)
  }

  const trafficSources: Record<string, { visitors: number; conversions: number }> = {}
  
  attributionData.forEach(interaction => {
    const attribution = interaction.event_data?.attribution as any
    if (attribution?.utmSource || attribution?.referrer) {
      const source = attribution.utmSource || new URL(attribution.referrer || 'direct').hostname || 'direct'
      if (!trafficSources[source]) {
        trafficSources[source] = { visitors: 0, conversions: 0 }
      }
      trafficSources[source].visitors++
    }
  })

  const topTrafficSources = Object.entries(trafficSources)
    .map(([source, data]) => ({
      source,
      visitors: data.visitors,
      conversionRate: data.visitors > 0 ? data.conversions / data.visitors : 0
    }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 5)

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    newUsersToday: newUsersToday || 0,
    conversionRate,
    averageSessionDuration,
    bounceRate,
    topTrafficSources,
    tierDistribution
  }
}

function generateOptimizationRecommendations(
  pattern: string, 
  conversionRate: number, 
  averageEngagementScore: number
): string[] {
  const recommendations: string[] = []

  // Low conversion rate recommendations
  if (conversionRate < 0.1) {
    recommendations.push('Add more compelling CTAs at key decision points')
    recommendations.push('Implement exit-intent popups to capture leaving visitors')
    recommendations.push('Provide more value upfront to build trust')
  }

  // Low engagement recommendations
  if (averageEngagementScore < 30) {
    recommendations.push('Improve content quality and relevance')
    recommendations.push('Add interactive elements to increase engagement')
    recommendations.push('Optimize page load times and mobile experience')
  }

  // Pattern-specific recommendations
  if (pattern.includes('page_view → page_view')) {
    recommendations.push('Add section navigation to guide users through content')
    recommendations.push('Implement progressive disclosure to maintain interest')
  }

  if (pattern.includes('tool_start') && !pattern.includes('tool_complete')) {
    recommendations.push('Simplify tool interfaces to reduce abandonment')
    recommendations.push('Add progress indicators to encourage completion')
    recommendations.push('Implement save-and-resume functionality')
  }

  if (pattern.includes('cta_click') && conversionRate < 0.2) {
    recommendations.push('A/B test CTA copy and placement')
    recommendations.push('Reduce friction in the conversion process')
    recommendations.push('Add social proof near CTAs')
  }

  // Default recommendations if none specific
  if (recommendations.length === 0) {
    recommendations.push('Monitor this pattern for optimization opportunities')
    recommendations.push('Consider A/B testing different user flows')
  }

  return recommendations.slice(0, 4) // Limit to 4 recommendations
}