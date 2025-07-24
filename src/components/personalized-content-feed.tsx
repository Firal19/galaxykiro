"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Video, 
  FileText, 
  Clock, 
  Star,
  TrendingUp,
  Play,
  Download,
  Eye,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface ContentItem {
  id: string
  title: string
  type: 'article' | 'video' | 'assessment' | 'webinar' | 'document'
  description: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  isUnlocked: boolean
  isPriority: boolean
  completionStatus: 'not_started' | 'in_progress' | 'completed'
  engagementScore: number
  publishedAt: string
  thumbnail?: string
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Understanding Your Potential Assessment Results',
    type: 'article',
    description: 'Deep dive into interpreting your assessment scores and what they mean for your personal development journey.',
    estimatedTime: '8 min read',
    difficulty: 'beginner',
    category: 'Self-Discovery',
    isUnlocked: true,
    isPriority: true,
    completionStatus: 'not_started',
    engagementScore: 95,
    publishedAt: '2024-01-15',
    thumbnail: '/content/assessment-guide.jpg'
  },
  {
    id: '2',
    title: 'The Science of Goal Achievement',
    type: 'video',
    description: 'Learn the psychological principles behind successful goal setting and achievement, backed by Ethiopian success stories.',
    estimatedTime: '12 min watch',
    difficulty: 'intermediate',
    category: 'Goal Setting',
    isUnlocked: true,
    isPriority: false,
    completionStatus: 'not_started',
    engagementScore: 88,
    publishedAt: '2024-01-10',
    thumbnail: '/content/goal-science.jpg'
  },
  {
    id: '3',
    title: 'Advanced Leadership Assessment',
    type: 'assessment',
    description: 'Unlock your leadership potential with our comprehensive 50-question leadership style assessment.',
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'Leadership',
    isUnlocked: true,
    isPriority: false,
    completionStatus: 'not_started',
    engagementScore: 92,
    publishedAt: '2024-01-08',
    thumbnail: '/content/leadership-assessment.jpg'
  },
  {
    id: '4',
    title: 'Weekly Transformation Webinar',
    type: 'webinar',
    description: 'Join our live weekly session focusing on overcoming limiting beliefs and building confidence.',
    estimatedTime: '60 min',
    difficulty: 'all levels',
    category: 'Live Training',
    isUnlocked: true,
    isPriority: true,
    completionStatus: 'not_started',
    engagementScore: 97,
    publishedAt: '2024-01-12',
    thumbnail: '/content/webinar-thumbnail.jpg'
  },
  {
    id: '5',
    title: 'Personal Development Workbook',
    type: 'document',
    description: 'Comprehensive 30-page workbook with exercises and reflection prompts for your growth journey.',
    estimatedTime: '45 min',
    difficulty: 'all levels',
    category: 'Resources',
    isUnlocked: false,
    isPriority: false,
    completionStatus: 'not_started',
    engagementScore: 85,
    publishedAt: '2024-01-05',
    thumbnail: '/content/workbook-cover.jpg'
  }
]

const getIconForType = (type: ContentItem['type']) => {
  switch (type) {
    case 'article': return FileText
    case 'video': return Video
    case 'assessment': return TrendingUp
    case 'webinar': return Play
    case 'document': return Download
    default: return BookOpen
  }
}

const getDifficultyColor = (difficulty: ContentItem['difficulty']) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

interface PersonalizedContentFeedProps {
  userId?: string
  engagementLevel?: 'browser' | 'engaged' | 'soft-member'
}

export function PersonalizedContentFeed({ userId, engagementLevel = 'browser' }: PersonalizedContentFeedProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'priority' | 'new' | 'in-progress'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setContent(mockContent)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId])

  const filteredContent = content.filter(item => {
    switch (activeFilter) {
      case 'priority': return item.isPriority
      case 'new': return new Date(item.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      case 'in-progress': return item.completionStatus === 'in_progress'
      default: return true
    }
  })

  const handleContentClick = async (contentId: string) => {
    // Track engagement
    try {
      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'content_click',
          event_data: { content_id: contentId },
          session_id: localStorage.getItem('session_id'),
        }),
      })
    } catch (error) {
      console.error('Error tracking content click:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Personalized Content
          </h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredContent.length} items
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Content', count: content.length },
          { key: 'priority', label: 'Priority', count: content.filter(c => c.isPriority).length },
          { key: 'new', label: 'New', count: content.filter(c => new Date(c.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
          { key: 'in-progress', label: 'In Progress', count: content.filter(c => c.completionStatus === 'in_progress').length },
        ].map(filter => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter.key as any)}
            className="text-sm"
          >
            {filter.label}
            {filter.count > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item, index) => {
          const IconComponent = getIconForType(item.type)
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                item.isUnlocked 
                  ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-75'
              }`}>
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${item.isUnlocked ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <IconComponent className={`w-5 h-5 ${item.isUnlocked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${item.isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {item.title}
                          </h3>
                          {item.isPriority && (
                            <Badge variant="destructive" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Priority
                            </Badge>
                          )}
                          {!item.isUnlocked && (
                            <Badge variant="outline" className="text-xs">
                              🔒 Locked
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${item.isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.estimatedTime}
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </Badge>
                        <span className="text-gray-400">•</span>
                        <span>{item.category}</span>
                      </div>

                      {item.isUnlocked ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleContentClick(item.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          {item.type === 'assessment' ? 'Take Assessment' : 
                           item.type === 'video' ? 'Watch' :
                           item.type === 'webinar' ? 'Join' :
                           item.type === 'document' ? 'Download' : 'Read'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled
                          className="text-gray-400"
                        >
                          Unlock Required
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No content found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later for new content.
          </p>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Complete more assessments to unlock premium content
          </div>
          <Link href="/tools">
            <Button size="sm">
              Browse All Tools
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}