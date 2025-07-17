'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { DatePicker } from '../ui/date-picker'
import { Badge } from '../ui/badge'
import { 
  ContentCategory, 
  ContentDepthLevel, 
  ContentType, 
  ContentItem,
  CONTENT_CATEGORIES
} from '../../lib/models/content'
import { validateValueEscalator } from '../../lib/content-validation'

interface ContentFormProps {
  initialData?: Partial<ContentItem>
  onSubmit: (data: Partial<ContentItem>) => Promise<void>
  onCancel: () => void
}

export function ContentForm({ initialData, onSubmit, onCancel }: ContentFormProps) {
  const [formData, setFormData] = useState<Partial<ContentItem>>(
    initialData || {
      title: '',
      category: 'untapped-you',
      depthLevel: 'surface',
      contentType: 'article',
      hook: '',
      insight: '',
      application: '',
      hungerBuilder: '',
      nextStep: '',
      content: '',
      excerpt: '',
      requiredCaptureLevel: 1,
      estimatedReadTime: 5,
      tags: [],
      publishedAt: new Date(),
      author: 'Galaxy Dream Team',
      slug: '',
      metaDescription: '',
    }
  )
  
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [valueEscalatorValidation, setValueEscalatorValidation] = useState<{
    isValid: boolean
    messages: string[]
  }>({ isValid: true, messages: [] })

  // Validate Value Escalator format whenever those fields change
  useEffect(() => {
    const { hook, insight, application, hungerBuilder, nextStep } = formData
    if (hook && insight && application && hungerBuilder && nextStep) {
      const validation = validateValueEscalator({
        hook,
        insight,
        application,
        hungerBuilder,
        nextStep
      })
      setValueEscalatorValidation(validation)
    }
  }, [formData.hook, formData.insight, formData.application, formData.hungerBuilder, formData.nextStep])

  const handleChange = (field: keyof ContentItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Required fields
    const requiredFields: Array<keyof ContentItem> = [
      'title', 'category', 'depthLevel', 'contentType', 
      'hook', 'insight', 'application', 'hungerBuilder', 'nextStep',
      'content', 'excerpt', 'requiredCaptureLevel', 'estimatedReadTime',
      'publishedAt', 'author'
    ]
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`
      }
    })
    
    // Validate content length based on depth level
    if (formData.content && formData.depthLevel) {
      const contentLength = formData.content.length
      
      if (formData.depthLevel === 'surface' && contentLength < 300) {
        newErrors.content = 'Surface content should be at least 300 characters'
      } else if (formData.depthLevel === 'medium' && contentLength < 1000) {
        newErrors.content = 'Medium content should be at least 1000 characters'
      } else if (formData.depthLevel === 'deep' && contentLength < 2000) {
        newErrors.content = 'Deep content should be at least 2000 characters'
      }
    }
    
    // Validate tags
    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required'
    }
    
    // Set errors and return validation result
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && valueEscalatorValidation.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Generate slug if not provided
      if (!formData.slug && formData.title) {
        const slug = formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 60)
        
        formData.slug = slug
      }
      
      // Generate meta description if not provided
      if (!formData.metaDescription && formData.excerpt) {
        formData.metaDescription = formData.excerpt.substring(0, 160)
      }
      
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting content:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Content' : 'Create New Content'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={e => handleChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={value => handleChange('category', value)}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => (
                    <SelectItem key={id} value={id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <Label htmlFor="depthLevel">Depth Level</Label>
              <Select
                value={formData.depthLevel}
                onValueChange={value => handleChange('depthLevel', value as ContentDepthLevel)}
              >
                <SelectTrigger className={errors.depthLevel ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select depth level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">Surface</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
              {errors.depthLevel && <p className="text-red-500 text-sm mt-1">{errors.depthLevel}</p>}
            </div>
            
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={value => handleChange('contentType', value as ContentType)}
              >
                <SelectTrigger className={errors.contentType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
              {errors.contentType && <p className="text-red-500 text-sm mt-1">{errors.contentType}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="requiredCaptureLevel">Required Capture Level</Label>
              <Select
                value={String(formData.requiredCaptureLevel)}
                onValueChange={value => handleChange('requiredCaptureLevel', parseInt(value))}
              >
                <SelectTrigger className={errors.requiredCaptureLevel ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Email Only)</SelectItem>
                  <SelectItem value="2">Level 2 (Email + Phone)</SelectItem>
                  <SelectItem value="3">Level 3 (Full Profile)</SelectItem>
                </SelectContent>
              </Select>
              {errors.requiredCaptureLevel && <p className="text-red-500 text-sm mt-1">{errors.requiredCaptureLevel}</p>}
            </div>
            
            <div>
              <Label htmlFor="estimatedReadTime">Estimated Read Time (minutes)</Label>
              <Input
                id="estimatedReadTime"
                type="number"
                min="1"
                value={formData.estimatedReadTime || ''}
                onChange={e => handleChange('estimatedReadTime', parseInt(e.target.value))}
                className={errors.estimatedReadTime ? 'border-red-500' : ''}
              />
              {errors.estimatedReadTime && <p className="text-red-500 text-sm mt-1">{errors.estimatedReadTime}</p>}
            </div>
            
            <div>
              <Label htmlFor="publishedAt">Publish Date</Label>
              <DatePicker
                date={formData.publishedAt ? new Date(formData.publishedAt) : undefined}
                onSelect={date => handleChange('publishedAt', date)}
              />
              {errors.publishedAt && <p className="text-red-500 text-sm mt-1">{errors.publishedAt}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author || ''}
              onChange={e => handleChange('author', e.target.value)}
              className={errors.author ? 'border-red-500' : ''}
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>
        </div>
        
        {/* Value Escalator Format */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Value Escalator Format</h3>
            {!valueEscalatorValidation.isValid && (
              <Badge variant="destructive">Format Issues</Badge>
            )}
          </div>
          
          {!valueEscalatorValidation.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <h4 className="font-medium text-red-800 mb-1">Value Escalator Format Issues:</h4>
              <ul className="list-disc pl-5 text-sm text-red-700">
                {valueEscalatorValidation.messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <Label htmlFor="hook">Hook</Label>
            <Textarea
              id="hook"
              value={formData.hook || ''}
              onChange={e => handleChange('hook', e.target.value)}
              className={errors.hook ? 'border-red-500' : ''}
              placeholder="Capture attention with an intriguing question or statement"
              rows={2}
            />
            {errors.hook && <p className="text-red-500 text-sm mt-1">{errors.hook}</p>}
          </div>
          
          <div>
            <Label htmlFor="insight">Insight</Label>
            <Textarea
              id="insight"
              value={formData.insight || ''}
              onChange={e => handleChange('insight', e.target.value)}
              className={errors.insight ? 'border-red-500' : ''}
              placeholder="Share a key insight or research finding"
              rows={2}
            />
            {errors.insight && <p className="text-red-500 text-sm mt-1">{errors.insight}</p>}
          </div>
          
          <div>
            <Label htmlFor="application">Application</Label>
            <Textarea
              id="application"
              value={formData.application || ''}
              onChange={e => handleChange('application', e.target.value)}
              className={errors.application ? 'border-red-500' : ''}
              placeholder="Explain how to apply this insight"
              rows={2}
            />
            {errors.application && <p className="text-red-500 text-sm mt-1">{errors.application}</p>}
          </div>
          
          <div>
            <Label htmlFor="hungerBuilder">Hunger Builder</Label>
            <Textarea
              id="hungerBuilder"
              value={formData.hungerBuilder || ''}
              onChange={e => handleChange('hungerBuilder', e.target.value)}
              className={errors.hungerBuilder ? 'border-red-500' : ''}
              placeholder="Create desire for more information"
              rows={2}
            />
            {errors.hungerBuilder && <p className="text-red-500 text-sm mt-1">{errors.hungerBuilder}</p>}
          </div>
          
          <div>
            <Label htmlFor="nextStep">Next Step</Label>
            <Textarea
              id="nextStep"
              value={formData.nextStep || ''}
              onChange={e => handleChange('nextStep', e.target.value)}
              className={errors.nextStep ? 'border-red-500' : ''}
              placeholder="Clear call to action or next step"
              rows={2}
            />
            {errors.nextStep && <p className="text-red-500 text-sm mt-1">{errors.nextStep}</p>}
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content</h3>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={e => handleChange('excerpt', e.target.value)}
              className={errors.excerpt ? 'border-red-500' : ''}
              placeholder="Brief summary of the content (used for previews)"
              rows={2}
            />
            {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
          </div>
          
          <div>
            <Label htmlFor="content">Main Content (Markdown)</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={e => handleChange('content', e.target.value)}
              className={errors.content ? 'border-red-500' : ''}
              placeholder="Main content body in Markdown format"
              rows={10}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            
            <div className="mt-2 text-sm text-gray-500">
              {formData.content && (
                <span>Character count: {formData.content.length} / </span>
              )}
              {formData.depthLevel === 'surface' && <span>Minimum: 300 characters</span>}
              {formData.depthLevel === 'medium' && <span>Minimum: 1000 characters</span>}
              {formData.depthLevel === 'deep' && <span>Minimum: 2000 characters</span>}
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tags</h3>
          
          <div>
            <div className="flex">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className={`flex-1 ${errors.tags ? 'border-red-500' : ''}`}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                className="ml-2"
              >
                Add
              </Button>
            </div>
            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags?.map(tag => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">SEO</h3>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug || ''}
              onChange={e => handleChange('slug', e.target.value)}
              placeholder="URL-friendly version of title (auto-generated if empty)"
            />
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription || ''}
              onChange={e => handleChange('metaDescription', e.target.value)}
              placeholder="SEO description (auto-generated from excerpt if empty)"
              rows={2}
            />
            <div className="mt-1 text-sm text-gray-500">
              {formData.metaDescription && (
                <span>Character count: {formData.metaDescription.length} / 160 (recommended)</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Media URLs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media (Optional)</h3>
          
          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage || ''}
              onChange={e => handleChange('featuredImage', e.target.value)}
              placeholder="URL to featured image"
            />
          </div>
          
          <div>
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl || ''}
              onChange={e => handleChange('videoUrl', e.target.value)}
              placeholder="URL to video content"
            />
          </div>
          
          <div>
            <Label htmlFor="downloadUrl">Download URL</Label>
            <Input
              id="downloadUrl"
              value={formData.downloadUrl || ''}
              onChange={e => handleChange('downloadUrl', e.target.value)}
              placeholder="URL to downloadable resource"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Content' : 'Create Content'}
          </Button>
        </div>
      </form>
    </Card>
  )
}