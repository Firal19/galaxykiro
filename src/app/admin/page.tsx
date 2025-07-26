'use client'

import { Suspense, lazy } from 'react'
import { StatCardGrid, presetMetrics } from '@/components/admin/common/StatCard'
import { DashboardSkeleton } from '@/components/admin/common/LoadingSkeleton'
import { useAdminDashboard, useAutoRefresh, type AdminDashboardData } from '@/hooks/admin/useAdminQueries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Users, Target, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Lazy load heavy components
const RecentActivityFeed = lazy(() => import('@/components/admin/features/RecentActivityFeed'))
const QuickActionCards = lazy(() => import('@/components/admin/features/QuickActionCards'))

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useAdminDashboard()
  
  // Enable auto-refresh every 30 seconds
  useAutoRefresh(true, 30000)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error.message || 'An error occurred'}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const dashboardData = data as AdminDashboardData
  const metrics = [
    presetMetrics.leads(dashboardData?.analytics?.totalLeads || 0, dashboardData?.analytics?.trends?.leads || 0),
    presetMetrics.conversionRate(dashboardData?.analytics?.conversionRate || 0, dashboardData?.analytics?.trends?.conversion || 0),
    presetMetrics.engagement(dashboardData?.analytics?.avgEngagementScore || 0, dashboardData?.analytics?.trends?.engagement || 0),
    presetMetrics.revenue(dashboardData?.analytics?.totalRevenue || 0, '$', dashboardData?.analytics?.trends?.revenue || 0),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your leads and conversions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dataUpdatedAt && (
            <p className="text-sm text-gray-500">
              Last updated {formatDistanceToNow(new Date(dataUpdatedAt))} ago
            </p>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <StatCardGrid metrics={metrics} />

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common admin tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded" />}>
              <QuickActionCards />
            </Suspense>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded" />}>
              <RecentActivityFeed activities={dashboardData?.recentActivity || []} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Lead Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline Overview</CardTitle>
          <CardDescription>
            Current distribution of leads across different stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries({
              visitor: { label: 'Visitors', count: dashboardData?.leads?.filter(l => l.status === 'visitor').length || 0, color: 'bg-gray-500' },
              cold_lead: { label: 'Cold Leads', count: dashboardData?.leads?.filter(l => l.status === 'cold_lead').length || 0, color: 'bg-blue-500' },
              candidate: { label: 'Candidates', count: dashboardData?.leads?.filter(l => l.status === 'candidate').length || 0, color: 'bg-yellow-500' },
              hot_lead: { label: 'Hot Leads', count: dashboardData?.leads?.filter(l => l.status === 'hot_lead').length || 0, color: 'bg-red-500' }
            }).map(([key, { label, count, color }]) => (
              <div key={key} className="text-center">
                <div className={`w-full h-3 ${color} rounded-full mb-2`} />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}