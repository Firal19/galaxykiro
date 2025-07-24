"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Check,
  X,
  Clock,
  UserPlus,
  MessageSquare,
  Star,
  MapPin,
  Award,
  TrendingUp
} from 'lucide-react'
import { 
  NetworkConnection,
  networkHubService,
  NetworkUser
} from '@/lib/network-hub-service'

interface ConnectionRequestsProps {
  currentUserId: string
  connections: NetworkConnection[]
  onRefresh: () => void
}

export function ConnectionRequests({ currentUserId, connections, onRefresh }: ConnectionRequestsProps) {
  const [loadingConnections, setLoadingConnections] = useState<Set<string>>(new Set())

  const pendingRequests = connections.filter(conn => conn.status === 'pending')
  const acceptedConnections = connections.filter(conn => conn.status === 'accepted')

  const handleAcceptConnection = async (connectionId: string) => {
    setLoadingConnections(prev => new Set(prev).add(connectionId))
    try {
      await networkHubService.acceptConnectionRequest(connectionId)
      onRefresh()
    } catch (error) {
      console.error('Error accepting connection:', error)
    } finally {
      setLoadingConnections(prev => {
        const newSet = new Set(prev)
        newSet.delete(connectionId)
        return newSet
      })
    }
  }

  const getConnectionTypeColor = (type: NetworkConnection['connectionType']) => {
    switch (type) {
      case 'mentor': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'mentee': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'accountability': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400'
    if (strength >= 60) return 'text-yellow-400'
    if (strength >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600">
            <Clock className="w-4 h-4 mr-2" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="connected" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Connected ({acceptedConnections.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/avatars/default.jpg" />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {connection.userId.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-white">Connection Request</h3>
                          <Badge className={getConnectionTypeColor(connection.connectionType)} variant="outline">
                            {connection.connectionType}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-3">
                          User ID: {connection.userId}
                        </p>
                        
                        {connection.requestMessage && (
                          <div className="bg-slate-700/50 p-3 rounded-lg mb-3">
                            <p className="text-gray-300 text-sm italic">"{connection.requestMessage}"</p>
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-400 space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(connection.connectedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptConnection(connection.id)}
                        disabled={loadingConnections.has(connection.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {loadingConnections.has(connection.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        ) : (
                          <Check className="w-4 h-4 mr-1" />
                        )}
                        Accept
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Pending Requests</h3>
              <p className="text-gray-400">
                You don't have any pending connection requests at the moment.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Connected Users */}
        <TabsContent value="connected" className="space-y-4 mt-6">
          {acceptedConnections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {acceptedConnections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src="/avatars/default.jpg" />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {connection.connectedUserId.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white truncate">
                            User {connection.connectedUserId}
                          </h3>
                          <Badge className={getConnectionTypeColor(connection.connectionType)} variant="outline">
                            {connection.connectionType}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Connection Strength</span>
                            <span className={`font-medium ${getConnectionStrengthColor(connection.connectionStrength)}`}>
                              {connection.connectionStrength}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${connection.connectionStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {connection.messagesExchanged} messages
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Connected {new Date(connection.connectedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Shared Interests */}
                    {connection.sharedInterests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Shared Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {connection.sharedInterests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {connection.sharedInterests.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{connection.sharedInterests.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Meeting History */}
                    {connection.meetingHistory.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Recent Meetings:</p>
                        <div className="space-y-1">
                          {connection.meetingHistory.slice(0, 2).map((meeting, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">
                                {meeting.type} call • {meeting.duration}min
                              </span>
                              <span className="text-gray-500">
                                {new Date(meeting.date).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Connections Yet</h3>
              <p className="text-gray-400 mb-6">
                Start building your network by connecting with other members.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Discover People
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}