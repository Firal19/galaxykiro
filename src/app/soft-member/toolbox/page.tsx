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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Package,
  BookOpen,
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
  Download,
  Share,
  Archive,
  Heart,
  Calendar,
  BarChart3,
  Award,
  Lightbulb,
  FileText,
  Eye,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trophy,
  Tag
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'
import Link from 'next/link'

interface SavedResult {
  id: string
  toolId: string
  toolName: string
  toolCategory: 'potential' | 'leadership' | 'habit' | 'goal' | 'mind'
  completedAt: string
  score?: number
  category?: string
  insights: string[]
  recommendations: string[]
  favorited: boolean
  notes?: string
  tags: string[]
  shareCount: number
  viewCount: number
}

interface FavoriteTool {
  id: string
  name: string
  category: string
  lastUsed: string
  completions: number
  averageScore: number
}

interface PersonalInsight {
  id: string
  title: string
  content: string
  source: 'assessment' | 'manual' | 'ai_generated'
  category: string
  createdAt: string
  importance: 'high' | 'medium' | 'low'
  tags: string[]
}

interface ToolboxStats {
  totalResults: number
  favoriteResults: number
  totalInsights: number
  averageScore: number
  improvementTrend: number
  lastActivityDays: number
}

export default function SoftMemberToolboxPage() {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([])
  const [favoriteTools, setFavoriteTools] = useState<FavoriteTool[]>([])
  const [personalInsights, setPersonalInsights] = useState<PersonalInsight[]>([])
  const [stats, setStats] = useState<ToolboxStats>({
    totalResults: 0,
    favoriteResults: 0,
    totalInsights: 0,
    averageScore: 0,
    improvementTrend: 0,
    lastActivityDays: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTool, setSelectedTool] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('results')
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null)

  useEffect(() => {
    const loadToolboxData = async () => {
      try {
        // Mock saved results data
        const mockResults: SavedResult[] = [
          {
            id: 'pqc-result-1',
            toolId: 'pqc',
            toolName: 'Potential Quotient Calculator',
            toolCategory: 'potential',
            completedAt: '2025-01-20',
            score: 87,
            category: 'High Potential',
            insights: [
              'Your visionary thinking is exceptionally strong',
              'Leadership communication could benefit from more structure',
              'High capacity for strategic planning and execution'
            ],
            recommendations: [
              'Focus on developing systematic communication frameworks',
              'Consider advanced leadership training programs',
              'Leverage your strategic thinking in cross-functional projects'
            ],
            favorited: true,
            notes: 'This assessment really opened my eyes to my leadership potential. Need to work on communication structure.',
            tags: ['leadership', 'potential', 'growth'],
            shareCount: 2,
            viewCount: 15
          },
          {
            id: 'trs-result-1',
            toolId: 'trs',
            toolName: 'Transformation Readiness Score',
            toolCategory: 'potential',
            completedAt: '2025-01-18',
            score: 73,
            category: 'Ready for Change',
            insights: [
              'Strong motivation for personal transformation',
              'Some resistance to changing established routines',
              'Good support system in place'
            ],
            recommendations: [
              'Start with small, manageable changes',
              'Build on existing support networks',
              'Create accountability partnerships'
            ],
            favorited: false,
            tags: ['transformation', 'readiness', 'change'],
            shareCount: 0,
            viewCount: 8
          },
          {
            id: 'lsp-result-1',
            toolId: 'lsp',
            toolName: 'Leadership Style Profiler',
            toolCategory: 'leadership',
            completedAt: '2025-01-15',
            score: 82,
            category: 'Transformational Leader',
            insights: [
              'Natural ability to inspire and motivate others',
              'Strong focus on team development',
              'Tendency to take on too much responsibility'
            ],
            recommendations: [
              'Practice delegation and trust-building',
              'Develop more structured feedback systems',
              'Balance individual and team focus'
            ],
            favorited: true,
            notes: 'Transformational leadership style resonates with me. Need to work on delegation.',
            tags: ['leadership', 'style', 'team'],
            shareCount: 1,
            viewCount: 12
          },
          {
            id: 'dcg-result-1',
            toolId: 'dcg',
            toolName: 'Dream Clarity Generator',
            toolCategory: 'goal',
            completedAt: '2025-01-12',
            score: 78,
            insights: [
              'Clear long-term vision for personal growth',
              'Some uncertainty about implementation steps',
              'Strong emotional connection to goals'
            ],
            recommendations: [
              'Break down vision into quarterly milestones',
              'Create detailed action plans for next 90 days',
              'Establish regular progress review sessions'
            ],
            favorited: false,
            tags: ['vision', 'goals', 'clarity'],
            shareCount: 0,
            viewCount: 6
          }
        ]

        // Mock favorite tools
        const mockFavoriteTools: FavoriteTool[] = [
          {
            id: 'pqc',
            name: 'Potential Quotient Calculator',
            category: 'potential',
            lastUsed: '2025-01-20',
            completions: 2,
            averageScore: 85
          },
          {
            id: 'lsp',
            name: 'Leadership Style Profiler',
            category: 'leadership',
            lastUsed: '2025-01-15',
            completions: 1,
            averageScore: 82
          },
          {
            id: 'trs',
            name: 'Transformation Readiness Score',
            category: 'potential',
            lastUsed: '2025-01-18',
            completions: 1,
            averageScore: 73
          }
        ]

        // Mock personal insights
        const mockInsights: PersonalInsight[] = [
          {
            id: 'insight-1',
            title: 'Leadership Communication Pattern',
            content: 'You consistently show strong visionary thinking but struggle with structured communication. This pattern appears across multiple assessments.',
            source: 'ai_generated',
            category: 'leadership',
            createdAt: '2025-01-21',
            importance: 'high',
            tags: ['communication', 'leadership', 'pattern']
          },
          {
            id: 'insight-2',
            title: 'Growth Mindset Strength',
            content: 'Your assessments reveal a powerful growth mindset with high transformation readiness and learning agility.',
            source: 'assessment',
            category: 'mindset',
            createdAt: '2025-01-19',
            importance: 'medium',
            tags: ['growth', 'mindset', 'learning']
          },
          {
            id: 'insight-3',
            title: 'Strategic vs Tactical Balance',
            content: 'Strong strategic thinking capabilities but may benefit from developing more tactical execution skills.',
            source: 'manual',
            category: 'strategy',
            createdAt: '2025-01-17',
            importance: 'medium',
            tags: ['strategy', 'execution', 'planning']
          }
        ]

        setSavedResults(mockResults)
        setFavoriteTools(mockFavoriteTools)
        setPersonalInsights(mockInsights)

        // Calculate stats
        const favorited = mockResults.filter(result => result.favorited).length
        const totalScore = mockResults.reduce((sum, result) => sum + (result.score || 0), 0)
        const avgScore = mockResults.length > 0 ? Math.round(totalScore / mockResults.length) : 0

        setStats({
          totalResults: mockResults.length,
          favoriteResults: favorited,
          totalInsights: mockInsights.length,
          averageScore: avgScore,
          improvementTrend: 12, // Mock positive trend
          lastActivityDays: 1
        })

        // Track page visit
        leadScoringService.trackInteraction({
          eventType: 'page_visit',
          page: 'soft_member_toolbox'
        })

      } catch (error) {
        console.error('Error loading toolbox data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadToolboxData()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'potential': return Target
      case 'leadership': return Users
      case 'habit': return TrendingUp
      case 'goal': return Star
      case 'mind': return Brain
      default: return Package
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const handleToggleFavorite = (resultId: string) => {
    setSavedResults(prev => prev.map(result => 
      result.id === resultId 
        ? { ...result, favorited: !result.favorited }
        : result
    ))
  }

  const handleDeleteResult = (resultId: string) => {
    setSavedResults(prev => prev.filter(result => result.id !== resultId))
  }

  const filteredResults = savedResults.filter(result => {
    const matchesSearch = result.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.insights.some(insight => insight.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || result.toolCategory === selectedCategory
    const matchesTool = selectedTool === 'all' || result.toolId === selectedTool

    return matchesSearch && matchesCategory && matchesTool
  })

  const filteredInsights = personalInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <SoftMemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your toolbox...</p>
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
              <h1 className="text-3xl font-bold mb-2">My Toolbox</h1>
              <p className="text-muted-foreground">
                Your personal collection of assessment results, insights, and favorite tools
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
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
                <p className="text-sm text-muted-foreground">Saved Results</p>
                <p className="text-2xl font-bold">{stats.totalResults}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{stats.favoriteResults}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Personal Insights</p>
                <p className="text-2xl font-bold">{stats.totalInsights}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        {/* Progress Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Progress Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Your assessment journey and improvement trends
                </p>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">+{stats.improvementTrend}% this month</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Assessment Streak</p>
                <p className="text-2xl font-bold text-primary">7 days</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-500">94%</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold">Growth Score</p>
                <p className="text-2xl font-bold text-purple-500">A+</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Toolbox Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="results">Saved Results</TabsTrigger>
              <TabsTrigger value="favorites">Favorite Tools</TabsTrigger>
              <TabsTrigger value="insights">Personal Insights</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search results..."
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
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="habit">Habits</SelectItem>
                      <SelectItem value="goal">Goals</SelectItem>
                      <SelectItem value="mind">Mind</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="score">Highest Score</SelectItem>
                      <SelectItem value="favorites">Favorites First</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Grid/List */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredResults.map((result, index) => {
                    const CategoryIcon = getCategoryIcon(result.toolCategory)
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className={`${viewMode === 'grid' ? 'p-6' : 'p-4'} hover:shadow-lg transition-all duration-200`}>
                          {viewMode === 'grid' ? (
                            // Grid View
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <CategoryIcon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm">{result.toolName}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(result.completedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleFavorite(result.id)}
                                  >
                                    <Heart className={`w-4 h-4 ${result.favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {result.score && (
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div>
                                    <p className="text-2xl font-bold text-primary">{result.score}</p>
                                    <p className="text-xs text-muted-foreground">Score</p>
                                  </div>
                                  {result.category && (
                                    <Badge variant="secondary">{result.category}</Badge>
                                  )}
                                </div>
                              )}

                              <div>
                                <h4 className="font-medium text-sm mb-2">Key Insights:</h4>
                                <ul className="space-y-1">
                                  {result.insights.slice(0, 2).map((insight, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground flex items-start space-x-2">
                                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                      <span>{insight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {result.notes && (
                                <div className="p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                                  <p className="text-xs text-blue-800">{result.notes}</p>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Eye className="w-3 h-3" />
                                  <span>{result.viewCount}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 pt-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="flex-1">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>{result.toolName} - Results</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      {result.score && (
                                        <Card className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="text-3xl font-bold text-primary">{result.score}</p>
                                              <p className="text-sm text-muted-foreground">Overall Score</p>
                                            </div>
                                            {result.category && (
                                              <Badge className="text-lg px-4 py-2">{result.category}</Badge>
                                            )}
                                          </div>
                                        </Card>
                                      )}
                                      
                                      <div>
                                        <h4 className="font-semibold mb-3">Key Insights</h4>
                                        <ul className="space-y-2">
                                          {result.insights.map((insight, idx) => (
                                            <li key={idx} className="flex items-start space-x-2">
                                              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                              <span className="text-sm">{insight}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div>
                                        <h4 className="font-semibold mb-3">Recommendations</h4>
                                        <ul className="space-y-2">
                                          {result.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start space-x-2">
                                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                              <span className="text-sm">{rec}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {result.notes && (
                                        <div>
                                          <h4 className="font-semibold mb-3">Your Notes</h4>
                                          <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm">{result.notes}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // List View
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CategoryIcon className="w-5 h-5 text-primary" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold truncate">{result.toolName}</h3>
                                  {result.score && (
                                    <Badge variant="secondary">{result.score}</Badge>
                                  )}
                                  {result.favorited && (
                                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-1">
                                  {result.insights[0]}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{new Date(result.completedAt).toLocaleDateString()}</span>
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{result.viewCount}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="ghost" size="sm">
                                  <Share className="w-4 h-4" />
                                </Button>
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
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteTools.map(tool => (
                  <Card key={tool.id} className="p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{tool.name}</h3>
                      <Badge variant="outline" className="capitalize">{tool.category}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">{tool.completions}</p>
                        <p className="text-xs text-muted-foreground">Completions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-500">{tool.averageScore}</p>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Last used: {new Date(tool.lastUsed).toLocaleDateString()}
                    </p>
                    <Link href={`/tools/${tool.id}`}>
                      <Button className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Use Tool
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="space-y-4">
                {filteredInsights.map(insight => (
                  <Card key={insight.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className={getImportanceColor(insight.importance)}>
                            {insight.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="capitalize">{insight.source.replace('_', ' ')}</span>
                          <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                          <Badge variant="secondary" className="text-xs">{insight.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {insight.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Assessment Completion Trend</h3>
                  <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Score Improvements</h3>
                  <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Progress chart would go here</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Category Breakdown</h3>
                  <div className="space-y-3">
                    {['potential', 'leadership', 'goal', 'habit'].map(category => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize text-sm">{category}</span>
                        <div className="flex items-center space-x-2 flex-1 ml-4">
                          <Progress value={Math.random() * 100} className="h-2" />
                          <span className="text-xs text-muted-foreground w-10">
                            {Math.round(Math.random() * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {savedResults.slice(0, 3).map(result => (
                      <div key={result.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.toolName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {result.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </SoftMemberLayout>
  )
}