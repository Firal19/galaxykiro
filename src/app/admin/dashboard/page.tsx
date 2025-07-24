"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  MessageSquare,
  Mail,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'

interface DashboardStats {
  totalLeads: number
  activeMembers: number
  conversionRate: number
  revenue: number
  trends: {
    leads: number
    members: number
    conversion: number
    revenue: number
  }
}

interface RecentActivity {
  id: string
  type: 'registration' | 'approval' | 'upgrade' | 'content_view' | 'tool_completion'
  user: string
  action: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeMembers: 0,
    conversionRate: 0,
    revenue: 0,
    trends: { leads: 0, members: 0, conversion: 0, revenue: 0 }
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get all profiles for statistics
      const profiles = leadScoringService.getAllProfiles()
      const interactions = profiles.flatMap(p => leadScoringService.getInteractionHistory(p.id))

      // Calculate stats
      const totalLeads = profiles.length
      const activeMembers = profiles.filter(p => p.status !== 'pending_approval').length
      const conversionRate = totalLeads > 0 ? (activeMembers / totalLeads) * 100 : 0
      const revenue = activeMembers * 97 // $97 per member (example)

      // Mock trends (in production, compare with previous period)
      const trends = {
        leads: 12.5,
        members: 8.3,
        conversion: -2.1,
        revenue: 15.7
      }

      setStats({
        totalLeads,
        activeMembers,
        conversionRate,
        revenue,
        trends
      })

      // Generate recent activity
      const recentActivities: RecentActivity[] = interactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
        .map((interaction, index) => ({
          id: `activity_${index}`,
          type: interaction.eventType as any,
          user: profiles.find(p => p.id === interaction.userId)?.name || 'Unknown User',
          action: getActivityDescription(interaction.eventType, interaction.details),
          timestamp: interaction.timestamp,
          status: 'success'
        }))

      setRecentActivity(recentActivities)

      // Generate system alerts
      const alerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'High Traffic Alert',
          message: '25% increase in visitors detected in the last hour',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Weekly Report Ready',
          message: 'Your weekly analytics report is ready for review',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '3',
          type: 'error',
          title: 'Email Delivery Issue',
          message: '3 welcome emails failed to send in the last 24 hours',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]

      setSystemAlerts(alerts)
      setLastUpdated(new Date())

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityDescription = (eventType: string, details: any): string => {
    switch (eventType) {
      case 'user_registration':
        return 'Registered for soft membership'
      case 'tool_completion':
        return `Completed ${details?.toolName || 'assessment tool'}`
      case 'content_view':
        return `Viewed ${details?.contentType || 'content'}`
      case 'page_visit':
        return `Visited ${details?.page || 'page'}`
      case 'user_login':
        return 'Logged into dashboard'
      default:
        return 'Performed an action'
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with Galaxy Kiro today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button onClick={loadDashboardData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {getTrendIcon(stats.trends.leads)}
              <span className={`ml-1 ${getTrendColor(stats.trends.leads)}`}>
                {Math.abs(stats.trends.leads)}% vs last month
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{stats.activeMembers}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {getTrendIcon(stats.trends.members)}
              <span className={`ml-1 ${getTrendColor(stats.trends.members)}`}>
                {Math.abs(stats.trends.members)}% vs last month
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {getTrendIcon(stats.trends.conversion)}
              <span className={`ml-1 ${getTrendColor(stats.trends.conversion)}`}>
                {Math.abs(stats.trends.conversion)}% vs last month
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {getTrendIcon(stats.trends.revenue)}
              <span className={`ml-1 ${getTrendColor(stats.trends.revenue)}`}>
                {Math.abs(stats.trends.revenue)}% vs last month
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/admin/leads">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Manage Leads</p>
                    <p className="text-xs text-muted-foreground">View all leads</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/cms">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Content Manager</p>
                    <p className="text-xs text-muted-foreground">Create & distribute</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Analytics</p>
                    <p className="text-xs text-muted-foreground">Detailed reports</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/webinars">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Webinars</p>
                    <p className="text-xs text-muted-foreground">Schedule & manage</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/tools">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm">Tools</p>
                    <p className="text-xs text-muted-foreground">Manage assessments</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link href="/admin/leads">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <Card className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">System Alerts</h2>
              <Badge variant="destructive">
                {systemAlerts.filter(a => !a.read).length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <Card key={alert.id} className={`p-4 ${!alert.read ? 'border-primary/50' : ''}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium">{alert.title}</h3>
                        {!alert.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Funnel Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalLeads}
                </div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
                <Progress value={100} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeMembers}
                </div>
                <div className="text-sm text-muted-foreground">Active Members</div>
                <Progress 
                  value={stats.totalLeads > 0 ? (stats.activeMembers / stats.totalLeads) * 100 : 0} 
                  className="mt-2 h-2" 
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.floor(stats.activeMembers * 0.3)}
                </div>
                <div className="text-sm text-muted-foreground">Candidates</div>
                <Progress 
                  value={stats.totalLeads > 0 ? (stats.activeMembers * 0.3 / stats.totalLeads) * 100 : 0} 
                  className="mt-2 h-2" 
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.floor(stats.activeMembers * 0.1)}
                </div>
                <div className="text-sm text-muted-foreground">Hot Leads</div>
                <Progress 
                  value={stats.totalLeads > 0 ? (stats.activeMembers * 0.1 / stats.totalLeads) * 100 : 0} 
                  className="mt-2 h-2" 
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}