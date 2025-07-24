"use client"

import { useState, useEffect, Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import { AdminLeadManager } from '@/components/admin-lead-manager'
import { AdminContentManagerV2 } from '@/components/admin-content-manager-v2'
import { AdminToolManager } from '@/components/admin-tool-manager'
import { AdminNetworkManager } from '@/components/admin-network-manager'
import { AdminLeadScoringDashboard } from '@/components/admin-lead-scoring-dashboard'
import {
  Users,
  TrendingUp,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Wrench,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Star,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalLeads: number
  newLeadsToday: number
  conversionRate: number
  engagementScore: number
  totalAssessments: number
  activeMembers: number
  pendingReviews: number
  systemAlerts: number
}

interface RecentActivity {
  id: string
  type: 'new_lead' | 'assessment_completed' | 'content_published' | 'system_alert'
  title: string
  description: string
  timestamp: string
  priority: 'low' | 'medium' | 'high'
  userId?: string
  userName?: string
}

const mockStats: DashboardStats = {
  totalLeads: 12847,
  newLeadsToday: 89,
  conversionRate: 23.5,
  engagementScore: 78,
  totalAssessments: 34521,
  activeMembers: 8923,
  pendingReviews: 15,
  systemAlerts: 3
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Admin component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Admin Tab Error Component
function AdminTabError({ tab }: { tab: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">
          {tab} Temporarily Unavailable
        </h3>
        <p className="text-gray-300 mb-6">
          We're experiencing some technical difficulties with this section. Please try again later.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Refresh Page
        </Button>
      </Card>
    </div>
  )
}

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'new_lead',
    title: 'New Lead Registration',
    description: 'Sarah Tesfaye registered via Instagram referral link',
    timestamp: '2024-01-15T14:30:00Z',
    priority: 'medium',
    userId: 'user_123',
    userName: 'Sarah Tesfaye'
  },
  {
    id: '2',
    type: 'assessment_completed',
    title: 'Assessment Completed',
    description: 'Daniel Mulugeta completed Leadership Style Profiler',
    timestamp: '2024-01-15T13:45:00Z',
    priority: 'low',
    userId: 'user_456',
    userName: 'Daniel Mulugeta'
  },
  {
    id: '3',
    type: 'system_alert',
    title: 'High Engagement Detected',
    description: 'Unusual spike in Potential Quotient Calculator usage (+150%)',
    timestamp: '2024-01-15T12:15:00Z',
    priority: 'high'
  },
  {
    id: '4',
    type: 'content_published',
    title: 'New Content Published',
    description: 'Weekly transformation article: "Overcoming Fear of Success"',
    timestamp: '2024-01-15T10:00:00Z',
    priority: 'medium'
  }
]

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'leads' | 'scoring' | 'content' | 'tools' | 'network'>('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats(mockStats)
      setActivities(mockActivities)
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'new_lead': return Users
      case 'assessment_completed': return CheckCircle
      case 'content_published': return FileText
      case 'system_alert': return AlertTriangle
      default: return Clock
    }
  }

  const getPriorityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-purple-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-pink-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Admin Dashboard</h3>
          <p className="text-gray-400">Initializing command center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 text-lg font-medium">
                Galaxy Dream Team Command Center
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">System Online</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">
                  {stats?.totalLeads.toLocaleString()} total leads managed
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 text-sm font-mono">
                  Last updated: {new Date().toLocaleTimeString()}
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl px-6 py-3">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                { key: 'leads', label: 'Lead Management', icon: Users },
                { key: 'scoring', label: 'Lead Scoring', icon: Target },
                { key: 'content', label: 'Content CMS', icon: FileText },
                { key: 'tools', label: 'Tool Manager', icon: Wrench },
                { key: 'network', label: 'Network Hub', icon: Network },
              ].map(tab => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <motion.button
                    key={tab.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Key Performance Metrics
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Leads',
                    value: stats?.totalLeads.toLocaleString(),
                    change: '+12.5%',
                    icon: Users,
                    gradient: 'from-blue-500 to-cyan-500',
                    bgGradient: 'from-blue-500/10 to-cyan-500/10'
                  },
                  {
                    title: 'New Today',
                    value: stats?.newLeadsToday,
                    change: '+8.3%',
                    icon: TrendingUp,
                    gradient: 'from-emerald-500 to-teal-500',
                    bgGradient: 'from-emerald-500/10 to-teal-500/10'
                  },
                  {
                    title: 'Conversion Rate',
                    value: `${stats?.conversionRate}%`,
                    change: '+2.1%',
                    icon: Target,
                    gradient: 'from-purple-500 to-pink-500',
                    bgGradient: 'from-purple-500/10 to-pink-500/10'
                  },
                  {
                    title: 'Engagement Score',
                    value: stats?.engagementScore,
                    change: '+5.7%',
                    icon: Star,
                    gradient: 'from-orange-500 to-red-500',
                    bgGradient: 'from-orange-500/10 to-red-500/10'
                  }
                ].map((metric, index) => {
                  const IconComponent = metric.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card className={`p-6 bg-gradient-to-br ${metric.bgGradient} backdrop-blur-sm border border-slate-700 hover:border-slate-600 shadow-2xl hover:shadow-3xl transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                          >
                            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                              {metric.change}
                            </Badge>
                          </motion.div>
                        </div>
                        <motion.h3 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                          className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}
                        >
                          {metric.value}
                        </motion.h3>
                        <p className="text-gray-300 font-medium">
                          {metric.title}
                        </p>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Recent Activity & System Status */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Recent Activity
                    </h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type)
                      return (
                        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {activity.title}
                              </h4>
                              <Badge className={getPriorityColor(activity.priority)}>
                                {activity.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    System Status
                  </h3>

                  <div className="space-y-6">
                    {[
                      { label: 'Database Performance', value: 98, status: 'excellent' },
                      { label: 'API Response Time', value: 85, status: 'good' },
                      { label: 'User Engagement', value: 76, status: 'good' },
                      { label: 'Content Delivery', value: 92, status: 'excellent' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.label}
                          </span>
                          <span className={`text-sm font-semibold ${
                            item.value >= 90 ? 'text-green-600' : 
                            item.value >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.value}%
                          </span>
                        </div>
                        <Progress 
                          value={item.value} 
                          className={`h-2 ${
                            item.value >= 90 ? '[&>div]:bg-green-500' : 
                            item.value >= 70 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Quick Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Zap className="w-4 h-4 mr-2" />
                        System Backup
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Update Settings
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Alert
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        )}

        {/* Other Tabs with Error Boundaries */}
        {activeTab === 'analytics' && (
          <ErrorBoundary fallback={<AdminTabError tab="Analytics" />}>
            <AnalyticsDashboard />
          </ErrorBoundary>
        )}
        {activeTab === 'leads' && (
          <ErrorBoundary fallback={<AdminTabError tab="Lead Management" />}>
            <AdminLeadManager />
          </ErrorBoundary>
        )}
        {activeTab === 'scoring' && (
          <ErrorBoundary fallback={<AdminTabError tab="Lead Scoring" />}>
            <AdminLeadScoringDashboard />
          </ErrorBoundary>
        )}
        {activeTab === 'content' && (
          <ErrorBoundary fallback={<AdminTabError tab="Content CMS" />}>
            <AdminContentManagerV2 />
          </ErrorBoundary>
        )}
        {activeTab === 'tools' && (
          <ErrorBoundary fallback={<AdminTabError tab="Tool Manager" />}>
            <AdminToolManager />
          </ErrorBoundary>
        )}
        {activeTab === 'network' && (
          <ErrorBoundary fallback={<AdminTabError tab="Network Hub" />}>
            <AdminNetworkManager />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}