"use client"

/**
 * Comprehensive Analytics Engine for Galaxy Kiro
 * 
 * This service provides:
 * - Real-time user behavior analytics
 * - Conversion funnel tracking
 * - A/B testing metrics
 * - Tool usage analytics  
 * - Revenue attribution
 * - Predictive scoring
 * - Cohort analysis
 */

interface UserEvent {
  id: string
  userId?: string
  sessionId: string
  type: 'page_view' | 'tool_use' | 'content_view' | 'cta_click' | 'form_submit' | 'conversion' | 'exit'
  category: 'engagement' | 'conversion' | 'retention' | 'acquisition'
  action: string
  label?: string
  value?: number
  timestamp: number
  metadata: {
    page?: string
    tool?: string
    content?: string
    source?: string
    medium?: string
    campaign?: string
    device?: string
    browser?: string
    location?: string
    duration?: number
    scrollDepth?: number
    exitIntent?: boolean
    abTest?: string
    abVariant?: string
  }
}

interface ConversionFunnel {
  name: string
  steps: {
    name: string
    eventType: string
    criteria: Record<string, any>
  }[]
}

interface AnalyticsMetrics {
  // Traffic Metrics
  totalUsers: number
  newUsers: number
  returningUsers: number
  sessions: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number
  
  // Conversion Metrics
  conversions: number
  conversionRate: number
  goalCompletions: Record<string, number>
  revenueAttribution: number
  
  // Tool Metrics
  toolUsage: Record<string, {
    users: number
    sessions: number
    completions: number
    avgDuration: number
    dropOffRate: number
  }>
  
  // Content Metrics
  contentPerformance: Record<string, {
    views: number
    uniqueViews: number
    avgTimeSpent: number
    shareRate: number
    engagementScore: number
  }>
  
  // Behavioral Metrics
  userJourney: {
    commonPaths: string[][]
    dropOffPoints: string[]
    conversionPaths: string[][]
  }
  
  // Predictive Metrics
  leadScore: number
  churnRisk: number
  lifetimeValue: number
}

interface CohortAnalysis {
  cohortDate: string
  size: number
  retention: {
    week1: number
    week2: number
    week3: number
    week4: number
    month2: number
    month3: number
    month6: number
  }
  revenue: {
    total: number
    perUser: number
    month1: number
    month2: number
    month3: number
  }
}

interface ABTestVariant {
  id: string
  name: string
  description: string
  traffic: number // percentage 0-100
  conversions: number
  participants: number
  conversionRate: number
  confidence: number
  isWinner: boolean
}

interface ABTest {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate: string
  endDate?: string
  goal: string
  variants: ABTestVariant[]
  significance: number
  duration: number // days
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine
  private events: UserEvent[] = []
  private funnels: ConversionFunnel[] = []
  private abTests: ABTest[] = []
  private cohorts: Map<string, CohortAnalysis> = new Map()
  
  // Conversion Funnels
  private defaultFunnels: ConversionFunnel[] = [
    {
      name: 'Tool Conversion',
      steps: [
        { name: 'Landing', eventType: 'page_view', criteria: { category: 'acquisition' } },
        { name: 'Tool View', eventType: 'page_view', criteria: { metadata: { page: 'tool' } } },
        { name: 'Tool Start', eventType: 'tool_use', criteria: { action: 'start' } },
        { name: 'Tool Complete', eventType: 'tool_use', criteria: { action: 'complete' } },
        { name: 'Soft Registration', eventType: 'conversion', criteria: { action: 'soft_member' } }
      ]
    },
    {
      name: 'Content Engagement',
      steps: [
        { name: 'Content Discovery', eventType: 'content_view', criteria: { action: 'view' } },
        { name: 'Content Engagement', eventType: 'content_view', criteria: { metadata: { duration: 30 } } },
        { name: 'CTA Click', eventType: 'cta_click', criteria: {} },
        { name: 'Lead Capture', eventType: 'form_submit', criteria: { action: 'lead_form' } }
      ]
    },
    {
      name: 'Full Membership',
      steps: [
        { name: 'Soft Member', eventType: 'conversion', criteria: { action: 'soft_member' } },
        { name: 'Tool Usage', eventType: 'tool_use', criteria: { value: 3 } },
        { name: 'Premium Content', eventType: 'content_view', criteria: { metadata: { content: 'premium' } } },
        { name: 'Upgrade Intent', eventType: 'cta_click', criteria: { action: 'upgrade' } },
        { name: 'Full Member', eventType: 'conversion', criteria: { action: 'full_member' } }
      ]
    }
  ]

  constructor() {
    this.funnels = [...this.defaultFunnels]
    this.initializeDefaultABTests()
    this.loadPersistedData()
  }

  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine()
    }
    return AnalyticsEngine.instance
  }

  // Event Tracking
  async trackEvent(event: Omit<UserEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: UserEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: Date.now()
    }

    this.events.push(fullEvent)
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]')
        existingEvents.push(fullEvent)
        
        // Keep only last 1000 events in localStorage
        if (existingEvents.length > 1000) {
          existingEvents.splice(0, existingEvents.length - 1000)
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(existingEvents))
      } catch (error) {
        console.error('Error persisting analytics event:', error)
      }
    }

    // Send to backend analytics service
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: fullEvent,
          timestamp: Date.now()
        }),
      })
    } catch (error) {
      console.error('Error sending analytics event:', error)
    }

    // Check A/B test assignments
    this.processABTestEvent(fullEvent)
    
    // Update real-time metrics
    this.updateRealTimeMetrics(fullEvent)
  }

  // Metrics Calculation
  getMetrics(dateRange?: { start: Date; end: Date }): AnalyticsMetrics {
    const filteredEvents = this.filterEventsByDate(dateRange)
    
    return {
      // Traffic Metrics
      totalUsers: this.calculateUniqueUsers(filteredEvents),
      newUsers: this.calculateNewUsers(filteredEvents),
      returningUsers: this.calculateReturningUsers(filteredEvents),
      sessions: this.calculateSessions(filteredEvents),
      pageViews: this.calculatePageViews(filteredEvents),
      avgSessionDuration: this.calculateAvgSessionDuration(filteredEvents),
      bounceRate: this.calculateBounceRate(filteredEvents),
      
      // Conversion Metrics
      conversions: this.calculateConversions(filteredEvents),
      conversionRate: this.calculateConversionRate(filteredEvents),
      goalCompletions: this.calculateGoalCompletions(filteredEvents),
      revenueAttribution: this.calculateRevenueAttribution(filteredEvents),
      
      // Tool Metrics
      toolUsage: this.calculateToolMetrics(filteredEvents),
      
      // Content Metrics
      contentPerformance: this.calculateContentMetrics(filteredEvents),
      
      // Behavioral Metrics
      userJourney: this.calculateUserJourney(filteredEvents),
      
      // Predictive Metrics
      leadScore: this.calculateLeadScore(filteredEvents),
      churnRisk: this.calculateChurnRisk(filteredEvents),
      lifetimeValue: this.calculateLifetimeValue(filteredEvents)
    }
  }

  // Funnel Analysis
  analyzeFunnel(funnelName: string, dateRange?: { start: Date; end: Date }): {
    funnel: ConversionFunnel
    analysis: {
      step: string
      users: number
      conversions: number
      conversionRate: number
      dropOff: number
      dropOffRate: number
    }[]
    totalConversionRate: number
  } {
    const funnel = this.funnels.find(f => f.name === funnelName)
    if (!funnel) {
      throw new Error(`Funnel ${funnelName} not found`)
    }

    const filteredEvents = this.filterEventsByDate(dateRange)
    const analysis = []
    let previousStepUsers = 0

    for (let i = 0; i < funnel.steps.length; i++) {
      const step = funnel.steps[i]
      const stepEvents = this.filterEventsByStep(filteredEvents, step)
      const users = this.calculateUniqueUsers(stepEvents)
      
      const conversions = i === 0 ? users : users
      const conversionRate = i === 0 ? 100 : (previousStepUsers > 0 ? (users / previousStepUsers) * 100 : 0)
      const dropOff = i === 0 ? 0 : previousStepUsers - users
      const dropOffRate = i === 0 ? 0 : (previousStepUsers > 0 ? (dropOff / previousStepUsers) * 100 : 0)

      analysis.push({
        step: step.name,
        users,
        conversions,
        conversionRate,
        dropOff,
        dropOffRate
      })

      previousStepUsers = users
    }

    const totalUsers = analysis[0]?.users || 0
    const finalUsers = analysis[analysis.length - 1]?.users || 0
    const totalConversionRate = totalUsers > 0 ? (finalUsers / totalUsers) * 100 : 0

    return {
      funnel,
      analysis,
      totalConversionRate
    }
  }

  // A/B Testing
  createABTest(test: Omit<ABTest, 'id'>): string {
    const id = `test_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const newTest: ABTest = {
      ...test,
      id,
      status: 'draft'
    }
    
    this.abTests.push(newTest)
    this.persistABTests()
    return id
  }

  getABTestAssignment(testId: string, userId: string): string | null {
    const test = this.abTests.find(t => t.id === testId && t.status === 'running')
    if (!test) return null

    // Consistent assignment based on user ID
    const hash = this.hashString(userId + testId)
    const bucket = hash % 100

    let cumulativeTraffic = 0
    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic
      if (bucket < cumulativeTraffic) {
        return variant.id
      }
    }

    return test.variants[0]?.id || null
  }

  getABTestResults(testId: string): ABTest | null {
    const test = this.abTests.find(t => t.id === testId)
    if (!test) return null

    // Calculate results for each variant
    const updatedVariants = test.variants.map(variant => {
      const variantEvents = this.events.filter(e => 
        e.metadata.abTest === testId && 
        e.metadata.abVariant === variant.id
      )
      
      const participants = this.calculateUniqueUsers(variantEvents)
      const conversions = variantEvents.filter(e => e.type === 'conversion').length
      const conversionRate = participants > 0 ? (conversions / participants) * 100 : 0

      return {
        ...variant,
        participants,
        conversions,
        conversionRate
      }
    })

    // Determine winner and statistical significance
    const bestVariant = updatedVariants.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    )

    const confidence = this.calculateStatisticalSignificance(updatedVariants)

    return {
      ...test,
      variants: updatedVariants.map(v => ({
        ...v,
        isWinner: v.id === bestVariant.id,
        confidence
      })),
      significance: confidence
    }
  }

  // Cohort Analysis
  generateCohortAnalysis(cohortType: 'weekly' | 'monthly' = 'monthly'): CohortAnalysis[] {
    const cohorts: CohortAnalysis[] = []
    const cohortMap = new Map<string, UserEvent[]>()

    // Group users by cohort date
    const userFirstSeenMap = new Map<string, number>()
    
    this.events.forEach(event => {
      if (event.userId && !userFirstSeenMap.has(event.userId)) {
        userFirstSeenMap.set(event.userId, event.timestamp)
      }
    })

    userFirstSeenMap.forEach((firstSeen, userId) => {
      const cohortDate = this.getCohortDate(new Date(firstSeen), cohortType)
      const userEvents = this.events.filter(e => e.userId === userId)
      
      if (!cohortMap.has(cohortDate)) {
        cohortMap.set(cohortDate, [])
      }
      cohortMap.get(cohortDate)!.push(...userEvents)
    })

    // Calculate retention and revenue for each cohort
    cohortMap.forEach((events, cohortDate) => {
      const users = this.calculateUniqueUsers(events)
      const cohort: CohortAnalysis = {
        cohortDate,
        size: users,
        retention: this.calculateCohortRetention(events, cohortDate, cohortType),
        revenue: this.calculateCohortRevenue(events)
      }
      
      cohorts.push(cohort)
    })

    return cohorts.sort((a, b) => new Date(b.cohortDate).getTime() - new Date(a.cohortDate).getTime())
  }

  // Real-time Analytics
  getRealTimeMetrics(): {
    activeUsers: number
    currentPageViews: number
    realtimeConversions: number
    topPages: { page: string; views: number }[]
    topSources: { source: string; users: number }[]
  } {
    const now = Date.now()
    const thirtyMinutesAgo = now - (30 * 60 * 1000)
    
    const recentEvents = this.events.filter(e => e.timestamp > thirtyMinutesAgo)
    
    return {
      activeUsers: this.calculateUniqueUsers(recentEvents),
      currentPageViews: recentEvents.filter(e => e.type === 'page_view').length,
      realtimeConversions: recentEvents.filter(e => e.type === 'conversion').length,
      topPages: this.getTopPages(recentEvents),
      topSources: this.getTopSources(recentEvents)
    }
  }

  // Export/Import Data
  exportData(dateRange?: { start: Date; end: Date }): {
    events: UserEvent[]
    metrics: AnalyticsMetrics
    cohorts: CohortAnalysis[]
    abTests: ABTest[]
  } {
    const filteredEvents = this.filterEventsByDate(dateRange)
    
    return {
      events: filteredEvents,
      metrics: this.getMetrics(dateRange),
      cohorts: this.generateCohortAnalysis(),
      abTests: this.abTests
    }
  }

  // Private Helper Methods
  private loadPersistedData(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedEvents = localStorage.getItem('analytics_events')
        if (storedEvents) {
          this.events = JSON.parse(storedEvents)
        }
        
        const storedABTests = localStorage.getItem('ab_tests')
        if (storedABTests) {
          this.abTests = [...this.abTests, ...JSON.parse(storedABTests)]
        }
      } catch (error) {
        console.error('Error loading persisted analytics data:', error)
      }
    }
  }

  private persistABTests(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ab_tests', JSON.stringify(this.abTests))
      } catch (error) {
        console.error('Error persisting A/B tests:', error)
      }
    }
  }

  private initializeDefaultABTests(): void {
    // Default A/B tests for the platform
    this.abTests = [
      {
        id: 'tool_landing_cta',
        name: 'Tool Landing CTA Test',
        description: 'Testing different CTA buttons on tool landing pages',
        status: 'running',
        startDate: new Date().toISOString(),
        goal: 'tool_start',
        variants: [
          {
            id: 'control',
            name: 'Control - "Start Assessment"',
            description: 'Original CTA button text',
            traffic: 50,
            conversions: 0,
            participants: 0,
            conversionRate: 0,
            confidence: 0,
            isWinner: false
          },
          {
            id: 'variant_a',
            name: 'Variant A - "Discover Your Potential"',
            description: 'More aspirational CTA text',
            traffic: 50,
            conversions: 0,
            participants: 0,
            conversionRate: 0,
            confidence: 0,
            isWinner: false
          }
        ],
        significance: 0,
        duration: 30
      }
    ]
  }

  private filterEventsByDate(dateRange?: { start: Date; end: Date }): UserEvent[] {
    if (!dateRange) return this.events
    
    return this.events.filter(event => {
      const eventDate = new Date(event.timestamp)
      return eventDate >= dateRange.start && eventDate <= dateRange.end
    })
  }

  private filterEventsByStep(events: UserEvent[], step: ConversionFunnel['steps'][0]): UserEvent[] {
    return events.filter(event => {
      if (event.type !== step.eventType) return false
      
      return Object.entries(step.criteria).every(([key, value]) => {
        if (key.startsWith('metadata.')) {
          const metadataKey = key.replace('metadata.', '')
          return event.metadata[metadataKey] === value
        }
        return (event as any)[key] === value
      })
    })
  }

  private calculateUniqueUsers(events: UserEvent[]): number {
    const uniqueUsers = new Set()
    events.forEach(event => {
      if (event.userId) {
        uniqueUsers.add(event.userId)
      } else {
        uniqueUsers.add(event.sessionId)
      }
    })
    return uniqueUsers.size
  }

  private calculateNewUsers(events: UserEvent[]): number {
    // Users who had their first session in this period
    const userFirstSeen = new Map<string, number>()
    
    this.events.forEach(event => {
      const userId = event.userId || event.sessionId
      if (!userFirstSeen.has(userId) || event.timestamp < userFirstSeen.get(userId)!) {
        userFirstSeen.set(userId, event.timestamp)
      }
    })

    const periodStart = Math.min(...events.map(e => e.timestamp))
    const periodEnd = Math.max(...events.map(e => e.timestamp))

    let newUsers = 0
    userFirstSeen.forEach((firstSeen, userId) => {
      if (firstSeen >= periodStart && firstSeen <= periodEnd) {
        newUsers++
      }
    })

    return newUsers
  }

  private calculateReturningUsers(events: UserEvent[]): number {
    return this.calculateUniqueUsers(events) - this.calculateNewUsers(events)
  }

  private calculateSessions(events: UserEvent[]): number {
    const sessions = new Set()
    events.forEach(event => {
      sessions.add(event.sessionId)
    })
    return sessions.size
  }

  private calculatePageViews(events: UserEvent[]): number {
    return events.filter(e => e.type === 'page_view').length
  }

  private calculateAvgSessionDuration(events: UserEvent[]): number {
    const sessionDurations = new Map<string, { start: number; end: number }>()
    
    events.forEach(event => {
      if (!sessionDurations.has(event.sessionId)) {
        sessionDurations.set(event.sessionId, { start: event.timestamp, end: event.timestamp })
      } else {
        const session = sessionDurations.get(event.sessionId)!
        session.end = Math.max(session.end, event.timestamp)
      }
    })

    const durations = Array.from(sessionDurations.values()).map(s => s.end - s.start)
    return durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length / 1000 : 0
  }

  private calculateBounceRate(events: UserEvent[]): number {
    const sessionPageViews = new Map<string, number>()
    
    events.filter(e => e.type === 'page_view').forEach(event => {
      sessionPageViews.set(event.sessionId, (sessionPageViews.get(event.sessionId) || 0) + 1)
    })

    const totalSessions = sessionPageViews.size
    const bouncedSessions = Array.from(sessionPageViews.values()).filter(count => count === 1).length
    
    return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0
  }

  private calculateConversions(events: UserEvent[]): number {
    return events.filter(e => e.type === 'conversion').length
  }

  private calculateConversionRate(events: UserEvent[]): number {
    const totalUsers = this.calculateUniqueUsers(events)
    const conversions = this.calculateConversions(events)
    return totalUsers > 0 ? (conversions / totalUsers) * 100 : 0
  }

  private calculateGoalCompletions(events: UserEvent[]): Record<string, number> {
    const goals: Record<string, number> = {}
    
    events.filter(e => e.type === 'conversion').forEach(event => {
      const goal = event.action
      goals[goal] = (goals[goal] || 0) + 1
    })

    return goals
  }

  private calculateRevenueAttribution(events: UserEvent[]): number {
    return events
      .filter(e => e.type === 'conversion' && e.value)
      .reduce((sum, e) => sum + (e.value || 0), 0)
  }

  private calculateToolMetrics(events: UserEvent[]): AnalyticsMetrics['toolUsage'] {
    const toolMetrics: AnalyticsMetrics['toolUsage'] = {}
    
    const toolEvents = events.filter(e => e.type === 'tool_use')
    const toolUsers = new Map<string, Set<string>>()
    const toolSessions = new Map<string, Set<string>>()
    
    toolEvents.forEach(event => {
      const tool = event.metadata.tool || 'unknown'
      
      if (!toolUsers.has(tool)) {
        toolUsers.set(tool, new Set())
        toolSessions.set(tool, new Set())
      }
      
      if (event.userId) toolUsers.get(tool)!.add(event.userId)
      toolSessions.get(tool)!.add(event.sessionId)
    })

    toolUsers.forEach((users, tool) => {
      const sessions = toolSessions.get(tool)!.size
      const completions = toolEvents.filter(e => 
        e.metadata.tool === tool && e.action === 'complete'
      ).length
      
      const durations = toolEvents
        .filter(e => e.metadata.tool === tool && e.metadata.duration)
        .map(e => e.metadata.duration || 0)
      
      const avgDuration = durations.length > 0 
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
        : 0

      const starts = toolEvents.filter(e => 
        e.metadata.tool === tool && e.action === 'start'
      ).length

      const dropOffRate = starts > 0 ? ((starts - completions) / starts) * 100 : 0

      toolMetrics[tool] = {
        users: users.size,
        sessions,
        completions,
        avgDuration,
        dropOffRate
      }
    })

    return toolMetrics
  }

  private calculateContentMetrics(events: UserEvent[]): AnalyticsMetrics['contentPerformance'] {
    const contentMetrics: AnalyticsMetrics['contentPerformance'] = {}
    
    const contentEvents = events.filter(e => e.type === 'content_view')
    const contentUsers = new Map<string, Set<string>>()
    
    contentEvents.forEach(event => {
      const content = event.metadata.content || 'unknown'
      
      if (!contentUsers.has(content)) {
        contentUsers.set(content, new Set())
      }
      
      if (event.userId) contentUsers.get(content)!.add(event.userId)
    })

    contentUsers.forEach((users, content) => {
      const views = contentEvents.filter(e => e.metadata.content === content).length
      const durations = contentEvents
        .filter(e => e.metadata.content === content && e.metadata.duration)
        .map(e => e.metadata.duration || 0)
      
      const avgTimeSpent = durations.length > 0 
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
        : 0

      // Mock share rate and engagement score for now
      const shareRate = Math.random() * 10
      const engagementScore = avgTimeSpent > 60 ? 85 : avgTimeSpent > 30 ? 65 : 45

      contentMetrics[content] = {
        views,
        uniqueViews: users.size,
        avgTimeSpent,
        shareRate,
        engagementScore
      }
    })

    return contentMetrics
  }

  private calculateUserJourney(events: UserEvent[]): AnalyticsMetrics['userJourney'] {
    // Simplified user journey analysis
    const sessions = new Map<string, UserEvent[]>()
    
    events.forEach(event => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, [])
      }
      sessions.get(event.sessionId)!.push(event)
    })

    const paths: string[][] = []
    const conversionPaths: string[][] = []
    
    sessions.forEach((sessionEvents, sessionId) => {
      sessionEvents.sort((a, b) => a.timestamp - b.timestamp)
      const path = sessionEvents.map(e => e.metadata.page || e.action || e.type)
      paths.push(path)
      
      if (sessionEvents.some(e => e.type === 'conversion')) {
        conversionPaths.push(path)
      }
    })

    // Find common paths (simplified)
    const pathCounts = new Map<string, number>()
    paths.forEach(path => {
      const pathString = path.join(' -> ')
      pathCounts.set(pathString, (pathCounts.get(pathString) || 0) + 1)
    })

    const commonPaths = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path]) => path.split(' -> '))

    // Find drop-off points (pages with high exit rates)
    const pageExits = new Map<string, number>()
    const pageViews = new Map<string, number>()
    
    sessions.forEach(sessionEvents => {
      sessionEvents.forEach((event, index) => {
        if (event.type === 'page_view') {
          const page = event.metadata.page || 'unknown'
          pageViews.set(page, (pageViews.get(page) || 0) + 1)
          
          if (index === sessionEvents.length - 1 || event.type === 'exit') {
            pageExits.set(page, (pageExits.get(page) || 0) + 1)
          }
        }
      })
    })

    const dropOffPoints = Array.from(pageExits.entries())
      .map(([page, exits]) => ({
        page,
        exitRate: pageViews.get(page) ? (exits / pageViews.get(page)!) * 100 : 0
      }))
      .sort((a, b) => b.exitRate - a.exitRate)
      .slice(0, 5)
      .map(item => item.page)

    return {
      commonPaths,
      dropOffPoints,
      conversionPaths: conversionPaths.slice(0, 5)
    }
  }

  private calculateLeadScore(events: UserEvent[]): number {
    // Simplified lead scoring based on engagement
    const engagementScore = events.reduce((score, event) => {
      switch (event.type) {
        case 'page_view': return score + 1
        case 'tool_use': return score + 5
        case 'content_view': return score + 3
        case 'cta_click': return score + 7
        case 'form_submit': return score + 10
        default: return score
      }
    }, 0)

    return Math.min(engagementScore, 100)
  }

  private calculateChurnRisk(events: UserEvent[]): number {
    // Simplified churn risk based on recency and frequency
    const now = Date.now()
    const recentEvents = events.filter(e => now - e.timestamp < 7 * 24 * 60 * 60 * 1000) // Last 7 days
    
    if (recentEvents.length === 0) return 85 // High churn risk if no recent activity
    if (recentEvents.length > 10) return 15 // Low churn risk if very active
    
    return Math.max(10, 60 - (recentEvents.length * 5))
  }

  private calculateLifetimeValue(events: UserEvent[]): number {
    // Simplified LTV calculation
    const revenue = this.calculateRevenueAttribution(events)
    const engagementScore = this.calculateLeadScore(events)
    
    // Predict LTV based on current engagement and revenue
    const predictedLTV = revenue + (engagementScore * 2)
    return Math.round(predictedLTV)
  }

  private getCohortDate(date: Date, type: 'weekly' | 'monthly'): string {
    if (type === 'weekly') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return weekStart.toISOString().split('T')[0]
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
  }

  private calculateCohortRetention(events: UserEvent[], cohortDate: string, type: 'weekly' | 'monthly'): CohortAnalysis['retention'] {
    // Simplified retention calculation
    const cohortStart = new Date(cohortDate).getTime()
    const week1 = cohortStart + (7 * 24 * 60 * 60 * 1000)
    const week2 = cohortStart + (14 * 24 * 60 * 60 * 1000)
    const week3 = cohortStart + (21 * 24 * 60 * 60 * 1000)
    const week4 = cohortStart + (28 * 24 * 60 * 60 * 1000)
    const month2 = cohortStart + (60 * 24 * 60 * 60 * 1000)
    const month3 = cohortStart + (90 * 24 * 60 * 60 * 1000)
    const month6 = cohortStart + (180 * 24 * 60 * 60 * 1000)

    const totalUsers = this.calculateUniqueUsers(events)
    
    return {
      week1: this.calculateUniqueUsers(events.filter(e => e.timestamp <= week1)) / totalUsers * 100,
      week2: this.calculateUniqueUsers(events.filter(e => e.timestamp <= week2)) / totalUsers * 100,
      week3: this.calculateUniqueUsers(events.filter(e => e.timestamp <= week3)) / totalUsers * 100,
      week4: this.calculateUniqueUsers(events.filter(e => e.timestamp <= week4)) / totalUsers * 100,
      month2: this.calculateUniqueUsers(events.filter(e => e.timestamp <= month2)) / totalUsers * 100,
      month3: this.calculateUniqueUsers(events.filter(e => e.timestamp <= month3)) / totalUsers * 100,
      month6: this.calculateUniqueUsers(events.filter(e => e.timestamp <= month6)) / totalUsers * 100
    }
  }

  private calculateCohortRevenue(events: UserEvent[]): CohortAnalysis['revenue'] {
    const revenue = this.calculateRevenueAttribution(events)
    const users = this.calculateUniqueUsers(events)
    
    return {
      total: revenue,
      perUser: users > 0 ? revenue / users : 0,
      month1: revenue * 0.4, // Simplified distribution
      month2: revenue * 0.3,
      month3: revenue * 0.3
    }
  }

  private getTopPages(events: UserEvent[]): { page: string; views: number }[] {
    const pageCounts = new Map<string, number>()
    
    events.filter(e => e.type === 'page_view').forEach(event => {
      const page = event.metadata.page || 'unknown'
      pageCounts.set(page, (pageCounts.get(page) || 0) + 1)
    })

    return Array.from(pageCounts.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  }

  private getTopSources(events: UserEvent[]): { source: string; users: number }[] {
    const sourceUsers = new Map<string, Set<string>>()
    
    events.forEach(event => {
      const source = event.metadata.source || 'direct'
      if (!sourceUsers.has(source)) {
        sourceUsers.set(source, new Set())
      }
      if (event.userId) {
        sourceUsers.get(source)!.add(event.userId)
      }
    })

    return Array.from(sourceUsers.entries())
      .map(([source, users]) => ({ source, users: users.size }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10)
  }

  private processABTestEvent(event: UserEvent): void {
    if (!event.userId || !event.metadata.abTest) return

    const testId = event.metadata.abTest
    const variantId = event.metadata.abVariant
    
    // Update A/B test metrics
    const test = this.abTests.find(t => t.id === testId)
    if (test && test.status === 'running') {
      const variant = test.variants.find(v => v.id === variantId)
      if (variant && event.type === 'conversion') {
        variant.conversions++
      }
    }
  }

  private updateRealTimeMetrics(event: UserEvent): void {
    // Update real-time metrics in localStorage for dashboard
    if (typeof window !== 'undefined') {
      try {
        const realtimeKey = 'analytics_realtime'
        const existing = JSON.parse(localStorage.getItem(realtimeKey) || '{}')
        
        existing.lastUpdate = Date.now()
        existing.recentEvents = existing.recentEvents || []
        existing.recentEvents.push(event)
        
        // Keep only last 100 events for real-time display
        if (existing.recentEvents.length > 100) {
          existing.recentEvents = existing.recentEvents.slice(-100)
        }
        
        localStorage.setItem(realtimeKey, JSON.stringify(existing))
      } catch (error) {
        console.error('Error updating real-time metrics:', error)
      }
    }
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private calculateStatisticalSignificance(variants: ABTestVariant[]): number {
    // Simplified statistical significance calculation
    if (variants.length < 2) return 0
    
    const [control, variant] = variants.slice(0, 2)
    
    if (control.participants < 100 || variant.participants < 100) {
      return 0 // Need minimum sample size
    }
    
    const controlRate = control.conversionRate / 100
    const variantRate = variant.conversionRate / 100
    
    // Simplified confidence calculation
    const diff = Math.abs(variantRate - controlRate)
    const pooledRate = (control.conversions + variant.conversions) / 
                      (control.participants + variant.participants)
    
    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) * 
      (1/control.participants + 1/variant.participants)
    )
    
    const zScore = diff / standardError
    
    // Convert z-score to confidence level (simplified)
    if (zScore > 2.58) return 99
    if (zScore > 1.96) return 95
    if (zScore > 1.645) return 90
    return Math.round(Math.min(zScore * 50, 85))
  }
}

// Export singleton instance (only on client)
export const analyticsEngine = typeof window !== 'undefined' ? AnalyticsEngine.getInstance() : null as any

// Export types
export type {
  UserEvent,
  AnalyticsMetrics,
  ConversionFunnel,
  ABTest,
  ABTestVariant,
  CohortAnalysis
}