"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Eye,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { analyticsEngine, AnalyticsMetrics, ABTest, CohortAnalysis } from '@/lib/analytics-engine'

interface AnalyticsDashboardProps {
  className?: string
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType<any>
  format?: 'number' | 'percentage' | 'currency' | 'duration'
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null)
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [cohorts, setCohorts] = useState<CohortAnalysis[]>([])
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'funnels' | 'abtest' | 'cohorts' | 'realtime'>('overview')

  useEffect(() => {
    loadAnalyticsData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadRealTimeData()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [dateRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      if (!analyticsEngine) {
        console.warn('Analytics engine not available on server side')
        return
      }

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
          startDate.setFullYear(2020) // Set to far past
          break
      }

      const range = dateRange === 'all' ? undefined : { start: startDate, end: endDate }
      
      // Load analytics data
      const analyticsMetrics = analyticsEngine.getMetrics(range)
      const cohortData = analyticsEngine.generateCohortAnalysis()
      
      setMetrics(analyticsMetrics)
      setCohorts(cohortData)
      
      // Load A/B tests (mock for now)
      setAbTests([])
      
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRealTimeData = () => {
    if (!analyticsEngine) return
    const realTime = analyticsEngine.getRealTimeMetrics()
    setRealTimeMetrics(realTime)
  }

  const exportData = () => {
    if (!analyticsEngine) return
    const data = analyticsEngine.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatValue = (value: number, format: MetricCard['format'] = 'number'): string => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'duration':
        return `${Math.round(value)}s`
      default:
        return value.toLocaleString()
    }
  }

  const getChangeIcon = (changeType: MetricCard['changeType']) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'decrease':
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const metricCards: MetricCard[] = metrics ? [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      change: 15.2,
      changeType: 'increase',
      icon: Users,
      format: 'number'
    },
    {
      title: 'Page Views',
      value: metrics.pageViews,
      change: 8.1,
      changeType: 'increase',
      icon: Eye,
      format: 'number'
    },
    {
      title: 'Conversion Rate',
      value: metrics.conversionRate,
      change: -2.3,
      changeType: 'decrease',
      icon: Target,
      format: 'percentage'
    },
    {
      title: 'Avg Session Duration',
      value: metrics.avgSessionDuration,
      change: 12.5,
      changeType: 'increase',
      icon: Activity,
      format: 'duration'
    },
    {
      title: 'Bounce Rate',
      value: metrics.bounceRate,
      change: -5.2,
      changeType: 'increase', // Lower bounce rate is good
      icon: TrendingUp,
      format: 'percentage'
    },
    {
      title: 'Revenue Attribution',
      value: metrics.revenueAttribution,
      change: 24.1,
      changeType: 'increase',
      icon: TrendingUp,
      format: 'currency'
    }
  ] : []

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into user behavior and platform performance
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Selector */}
          <div className="flex rounded-lg border border-border bg-card p-1">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as any)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  dateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'funnels', label: 'Conversion Funnels', icon: LineChart },
            { id: 'abtest', label: 'A/B Testing', icon: PieChart },
            { id: 'cohorts', label: 'Cohort Analysis', icon: Calendar },
            { id: 'realtime', label: 'Real-time', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricCards.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                          </p>
                          <p className="text-2xl font-bold text-foreground mt-1">
                            {formatValue(Number(metric.value), metric.format)}
                          </p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 text-sm">
                        {getChangeIcon(metric.changeType)}
                        <span className={cn(
                          "ml-1",
                          metric.changeType === 'increase' ? "text-green-600" : 
                          metric.changeType === 'decrease' ? "text-red-600" : 
                          "text-muted-foreground"
                        )}>
                          {Math.abs(metric.change)}% vs last period
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Tool Usage Chart */}
            {metrics && Object.keys(metrics.toolUsage).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tool Usage Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(metrics.toolUsage).map(([tool, data]) => (
                    <div key={tool} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {tool.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {data.users} users, {data.completions} completions
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((data.completions / Math.max(data.users, 1)) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Content Performance */}
            {metrics && Object.keys(metrics.contentPerformance).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Content Performance</h3>
                <div className="space-y-4">
                  {Object.entries(metrics.contentPerformance).slice(0, 5).map(([content, data]) => (
                    <div key={content} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground capitalize">
                          {content.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {data.views} views • {data.uniqueViews} unique • {Math.round(data.avgTimeSpent)}s avg time
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          {data.engagementScore}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Engagement Score
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === 'funnels' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Funnels</h3>
            <div className="space-y-6">
              {['Tool Conversion', 'Content Engagement', 'Full Membership'].map((funnelName) => {
                try {
                  if (!analyticsEngine) {
                    return (
                      <div key={funnelName} className="border border-border rounded-lg p-4">
                        <p className="text-muted-foreground">Analytics engine not available</p>
                      </div>
                    )
                  }
                  const funnelAnalysis = analyticsEngine.analyzeFunnel(funnelName)
                  return (
                    <div key={funnelName} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-foreground">{funnelName}</h4>
                        <span className="text-sm text-muted-foreground">
                          {funnelAnalysis.totalConversionRate.toFixed(1)}% total conversion
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {funnelAnalysis.analysis.map((step, index) => (
                          <div key={step.step} className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-foreground">{step.step}</span>
                                <span className="text-sm text-muted-foreground">
                                  {step.users} users ({step.conversionRate.toFixed(1)}%)
                                </span>
                              </div>
                              {index > 0 && (
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${step.conversionRate}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } catch (error) {
                  return (
                    <div key={funnelName} className="border border-border rounded-lg p-4">
                      <p className="text-muted-foreground">No data available for {funnelName}</p>
                    </div>
                  )
                }
              })}
            </div>
          </Card>
        )}

        {activeTab === 'abtest' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">A/B Testing</h3>
              <Button size="sm">
                Create New Test
              </Button>
            </div>
            
            <div className="text-center py-12">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No A/B Tests Running</p>
              <p className="text-muted-foreground mb-4">
                Start testing different variations to optimize your conversion rates
              </p>
              <Button>
                Create Your First Test
              </Button>
            </div>
          </Card>
        )}

        {activeTab === 'cohorts' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cohort Analysis</h3>
            
            {cohorts.length > 0 ? (
              <div className="space-y-4">
                {cohorts.slice(0, 6).map((cohort) => (
                  <div key={cohort.cohortDate} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">
                        Cohort: {cohort.cohortDate}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {cohort.size} users • ${cohort.revenue.perUser.toFixed(2)} avg revenue
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Week 1</p>
                        <p className="font-medium">{cohort.retention.week1.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Week 2</p>
                        <p className="font-medium">{cohort.retention.week2.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Week 3</p>
                        <p className="font-medium">{cohort.retention.week3.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Week 4</p>
                        <p className="font-medium">{cohort.retention.week4.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Month 2</p>
                        <p className="font-medium">{cohort.retention.month2.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Month 3</p>
                        <p className="font-medium">{cohort.retention.month3.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Month 6</p>
                        <p className="font-medium">{cohort.retention.month6.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">No Cohort Data Available</p>
                <p className="text-muted-foreground">
                  Cohort analysis will appear as user data accumulates over time
                </p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'realtime' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Real-time Activity</h3>
              
              {realTimeMetrics ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-lg font-bold text-green-600">{realTimeMetrics.activeUsers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium">Page Views (30m)</span>
                    <span className="text-lg font-bold text-blue-600">{realTimeMetrics.currentPageViews}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium">Conversions (30m)</span>
                    <span className="text-lg font-bold text-purple-600">{realTimeMetrics.realtimeConversions}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading real-time data...</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Pages (30m)</h3>
              
              {realTimeMetrics?.topPages?.length > 0 ? (
                <div className="space-y-3">
                  {realTimeMetrics.topPages.slice(0, 5).map((page: any, index: number) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <span className="text-sm text-foreground truncate flex-1">
                        {page.page || 'Unknown'}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground ml-2">
                        {page.views}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent page activity</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}