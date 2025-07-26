'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  ContentModel, 
  ContentCategory, 
  CONTENT_CATEGORIES 
} from '../../lib/models/content'
import { contentReviewService, ContentMetrics } from '../../lib/content-review-service'

interface ContentAnalyticsProps {
  contents: ContentModel[]
}

interface ContentPerformance extends ContentMetrics {
  title: string
  category: ContentCategory
  depthLevel: string
  contentType: string
}

export function ContentAnalytics({ contents }: ContentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<string>('30days')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('engagement')
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [overallStats, setOverallStats] = useState({
    totalViews: 0,
    averageEngagement: 0,
    averageRating: 0,
    conversionRate: 0
  })
  
  // Fetch content metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      
      try {
        // Use real content review service
        const performance = await Promise.all(
          contents
            .filter(content => categoryFilter === 'all' || content.category === categoryFilter)
            .map(async content => {
              const metrics = await contentReviewService.getContentMetrics(content.id) || {
                contentId: content.id,
                contentType: content.contentType,
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                tagFrequency: {},
                engagementScore: 0,
                verifiedReviewsCount: 0,
                totalHelpfulVotes: 0,
                reportedReviewsCount: 0,
                lastReviewAt: new Date().toISOString()
              }
              
              return {
                ...metrics,
                title: content.title,
                category: content.category,
                depthLevel: content.depthLevel,
                contentType: content.contentType
              }
            })
        )
        
        // Sort content performance
        let sortedPerformance = [...performance]
        
        if (sortBy === 'engagement') {
          sortedPerformance.sort((a, b) => b.engagementScore - a.engagementScore)
        } else if (sortBy === 'rating') {
          sortedPerformance.sort((a, b) => b.averageRating - a.averageRating)
        } else if (sortBy === 'views') {
          sortedPerformance.sort((a, b) => b.totalReviews - a.totalReviews)
        } else if (sortBy === 'completion') {
          sortedPerformance.sort((a, b) => ((b as any).completionRate || 0) - ((a as any).completionRate || 0))
        }
        
        setContentPerformance(sortedPerformance)
        
        // Calculate overall stats
        const totalViews = sortedPerformance.reduce((sum, item) => sum + item.totalReviews, 0)
        const averageEngagement = sortedPerformance.reduce((sum, item) => sum + item.engagementScore, 0) / 
          (sortedPerformance.length || 1)
        const averageRating = sortedPerformance.reduce((sum, item) => sum + item.averageRating, 0) / 
          (sortedPerformance.length || 1)
        const conversionRate = sortedPerformance.reduce((sum, item) => sum + (item.engagementScore > 70 ? 1 : 0), 0) / 
          (sortedPerformance.length || 1) * 100
        
        setOverallStats({
          totalViews,
          averageEngagement,
          averageRating,
          conversionRate
        })
      } catch (error) {
        console.error('Error fetching content metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMetrics()
  }, [contents, categoryFilter, sortBy, timeRange])
  
  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  // Get progress color based on score
  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-600'
    if (score >= 60) return 'bg-blue-600'
    if (score >= 40) return 'bg-yellow-600'
    return 'bg-red-600'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => (
                <SelectItem key={id} value={id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="completion">Completion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold">{overallStats.totalViews.toLocaleString()}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Engagement</h3>
          <p className="text-2xl font-bold">{overallStats.averageEngagement.toFixed(1)}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <p className="text-2xl font-bold">{overallStats.averageRating.toFixed(1)}/5</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold">{overallStats.conversionRate.toFixed(1)}%</p>
        </Card>
      </div>
      
      {/* Content Performance Table */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
        
        {loading ? (
          <div className="text-center py-8">Loading analytics data...</div>
        ) : contentPerformance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No content data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Content</th>
                  <th className="text-center py-3 px-4">Views</th>
                  <th className="text-center py-3 px-4">Engagement</th>
                  <th className="text-center py-3 px-4">Rating</th>
                  <th className="text-center py-3 px-4">Completion</th>
                </tr>
              </thead>
              <tbody>
                {contentPerformance.map((item, index) => (
                  <tr key={item.contentId} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {CONTENT_CATEGORIES[item.category].name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.contentType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.depthLevel}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {item.totalReviews}
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className={`font-medium ${getScoreColor(item.engagementScore)}`}>
                          {Math.round(item.engagementScore)}
                        </span>
                        <Progress 
                          value={item.engagementScore} 
                          max={100} 
                          className={`h-1 w-16 mt-1 ${getProgressColor(item.engagementScore)}`} 
                        />
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className={`font-medium ${getScoreColor(item.averageRating * 20)}`}>
                          {item.averageRating.toFixed(1)}
                        </span>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star} 
                              className={`text-xs ${star <= Math.round(item.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className={`font-medium ${getScoreColor((item as any).completionRate * 100 || 0)}`}>
                          {Math.round((item as any).completionRate * 100 || 0)}%
                        </span>
                        <Progress 
                          value={(item as any).completionRate * 100 || 0} 
                          max={100} 
                          className={`h-1 w-16 mt-1 ${getProgressColor((item as any).completionRate * 100 || 0)}`} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Category Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          
          <div className="space-y-4">
            {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => {
              const categoryContents = contentPerformance.filter(item => item.category === id)
              const avgEngagement = categoryContents.reduce((sum, item) => sum + item.engagementScore, 0) / 
                (categoryContents.length || 1)
              
              return (
                <div key={id} className="flex items-center">
                  <div className="w-1/3">
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="w-2/3">
                    <div className="flex items-center">
                      <Progress 
                        value={avgEngagement} 
                        max={100} 
                        className={`h-2 flex-1 ${getProgressColor(avgEngagement)}`} 
                      />
                      <span className={`ml-2 font-medium ${getScoreColor(avgEngagement)}`}>
                        {Math.round(avgEngagement)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Content Type Performance</h3>
          
          <div className="space-y-4">
            {['article', 'video', 'tool', 'guide', 'template', 'audio'].map(type => {
              const typeContents = contentPerformance.filter(item => item.contentType === type)
              const avgEngagement = typeContents.reduce((sum, item) => sum + item.engagementScore, 0) / 
                (typeContents.length || 1)
              
              return (
                <div key={type} className="flex items-center">
                  <div className="w-1/3">
                    <span className="font-medium capitalize">{type}s</span>
                  </div>
                  <div className="w-2/3">
                    <div className="flex items-center">
                      <Progress 
                        value={avgEngagement} 
                        max={100} 
                        className={`h-2 flex-1 ${getProgressColor(avgEngagement)}`} 
                      />
                      <span className={`ml-2 font-medium ${getScoreColor(avgEngagement)}`}>
                        {Math.round(avgEngagement) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}