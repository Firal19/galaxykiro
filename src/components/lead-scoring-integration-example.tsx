'use client'

import React, { useEffect } from 'react'
import { useLeadScoring, useScorePersonalization } from '../lib/hooks/use-lead-scoring'
import { trackToolComplete, trackContentDownload, trackWebinarRegistration, trackCTAClick } from '../lib/score-tracking'
import { LeadScoringDashboard } from './lead-scoring-dashboard'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

export function LeadScoringIntegrationExample() {
  const {
    score,
    tier,
    readinessLevel,
    scoreBreakdown,
    isLoading,
    hasRecentTierChange,
    scoreIncrease,
    updateScore
  } = useLeadScoring()

  const {
    getPersonalizedCTA,
    getPersonalizedContent,
    shouldShowFeature
  } = useScorePersonalization()

  // Simulate user actions for demonstration
  const simulateToolCompletion = () => {
    trackToolComplete('potential-assessment', { score: 85, insights: ['high-potential'] })
    setTimeout(() => updateScore(), 1000) // Update score after tracking
  }

  const simulateContentDownload = () => {
    trackContentDownload('success-guide', 'pdf')
    setTimeout(() => updateScore(), 1000)
  }

  const simulateWebinarRegistration = () => {
    trackWebinarRegistration('transformation-masterclass')
    setTimeout(() => updateScore(), 1000)
  }

  const simulateCTAClick = () => {
    trackCTAClick('get-started-cta', 'Get Started Now')
    setTimeout(() => updateScore(), 1000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Lead Scoring System Demo
        </h1>
        <p className="text-gray-600">
          This demonstrates the automated lead scoring and tier progression system
        </p>
      </div>

      {/* Lead Scoring Dashboard */}
      <LeadScoringDashboard showDetails={true} />

      {/* Tier Change Notification */}
      {hasRecentTierChange && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Tier Upgraded!</h3>
              <p className="text-green-700">
                You've gained {scoreIncrease} points and moved to {tier?.replace('-', ' ').toUpperCase()} tier
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Personalized Content Based on Tier */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personalized CTAs</h3>
          <div className="space-y-3">
            <Button className="w-full">
              {getPersonalizedCTA('Get Started')}
            </Button>
            <Button variant="outline" className="w-full">
              {getPersonalizedCTA('Try Tool')}
            </Button>
            <Button variant="secondary" className="w-full">
              {getPersonalizedCTA('Start Journey')}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recommended Content</h3>
          <div className="space-y-2">
            {getPersonalizedContent('tools').slice(0, 3).map((content, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{content}</span>
                <Badge variant="outline" className="text-xs">
                  {tier?.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Feature Access Based on Tier */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feature Access</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              shouldShowFeature('browser') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium">Basic Tools</h4>
            <p className="text-sm text-gray-600">Quick assessments</p>
            <Badge variant={shouldShowFeature('browser') ? 'default' : 'outline'} className="mt-2">
              {shouldShowFeature('browser') ? 'Unlocked' : 'Locked'}
            </Badge>
          </div>

          <div className="text-center">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              shouldShowFeature('engaged') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h4 className="font-medium">Premium Content</h4>
            <p className="text-sm text-gray-600">Advanced guides</p>
            <Badge variant={shouldShowFeature('engaged') ? 'default' : 'outline'} className="mt-2">
              {shouldShowFeature('engaged') ? 'Unlocked' : 'Locked'}
            </Badge>
          </div>

          <div className="text-center">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              shouldShowFeature('soft-member') ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-medium">VIP Access</h4>
            <p className="text-sm text-gray-600">Personal consultation</p>
            <Badge variant={shouldShowFeature('soft-member') ? 'default' : 'outline'} className="mt-2">
              {shouldShowFeature('soft-member') ? 'Unlocked' : 'Locked'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Simulation Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Simulate User Actions</h3>
        <p className="text-gray-600 mb-4">
          Click these buttons to simulate user actions and see how they affect the lead score
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            onClick={simulateToolCompletion}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Complete Tool (+5 pts)
          </Button>
          
          <Button 
            onClick={simulateContentDownload}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Download Content (+4 pts)
          </Button>
          
          <Button 
            onClick={simulateWebinarRegistration}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Register Webinar (+25 pts)
          </Button>
          
          <Button 
            onClick={simulateCTAClick}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Click CTA (+0.5 pts)
          </Button>
        </div>
      </Card>

      {/* Score Breakdown Details */}
      {scoreBreakdown && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Score Breakdown</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {scoreBreakdown.pageViewsScore}
              </div>
              <div className="text-sm text-gray-600">Page Views</div>
              <div className="text-xs text-gray-500">0.5 pts each, max 10</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {scoreBreakdown.toolUsageScore}
              </div>
              <div className="text-sm text-gray-600">Tool Usage</div>
              <div className="text-xs text-gray-500">5 pts each, max 30</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scoreBreakdown.contentDownloadsScore}
              </div>
              <div className="text-sm text-gray-600">Content Downloads</div>
              <div className="text-xs text-gray-500">4 pts each, max 20</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {scoreBreakdown.webinarRegistrationScore}
              </div>
              <div className="text-sm text-gray-600">Webinar Registrations</div>
              <div className="text-xs text-gray-500">25 pts each</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {scoreBreakdown.timeOnSiteScore}
              </div>
              <div className="text-sm text-gray-600">Time on Site</div>
              <div className="text-xs text-gray-500">Max 10 for 5+ min</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {scoreBreakdown.scrollDepthScore}
              </div>
              <div className="text-sm text-gray-600">Scroll Depth</div>
              <div className="text-xs text-gray-500">Max 5 points</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {scoreBreakdown.ctaEngagementScore}
              </div>
              <div className="text-sm text-gray-600">CTA Engagement</div>
              <div className="text-xs text-gray-500">10 pts for 5+ clicks</div>
            </div>
          </div>
        </Card>
      )}

      {/* Tier Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tier System</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            tier === 'browser' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <h4 className="font-semibold">Browser (0-29)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Basic tool access</li>
              <li>• Limited content</li>
              <li>• Standard experience</li>
            </ul>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            tier === 'engaged' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h4 className="font-semibold">Engaged (30-69)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Advanced tools</li>
              <li>• Premium content</li>
              <li>• Webinar access</li>
            </ul>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            tier === 'soft-member' ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h4 className="font-semibold">Soft Member (70+)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full access</li>
              <li>• Personal consultation</li>
              <li>• VIP treatment</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}