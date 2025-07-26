"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/admin/layout.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  RefreshCw,
  Download,
  Settings,
  Eye,
  UserCheck,
  UserPlus,
  Zap
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'

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
  avatar?: string
  action: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// Stat card component with enhanced design
function StatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color,
  prefix = '',
  suffix = ''
}: {
  title: string
  value: number | string
  trend?: number
  icon: React.ComponentType<any>
  color: string
  prefix?: string
  suffix?: string
}) {
  const isPositiveTrend = trend && trend > 0
  const isNegativeTrend = trend && trend < 0
  
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
              </span>
              {trend !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  isPositiveTrend && "text-green-600",
                  isNegativeTrend && "text-red-600",
                  !isPositiveTrend && !isNegativeTrend && "text-gray-600"
                )}>
                  {isPositiveTrend && <ArrowUpRight className="w-4 h-4" />}
                  {isNegativeTrend && <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className={cn("p-3 rounded-lg", color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Decorative gradient */}
        <div className={cn(
          "absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10",
          color
        )} />
      </CardContent>
    </Card>
  )
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
      // Get status breakdown for statistics
      const statusBreakdown = leadScoringService.getStatusBreakdown()
      
      // Calculate stats
      const totalLeads = Object.values(statusBreakdown).reduce((sum, count) => sum + count, 0)
      const activeMembers = totalLeads - (statusBreakdown.visitor || 0)
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

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'registration',
          user: 'Sarah Johnson',
          action: 'completed registration',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          status: 'success'
        },
        {
          id: '2',
          type: 'tool_completion',
          user: 'Mike Chen',
          action: 'completed Potential Quotient assessment',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          status: 'success'
        },
        {
          id: '3',
          type: 'upgrade',
          user: 'Emma Davis',
          action: 'upgraded to Premium membership',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: 'success'
        }
      ])

      // Mock system alerts
      setSystemAlerts([
        {
          id: '1',
          type: 'success',
          title: 'Daily Backup Complete',
          message: 'All data has been successfully backed up',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'High Traffic Alert',
          message: 'Server load is above 80%. Consider scaling.',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: false
        }
      ])

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'registration': return UserPlus
      case 'approval': return UserCheck
      case 'upgrade': return Zap
      case 'content_view': return Eye
      case 'tool_completion': return CheckCircle
      default: return Activity
    }
  }

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'warning': return AlertCircle
      case 'error': return AlertCircle
      default: return MessageSquare
    }
  }

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            trend={stats.trends.leads}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Members"
            value={stats.activeMembers}
            trend={stats.trends.members}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatCard
            title="Conversion Rate"
            value={stats.conversionRate.toFixed(1)}
            suffix="%"
            trend={stats.trends.conversion}
            icon={Target}
            color="bg-purple-500"
          />
          <StatCard
            title="Monthly Revenue"
            value={stats.revenue}
            prefix="$"
            trend={stats.trends.revenue}
            icon={DollarSign}
            color="bg-orange-500"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and events on your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type)
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          activity.status === 'success' && "bg-green-100",
                          activity.status === 'warning' && "bg-yellow-100",
                          activity.status === 'error' && "bg-red-100"
                        )}>
                          <IconComponent className={cn(
                            "w-5 h-5",
                            activity.status === 'success' && "text-green-600",
                            activity.status === 'warning' && "text-yellow-600",
                            activity.status === 'error' && "text-red-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            <span className="font-semibold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/admin/activity">
                    <Button variant="outline" size="sm">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Important notifications and system updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => {
                    const IconComponent = getAlertIcon(alert.type)
                    const colorClass = getAlertColor(alert.type)
                    
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "p-4 rounded-lg border",
                          !alert.read && "bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", colorClass)}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(leadScoringService.getStatusBreakdown()).map(([status, count]) => (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <Progress 
                          value={(count / stats.totalLeads) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/admin/leads">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Leads
                      </Button>
                    </Link>
                    <Link href="/admin/content">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                    <Link href="/admin/cms/create">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Create Content
                      </Button>
                    </Link>
                    <Link href="/admin/approvals">
                      <Button variant="outline" className="w-full justify-start">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Approvals
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Last updated */}
        <div className="text-center text-sm text-gray-600">
          <Clock className="w-4 h-4 inline mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}