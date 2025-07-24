"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Settings,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Users,
  Clock,
  Star,
  Target,
  Brain,
  TrendingUp,
  Zap,
  Play,
  Pause,
  Archive,
  Copy,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Activity,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Lock,
  Unlock,
  Trash2,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  description: string
  category: 'potential' | 'leadership' | 'habit' | 'goal' | 'mind'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'active' | 'inactive' | 'maintenance' | 'archived'
  version: string
  createdAt: string
  updatedAt: string
  author: string
  
  // Usage Statistics
  totalLaunches: number
  totalCompletions: number
  averageScore: number
  completionRate: number
  averageRating: number
  retakeRate: number
  
  // Configuration
  duration: string
  maxAttempts: number
  unlocked: boolean
  featured: boolean
  premiumOnly: boolean
  tags: string[]
  
  // Performance Metrics
  loadTime: number
  errorRate: number
  lastErrorDate?: string
  
  // Access Control
  requiredMemberLevel: 'visitor' | 'lead' | 'soft_member' | 'hot_lead' | 'premium'
  prerequisites: string[]
}

interface ToolStats {
  totalTools: number
  activeTools: number
  inactiveTools: number
  maintenanceTools: number
  totalLaunches: number
  totalCompletions: number
  averageCompletionRate: number
  averageRating: number
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [stats, setStats] = useState<ToolStats>({
    totalTools: 0,
    activeTools: 0,
    inactiveTools: 0,
    maintenanceTools: 0,
    totalLaunches: 0,
    totalCompletions: 0,
    averageCompletionRate: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    const loadToolsData = async () => {
      try {
        // Mock tools data
        const mockTools: Tool[] = [
          {
            id: 'pqc',
            name: 'Potential Quotient Calculator',
            description: 'Comprehensive assessment to discover untapped potential across multiple dimensions of personal growth.',
            category: 'potential',
            difficulty: 'intermediate',
            status: 'active',
            version: '2.1.3',
            createdAt: '2024-06-15',
            updatedAt: '2025-01-20',
            author: 'Dr. Sarah Chen',
            totalLaunches: 3456,
            totalCompletions: 2891,
            averageScore: 87.3,
            completionRate: 83.7,
            averageRating: 4.9,
            retakeRate: 23.4,
            duration: '20-25 min',
            maxAttempts: 3,
            unlocked: true,
            featured: true,
            premiumOnly: false,
            tags: ['assessment', 'potential', 'growth', 'psychology'],
            loadTime: 1.2,
            errorRate: 0.3,
            requiredMemberLevel: 'visitor',
            prerequisites: []
          },
          {
            id: 'lsp',
            name: 'Leadership Style Profiler',
            description: 'Identify your natural leadership style and discover areas for development and growth.',
            category: 'leadership',
            difficulty: 'intermediate',
            status: 'active',
            version: '1.8.2',
            createdAt: '2024-07-20',
            updatedAt: '2025-01-18',
            author: 'Marcus Johnson',
            totalLaunches: 2134,
            totalCompletions: 1745,
            averageScore: 82.1,
            completionRate: 81.8,
            averageRating: 4.7,
            retakeRate: 18.9,
            duration: '18 min',
            maxAttempts: 2,
            unlocked: true,
            featured: false,
            premiumOnly: false,
            tags: ['leadership', 'style', 'profiling', 'management'],
            loadTime: 0.9,
            errorRate: 0.1,
            requiredMemberLevel: 'soft_member',
            prerequisites: []
          },
          {
            id: 'trs',
            name: 'Transformation Readiness Score',
            description: 'Assess your current readiness for significant life and career transformation.',
            category: 'potential',
            difficulty: 'beginner',
            status: 'active',
            version: '1.5.1',
            createdAt: '2024-08-10',
            updatedAt: '2025-01-15',
            author: 'Dr. Elena Rodriguez',
            totalLaunches: 1876,
            totalCompletions: 1456,
            averageScore: 74.9,
            completionRate: 77.6,
            averageRating: 4.6,
            retakeRate: 15.3,
            duration: '15 min',
            maxAttempts: 2,
            unlocked: true,
            featured: true,
            premiumOnly: false,
            tags: ['transformation', 'readiness', 'change'],
            loadTime: 0.8,
            errorRate: 0.2,
            requiredMemberLevel: 'lead',
            prerequisites: []
          },
          {
            id: 'iqc',
            name: 'Influence Quotient Calculator',
            description: 'Measure your ability to influence others and build meaningful connections.',
            category: 'leadership',
            difficulty: 'advanced',
            status: 'maintenance',
            version: '2.0.1',
            createdAt: '2024-05-30',
            updatedAt: '2025-01-10',
            author: 'Prof. Michael Chang',
            totalLaunches: 1234,
            totalCompletions: 987,
            averageScore: 79.4,
            completionRate: 80.0,
            averageRating: 4.5,
            retakeRate: 12.7,
            duration: '25 min',
            maxAttempts: 2,
            unlocked: true,
            featured: false,
            premiumOnly: true,
            tags: ['influence', 'communication', 'leadership'],
            loadTime: 1.5,
            errorRate: 2.1,
            lastErrorDate: '2025-01-22',
            requiredMemberLevel: 'hot_lead',
            prerequisites: ['lsp']
          },
          {
            id: 'lbi',
            name: 'Limiting Belief Identifier',
            description: 'Uncover and address the limiting beliefs that hold you back from success.',
            category: 'mind',
            difficulty: 'advanced',
            status: 'inactive',
            version: '1.2.0',
            createdAt: '2024-09-15',
            updatedAt: '2024-12-20',
            author: 'Dr. James Wilson',
            totalLaunches: 567,
            totalCompletions: 423,
            averageScore: 71.8,
            completionRate: 74.6,
            averageRating: 4.3,
            retakeRate: 28.1,
            duration: '30 min',
            maxAttempts: 1,
            unlocked: false,
            featured: false,
            premiumOnly: true,
            tags: ['beliefs', 'mindset', 'psychology'],
            loadTime: 2.1,
            errorRate: 1.8,
            requiredMemberLevel: 'premium',
            prerequisites: ['pqc', 'trs']
          }
        ]

        setTools(mockTools)
        setFilteredTools(mockTools)

        // Calculate stats
        const totalLaunches = mockTools.reduce((sum, tool) => sum + tool.totalLaunches, 0)
        const totalCompletions = mockTools.reduce((sum, tool) => sum + tool.totalCompletions, 0)
        const avgCompletionRate = mockTools.reduce((sum, tool) => sum + tool.completionRate, 0) / mockTools.length
        const avgRating = mockTools.reduce((sum, tool) => sum + tool.averageRating, 0) / mockTools.length

        setStats({
          totalTools: mockTools.length,
          activeTools: mockTools.filter(t => t.status === 'active').length,
          inactiveTools: mockTools.filter(t => t.status === 'inactive').length,
          maintenanceTools: mockTools.filter(t => t.status === 'maintenance').length,
          totalLaunches,
          totalCompletions,
          averageCompletionRate: Math.round(avgCompletionRate * 10) / 10,
          averageRating: Math.round(avgRating * 10) / 10
        })

      } catch (error) {
        console.error('Error loading tools data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadToolsData()
  }, [])

  // Filter tools based on search and filters
  useEffect(() => {
    let filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    setFilteredTools(filtered)
  }, [tools, searchQuery, selectedCategory, selectedStatus])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'inactive': return 'bg-gray-500/10 text-gray-700 border-gray-200'
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'archived': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
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

  const handleStatusChange = (toolId: string, newStatus: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, status: newStatus as any } : tool
    ))
  }

  const handleToggleFeature = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, featured: !tool.featured } : tool
    ))
  }

  const handleToggleUnlock = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, unlocked: !tool.unlocked } : tool
    ))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tools management...</p>
          </div>
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
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tools Management</h1>
              <p className="text-muted-foreground">
                Manage assessment tools, monitor performance, and configure access settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Tool
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Tool
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
                <p className="text-sm text-muted-foreground">Total Tools</p>
                <p className="text-2xl font-bold">{stats.totalTools}</p>
              </div>
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.activeTools} active, {stats.inactiveTools} inactive
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Launches</p>
                <p className="text-2xl font-bold">{stats.totalLaunches.toLocaleString()}</p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.totalCompletions.toLocaleString()} completions
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion Rate</p>
                <p className="text-2xl font-bold">{stats.averageCompletionRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </motion.div>

        {/* Tools Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="management">Tool Management</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Plus className="w-6 h-6" />
                    <span>Create New Tool</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Upload className="w-6 h-6" />
                    <span>Import Tool</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Settings className="w-6 h-6" />
                    <span>Global Settings</span>
                  </Button>
                </div>
              </Card>

              {/* Tool Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Tool Status Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { status: 'active', count: stats.activeTools, color: 'bg-green-500' },
                      { status: 'maintenance', count: stats.maintenanceTools, color: 'bg-yellow-500' },
                      { status: 'inactive', count: stats.inactiveTools, color: 'bg-gray-500' }
                    ].map(({ status, count, color }) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${color}`}></div>
                          <span className="capitalize font-medium">{status}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${color}`}
                              style={{ width: `${(count / stats.totalTools) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Tool Activity</h3>
                  <div className="space-y-3">
                    {tools.slice(0, 5).map((tool) => (
                      <div key={tool.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                        <div className={`p-2 rounded-lg ${tool.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          {(() => {
                            const Icon = getCategoryIcon(tool.category)
                            return <Icon className="w-4 h-4" />
                          })()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated {new Date(tool.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {tool.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
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
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="habit">Habits</SelectItem>
                      <SelectItem value="goal">Goals</SelectItem>
                      <SelectItem value="mind">Mind</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tools List */}
              <div className="space-y-4">
                {filteredTools.map((tool) => {
                  const CategoryIcon = getCategoryIcon(tool.category)
                  return (
                    <Card key={tool.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <CategoryIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{tool.name}</h3>
                              <Badge className={getStatusColor(tool.status)}>
                                {tool.status}
                              </Badge>
                              <Badge className={getDifficultyColor(tool.difficulty)}>
                                {tool.difficulty}
                              </Badge>
                              {tool.featured && (
                                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                                  Featured
                                </Badge>
                              )}
                              {tool.premiumOnly && (
                                <Badge variant="secondary">Premium</Badge>
                              )}
                              {!tool.unlocked && (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium">Launches:</span> {tool.totalLaunches.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Completion Rate:</span> {tool.completionRate}%
                              </div>
                              <div>
                                <span className="font-medium">Avg. Score:</span> {tool.averageScore}
                              </div>
                              <div>
                                <span className="font-medium">Rating:</span> ⭐ {tool.averageRating}
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Version {tool.version}</span>
                              <span>•</span>
                              <span>Updated {new Date(tool.updatedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>By {tool.author}</span>
                              <span>•</span>
                              <span>{tool.duration}</span>
                            </div>

                            {tool.status === 'maintenance' && tool.lastErrorDate && (
                              <div className="flex items-center space-x-2 mt-2 text-yellow-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs">Last error: {new Date(tool.lastErrorDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select value={tool.status} onValueChange={(value) => handleStatusChange(tool.id, value)}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeature(tool.id)}
                            className={tool.featured ? 'text-primary' : ''}
                          >
                            <Star className={`w-4 h-4 ${tool.featured ? 'fill-primary' : ''}`} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUnlock(tool.id)}
                          >
                            {tool.unlocked ? (
                              <Unlock className="w-4 h-4 text-green-500" />
                            ) : (
                              <Lock className="w-4 h-4 text-red-500" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTool(tool)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Link href={`/tools/${tool.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or create a new tool.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    {tools.slice(0, 5).map((tool) => (
                      <div key={tool.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{tool.name}</span>
                          <div className="text-right">
                            <span className="font-medium">{tool.completionRate}%</span>
                            <p className="text-xs text-muted-foreground">{tool.totalLaunches} launches</p>
                          </div>
                        </div>
                        <Progress value={tool.completionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Error Monitoring */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Error Monitoring</h3>
                  <div className="space-y-4">
                    {tools.filter(tool => tool.errorRate > 0).map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Load time: {tool.loadTime}s
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={tool.errorRate > 1 ? 'destructive' : 'secondary'}
                            className="mb-1"
                          >
                            {tool.errorRate}% errors
                          </Badge>
                          {tool.lastErrorDate && (
                            <p className="text-xs text-muted-foreground">
                              Last: {new Date(tool.lastErrorDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Performance Charts Placeholder */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Usage Trends</h3>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Tool usage analytics chart would display here</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Global Tool Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Max Attempts</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Auto-archive after (days)</Label>
                      <Input type="number" defaultValue="365" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="enable-analytics" defaultChecked />
                      <Label htmlFor="enable-analytics">Enable detailed analytics</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-backup" defaultChecked />
                      <Label htmlFor="auto-backup">Auto-backup tool configurations</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Maintenance Window</Label>
                      <Select defaultValue="2am">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12am">12:00 AM - 4:00 AM</SelectItem>
                          <SelectItem value="2am">2:00 AM - 6:00 AM</SelectItem>
                          <SelectItem value="4am">4:00 AM - 8:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Error Alert Threshold (%)</Label>
                      <Input type="number" defaultValue="5" min="1" max="100" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-alerts" defaultChecked />
                      <Label htmlFor="email-alerts">Email error alerts</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-disable" />
                      <Label htmlFor="auto-disable">Auto-disable on high error rate</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button>Save Configuration</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Edit Tool Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tool: {selectedTool?.name}</DialogTitle>
            </DialogHeader>
            {selectedTool && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tool Name</Label>
                    <Input defaultValue={selectedTool.name} />
                  </div>
                  <div>
                    <Label>Version</Label>
                    <Input defaultValue={selectedTool.version} />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea defaultValue={selectedTool.description} rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select defaultValue={selectedTool.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="potential">Potential</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="habit">Habits</SelectItem>
                        <SelectItem value="goal">Goals</SelectItem>
                        <SelectItem value="mind">Mind</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select defaultValue={selectedTool.difficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input defaultValue={selectedTool.duration} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-featured" defaultChecked={selectedTool.featured} />
                    <Label htmlFor="edit-featured">Featured tool</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-premium" defaultChecked={selectedTool.premiumOnly} />
                    <Label htmlFor="edit-premium">Premium only</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowEditDialog(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}