"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/admin/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText,
  Plus,
  Edit,
  Send,
  Calendar,
  Users,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Settings,
  Archive,
  Copy,
  Trash2,
  ExternalLink,
  Target,
  Zap,
  BookOpen,
  Play,
  Star,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface ContentItem {
  id: string
  title: string
  type: 'article' | 'video' | 'assessment' | 'worksheet' | 'webinar'
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived'
  category: string
  author: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  scheduledFor?: string
  views: number
  engagements: number
  completions: number
  rating: number
  targetAudience: string[]
  tags: string[]
  wordCount?: number
  duration?: string
}

interface ContentStats {
  totalContent: number
  draftContent: number
  publishedContent: number
  scheduledContent: number
  totalViews: number
  totalEngagements: number
  avgRating: number
  contentThisMonth: number
}

interface DistributionChannel {
  id: string
  name: string
  type: 'email' | 'push' | 'in_app' | 'social'
  enabled: boolean
  reach: number
  engagementRate: number
}

export default function AdminCMSPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [stats, setStats] = useState<ContentStats>({
    totalContent: 0,
    draftContent: 0,
    publishedContent: 0,
    scheduledContent: 0,
    totalViews: 0,
    totalEngagements: 0,
    avgRating: 0,
    contentThisMonth: 0
  })
  const [distributionChannels, setDistributionChannels] = useState<DistributionChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadCMSData = async () => {
      try {
        // Mock content data
        const mockContent: ContentItem[] = [
          {
            id: 'content-1',
            title: 'Advanced Leadership Transformation Strategies',
            type: 'article',
            status: 'published',
            category: 'Leadership',
            author: 'Dr. Sarah Chen',
            createdAt: '2025-01-20',
            updatedAt: '2025-01-22',
            publishedAt: '2025-01-21',
            views: 2847,
            engagements: 421,
            completions: 387,
            rating: 4.8,
            targetAudience: ['hot_lead', 'soft_member'],
            tags: ['leadership', 'transformation', 'advanced'],
            wordCount: 2450
          },
          {
            id: 'content-2',
            title: 'Potential Assessment Deep Dive Workshop',
            type: 'video',
            status: 'scheduled',
            category: 'Potential',
            author: 'Marcus Johnson',
            createdAt: '2025-01-18',
            updatedAt: '2025-01-23',
            scheduledFor: '2025-01-25',
            views: 0,
            engagements: 0,
            completions: 0,
            rating: 0,
            targetAudience: ['candidate', 'soft_member'],
            tags: ['potential', 'assessment', 'workshop'],
            duration: '45 min'
          },
          {
            id: 'content-3',
            title: 'Goal Setting Mastery Assessment',
            type: 'assessment',
            status: 'review',
            category: 'Goal Setting',
            author: 'Dr. Elena Rodriguez',
            createdAt: '2025-01-22',
            updatedAt: '2025-01-23',
            views: 0,
            engagements: 0,
            completions: 0,
            rating: 0,
            targetAudience: ['soft_member', 'hot_lead'],
            tags: ['goals', 'mastery', 'assessment'],
            duration: '25 min'
          },
          {
            id: 'content-4',
            title: 'Decision Making Psychology Insights',
            type: 'article',
            status: 'draft',
            category: 'Decision Making',
            author: 'Prof. Michael Chang',
            createdAt: '2025-01-23',
            updatedAt: '2025-01-24',
            views: 0,
            engagements: 0,
            completions: 0,
            rating: 0,
            targetAudience: ['candidate', 'soft_member'],
            tags: ['psychology', 'decision-making', 'insights'],
            wordCount: 1850
          },
          {
            id: 'content-5',
            title: 'Weekly Transformation Check-in',
            type: 'webinar',
            status: 'published',
            category: 'Community',
            author: 'Galaxy Kiro Team',
            createdAt: '2025-01-15',
            updatedAt: '2025-01-20',
            publishedAt: '2025-01-16',
            views: 1234,
            engagements: 289,
            completions: 201,
            rating: 4.6,
            targetAudience: ['hot_lead'],
            tags: ['community', 'check-in', 'transformation'],
            duration: '60 min'
          }
        ]

        // Mock distribution channels
        const mockChannels: DistributionChannel[] = [
          {
            id: 'email',
            name: 'Email Newsletter',
            type: 'email',
            enabled: true,
            reach: 15423,
            engagementRate: 23.4
          },
          {
            id: 'push',
            name: 'Push Notifications',
            type: 'push',
            enabled: true,
            reach: 8934,
            engagementRate: 18.7
          },
          {
            id: 'in_app',
            name: 'In-App Notifications',
            type: 'in_app',
            enabled: true,
            reach: 12567,
            engagementRate: 31.2
          },
          {
            id: 'social',
            name: 'Social Media',
            type: 'social',
            enabled: false,
            reach: 0,
            engagementRate: 0
          }
        ]

        setContent(mockContent)
        setDistributionChannels(mockChannels)

        // Calculate stats
        const published = mockContent.filter(item => item.status === 'published').length
        const draft = mockContent.filter(item => item.status === 'draft').length
        const scheduled = mockContent.filter(item => item.status === 'scheduled').length
        const totalViews = mockContent.reduce((sum, item) => sum + item.views, 0)
        const totalEngagements = mockContent.reduce((sum, item) => sum + item.engagements, 0)
        const ratingsSum = mockContent.filter(item => item.rating > 0).reduce((sum, item) => sum + item.rating, 0)
        const ratedItems = mockContent.filter(item => item.rating > 0).length

        setStats({
          totalContent: mockContent.length,
          draftContent: draft,
          publishedContent: published,
          scheduledContent: scheduled,
          totalViews,
          totalEngagements,
          avgRating: ratedItems > 0 ? Math.round((ratingsSum / ratedItems) * 10) / 10 : 0,
          contentThisMonth: 3
        })

      } catch (error) {
        console.error('Error loading CMS data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCMSData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'review': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'draft': return 'bg-gray-500/10 text-gray-700 border-gray-200'
      case 'archived': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen
      case 'video': return Play
      case 'assessment': return Target
      case 'worksheet': return FileText
      case 'webinar': return Users
      default: return FileText
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return MessageSquare
      case 'push': return Zap
      case 'in_app': return Eye
      case 'social': return Users
      default: return MessageSquare
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading CMS dashboard...</p>
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
              <h1 className="text-3xl font-bold mb-2">Content Management System</h1>
              <p className="text-muted-foreground">
                Create, manage, and distribute content across all channels
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/admin/cms/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
              </Link>
              <Link href="/admin/cms/distribute">
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Distribute
                </Button>
              </Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{stats.totalContent}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{stats.contentThisMonth} this month
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.publishedContent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={(stats.publishedContent / stats.totalContent) * 100} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <BarChart3 className="w-3 h-3 mr-1" />
              {stats.totalEngagements} engagements
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= stats.avgRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Content Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content Library</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/admin/cms/create">
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Plus className="w-6 h-6" />
                      <span>Create New</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <Edit className="w-6 h-6" />
                    <span>Edit Draft</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <Calendar className="w-6 h-6" />
                    <span>Schedule</span>
                  </Button>
                  <Link href="/admin/cms/distribute">
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Send className="w-6 h-6" />
                      <span>Distribute</span>
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Recent Activity & Content Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {content.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {(() => {
                            const Icon = getTypeIcon(item.type)
                            return <Icon className="w-4 h-4 text-primary" />
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{item.author}</span>
                            <span>•</span>
                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Content Status Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'published', count: stats.publishedContent, color: 'bg-green-500' },
                      { status: 'scheduled', count: stats.scheduledContent, color: 'bg-blue-500' },
                      { status: 'review', count: content.filter(c => c.status === 'review').length, color: 'bg-yellow-500' },
                      { status: 'draft', count: stats.draftContent, color: 'bg-gray-500' }
                    ].map(({ status, count, color }) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${color}`}></div>
                          <span className="capitalize text-sm font-medium">{status}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${color}`}
                              style={{ width: `${(count / stats.totalContent) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Performance Highlights */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Top Performing Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content
                    .filter(item => item.status === 'published')
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                          <Badge variant="secondary" className="ml-2">{item.type}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">{item.views.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-500">{item.rating}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Content Library */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Content Library</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Link href="/admin/cms/create">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Content
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {content.map((item) => {
                  const Icon = getTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{item.title}</h4>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                              <div>
                                <span className="font-medium">Author:</span> {item.author}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {item.category}
                              </div>
                              <div>
                                <span className="font-medium">Updated:</span> {new Date(item.updatedAt).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Audience:</span> {item.targetAudience.join(', ')}
                              </div>
                            </div>
                            {item.status === 'published' && (
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4 text-blue-500" />
                                  <span>{item.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BarChart3 className="w-4 h-4 text-green-500" />
                                  <span>{item.engagements}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-purple-500" />
                                  <span>{item.completions}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span>{item.rating}</span>
                                </div>
                              </div>
                            )}
                            {item.status === 'scheduled' && item.scheduledFor && (
                              <div className="flex items-center space-x-2 text-sm text-blue-600">
                                <Calendar className="w-4 h-4" />
                                <span>Scheduled for {new Date(item.scheduledFor).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Archive className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              {/* Distribution Channels */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Distribution Channels</h3>
                  <Link href="/admin/cms/distribute">
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {distributionChannels.map((channel) => {
                    const Icon = getChannelIcon(channel.type)
                    return (
                      <Card key={channel.id} className="p-4 border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              channel.enabled ? 'bg-primary/10' : 'bg-muted'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                channel.enabled ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-medium">{channel.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{channel.type}</p>
                            </div>
                          </div>
                          <Badge variant={channel.enabled ? 'default' : 'secondary'}>
                            {channel.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                        
                        {channel.enabled && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-2xl font-bold text-primary">{channel.reach.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Reach</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-500">{channel.engagementRate}%</p>
                              <p className="text-xs text-muted-foreground">Engagement</p>
                            </div>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </Card>

              {/* Recent Campaigns */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Distribution Campaigns</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: 'Weekly Leadership Insights',
                      type: 'email',
                      sent: '2025-01-23',
                      recipients: 15423,
                      openRate: 24.3,
                      clickRate: 6.7
                    },
                    {
                      id: 2,
                      title: 'New Assessment Available',
                      type: 'push',
                      sent: '2025-01-22',
                      recipients: 8934,
                      openRate: 18.9,
                      clickRate: 12.4
                    },
                    {
                      id: 3,
                      title: 'Content Library Update',
                      type: 'in_app',
                      sent: '2025-01-21',
                      recipients: 12567,
                      openRate: 31.2,
                      clickRate: 8.9
                    }
                  ].map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {(() => {
                            const Icon = getChannelIcon(campaign.type)
                            return <Icon className="w-4 h-4 text-primary" />
                          })()}
                        </div>
                        <div>
                          <h4 className="font-medium">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(campaign.sent).toLocaleDateString()} • {campaign.recipients.toLocaleString()} recipients
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-primary">{campaign.openRate}%</p>
                          <p className="text-muted-foreground">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-500">{campaign.clickRate}%</p>
                          <p className="text-muted-foreground">Click Rate</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Content Performance</h3>
                  <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Performance chart would go here</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Engagement Trends</h3>
                  <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Engagement chart would go here</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Content Type Distribution</h3>
                  <div className="space-y-3">
                    {['article', 'video', 'assessment', 'webinar'].map(type => {
                      const count = content.filter(c => c.type === type).length
                      const percentage = (count / content.length) * 100
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{type}</span>
                          <div className="flex items-center space-x-2 flex-1 ml-4">
                            <Progress value={percentage} className="h-2" />
                            <span className="text-xs text-muted-foreground w-10">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Content Analytics Detail</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Content</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Views</th>
                        <th className="text-left p-2">Engagements</th>
                        <th className="text-left p-2">Completions</th>
                        <th className="text-left p-2">Rating</th>
                        <th className="text-left p-2">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.filter(c => c.status === 'published').map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-muted-foreground text-xs">{item.category}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="capitalize">{item.type}</Badge>
                          </td>
                          <td className="p-2 font-medium">{item.views.toLocaleString()}</td>
                          <td className="p-2 font-medium">{item.engagements}</td>
                          <td className="p-2 font-medium">{item.completions}</td>
                          <td className="p-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{item.rating}</span>
                            </div>
                          </td>
                          <td className="p-2 font-medium text-green-600">
                            {Math.round((item.completions / item.views) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}