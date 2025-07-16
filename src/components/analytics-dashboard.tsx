'use client'

import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { useRealTimeAnalytics } from '../lib/hooks/use-real-time-analytics'

interface AnalyticsDashboardProps {
  userId?: string
  sessionId?: string
  isAdmin?: boolean
}

interface JourneyAnalytics {
  sessionDuration: number
  pageViews: number
  sectionsViewed: string[]
  toolsInteracted: string[]
  ctasClicked: string[]
  contentEngaged: string[]
  scrollDepth: number
  timeOnPage: Record<string, number>
  engagementScore: number
  conversionEvents: string[]
}

interface ConversionMetrics {
  totalVisitors: number
  browserToEngaged: number
  engagedToSoftMember: number
  conversionRate: number
  averageEngagementScore: number
  topPerformingCTAs: Array<{ id: string; clicks: number; conversionRate: number }>
  topPerformingTools: Array<{ name: string; completions: number; engagementScore: number }>
}

interface BehavioralPattern {
  pattern: string
  frequency: number
  conversionRate: number
  averageEngagementScore: number
  recommendedOptimizations: string[]
}

interface KPIData {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topTrafficSources: Array<{ source: string; visitors: number; conversionRate: number }>
  tierDistribution: { browser: number; engaged: number; softMember: number }
}

export function AnalyticsDashboard({ userId, sessionId, isAdmin = false }: AnalyticsDashboardProps) {
  const [journeyAnalytics, setJourneyAnalytics] = useState<JourneyAnalytics | null>(null)
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics | null>(null)
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([])
  const [kpiData, setKPIData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'journey' | 'conversion' | 'patterns' | 'kpis'>('journey')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')

  useEffect(() => {
    loadAnalyticsData()
  }, [userId, sessionId, timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Load journey analytics
      if (userId || sessionId) {
        const journeyResponse = await fetch(`/.netlify/functions/track-user-journey?${userId ? `userId=${userId}` : `sessionId=${sessionId}`}`)
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json()
          setJourneyAnalytics(journeyData.data.journeyAnalytics)
        }
      }

      // Load conversion metrics (admin only)
      if (isAdmin) {
        const [conversionResponse, patternsResponse, kpiResponse] = await Promise.all([
          fetch(`/.netlify/functions/analytics-dashboard?type=conversion&timeRange=${timeRange}`),
          fetch(`/.netlify/functions/analytics-dashboard?type=patterns&timeRange=${timeRange}`),
          fetch(`/.netlify/functions/analytics-dashboard?type=kpis&timeRange=${timeRange}`)
        ])

        if (conversionResponse.ok) {
          const conversionData = await conversionResponse.json()
          setConversionMetrics(conversionData.data)
        }

        if (patternsResponse.ok) {
          const patternsData = await patternsResponse.json()
          setBehavioralPatterns(patternsData.data)
        }

        if (kpiResponse.ok) {
          const kpiResponseData = await kpiResponse.json()
          setKPIData(kpiResponseData.data)
        }
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'browser': return 'bg-gray-100 text-gray-800'
      case 'engaged': return 'bg-blue-100 text-blue-800'
      case 'soft-member': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEngagementLevel = (score: number): { level: string; color: string } => {
    if (score >= 70) return { level: 'High', color: 'text-green-600' }
    if (score >= 30) return { level: 'Medium', color: 'text-yellow-600' }
    return { level: 'Low', color: 'text-red-600' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">
            {userId ? 'User Journey Analytics' : sessionId ? 'Session Analytics' : 'Platform Overview'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button onClick={loadAnalyticsData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'journey', label: 'Journey Analytics', show: true },
            { id: 'conversion', label: 'Conversion Metrics', show: isAdmin },
            { id: 'patterns', label: 'Behavioral Patterns', show: isAdmin },
            { id: 'kpis', label: 'Key Performance Indicators', show: isAdmin }
          ].filter(tab => tab.show).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Journey Analytics Tab */}
      {activeTab === 'journey' && journeyAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Session Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Session Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatDuration(journeyAnalytics.sessionDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Page Views:</span>
                <span className="font-medium">{journeyAnalytics.pageViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scroll Depth:</span>
                <span className="font-medium">{journeyAnalytics.scrollDepth}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Engagement:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{journeyAnalytics.engagementScore}</span>
                  <Badge className={getEngagementLevel(journeyAnalytics.engagementScore).color}>
                    {getEngagementLevel(journeyAnalytics.engagementScore).level}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Sections Viewed */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sections Explored</h3>
            <div className="space-y-2">
              {journeyAnalytics.sectionsViewed.length > 0 ? (
                journeyAnalytics.sectionsViewed.map((section, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {section.replace('-', ' ')}
                    </span>
                    <Badge variant="outline">Viewed</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No sections viewed yet</p>
              )}
            </div>
          </Card>

          {/* Tools Interaction */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tools Used</h3>
            <div className="space-y-2">
              {journeyAnalytics.toolsInteracted.length > 0 ? (
                journeyAnalytics.toolsInteracted.map((tool, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{tool}</span>
                    <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tools used yet</p>
              )}
            </div>
          </Card>

          {/* CTAs Clicked */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">CTAs Engaged</h3>
            <div className="space-y-2">
              {journeyAnalytics.ctasClicked.length > 0 ? (
                journeyAnalytics.ctasClicked.map((cta, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cta}</span>
                    <Badge className="bg-orange-100 text-orange-800">Clicked</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No CTAs clicked yet</p>
              )}
            </div>
          </Card>

          {/* Content Engagement */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Consumed</h3>
            <div className="space-y-2">
              {journeyAnalytics.contentEngaged.length > 0 ? (
                journeyAnalytics.contentEngaged.map((content, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{content}</span>
                    <Badge className="bg-green-100 text-green-800">Read</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No content engaged yet</p>
              )}
            </div>
          </Card>

          {/* Conversion Events */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Events</h3>
            <div className="space-y-2">
              {journeyAnalytics.conversionEvents.length > 0 ? (
                journeyAnalytics.conversionEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {event.replace('_', ' ').replace(':', ': ')}
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">Converted</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No conversions yet</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Conversion Metrics Tab */}
      {activeTab === 'conversion' && isAdmin && conversionMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Conversion */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Conversion</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Browser → Engaged</span>
                  <span className="text-sm font-medium">{conversionMetrics.browserToEngaged}</span>
                </div>
                <Progress value={(conversionMetrics.browserToEngaged / conversionMetrics.totalVisitors) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Engaged → Soft Member</span>
                  <span className="text-sm font-medium">{conversionMetrics.engagedToSoftMember}</span>
                </div>
                <Progress value={(conversionMetrics.engagedToSoftMember / conversionMetrics.totalVisitors) * 100} />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Rate:</span>
                  <span className="font-medium text-lg">{formatPercentage(conversionMetrics.conversionRate)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Performing CTAs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing CTAs</h3>
            <div className="space-y-3">
              {conversionMetrics.topPerformingCTAs.map((cta, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cta.id}</p>
                    <p className="text-xs text-gray-500">{cta.clicks} clicks</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {formatPercentage(cta.conversionRate)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Tools */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Tools</h3>
            <div className="space-y-3">
              {conversionMetrics.topPerformingTools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.completions} completions</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {tool.engagementScore} pts
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Behavioral Patterns Tab */}
      {activeTab === 'patterns' && isAdmin && (
        <div className="space-y-6">
          {behavioralPatterns.map((pattern, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{pattern.pattern}</h3>
                  <p className="text-sm text-gray-600">
                    Frequency: {pattern.frequency} users • 
                    Conversion Rate: {formatPercentage(pattern.conversionRate)} • 
                    Avg Engagement: {pattern.averageEngagementScore} pts
                  </p>
                </div>
                <Badge className={pattern.conversionRate > 0.1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {pattern.conversionRate > 0.1 ? 'High Converting' : 'Needs Optimization'}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recommended Optimizations:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {pattern.recommendedOptimizations.map((optimization, optIndex) => (
                    <li key={optIndex} className="text-sm text-gray-600">{optimization}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpis' && isAdmin && kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-blue-600">{kpiData.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{kpiData.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{kpiData.newUsersToday}</p>
                <p className="text-sm text-gray-600">New Today</p>
              </div>
            </div>
          </Card>

          {/* Engagement Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement</h3>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-orange-600">{formatPercentage(kpiData.conversionRate)}</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{formatDuration(kpiData.averageSessionDuration)}</p>
                <p className="text-sm text-gray-600">Avg Session</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{formatPercentage(kpiData.bounceRate)}</p>
                <p className="text-sm text-gray-600">Bounce Rate</p>
              </div>
            </div>
          </Card>

          {/* Tier Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Tiers</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Browser</span>
                <Badge className={getTierColor('browser')}>{kpiData.tierDistribution.browser}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engaged</span>
                <Badge className={getTierColor('engaged')}>{kpiData.tierDistribution.engaged}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Soft Member</span>
                <Badge className={getTierColor('soft-member')}>{kpiData.tierDistribution.softMember}</Badge>
              </div>
            </div>
          </Card>

          {/* Traffic Sources */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Traffic Sources</h3>
            <div className="space-y-3">
              {kpiData.topTrafficSources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{source.source}</p>
                    <p className="text-xs text-gray-500">{source.visitors} visitors</p>
                  </div>
                  <Badge variant="outline">{formatPercentage(source.conversionRate)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}