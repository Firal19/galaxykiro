import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface DailyReport {
  date: string
  metrics: {
    newUsers: number
    activeUsers: number
    totalSessions: number
    averageSessionDuration: number
    pageViews: number
    toolCompletions: number
    conversionEvents: number
    tierProgressions: {
      browserToEngaged: number
      engagedToSoftMember: number
    }
    topPerformingContent: Array<{
      contentId: string
      views: number
      engagementRate: number
    }>
    conversionFunnelMetrics: {
      visitors: number
      engaged: number
      converted: number
      conversionRate: number
    }
  }
  insights: string[]
  recommendations: string[]
  alerts: string[]
}

interface WeeklyReport {
  weekStarting: string
  weekEnding: string
  summary: {
    totalUsers: number
    newUsers: number
    activeUsers: number
    retentionRate: number
    averageEngagementScore: number
    conversionRate: number
  }
  trends: {
    userGrowth: number
    engagementTrend: number
    conversionTrend: number
  }
  topPerformers: {
    tools: Array<{ name: string; completions: number; conversionRate: number }>
    content: Array<{ id: string; engagement: number; conversionRate: number }>
    ctas: Array<{ id: string; clicks: number; conversionRate: number }>
  }
  behavioralInsights: {
    commonPatterns: string[]
    optimizationOpportunities: string[]
    riskFactors: string[]
  }
  actionItems: string[]
}

interface MonthlyReport {
  month: string
  year: number
  executiveSummary: {
    totalUsers: number
    monthlyGrowth: number
    conversionRate: number
    revenueImpact: number
    keyAchievements: string[]
  }
  detailedMetrics: {
    userAcquisition: {
      newUsers: number
      acquisitionChannels: Array<{ source: string; users: number; conversionRate: number }>
    }
    engagement: {
      averageSessionDuration: number
      toolUsageRate: number
      contentConsumptionRate: number
      returnVisitorRate: number
    }
    conversion: {
      overallRate: number
      byTier: { browser: number; engaged: number; softMember: number }
      bySource: Array<{ source: string; rate: number }>
    }
  }
  strategicRecommendations: string[]
  nextMonthGoals: string[]
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    }
  }

  try {
    const { reportType, date, format = 'json' } = event.queryStringParameters || {}

    if (!reportType) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required parameter: reportType',
          details: 'Valid types: daily, weekly, monthly',
        }),
      }
    }

    let report: any

    switch (reportType) {
      case 'daily':
        report = await generateDailyReport(date)
        break
      case 'weekly':
        report = await generateWeeklyReport(date)
        break
      case 'monthly':
        report = await generateMonthlyReport(date)
        break
      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Invalid report type',
            details: 'Valid types: daily, weekly, monthly',
          }),
        }
    }

    // Handle different output formats
    if (format === 'email') {
      await sendReportByEmail(report, reportType)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Report sent by email',
          reportType,
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
        reportType,
        data: report,
        generatedAt: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error('Automated reporting error:', error)
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

async function generateDailyReport(dateString?: string): Promise<DailyReport> {
  const targetDate = dateString ? new Date(dateString) : new Date()
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  const startOfDayISO = startOfDay.toISOString()
  const endOfDayISO = endOfDay.toISOString()

  // Get new users
  const { count: newUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDayISO)
    .lte('created_at', endOfDayISO)

  // Get active users (users with interactions today)
  const { data: activeUserIds } = await supabase
    .from('interactions')
    .select('user_id')
    .gte('timestamp', startOfDayISO)
    .lte('timestamp', endOfDayISO)

  const uniqueActiveUsers = new Set(activeUserIds?.map(i => i.user_id).filter(Boolean)).size

  // Get session data
  const { data: sessionData } = await supabase
    .from('interactions')
    .select('session_id, timestamp')
    .gte('timestamp', startOfDayISO)
    .lte('timestamp', endOfDayISO)

  const uniqueSessions = new Set(sessionData?.map(i => i.session_id)).size

  // Calculate average session duration
  const sessionDurations = calculateSessionDurations(sessionData || [])
  const averageSessionDuration = sessionDurations.length > 0 
    ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length 
    : 0

  // Get page views
  const { count: pageViews } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'page_view')
    .gte('timestamp', startOfDayISO)
    .lte('timestamp', endOfDayISO)

  // Get tool completions
  const { count: toolCompletions } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'tool_complete')
    .gte('timestamp', startOfDayISO)
    .lte('timestamp', endOfDayISO)

  // Get conversion events
  const { data: conversionData } = await supabase
    .from('interactions')
    .select('event_type')
    .in('event_type', ['form_submission', 'webinar_registration', 'tool_complete'])
    .gte('timestamp', startOfDayISO)
    .lte('timestamp', endOfDayISO)

  const conversionEvents = conversionData?.length || 0

  // Get tier progressions
  const { data: tierChanges } = await supabase
    .from('lead_scores')
    .select('tier, previous_tier')
    .gte('tier_changed_at', startOfDayISO)
    .lte('tier_changed_at', endOfDayISO)

  const browserToEngaged = tierChanges?.filter(t => 
    t.previous_tier === 'browser' && t.tier === 'engaged'
  ).length || 0

  const engagedToSoftMember = tierChanges?.filter(t => 
    t.previous_tier === 'engaged' && t.tier === 'soft-member'
  ).length || 0

  // Get top performing content
  const { data: contentEngagement } = await supabase
    .from('content_engagement')
    .select('content_id, time_spent, interactions_count')
    .gte('created_at', startOfDayISO)
    .lte('created_at', endOfDayISO)

  const contentStats = aggregateContentStats(contentEngagement || [])
  const topPerformingContent = Object.entries(contentStats)
    .map(([contentId, stats]) => ({
      contentId,
      views: stats.views,
      engagementRate: stats.views > 0 ? stats.totalEngagement / stats.views : 0
    }))
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5)

  // Calculate conversion funnel
  const visitors = uniqueActiveUsers
  const engaged = tierChanges?.filter(t => t.tier !== 'browser').length || 0
  const converted = tierChanges?.filter(t => t.tier === 'soft-member').length || 0
  const conversionRate = visitors > 0 ? converted / visitors : 0

  // Generate insights and recommendations
  const insights = generateDailyInsights({
    newUsers: newUsers || 0,
    activeUsers: uniqueActiveUsers,
    conversionRate,
    toolCompletions: toolCompletions || 0,
    averageSessionDuration
  })

  const recommendations = generateDailyRecommendations({
    newUsers: newUsers || 0,
    activeUsers: uniqueActiveUsers,
    conversionRate,
    toolCompletions: toolCompletions || 0
  })

  const alerts = generateDailyAlerts({
    newUsers: newUsers || 0,
    activeUsers: uniqueActiveUsers,
    conversionRate
  })

  return {
    date: targetDate.toISOString().split('T')[0],
    metrics: {
      newUsers: newUsers || 0,
      activeUsers: uniqueActiveUsers,
      totalSessions: uniqueSessions,
      averageSessionDuration,
      pageViews: pageViews || 0,
      toolCompletions: toolCompletions || 0,
      conversionEvents,
      tierProgressions: {
        browserToEngaged,
        engagedToSoftMember
      },
      topPerformingContent,
      conversionFunnelMetrics: {
        visitors,
        engaged,
        converted,
        conversionRate
      }
    },
    insights,
    recommendations,
    alerts
  }
}

async function generateWeeklyReport(dateString?: string): Promise<WeeklyReport> {
  const targetDate = dateString ? new Date(dateString) : new Date()
  const weekStart = new Date(targetDate)
  weekStart.setDate(targetDate.getDate() - targetDate.getDay()) // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0)
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // End of week (Saturday)
  weekEnd.setHours(23, 59, 59, 999)

  const weekStartISO = weekStart.toISOString()
  const weekEndISO = weekEnd.toISOString()

  // Get previous week for comparison
  const prevWeekStart = new Date(weekStart)
  prevWeekStart.setDate(weekStart.getDate() - 7)
  const prevWeekEnd = new Date(weekEnd)
  prevWeekEnd.setDate(weekEnd.getDate() - 7)

  // Current week metrics
  const currentWeekMetrics = await getWeeklyMetrics(weekStartISO, weekEndISO)
  const previousWeekMetrics = await getWeeklyMetrics(
    prevWeekStart.toISOString(), 
    prevWeekEnd.toISOString()
  )

  // Calculate trends
  const userGrowthTrend = calculateTrend(currentWeekMetrics.newUsers, previousWeekMetrics.newUsers)
  const engagementTrend = calculateTrend(
    currentWeekMetrics.averageEngagementScore, 
    previousWeekMetrics.averageEngagementScore
  )
  const conversionTrend = calculateTrend(
    currentWeekMetrics.conversionRate, 
    previousWeekMetrics.conversionRate
  )

  // Get top performers
  const topPerformers = await getWeeklyTopPerformers(weekStartISO, weekEndISO)

  // Generate behavioral insights
  const behavioralInsights = await generateBehavioralInsights(weekStartISO, weekEndISO)

  // Generate action items
  const actionItems = generateWeeklyActionItems(currentWeekMetrics, {
    userGrowth: userGrowthTrend,
    engagement: engagementTrend,
    conversion: conversionTrend
  })

  return {
    weekStarting: weekStart.toISOString().split('T')[0],
    weekEnding: weekEnd.toISOString().split('T')[0],
    summary: currentWeekMetrics,
    trends: {
      userGrowth: userGrowthTrend,
      engagementTrend,
      conversionTrend
    },
    topPerformers,
    behavioralInsights,
    actionItems
  }
}

async function generateMonthlyReport(dateString?: string): Promise<MonthlyReport> {
  const targetDate = dateString ? new Date(dateString) : new Date()
  const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
  const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999)

  const monthStartISO = monthStart.toISOString()
  const monthEndISO = monthEnd.toISOString()

  // Get previous month for comparison
  const prevMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1)
  const prevMonthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0, 23, 59, 59, 999)

  const currentMonthMetrics = await getMonthlyMetrics(monthStartISO, monthEndISO)
  const previousMonthMetrics = await getMonthlyMetrics(
    prevMonthStart.toISOString(), 
    prevMonthEnd.toISOString()
  )

  const monthlyGrowth = calculateTrend(currentMonthMetrics.totalUsers, previousMonthMetrics.totalUsers)

  // Generate strategic recommendations
  const strategicRecommendations = generateStrategicRecommendations(currentMonthMetrics)
  const nextMonthGoals = generateNextMonthGoals(currentMonthMetrics, monthlyGrowth)

  return {
    month: monthStart.toLocaleString('default', { month: 'long' }),
    year: monthStart.getFullYear(),
    executiveSummary: {
      totalUsers: currentMonthMetrics.totalUsers,
      monthlyGrowth,
      conversionRate: currentMonthMetrics.conversionRate,
      revenueImpact: estimateRevenueImpact(currentMonthMetrics),
      keyAchievements: identifyKeyAchievements(currentMonthMetrics, previousMonthMetrics)
    },
    detailedMetrics: currentMonthMetrics,
    strategicRecommendations,
    nextMonthGoals
  }
}

// Helper functions
function calculateSessionDurations(sessionData: Array<{ session_id: string; timestamp: string }>): number[] {
  const sessionGroups: Record<string, Date[]> = {}
  
  sessionData.forEach(item => {
    if (!sessionGroups[item.session_id]) {
      sessionGroups[item.session_id] = []
    }
    sessionGroups[item.session_id].push(new Date(item.timestamp))
  })

  return Object.values(sessionGroups)
    .map(timestamps => {
      if (timestamps.length < 2) return 0
      timestamps.sort((a, b) => a.getTime() - b.getTime())
      return timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime()
    })
    .filter(duration => duration > 0)
}

function aggregateContentStats(contentData: Array<{ content_id: string; time_spent: number; interactions_count: number }>) {
  const stats: Record<string, { views: number; totalEngagement: number }> = {}
  
  contentData.forEach(item => {
    if (!stats[item.content_id]) {
      stats[item.content_id] = { views: 0, totalEngagement: 0 }
    }
    stats[item.content_id].views++
    stats[item.content_id].totalEngagement += item.time_spent + (item.interactions_count * 10)
  })

  return stats
}

function generateDailyInsights(metrics: any): string[] {
  const insights: string[] = []

  if (metrics.newUsers > 10) {
    insights.push(`Strong user acquisition with ${metrics.newUsers} new users`)
  }

  if (metrics.conversionRate > 0.1) {
    insights.push(`Above-average conversion rate of ${(metrics.conversionRate * 100).toFixed(1)}%`)
  }

  if (metrics.averageSessionDuration > 300000) {
    insights.push(`High engagement with average session duration of ${Math.round(metrics.averageSessionDuration / 60000)} minutes`)
  }

  if (metrics.toolCompletions > 20) {
    insights.push(`Strong tool engagement with ${metrics.toolCompletions} completions`)
  }

  return insights
}

function generateDailyRecommendations(metrics: any): string[] {
  const recommendations: string[] = []

  if (metrics.conversionRate < 0.05) {
    recommendations.push('Focus on improving conversion funnel optimization')
  }

  if (metrics.activeUsers < metrics.newUsers * 0.5) {
    recommendations.push('Implement user activation campaigns')
  }

  if (metrics.toolCompletions < metrics.activeUsers * 0.3) {
    recommendations.push('Promote tool usage through better onboarding')
  }

  return recommendations
}

function generateDailyAlerts(metrics: any): string[] {
  const alerts: string[] = []

  if (metrics.newUsers === 0) {
    alerts.push('⚠️ No new user acquisitions today')
  }

  if (metrics.conversionRate === 0) {
    alerts.push('⚠️ No conversions recorded today')
  }

  if (metrics.activeUsers < 5) {
    alerts.push('⚠️ Very low user activity today')
  }

  return alerts
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

async function getWeeklyMetrics(startDate: string, endDate: string) {
  // Implementation for weekly metrics aggregation
  // This would include all the weekly calculations
  return {
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    retentionRate: 0,
    averageEngagementScore: 0,
    conversionRate: 0
  }
}

async function getWeeklyTopPerformers(startDate: string, endDate: string) {
  // Implementation for weekly top performers
  return {
    tools: [],
    content: [],
    ctas: []
  }
}

async function generateBehavioralInsights(startDate: string, endDate: string) {
  // Implementation for behavioral insights
  return {
    commonPatterns: [],
    optimizationOpportunities: [],
    riskFactors: []
  }
}

function generateWeeklyActionItems(metrics: any, trends: any): string[] {
  // Implementation for weekly action items
  return []
}

async function getMonthlyMetrics(startDate: string, endDate: string) {
  // Implementation for monthly metrics
  return {
    totalUsers: 0,
    userAcquisition: {
      newUsers: 0,
      acquisitionChannels: []
    },
    engagement: {
      averageSessionDuration: 0,
      toolUsageRate: 0,
      contentConsumptionRate: 0,
      returnVisitorRate: 0
    },
    conversion: {
      overallRate: 0,
      byTier: { browser: 0, engaged: 0, softMember: 0 },
      bySource: []
    }
  }
}

function generateStrategicRecommendations(metrics: any): string[] {
  return []
}

function generateNextMonthGoals(metrics: any, growth: number): string[] {
  return []
}

function estimateRevenueImpact(metrics: any): number {
  return 0
}

function identifyKeyAchievements(current: any, previous: any): string[] {
  return []
}

async function sendReportByEmail(report: any, reportType: string): Promise<void> {
  // Implementation for email sending
  console.log(`Sending ${reportType} report by email:`, report)
}