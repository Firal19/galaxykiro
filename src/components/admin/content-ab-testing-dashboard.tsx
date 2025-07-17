'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
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

interface ContentABTestingDashboardProps {
  contents: ContentModel[]
}

interface ABTest {
  id: string
  name: string
  status: 'active' | 'completed' | 'draft'
  startDate: string
  endDate?: string
  variants: ABTestVariant[]
  targetMetric: 'engagement' | 'conversion' | 'completion' | 'time-on-page'
  targetAudience: 'all' | 'new-visitors' | 'returning-visitors' | 'soft-members'
  sampleSize: number
  confidenceLevel: number
}

interface ABTestVariant {
  id: string
  name: string
  contentId?: string
  type: 'title' | 'hook' | 'cta' | 'content-format' | 'image'
  value: string
  impressions: number
  conversions: number
  conversionRate: number
}

export function ContentABTestingDashboard({ contents }: ContentABTestingDashboardProps) {
  const [activeTests, setActiveTests] = useState<ABTest[]>([])
  const [completedTests, setCompletedTests] = useState<ABTest[]>([])
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  
  // Load A/B tests
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true)
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        const mockTests: ABTest[] = [
          {
            id: 'test-1',
            name: 'Hero Section Hook Variations',
            status: 'active',
            startDate: '2024-07-10T00:00:00Z',
            variants: [
              {
                id: 'variant-1',
                name: 'Original',
                type: 'hook',
                value: 'What if you\'re only using 10% of your true potential?',
                impressions: 1245,
                conversions: 187,
                conversionRate: 15.02
              },
              {
                id: 'variant-2',
                name: 'Question Focus',
                type: 'hook',
                value: 'Are you ready to discover your hidden 90%?',
                impressions: 1267,
                conversions: 203,
                conversionRate: 16.02
              },
              {
                id: 'variant-3',
                name: 'Benefit Focus',
                type: 'hook',
                value: 'Unlock the 90% of your potential that most people never discover',
                impressions: 1289,
                conversions: 232,
                conversionRate: 18.00
              }
            ],
            targetMetric: 'conversion',
            targetAudience: 'all',
            sampleSize: 3801,
            confidenceLevel: 95
          },
          {
            id: 'test-2',
            name: 'Success Gap CTA Variations',
            status: 'active',
            startDate: '2024-07-05T00:00:00Z',
            variants: [
              {
                id: 'variant-1',
                name: 'Original',
                type: 'cta',
                value: 'Calculate Your Success Score',
                impressions: 876,
                conversions: 98,
                conversionRate: 11.19
              },
              {
                id: 'variant-2',
                name: 'Curiosity',
                type: 'cta',
                value: 'See What\'s Holding You Back',
                impressions: 891,
                conversions: 124,
                conversionRate: 13.92
              }
            ],
            targetMetric: 'conversion',
            targetAudience: 'new-visitors',
            sampleSize: 1767,
            confidenceLevel: 90
          },
          {
            id: 'test-3',
            name: 'Content Format Comparison',
            status: 'completed',
            startDate: '2024-06-15T00:00:00Z',
            endDate: '2024-07-01T00:00:00Z',
            variants: [
              {
                id: 'variant-1',
                name: 'Text Only',
                type: 'content-format',
                value: 'Text article with no visuals',
                contentId: contents[0]?.id,
                impressions: 1432,
                conversions: 187,
                conversionRate: 13.06
              },
              {
                id: 'variant-2',
                name: 'Text with Images',
                type: 'content-format',
                value: 'Text article with supporting images',
                contentId: contents[1]?.id,
                impressions: 1456,
                conversions: 203,
                conversionRate: 13.94
              },
              {
                id: 'variant-3',
                name: 'Text with Video',
                type: 'content-format',
                value: 'Text article with embedded video',
                contentId: contents[2]?.id,
                impressions: 1478,
                conversions: 259,
                conversionRate: 17.52
              }
            ],
            targetMetric: 'engagement',
            targetAudience: 'all',
            sampleSize: 4366,
            confidenceLevel: 99
          },
          {
            id: 'test-4',
            name: 'Title Variations for Habit Article',
            status: 'completed',
            startDate: '2024-06-01T00:00:00Z',
            endDate: '2024-06-15T00:00:00Z',
            variants: [
              {
                id: 'variant-1',
                name: 'Original',
                type: 'title',
                value: 'How to Build Better Habits in 21 Days',
                impressions: 2134,
                conversions: 298,
                conversionRate: 13.96
              },
              {
                id: 'variant-2',
                name: 'Question',
                type: 'title',
                value: 'Why Do Your Habits Fail? The Science of Lasting Change',
                impressions: 2187,
                conversions: 371,
                conversionRate: 16.96
              },
              {
                id: 'variant-3',
                name: 'Number',
                type: 'title',
                value: '7 Proven Steps to Make Any Habit Stick Forever',
                impressions: 2156,
                conversions: 345,
                conversionRate: 16.00
              }
            ],
            targetMetric: 'engagement',
            targetAudience: 'all',
            sampleSize: 6477,
            confidenceLevel: 95
          }
        ]
        
        setActiveTests(mockTests.filter(test => test.status === 'active'))
        setCompletedTests(mockTests.filter(test => test.status === 'completed'))
        
        // Set first active test as selected by default
        if (mockTests.find(test => test.status === 'active')) {
          setSelectedTest(mockTests.find(test => test.status === 'active') || null)
        } else if (mockTests.length > 0) {
          setSelectedTest(mockTests[0])
        }
      } catch (error) {
        console.error('Error fetching A/B tests:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTests()
  }, [contents])
  
  // Handle test selection
  const handleSelectTest = (testId: string) => {
    const test = [...activeTests, ...completedTests].find(t => t.id === testId)
    if (test) {
      setSelectedTest(test)
    }
  }
  
  // Calculate winner variant
  const getWinnerVariant = (test: ABTest): ABTestVariant | null => {
    if (test.variants.length === 0) return null
    
    return test.variants.reduce((winner, current) => 
      current.conversionRate > winner.conversionRate ? current : winner
    , test.variants[0])
  }
  
  // Calculate improvement percentage
  const calculateImprovement = (test: ABTest): number => {
    const winner = getWinnerVariant(test)
    const original = test.variants.find(v => v.name === 'Original')
    
    if (!winner || !original || winner.id === original.id) return 0
    
    return ((winner.conversionRate - original.conversionRate) / original.conversionRate) * 100
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Get status badge color
  const getStatusColor = (status: 'active' | 'completed' | 'draft'): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Create new test
  const handleCreateTest = () => {
    // In a real implementation, this would open a form to create a new test
    console.log('Create new A/B test')
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Testing Dashboard</h2>
        <Button onClick={handleCreateTest}>Create New Test</Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading A/B testing data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Active Tests</h3>
              
              {activeTests.length === 0 ? (
                <p className="text-gray-500 text-center py-2">No active tests</p>
              ) : (
                <div className="space-y-3">
                  {activeTests.map(test => (
                    <div 
                      key={test.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTest?.id === test.id ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => handleSelectTest(test.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            Started {formatDate(test.startDate)}
                          </div>
                        </div>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <h3 className="font-semibold mb-4 mt-6">Completed Tests</h3>
              
              {completedTests.length === 0 ? (
                <p className="text-gray-500 text-center py-2">No completed tests</p>
              ) : (
                <div className="space-y-3">
                  {completedTests.map(test => (
                    <div 
                      key={test.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTest?.id === test.id ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => handleSelectTest(test.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            {test.endDate && `Completed ${formatDate(test.endDate)}`}
                          </div>
                        </div>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                      
                      {test.status === 'completed' && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-green-600">
                            +{calculateImprovement(test).toFixed(1)}% improvement
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
          
          {/* Test Details */}
          <div className="lg:col-span-2">
            {selectedTest ? (
              <Card className="p-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedTest.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={getStatusColor(selectedTest.status)}>
                        {selectedTest.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Started {formatDate(selectedTest.startDate)}
                      </span>
                      {selectedTest.endDate && (
                        <span className="text-sm text-gray-500">
                          Ended {formatDate(selectedTest.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {selectedTest.status === 'active' && (
                    <Button variant="outline">End Test</Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">Target Metric</div>
                    <div className="font-medium capitalize">{selectedTest.targetMetric.replace('-', ' ')}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">Target Audience</div>
                    <div className="font-medium capitalize">{selectedTest.targetAudience.replace('-', ' ')}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">Sample Size</div>
                    <div className="font-medium">{selectedTest.sampleSize.toLocaleString()}</div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-3">Variants</h4>
                
                <div className="space-y-4">
                  {selectedTest.variants.map(variant => {
                    const isWinner = selectedTest.status === 'completed' && 
                      getWinnerVariant(selectedTest)?.id === variant.id
                    
                    return (
                      <div 
                        key={variant.id}
                        className={`border rounded-md p-4 ${isWinner ? 'border-green-500 bg-green-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{variant.name}</h5>
                              {isWinner && (
                                <Badge className="bg-green-100 text-green-800">Winner</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {variant.type === 'content-format' && variant.contentId ? (
                                <span>Content ID: {variant.contentId}</span>
                              ) : (
                                <span>Type: {variant.type}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {variant.conversionRate.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">
                              {variant.conversions} / {variant.impressions}
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="text-sm font-medium mb-1">Value:</div>
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            {variant.value}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Conversion Rate</span>
                            <span>{variant.conversionRate.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={variant.conversionRate} 
                            max={Math.max(...selectedTest.variants.map(v => v.conversionRate)) * 1.2} 
                            className={`h-2 ${isWinner ? 'bg-green-600' : ''}`} 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {selectedTest.status === 'completed' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-semibold mb-2">Test Results</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Winning Variant:</span>
                        <span className="font-medium">{getWinnerVariant(selectedTest)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Improvement:</span>
                        <span className="font-medium text-green-600">
                          +{calculateImprovement(selectedTest).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Level:</span>
                        <span className="font-medium">{selectedTest.confidenceLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sample Size:</span>
                        <span className="font-medium">{selectedTest.sampleSize.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500">Select a test to view details</h3>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}