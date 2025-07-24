"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  MessageCircle, 
  Network,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  UserPlus,
  Crown,
  TrendingUp
} from 'lucide-react'

interface NetworkMember {
  id: string
  name: string
  title: string
  location: string
  avatar?: string
  isReferrer: boolean
  memberLevel: 'soft' | 'full' | 'leader'
  joinedDate: string
  sharedTools: number
  engagementScore: number
  canDirectMessage: boolean
  socialLinks?: {
    telegram?: string
    linkedin?: string
    phone?: string
  }
  bio: string
  achievements: string[]
}

const mockNetworkMembers: NetworkMember[] = [
  {
    id: '1',
    name: 'Sarah Tesfaye',
    title: 'Marketing Director & Your Referrer',
    location: 'Addis Ababa, Ethiopia',
    avatar: '/network/sarah.jpg',
    isReferrer: true,
    memberLevel: 'leader',
    joinedDate: '2023-06-15',
    sharedTools: 8,
    engagementScore: 95,
    canDirectMessage: true,
    socialLinks: {
      telegram: '@sarahtesfaye',
      linkedin: 'sarah-tesfaye-marketing',
      phone: '+251911234567'
    },
    bio: 'Passionate about helping others unlock their potential through strategic thinking and personal development.',
    achievements: ['Top Referrer 2024', 'Community Leader', 'Assessment Champion']
  },
  {
    id: '2',
    name: 'Daniel Mulugeta',
    title: 'Entrepreneur & Success Coach',
    location: 'Dire Dawa, Ethiopia',
    avatar: '/network/daniel.jpg',
    isReferrer: false,
    memberLevel: 'full',
    joinedDate: '2023-08-20',
    sharedTools: 12,
    engagementScore: 88,
    canDirectMessage: true,
    socialLinks: {
      telegram: '@danielsuccess',
      linkedin: 'daniel-mulugeta-entrepreneur'
    },
    bio: 'Building businesses and helping entrepreneurs scale their impact across Ethiopia.',
    achievements: ['Business Growth Expert', 'Mentor of the Month', 'Tool Expert']
  },
  {
    id: '3',
    name: 'Hanan Mohammed',
    title: 'Tech Lead & Innovation Catalyst',
    location: 'Bahir Dar, Ethiopia',
    avatar: '/network/hanan.jpg',
    isReferrer: false,
    memberLevel: 'full',
    joinedDate: '2023-09-10',
    sharedTools: 6,
    engagementScore: 92,
    canDirectMessage: false,
    socialLinks: {
      linkedin: 'hanan-mohammed-tech'
    },
    bio: 'Leading digital transformation initiatives and empowering the next generation of Ethiopian tech talent.',
    achievements: ['Innovation Leader', 'Tech Mentor', 'Assessment Pioneer']
  },
  {
    id: '4',
    name: 'Meron Assefa',
    title: 'HR Director & People Developer',
    location: 'Hawassa, Ethiopia',
    avatar: '/network/meron.jpg',
    isReferrer: false,
    memberLevel: 'soft',
    joinedDate: '2024-01-05',
    sharedTools: 3,
    engagementScore: 76,
    canDirectMessage: false,
    bio: 'Transforming organizational culture and developing high-performing teams.',
    achievements: ['HR Excellence Award', 'Team Builder']
  }
]

interface NetworkHubProps {
  userId?: string
  userTier?: 'browser' | 'engaged' | 'soft-member'
}

export function NetworkHub({ userId, userTier = 'browser' }: NetworkHubProps) {
  const [members, setMembers] = useState<NetworkMember[]>([])
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'network' | 'referrer' | 'mentors'>('network')

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMembers(mockNetworkMembers)
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [userId])

  const referrer = members.find(m => m.isReferrer)
  const networkMembers = members.filter(m => !m.isReferrer)
  const leaders = members.filter(m => m.memberLevel === 'leader')

  const getMemberLevelColor = (level: NetworkMember['memberLevel']) => {
    switch (level) {
      case 'leader': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'full': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'soft': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleDirectMessage = (member: NetworkMember) => {
    if (!member.canDirectMessage) {
      alert('Direct messaging is available for Hot Leads and Full Members')
      return
    }
    
    // In a real app, this would open a chat interface
    console.log('Opening chat with:', member.name)
  }

  const handleConnectSocial = (platform: string, handle: string) => {
    const urls: Record<string, string> = {
      telegram: `https://t.me/${handle.replace('@', '')}`,
      linkedin: `https://linkedin.com/in/${handle}`,
      phone: `tel:${handle}`
    }
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank')
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Network className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Network
          </h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {members.length} connections
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'network', label: 'Network', count: networkMembers.length },
          { key: 'referrer', label: 'Your Referrer', count: referrer ? 1 : 0 },
          { key: 'mentors', label: 'Leaders', count: leaders.length },
        ].map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.key as any)}
            className="text-sm"
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tab.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Referrer Section */}
      {activeTab === 'referrer' && referrer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={referrer.avatar} alt={referrer.name} />
                <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-lg font-semibold">
                  {referrer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {referrer.name}
                  </h3>
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <Badge className={getMemberLevelColor(referrer.memberLevel)}>
                    {referrer.memberLevel}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {referrer.title}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {referrer.location}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {referrer.bio}
                </p>

                {/* Achievement Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {referrer.achievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {achievement}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {referrer.canDirectMessage && (
                    <Button 
                      size="sm"
                      onClick={() => handleDirectMessage(referrer)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Direct Message
                    </Button>
                  )}
                  
                  {referrer.socialLinks?.telegram && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleConnectSocial('telegram', referrer.socialLinks!.telegram!)}
                    >
                      Telegram
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {referrer.socialLinks?.linkedin && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleConnectSocial('linkedin', referrer.socialLinks!.linkedin!)}
                    >
                      LinkedIn
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Network Members */}
      {(activeTab === 'network' || activeTab === 'mentors') && (
        <div className="space-y-4">
          {(activeTab === 'network' ? networkMembers : leaders).map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <Badge className={getMemberLevelColor(member.memberLevel)}>
                          {member.memberLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {member.engagementScore}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {member.title}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {member.location}
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {member.bio}
                    </p>

                    {/* Achievement Badges */}
                    {member.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.achievements.slice(0, 2).map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                        {member.achievements.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.achievements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {member.canDirectMessage ? (
                          <Button 
                            size="sm"
                            onClick={() => handleDirectMessage(member)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled
                            title="Available for Hot Leads"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message (Locked)
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {new Date(member.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No network connections yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete more assessments and engage with content to build your network.
          </p>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Build Your Network
          </Button>
        </div>
      )}

      {/* Upgrade Notice for Non-Hot Leads */}
      {userTier !== 'soft-member' && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Unlock Full Network Access
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Become a Hot Lead to access direct messaging and connect with community leaders.
                </p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}