"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Heart,
  ThumbsUp,
  Laugh,
  Check,
  CheckCheck
} from 'lucide-react'
import { 
  networkHubService,
  Conversation,
  Message,
  NetworkUser
} from '@/lib/network-hub-service'

interface ConversationViewProps {
  conversation: Conversation
  currentUserId: string
  onBack: () => void
  onRefresh: () => void
}

export function ConversationView({ conversation, currentUserId, onBack, onRefresh }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState<NetworkUser | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversationData()
    markAsRead()
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversationData = async () => {
    setIsLoading(true)
    try {
      const [msgs, otherUserId] = await Promise.all([
        networkHubService.getMessages(conversation.id),
        Promise.resolve(conversation.participants.find(p => p !== currentUserId))
      ])

      setMessages(msgs.reverse()) // Reverse to show chronological order

      if (otherUserId) {
        const user = await networkHubService.getUserProfile(otherUserId)
        setOtherUser(user)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async () => {
    try {
      await networkHubService.markConversationAsRead(conversation.id, currentUserId)
      onRefresh()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const message = await networkHubService.sendMessage(
        conversation.id,
        currentUserId,
        newMessage.trim()
      )

      setMessages(prev => [...prev, message])
      setNewMessage('')
      onRefresh()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const shouldShowDateDivider = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true

    const currentDate = new Date(currentMsg.timestamp).toDateString()
    const prevDate = new Date(prevMsg.timestamp).toDateString()
    
    return currentDate !== prevDate
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <Card className="p-4 bg-slate-800/80 backdrop-blur-sm border-slate-700 rounded-b-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherUser?.avatar} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {otherUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                {otherUser?.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-white">{otherUser?.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-400">
                  {otherUser?.status === 'online' ? 'Online' : `Last seen ${formatTime(otherUser?.lastSeen || '')}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col bg-slate-800/50 backdrop-blur-sm border-slate-700 rounded-none border-t-0 border-b-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : undefined
            const isCurrentUser = message.senderId === currentUserId
            const showDateDivider = shouldShowDateDivider(message, prevMessage)

            return (
              <div key={message.id}>
                {showDateDivider && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-slate-700 text-gray-400 text-xs px-3 py-1 rounded-full">
                      {new Date(message.timestamp).toLocaleDateString([], { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isCurrentUser && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
                          {otherUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-slate-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      <div className={`flex items-center justify-between mt-1 ${isCurrentUser ? 'text-purple-200' : 'text-gray-400'}`}>
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <div className="ml-2">
                            {getMessageStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                  <div className={`flex mt-1 ${isCurrentUser ? 'justify-end mr-8' : 'justify-start ml-8'}`}>
                    <div className="flex items-center space-x-1 bg-slate-700/50 rounded-full px-2 py-1">
                      {message.reactions.map((reaction, reactionIndex) => (
                        <span key={reactionIndex} className="text-xs">
                          {reaction.emoji}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        {message.reactions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={otherUser?.avatar} />
                  <AvatarFallback className="bg-purple-600 text-white text-xs">
                    {otherUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-700 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Message Input */}
      <Card className="p-4 bg-slate-800/80 backdrop-blur-sm border-slate-700 rounded-t-none">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="bg-slate-700 border-slate-600 text-white pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}