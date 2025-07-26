"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Layout handled by src/app/soft-member/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen,
  Play,
  FileText,
  Target,
  Clock,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
  BookmarkPlus,
  Eye,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  Lightbulb,
  Download,
  Share,
  ChevronRight
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'

interface ContentItem {
  id: string
  title: string
  type: 'article' | 'video' | 'assessment' | 'worksheet' | 'case_study'
  category: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  progress: number
  unlocked: boolean
  featured: boolean
  rating: number
  completions: number
  tags: string[]
  publishedAt: string
  lastUpdated: string
  author?: string
  thumbnail?: string
}

interface ContentStats {
  totalItems: number
  completedItems: number
  inProgressItems: number
  totalWatchTime: string
  weeklyGoal: number
  weeklyProgress: number
}

export default function SoftMemberContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [stats, setStats] = useState<ContentStats>({
    totalItems: 0,
    completedItems: 0,
    inProgressItems: 0,
    totalWatchTime: '0h 0m',
    weeklyGoal: 5,
    weeklyProgress: 3
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('browse')

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Mock content data - in production this would come from API
        const mockContent: ContentItem[] = [
          {
            id: '1',
            title: 'The Psychology of Decision Making',
            type: 'article',
            category: 'Decision Making',
            description: 'Understanding the cognitive biases that influence your daily decisions and how to overcome them.',
            duration: '12 min read',
            difficulty: 'intermediate',
            progress: 75,
            unlocked: true,
            featured: true,
            rating: 4.8,
            completions: 234,
            tags: ['psychology', 'decision-making', 'cognitive-bias'],
            publishedAt: '2025-01-20',
            lastUpdated: '2025-01-22',
            author: 'Dr. Sarah Chen'
          },
          {
            id: '2',
            title: 'Leadership Transformation Masterclass',
            type: 'video',
            category: 'Leadership',
            description: 'A comprehensive video series on transforming your leadership style and building high-performing teams.',
            duration: '45 min',
            difficulty: 'advanced',
            progress: 0,
            unlocked: true,
            featured: true,
            rating: 4.9,
            completions: 456,
            tags: ['leadership', 'transformation', 'teams'],
            publishedAt: '2025-01-18',
            lastUpdated: '2025-01-20',
            author: 'Marcus Johnson'
          },
          {
            id: '3',
            title: 'Goal Achievement Assessment',
            type: 'assessment',
            category: 'Goal Setting',
            description: 'Discover your goal-setting patterns and unlock personalized strategies for success.',
            duration: '20 min',
            difficulty: 'beginner',
            progress: 100,
            unlocked: true,
            featured: false,
            rating: 4.6,
            completions: 189,
            tags: ['goals', 'assessment', 'strategy'],
            publishedAt: '2025-01-15',
            lastUpdated: '2025-01-15',
            author: 'Galaxy Kiro Team'
          },
          {
            id: '4',
            title: 'Vision Clarity Worksheet',
            type: 'worksheet',
            category: 'Vision',
            description: 'Interactive exercises to help crystallize your personal and professional vision.',
            duration: '30 min',
            difficulty: 'intermediate',
            progress: 50,
            unlocked: true,
            featured: false,
            rating: 4.4,
            completions: 167,
            tags: ['vision', 'clarity', 'planning'],
            publishedAt: '2025-01-12',
            lastUpdated: '2025-01-18',
            author: 'Dr. Elena Rodriguez'
          },
          {
            id: '5',
            title: 'Advanced Influence Strategies',
            type: 'case_study',
            category: 'Influence',
            description: 'Real-world case studies of successful influence campaigns and their psychological foundations.',
            duration: '25 min read',
            difficulty: 'advanced',
            progress: 0,
            unlocked: false,
            featured: false,
            rating: 4.7,
            completions: 89,
            tags: ['influence', 'case-study', 'psychology'],
            publishedAt: '2025-01-10',
            lastUpdated: '2025-01-10',
            author: 'Prof. Michael Chang'
          },
          {
            id: '6',
            title: 'Habit Formation Fundamentals',
            type: 'video',
            category: 'Habits',
            description: 'Science-backed strategies for building lasting habits that support your transformation goals.',
            duration: '28 min',
            difficulty: 'beginner',
            progress: 0,
            unlocked: true,
            featured: false,
            rating: 4.5,
            completions: 312,
            tags: ['habits', 'science', 'transformation'],
            publishedAt: '2025-01-08',
            lastUpdated: '2025-01-12',
            author: 'Dr. James Wilson'
          }
        ]

        setContent(mockContent)
        setFilteredContent(mockContent)

        // Calculate stats
        const completed = mockContent.filter(item => item.progress === 100).length
        const inProgress = mockContent.filter(item => item.progress > 0 && item.progress < 100).length
        
        setStats({
          totalItems: mockContent.length,
          completedItems: completed,
          inProgressItems: inProgress,
          totalWatchTime: '2h 45m',
          weeklyGoal: 5,
          weeklyProgress: 3
        })

        // Track page visit
        leadScoringService.updateEngagement('high_engagement', {
          eventType: 'page_visit',
          page: 'soft_member_content'
        })

      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Filter and sort content
  useEffect(() => {
    let filtered = content.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesType = selectedType === 'all' || item.type === selectedType
      const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesType && matchesDifficulty
    })

    // Sort content
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'popular':
          return b.completions - a.completions
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration)
        default:
          return 0
      }
    })

    setFilteredContent(filtered)
  }, [content, searchQuery, selectedCategory, selectedType, selectedDifficulty, sortBy])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen
      case 'video': return Play
      case 'assessment': return Target
      case 'worksheet': return FileText
      case 'case_study': return Lightbulb
      default: return BookOpen
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'advanced': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const handleContentClick = (item: ContentItem) => {
    if (!item.unlocked) return

    // Track content engagement
    leadScoringService.updateEngagement('high_engagement', {
      eventType: 'content_engagement',
      contentType: item.type,
      contentId: item.id,
      engagementType: 'start'
    })

    // In production, this would navigate to the actual content viewer
    console.log('Opening content:', item.title)
  }

  const categories = Array.from(new Set(content.map(item => item.category)))
  const types = Array.from(new Set(content.map(item => item.type)))

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading content library...</p>
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
              <h1 className="text-3xl font-bold mb-2">Content Library</h1>
              <p className="text-muted-foreground">
                Curated content designed to accelerate your transformation journey
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
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
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedItems}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressItems}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Watch Time</p>
                <p className="text-2xl font-bold">{stats.totalWatchTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Weekly Learning Goal</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.weeklyProgress} of {stats.weeklyGoal} items completed this week
                </p>
              </div>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-3" />
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browse">Browse All</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Grid/List */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredContent.map((item, index) => {
                    const Icon = getTypeIcon(item.type)
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card 
                          className={`${viewMode === 'grid' ? 'p-6' : 'p-4'} ${
                            item.unlocked 
                              ? 'hover:shadow-lg cursor-pointer transition-all duration-200' 
                              : 'opacity-60'
                          } ${item.featured ? 'ring-2 ring-primary/20' : ''}`}
                          onClick={() => handleContentClick(item)}
                        >
                          {viewMode === 'grid' ? (
                            // Grid View
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-lg ${item.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                                  <Icon className={`w-6 h-6 ${item.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  {item.featured && (
                                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                                      Featured
                                    </Badge>
                                  )}
                                  {!item.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                  {item.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                                    {item.difficulty}
                                  </Badge>
                                  <span>{item.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{item.rating}</span>
                                </div>
                              </div>

                              {item.progress > 0 && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{item.progress}%</span>
                                  </div>
                                  <Progress value={item.progress} className="h-2" />
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <BookmarkPlus className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // List View
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${item.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                                <Icon className={`w-5 h-5 ${item.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold truncate">{item.title}</h3>
                                  {item.featured && (
                                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                  {!item.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                                    {item.difficulty}
                                  </Badge>
                                  <span>{item.duration}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{item.rating}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                {item.progress > 0 && (
                                  <div className="flex items-center space-x-2">
                                    <Progress value={item.progress} className="h-2 w-20" />
                                    <span className="text-xs font-medium w-10">{item.progress}%</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <BookmarkPlus className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {filteredContent.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No content found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or explore different categories.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {content.filter(item => item.featured).map((item, index) => {
                  const Icon = getTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-6 hover:shadow-lg cursor-pointer transition-all duration-200 ring-2 ring-primary/20">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                            Featured
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="space-y-4">
                {content.filter(item => item.progress > 0 && item.progress < 100).map(item => {
                  const Icon = getTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4 hover:shadow-lg cursor-pointer transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <div className="flex items-center space-x-4 mb-2">
                            <Progress value={item.progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{item.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.category} • {item.duration}</p>
                        </div>
                        <Button>Continue</Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {content.filter(item => item.progress === 100).map(item => {
                  const Icon = getTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                          <p className="text-xs text-muted-foreground">{item.category} • Completed</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Certificate
                          </Button>
                          <Button variant="outline" size="sm">Review</Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}