'use client'

import { useState, useEffect, useCallback } from 'react'
import { leadScoringService, type LeadProfile } from '@/lib/lead-scoring-service'

// Types for admin data
export interface AdminDashboardData {
  leads: LeadProfile[]
  analytics: {
    totalLeads: number
    conversionRate: number
    avgEngagementScore: number
    totalRevenue: number
    trends: {
      leads: number
      conversion: number
      engagement: number
      revenue: number
    }
  }
  recentActivity: {
    id: string
    type: 'lead_created' | 'status_change' | 'tool_completion' | 'conversion'
    description: string
    timestamp: string
    userId?: string
  }[]
}

export interface UseAdminDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useAdminData(options: UseAdminDataOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options
  
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate mock data - in production this would come from API
      const mockData: AdminDashboardData = {
        leads: generateMockLeads(50),
        analytics: {
          totalLeads: 1247,
          conversionRate: 12.5,
          avgEngagementScore: 68,
          totalRevenue: 45680,
          trends: {
            leads: 23,
            conversion: -5,
            engagement: 8,
            revenue: 15
          }
        },
        recentActivity: generateMockActivity(20)
      }

      setData(mockData)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchAdminData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchAdminData])

  const refresh = useCallback(() => {
    fetchAdminData()
  }, [fetchAdminData])

  return {
    data,
    isLoading,
    error,
    lastRefresh,
    refresh
  }
}

// Mock data generators
function generateMockLeads(count: number): LeadProfile[] {
  const statuses = ['visitor', 'cold_lead', 'candidate', 'hot_lead'] as const
  const sources = ['organic', 'paid_ads', 'social', 'referral', 'direct']
  const names = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
    'Lisa Davis', 'Tom Miller', 'Amy Garcia', 'Chris Anderson', 'Emma Taylor'
  ]

  return Array.from({ length: count }, (_, index) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const baseScore = {
      visitor: Math.random() * 15,
      cold_lead: 15 + Math.random() * 60,
      candidate: 75 + Math.random() * 75,
      hot_lead: 150 + Math.random() * 100
    }[randomStatus]

    return {
      id: `lead-${index + 1}`,
      status: randomStatus,
      engagementScore: Math.round(baseScore),
      demographicScore: Math.round(Math.random() * 100),
      behavioralScore: Math.round(Math.random() * 150),
      conversionReadiness: Math.round(Math.random() * 100),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      attributionData: {
        platform: Math.random() > 0.5 ? 'facebook' : 'google',
        referrer: 'https://example.com'
      },
      activities: [],
      predictions: {
        conversionProbability: Math.random(),
        timeToConversion: Math.floor(Math.random() * 30) + 1,
        bestConversionPath: ['tool_usage', 'email_verified'],
        nextBestAction: 'Complete profile',
        riskOfChurn: Math.random()
      },
      // Additional fields for admin display
      email: `user${index + 1}@example.com`,
      name: names[index % names.length],
      phone: Math.random() > 0.7 ? `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      toolsCompleted: Math.floor(Math.random() * 5),
      totalTimeOnSite: Math.floor(Math.random() * 3600), // seconds
    } as LeadProfile & {
      email: string
      name: string
      phone?: string
      createdAt: string
      lastSeen: string
      toolsCompleted: number
      totalTimeOnSite: number
    }
  })
}

function generateMockActivity(count: number) {
  const types = ['lead_created', 'status_change', 'tool_completion', 'conversion'] as const
  const descriptions = {
    lead_created: 'New lead registered',
    status_change: 'Lead status updated',
    tool_completion: 'Assessment tool completed',
    conversion: 'Lead converted to customer'
  }

  return Array.from({ length: count }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      id: `activity-${index + 1}`,
      type,
      description: descriptions[type],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      userId: `user-${Math.floor(Math.random() * 100) + 1}`
    }
  })
}

// Hook for specific admin features
export function useLeadManagement() {
  const [leads, setLeads] = useState<LeadProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const updateLeadStatus = useCallback(async (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus as any }
        : lead
    ))
  }, [])

  const deleteLead = useCallback(async (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
  }, [])

  useEffect(() => {
    // Fetch leads data
    const fetchLeads = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLeads(generateMockLeads(25))
      setIsLoading(false)
    }
    fetchLeads()
  }, [])

  return {
    leads,
    isLoading,
    updateLeadStatus,
    deleteLead
  }
}

export function useAnalytics(timeRange: '7d' | '30d' | '90d' = '30d') {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock analytics data based on time range
      const mockAnalytics = {
        conversionFunnel: {
          visitors: 2500,
          coldLeads: 1650,
          candidates: 620,
          hotLeads: 175,
          conversions: 45
        },
        engagementMetrics: {
          avgTimeOnSite: 480, // seconds
          toolCompletionRate: 0.67,
          returnVisitorRate: 0.34
        },
        chartData: Array.from({ length: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90 }, (_, i) => ({
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          leads: Math.floor(Math.random() * 20) + 5,
          conversions: Math.floor(Math.random() * 5) + 1,
          revenue: Math.floor(Math.random() * 2000) + 500
        })).reverse()
      }
      
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }
    
    fetchAnalytics()
  }, [timeRange])

  return { analytics, isLoading }
}