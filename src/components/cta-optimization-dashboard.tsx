'use client'

import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { abTestingService } from '../lib/ab-testing-framework'
import { psychologicalTriggersService } from '../lib/psychological-triggers'

interface CTAOptimizationDashboardProps {
  className?: string
}

interface TestResult {
  testId: string
  name: string
  status: string
  variants: {
    id: string
    name: string
    metrics: {
      impressions: number
      clicks: number
      conversions: number
      conversionRate: number
      statisticalSignificance: number
    }
    isWinner: boolean
  }[]
  totalImpressions: number
  totalConversions: number
  overallConversionRate: number
}

export function CTAOptimizationDashboard({ className = '' }: CTAOptimizationDashboardProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [triggerAnalytics, setTriggerAnalytics] = useState<Record<string, any>>({})
  const [, setSelectedTest] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load test results and analytics
  useEffect(() => {
    const loadData = () => {
      // Get A/B test results
      const activeTests = abTestingService.getActiveTests()
      const results = activeTests.map(test => abTestingService.exportResults(test.testId)).filter(Boolean)
      setTestResults(results)

      // Get psychological trigger analytics
      const analytics = psychologicalTriggersService.getTriggerAnalytics()
      setTriggerAnalytics(analytics)
    }

    loadData()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    
    return () => clearInterval(interval)
  }, [refreshKey])

  // Refresh data manually
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get significance color
  const getSignificanceColor = (significance: number) => {
    if (significance >= 0.95) return 'text-green-600 font-semibold'
    if (significance >= 0.90) return 'text-yellow-600 font-medium'
    return 'text-gray-600'
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  // Format number with commas
  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  return (
    <div className={`cta-optimization-dashboard space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CTA Optimization Dashboard</h2>
          <p className="text-gray-600">Monitor A/B tests and psychological trigger effectiveness</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Active Tests</div>
          <div className="text-2xl font-bold text-blue-600">
            {testResults.filter(t => t.status === 'active').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Impressions</div>
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(testResults.reduce((sum, t) => sum + t.totalImpressions, 0))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Conversions</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(testResults.reduce((sum, t) => sum + t.totalConversions, 0))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Avg Conversion Rate</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatPercentage(
              testResults.reduce((sum, t) => sum + t.overallConversionRate, 0) / 
              Math.max(testResults.length, 1)
            )}
          </div>
        </Card>
      </div>

      {/* A/B Test Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">A/B Test Results</h3>
        
        {testResults.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No A/B test results available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Tests will appear here once they have sufficient data.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {testResults.map((test) => (
              <Card key={test.testId} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{test.name}</h4>
                    <p className="text-sm text-gray-600">Test ID: {test.testId}</p>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Impressions</div>
                    <div className="text-lg font-semibold">{formatNumber(test.totalImpressions)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Conversions</div>
                    <div className="text-lg font-semibold">{formatNumber(test.totalConversions)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Overall Conversion Rate</div>
                    <div className="text-lg font-semibold">{formatPercentage(test.overallConversionRate)}</div>
                  </div>
                </div>

                {/* Variants */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Variants Performance</h5>
                  <div className="grid gap-3">
                    {test.variants.map((variant) => (
                      <div 
                        key={variant.id} 
                        className={`p-3 rounded-lg border ${
                          variant.isWinner ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{variant.name}</span>
                            {variant.isWinner && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Winner
                              </Badge>
                            )}
                          </div>
                          <div className={getSignificanceColor(variant.metrics.statisticalSignificance)}>
                            {formatPercentage(variant.metrics.statisticalSignificance)} confidence
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Impressions</div>
                            <div className="font-medium">{formatNumber(variant.metrics.impressions)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Clicks</div>
                            <div className="font-medium">{formatNumber(variant.metrics.clicks)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Conversions</div>
                            <div className="font-medium">{formatNumber(variant.metrics.conversions)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Conv. Rate</div>
                            <div className="font-medium">{formatPercentage(variant.metrics.conversionRate)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Psychological Triggers Analytics */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Psychological Triggers Performance</h3>
        
        {Object.keys(triggerAnalytics).length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No psychological trigger data available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Data will appear here as users interact with triggers.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(triggerAnalytics).map(([triggerType, data]: [string, any]) => (
              <Card key={triggerType} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {triggerType.replace('-', ' ')}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {data.avgIntensity ? `${data.avgIntensity} intensity` : 'No data'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shown</span>
                    <span className="font-medium">{formatNumber(data.totalShown || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clicked</span>
                    <span className="font-medium">{formatNumber(data.totalClicked || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click Rate</span>
                    <span className="font-medium">
                      {data.totalShown > 0 ? formatPercentage(data.totalClicked / data.totalShown) : '0%'}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar for click rate */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: data.totalShown > 0 ? 
                          `${Math.min(100, (data.totalClicked / data.totalShown) * 100)}%` : 
                          '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
        <div className="space-y-3">
          {testResults.length === 0 ? (
            <p className="text-gray-600">Start running A/B tests to get optimization recommendations.</p>
          ) : (
            <>
              {testResults.some(t => t.variants.some(v => v.metrics.statisticalSignificance >= 0.95)) && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✅ You have statistically significant winners!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Consider implementing the winning variants and starting new tests.
                  </p>
                </div>
              )}
              
              {testResults.some(t => t.totalImpressions < 1000) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">⚠️ Some tests need more data</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Wait for more impressions before making decisions on tests with low sample sizes.
                  </p>
                </div>
              )}
              
              {testResults.some(t => t.overallConversionRate < 0.05) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">💡 Consider testing more aggressive variants</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Low conversion rates suggest you might need stronger psychological triggers or better value propositions.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CTAOptimizationDashboard