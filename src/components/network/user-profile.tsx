"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  MapPin,
  Calendar,
  Star,
  Users,
  Award,
  Clock,
  Zap,
  Globe,
  Mail,
  Phone,
  Video,
  Shield,
  Activity
} from 'lucide-react'
import { NetworkUser } from '@/lib/network-hub-service'

interface UserProfileProps {
  user: NetworkUser
  currentUserId: string
  onBack: () => void
  onStartConversation: (userId: string) => void
  onSendConnectionRequest: (userId: string, message?: string) => void
}

export function UserProfile({ user, currentUserId, onBack, onStartConversation, onSendConnectionRequest }: UserProfileProps) {
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

  const getEngagementLevel = (level: number) => {
    if (level >= 90) return { color: 'text-purple-400', label: 'Exceptional' }
    if (level >= 80) return { color: 'text-green-400', label: 'High' }
    if (level >= 70) return { color: 'text-yellow-400', label: 'Good' }
    if (level >= 60) return { color: 'text-orange-400', label: 'Moderate' }
    return { color: 'text-red-400', label: 'Low' }
  }

  const engagement = getEngagementLevel(user.engagementLevel)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-slate-800/80 backdrop-blur-sm border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onStartConversation(user.id)}
              className="border-slate-600 hover:bg-slate-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              onClick={() => onSendConnectionRequest(user.id)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="bg-purple-600 text-white text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-4 border-slate-800`}></div>
            {user.isVerified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{user.name}</h1>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {user.role}
                  </Badge>
                  <Badge className={getBadgeColor(user.badgeLevel)} variant="outline">
                    {user.badgeLevel}
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{user.connectionsCount}</div>
                <div className="text-sm text-gray-400">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{user.messagesCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Messages</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${engagement.color}`}>{user.engagementLevel}%</div>
                <div className="text-sm text-gray-400">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-400">Days Active</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {new Date(user.joinedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {user.timezone}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">About</h3>
              <p className="text-gray-300 leading-relaxed">
                {user.bio || 'This user hasn\'t added a bio yet.'}
              </p>
            </Card>
          </motion.div>

          {/* Engagement Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Engagement Metrics</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Overall Engagement</span>
                    <span className={`font-semibold ${engagement.color}`}>
                      {engagement.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Activity Level</span>
                      <span className="text-white">{user.engagementLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${user.engagementLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Activity className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Active Member</div>
                      <div className="text-sm text-gray-400">Consistently engaged</div>
                    </div>
                  </div>
                  
                  {user.isAvailableForMentoring && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Available for Mentoring</div>
                        <div className="text-sm text-gray-400">Open to help others</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Started a new conversation</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <UserPlus className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Connected with 3 new members</p>
                    <p className="text-sm text-gray-400">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Achieved {user.badgeLevel} badge level</p>
                    <p className="text-sm text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Communication Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Communication</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Direct Messages</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.communicationPreferences.allowDirectMessages ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Voice Calls</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.communicationPreferences.allowVoiceCalls ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Video className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Video Calls</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.communicationPreferences.allowVideoCall ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Group Invites</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.communicationPreferences.allowGroupInvites ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Quiet hours: {user.communicationPreferences.quietHours.start} - {user.communicationPreferences.quietHours.end}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Current Status</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 ${getStatusColor(user.status)} rounded-full`}></div>
                <span className="text-white capitalize">{user.status}</span>
              </div>
              
              <div className="text-sm text-gray-400">
                {user.status === 'online' ? (
                  'Available now'
                ) : (
                  `Last seen: ${new Date(user.lastSeen).toLocaleString()}`
                )}
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white">{user.badgeLevel.charAt(0).toUpperCase() + user.badgeLevel.slice(1)} Member</div>
                    <div className="text-xs text-gray-400">Elite status achieved</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">Well Connected</div>
                    <div className="text-xs text-gray-400">{user.connectionsCount}+ connections</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Highly Engaged</div>
                    <div className="text-xs text-gray-400">{user.engagementLevel}% engagement rate</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}