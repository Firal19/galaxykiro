"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Package,
  BookOpen,
  Layers,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Save,
  Eye,
  Upload,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Target,
  Zap
} from 'lucide-react'
import { ContentCategory, ContentDepthLevel, ContentType, CONTENT_CATEGORIES } from '@/lib/models/content'
import { ContentHierarchyLevel } from '../admin-content-manager-v2'

interface ContentCreationWizardProps {
  isOpen: boolean
  onClose: () => void
  contentType: ContentHierarchyLevel
  parentId?: string
}

interface ValueEscalatorStep {
  hook: string
  insight: string
  application: string
  hungerBuilder: string
  nextStep: string
}

interface ContentFormData {
  // Basic Info
  title: string
  description: string
  category: ContentCategory
  depthLevel: ContentDepthLevel
  contentType: ContentType
  
  // Hierarchy
  parentId?: string
  order: number
  
  // Content Structure
  valueEscalator: ValueEscalatorStep
  mainContent: string
  learningObjectives: string[]
  prerequisites: string[]
  
  // Metadata
  estimatedTime: number
  tags: string[]
  targetAudience: 'visitors' | 'cold_leads' | 'candidates' | 'hot_leads'
  requiredCaptureLevel: 1 | 2 | 3
  
  // Media
  featuredImage?: string
  videoUrl?: string
  audioUrl?: string
  downloadUrl?: string
  
  // Publishing
  status: 'draft' | 'review' | 'published'
  publishDate?: string
  
  // Interactive Elements
  interactionElements: InteractionElement[]
}

interface InteractionElement {
  id: string
  type: 'quiz' | 'reflection' | 'action_item' | 'discussion' | 'poll' | 'survey'
  title: string
  content: string
  options?: string[]
  correctAnswer?: string
  points?: number
}

export function ContentCreationWizard({ isOpen, onClose, contentType, parentId }: ContentCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    category: 'untapped-you',
    depthLevel: 'surface',
    contentType: 'article',
    parentId,
    order: 1,
    valueEscalator: {
      hook: '',
      insight: '',
      application: '',
      hungerBuilder: '',
      nextStep: ''
    },
    mainContent: '',
    learningObjectives: [''],
    prerequisites: [''],
    estimatedTime: 5,
    tags: [],
    targetAudience: 'visitors',
    requiredCaptureLevel: 1,
    status: 'draft',
    interactionElements: []
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = contentType === 'package' ? 6 : contentType === 'core' ? 5 : 4

  const updateFormData = (field: keyof ContentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateValueEscalator = (field: keyof ValueEscalatorStep, value: string) => {
    setFormData(prev => ({
      ...prev,
      valueEscalator: { ...prev.valueEscalator, [field]: value }
    }))
  }

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }))
  }

  const updateLearningObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addInteractionElement = (type: InteractionElement['type']) => {
    const newElement: InteractionElement = {
      id: `element_${Date.now()}`,
      type,
      title: '',
      content: '',
      ...(type === 'quiz' && { options: ['', '', '', ''], correctAnswer: '', points: 10 }),
      ...(type === 'poll' && { options: ['', ''] })
    }
    
    setFormData(prev => ({
      ...prev,
      interactionElements: [...prev.interactionElements, newElement]
    }))
  }

  const updateInteractionElement = (id: string, updates: Partial<InteractionElement>) => {
    setFormData(prev => ({
      ...prev,
      interactionElements: prev.interactionElements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    }))
  }

  const removeInteractionElement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interactionElements: prev.interactionElements.filter(element => element.id !== id)
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Submit to API
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contentHierarchyLevel: contentType
        })
      })
      
      if (response.ok) {
        onClose()
        // Show success message
      } else {
        throw new Error('Failed to create content')
      }
    } catch (error) {
      console.error('Error creating content:', error)
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Basic Information'
      case 2: return 'Content Structure'
      case 3: return 'Interactive Elements'
      case 4: return 'Metadata & Publishing'
      case 5: return 'Learning Objectives'
      case 6: return 'Package Overview'
      default: return `Step ${step}`
    }
  }

  const getContentTypeConfig = () => {
    switch (contentType) {
      case 'package':
        return {
          title: 'Create Content Package',
          description: 'A complete learning system with multiple core modules',
          icon: Package,
          color: 'from-green-500 to-emerald-500'
        }
      case 'core':
        return {
          title: 'Create Core Module',
          description: 'A major topic or skill within a package',
          icon: BookOpen,
          color: 'from-blue-500 to-cyan-500'
        }
      case 'chunk':
        return {
          title: 'Create Content Chunk',
          description: 'A digestible learning unit within a core module',
          icon: Layers,
          color: 'from-purple-500 to-pink-500'
        }
      case 'concept':
        return {
          title: 'Create Concept',
          description: 'An individual idea or principle',
          icon: Lightbulb,
          color: 'from-orange-500 to-red-500'
        }
      default:
        return {
          title: 'Create Content',
          description: 'Create new content',
          icon: BookOpen,
          color: 'from-gray-500 to-gray-600'
        }
    }
  }

  const config = getContentTypeConfig()
  const IconComponent = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-slate-800 border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white">{config.title}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {config.description}
              </DialogDescription>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-600 text-gray-400'
                  }`}>
                    {i + 1 <= currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded ${
                      i + 1 < currentStep ? 'bg-purple-600' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Enter content title"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Brief description of the content"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Category *</Label>
                    <Select value={formData.category} onValueChange={(value: ContentCategory) => updateFormData('category', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => (
                          <SelectItem key={id} value={id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Content Type</Label>
                    <Select value={formData.contentType} onValueChange={(value: ContentType) => updateFormData('contentType', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">📄 Article</SelectItem>
                        <SelectItem value="video">🎥 Video</SelectItem>
                        <SelectItem value="tool">🔧 Tool</SelectItem>
                        <SelectItem value="guide">📖 Guide</SelectItem>
                        <SelectItem value="template">📋 Template</SelectItem>
                        <SelectItem value="audio">🎧 Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Depth Level</Label>
                    <Select value={formData.depthLevel} onValueChange={(value: ContentDepthLevel) => updateFormData('depthLevel', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="surface">🌊 Surface (Introduction)</SelectItem>
                        <SelectItem value="medium">🏊 Medium (Detailed)</SelectItem>
                        <SelectItem value="deep">🤿 Deep (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Content Structure */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Value Escalator Framework</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Follow the proven Value Escalator structure to maximize engagement and conversions.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hook" className="text-white">1. Hook - Grab Attention *</Label>
                  <Textarea
                    id="hook"
                    value={formData.valueEscalator.hook}
                    onChange={(e) => updateValueEscalator('hook', e.target.value)}
                    placeholder="Start with a compelling statement that hooks the reader's attention..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="insight" className="text-white">2. Insight - Provide Value *</Label>
                  <Textarea
                    id="insight"
                    value={formData.valueEscalator.insight}
                    onChange={(e) => updateValueEscalator('insight', e.target.value)}
                    placeholder="Share the core insight, research, or principle..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="application" className="text-white">3. Application - Make It Actionable *</Label>
                  <Textarea
                    id="application"
                    value={formData.valueEscalator.application}
                    onChange={(e) => updateValueEscalator('application', e.target.value)}
                    placeholder="Explain how to apply this insight immediately..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hungerBuilder" className="text-white">4. Hunger Builder - Create Anticipation *</Label>
                  <Textarea
                    id="hungerBuilder"
                    value={formData.valueEscalator.hungerBuilder}
                    onChange={(e) => updateValueEscalator('hungerBuilder', e.target.value)}
                    placeholder="Paint a picture of what's possible with more knowledge..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nextStep" className="text-white">5. Next Step - Clear Call to Action *</Label>
                  <Textarea
                    id="nextStep"
                    value={formData.valueEscalator.nextStep}
                    onChange={(e) => updateValueEscalator('nextStep', e.target.value)}
                    placeholder="Tell them exactly what to do next..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Interactive Elements */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Interactive Elements</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Add interactive elements to increase engagement and track user progress.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { type: 'quiz', label: 'Quiz', icon: '❓' },
                  { type: 'reflection', label: 'Reflection', icon: '💭' },
                  { type: 'action_item', label: 'Action Item', icon: '✅' },
                  { type: 'discussion', label: 'Discussion', icon: '💬' },
                  { type: 'poll', label: 'Poll', icon: '📊' },
                  { type: 'survey', label: 'Survey', icon: '📋' }
                ].map(element => (
                  <Button
                    key={element.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addInteractionElement(element.type as InteractionElement['type'])}
                    className="border-slate-600 hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {element.icon} {element.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {formData.interactionElements.map((element, index) => (
                  <Card key={element.id} className="p-4 bg-slate-700/50 border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">
                        {element.type.replace('_', ' ')}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInteractionElement(element.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        placeholder="Element title"
                        value={element.title}
                        onChange={(e) => updateInteractionElement(element.id, { title: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                      />
                      <Textarea
                        placeholder="Element content/question"
                        value={element.content}
                        onChange={(e) => updateInteractionElement(element.id, { content: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        rows={2}
                      />
                      
                      {element.type === 'quiz' && element.options && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-300">Answer Options</Label>
                          {element.options.map((option, optionIndex) => (
                            <Input
                              key={optionIndex}
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...element.options!]
                                newOptions[optionIndex] = e.target.value
                                updateInteractionElement(element.id, { options: newOptions })
                              }}
                              className="bg-slate-700 border-slate-600 text-sm"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Metadata & Publishing */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="estimatedTime" className="text-white">Estimated Time (minutes)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => updateFormData('estimatedTime', parseInt(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Target Audience</Label>
                    <Select value={formData.targetAudience} onValueChange={(value: any) => updateFormData('targetAudience', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitors">👥 Visitors</SelectItem>
                        <SelectItem value="cold_leads">🧊 Cold Leads</SelectItem>
                        <SelectItem value="candidates">🎯 Candidates</SelectItem>
                        <SelectItem value="hot_leads">🔥 Hot Leads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Required Capture Level</Label>
                    <Select value={formData.requiredCaptureLevel.toString()} onValueChange={(value) => updateFormData('requiredCaptureLevel', parseInt(value))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 - Public Access</SelectItem>
                        <SelectItem value="2">Level 2 - Email Required</SelectItem>
                        <SelectItem value="3">Level 3 - Full Registration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => updateFormData('status', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">📝 Draft</SelectItem>
                        <SelectItem value="review">👀 Review</SelectItem>
                        <SelectItem value="published">✅ Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags" className="text-white">Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        className="bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" onClick={addTag} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-700 pt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-slate-600"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="border-slate-600">
                Cancel
              </Button>
              
              {currentStep === totalSteps ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Content
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}