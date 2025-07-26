import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('range') || '30d'
    const metric = searchParams.get('metric')
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case 'all':
        startDate.setFullYear(2020)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    const supabase = createSupabaseClient()

    // If specific metric requested
    if (metric) {
      const data = await getSpecificMetric(supabase, metric, startDate, endDate)
      return NextResponse.json({ data })
    }

    // Get comprehensive metrics
    const metrics = await getComprehensiveMetrics(supabase, startDate, endDate)
    
    return NextResponse.json({
      metrics,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        range: dateRange
      }
    })

  } catch (error) {
    console.error('Analytics metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    )
  }
}

async function getComprehensiveMetrics(supabase: any, startDate: Date, endDate: Date) {
  const metrics = {
    // Traffic Metrics
    totalUsers: 0,
    newUsers: 0,
    returningUsers: 0,
    sessions: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    
    // Conversion Metrics
    conversions: 0,
    conversionRate: 0,
    goalCompletions: {},
    revenueAttribution: 0,
    
    // Tool Metrics
    toolUsage: {},
    
    // Content Metrics
    contentPerformance: {},
    
    // Behavioral Metrics
    userJourney: {
      commonPaths: [],
      dropOffPoints: [],
      conversionPaths: []
    },
    
    // Predictive Metrics
    leadScore: 0,
    churnRisk: 0,
    lifetimeValue: 0
  }

  try {
    // Get basic traffic metrics
    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())

    if (!events) return metrics

    // Calculate unique users
    const uniqueUserIds = new Set()
    const uniqueSessionIds = new Set()
    const pageViews = events.filter((e: any) => e.event_type === 'page_view')
    
    events.forEach((event: any) => {
      if (event.user_id) uniqueUserIds.add(event.user_id)
      uniqueSessionIds.add(event.session_id)
    })

    metrics.totalUsers = uniqueUserIds.size
    metrics.sessions = uniqueSessionIds.size
    metrics.pageViews = pageViews.length

    // Calculate session durations
    const sessionDurations = await calculateSessionDurations(supabase, startDate, endDate)
    metrics.avgSessionDuration = sessionDurations.average

    // Calculate bounce rate
    const { data: sessionPageCounts } = await supabase
      .rpc('get_session_page_counts', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      })

    if (sessionPageCounts) {
      const totalSessions = sessionPageCounts.length
      const bouncedSessions = sessionPageCounts.filter((s: any) => s.page_count === 1).length
      metrics.bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0
    }

    // Get conversion metrics
    const { data: conversions } = await supabase
      .from('analytics_conversions')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())

    if (conversions) {
      metrics.conversions = conversions.length
      metrics.conversionRate = metrics.totalUsers > 0 ? (conversions.length / metrics.totalUsers) * 100 : 0
      metrics.revenueAttribution = conversions.reduce((sum: number, c: any) => sum + (c.value || 0), 0)
      
      // Group conversions by type
      conversions.forEach((conv: any) => {
        const conversionType = conv.conversion_type || 'unknown';
        (metrics.goalCompletions as any)[conversionType] = 
          ((metrics.goalCompletions as any)[conversionType] || 0) + 1
      })
    }

    // Get tool usage metrics
    const toolEvents = events.filter((e: any) => e.event_type === 'tool_use')
    const toolMetrics: any = {}
    
    toolEvents.forEach((event: any) => {
      const tool = event.metadata?.tool || 'unknown'
      if (!toolMetrics[tool]) {
        toolMetrics[tool] = {
          users: new Set(),
          sessions: new Set(),
          completions: 0,
          durations: [],
          starts: 0
        }
      }
      
      if (event.user_id) toolMetrics[tool].users.add(event.user_id)
      toolMetrics[tool].sessions.add(event.session_id)
      
      if (event.action === 'complete') toolMetrics[tool].completions++
      if (event.action === 'start') toolMetrics[tool].starts++
      if (event.metadata?.duration) toolMetrics[tool].durations.push(event.metadata.duration)
    })

    // Process tool metrics
    Object.keys(toolMetrics).forEach(tool => {
      const data = toolMetrics[tool];
      (metrics.toolUsage as any)[tool] = {
        users: data.users.size,
        sessions: data.sessions.size,
        completions: data.completions,
        avgDuration: data.durations.length > 0 ? 
          data.durations.reduce((sum: number, d: number) => sum + d, 0) / data.durations.length : 0,
        dropOffRate: data.starts > 0 ? ((data.starts - data.completions) / data.starts) * 100 : 0
      }
    })

    // Get content performance
    const contentEvents = events.filter((e: any) => e.event_type === 'content_view')
    const contentMetrics: any = {}
    
    contentEvents.forEach((event: any) => {
      const content = event.metadata?.content || 'unknown'
      if (!contentMetrics[content]) {
        contentMetrics[content] = {
          views: 0,
          uniqueUsers: new Set(),
          durations: [],
          shares: 0
        }
      }
      
      contentMetrics[content].views++
      if (event.user_id) contentMetrics[content].uniqueUsers.add(event.user_id)
      if (event.metadata?.duration) contentMetrics[content].durations.push(event.metadata.duration)
    })

    // Process content metrics
    Object.keys(contentMetrics).forEach(content => {
      const contentData = contentMetrics[content];
      (metrics.contentPerformance as any)[content] = {
        views: contentData.views,
        uniqueViews: contentData.uniqueUsers.size,
        avgTimeSpent: 45, // Mock for now
        shareRate: Math.random() * 10, // Mock for now
        engagementScore: 75 // Mock for now
      }
    })

    // Calculate new vs returning users
    const { data: userFirstSeen } = await supabase
      .rpc('get_user_first_seen_dates')

    if (userFirstSeen) {
      const newUsersInPeriod = userFirstSeen.filter((u: any) => {
        const firstSeen = new Date(u.first_seen)
        return firstSeen >= startDate && firstSeen <= endDate
      }).length
      
      metrics.newUsers = newUsersInPeriod
      metrics.returningUsers = metrics.totalUsers - newUsersInPeriod
    }

    // Simple predictive metrics (mock calculations)
    metrics.leadScore = Math.min(events.length * 2, 100)
    metrics.churnRisk = events.length < 5 ? 75 : events.length < 15 ? 45 : 25
    metrics.lifetimeValue = metrics.revenueAttribution + (metrics.leadScore * 1.5)

  } catch (error) {
    console.error('Error calculating comprehensive metrics:', error)
  }

  return metrics
}

async function getSpecificMetric(supabase: any, metric: string, startDate: Date, endDate: Date) {
  switch (metric) {
    case 'realtime':
      return await getRealTimeMetrics(supabase)
    
    case 'funnels':
      return await getFunnelMetrics(supabase, startDate, endDate)
    
    case 'cohorts':
      return await getCohortMetrics(supabase)
    
    case 'abtests':
      return await getABTestMetrics(supabase, startDate, endDate)
    
    default:
      return null
  }
}

async function getRealTimeMetrics(supabase: any) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  
  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('timestamp', thirtyMinutesAgo.toISOString())

  if (!recentEvents) return { activeUsers: 0, currentPageViews: 0, realtimeConversions: 0 }

  const activeUsers = new Set()
  let pageViews = 0
  let conversions = 0

  recentEvents.forEach((event: any) => {
    if (event.user_id) activeUsers.add(event.user_id)
    if (event.event_type === 'page_view') pageViews++
    if (event.event_type === 'conversion') conversions++
  })

  return {
    activeUsers: activeUsers.size,
    currentPageViews: pageViews,
    realtimeConversions: conversions,
    topPages: await getTopPages(supabase, thirtyMinutesAgo),
    topSources: await getTopSources(supabase, thirtyMinutesAgo)
  }
}

async function getFunnelMetrics(supabase: any, startDate: Date, endDate: Date) {
  // Simplified funnel analysis
  const funnels = [
    {
      name: 'Tool Conversion',
      steps: ['page_view', 'tool_use', 'conversion']
    },
    {
      name: 'Content Engagement', 
      steps: ['content_view', 'cta_click', 'form_submit']
    }
  ]

  const results = []

  for (const funnel of funnels) {
    const analysis = []
    let previousUsers = 0

    for (let i = 0; i < funnel.steps.length; i++) {
      const step = funnel.steps[i]
      
      const { data: stepEvents } = await supabase
        .from('analytics_events')
        .select('user_id, session_id')
        .eq('event_type', step)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      const users = stepEvents ? new Set(stepEvents.map((e: any) => e.user_id || e.session_id)).size : 0
      const conversionRate = i === 0 ? 100 : (previousUsers > 0 ? (users / previousUsers) * 100 : 0)

      analysis.push({
        step,
        users,
        conversionRate,
        dropOff: i === 0 ? 0 : previousUsers - users
      })

      previousUsers = users
    }

    results.push({
      name: funnel.name,
      analysis,
      totalConversionRate: analysis.length > 0 ? 
        (analysis[analysis.length - 1].users / Math.max(analysis[0].users, 1)) * 100 : 0
    })
  }

  return results
}

async function getCohortMetrics(supabase: any) {
  // Simplified cohort analysis
  const { data: cohortData } = await supabase
    .rpc('get_cohort_analysis')

  return cohortData || []
}

async function getABTestMetrics(supabase: any, startDate: Date, endDate: Date) {
  const { data: abTestData } = await supabase
    .from('analytics_ab_tests')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  return abTestData || []
}

async function calculateSessionDurations(supabase: any, startDate: Date, endDate: Date) {
  const { data: sessionDurations } = await supabase
    .rpc('calculate_session_durations', {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    })

  if (!sessionDurations || sessionDurations.length === 0) {
    return { average: 0, total: 0 }
  }

  const total = sessionDurations.reduce((sum: number, s: any) => sum + s.duration, 0)
  const average = total / sessionDurations.length

  return { average, total }
}

async function getTopPages(supabase: any, since: Date) {
  const { data: pageEvents } = await supabase
    .from('analytics_events')
    .select('metadata')
    .eq('event_type', 'page_view')
    .gte('timestamp', since.toISOString())

  if (!pageEvents) return []

  const pageCounts: Record<string, number> = {}
  pageEvents.forEach((event: any) => {
    const page = event.metadata?.page || 'unknown'
    pageCounts[page] = (pageCounts[page] || 0) + 1
  })

  return Object.entries(pageCounts)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

async function getTopSources(supabase: any, since: Date) {
  const { data: sourceEvents } = await supabase
    .from('analytics_events')
    .select('metadata, user_id, session_id')
    .gte('timestamp', since.toISOString())

  if (!sourceEvents) return []

  const sourceUsers: Record<string, Set<string>> = {}
  sourceEvents.forEach((event: any) => {
    const source = event.metadata?.source || 'direct'
    if (!sourceUsers[source]) sourceUsers[source] = new Set()
    sourceUsers[source].add(event.user_id || event.session_id)
  })

  return Object.entries(sourceUsers)
    .map(([source, users]) => ({ source, users: users.size }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 10)
}