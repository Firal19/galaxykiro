"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  TrendingUp,
  BookOpen,
  Zap,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  Target,
  Star,
  Users,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  status: string
  score: number
  streak: number
  completedAssessments: number
  totalAssessments: number
}

interface Course {
  id: string
  title: string
  description: string
  progress: number
  duration: string
  category: string
  locked: boolean
  instructor: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  date: string
  read: boolean
  priority: string
}

export default function SoftMemberDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock user profile data
      setUserProfile({
        name: 'Champion Member',
        email: 'member@galaxykiro.com',
        status: 'hot_lead',
        score: 850,
        streak: 7,
        completedAssessments: 5,
        totalAssessments: 12
      })

      // Mock courses data
      setCourses([
        {
          id: '1',
          title: 'Leadership Mastery',
          description: 'Develop advanced leadership skills',
          progress: 75,
          duration: '3 hours',
          category: 'Leadership',
          locked: false,
          instructor: 'Dr. Sarah Johnson'
        },
        {
          id: '2',
          title: 'Decision Making Framework',
          description: 'Master strategic decision making',
          progress: 45,
          duration: '2.5 hours',
          category: 'Strategy',
          locked: false,
          instructor: 'Prof. Michael Chen'
        }
      ])

      // Mock announcements
      setAnnouncements([
        {
          id: '1',
          title: '🎉 New Leadership Module Available',
          content: 'Unlock advanced leadership insights with our new comprehensive module.',
          type: 'new_content',
          date: '2025-01-24',
          read: false,
          priority: 'high'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
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

  const firstName = userProfile?.name?.split(' ')[0] || 'Champion'

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-gray-900">
          {getGreeting()}, {firstName}! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Welcome to your transformation hub. Ready to unlock more of your potential today?
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress Score</p>
                <p className="text-2xl font-bold text-purple-600">{userProfile?.score}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{userProfile?.streak} days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessments</p>
                <p className="text-2xl font-bold text-green-600">
                  {userProfile?.completedAssessments}/{userProfile?.totalAssessments}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                  👑 Elite Member
                </Badge>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <Badge variant="outline">{course.progress}%</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  <Progress value={course.progress} className="mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{course.duration}</span>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Continue
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed Leadership Assessment</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Started new module</p>
                  <p className="text-xs text-gray-600">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Achieved 7-day streak</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                    {!announcement.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Zap className="w-6 h-6" />
          <span className="text-sm">Take Assessment</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <BookOpen className="w-6 h-6" />
          <span className="text-sm">Browse Content</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Users className="w-6 h-6" />
          <span className="text-sm">Community</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Settings className="w-6 h-6" />
          <span className="text-sm">Settings</span>
        </Button>
      </div>
    </div>
  )
}