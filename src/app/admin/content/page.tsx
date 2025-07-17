'use client'

import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { 
  ContentCategory, 
  ContentDepthLevel, 
  ContentType, 
  ContentItem,
  ContentModel,
  CONTENT_CATEGORIES
} from '../../../lib/models/content'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Calendar } from '../../../components/ui/calendar'
import { useToast } from '../../../components/ui/use-toast'
import { ContentPublishingCalendar } from '../../../components/admin/content-publishing-calendar'
import { ContentForm } from '../../../components/admin/content-form'
import { ContentAnalytics } from '../../../components/admin/content-analytics'
import { ContentABTestingDashboard } from '../../../components/admin/content-ab-testing-dashboard'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [contents, setContents] = useState<ContentModel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentModel | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content')
      const data = await response.json()
      
      if (data.success) {
        setContents(data.contents.map((c: any) => new ContentModel(c)))
      } else {
        toast({
          title: "Error loading content",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContent = () => {
    setEditingContent(null)
    setShowForm(true)
  }

  const handleEditContent = (content: ContentModel) => {
    setEditingContent(content)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContent(null)
  }

  const handleFormSubmit = async (contentData: Partial<ContentItem>) => {
    try {
      const method = editingContent ? 'PUT' : 'POST'
      const url = editingContent 
        ? `/api/admin/content/${editingContent.id}` 
        : '/api/admin/content'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: editingContent ? "Content updated" : "Content created",
          description: `Successfully ${editingContent ? 'updated' : 'created'} "${contentData.title}"`,
        })
        await loadContents()
        setShowForm(false)
        setEditingContent(null)
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Content deleted",
          description: "The content has been successfully deleted.",
        })
        await loadContents()
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          {activeTab === 'content' && (
            <Button 
              onClick={handleCreateContent}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create New Content
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="content">Content Library</TabsTrigger>
            <TabsTrigger value="calendar">Publishing Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {showForm ? (
              <ContentForm 
                initialData={editingContent?.toJSON()} 
                onSubmit={handleFormSubmit}
                onCancel={handleFormClose}
              />
            ) : (
              <>
                {loading ? (
                  <div className="text-center py-8">Loading content...</div>
                ) : contents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No content found</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {contents.map((content) => (
                      <Card key={content.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                                {CONTENT_CATEGORIES[content.category].name}
                              </span>
                              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                                {content.contentType}
                              </span>
                              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                                {content.depthLevel}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {content.title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {content.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Published: {new Date(content.publishedAt).toLocaleDateString()}</span>
                              <span>Read time: {content.estimatedReadTime} min</span>
                              <span>Level: {content.requiredCaptureLevel}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditContent(content)}
                              variant="outline"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteContent(content.id)}
                              variant="outline"
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            <ContentPublishingCalendar 
              contents={contents}
              onCreateContent={handleCreateContent}
              onEditContent={handleEditContent}
            />
          </TabsContent>
          
          <TabsContent value="analytics">
            <ContentAnalytics contents={contents} />
          </TabsContent>
          
          <TabsContent value="ab-testing">
            <ContentABTestingDashboard contents={contents} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}