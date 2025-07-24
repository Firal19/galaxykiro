"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  Play,
  Pause,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  Clock,
  Target,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Copy,
  TrendingUp,
  UserCheck,
  UserX,
  MessageCircle,
  Activity,
  DollarSign,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import webinarSystem, { Webinar, WebinarAnalytics } from '@/lib/webinar-system'

interface WebinarDashboardProps {
  className?: string
}

export function WebinarDashboard({ className }: WebinarDashboardProps) {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null)
  const [analytics, setAnalytics] = useState<WebinarAnalytics | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'webinars' | 'analytics' | 'automation'>('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWebinars()
  }, [])

  const loadWebinars = async () => {
    setIsLoading(true)
    try {
      if (!webinarSystem) {
        console.warn('Webinar system not available on server side')
        return
      }

      const allWebinars = webinarSystem.getAllWebinars()
      setWebinars(allWebinars)
      
      if (allWebinars.length > 0 && !selectedWebinar) {
        const recentWebinar = allWebinars.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        setSelectedWebinar(recentWebinar)
        loadAnalytics(recentWebinar.id)
      }
    } catch (error) {
      console.error('Error loading webinars:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async (webinarId: string) => {
    try {
      if (!webinarSystem) return
      const webinarAnalytics = await webinarSystem.getWebinarAnalytics(webinarId)
      setAnalytics(webinarAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const getStatusBadge = (status: Webinar['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-500', text: 'Draft' },
      scheduled: { color: 'bg-blue-500', text: 'Scheduled' },
      live: { color: 'bg-green-500', text: 'Live' },
      ended: { color: 'bg-purple-500', text: 'Ended' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' }
    }
    
    const config = statusConfig[status]
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const upcomingWebinars = webinars.filter(w => 
    w.status === 'scheduled' && new Date(w.scheduledDate) > new Date()
  )
  
  const liveWebinars = webinars.filter(w => w.status === 'live')
  
  const totalRegistrations = webinars.reduce((sum, w) => sum + w.totalRegistrations, 0)
  const totalAttendees = webinars.reduce((sum, w) => sum + w.totalAttendees, 0)
  const averageAttendanceRate = webinars.length > 0 
    ? (totalAttendees / Math.max(totalRegistrations, 1)) * 100 
    : 0

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold text-foreground">Webinar Management</h1>
          <p className="text-muted-foreground">
            Manage webinars, track engagement, and automate follow-ups
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Webinar
          </Button>
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'webinars', label: 'Webinars', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'automation', label: 'Automation', icon: Settings }
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Webinars</p>
                      <p className="text-2xl font-bold text-foreground">{webinars.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {upcomingWebinars.length} upcoming
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                      <p className="text-2xl font-bold text-foreground">{totalRegistrations}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {totalAttendees} attendees
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                      <p className="text-2xl font-bold text-foreground">{averageAttendanceRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <UserCheck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={averageAttendanceRate} className="h-2" />
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${analytics?.conversion.revenueGenerated.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {analytics?.conversion.conversionRate.toFixed(1) || 0}% conversion rate
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Live Webinars */}
            {liveWebinars.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-foreground">Live Now</h3>
                </div>
                <div className="space-y-4">
                  {liveWebinars.map((webinar) => (
                    <div key={webinar.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{webinar.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {webinar.totalAttendees} attendees • Started {formatDate(webinar.scheduledDate)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Monitor
                        </Button>
                        <Button size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Control
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Webinars</h3>
                <div className="space-y-4">
                  {upcomingWebinars.slice(0, 3).map((webinar) => (
                    <div key={webinar.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{webinar.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(webinar.scheduledDate)} • {webinar.totalRegistrations} registered
                        </p>
                      </div>
                      {getStatusBadge(webinar.status)}
                    </div>
                  ))}
                  {upcomingWebinars.length === 0 && (
                    <p className="text-muted-foreground text-sm">No upcoming webinars</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Performance</h3>
                <div className="space-y-4">
                  {webinars
                    .filter(w => w.status === 'ended')
                    .slice(0, 3)
                    .map((webinar) => (
                      <div key={webinar.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{webinar.title}</p>
                          <span className="text-sm text-muted-foreground">
                            {((webinar.totalAttendees / Math.max(webinar.totalRegistrations, 1)) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{webinar.totalRegistrations} registered</span>
                          <span>{webinar.totalAttendees} attended</span>
                          <span>{webinar.questions.length} questions</span>
                        </div>
                        <Progress 
                          value={(webinar.totalAttendees / Math.max(webinar.totalRegistrations, 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'webinars' && (
          <div className="space-y-6">
            {/* Webinars List */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">All Webinars</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Webinar
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {webinars.map((webinar) => (
                    <div key={webinar.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-foreground">{webinar.title}</h4>
                          {getStatusBadge(webinar.status)}
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(webinar.scheduledDate)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{webinar.totalRegistrations} registered</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{webinar.duration} min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{webinar.questions.length} questions</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedWebinar(webinar)
                          loadAnalytics(webinar.id)
                          setActiveTab('analytics')
                        }}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && selectedWebinar && analytics && (
          <div className="space-y-6">
            {/* Webinar Selector */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedWebinar.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedWebinar.scheduledDate)} • {selectedWebinar.duration} minutes
                  </p>
                </div>
                {getStatusBadge(selectedWebinar.status)}
              </div>
            </Card>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Show-up Rate</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.overview.showUpRate.toFixed(1)}%</p>
                  <Progress value={analytics.overview.showUpRate} className="h-2" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.overview.completionRate.toFixed(1)}%</p>
                  <Progress value={analytics.overview.completionRate} className="h-2" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.overview.engagementScore.toFixed(0)}</p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    <span>Average per attendee</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${analytics.conversion.revenueGenerated.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.conversion.conversionRate.toFixed(1)}% conversion
                  </p>
                </div>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Engagement Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Questions Asked</span>
                    <span className="font-medium">{analytics.engagement.questionsAsked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Poll Participation</span>
                    <span className="font-medium">{analytics.engagement.pollParticipation.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Watch Time</span>
                    <span className="font-medium">{analytics.overview.averageWatchTime.toFixed(0)} min</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Registration Sources</h4>
                <div className="space-y-3">
                  {analytics.demographics.sources.slice(0, 5).map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{source.count}</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(source.count / analytics.overview.totalRegistrations) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated email sequences for webinar attendees
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Automation
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Confirmation Emails</h4>
                        <p className="text-sm text-muted-foreground">Sent immediately after registration</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Reminder Emails</h4>
                        <p className="text-sm text-muted-foreground">24h & 1h before webinar</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Play className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Follow-up Emails</h4>
                        <p className="text-sm text-muted-foreground">Recording & next steps</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Lead Scoring Rules</h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">High Engagement Attendee</h4>
                    <Badge>+50 points</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Attendee who stayed for 80%+ and asked questions
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">Actions:</span>
                    <Badge variant="outline">Tag as Hot Lead</Badge>
                    <Badge variant="outline">Assign to Sales</Badge>
                    <Badge variant="outline">Send Premium Content</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">No-Show Follow-up</h4>
                    <Badge variant="outline">+5 points</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Registered but didn't attend the webinar
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">Actions:</span>
                    <Badge variant="outline">Send Recording</Badge>
                    <Badge variant="outline">Invite to Next Webinar</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}