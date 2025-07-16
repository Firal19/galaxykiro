'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Clock, Lock, Unlock, Eye, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  ContentModel, 
  ContentLibrary as ContentLibraryClass, 
  ContentCategory, 
  ContentDepthLevel, 
  ContentType,
  SearchFilters,
  CONTENT_CATEGORIES 
} from '../lib/models/content'
import { UserModel } from '../lib/models/user'

interface ContentLibraryProps {
  user?: UserModel
  initialCategory?: ContentCategory
  showSearch?: boolean
  showFilters?: boolean
  maxItems?: number
  className?: string
  onContentView?: (content: ContentModel) => void
}

interface ContentCardProps {
  content: ContentModel
  user?: UserModel
  onView: (content: ContentModel) => void
  onTrackEngagement: (contentId: string, action: string) => void
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  user, 
  onView, 
  onTrackEngagement 
}) => {
  const canAccess = user ? content.canUserAccess(user.captureLevel) : false
  const categoryInfo = CONTENT_CATEGORIES[content.category]

  const handleClick = () => {
    if (canAccess) {
      onView(content)
      onTrackEngagement(content.id, 'view')
    }
  }

  const getDepthLevelColor = (level: ContentDepthLevel) => {
    switch (level) {
      case 'surface': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'deep': return 'bg-purple-100 text-purple-800'
    }
  }

  const getDepthLevelLabel = (level: ContentDepthLevel) => {
    switch (level) {
      case 'surface': return 'Quick Read'
      case 'medium': return 'Deep Dive'
      case 'deep': return 'Masterclass'
    }
  }

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
        !canAccess ? 'opacity-75' : 'hover:scale-[1.02]'
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{categoryInfo.icon}</span>
              <Badge variant="outline" className={getDepthLevelColor(content.depthLevel)}>
                {getDepthLevelLabel(content.depthLevel)}
              </Badge>
              {!canAccess && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  <Lock className="w-3 h-3 mr-1" />
                  Level {content.requiredCaptureLevel}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {content.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {content.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Hook Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 italic line-clamp-2">
              &ldquo;{content.hook}&rdquo;
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{content.estimatedReadTime} min read</span>
              </div>
              {content.viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{content.viewCount} views</span>
                </div>
              )}
              {content.engagementRate > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{Math.round(content.engagementRate * 100)}% engaged</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span>{categoryInfo.name}</span>
            </div>
          </div>

          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {content.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{content.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Access Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {canAccess ? (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Unlock className="w-4 h-4" />
                  <span>Available</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Requires Level {content.requiredCaptureLevel}</span>
                </div>
              )}
            </div>
            
            {canAccess && (
              <Button size="sm" variant="outline" className="text-xs">
                Read Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CategoryFilter: React.FC<{
  categories: ContentCategory[]
  selectedCategory?: ContentCategory
  onCategoryChange: (category?: ContentCategory) => void
}> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedCategory ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(undefined)}
        className="text-xs"
      >
        All Categories
      </Button>
      {categories.map(category => {
        const categoryInfo = CONTENT_CATEGORIES[category]
        return (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="text-xs"
          >
            <span className="mr-1">{categoryInfo.icon}</span>
            {categoryInfo.name}
          </Button>
        )
      })}
    </div>
  )
}

const DepthLevelFilter: React.FC<{
  selectedDepth?: ContentDepthLevel
  onDepthChange: (depth?: ContentDepthLevel) => void
}> = ({ selectedDepth, onDepthChange }) => {
  const depthLevels: { value: ContentDepthLevel; label: string; description: string }[] = [
    { value: 'surface', label: 'Quick Read', description: '3-5 min articles' },
    { value: 'medium', label: 'Deep Dive', description: '7-15 min guides' },
    { value: 'deep', label: 'Masterclass', description: '15+ min comprehensive content' }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedDepth ? "default" : "outline"}
        size="sm"
        onClick={() => onDepthChange(undefined)}
        className="text-xs"
      >
        All Depths
      </Button>
      {depthLevels.map(depth => (
        <Button
          key={depth.value}
          variant={selectedDepth === depth.value ? "default" : "outline"}
          size="sm"
          onClick={() => onDepthChange(depth.value)}
          className="text-xs"
          title={depth.description}
        >
          {depth.label}
        </Button>
      ))}
    </div>
  )
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({
  user,
  initialCategory,
  showSearch = true,
  showFilters = true,
  maxItems,
  className = '',
  onContentView
}) => {
  const [contentLibrary] = useState(() => new ContentLibraryClass())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | undefined>(initialCategory)
  const [selectedDepth, setSelectedDepth] = useState<ContentDepthLevel | undefined>()
  const [selectedContentType, setSelectedContentType] = useState<ContentType | undefined>()
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // Get available categories from content
  const availableCategories = useMemo(() => {
    const categories = new Set<ContentCategory>()
    contentLibrary.getAll().forEach(content => categories.add(content.category))
    return Array.from(categories)
  }, [contentLibrary])

  // Filter content based on current filters
  const filteredContent = useMemo(() => {
    const filters: SearchFilters = {
      searchQuery: searchQuery || undefined,
      category: selectedCategory,
      depthLevel: selectedDepth,
      contentType: selectedContentType,
      requiredCaptureLevel: user ? (user.captureLevel as 1 | 2 | 3) : 1
    }

    let results = contentLibrary.search(filters)
    
    if (maxItems) {
      results = results.slice(0, maxItems)
    }

    return results
  }, [
    contentLibrary, 
    searchQuery, 
    selectedCategory, 
    selectedDepth, 
    selectedContentType, 
    user, 
    maxItems
  ])

  // Get content stats
  const stats = useMemo(() => contentLibrary.getStats(), [contentLibrary])

  // Handle content view
  const handleContentView = async (content: ContentModel) => {
    if (user) {
      try {
        await content.trackView(user.id)
      } catch (error) {
        console.error('Error tracking content view:', error)
      }
    }
    
    // Use provided onContentView callback or default behavior
    if (onContentView) {
      onContentView(content)
    } else {
      // Navigate to content page or open modal
      // This would typically navigate to /content/[slug] or open a modal
      console.log('Viewing content:', content.slug)
    }
  }

  // Handle engagement tracking
  const handleEngagementTracking = async (contentId: string, action: string) => {
    if (user) {
      try {
        // Track engagement action
        console.log('Tracking engagement:', { contentId, action, userId: user.id })
      } catch (error) {
        console.error('Error tracking engagement:', error)
      }
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Content Library</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover curated content designed to unlock your potential, transform your habits, 
          and accelerate your personal growth journey.
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span>{stats.totalContent} articles</span>
          <span>•</span>
          <span>{availableCategories.length} categories</span>
          <span>•</span>
          <span>Personalized for Level {user?.captureLevel || 1}</span>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Filter Toggle */}
          {showFilters && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="text-xs"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategory || selectedDepth || selectedContentType) && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Active
                  </Badge>
                )}
              </Button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && showFiltersPanel && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                <CategoryFilter
                  categories={availableCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Content Depth</h4>
                <DepthLevelFilter
                  selectedDepth={selectedDepth}
                  onDepthChange={setSelectedDepth}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(undefined)
                    setSelectedDepth(undefined)
                    setSelectedContentType(undefined)
                    setSearchQuery('')
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Overview */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCategories.map(category => {
            const categoryInfo = CONTENT_CATEGORIES[category]
            const categoryContent = contentLibrary.getByCategory(category)
            const accessibleCount = user 
              ? categoryContent.filter(c => c.canUserAccess(user.captureLevel)).length
              : categoryContent.filter(c => c.requiredCaptureLevel === 1).length

            return (
              <Card 
                key={category}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <div className="text-3xl mb-2">{categoryInfo.icon}</div>
                  <CardTitle className="text-lg">{categoryInfo.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {categoryInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {accessibleCount}
                    </div>
                    <div className="text-sm text-gray-500">
                      Available Articles
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ backgroundColor: categoryInfo.color + '20', color: categoryInfo.color }}
                    >
                      {categoryInfo.tagline}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Content Grid */}
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              user={user}
              onView={handleContentView}
              onTrackEngagement={handleEngagementTracking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory(undefined)
              setSelectedDepth(undefined)
              setSelectedContentType(undefined)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {maxItems && filteredContent.length >= maxItems && (
        <div className="text-center">
          <Button variant="outline">
            Load More Content
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContentLibrary