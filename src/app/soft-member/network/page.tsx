"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SoftMemberLayout } from '@/components/layouts/soft-member-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users,
  MessageSquare,
  UserPlus,
  Search,
  Send,
  Clock,
  Star,
  Globe,
  Shield,
  CheckCircle,
  Plus,
  Settings,
  Filter,
  MoreHorizontal,
  Heart,
  Share,
  Bookmark,
  Eye,
  TrendingUp,
  Calendar,
  Phone,
  Video,
  Mail,
  Lock,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { leadScoringService } from '@/lib/lead-scoring-service'

interface NetworkUser {
  id: string
  name: string
  title: string
  company: string
  avatar?: string
  status: 'online' | 'offline' | 'busy'
  connectionStatus: 'connected' | 'pending' | 'none'
  sharedInterests: string[]
  connectionScore: number
  mutualConnections: number
  lastActive: string
  canConnect: boolean
}

interface NetworkGroup {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  privacy: 'public' | 'private' | 'invite_only'
  joined: boolean
  avatar?: string
  lastActivity: string
  engagementLevel: 'high' | 'medium' | 'low'
}

interface NetworkMessage {
  id: string
  fromUserId: string
  fromUserName: string
  content: string
  timestamp: string
  type: 'connection_request' | 'message' | 'group_invite'
  status: 'unread' | 'read'
}

interface NetworkStats {
  totalConnections: number
  pendingRequests: number
  groupMemberships: number
  messagesSent: number
  profileViews: number
  networkReach: number
}

export default function SoftMemberNetworkPage() {
  const [users, setUsers] = useState<NetworkUser[]>([])
  const [groups, setGroups] = useState<NetworkGroup[]>([])
  const [messages, setMessages] = useState<NetworkMessage[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    totalConnections: 0,
    pendingRequests: 0,
    groupMemberships: 0,
    messagesSent: 0,
    profileViews: 0,
    networkReach: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('discover')
  const [userRole, setUserRole] = useState<'hot_lead' | 'member' | 'soft_member'>('soft_member')
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null)
  const [connectionMessage, setConnectionMessage] = useState('')

  // Check if user has network access (hot leads and members only)
  const hasNetworkAccess = userRole === 'hot_lead' || userRole === 'member'

  useEffect(() => {
    const loadNetworkData = async () => {
      try {
        // Simulate checking user role - in production this would come from auth context
        const mockUserRole = 'hot_lead' // This would be determined by user's actual role
        setUserRole(mockUserRole)

        if (!hasNetworkAccess) {
          setLoading(false)
          return
        }

        // Mock network data - in production this would come from API
        const mockUsers: NetworkUser[] = [
          {
            id: '1',
            name: 'Sarah Martinez',
            title: 'Senior Product Manager',
            company: 'TechCorp Inc.',
            status: 'online',
            connectionStatus: 'none',
            sharedInterests: ['Leadership', 'Product Strategy', 'Innovation'],
            connectionScore: 92,
            mutualConnections: 3,
            lastActive: '2025-01-24T14:30:00Z',
            canConnect: true
          },
          {
            id: '2',
            name: 'Michael Thompson',
            title: 'Executive Coach',
            company: 'Thompson Consulting',
            status: 'offline',
            connectionStatus: 'connected',
            sharedInterests: ['Coaching', 'Leadership', 'Personal Development'],
            connectionScore: 87,
            mutualConnections: 5,
            lastActive: '2025-01-24T10:15:00Z',
            canConnect: false
          },
          {
            id: '3',
            name: 'Emily Chen',
            title: 'Startup Founder',
            company: 'InnovateLab',
            status: 'busy',
            connectionStatus: 'pending',
            sharedInterests: ['Entrepreneurship', 'Innovation', 'Scaling'],
            connectionScore: 78,
            mutualConnections: 2,
            lastActive: '2025-01-24T12:45:00Z',
            canConnect: false
          },
          {
            id: '4',
            name: 'David Rodriguez',
            title: 'VP of Sales',
            company: 'Growth Dynamics',
            status: 'online',
            connectionStatus: 'none',
            sharedInterests: ['Sales Strategy', 'Team Building', 'Growth'],
            connectionScore: 83,
            mutualConnections: 1,
            lastActive: '2025-01-24T15:20:00Z',
            canConnect: true
          }
        ]

        const mockGroups: NetworkGroup[] = [
          {
            id: '1',
            name: 'Leadership Excellence Circle',
            description: 'A premium community for senior leaders focused on strategic thinking and executive presence.',
            memberCount: 28,
            category: 'Leadership',
            privacy: 'private',
            joined: true,
            lastActivity: '2025-01-24T16:45:00Z',
            engagementLevel: 'high'
          },
          {
            id: '2',
            name: 'Innovation Catalysts',
            description: 'Connect with fellow innovators and entrepreneurs to share insights and opportunities.',
            memberCount: 15,
            category: 'Innovation',
            privacy: 'invite_only',
            joined: false,
            lastActivity: '2025-01-24T13:30:00Z',
            engagementLevel: 'medium'
          },
          {
            id: '3',
            name: 'Executive Coaching Network',
            description: 'Peer coaching and support network for executives and senior managers.',
            memberCount: 22,
            category: 'Coaching',
            privacy: 'private',
            joined: true,
            lastActivity: '2025-01-23T20:15:00Z',
            engagementLevel: 'high'
          }
        ]

        const mockMessages: NetworkMessage[] = [
          {
            id: '1',
            fromUserId: '2',
            fromUserName: 'Michael Thompson',
            content: 'I saw your recent insights on leadership transformation. Would love to connect and discuss further.',
            timestamp: '2025-01-24T14:22:00Z',
            type: 'connection_request',
            status: 'unread'
          },
          {
            id: '2',
            fromUserId: '1',
            fromUserName: 'Sarah Martinez',
            content: 'Thanks for the great discussion in the Leadership Excellence Circle. Your perspective on product strategy was invaluable.',
            timestamp: '2025-01-24T11:30:00Z',
            type: 'message',
            status: 'read'
          }
        ]

        setUsers(mockUsers)
        setGroups(mockGroups)
        setMessages(mockMessages)

        // Calculate stats
        const connectedUsers = mockUsers.filter(u => u.connectionStatus === 'connected').length
        const pendingRequests = mockUsers.filter(u => u.connectionStatus === 'pending').length
        const joinedGroups = mockGroups.filter(g => g.joined).length

        setStats({
          totalConnections: connectedUsers,
          pendingRequests,
          groupMemberships: joinedGroups,
          messagesSent: 12,
          profileViews: 45,
          networkReach: connectedUsers * 15 // Estimated network reach
        })

        // Track network access
        leadScoringService.trackInteraction({
          eventType: 'page_visit',
          page: 'soft_member_network'
        })

      } catch (error) {
        console.error('Error loading network data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNetworkData()
  }, [hasNetworkAccess])

  const handleConnect = (user: NetworkUser) => {
    setSelectedUser(user)
    setShowConnectDialog(true)
  }

  const sendConnectionRequest = async () => {
    if (!selectedUser || !connectionMessage.trim()) {
      alert('Please add a personal message')
      return
    }

    // In production, this would make an API call
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id 
        ? { ...user, connectionStatus: 'pending' as const }
        : user
    ))

    // Track connection request
    leadScoringService.trackInteraction({
      eventType: 'network_interaction',
      interactionType: 'connection_request',
      targetUserId: selectedUser.id
    })

    setConnectionMessage('')
    setSelectedUser(null)
    setShowConnectDialog(false)
  }

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, joined: true, memberCount: group.memberCount + 1 }
        : group
    ))

    // Track group join
    leadScoringService.trackInteraction({
      eventType: 'network_interaction',
      interactionType: 'group_join',
      groupId
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return Globe
      case 'private': return Shield
      case 'invite_only': return Lock
      default: return Globe
    }
  }

  if (loading) {
    return (
      <SoftMemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading network...</p>
          </div>
        </div>
      </SoftMemberLayout>
    )
  }

  // Show access restriction for non-hot leads
  if (!hasNetworkAccess) {
    return (
      <SoftMemberLayout>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Premium Network Access</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The Galaxy Kiro Network is an exclusive community for our most engaged members. 
              Connect with like-minded professionals, join specialized groups, and accelerate your transformation journey.
            </p>
            
            <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <h2 className="text-xl font-semibold mb-4">Unlock Network Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Connect with industry leaders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Join exclusive groups</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Direct messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Mentorship opportunities</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To gain access to the network, increase your engagement with our platform:
                </p>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Complete assessments</span>
                  <Badge variant="outline">2/3</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Content engagement</span>
                  <Badge variant="outline">85%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Profile completion</span>
                  <Badge variant="outline">90%</Badge>
                </div>
              </div>
              
              <Button className="w-full mt-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Increase Engagement
              </Button>
            </Card>
          </motion.div>
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
              <h1 className="text-3xl font-bold mb-2">Galaxy Kiro Network</h1>
              <p className="text-muted-foreground">
                Connect with like-minded professionals and accelerate your growth
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalConnections}</div>
              <div className="text-xs text-muted-foreground">Connections</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.groupMemberships}</div>
              <div className="text-xs text-muted-foreground">Groups</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.messagesSent}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.profileViews}</div>
              <div className="text-xs text-muted-foreground">Profile Views</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.networkReach}</div>
              <div className="text-xs text-muted-foreground">Network Reach</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.pendingRequests}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </Card>
        </motion.div>

        {/* Network Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="connections">My Network</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search professionals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Suggested Connections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(user => user.connectionStatus === 'none').map((user) => (
                  <Card key={user.id} className="p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{user.name}</h4>
                          <p className="text-xs text-muted-foreground">{user.title}</p>
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{user.connectionScore}</div>
                        <div className="text-xs text-muted-foreground">match</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Shared Interests</div>
                        <div className="flex flex-wrap gap-1">
                          {user.sharedInterests.slice(0, 2).map(interest => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {user.sharedInterests.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.sharedInterests.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{user.mutualConnections} mutual connections</span>
                        <span>Active {format(new Date(user.lastActive), 'MMM dd')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleConnect(user)}
                        disabled={!user.canConnect}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(user => user.connectionStatus === 'connected').map((user) => (
                  <Card key={user.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{user.name}</h4>
                          <p className="text-xs text-muted-foreground">{user.title}</p>
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
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
                            <h4 className="font-semibold text-sm">{group.name}</h4>
                            <p className="text-xs text-muted-foreground">{group.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PrivacyIcon className="w-4 h-4 text-muted-foreground" />
                          {group.joined && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {group.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{group.memberCount} members</span>
                        <span>Active {format(new Date(group.lastActivity), 'MMM dd')}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-muted-foreground">Engagement</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${group.engagementLevel === 'high' ? 80 : group.engagementLevel === 'medium' ? 50 : 20}%` }}
                            />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {group.engagementLevel}
                          </Badge>
                        </div>
                      </div>

                      {group.joined ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Group
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {group.privacy === 'invite_only' ? 'Request Invite' : 'Join Group'}
                        </Button>
                      )}
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Messages</h3>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {message.fromUserName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{message.fromUserName}</span>
                            <div className="flex items-center space-x-2">
                              {message.status === 'unread' && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                          <Badge variant="outline" className="text-xs mt-2">
                            {message.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Send className="w-4 h-4 mr-2" />
                      Compose Message
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Start Group Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Connection Dialog */}
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Connection Request</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedUser.title} at {selectedUser.company}</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Personal Message</label>
                  <Textarea
                    placeholder="Add a personal note to your connection request..."
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={sendConnectionRequest}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SoftMemberLayout>
  )
}