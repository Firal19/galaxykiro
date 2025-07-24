"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  Users,
  Target,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  Zap,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  role: string
  source: string
  score: number
  createdAt: string
  lastInteraction: string
  metadata?: any
}

interface TimelineItem {
  id: string
  type: 'interaction' | 'profile_created' | 'status_change'
  timestamp: string
  eventType?: string
  details: {
    action: string
    data?: any
    page?: string
    toolName?: string
    contentType?: string
  }
}

interface Metrics {
  totalInteractions: number
  lastActive: string
  toolsUsed: number
  contentViewed: number
  pageViews: number
  avgSessionTime: string
  conversionProbability: number
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.leadId as string
  
  const [lead, setLead] = useState<Lead | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'profile' | 'metrics'>('timeline')

  useEffect(() => {
    if (leadId) {
      loadLeadDetails()
    }
  }, [leadId])

  const loadLeadDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leads/${leadId}`)
      const data = await response.json()

      if (data.success) {
        setLead(data.data.profile)
        setTimeline(data.data.timeline)
        setMetrics(data.data.metrics)
      } else {
        // Handle lead not found
        router.push('/admin/leads')
      }
    } catch (error) {
      console.error('Error loading lead details:', error)
      router.push('/admin/leads')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'soft_member':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'candidate':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'hot_lead':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTimelineIcon = (type: string, eventType?: string) => {
    if (type === 'profile_created') return Users
    if (type === 'interaction') {
      switch (eventType) {
        case 'page_visit': return Eye
        case 'tool_completion': return Zap
        case 'content_view': return FileText
        case 'user_login': return Users
        default: return Activity
      }
    }
    return Activity
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lead details...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Lead Not Found</h2>
          <p className="text-muted-foreground mb-6">The lead you're looking for doesn't exist.</p>
          <Link href="/admin/leads">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
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
          <div className="flex items-center space-x-4">
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leads
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{lead.name}</h1>
              <p className="text-muted-foreground">Lead ID: {lead.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Lead
            </Button>
            <Button variant="outline" className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Lead Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Lead Status</h3>
                <div className="space-y-3">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Source: <span className="capitalize font-medium">{lead.source}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Role: <span className="capitalize font-medium">{lead.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Engagement Score</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{lead.score}</span>
                    <Progress value={(lead.score / 1000) * 100} className="flex-1 h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metrics && (
                      <div>
                        Conversion Probability: {metrics.conversionProbability.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Activity Summary</h3>
                <div className="space-y-3">
                  {metrics && (
                    <>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total Interactions:</span>
                        <span className="font-medium ml-2">{metrics.totalInteractions}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tools Used:</span>
                        <span className="font-medium ml-2">{metrics.toolsUsed}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Active:</span>
                        <span className="font-medium ml-2">
                          {formatTimeAgo(metrics.lastActive)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Metrics Cards */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-2xl font-bold">{metrics.pageViews}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Content Viewed</p>
                  <p className="text-2xl font-bold">{metrics.contentViewed}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tools Completed</p>
                  <p className="text-2xl font-bold">{metrics.toolsUsed}</p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Session</p>
                  <p className="text-2xl font-bold">{metrics.avgSessionTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {[
                { id: 'timeline', label: 'Activity Timeline', icon: Activity },
                { id: 'profile', label: 'Profile Details', icon: Users },
                { id: 'metrics', label: 'Detailed Metrics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === 'timeline' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>
              <div className="space-y-6">
                {timeline.map((item) => {
                  const Icon = getTimelineIcon(item.type, item.eventType)
                  return (
                    <div key={item.id} className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{item.details.action}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                        {item.details.data && (
                          <div className="text-sm text-muted-foreground">
                            {JSON.stringify(item.details.data, null, 2)}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {timeline.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity recorded yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg">{lead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-lg">{lead.email}</p>
                  </div>
                  {lead.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <p className="text-lg">{lead.phone}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p className="text-lg">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Source</label>
                    <p className="text-lg capitalize">{lead.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Interaction</label>
                    <p className="text-lg">{new Date(lead.lastInteraction).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {lead.metadata && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium mb-4">Additional Information</h4>
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                    {JSON.stringify(lead.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'metrics' && metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Engagement Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Interactions</span>
                    <span className="font-medium">{metrics.totalInteractions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Page Views</span>
                    <span className="font-medium">{metrics.pageViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Content Viewed</span>
                    <span className="font-medium">{metrics.contentViewed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tools Used</span>
                    <span className="font-medium">{metrics.toolsUsed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Session Time</span>
                    <span className="font-medium">{metrics.avgSessionTime}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Conversion Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Conversion Probability</span>
                      <span className="font-medium">{metrics.conversionProbability.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.conversionProbability} className="h-2" />
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <h4 className="font-medium">Recommended Actions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {metrics.conversionProbability > 70 && (
                        <li>• High conversion probability - Consider direct outreach</li>
                      )}
                      {metrics.toolsUsed < 2 && (
                        <li>• Encourage completion of additional assessment tools</li>
                      )}
                      {metrics.contentViewed < 3 && (
                        <li>• Share relevant content to increase engagement</li>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}