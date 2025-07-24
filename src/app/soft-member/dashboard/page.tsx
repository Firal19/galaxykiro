"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SoftMemberLayout } from '@/components/layouts/soft-member-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp,
  BookOpen,
  Zap,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  Play,
  MessageSquare,
  Target,
  Star,
  Bell,
  ChevronRight,
  Activity
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'new_content' | 'system_update' | 'milestone' | 'reminder'
  date: string
  read: boolean
}

interface ContentChunk {
  id: string
  title: string
  type: 'article' | 'video' | 'assessment'
  progress: number
  duration: string
  category: string
  unlocked: boolean
}

export default function SoftMemberDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [recentContent, setRecentContent] = useState<ContentChunk[]>([])
  const [stats, setStats] = useState({
    toolsCompleted: 3,
    contentConsumed: 12,
    streakDays: 7,
    engagementScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user profile
        const currentProfile = leadScoringService.getCurrentProfile()
        setProfile(currentProfile)
        setStats(prev => ({ ...prev, engagementScore: currentProfile?.score || 0 }))

        // Mock announcements
        setAnnouncements([
          {
            id: '1',
            title: 'New Leadership Module Available',
            content: 'Unlock advanced leadership insights with our new comprehensive module.',
            type: 'new_content',
            date: '2025-01-24',
            read: false
          },
          {
            id: '2',
            title: 'Weekly Progress Review',
            content: "It's time to review your weekly progress and set new goals.",
            type: 'reminder',
            date: '2025-01-23',
            read: false
          },
          {
            id: '3',
            title: 'Milestone Achievement',
            content: 'Congratulations! You\'ve reached Hot Lead status.',
            type: 'milestone',
            date: '2025-01-22',
            read: true
          }
        ])

        // Mock recent content
        setRecentContent([
          {
            id: '1',
            title: 'Understanding Your Decision Patterns',
            type: 'article',
            progress: 75,
            duration: '8 min read',
            category: 'Decision Making',
            unlocked: true
          },
          {
            id: '2',
            title: 'Leadership Style Assessment',
            type: 'assessment',
            progress: 0,
            duration: '15 min',
            category: 'Leadership',
            unlocked: true
          },
          {
            id: '3',
            title: 'Vision Clarity Workshop',
            type: 'video',
            progress: 100,
            duration: '22 min',
            category: 'Vision',
            unlocked: true
          },
          {
            id: '4',
            title: 'Advanced Transformation Techniques',
            type: 'video',
            progress: 0,
            duration: '35 min',
            category: 'Advanced',
            unlocked: false
          }
        ])

        // Track dashboard visit
        leadScoringService.trackInteraction({
          eventType: 'page_visit',
          page: 'soft_member_dashboard'
        })

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot_lead': return 'bg-red-500'
      case 'candidate': return 'bg-orange-500'
      case 'soft_member': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen
      case 'video': return Play
      case 'assessment': return Target
      default: return BookOpen
    }
  }

  if (loading) {
    return (
      <SoftMemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </SoftMemberLayout>
    )
  }

  return (
    <SoftMemberLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-muted-foreground">
                Continue your transformation journey where you left off
              </p>
            </div>
            {profile && (
              <Badge className={`${getStatusColor(profile.status)} text-white capitalize`}>
                {profile.status.replace('_', ' ')}
              </Badge>
            )}
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
                <p className="text-sm text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">{stats.engagementScore}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={(stats.engagementScore / 1000) * 100} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tools Completed</p>
                <p className="text-2xl font-bold">{stats.toolsCompleted}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +2 this week
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Consumed</p>
                <p className="text-2xl font-bold">{stats.contentConsumed}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              3 new pieces available
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{stats.streakDays} days</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep it going! 🔥
            </p>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/soft-member/tools">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Take Assessment</p>
                    <p className="text-sm text-muted-foreground">Continue your analysis</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/soft-member/content">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Browse Content</p>
                    <p className="text-sm text-muted-foreground">Explore new materials</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/soft-member/calendar">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Book Session</p>
                    <p className="text-sm text-muted-foreground">Schedule coaching call</p>
                  </div>
                </div>
              </Card>
            </Link>

            {profile?.status === 'hot_lead' && (
              <Link href="/soft-member/network">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Network Hub</p>
                      <p className="text-sm text-muted-foreground">Connect with leaders</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Latest Updates</h2>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={`p-4 ${!announcement.read ? 'border-primary/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        {!announcement.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {announcement.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Recent Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Link href="/soft-member/content">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentContent.map((content) => {
                const Icon = getTypeIcon(content.type)
                return (
                  <Card key={content.id} className={`p-4 ${!content.unlocked ? 'opacity-60' : 'hover:shadow-md cursor-pointer'} transition-shadow`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${content.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-4 h-4 ${content.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">
                          {content.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{content.category}</span>
                          <span>{content.duration}</span>
                        </div>
                        {content.unlocked && content.progress > 0 && (
                          <div>
                            <Progress value={content.progress} className="h-1 mb-1" />
                            <p className="text-xs text-muted-foreground">{content.progress}% complete</p>
                          </div>
                        )}
                        {!content.unlocked && (
                          <p className="text-xs text-muted-foreground">Unlock with higher engagement</p>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Progress is Impressive!</h3>
                  <p className="text-sm text-muted-foreground">
                    You're in the top 20% of active members this month
                  </p>
                </div>
              </div>
              <Button>
                <ArrowRight className="w-4 h-4 mr-2" />
                View Full Stats
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </SoftMemberLayout>
  )
}