"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  Video,
  Phone,
  Settings,
  Bell,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Zap,
  UserPlus,
  MessageCircle,
  Calendar,
  Filter
} from 'lucide-react'
import { 
  networkHubService,
  NetworkUser,
  Conversation,
  NetworkConnection,
  NetworkActivity
} from '@/lib/network-hub-service'
import { ConversationView } from './conversation-view'
import { UserProfile } from './user-profile'
import { ConnectionRequests } from './connection-requests'

interface NetworkHubDashboardProps {
  currentUserId: string
}

export function NetworkHubDashboard({ currentUserId }: NetworkHubDashboardProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'connections' | 'discover' | 'activity'>('messages')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [recommendedUsers, setRecommendedUsers] = useState<NetworkUser[]>([])
  const [activityFeed, setActivityFeed] = useState<NetworkActivity[]>([])
  const [onlineUsers, setOnlineUsers] = useState<NetworkUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNetworkData()
  }, [currentUserId])

  const loadNetworkData = async () => {
    setIsLoading(true)
    try {
      const [convs, conns, recommended, activity, online] = await Promise.all([
        networkHubService.getUserConversations(currentUserId),
        networkHubService.getUserConnections(currentUserId),
        networkHubService.getRecommendedConnections(currentUserId),
        networkHubService.getActivityFeed(currentUserId),
        networkHubService.getOnlineUsers()
      ])

      setConversations(convs)
      setConnections(conns)
      setRecommendedUsers(recommended)
      setActivityFeed(activity)
      setOnlineUsers(online.filter(user => user.id !== currentUserId))
    } catch (error) {
      console.error('Error loading network data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartConversation = async (userId: string) => {
    try {
      const conversation = await networkHubService.createDirectConversation(currentUserId, userId)
      setSelectedConversation(conversation)
      await loadNetworkData()
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const handleSendConnectionRequest = async (userId: string, message?: string) => {
    try {
      await networkHubService.sendConnectionRequest(currentUserId, userId, 'peer', message)
      await loadNetworkData()
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  const getStatusColor = (status: NetworkUser['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'gold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'silver': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your network...</p>
        </div>
      </div>
    )
  }

  if (selectedConversation) {
    return (
      <ConversationView
        conversation={selectedConversation}
        currentUserId={currentUserId}
        onBack={() => setSelectedConversation(null)}
        onRefresh={loadNetworkData}
      />
    )
  }

  if (selectedUser) {
    return (
      <UserProfile
        user={selectedUser}
        currentUserId={currentUserId}
        onBack={() => setSelectedUser(null)}
        onStartConversation={handleStartConversation}
        onSendConnectionRequest={handleSendConnectionRequest}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Network Hub</h2>
          <p className="text-gray-300">Connect, collaborate, and grow together</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 w-64"
            />
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Conversations</p>
                <p className="text-2xl font-bold text-blue-400">{conversations.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Connections</p>
                <p className="text-2xl font-bold text-green-400">{connections.filter(c => c.status === 'accepted').length}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Online Now</p>
                <p className="text-2xl font-bold text-orange-400">{onlineUsers.length}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-purple-400">{connections.filter(c => c.status === 'pending').length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="messages" className="data-[state=active]:bg-purple-600">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="connections" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="discover" className="data-[state=active]:bg-purple-600">
            <Search className="w-4 h-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Recent Conversations</h3>
                
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((conversation, index) => {
                      const otherParticipant = conversation.participants.find(p => p !== currentUserId)
                      
                      return (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-all"
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src="/avatars/default.jpg" />
                              <AvatarFallback className="bg-purple-600 text-white">
                                {otherParticipant?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-white truncate">
                                {conversation.type === 'direct' ? 'Direct Message' : conversation.title}
                              </h4>
                              <span className="text-xs text-gray-400">
                                {new Date(conversation.updatedAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                          
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-purple-600 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No conversations yet</p>
                    <Button onClick={() => setActiveTab('discover')}>
                      Discover People to Connect With
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Online Users */}
            <div>
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Online Now</h3>
                
                <div className="space-y-3">
                  {onlineUsers.slice(0, 8).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-all"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-purple-600 text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-800`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">{user.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{user.role}</p>
                      </div>
                      
                      <Button size="sm" variant="ghost" onClick={(e) => {
                        e.stopPropagation()
                        handleStartConversation(user.id)
                      }}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Connections Tab */}
        <TabsContent value="connections" className="mt-6">
          <ConnectionRequests
            currentUserId={currentUserId}
            connections={connections}
            onRefresh={loadNetworkData}
          />
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-slate-800`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white truncate">{user.name}</h3>
                        <Badge className={getBadgeColor(user.badgeLevel)} variant="outline">
                          {user.badgeLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-300 mb-2">{user.role}</p>
                      {user.location && (
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{user.bio}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {user.connectionsCount} connections
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {user.engagementLevel}% engagement
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleSendConnectionRequest(user.id)}
                    >
                      Connect
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Network Activity</h3>
            
            <div className="space-y-4">
              {activityFeed.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg"
                >
                  <div className="p-2 rounded-lg bg-purple-600/20">
                    {activity.type === 'message_sent' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                    {activity.type === 'connection_made' && <UserPlus className="w-4 h-4 text-green-400" />}
                    {activity.type === 'achievement_unlocked' && <Award className="w-4 h-4 text-yellow-400" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-white mb-1">{activity.description}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}