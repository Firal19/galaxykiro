'use client'

import React, { useEffect, useState } from 'react'
import { 
  Clock, 
  Tag, 
  Share2, 
  Bookmark, 
  Download, 
  ArrowLeft, 
  Eye,
  TrendingUp,
  Lock,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ContentModel, CONTENT_CATEGORIES } from '../lib/models/content'
import { UserModel } from '../lib/models/user'
import { useContentTracking, useContentActions } from '../lib/hooks/use-content-tracking'

interface ContentViewerProps {
  content: ContentModel
  user?: UserModel
  onBack?: () => void
  onComplete?: (contentId: string) => void
  className?: string
}

interface ReadingProgressProps {
  estimatedReadTime: number
  timeSpent: number
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ 
  estimatedReadTime, 
  timeSpent 
}) => {
  const progressPercentage = Math.min((timeSpent / (estimatedReadTime * 60)) * 100, 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Reading Progress</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')} spent</span>
        <span>{estimatedReadTime} min estimated</span>
      </div>
    </div>
  )
}

interface ContentSectionProps {
  title: string
  content: string
  icon?: React.ReactNode
  className?: string
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  content, 
  icon, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  content,
  user,
  onBack,
  onComplete,
  className = ''
}) => {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const canAccess = user ? content.canUserAccess(user.captureLevel) : false
  const categoryInfo = CONTENT_CATEGORIES[content.category]

  // Content tracking
  const { trackInteraction, getTrackingData } = useContentTracking({
    contentId: content.id,
    contentType: content.contentType,
    contentCategory: content.category,
    userId: user?.id,
    enabled: canAccess
  })

  // Content actions
  const { 
    trackShare, 
    trackBookmark, 
    trackDownload, 
    trackCompletion,
    trackCTAClick 
  } = useContentActions(content.id, user?.id)

  // Get current tracking data
  const [trackingData, setTrackingData] = useState({
    timeSpent: 0,
    scrollDepth: 0,
    interactions: 0,
    engagementScore: 0
  })

  // Update tracking data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData(getTrackingData())
    }, 5000)

    return () => clearInterval(interval)
  }, [getTrackingData])

  // Check for completion based on time spent and scroll depth
  useEffect(() => {
    const { timeSpent, scrollDepth } = trackingData
    const estimatedSeconds = content.estimatedReadTime * 60
    const timeProgress = timeSpent / estimatedSeconds
    
    if (!isCompleted && (timeProgress >= 0.8 || scrollDepth >= 0.9)) {
      setIsCompleted(true)
      trackCompletion(Math.max(timeProgress, scrollDepth))
      onComplete?.(content.id)
    }
  }, [trackingData, content.estimatedReadTime, content.id, isCompleted, trackCompletion, onComplete])

  const handleShare = (platform: string) => {
    trackShare(platform)
    setShowShareMenu(false)
    
    // Implement actual sharing logic here
    const shareUrl = `${window.location.origin}/content/${content.slug}`
    const shareText = `Check out this article: ${content.title}`
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)
    }
  }

  const handleBookmark = () => {
    trackBookmark()
    // Implement bookmark functionality
    console.log('Bookmarked:', content.id)
  }

  const handleDownload = () => {
    if (content.downloadUrl) {
      trackDownload('pdf')
      window.open(content.downloadUrl, '_blank')
    }
  }

  const handleCTAClick = (ctaType: string, ctaText: string) => {
    trackCTAClick(ctaType, ctaText)
    trackInteraction('cta_click')
  }

  if (!canAccess) {
    return (
      <div className={`max-w-4xl mx-auto p-6 ${className}`}>
        <Card className="text-center py-12">
          <CardContent>
            <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Locked</h2>
            <p className="text-gray-600 mb-4">
              This content requires Level {content.requiredCaptureLevel} access.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Complete more assessments and provide additional information to unlock this content.
            </p>
            <Button onClick={onBack}>
              Back to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedContent = content.getFormattedContent()

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-8 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <Badge variant="outline" className="text-sm">
              {categoryInfo.name}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-sm ${
                content.depthLevel === 'surface' ? 'bg-green-100 text-green-800' :
                content.depthLevel === 'medium' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}
            >
              {content.depthLevel === 'surface' ? 'Quick Read' :
               content.depthLevel === 'medium' ? 'Deep Dive' : 'Masterclass'}
            </Badge>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {content.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{content.estimatedReadTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{content.viewCount} views</span>
              </div>
              {content.engagementRate > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{Math.round(content.engagementRate * 100)}% engaged</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="w-full justify-start text-xs"
                      >
                        Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('twitter')}
                        className="w-full justify-start text-xs"
                      >
                        Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('linkedin')}
                        className="w-full justify-start text-xs"
                      >
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="w-4 h-4" />
              </Button>

              {content.downloadUrl && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reading Progress */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <ReadingProgress
              estimatedReadTime={content.estimatedReadTime}
              timeSpent={trackingData.timeSpent}
            />
          </CardContent>
        </Card>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Hook */}
        <ContentSection
          title="The Hook"
          content={formattedContent.hook}
          icon={<span className="text-lg">🎣</span>}
          className="bg-blue-50 p-6 rounded-lg"
        />

        {/* Insight */}
        <ContentSection
          title="The Insight"
          content={formattedContent.insight}
          icon={<span className="text-lg">💡</span>}
          className="bg-yellow-50 p-6 rounded-lg"
        />

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: formattedContent.mainContent.replace(/\n/g, '<br>') }}
            onClick={() => trackInteraction('content_click')}
          />
        </div>

        {/* Application */}
        <ContentSection
          title="The Application"
          content={formattedContent.application}
          icon={<span className="text-lg">🛠️</span>}
          className="bg-green-50 p-6 rounded-lg"
        />

        {/* Hunger Builder */}
        <ContentSection
          title="What's Possible"
          content={formattedContent.hungerBuilder}
          icon={<span className="text-lg">🚀</span>}
          className="bg-purple-50 p-6 rounded-lg"
        />

        {/* Next Step */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span className="text-lg">⚡</span>
              Your Next Step
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100 mb-4">{formattedContent.nextStep}</p>
            <Button 
              variant="secondary"
              onClick={() => handleCTAClick('next_step', 'Take Action Now')}
            >
              Take Action Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {content.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {content.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Stats (for debugging) */}
      {process.env.NODE_ENV === 'development' && user && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Engagement Stats (Dev)</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div>Time Spent: {trackingData.timeSpent}s</div>
            <div>Scroll Depth: {Math.round(trackingData.scrollDepth * 100)}%</div>
            <div>Interactions: {trackingData.interactions}</div>
            <div>Engagement Score: {trackingData.engagementScore}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ContentViewer