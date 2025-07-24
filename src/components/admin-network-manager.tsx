"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Network, 
  Plus, 
  Users, 
  MessageSquare, 
  Activity, 
  Search,
  Filter,
  BarChart3,
  Settings,
  Eye,
  Ban,
  Shield,
  AlertTriangle,
  TrendingUp,
  Clock,
  UserPlus,
  MessageCircle
} from 'lucide-react'
import { NetworkHubDashboard } from '@/components/network/network-hub-dashboard'

export function AdminNetworkManager() {
  const [activeView, setActiveView] = useState<'overview' | 'hub' | 'moderation' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for admin overview
  const networkStats = {
    totalUsers: 847,
    activeConversations: 124,
    dailyMessages: 2856,
    connectionRequests: 45,
    reportedContent: 3,
    moderationQueue: 8
  }

  const recentActivity = [
    {
      id: '1',
      type: 'user_joined',
      description: 'New hot lead joined the network',
      user: 'Sarah Tesfaye',
      timestamp: '5 minutes ago'
    },
    {
      id: '2',
      type: 'conversation_started',
      description: 'Mentorship conversation initiated',
      user: 'Daniel Mulugeta',
      timestamp: '12 minutes ago'
    },
    {
      id: '3',
      type: 'connection_made',
      description: 'New peer connection established',
      user: 'Meron Amanuel',
      timestamp: '25 minutes ago'
    }
  ]

  if (activeView === 'hub') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveView('overview')}>
            ← Back to Overview
          </Button>
          <h2 className="text-2xl font-bold text-white">Network Hub - Admin View</h2>
        </div>
        <NetworkHubDashboard currentUserId="admin_user" />
      </div>
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
          <h2 className="text-3xl font-bold text-white mb-2">Network Management Hub</h2>
          <p className="text-gray-300">Manage the Galaxy Dream Team network and community</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setActiveView('hub')}
            className="border-slate-600 hover:bg-slate-700"
          >
            <Network className="w-4 h-4 mr-2" />
            Open Network Hub
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Network Members',
              value: networkStats.totalUsers,
              change: '+12 today',
              icon: Users,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Active Conversations',
              value: networkStats.activeConversations,
              change: '+8 today',
              icon: MessageSquare,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Daily Messages',
              value: networkStats.dailyMessages,
              change: '+15% vs yesterday',
              icon: MessageCircle,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Connection Requests',
              value: networkStats.connectionRequests,
              change: '+5 pending',
              icon: UserPlus,
              color: 'from-orange-500 to-red-500'
            },
            {
              title: 'Reported Content',
              value: networkStats.reportedContent,
              change: '-2 resolved',
              icon: AlertTriangle,
              color: 'from-yellow-500 to-orange-500'
            },
            {
              title: 'Moderation Queue',
              value: networkStats.moderationQueue,
              change: 'Needs attention',
              icon: Shield,
              color: 'from-red-500 to-pink-500'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm text-green-400">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{stat.title}</div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="moderation" className="data-[state=active]:bg-purple-600">
            <Shield className="w-4 h-4 mr-2" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Recent Network Activity</h3>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="p-2 rounded-lg bg-purple-600/20">
                        {activity.type === 'user_joined' && <UserPlus className="w-4 h-4 text-purple-400" />}
                        {activity.type === 'conversation_started' && <MessageSquare className="w-4 h-4 text-green-400" />}
                        {activity.type === 'connection_made' && <Users className="w-4 h-4 text-blue-400" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-white mb-1">{activity.description}</p>
                        {activity.user && (
                          <p className="text-sm text-purple-300 mb-1">User: {activity.user}</p>
                        )}
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.timestamp}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-slate-600 hover:bg-slate-700"
                    onClick={() => setActiveView('hub')}
                  >
                    <Network className="w-6 h-6 text-blue-400" />
                    <span className="text-sm">Open Network Hub</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-slate-600 hover:bg-slate-700"
                    onClick={() => setActiveView('moderation')}
                  >
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm">Review Reports</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-slate-600 hover:bg-slate-700"
                  >
                    <Plus className="w-6 h-6 text-green-400" />
                    <span className="text-sm">Create Group</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-slate-600 hover:bg-slate-700"
                    onClick={() => setActiveView('analytics')}
                  >
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Network Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Network Health</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">98.5%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.3s</div>
                  <div className="text-sm text-gray-400">Avg Response Time</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">99.2%</div>
                  <div className="text-sm text-gray-400">User Satisfaction</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Other tabs with placeholders */}
        <TabsContent value="moderation" className="mt-6">
          <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Moderation Center</h3>
            <p className="text-gray-400">Review reported content and manage community guidelines.</p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Network Analytics</h3>
            <p className="text-gray-400">Deep insights into network growth and engagement patterns.</p>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Network Settings</h3>
            <p className="text-gray-400">Configure network policies, permissions, and integrations.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}