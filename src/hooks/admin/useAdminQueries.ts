'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { LeadProfile } from '@/lib/lead-scoring-service'

// Types
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

export interface AnalyticsData {
  conversionFunnel: {
    visitors: number
    coldLeads: number
    candidates: number
    hotLeads: number
    conversions: number
  }
  engagementMetrics: {
    avgTimeOnSite: number
    toolCompletionRate: number
    returnVisitorRate: number
  }
  chartData: {
    date: string
    leads: number
    conversions: number
    revenue: number
  }[]
}

// API functions (these would typically be in a separate API layer)
const adminApi = {
  async getDashboardData(): Promise<AdminDashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate mock data - in production this would be real API call
    return {
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
  },

  async getLeads(): Promise<LeadProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return generateMockLeads(25)
  },

  async getAnalytics(timeRange: '7d' | '30d' | '90d'): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    return {
      conversionFunnel: {
        visitors: 2500,
        coldLeads: 1650,
        candidates: 620,
        hotLeads: 175,
        conversions: 45
      },
      engagementMetrics: {
        avgTimeOnSite: 480,
        toolCompletionRate: 0.67,
        returnVisitorRate: 0.34
      },
      chartData: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        leads: Math.floor(Math.random() * 20) + 5,
        conversions: Math.floor(Math.random() * 5) + 1,
        revenue: Math.floor(Math.random() * 2000) + 500
      })).reverse()
    }
  },

  async updateLeadStatus(leadId: string, status: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    // In production, this would make an API call
    console.log(`Updated lead ${leadId} to status ${status}`)
  },

  async deleteLead(leadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    // In production, this would make an API call
    console.log(`Deleted lead ${leadId}`)
  }
}

// React Query hooks
export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: adminApi.getDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLeads() {
  return useQuery({
    queryKey: queryKeys.admin.leads,
    queryFn: adminApi.getLeads,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useAnalytics(timeRange: '7d' | '30d' | '90d' = '30d') {
  return useQuery({
    queryKey: queryKeys.admin.analytics(timeRange),
    queryFn: () => adminApi.getAnalytics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutations
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: string }) =>
      adminApi.updateLeadStatus(leadId, status),
    onSuccess: () => {
      // Invalidate and refetch leads data
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.leads })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard })
    },
    onError: (error) => {
      console.error('Failed to update lead status:', error)
    }
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (leadId: string) => adminApi.deleteLead(leadId),
    onMutate: async (leadId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.leads })
      
      // Snapshot previous value
      const previousLeads = queryClient.getQueryData(queryKeys.admin.leads)
      
      // Optimistically update
      if (previousLeads) {
        queryClient.setQueryData(
          queryKeys.admin.leads,
          (old: LeadProfile[]) => old.filter(lead => lead.id !== leadId)
        )
      }
      
      return { previousLeads }
    },
    onError: (error, leadId, context) => {
      // Rollback on error
      if (context?.previousLeads) {
        queryClient.setQueryData(queryKeys.admin.leads, context.previousLeads)
      }
      console.error('Failed to delete lead:', error)
    },
    onSettled: () => {
      // Refetch regardless of success/error
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.leads })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard })
    }
  })
}

// Background refetch hook
export function useAutoRefresh(enabled: boolean = true, interval: number = 30000) {
  const queryClient = useQueryClient()
  
  React.useEffect(() => {
    if (!enabled) return
    
    const intervalId = setInterval(() => {
      // Refetch dashboard data in background
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.dashboard,
        refetchType: 'none' // Don't trigger loading state
      })
    }, interval)
    
    return () => clearInterval(intervalId)
  }, [enabled, interval, queryClient])
}

// Mock data generators (same as before)
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
      totalTimeOnSite: Math.floor(Math.random() * 3600),
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