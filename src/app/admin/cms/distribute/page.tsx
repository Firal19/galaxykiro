"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/admin/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Send,
  Calendar as CalendarIcon,
  Users,
  Mail,
  Bell,
  Eye,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Settings,
  BarChart3,
  Activity,
  TrendingUp,
  MessageSquare,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DistributionChannel {
  id: string
  name: string
  type: 'email' | 'push' | 'in_app' | 'social'
  enabled: boolean
  description: string
}

interface AudienceOption {
  id: string
  name: string
  count: number
}

interface DistributionResult {
  channelId: string
  status: 'success' | 'failed' | 'pending'
  recipientCount: number
  message?: string
}

interface RecentDistribution {
  id: string
  contentTitle: string
  channels: string[]
  totalRecipients: number
  successfulChannels: number
  failedChannels: number
  distributedAt: string
  status: string
}

export default function AdminCMSDistributePage() {
  const [availableChannels, setAvailableChannels] = useState<DistributionChannel[]>([])
  const [audienceOptions, setAudienceOptions] = useState<AudienceOption[]>([])
  const [recentDistributions, setRecentDistributions] = useState<RecentDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [distributing, setDistributing] = useState(false)
  const [activeTab, setActiveTab] = useState('create')

  // Form state
  const [contentId, setContentId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedAudience, setSelectedAudience] = useState<string[]>(['soft_member'])
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [abTestEnabled, setAbTestEnabled] = useState(false)

  // Distribution results
  const [distributionResults, setDistributionResults] = useState<DistributionResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadDistributionData = async () => {
      try {
        const response = await fetch('/api/cms/distribute')
        const data = await response.json()
        
        setAvailableChannels(data.availableChannels || [])
        setAudienceOptions(data.audienceOptions || [])
        setRecentDistributions(data.recentDistributions || [])
      } catch (error) {
        console.error('Error loading distribution data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDistributionData()
  }, [])

  const handleChannelToggle = (channelId: string, checked: boolean) => {
    if (checked) {
      setSelectedChannels(prev => [...prev, channelId])
    } else {
      setSelectedChannels(prev => prev.filter(id => id !== channelId))
    }
  }

  const handleAudienceToggle = (audienceId: string, checked: boolean) => {
    if (checked) {
      setSelectedAudience(prev => [...prev, audienceId])
    } else {
      setSelectedAudience(prev => prev.filter(id => id !== audienceId))
    }
  }

  const calculateTotalReach = () => {
    return selectedAudience.reduce((total, audienceId) => {
      const audience = audienceOptions.find(a => a.id === audienceId)
      return total + (audience?.count || 0)
    }, 0)
  }

  const handleDistribute = async () => {
    if (!title.trim() || selectedChannels.length === 0 || selectedAudience.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    setDistributing(true)
    try {
      const distributionRequest = {
        contentId: contentId || `content_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        customMessage: customMessage.trim(),
        channels: selectedChannels,
        targetAudience: selectedAudience,
        scheduledDate: scheduledDate?.toISOString(),
        abTestEnabled
      }

      const response = await fetch('/api/cms/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(distributionRequest)
      })

      const result = await response.json()

      if (result.success) {
        setDistributionResults(result.results)
        setShowResults(true)
        
        // Reset form
        setContentId('')
        setTitle('')
        setDescription('')
        setCustomMessage('')
        setSelectedChannels([])
        setScheduledDate(undefined)
        setAbTestEnabled(false)
      } else {
        alert(`Distribution failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Distribution error:', error)
      alert('Distribution failed. Please try again.')
    } finally {
      setDistributing(false)
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'push': return Bell
      case 'in_app': return Eye
      case 'social': return Share2
      default: return MessageSquare
    }
  }

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-500'
      case 'push': return 'text-green-500'
      case 'in_app': return 'text-purple-500'
      case 'social': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading distribution center...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/admin/cms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to CMS
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Content Distribution</h1>
                <p className="text-muted-foreground">
                  Distribute content across multiple channels and track performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Channel Settings
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Distribution Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Distribution</TabsTrigger>
              <TabsTrigger value="history">Distribution History</TabsTrigger>
              <TabsTrigger value="channels">Channel Management</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Distribution Form */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Content Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="content-id">Content ID (Optional)</Label>
                        <Input
                          id="content-id"
                          placeholder="Leave empty for auto-generation"
                          value={contentId}
                          onChange={(e) => setContentId(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Content title for distribution"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the content"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                        <Textarea
                          id="custom-message"
                          placeholder="Add a personalized message for the distribution"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Distribution Channels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableChannels.map((channel) => {
                        const Icon = getChannelIcon(channel.type)
                        const colorClass = getChannelColor(channel.type)
                        
                        return (
                          <div
                            key={channel.id}
                            className={`p-4 border rounded-lg ${
                              selectedChannels.includes(channel.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-muted'
                            } ${!channel.enabled ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={channel.id}
                                checked={selectedChannels.includes(channel.id)}
                                onCheckedChange={(checked) => handleChannelToggle(channel.id, checked as boolean)}
                                disabled={!channel.enabled}
                              />
                              <Icon className={`w-5 h-5 ${colorClass}`} />
                              <div className="flex-1">
                                <Label htmlFor={channel.id} className="font-medium">
                                  {channel.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {channel.description}
                                </p>
                                {!channel.enabled && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    Disabled
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Target Audience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {audienceOptions.map((audience) => (
                        <div key={audience.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={audience.id}
                            checked={selectedAudience.includes(audience.id)}
                            onCheckedChange={(checked) => handleAudienceToggle(audience.id, checked as boolean)}
                          />
                          <Label htmlFor={audience.id} className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{audience.name}</span>
                              <Badge variant="outline">{audience.count.toLocaleString()}</Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Advanced Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="schedule"
                          checked={!!scheduledDate}
                          onCheckedChange={(checked) => {
                            if (!checked) setScheduledDate(undefined)
                          }}
                        />
                        <Label htmlFor="schedule">Schedule for later</Label>
                      </div>

                      {scheduledDate !== undefined && (
                        <div className="ml-6">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] justify-start text-left font-normal",
                                  !scheduledDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ab-test"
                          checked={abTestEnabled}
                          onCheckedChange={(checked) => setAbTestEnabled(checked as boolean)}
                        />
                        <Label htmlFor="ab-test">Enable A/B testing</Label>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Distribution Summary Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Distribution Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Selected Channels</span>
                        <Badge variant="secondary">{selectedChannels.length}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Target Audiences</span>
                        <Badge variant="secondary">{selectedAudience.length}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Est. Reach</span>
                        <Badge variant="outline">{calculateTotalReach().toLocaleString()}</Badge>
                      </div>
                      
                      {scheduledDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Scheduled For</span>
                          <Badge variant="outline">{format(scheduledDate, "MMM dd")}</Badge>
                        </div>
                      )}
                    </div>
                    
                    {selectedChannels.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Channels:</h4>
                        <div className="space-y-1">
                          {selectedChannels.map(channelId => {
                            const channel = availableChannels.find(c => c.id === channelId)
                            const Icon = getChannelIcon(channel?.type || '')
                            const colorClass = getChannelColor(channel?.type || '')
                            
                            return (
                              <div key={channelId} className="flex items-center space-x-2">
                                <Icon className={`w-4 h-4 ${colorClass}`} />
                                <span className="text-sm">{channel?.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-6"
                      onClick={handleDistribute}
                      disabled={distributing || !title.trim() || selectedChannels.length === 0 || selectedAudience.length === 0}
                    >
                      {distributing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Distributing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>{scheduledDate ? 'Schedule Distribution' : 'Distribute Now'}</span>
                        </div>
                      )}
                    </Button>
                  </Card>

                  {/* Channel Status */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Channel Status</h3>
                    <div className="space-y-3">
                      {availableChannels.map((channel) => {
                        const Icon = getChannelIcon(channel.type)
                        const colorClass = getChannelColor(channel.type)
                        
                        return (
                          <div key={channel.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon className={`w-4 h-4 ${colorClass}`} />
                              <span className="text-sm">{channel.name}</span>
                            </div>
                            <Badge variant={channel.enabled ? 'default' : 'secondary'}>
                              {channel.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Distributions</h3>
                <div className="space-y-4">
                  {recentDistributions.map((distribution) => (
                    <div key={distribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{distribution.contentTitle}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{distribution.channels.length} channels</span>
                          <span>{distribution.totalRecipients.toLocaleString()} recipients</span>
                          <span>{new Date(distribution.distributedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={distribution.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {distribution.status}
                        </Badge>
                        <div className="text-right text-sm">
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>{distribution.successfulChannels}</span>
                          </div>
                          {distribution.failedChannels > 0 && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              <span>{distribution.failedChannels}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableChannels.map((channel) => {
                  const Icon = getChannelIcon(channel.type)
                  const colorClass = getChannelColor(channel.type)
                  
                  return (
                    <Card key={channel.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${colorClass}`} />
                          <div>
                            <h4 className="font-semibold">{channel.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{channel.type}</p>
                          </div>
                        </div>
                        <Badge variant={channel.enabled ? 'default' : 'secondary'}>
                          {channel.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {channel.description}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Distribution Results Dialog */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Distribution Results</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {distributionResults.map((result) => {
                const channel = availableChannels.find(c => c.id === result.channelId)
                const Icon = getChannelIcon(channel?.type || '')
                const colorClass = getChannelColor(channel?.type || '')
                
                return (
                  <div key={result.channelId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${colorClass}`} />
                      <div>
                        <h4 className="font-medium">{channel?.name}</h4>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={result.status === 'success' ? 'default' : 'destructive'}
                        className="mb-1"
                      >
                        {result.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {result.recipientCount.toLocaleString()} recipients
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}