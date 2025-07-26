"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/admin/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Network,
  Users,
  MessageSquare,
  UserPlus,
  Search,
  Filter,
  Activity,
  TrendingUp,
  Globe,
  Shield,
  Eye,
  MoreHorizontal,
  Ban,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Hash,
  Send,
  Calendar,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface NetworkConnection {
  id: string
  userId: string
  connectedUserId: string
  userName: string
  connectedUserName: string
  status: 'active' | 'pending' | 'blocked'
  connectionType: 'direct' | 'introduction' | 'group'
  createdAt: string
  lastInteraction: string
  messageCount: number
  connectionScore: number
}

interface NetworkGroup {
  id: string
  name: string
  description: string
  memberCount: number
  adminId: string
  adminName: string
  status: 'active' | 'inactive' | 'archived'
  category: string
  privacy: 'public' | 'private' | 'invite_only'
  createdAt: string
  lastActivity: string
  messageCount: number
  averageEngagement: number
}

interface NetworkMessage {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId?: string
  toUserName?: string
  groupId?: string
  groupName?: string
  content: string
  type: 'direct' | 'group' | 'broadcast'
  status: 'sent' | 'delivered' | 'read'
  createdAt: string
  flagged: boolean
  flagReason?: string
}

interface NetworkStats {
  totalConnections: number
  activeConnections: number
  totalGroups: number
  activeGroups: number
  totalMessages: number
  messagesThisWeek: number
  averageConnectionScore: number
  networkHealth: number
}

export default function AdminNetworkPage() {
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [groups, setGroups] = useState<NetworkGroup[]>([])
  const [messages, setMessages] = useState<NetworkMessage[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    totalConnections: 0,
    activeConnections: 0,
    totalGroups: 0,
    activeGroups: 0,
    totalMessages: 0,
    messagesThisWeek: 0,
    averageConnectionScore: 0,
    networkHealth: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadNetworkData = async () => {
      try {
        // Mock network data - in production this would come from API
        const mockConnections: NetworkConnection[] = [
          {
            id: '1',
            userId: '1',
            connectedUserId: '2',
            userName: 'Sarah Johnson',
            connectedUserName: 'Michael Chen',
            status: 'active',
            connectionType: 'direct',
            createdAt: '2025-01-20T10:30:00Z',
            lastInteraction: '2025-01-24T14:22:00Z',
            messageCount: 47,
            connectionScore: 85
          },
          {
            id: '2',
            userId: '3',
            connectedUserId: '1',
            userName: 'Emily Rodriguez',
            connectedUserName: 'Sarah Johnson',
            status: 'active',
            connectionType: 'introduction',
            createdAt: '2025-01-18T16:45:00Z',
            lastInteraction: '2025-01-23T11:30:00Z',
            messageCount: 23,
            connectionScore: 72
          },
          {
            id: '3',
            userId: '4',
            connectedUserId: '5',
            userName: 'David Kumar',
            connectedUserName: 'Lisa Thompson',
            status: 'pending',
            connectionType: 'direct',
            createdAt: '2025-01-22T09:15:00Z',
            lastInteraction: '2025-01-22T09:15:00Z',
            messageCount: 0,
            connectionScore: 0
          }
        ]

        const mockGroups: NetworkGroup[] = [
          {
            id: '1',
            name: 'Leadership Excellence',
            description: 'A community for aspiring and established leaders to share insights and strategies.',
            memberCount: 34,
            adminId: '1',
            adminName: 'Sarah Johnson',
            status: 'active',
            category: 'Leadership',
            privacy: 'private',
            createdAt: '2025-01-15T08:00:00Z',
            lastActivity: '2025-01-24T16:45:00Z',
            messageCount: 156,
            averageEngagement: 78.5
          },
          {
            id: '2',
            name: 'Goal Achievement Circle',
            description: 'Support group for members working on their transformation goals.',
            memberCount: 28,
            adminId: '2',
            adminName: 'Michael Chen',
            status: 'active',
            category: 'Goal Setting',
            privacy: 'invite_only',
            createdAt: '2025-01-12T14:30:00Z',
            lastActivity: '2025-01-23T20:15:00Z',
            messageCount: 89,
            averageEngagement: 65.2
          },
          {
            id: '3',
            name: 'Industry Insights',
            description: 'Share and discuss industry trends and opportunities.',
            memberCount: 12,
            adminId: '5',
            adminName: 'Lisa Thompson',
            status: 'inactive',
            category: 'Industry',
            privacy: 'public',
            createdAt: '2025-01-08T12:00:00Z',
            lastActivity: '2025-01-19T10:30:00Z',
            messageCount: 34,
            averageEngagement: 42.1
          }
        ]

        const mockMessages: NetworkMessage[] = [
          {
            id: '1',
            fromUserId: '1',
            fromUserName: 'Sarah Johnson',
            toUserId: '2',
            toUserName: 'Michael Chen',
            content: 'Thanks for the great insight on leadership styles. I would love to discuss this further.',
            type: 'direct',
            status: 'read',
            createdAt: '2025-01-24T14:22:00Z',
            flagged: false
          },
          {
            id: '2',
            fromUserId: '3',
            fromUserName: 'Emily Rodriguez',
            groupId: '1',
            groupName: 'Leadership Excellence',
            content: 'Has anyone tried implementing OKRs in a startup environment? Looking for practical tips.',
            type: 'group',
            status: 'delivered',
            createdAt: '2025-01-24T13:45:00Z',
            flagged: false
          },
          {
            id: '3',
            fromUserId: '4',
            fromUserName: 'David Kumar',
            groupId: '2',
            groupName: 'Goal Achievement Circle',
            content: 'This content seems inappropriate for our professional network.',
            type: 'group',
            status: 'sent',
            createdAt: '2025-01-24T12:30:00Z',
            flagged: true,
            flagReason: 'Inappropriate content'
          }
        ]

        setConnections(mockConnections)
        setGroups(mockGroups)
        setMessages(mockMessages)

        // Calculate stats
        const activeConnections = mockConnections.filter(c => c.status === 'active').length
        const activeGroups = mockGroups.filter(g => g.status === 'active').length
        const averageScore = mockConnections.reduce((sum, c) => sum + c.connectionScore, 0) / mockConnections.length || 0

        setStats({
          totalConnections: mockConnections.length,
          activeConnections,
          totalGroups: mockGroups.length,
          activeGroups,
          totalMessages: mockMessages.length,
          messagesThisWeek: mockMessages.filter(m => {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return new Date(m.createdAt) > weekAgo
          }).length,
          averageConnectionScore: Math.round(averageScore),
          networkHealth: Math.round((activeConnections / mockConnections.length) * 100)
        })

      } catch (error) {
        console.error('Error loading network data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNetworkData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'blocked': return 'bg-red-500/10 text-red-700 border-red-200'
      case 'inactive': return 'bg-gray-500/10 text-gray-700 border-gray-200'
      case 'archived': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'direct': return UserPlus
      case 'introduction': return Users
      case 'group': return Network
      default: return UserPlus
    }
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return Globe
      case 'private': return Shield
      case 'invite_only': return Users
      default: return Globe
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading network data...</p>
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
              <h1 className="text-3xl font-bold mb-2">Network Management</h1>
              <p className="text-muted-foreground">
                Monitor and manage user connections, groups, and network activity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
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
                <p className="text-sm text-muted-foreground">Total Connections</p>
                <p className="text-2xl font-bold">{stats.totalConnections}</p>
              </div>
              <Network className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Groups</p>
                <p className="text-2xl font-bold">{stats.activeGroups}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Messages</p>
                <p className="text-2xl font-bold">{stats.messagesThisWeek}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Health</p>
                <p className="text-2xl font-bold">{stats.networkHealth}%</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        {/* Network Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Network Overview</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Health */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Connection Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Connections</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-full rounded-full" 
                            style={{ width: `${(stats.activeConnections / stats.totalConnections) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{stats.activeConnections}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Connections</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-full rounded-full" 
                            style={{ width: '15%' }}
                          />
                        </div>
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <Badge variant="outline">{stats.averageConnectionScore}/100</Badge>
                    </div>
                  </div>
                </Card>

                {/* Group Activity */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Group Activity</h3>
                  <div className="space-y-4">
                    {groups.slice(0, 3).map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{group.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {group.memberCount} members • {group.messageCount} messages
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(group.status)} variant="outline">
                          {group.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Recent Network Activity</h3>
                  <div className="space-y-4">
                    {messages.slice(0, 5).map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{message.fromUserName}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {message.type === 'direct' ? message.toUserName : message.groupName}
                            </span>
                            {message.flagged && (
                              <Badge variant="destructive" className="text-xs">
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {message.type}
                            </Badge>
                            <span>{format(new Date(message.createdAt), 'MMM dd, HH:mm')}</span>
                            <Badge className={getStatusColor(message.status)} variant="outline">
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="introduction">Introduction</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Connections Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Connection</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Score</th>
                        <th className="text-left p-4 font-medium">Messages</th>
                        <th className="text-left p-4 font-medium">Last Activity</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connections.map((connection) => {
                        const TypeIcon = getConnectionTypeIcon(connection.connectionType)
                        return (
                          <tr key={connection.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                      {connection.userName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-secondary">
                                      {connection.connectedUserName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {connection.userName} → {connection.connectedUserName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Connected {format(new Date(connection.createdAt), 'MMM dd, yyyy')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <TypeIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm capitalize">{connection.connectionType}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(connection.status)}>
                                {connection.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary h-full rounded-full" 
                                    style={{ width: `${connection.connectionScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{connection.connectionScore}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm">{connection.messageCount}</span>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {format(new Date(connection.lastInteraction), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(connection.lastInteraction), 'HH:mm')}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => {
                  const PrivacyIcon = getPrivacyIcon(group.privacy)
                  return (
                    <Card key={group.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{group.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Admin: {group.adminName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PrivacyIcon className="w-4 h-4 text-muted-foreground" />
                          <Badge className={getStatusColor(group.status)}>
                            {group.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {group.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{group.memberCount}</div>
                          <div className="text-xs text-muted-foreground">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{group.messageCount}</div>
                          <div className="text-xs text-muted-foreground">Messages</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${group.averageEngagement}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{group.averageEngagement}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>Category: {group.category}</span>
                        <span>Privacy: {group.privacy.replace('_', ' ')}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Flagged Content */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Flagged Messages</h3>
                  <div className="space-y-4">
                    {messages.filter(m => m.flagged).map((message) => (
                      <div key={message.id} className="p-4 border rounded-lg border-red-200 bg-red-50/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-sm">{message.fromUserName}</span>
                            <Badge variant="destructive" className="text-xs">
                              {message.flagReason}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{message.content}</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Ban className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Moderation Stats */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Moderation Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Reports</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Review</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actions Taken</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">2.3h avg</span>
                    </div>
                  </div>
                </Card>

                {/* Moderation Tools */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Moderation Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Ban className="w-4 h-4 mr-2" />
                      Block User
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Restrict Access
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Warning
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Pause className="w-4 h-4 mr-2" />
                      Suspend Group
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Rules
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}