"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SoftMemberLayout } from '@/components/layouts/soft-member-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap,
  Target,
  Brain,
  TrendingUp,
  Users,
  Clock,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
  Play,
  CheckCircle,
  Lock,
  Award,
  Lightbulb,
  BarChart3,
  Calendar,
  Settings,
  BookOpen,
  ArrowRight,
  Timer,
  Sparkles
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  description: string
  category: 'potential' | 'leadership' | 'habit' | 'goal' | 'mind'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  completions: number
  rating: number
  unlocked: boolean
  featured: boolean
  lastUsed?: string
  completedAt?: string
  progress?: number
  results?: any
  tags: string[]
  path: string
}

interface ToolStats {
  totalTools: number
  completedTools: number
  inProgressTools: number
  favoriteTools: number
  totalTimeSpent: string
  averageScore: number
}

export default function SoftMemberToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [stats, setStats] = useState<ToolStats>({
    totalTools: 0,
    completedTools: 0,
    inProgressTools: 0,
    favoriteTools: 0,
    totalTimeSpent: '0h 0m',
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const loadTools = async () => {
      try {
        // Mock tools data - in production this would come from API
        const mockTools: Tool[] = [
          {
            id: 'pqc',
            name: 'Potential Quotient Calculator',
            description: 'Discover your untapped potential across multiple dimensions of personal growth and transformation.',
            category: 'potential',
            difficulty: 'intermediate',
            duration: '20-25 min',
            completions: 1247,
            rating: 4.9,
            unlocked: true,
            featured: true,
            lastUsed: '2025-01-23',
            completedAt: '2025-01-20',
            progress: 100,
            results: { score: 87, category: 'High Potential' },
            tags: ['assessment', 'potential', 'growth'],
            path: '/tools/potential-quotient-calculator'
          },
          {
            id: 'trs',
            name: 'Transformation Readiness Score',
            description: 'Assess your current readiness for significant life and career transformation.',
            category: 'potential',
            difficulty: 'beginner',
            duration: '15 min',
            completions: 892,
            rating: 4.7,
            unlocked: true,
            featured: true,
            lastUsed: '2025-01-22',
            progress: 75,
            tags: ['readiness', 'transformation', 'assessment'],
            path: '/tools/transformation-readiness-score'
          },
          {
            id: 'lsp',
            name: 'Leadership Style Profiler',
            description: 'Identify your natural leadership style and discover areas for development.',
            category: 'leadership',
            difficulty: 'intermediate',
            duration: '18 min',
            completions: 673,
            rating: 4.8,
            unlocked: true,
            featured: false,
            completedAt: '2025-01-18',
            progress: 100,
            results: { style: 'Transformational Leader', score: 82 },
            tags: ['leadership', 'style', 'development'],
            path: '/tools/leadership-style-profiler'
          },
          {
            id: 'iqc',
            name: 'Influence Quotient Calculator',
            description: 'Measure your ability to influence others and build meaningful connections.',
            category: 'leadership',
            difficulty: 'advanced',
            duration: '25 min',
            completions: 456,
            rating: 4.6,
            unlocked: true,
            featured: false,
            lastUsed: '2025-01-21',
            progress: 40,
            tags: ['influence', 'communication', 'leadership'],
            path: '/tools/influence-quotient-calculator'
          },
          {
            id: 'hsa',
            name: 'Habit Strength Analyzer',
            description: 'Analyze the strength of your current habits and identify areas for improvement.',
            category: 'habit',
            difficulty: 'beginner',
            duration: '12 min',
            completions: 789,
            rating: 4.5,
            unlocked: true,
            featured: false,
            tags: ['habits', 'analysis', 'improvement'],
            path: '/tools/habit-strength-analyzer'
          },
          {
            id: 'hi',
            name: 'Habit Installer',
            description: 'Get personalized strategies for installing new positive habits that stick.',
            category: 'habit',
            difficulty: 'intermediate',
            duration: '22 min',
            completions: 567,
            rating: 4.7,
            unlocked: true,
            featured: false,
            lastUsed: '2025-01-19',
            progress: 60,
            tags: ['habits', 'installation', 'behavior-change'],
            path: '/tools/habit-installer'
          },
          {
            id: 'gap',
            name: 'Goal Achievement Predictor',
            description: 'Predict your likelihood of achieving specific goals and get improvement strategies.',
            category: 'goal',
            difficulty: 'intermediate',
            duration: '20 min',
            completions: 634,
            rating: 4.6,
            unlocked: true,
            featured: false,
            tags: ['goals', 'prediction', 'achievement'],
            path: '/tools/goal-achievement-predictor'
          },
          {
            id: 'dcg',
            name: 'Dream Clarity Generator',
            description: 'Transform vague aspirations into clear, actionable dreams and visions.',
            category: 'goal',
            difficulty: 'beginner',
            duration: '15 min',
            completions: 445,
            rating: 4.4,
            unlocked: true,
            featured: false,
            completedAt: '2025-01-17',
            progress: 100,
            results: { clarity_score: 78 },
            tags: ['dreams', 'clarity', 'vision'],
            path: '/tools/dream-clarity-generator'
          },
          {
            id: 'lbi',
            name: 'Limiting Belief Identifier',
            description: 'Uncover and address the limiting beliefs that hold you back from success.',
            category: 'mind',
            difficulty: 'advanced',
            duration: '30 min',
            completions: 387,
            rating: 4.8,
            unlocked: false,
            featured: false,
            tags: ['beliefs', 'mindset', 'breakthrough'],
            path: '/tools/limiting-belief-identifier'
          },
          {
            id: 'mmm',
            name: 'Mental Model Mapper',
            description: 'Visualize and optimize your mental models for better decision-making.',
            category: 'mind',
            difficulty: 'advanced',
            duration: '35 min',
            completions: 234,
            rating: 4.7,
            unlocked: false,
            featured: false,
            tags: ['mental-models', 'thinking', 'decisions'],
            path: '/tools/mental-model-mapper'
          },
          {
            id: 'aa',
            name: 'Affirmation Architect',
            description: 'Create personalized, powerful affirmations that align with your goals.',
            category: 'mind',
            difficulty: 'beginner',
            duration: '10 min',
            completions: 892,
            rating: 4.3,
            unlocked: true,
            featured: false,
            tags: ['affirmations', 'mindset', 'positivity'],
            path: '/tools/affirmation-architect'
          }
        ]

        setTools(mockTools)
        setFilteredTools(mockTools)

        // Calculate stats
        const completed = mockTools.filter(tool => tool.progress === 100 || tool.completedAt).length
        const inProgress = mockTools.filter(tool => tool.progress && tool.progress > 0 && tool.progress < 100).length
        const totalRatings = mockTools.reduce((sum, tool) => sum + tool.rating, 0)
        
        setStats({
          totalTools: mockTools.length,
          completedTools: completed,
          inProgressTools: inProgress,
          favoriteTools: 4, // Mock data
          totalTimeSpent: '3h 45m',
          averageScore: Math.round((totalRatings / mockTools.length) * 10) / 10
        })

        // Track page visit
        leadScoringService.trackInteraction({
          eventType: 'page_visit',
          page: 'soft_member_tools'
        })

      } catch (error) {
        console.error('Error loading tools:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTools()
  }, [])

  // Filter and sort tools
  useEffect(() => {
    let filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || tool.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Apply tab filters
    switch (activeTab) {
      case 'completed':
        filtered = filtered.filter(tool => tool.progress === 100 || tool.completedAt)
        break
      case 'progress':
        filtered = filtered.filter(tool => tool.progress && tool.progress > 0 && tool.progress < 100)
        break
      case 'featured':
        filtered = filtered.filter(tool => tool.featured)
        break
    }

    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        case 'rating':
          return b.rating - a.rating
        case 'popular':
          return b.completions - a.completions
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration)
        case 'recent':
          if (!a.lastUsed && !b.lastUsed) return 0
          if (!a.lastUsed) return 1
          if (!b.lastUsed) return -1
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        default:
          return 0
      }
    })

    setFilteredTools(filtered)
  }, [tools, searchQuery, selectedCategory, selectedDifficulty, sortBy, activeTab])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'potential': return Target
      case 'leadership': return Users
      case 'habit': return TrendingUp
      case 'goal': return Star
      case 'mind': return Brain
      default: return Zap
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

  const handleToolClick = (tool: Tool) => {
    if (!tool.unlocked) return

    // Track tool launch
    leadScoringService.trackInteraction({
      eventType: 'tool_usage',
      toolId: tool.id,
      toolName: tool.name,
      usageType: 'launch'
    })

    // Navigate to tool
    window.location.href = tool.path
  }

  const categories = Array.from(new Set(tools.map(tool => tool.category)))

  if (loading) {
    return (
      <SoftMemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your tools...</p>
          </div>
        </div>
      </SoftMemberLayout>
    )
  }

  return (
    <SoftMemberLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Assessment Tools</h1>
              <p className="text-muted-foreground">
                Interactive tools designed to unlock insights about your potential and growth path
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
                <p className="text-sm text-muted-foreground">Available Tools</p>
                <p className="text-2xl font-bold">{stats.totalTools}</p>
              </div>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTools}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressTools}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </motion.div>

        {/* Quick Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Assessment Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.completedTools} of {stats.totalTools} tools completed
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  {Math.round((stats.completedTools / stats.totalTools) * 100)}% Complete
                </span>
              </div>
            </div>
            <Progress value={(stats.completedTools / stats.totalTools) * 100} className="h-3" />
          </Card>
        </motion.div>

        {/* Tools Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tools</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
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
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="recent">Recently Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tools Grid/List */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredTools.map((tool, index) => {
                    const CategoryIcon = getCategoryIcon(tool.category)
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card 
                          className={`${viewMode === 'grid' ? 'p-6' : 'p-4'} ${
                            tool.unlocked 
                              ? 'hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105' 
                              : 'opacity-60'
                          } ${tool.featured ? 'ring-2 ring-primary/20' : ''}`}
                          onClick={() => handleToolClick(tool)}
                        >
                          {viewMode === 'grid' ? (
                            // Grid View
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-lg ${
                                  tool.unlocked ? 'bg-primary/10' : 'bg-muted'
                                }`}>
                                  <CategoryIcon className={`w-6 h-6 ${
                                    tool.unlocked ? 'text-primary' : 'text-muted-foreground'
                                  }`} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  {tool.featured && (
                                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                                      Featured
                                    </Badge>
                                  )}
                                  {!tool.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 line-clamp-2">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                  {tool.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getDifficultyColor(tool.difficulty)}>
                                    {tool.difficulty}
                                  </Badge>
                                  <span className="flex items-center space-x-1">
                                    <Timer className="w-3 h-3" />
                                    <span>{tool.duration}</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{tool.rating}</span>
                                </div>
                              </div>

                              {/* Progress or Results */}
                              {tool.progress !== undefined && tool.progress > 0 && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{tool.progress}%</span>
                                  </div>
                                  <Progress value={tool.progress} className="h-2" />
                                </div>
                              )}

                              {tool.results && (
                                <div className="bg-muted/30 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Last Result</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {tool.results.score ? `Score: ${tool.results.score}` : tool.results.category}
                                    </Badge>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {tool.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <BarChart3 className="w-3 h-3" />
                                  <span>{tool.completions}</span>
                                </div>
                              </div>

                              <Button 
                                className="w-full" 
                                disabled={!tool.unlocked}
                                variant={tool.progress === 100 ? "outline" : "default"}
                              >
                                {!tool.unlocked ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Locked
                                  </>
                                ) : tool.progress === 100 ? (
                                  <>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Retake
                                  </>
                                ) : tool.progress && tool.progress > 0 ? (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Continue
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Start Assessment
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            // List View
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${
                                tool.unlocked ? 'bg-primary/10' : 'bg-muted'
                              }`}>
                                <CategoryIcon className={`w-5 h-5 ${
                                  tool.unlocked ? 'text-primary' : 'text-muted-foreground'
                                }`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold truncate">{tool.name}</h3>
                                  {tool.featured && (
                                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                  {!tool.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">
                                  {tool.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <Badge variant="outline" className={getDifficultyColor(tool.difficulty)}>
                                    {tool.difficulty}
                                  </Badge>
                                  <span className="flex items-center space-x-1">
                                    <Timer className="w-3 h-3" />
                                    <span>{tool.duration}</span>
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{tool.rating}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                {tool.progress !== undefined && tool.progress > 0 && (
                                  <div className="flex items-center space-x-2">
                                    <Progress value={tool.progress} className="h-2 w-20" />
                                    <span className="text-xs font-medium w-10">{tool.progress}%</span>
                                  </div>
                                )}
                                
                                <Button 
                                  size="sm"
                                  disabled={!tool.unlocked}
                                  variant={tool.progress === 100 ? "outline" : "default"}
                                >
                                  {!tool.unlocked ? (
                                    <>
                                      <Lock className="w-4 h-4 mr-1" />
                                      Locked
                                    </>
                                  ) : tool.progress === 100 ? (
                                    'Retake'
                                  ) : tool.progress && tool.progress > 0 ? (
                                    'Continue'
                                  ) : (
                                    'Start'
                                  )}
                                </Button>
                                
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or explore different categories.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Unlock More Section */}
        {tools.some(tool => !tool.unlocked) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Unlock Advanced Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete more assessments and increase your engagement to unlock premium tools
                    </p>
                  </div>
                </div>
                <Button>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </SoftMemberLayout>
  )
}