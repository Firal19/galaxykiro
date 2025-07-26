"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/admin/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Target,
  Calendar as CalendarIcon,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Award,
  Zap,
  Heart,
  MessageSquare,
  Share,
  Play,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Info,
  Smartphone,
  Monitor,
  Globe,
  Mail,
  Bell,
  Settings
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    sessionDuration: string
    bounceRate: number
    conversionRate: number
    totalSessions: number
    pageViews: number
  }
  trends: {
    usersGrowth: number
    sessionsGrowth: number
    conversionGrowth: number
    engagementGrowth: number
  }
  traffic: {
    sources: Array<{
      name: string
      visitors: number
      percentage: number
      change: number
    }>
    devices: Array<{
      type: string
      count: number
      percentage: number
    }>
    locations: Array<{
      country: string
      users: number
      percentage: number
    }>
  }
  content: {
    topPages: Array<{
      path: string
      views: number
      uniqueViews: number
      averageTime: string
      bounceRate: number
    }>
    contentEngagement: Array<{
      title: string
      type: string
      views: number
      completions: number
      rating: number
      engagementRate: number
    }>
  }
  leads: {
    totalLeads: number
    qualifiedLeads: number
    hotLeads: number
    conversionsBySource: Array<{
      source: string
      leads: number
      conversion: number
    }>
    funnelStages: Array<{
      stage: string
      count: number
      conversionRate: number
      dropOff: number
    }>
  }
  tools: {
    usage: Array<{
      toolName: string
      launches: number
      completions: number
      averageScore: number
      completionRate: number
    }>
    performance: Array<{
      toolId: string
      name: string
      satisfaction: number
      retakeRate: number
      recommendationScore: number
    }>
  }
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Mock analytics data
        const mockData: AnalyticsData = {
          overview: {
            totalUsers: 15847,
            activeUsers: 8934,
            newUsers: 1247,
            sessionDuration: '5m 23s',
            bounceRate: 23.4,
            conversionRate: 12.8,
            totalSessions: 24567,
            pageViews: 89234
          },
          trends: {
            usersGrowth: 15.6,
            sessionsGrowth: 8.9,
            conversionGrowth: 23.1,
            engagementGrowth: 11.2
          },
          traffic: {
            sources: [
              { name: 'Organic Search', visitors: 6234, percentage: 39.3, change: 12.4 },
              { name: 'Direct', visitors: 4567, percentage: 28.8, change: -3.2 },
              { name: 'Social Media', visitors: 2891, percentage: 18.2, change: 45.6 },
              { name: 'Email', visitors: 1423, percentage: 9.0, change: 8.7 },
              { name: 'Referral', visitors: 732, percentage: 4.6, change: -1.2 }
            ],
            devices: [
              { type: 'Desktop', count: 9234, percentage: 58.3 },
              { type: 'Mobile', count: 5234, percentage: 33.0 },
              { type: 'Tablet', count: 1379, percentage: 8.7 }
            ],
            locations: [
              { country: 'United States', users: 5678, percentage: 35.8 },
              { country: 'United Kingdom', users: 2134, percentage: 13.5 },
              { country: 'Canada', users: 1867, percentage: 11.8 },
              { country: 'Australia', users: 1234, percentage: 7.8 },
              { country: 'Germany', users: 987, percentage: 6.2 }
            ]
          },
          content: {
            topPages: [
              { 
                path: '/', 
                views: 12345, 
                uniqueViews: 8934, 
                averageTime: '3m 42s', 
                bounceRate: 21.3 
              },
              { 
                path: '/tools/potential-quotient-calculator', 
                views: 8765, 
                uniqueViews: 6234, 
                averageTime: '8m 15s', 
                bounceRate: 15.7 
              },
              { 
                path: '/blog', 
                views: 6543, 
                uniqueViews: 4567, 
                averageTime: '2m 31s', 
                bounceRate: 35.4 
              },
              { 
                path: '/soft-member/dashboard', 
                views: 4321, 
                uniqueViews: 2891, 
                averageTime: '6m 48s', 
                bounceRate: 12.8 
              },
              { 
                path: '/tools', 
                views: 3456, 
                uniqueViews: 2234, 
                averageTime: '4m 22s', 
                bounceRate: 28.9 
              }
            ],
            contentEngagement: [
              {
                title: 'Leadership Transformation Masterclass',
                type: 'video',
                views: 2347,
                completions: 1876,
                rating: 4.8,
                engagementRate: 79.9
              },
              {
                title: 'The Psychology of Decision Making',
                type: 'article',
                views: 1834,
                completions: 1423,
                rating: 4.7,
                engagementRate: 77.6
              },
              {
                title: 'Potential Quotient Calculator',
                type: 'assessment',
                views: 3456,
                completions: 2891,
                rating: 4.9,
                engagementRate: 83.7
              }
            ]
          },
          leads: {
            totalLeads: 3847,
            qualifiedLeads: 1923,
            hotLeads: 467,
            conversionsBySource: [
              { source: 'Organic Search', leads: 1456, conversion: 23.4 },
              { source: 'Social Media', leads: 892, conversion: 30.8 },
              { source: 'Email Campaign', leads: 634, conversion: 44.6 },
              { source: 'Direct', leads: 534, conversion: 11.7 },
              { source: 'Referral', leads: 331, conversion: 45.2 }
            ],
            funnelStages: [
              { stage: 'Visitor', count: 15847, conversionRate: 100, dropOff: 0 },
              { stage: 'Lead', count: 3847, conversionRate: 24.3, dropOff: 75.7 },
              { stage: 'Qualified', count: 1923, conversionRate: 12.1, dropOff: 12.2 },
              { stage: 'Hot Lead', count: 467, conversionRate: 2.9, dropOff: 9.2 },
              { stage: 'Member', count: 234, conversionRate: 1.5, dropOff: 1.4 }
            ]
          },
          tools: {
            usage: [
              {
                toolName: 'Potential Quotient Calculator',
                launches: 3456,
                completions: 2891,
                averageScore: 87.3,
                completionRate: 83.7
              },
              {
                toolName: 'Leadership Style Profiler',
                launches: 2134,
                completions: 1745,
                averageScore: 82.1,
                completionRate: 81.8
              },
              {
                toolName: 'Transformation Readiness Score',
                launches: 1876,
                completions: 1456,
                averageScore: 74.9,
                completionRate: 77.6
              },
              {
                toolName: 'Dream Clarity Generator',
                launches: 1234,
                completions: 987,
                averageScore: 79.4,
                completionRate: 80.0
              }
            ],
            performance: [
              {
                toolId: 'pqc',
                name: 'Potential Quotient Calculator',
                satisfaction: 4.9,
                retakeRate: 23.4,
                recommendationScore: 94.2
              },
              {
                toolId: 'lsp',
                name: 'Leadership Style Profiler',
                satisfaction: 4.7,
                retakeRate: 18.9,
                recommendationScore: 89.6
              },
              {
                toolId: 'trs',
                name: 'Transformation Readiness Score',
                satisfaction: 4.6,
                retakeRate: 15.3,
                recommendationScore: 87.1
              }
            ]
          }
        }

        setAnalyticsData(mockData)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [dateRange, selectedPeriod])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const now = new Date()
    
    switch (period) {
      case '7d':
        setDateRange({ from: subDays(now, 7), to: now })
        break
      case '30d':
        setDateRange({ from: subDays(now, 30), to: now })
        break
      case '90d':
        setDateRange({ from: subDays(now, 90), to: now })
        break
      case '1y':
        setDateRange({ from: subDays(now, 365), to: now })
        break
      case 'mtd':
        setDateRange({ from: startOfMonth(now), to: now })
        break
    }
  }

  const formatChange = (value: number) => {
    const isPositive = value > 0
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600'
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{Math.abs(value)}%</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Failed to load analytics</h3>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights into user behavior, content performance, and business metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="mtd">Month to date</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => range && range.from && range.to && setDateRange({ from: range.from, to: range.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2">
              {formatChange(analyticsData.trends.usersGrowth)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalSessions.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              {formatChange(analyticsData.trends.sessionsGrowth)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              {formatChange(analyticsData.trends.conversionGrowth)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                <p className="text-2xl font-bold">{analyticsData.overview.sessionDuration}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2">
              {formatChange(analyticsData.trends.engagementGrowth)}
            </div>
          </Card>
        </motion.div>

        {/* Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="realtime">Real-time</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Additional Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Users</p>
                      <p className="text-2xl font-bold">{analyticsData.overview.newUsers.toLocaleString()}</p>
                    </div>
                    <Award className="w-8 h-8 text-cyan-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bounce Rate</p>
                      <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-red-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </Card>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">User Growth Trend</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">User growth chart would display here</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Session Analytics</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Session analytics chart would display here</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Traffic Sources</h3>
                  <div className="space-y-4">
                    {analyticsData.traffic.sources.map((source, index) => (
                      <div key={source.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {source.visitors.toLocaleString()} visitors
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{source.percentage}%</p>
                          {formatChange(source.change)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Device Breakdown */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Device Breakdown</h3>
                  <div className="space-y-4">
                    {analyticsData.traffic.devices.map((device, index) => (
                      <div key={device.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {device.type === 'Desktop' && <Monitor className="w-4 h-4" />}
                            {device.type === 'Mobile' && <Smartphone className="w-4 h-4" />}
                            {device.type === 'Tablet' && <Monitor className="w-4 h-4" />}
                            <span className="font-medium">{device.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{device.percentage}%</span>
                            <p className="text-sm text-muted-foreground">
                              {device.count.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Geographic Distribution */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Geographic Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {analyticsData.traffic.locations.map((location) => (
                      <div key={location.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{location.country}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{location.percentage}%</span>
                          <p className="text-sm text-muted-foreground">
                            {location.users.toLocaleString()} users
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">World map visualization would display here</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Top Performing Pages</h3>
                  <div className="space-y-4">
                    {analyticsData.content.topPages.map((page, index) => (
                      <div key={page.path} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium truncate">{page.path}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{page.views.toLocaleString()} views</span>
                              <span>{page.averageTime} avg time</span>
                              <span>{page.bounceRate}% bounce</span>
                            </div>
                          </div>
                          <Badge variant="secondary">{index + 1}</Badge>
                        </div>
                        <Progress 
                          value={(page.views / analyticsData.content.topPages[0].views) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Content Engagement */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Content Engagement</h3>
                  <div className="space-y-4">
                    {analyticsData.content.contentEngagement.map((content) => (
                      <div key={content.title} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{content.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {content.type}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span className="text-xs">{content.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs">{content.completions}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{content.engagementRate}%</p>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span className="text-xs">{content.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Progress value={content.engagementRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              {/* Lead Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Leads</p>
                      <p className="text-2xl font-bold">{analyticsData.leads.totalLeads.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Qualified Leads</p>
                      <p className="text-2xl font-bold">{analyticsData.leads.qualifiedLeads.toLocaleString()}</p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Hot Leads</p>
                      <p className="text-2xl font-bold">{analyticsData.leads.hotLeads.toLocaleString()}</p>
                    </div>
                    <Zap className="w-8 h-8 text-orange-500" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion by Source */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Lead Conversion by Source</h3>
                  <div className="space-y-4">
                    {analyticsData.leads.conversionsBySource.map((source) => (
                      <div key={source.source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{source.source}</span>
                          <div className="text-right">
                            <span className="font-medium">{source.conversion}%</span>
                            <p className="text-sm text-muted-foreground">
                              {source.leads} leads
                            </p>
                          </div>
                        </div>
                        <Progress value={source.conversion} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Conversion Funnel */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Conversion Funnel</h3>
                  <div className="space-y-4">
                    {analyticsData.leads.funnelStages.map((stage, index) => (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{stage.stage}</span>
                          <div className="text-right">
                            <span className="font-medium">{stage.count.toLocaleString()}</span>
                            <p className="text-sm text-muted-foreground">
                              {stage.conversionRate}% conversion
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={stage.conversionRate} className="h-3" />
                          {stage.dropOff > 0 && (
                            <div className="absolute right-0 top-0 text-xs text-red-600">
                              -{stage.dropOff}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool Usage Stats */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Tool Usage Statistics</h3>
                  <div className="space-y-4">
                    {analyticsData.tools.usage.map((tool) => (
                      <div key={tool.toolName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{tool.toolName}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{tool.launches} launches</span>
                              <span>{tool.completions} completions</span>
                              <span>Avg: {tool.averageScore}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{tool.completionRate}%</span>
                            <p className="text-sm text-muted-foreground">completion</p>
                          </div>
                        </div>
                        <Progress value={tool.completionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tool Performance */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Tool Performance Metrics</h3>
                  <div className="space-y-4">
                    {analyticsData.tools.performance.map((tool) => (
                      <div key={tool.toolId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{tool.name}</h4>
                          <Badge variant="secondary">
                            ★{tool.satisfaction}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Retake Rate</p>
                            <p className="font-medium">{tool.retakeRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">NPS Score</p>
                            <p className="font-medium">{tool.recommendationScore}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6">
              {/* Real-time Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                    <Zap className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Right now</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views/min</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last minute</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Tools</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Settings className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">In use now</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Leads</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last hour</p>
                </Card>
              </div>

              {/* Real-time Activity Feed */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Real-time Activity</h3>
                  <Badge variant="secondary" className="animate-pulse">
                    Live
                  </Badge>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { time: '2 min ago', event: 'New user completed Potential Quotient Calculator', type: 'success' },
                    { time: '5 min ago', event: 'User started Leadership Style Profiler assessment', type: 'info' },
                    { time: '8 min ago', event: 'New lead from organic search', type: 'success' },
                    { time: '12 min ago', event: 'User viewed blog post "Decision Making Psychology"', type: 'info' },
                    { time: '15 min ago', event: 'Hot lead upgraded to soft member', type: 'success' },
                    { time: '18 min ago', event: 'User bookmarked "Leadership Transformation" content', type: 'info' },
                    { time: '22 min ago', event: 'New user registration from email campaign', type: 'success' },
                    { time: '25 min ago', event: 'Tool usage: Dream Clarity Generator launched', type: 'info' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}