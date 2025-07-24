"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
  Settings,
  Upload,
  Save,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Users,
  TrendingUp,
  Target,
  Package,
  BookOpen,
  Layers,
  Lightbulb,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'
import { ContentModel, ContentCategory, ContentDepthLevel, ContentType, CONTENT_CATEGORIES, ContentLibrary } from '@/lib/models/content'
import { ContentPublishingCalendar } from '@/components/admin/content-publishing-calendar'
import { ContentABTestingDashboard } from '@/components/admin/content-ab-testing-dashboard'

// Master Plan Content Hierarchy Types
export type ContentHierarchyLevel = 'package' | 'core' | 'enhanced' | 'chunk' | 'concept'

export interface ContentPackage {
  id: string
  name: string
  description: string
  category: ContentCategory
  totalCores: number
  totalEnhanced: number
  totalChunks: number
  totalConcepts: number
  targetAudience: 'visitors' | 'cold_leads' | 'candidates' | 'hot_leads'
  estimatedCompletionTime: number // in hours
  createdAt: string
  updatedAt: string
  status: 'draft' | 'review' | 'published' | 'archived'
  coverImage?: string
}

export interface ContentCore {
  id: string
  packageId: string
  title: string
  description: string
  learningObjectives: string[]
  prerequisites: string[]
  estimatedTime: number // in minutes
  order: number
  status: 'draft' | 'review' | 'published'
  valueEscalator: {
    hook: string
    insight: string
    application: string
    hungerBuilder: string
    nextStep: string
  }
}

export interface ContentChunk {
  id: string
  coreId: string
  title: string
  content: string
  chunkType: 'concept' | 'exercise' | 'reflection' | 'application' | 'assessment'
  order: number
  estimatedTime: number // in minutes
  interactionElements: InteractionElement[]
}

export interface InteractionElement {
  id: string
  type: 'quiz' | 'reflection' | 'action_item' | 'discussion' | 'poll' | 'survey'
  title: string
  content: string
  options?: string[]
  correctAnswer?: string
  points?: number
}

export function AdminContentManagerV2() {
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'calendar' | 'testing' | 'analytics'>('overview')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all')
  const [selectedLevel, setSelectedLevel] = useState<ContentHierarchyLevel | 'all'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real implementation, fetch from API
  const [contentLibrary] = useState(new ContentLibrary())
  const [packages, setPackages] = useState<ContentPackage[]>([
    {
      id: 'pkg_untapped_you',
      name: 'The Untapped You Mastery',
      description: 'Complete system for discovering and activating hidden potential',
      category: 'untapped-you',
      totalCores: 8,
      totalEnhanced: 24,
      totalChunks: 96,
      totalConcepts: 288,
      targetAudience: 'visitors',
      estimatedCompletionTime: 40,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      status: 'published',
      coverImage: '/images/packages/untapped-you.jpg'
    },
    {
      id: 'pkg_dreams_reality',
      name: 'Dreams to Reality Blueprint',
      description: 'Transform aspirations into achievable goals with clear action plans',
      category: 'dreams-to-reality',
      totalCores: 6,
      totalEnhanced: 18,
      totalChunks: 72,
      totalConcepts: 216,
      targetAudience: 'cold_leads',
      estimatedCompletionTime: 30,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-16',
      status: 'published'
    },
    {
      id: 'pkg_daily_edge',
      name: 'The Daily Edge System',
      description: 'Compound small daily actions into extraordinary results',
      category: 'daily-edge',
      totalCores: 10,
      totalEnhanced: 30,
      totalChunks: 120,
      totalConcepts: 360,
      targetAudience: 'candidates',
      estimatedCompletionTime: 50,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-17',
      status: 'review'
    }
  ])

  const [contentStats, setContentStats] = useState({
    totalPackages: 12,
    totalCores: 84,
    totalChunks: 672,
    totalConcepts: 2016,
    publishedContent: 8,
    draftContent: 3,
    reviewContent: 1,
    avgEngagement: 78.5,
    totalViews: 45632,
    activeUsers: 2847
  })

  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data would be fetched here
      } catch (error) {
        console.error('Error fetching content data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContentData()
  }, [])

  const filteredContent = contentLibrary.search({
    searchQuery: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'archived': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTargetAudienceColor = (audience: string) => {
    switch (audience) {
      case 'visitors': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cold_leads': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'candidates': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'hot_leads': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateContent = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditContent = (content: ContentModel) => {
    setSelectedContent(content)
    // Open edit modal or navigate to edit page
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Content Manager</h2>
          <p className="text-gray-300">Manage the complete content hierarchy: Packages → Cores → Chunks → Concepts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateContent} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="library" className="data-[state=active]:bg-purple-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-600">
            <Calendar className="w-4 h-4 mr-2" />
            Publishing Calendar
          </TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Packages',
                value: contentStats.totalPackages,
                change: '+2 this month',
                icon: Package,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Core Modules',
                value: contentStats.totalCores,
                change: '+8 this week',
                icon: BookOpen,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Content Chunks',
                value: contentStats.totalChunks,
                change: '+24 this week',
                icon: Layers,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Concepts',
                value: contentStats.totalConcepts,
                change: '+67 this week',
                icon: Lightbulb,
                color: 'from-orange-500 to-red-500'
              }
            ].map((metric, index) => {
              const IconComponent = metric.icon
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm text-green-400">
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{metric.title}</div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Content Hierarchy Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Content Hierarchy Overview</h3>
              
              <div className="space-y-6">
                {/* Hierarchy Flow */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <Package className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Packages</div>
                      <div className="text-lg font-bold text-green-400">{contentStats.totalPackages}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="text-center">
                      <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Core Modules</div>
                      <div className="text-lg font-bold text-blue-400">{contentStats.totalCores}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="text-center">
                      <Layers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Chunks</div>
                      <div className="text-lg font-bold text-purple-400">{contentStats.totalChunks}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="text-center">
                      <Lightbulb className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Concepts</div>
                      <div className="text-lg font-bold text-orange-400">{contentStats.totalConcepts}</div>
                    </div>
                  </div>
                </div>

                {/* Package Status Distribution */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-medium">Published</span>
                      <span className="text-2xl font-bold text-green-400">{contentStats.publishedContent}</span>
                    </div>
                    <Progress value={(contentStats.publishedContent / contentStats.totalPackages) * 100} className="h-2" />
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-medium">In Review</span>
                      <span className="text-2xl font-bold text-yellow-400">{contentStats.reviewContent}</span>
                    </div>
                    <Progress value={(contentStats.reviewContent / contentStats.totalPackages) * 100} className="h-2" />
                  </div>
                  <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 font-medium">Draft</span>
                      <span className="text-2xl font-bold text-gray-400">{contentStats.draftContent}</span>
                    </div>
                    <Progress value={(contentStats.draftContent / contentStats.totalPackages) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Recent Content Packages</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {packages.slice(0, 3).map((pkg, index) => (
                  <div key={pkg.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${CONTENT_CATEGORIES[pkg.category].color === '#10B981' ? 'from-green-500 to-emerald-500' : 
                        CONTENT_CATEGORIES[pkg.category].color === '#3B82F6' ? 'from-blue-500 to-cyan-500' :
                        CONTENT_CATEGORIES[pkg.category].color === '#F59E0B' ? 'from-yellow-500 to-orange-500' :
                        CONTENT_CATEGORIES[pkg.category].color === '#8B5CF6' ? 'from-purple-500 to-pink-500' :
                        'from-red-500 to-pink-500'}`}>
                        <span className="text-2xl">{CONTENT_CATEGORIES[pkg.category].icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{pkg.name}</h4>
                        <p className="text-sm text-gray-400">{pkg.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(pkg.status)}>{pkg.status}</Badge>
                          <Badge className={getTargetAudienceColor(pkg.targetAudience)}>
                            {pkg.targetAudience.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {pkg.totalCores} cores • {pkg.totalChunks} chunks
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="library" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => (
                      <SelectItem key={id} value={id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
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
          </Card>

          {/* Content Grid/List */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Badge className="text-xs" style={{ backgroundColor: CONTENT_CATEGORIES[content.category].color }}>
                          {CONTENT_CATEGORIES[content.category].icon} {CONTENT_CATEGORIES[content.category].name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditContent(content)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{content.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {content.estimatedReadTime} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Level {content.requiredCaptureLevel}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {content.engagementRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {content.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Publishing Calendar Tab */}
        <TabsContent value="calendar" className="mt-6">
          <ContentPublishingCalendar 
            contents={filteredContent}
            onCreateContent={handleCreateContent}
            onEditContent={handleEditContent}
          />
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="testing" className="mt-6">
          <ContentABTestingDashboard contents={filteredContent} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Content Performance Analytics</h3>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Advanced analytics dashboard coming soon...</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Content</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose the type of content you want to create in the hierarchy.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {[
              { type: 'package', label: 'Content Package', icon: Package, description: 'Complete learning system' },
              { type: 'core', label: 'Core Module', icon: BookOpen, description: 'Major topic or skill' },
              { type: 'chunk', label: 'Content Chunk', icon: Layers, description: 'Digestible learning unit' },
              { type: 'concept', label: 'Concept', icon: Lightbulb, description: 'Individual idea or principle' }
            ].map(item => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.type}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-slate-700 border-slate-600"
                  onClick={() => {
                    // Handle creation based on type
                    setIsCreateDialogOpen(false)
                  }}
                >
                  <IconComponent className="w-8 h-8 text-purple-400" />
                  <div className="text-center">
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}