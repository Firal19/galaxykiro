'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { WebinarModel } from '../lib/models/webinar'

interface WebinarListingProps {
  onRegisterClick: (webinar: WebinarModel) => void
  showPastWebinars?: boolean
  limit?: number
}

export function WebinarListing({ 
  onRegisterClick, 
  showPastWebinars = false, 
  limit = 10 
}: WebinarListingProps) {
  const [webinars, setWebinars] = useState<WebinarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWebinars()
  }, [showPastWebinars, limit])

  const loadWebinars = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/webinars', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load webinars')
      }

      const data = await response.json()
      setWebinars(data.webinars || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load webinars')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const getStatusBadge = (webinar: WebinarModel) => {
    const now = new Date()
    const scheduledAt = new Date(webinar.scheduledAt)
    
    if (webinar.status === 'completed') {
      return <Badge variant="secondary">Completed</Badge>
    }
    
    if (webinar.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>
    }
    
    if (webinar.status === 'live') {
      return <Badge className="bg-red-500 text-white animate-pulse">Live Now</Badge>
    }
    
    if (scheduledAt < now) {
      return <Badge variant="secondary">Past</Badge>
    }
    
    if (!webinar.isRegistrationOpen()) {
      return <Badge variant="outline">Registration Closed</Badge>
    }
    
    return <Badge className="bg-green-500 text-white">Open for Registration</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadWebinars} variant="outline">
          Try Again
        </Button>
      </Card>
    )
  }

  if (webinars.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">
          {showPastWebinars ? 'No past webinars found.' : 'No upcoming webinars scheduled.'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {webinars.map((webinar) => (
        <Card key={webinar.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {webinar.title}
                </h3>
                {getStatusBadge(webinar)}
              </div>
              
              {webinar.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {webinar.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(new Date(webinar.scheduledAt))}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDuration(webinar.durationMinutes)}</span>
                </div>
                
                {webinar.presenterName && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Presented by {webinar.presenterName}</span>
                  </div>
                )}
              </div>
              
              {webinar.tags && webinar.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {webinar.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {webinar.thumbnailUrl && (
              <div className="lg:w-48 lg:h-32 w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={webinar.thumbnailUrl} 
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-500">
              {webinar.maxAttendees && (
                <span>Limited to {webinar.maxAttendees} attendees</span>
              )}
            </div>
            
            <div className="flex gap-3">
              {webinar.status === 'completed' && webinar.recordingUrl && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(webinar.recordingUrl!, '_blank')}
                >
                  Watch Recording
                </Button>
              )}
              
              {webinar.status === 'live' && webinar.webinarUrl && (
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  onClick={() => window.open(webinar.webinarUrl!, '_blank')}
                >
                  Join Live
                </Button>
              )}
              
              {webinar.isRegistrationOpen() && (
                <Button 
                  onClick={() => onRegisterClick(webinar)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Register Now
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}