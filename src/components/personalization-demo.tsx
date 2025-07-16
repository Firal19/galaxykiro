'use client'

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import DynamicCTA from './dynamic-cta'
import { useDynamicPersonalization, useCTAOptimization } from '../lib/hooks/use-dynamic-personalization'
import { useAppStore } from '../lib/store'

export function PersonalizationDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'ctas' | 'testing'>('overview')
  
  const personalization = useDynamicPersonalization({
    enableABTesting: true,
    enableBehavioralTriggers: true,
    maxRecommendations: 5,
    updateInterval: 15,
    trackingEnabled: true
  })

  const ctaOptimization = useCTAOptimization()
  const { setActiveModal } = useAppStore()

  const {
    behavior,
    engagement,
    commitmentEscalation,
    recommendedContent,
    personalizedInsights,
    currentCTAConfig,
    abTests,
    trackEngagement,
    trackConversion,
    triggerBehavioralAction
  } = personalization

  // Demo actions
  const handleDemoAction = async (action: string) => {
    switch (action) {
      case 'simulate-scroll':
        await trackEngagement('scroll_depth', { depth: 75 })
        break
      case 'simulate-tool-use':
        await trackEngagement('tool_usage', { toolId: 'potential-assessment' })
        await triggerBehavioralAction('toolCompleted', { toolId: 'potential-assessment' })
        break
      case 'simulate-content-view':
        await trackEngagement('content_engagement', { contentId: 'potential-myths' })
        break
      case 'simulate-conversion':
        await trackConversion('cta-click', 10)
        break
      default:
        console.log(`Demo action: ${action}`)
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'bg-green-500'
      case 'high': return 'bg-blue-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-300'
    }
  }

  const getCommitmentColor = (level: string) => {
    switch (level) {
      case 'macro': return 'bg-red-500'
      case 'midi': return 'bg-orange-500'
      case 'micro': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  if (!behavior || !engagement) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading personalization data...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dynamic CTA & Personalization Engine</h2>
        <p className="text-gray-600 mb-4">
          Real-time personalization based on user behavior, engagement patterns, and A/B testing.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'content', label: 'Content' },
            { id: 'ctas', label: 'CTAs' },
            { id: 'testing', label: 'A/B Testing' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Behavior */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Behavior</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Session Duration:</span>
                <span className="font-medium">{Math.round(behavior.sessionDuration / 60)}m {behavior.sessionDuration % 60}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scroll Depth:</span>
                <span className="font-medium">{behavior.scrollDepth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sections Viewed:</span>
                <span className="font-medium">{behavior.sectionsViewed.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tools Used:</span>
                <span className="font-medium">{behavior.toolsUsed.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Device:</span>
                <span className="font-medium capitalize">{behavior.deviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time of Day:</span>
                <span className="font-medium capitalize">{behavior.timeOfDay}</span>
              </div>
            </div>
          </Card>

          {/* Engagement Level */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Engagement Score:</span>
                  <span className="font-medium">{engagement.score}/100</span>
                </div>
                <Progress value={engagement.score} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Level:</span>
                <Badge className={`${getEngagementColor(engagement.level)} text-white`}>
                  {engagement.level}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tier:</span>
                <Badge variant="outline">{engagement.tier}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Pattern:</span>
                <Badge variant="secondary">{engagement.behaviorPattern}</Badge>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Readiness:</span>
                  <span className="font-medium">{engagement.readinessIndicator}%</span>
                </div>
                <Progress value={engagement.readinessIndicator} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Commitment Escalation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Commitment Escalation</h3>
            {commitmentEscalation && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Current Level:</span>
                  <Badge className={`${getCommitmentColor(commitmentEscalation.currentLevel)} text-white`}>
                    {commitmentEscalation.currentLevel}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Next Level:</span>
                  <Badge className={`${getCommitmentColor(commitmentEscalation.nextLevel)} text-white`}>
                    {commitmentEscalation.nextLevel}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Readiness Score:</span>
                    <span className="font-medium">{commitmentEscalation.readinessScore}%</span>
                  </div>
                  <Progress value={commitmentEscalation.readinessScore} className="h-2" />
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Recommended Actions:</span>
                  <div className="space-y-1">
                    {commitmentEscalation.recommendedActions.slice(0, 2).map((action, index) => (
                      <div key={index} className="text-xs bg-blue-50 text-blue-700 p-2 rounded">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Personalized Insights */}
          {personalizedInsights && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personalized Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Primary Interest</h4>
                  <p className="text-sm text-gray-600 mb-4">{personalizedInsights.primaryInterest}</p>
                  
                  <h4 className="font-medium mb-2">Next Best Action</h4>
                  <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded">
                    {personalizedInsights.nextBestAction}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Personalized Message</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded italic">
                    "{personalizedInsights.personalizedMessage}"
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recommended Content */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Content</h3>
            {recommendedContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedContent.map((content) => (
                  <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {content.contentType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{content.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge className={`text-xs ${
                          content.depthLevel === 'deep' ? 'bg-red-100 text-red-800' :
                          content.depthLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {content.depthLevel}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {content.estimatedTime}min
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDemoAction('simulate-content-view')}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No content recommendations available</p>
            )}
          </Card>
        </div>
      )}

      {/* CTAs Tab */}
      {activeTab === 'ctas' && (
        <div className="space-y-6">
          {/* Current CTA Configuration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current CTA Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Visual Configuration</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: currentCTAConfig.buttonColor }}
                    ></div>
                    <span className="text-sm">Button Color: {currentCTAConfig.buttonColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: currentCTAConfig.textColor }}
                    ></div>
                    <span className="text-sm">Text Color: {currentCTAConfig.textColor}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content Configuration</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Button Text:</span> "{currentCTAConfig.buttonText}"
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Modal Delay:</span> {currentCTAConfig.modalDelay}s
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Personalized:</span> {currentCTAConfig.personalized ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview CTA */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Preview</h4>
              <Button
                style={{
                  backgroundColor: currentCTAConfig.buttonColor,
                  color: currentCTAConfig.textColor
                }}
                onClick={() => handleDemoAction('simulate-conversion')}
              >
                {currentCTAConfig.buttonText}
              </Button>
            </div>
          </Card>

          {/* Dynamic CTAs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dynamic CTAs</h3>
            <DynamicCTA
              context="demo"
              maxCTAs={4}
              layout="grid"
              showDescription={true}
              showBadges={true}
              onCTAClick={(ctaId, action) => {
                console.log(`CTA clicked: ${ctaId} -> ${action}`)
                handleDemoAction('simulate-conversion')
              }}
            />
          </Card>

          {/* CTA Optimization */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Context-Specific CTAs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['hero', 'assessment', 'content'].map(context => {
                const ctaConfig = ctaOptimization.getCTAForContext(context)
                return (
                  <div key={context} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 capitalize">{context} Section</h4>
                    <Button
                      variant={ctaConfig.style as any}
                      className="w-full mb-2"
                      style={ctaConfig.colors ? {
                        backgroundColor: ctaConfig.colors.background,
                        color: ctaConfig.colors.text
                      } : undefined}
                    >
                      {ctaConfig.text}
                    </Button>
                    <div className="text-xs text-gray-600">
                      Priority: {ctaConfig.priority}
                      {ctaConfig.personalized && (
                        <Badge className="ml-2 text-xs">Personalized</Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* A/B Testing Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          {Object.entries(abTests).map(([testName, testData]) => (
            <Card key={testName} className="p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()} Test
              </h3>
              
              {testData.isInTest ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-800">
                      Active Participant
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Variant: <strong>{testData.variant?.name || 'Unknown'}</strong>
                    </span>
                  </div>
                  
                  {testData.config && Object.keys(testData.config).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Configuration</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <pre>{JSON.stringify(testData.config, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge variant="outline">Not in Test</Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    User not included in this A/B test
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Demo Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Demo Actions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Simulate user behaviors to see how the personalization engine responds:
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDemoAction('simulate-scroll')}
          >
            Simulate Scroll
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDemoAction('simulate-tool-use')}
          >
            Simulate Tool Use
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDemoAction('simulate-content-view')}
          >
            Simulate Content View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDemoAction('simulate-conversion')}
          >
            Simulate Conversion
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveModal('potential-assessment')}
          >
            Open Assessment
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PersonalizationDemo