'use client'

import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { WebinarModel } from '../../../lib/models/webinar'

interface WebinarFormData {
  title: string
  description: string
  presenterName: string
  presenterBio: string
  scheduledAt: string
  durationMinutes: number
  maxAttendees: number | null
  registrationDeadline: string
  webinarUrl: string
  tags: string[]
  thumbnailUrl: string
}

export default function AdminWebinarsPage() {
  const [webinars, setWebinars] = useState<WebinarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<WebinarModel | null>(null)
  const [formData, setFormData] = useState<WebinarFormData>({
    title: '',
    description: '',
    presenterName: '',
    presenterBio: '',
    scheduledAt: '',
    durationMinutes: 90,
    maxAttendees: null,
    registrationDeadline: '',
    webinarUrl: '',
    tags: [],
    thumbnailUrl: ''
  })

  useEffect(() => {
    loadWebinars()
  }, [])

  const loadWebinars = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/webinars?past=true&limit=50')
      const data = await response.json()
      
      if (data.success) {
        setWebinars(data.webinars.map((w: any) => new WebinarModel(w)))
      }
    } catch (error) {
      console.error('Error loading webinars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/webinars', {
        method: editingWebinar ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingWebinar?.id,
          tags: formData.tags.filter(tag => tag.trim() !== '')
        })
      })

      if (response.ok) {
        await loadWebinars()
        resetForm()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving webinar:', error)
      alert('Error saving webinar')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      presenterName: '',
      presenterBio: '',
      scheduledAt: '',
      durationMinutes: 90,
      maxAttendees: null,
      registrationDeadline: '',
      webinarUrl: '',
      tags: [],
      thumbnailUrl: ''
    })
    setEditingWebinar(null)
    setShowForm(false)
  }

  const handleEdit = (webinar: WebinarModel) => {
    setFormData({
      title: webinar.title,
      description: webinar.description || '',
      presenterName: webinar.presenterName || '',
      presenterBio: webinar.presenterBio || '',
      scheduledAt: new Date(webinar.scheduledAt).toISOString().slice(0, 16),
      durationMinutes: webinar.durationMinutes,
      maxAttendees: webinar.maxAttendees,
      registrationDeadline: webinar.registrationDeadline 
        ? new Date(webinar.registrationDeadline).toISOString().slice(0, 16)
        : '',
      webinarUrl: webinar.webinarUrl || '',
      tags: webinar.tags,
      thumbnailUrl: webinar.thumbnailUrl || ''
    })
    setEditingWebinar(webinar)
    setShowForm(true)
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData({ ...formData, tags: newTags })
  }

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] })
  }

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index)
    setFormData({ ...formData, tags: newTags })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Webinar Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create New Webinar
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presenter Name
                  </label>
                  <input
                    type="text"
                    value={formData.presenterName}
                    onChange={(e) => setFormData({ ...formData, presenterName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30"
                    max="180"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.maxAttendees || ''}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webinar URL
                  </label>
                  <input
                    type="url"
                    value={formData.webinarUrl}
                    onChange={(e) => setFormData({ ...formData, webinarUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter tag"
                      />
                      <Button
                        type="button"
                        onClick={() => removeTag(index)}
                        variant="outline"
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingWebinar ? 'Update Webinar' : 'Create Webinar'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Webinars List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading webinars...</div>
          ) : webinars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No webinars found</div>
          ) : (
            webinars.map((webinar) => (
              <Card key={webinar.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {webinar.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {new Date(webinar.scheduledAt).toLocaleString()}
                    </p>
                    {webinar.description && (
                      <p className="text-gray-600 mb-2">{webinar.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Duration: {webinar.durationMinutes}min</span>
                      {webinar.maxAttendees && (
                        <span>Max: {webinar.maxAttendees} attendees</span>
                      )}
                      <span>Status: {webinar.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(webinar)}
                      variant="outline"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}