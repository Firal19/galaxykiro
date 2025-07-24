"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  avatar?: string
  currentTier: 'browser' | 'engaged' | 'soft-member' | 'hot-lead'
  engagementScore: number
  captureLevel: number
  entryPoint: string
  referrerId?: string
  referrerName?: string
  joinedDate: string
  lastActivity: string
  completedAssessments: number
  sourceUrl?: string
  platform?: string
  totalInteractions: number
  conversionProbability: number
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Hanan Mohammed',
    email: 'hanan@email.com',
    phone: '+251911234567',
    city: 'Addis Ababa',
    currentTier: 'hot-lead',
    engagementScore: 89,
    captureLevel: 3,
    entryPoint: 'interactive-tools',
    referrerId: 'sarah_tesfaye',
    referrerName: 'Sarah Tesfaye',
    joinedDate: '2024-01-10T10:30:00Z',
    lastActivity: '2024-01-15T14:30:00Z',
    completedAssessments: 4,
    sourceUrl: 'instagram',
    platform: 'Instagram',
    totalInteractions: 23,
    conversionProbability: 85
  },
  {
    id: '2',
    name: 'Daniel Mulugeta',
    email: 'daniel@email.com',
    city: 'Dire Dawa',
    currentTier: 'soft-member',
    engagementScore: 67,
    captureLevel: 2,
    entryPoint: 'hero-section',
    joinedDate: '2024-01-12T16:45:00Z',
    lastActivity: '2024-01-15T12:15:00Z',
    completedAssessments: 2,
    sourceUrl: 'telegram',
    platform: 'Telegram',
    totalInteractions: 15,
    conversionProbability: 62
  },
  {
    id: '3',
    name: 'Meron Assefa',
    email: 'meron@email.com',
    phone: '+251922345678',
    city: 'Bahir Dar',
    currentTier: 'engaged',
    engagementScore: 45,
    captureLevel: 1,
    entryPoint: 'social-proof',
    joinedDate: '2024-01-14T09:20:00Z',
    lastActivity: '2024-01-15T08:45:00Z',
    completedAssessments: 1,
    sourceUrl: 'linkedin',
    platform: 'LinkedIn',
    totalInteractions: 8,
    conversionProbability: 38
  }
]

export function AdminLeadManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | Lead['currentTier']>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'engagement' | 'conversion'>('recent')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(mockLeads)
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = filterTier === 'all' || lead.currentTier === filterTier
      return matchesSearch && matchesTier
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'engagement':
          return b.engagementScore - a.engagementScore
        case 'conversion':
          return b.conversionProbability - a.conversionProbability
        case 'recent':
        default:
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      }
    })

  const getTierColor = (tier: Lead['currentTier']) => {
    switch (tier) {
      case 'hot-lead': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'soft-member': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'engaged': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'browser': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getConversionColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600 dark:text-green-400'
    if (probability >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lead Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all leads through the conversion pipeline
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Tiers</option>
                <option value="browser">Browser</option>
                <option value="engaged">Engaged</option>
                <option value="soft-member">Soft Member</option>
                <option value="hot-lead">Hot Lead</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="recent">Recent Activity</option>
                <option value="engagement">Engagement Score</option>
                <option value="conversion">Conversion Probability</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Lead Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-600' },
            { label: 'Hot Leads', value: leads.filter(l => l.currentTier === 'hot-lead').length, icon: Star, color: 'text-red-600' },
            { label: 'Avg Engagement', value: Math.round(leads.reduce((sum, l) => sum + l.engagementScore, 0) / leads.length), icon: TrendingUp, color: 'text-green-600' },
            { label: 'Active Today', value: leads.filter(l => new Date(l.lastActivity).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'text-purple-600' }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center">
                  <IconComponent className={`w-5 h-5 mr-3 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Lead
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Tier & Score
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Source & Entry
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Activity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Conversion
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {lead.email}
                          </div>
                          {lead.city && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {lead.city}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Badge className={getTierColor(lead.currentTier)}>
                          {lead.currentTier.replace('-', ' ')}
                        </Badge>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Score: {lead.engagementScore}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Level {lead.captureLevel}/3
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.platform || 'Direct'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Entry: {lead.entryPoint.replace('-', ' ')}
                        </div>
                        {lead.referrerName && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Ref: {lead.referrerName}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {lead.completedAssessments} assessments
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {lead.totalInteractions} interactions
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(lead.lastActivity).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${getConversionColor(lead.conversionProbability)}`}>
                          {lead.conversionProbability}%
                        </div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              lead.conversionProbability >= 70 ? 'bg-green-500' :
                              lead.conversionProbability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${lead.conversionProbability}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No leads found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Lead Detail Modal/Sidebar would go here */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lead Details: {selectedLead.name}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedLead(null)}
                >
                  Close
                </Button>
              </div>
              
              {/* Lead details content would go here */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLead.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLead.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Tier
                    </label>
                    <div>
                      <Badge className={getTierColor(selectedLead.currentTier)}>
                        {selectedLead.currentTier.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Engagement Score
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLead.engagementScore}/100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}