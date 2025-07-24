"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Send,
  Bell,
  Mail,
  Phone,
  Settings,
  Check,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Star
} from 'lucide-react'

interface Message {
  id: string
  type: 'announcement' | 'personal' | 'system' | 'webinar'
  sender: {
    name: string
    avatar?: string
    role: 'admin' | 'member' | 'system'
  }
  title: string
  content: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  actionRequired?: boolean
  actionLink?: string
  actionText?: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isOwn: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'announcement',
    sender: {
      name: 'Galaxy Dream Team',
      avatar: '/admin/galaxy-logo.png',
      role: 'admin'
    },
    title: 'Welcome to Your Transformation Journey!',
    content: 'Congratulations on taking the first step towards unlocking your potential. Your personalized assessment results are ready, and we\'ve curated specific tools based on your profile. Start with the Goal Achievement Predictor to build momentum.',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    priority: 'high',
    actionRequired: true,
    actionLink: '/tools/goal-achievement-predictor',
    actionText: 'Start Assessment'
  },
  {
    id: '2',
    type: 'webinar',
    sender: {
      name: 'Sarah Tesfaye',
      avatar: '/network/sarah.jpg',
      role: 'member'
    },
    title: 'Live Webinar: Overcoming Limiting Beliefs',
    content: 'Join me this Thursday at 7 PM EAT for an interactive session on identifying and overcoming the mental barriers that hold us back. We\'ll use real Ethiopian success stories and practical exercises.',
    timestamp: '2024-01-14T14:20:00Z',
    isRead: false,
    priority: 'medium',
    actionRequired: true,
    actionLink: '/webinars/register/limiting-beliefs',
    actionText: 'Register Now'
  },
  {
    id: '3',
    type: 'personal',
    sender: {
      name: 'Assessment Engine',
      role: 'system'
    },
    title: 'Your Weekly Progress Report',
    content: 'Great progress this week! You\'ve completed 2 assessments and your engagement score increased by 15 points. Your next recommended tool is the Leadership Style Profiler. Keep up the momentum!',
    timestamp: '2024-01-13T09:00:00Z',
    isRead: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '4',
    type: 'system',
    sender: {
      name: 'System',
      role: 'system'
    },
    title: 'New Premium Content Unlocked',
    content: 'Based on your recent activity, you\'ve unlocked access to advanced leadership content including the "Influence Quotient Calculator" and "Team Builder Simulator". These tools are now available in your dashboard.',
    timestamp: '2024-01-12T16:45:00Z',
    isRead: true,
    priority: 'medium',
    actionRequired: false
  }
]

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'sarah_tesfaye',
    senderName: 'Sarah Tesfaye',
    content: 'Hi! I saw you joined through my referral link. Welcome to the Galaxy Dream Team family! 🎉',
    timestamp: '2024-01-15T11:00:00Z',
    isOwn: false
  },
  {
    id: '2',
    senderId: 'current_user',
    senderName: 'You',
    content: 'Thank you Sarah! I\'m excited to start this journey. The assessment tools look amazing.',
    timestamp: '2024-01-15T11:15:00Z',
    isOwn: true
  },
  {
    id: '3',
    senderId: 'sarah_tesfaye',
    senderName: 'Sarah Tesfaye',
    content: 'That\'s wonderful! I recommend starting with the Potential Quotient Calculator - it gives you a great baseline. Then move to Goal Achievement Predictor. Feel free to reach out if you have any questions! 😊',
    timestamp: '2024-01-15T11:20:00Z',
    isOwn: false
  }
]

interface CommunicationCenterProps {
  userId?: string
  userTier?: 'browser' | 'engaged' | 'soft-member'
  referrerId?: string
}

export function CommunicationCenter({ userId, userTier = 'browser', referrerId }: CommunicationCenterProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState<'announcements' | 'chat' | 'settings'>('announcements')
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMessages(mockMessages)
      setChatMessages(mockChatMessages)
      setUnreadCount(mockMessages.filter(m => !m.isRead).length)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId])

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !referrerId) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current_user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate response (in real app, this would be real-time)
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: referrerId,
        senderName: 'Sarah Tesfaye',
        content: 'Thanks for your message! I\'ll get back to you soon. Keep up the great work on your assessments! 👍',
        timestamp: new Date().toISOString(),
        isOwn: false
      }
      setChatMessages(prev => [...prev, response])
    }, 2000)
  }

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'announcement': return Bell
      case 'personal': return User
      case 'system': return Settings
      case 'webinar': return Calendar
      default: return MessageCircle
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Communication Center
          </h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'announcements', label: 'Messages', count: messages.length },
          { key: 'chat', label: 'Direct Chat', count: chatMessages.length, disabled: !referrerId },
          { key: 'settings', label: 'Preferences', count: 0 },
        ].map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.key as any)}
            disabled={tab.disabled}
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

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const IconComponent = getTypeIcon(message.type)
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  message.isRead 
                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    : 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start space-x-4">
                    {/* Sender Avatar */}
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm">
                        {message.sender.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {message.sender.name}
                          </span>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          {!message.isRead && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {message.title}
                      </h3>

                      {/* Content */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {message.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {message.actionRequired && message.actionLink && (
                            <Button size="sm">
                              {message.actionText || 'Take Action'}
                            </Button>
                          )}
                          {!message.isRead && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          {message.isRead ? (
                            <Check className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1" />
                          )}
                          {message.isRead ? 'Read' : 'Unread'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Direct Chat Tab */}
      {activeTab === 'chat' && referrerId && (
        <div className="space-y-4">
          {/* Chat Header */}
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarImage src="/network/sarah.jpg" alt="Sarah Tesfaye" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Sarah Tesfaye</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Your Referrer • Online</div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="max-h-64 overflow-y-auto space-y-3">
            {chatMessages.map(message => (
              <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isOwn 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Notice */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Direct chat is active!</strong> Your referrer will receive notifications and can respond directly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Communication Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</div>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Telegram Notifications</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Get instant messages on Telegram</div>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">SMS Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Important updates via SMS</div>
                  </div>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telegram Handle
                </label>
                <Input placeholder="@your_handle" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <Input placeholder="+251 9XX XXXXXX" />
              </div>
            </div>
          </div>

          <Button className="w-full">
            Save Preferences
          </Button>
        </div>
      )}

      {/* Empty State for Chat */}
      {activeTab === 'chat' && !referrerId && (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Direct Chat Unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Direct chat becomes available when you reach Hot Lead status.
          </p>
        </div>
      )}
    </Card>
  )
}