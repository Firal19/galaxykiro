"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, CalendarIcon } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Save,
  Send,
  Calendar as CalendarIconLucide,
  Eye,
  FileText,
  Image,
  Video,
  Target,
  Users,
  Clock,
  Settings,
  Plus,
  X,
  Upload,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Tag
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ContentMetadata {
  title: string
  description: string
  type: 'article' | 'video' | 'assessment' | 'worksheet' | 'webinar'
  category: string
  tags: string[]
  targetAudience: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: string
  author: string
}

interface ContentScheduling {
  publishNow: boolean
  scheduledDate?: Date
  autoDistribute: boolean
  distributionChannels: string[]
  abTestEnabled: boolean
  abTestVariants?: string[]
}

interface ContentSettings {
  allowComments: boolean
  requireCompletion: boolean
  trackEngagement: boolean
  enableCertificate: boolean
  accessLevel: 'free' | 'member' | 'premium'
  prerequisites: string[]
}

export default function AdminCMSCreatePage() {
  const [activeTab, setActiveTab] = useState('content')
  const [contentType, setContentType] = useState<string>('')
  const [metadata, setMetadata] = useState<ContentMetadata>({
    title: '',
    description: '',
    type: 'article',
    category: '',
    tags: [],
    targetAudience: [],
    difficulty: 'beginner',
    estimatedDuration: '',
    author: 'Galaxy Kiro Team'
  })
  const [content, setContent] = useState('')
  const [scheduling, setScheduling] = useState<ContentScheduling>({
    publishNow: true,
    autoDistribute: false,
    distributionChannels: [],
    abTestEnabled: false
  })
  const [settings, setSettings] = useState<ContentSettings>({
    allowComments: true,
    requireCompletion: false,
    trackEngagement: true,
    enableCertificate: false,
    accessLevel: 'member',
    prerequisites: []
  })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [date, setDate] = useState<Date>()

  const categories = [
    'Leadership', 'Potential', 'Goal Setting', 'Habits', 'Decision Making',
    'Vision', 'Influence', 'Transformation', 'Mindset', 'Strategy'
  ]

  const audienceTypes = [
    { id: 'visitor', label: 'Website Visitors' },
    { id: 'lead', label: 'Leads' },
    { id: 'candidate', label: 'Candidates' },
    { id: 'soft_member', label: 'Soft Members' },
    { id: 'hot_lead', label: 'Hot Leads' },
    { id: 'member', label: 'Full Members' }
  ]

  const distributionChannels = [
    { id: 'email', label: 'Email Newsletter' },
    { id: 'push', label: 'Push Notifications' },
    { id: 'in_app', label: 'In-App Notifications' },
    { id: 'social', label: 'Social Media' }
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    if (checked) {
      setMetadata(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, audienceId]
      }))
    } else {
      setMetadata(prev => ({
        ...prev,
        targetAudience: prev.targetAudience.filter(id => id !== audienceId)
      }))
    }
  }

  const handleChannelChange = (channelId: string, checked: boolean) => {
    if (checked) {
      setScheduling(prev => ({
        ...prev,
        distributionChannels: [...prev.distributionChannels, channelId]
      }))
    } else {
      setScheduling(prev => ({
        ...prev,
        distributionChannels: prev.distributionChannels.filter(id => id !== channelId)
      }))
    }
  }

  const handleSave = async (action: 'draft' | 'review' | 'publish') => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Saving content:', {
        metadata,
        content,
        scheduling,
        settings,
        action
      })
      
      // In production, this would make an API call to save the content
      alert(`Content saved as ${action}!`)
      
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText
      case 'video': return Video
      case 'assessment': return Target
      case 'worksheet': return FileText
      case 'webinar': return Users
      default: return FileText
    }
  }

  const isFormValid = () => {
    return metadata.title.trim() && 
           metadata.description.trim() && 
           metadata.category && 
           metadata.targetAudience.length > 0 &&
           content.trim()
  }

  return (
    <AdminLayout>
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
                <h1 className="text-3xl font-bold">Create New Content</h1>
                <p className="text-muted-foreground">
                  Build engaging content for your audience
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setPreview(!preview)}
                disabled={!content.trim()}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSave('draft')}
                disabled={saving || !metadata.title.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={() => handleSave(scheduling.publishNow ? 'publish' : 'review')}
                disabled={saving || !isFormValid()}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                ) : scheduling.publishNow ? (
                  <Send className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {scheduling.publishNow ? 'Publish Now' : 'Submit for Review'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content Creation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Content Type Selection */}
              {!contentType && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Choose Content Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { type: 'article', label: 'Article', icon: FileText, description: 'Written content with rich formatting' },
                      { type: 'video', label: 'Video', icon: Video, description: 'Video content with transcript' },
                      { type: 'assessment', label: 'Assessment', icon: Target, description: 'Interactive assessment tool' },
                      { type: 'worksheet', label: 'Worksheet', icon: FileText, description: 'Downloadable worksheet' },
                      { type: 'webinar', label: 'Webinar', icon: Users, description: 'Live or recorded presentation' }
                    ].map(({ type, label, icon: Icon, description }) => (
                      <Card 
                        key={type}
                        className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setContentType(type)
                          setMetadata(prev => ({ ...prev, type: type as any }))
                        }}
                      >
                        <div className="text-center space-y-3">
                          <div className="p-3 bg-primary/10 rounded-lg mx-auto w-fit">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{label}</h4>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Content Editor */}
              {contentType && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const Icon = getContentTypeIcon(contentType)
                        return <Icon className="w-5 h-5 text-primary" />
                      })()}
                      <h3 className="font-semibold capitalize">{contentType} Editor</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setContentType('')
                        setContent('')
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Change Type
                    </Button>
                  </div>

                  {/* Basic Content Fields */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter content title..."
                        value={metadata.title}
                        onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                        className="text-lg font-semibold"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the content..."
                        value={metadata.description}
                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Rich Text Editor Toolbar */}
                  <div className="border rounded-t-lg p-3 bg-muted/30">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <div className="flex items-center space-x-1 border-r pr-2">
                        <Button variant="ghost" size="sm">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-1 border-r pr-2">
                        <Button variant="ghost" size="sm">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Quote className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Code className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <Textarea
                    placeholder={`Write your ${contentType} content here...

For articles: Use markdown-style formatting
For videos: Include transcript and key timestamps
For assessments: Define questions and scoring logic
For worksheets: Outline exercises and instructions
For webinars: Include agenda and key takeaways`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="rounded-t-none border-t-0 resize-none font-mono text-sm"
                  />

                  {/* Content Stats */}
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>{content.length} characters</span>
                      <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
                      <span>{Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={content.length > 100 ? 'default' : 'secondary'}>
                        {content.length > 100 ? 'Good length' : 'Too short'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Content Attachments */}
              {contentType && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Attachments & Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Images</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Browse Files
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Videos</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Browse Files
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Documents</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Content Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={metadata.category} onValueChange={(value) => setMetadata(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={metadata.difficulty} onValueChange={(value: any) => setMetadata(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Estimated Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 15 min, 2 hours"
                        value={metadata.estimatedDuration}
                        onChange={(e) => setMetadata(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={metadata.author}
                        onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Tags</Label>
                      <div className="flex items-center space-x-2 mb-2">
                        <Input
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button onClick={handleAddTag} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {metadata.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                            <button onClick={() => handleRemoveTag(tag)}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Target Audience *</Label>
                      <div className="space-y-2 mt-2">
                        {audienceTypes.map(audience => (
                          <div key={audience.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={audience.id}
                              checked={metadata.targetAudience.includes(audience.id)}
                              onCheckedChange={(checked) => handleAudienceChange(audience.id, checked as boolean)}
                            />
                            <Label htmlFor={audience.id} className="text-sm">{audience.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="scheduling" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Publishing Schedule</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publishNow"
                      checked={scheduling.publishNow}
                      onCheckedChange={(checked) => setScheduling(prev => ({ ...prev, publishNow: checked as boolean }))}
                    />
                    <Label htmlFor="publishNow">Publish immediately</Label>
                  </div>

                  {!scheduling.publishNow && (
                    <div>
                      <Label>Schedule for later</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-2",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIconLucide className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate)
                              setScheduling(prev => ({ ...prev, scheduledDate: selectedDate }))
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Distribution Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoDistribute"
                      checked={scheduling.autoDistribute}
                      onCheckedChange={(checked) => setScheduling(prev => ({ ...prev, autoDistribute: checked as boolean }))}
                    />
                    <Label htmlFor="autoDistribute">Automatically distribute when published</Label>
                  </div>

                  {scheduling.autoDistribute && (
                    <div>
                      <Label className="text-sm font-medium">Distribution Channels</Label>
                      <div className="space-y-2 mt-2">
                        {distributionChannels.map(channel => (
                          <div key={channel.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={channel.id}
                              checked={scheduling.distributionChannels.includes(channel.id)}
                              onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                            />
                            <Label htmlFor={channel.id} className="text-sm">{channel.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">A/B Testing</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="abTest"
                      checked={scheduling.abTestEnabled}
                      onCheckedChange={(checked) => setScheduling(prev => ({ ...prev, abTestEnabled: checked as boolean }))}
                    />
                    <Label htmlFor="abTest">Enable A/B testing for this content</Label>
                  </div>

                  {scheduling.abTestEnabled && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        A/B testing will create variants of your content to test different approaches.
                        This is useful for testing headlines, descriptions, or content formats.
                      </p>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure A/B Test
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Content Settings</h3>
                <div className="space-y-6">
                  <div>
                    <Label>Access Level</Label>
                    <Select value={settings.accessLevel} onValueChange={(value: any) => setSettings(prev => ({ ...prev, accessLevel: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free - Anyone can access</SelectItem>
                        <SelectItem value="member">Member - Soft members and above</SelectItem>
                        <SelectItem value="premium">Premium - Hot leads and full members only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allowComments"
                          checked={settings.allowComments}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowComments: checked as boolean }))}
                        />
                        <Label htmlFor="allowComments">Allow comments</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requireCompletion"
                          checked={settings.requireCompletion}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireCompletion: checked as boolean }))}
                        />
                        <Label htmlFor="requireCompletion">Require completion tracking</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trackEngagement"
                          checked={settings.trackEngagement}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, trackEngagement: checked as boolean }))}
                        />
                        <Label htmlFor="trackEngagement">Track engagement metrics</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableCertificate"
                          checked={settings.enableCertificate}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCertificate: checked as boolean }))}
                        />
                        <Label htmlFor="enableCertificate">Enable completion certificate</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">SEO & Optimization</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="SEO-optimized title..."
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="SEO-friendly description (150-160 characters)..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="keywords">Focus Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Preview Modal */}
        <Dialog open={preview} onOpenChange={setPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Content Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-bold mb-2">{metadata.title || 'Untitled'}</h1>
                <p className="text-muted-foreground">{metadata.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>By {metadata.author}</span>
                  <span>•</span>
                  <span className="capitalize">{metadata.difficulty}</span>
                  <span>•</span>
                  <span>{metadata.estimatedDuration}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{content || 'No content yet...'}</pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Validation Warnings */}
        {!isFormValid() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 max-w-sm"
          >
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Complete Required Fields</h4>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    {!metadata.title && <li>• Add a title</li>}
                    {!metadata.description && <li>• Add a description</li>}
                    {!metadata.category && <li>• Select a category</li>}
                    {metadata.targetAudience.length === 0 && <li>• Choose target audience</li>}
                    {!content.trim() && <li>• Add content</li>}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}