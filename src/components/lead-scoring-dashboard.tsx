'use client'

import React from 'react'
import { useLeadScoring } from '../lib/hooks/use-lead-scoring'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { AnimatedCounter } from './ui/animated-counter'

interface LeadScoringDashboardProps {
  userId?: string
  showDetails?: boolean
  compact?: boolean
}

export function LeadScoringDashboard({ 
  userId, 
  showDetails = true, 
  compact = false 
}: LeadScoringDashboardProps) {
  const {
    score,
    tier,
    readinessLevel,
    scoreBreakdown,
    isLoading,
    error,
    hasRecentTierChange,
    scoreIncrease,
    updateScore,
    refreshScore,
    canAccessTier
  } = useLeadScoring(userId)

  if (isLoading && !score) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="text-red-600">
          <h3 className="font-semibold mb-2">Error Loading Score</h3>
          <p className="text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshScore}
            className="mt-3"
          >
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  if (!score && !isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>No scoring data available</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={updateScore}
            className="mt-3"
          >
            Calculate Score
          </Button>
        </div>
      </Card>
    )
  }

  const getTierColor = (currentTier: string) => {
    switch (currentTier) {
      case 'soft-member':
        return 'bg-green-500'
      case 'engaged':
        return 'bg-blue-500'
      case 'browser':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getTierBadgeVariant = (currentTier: string) => {
    switch (currentTier) {
      case 'soft-member':
        return 'default' as const
      case 'engaged':
        return 'secondary' as const
      case 'browser':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const getNextTierThreshold = (currentTier: string) => {
    switch (currentTier) {
      case 'browser':
        return 30
      case 'engaged':
        return 70
      case 'soft-member':
        return 100
      default:
        return 30
    }
  }

  const getProgressPercentage = () => {
    if (!score || !tier) return 0
    
    const nextThreshold = getNextTierThreshold(tier)
    const currentThreshold = tier === 'browser' ? 0 : tier === 'engaged' ? 30 : 70
    
    if (tier === 'soft-member') {
      return 100
    }
    
    return ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getTierColor(tier || 'browser')}`}></div>
          <Badge variant={getTierBadgeVariant(tier || 'browser')}>
            {tier?.replace('-', ' ').toUpperCase() || 'BROWSER'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            <AnimatedCounter value={score || 0} />
          </span>
          {hasRecentTierChange && scoreIncrease > 0 && (
            <span className="text-green-600 text-sm font-medium">
              +{scoreIncrease}
            </span>
          )}
        </div>

        {tier !== 'soft-member' && (
          <div className="flex-1 max-w-32">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Engagement Score</h3>
          <p className="text-sm text-gray-600">Your personal development journey progress</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={getTierBadgeVariant(tier || 'browser')} className="text-sm">
            {tier?.replace('-', ' ').toUpperCase() || 'BROWSER'}
          </Badge>
          
          {hasRecentTierChange && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Tier Upgraded!
            </Badge>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-4xl font-bold text-gray-900">
            <AnimatedCounter value={score || 0} />
          </span>
          <span className="text-lg text-gray-500">/ 100</span>
          
          {hasRecentTierChange && scoreIncrease > 0 && (
            <div className="flex items-center text-green-600">
              <span className="text-lg font-semibold">+{scoreIncrease}</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600">Readiness Level:</span>
          <Badge 
            variant={readinessLevel === 'high' ? 'default' : readinessLevel === 'medium' ? 'secondary' : 'outline'}
          >
            {readinessLevel?.toUpperCase() || 'LOW'}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      {tier !== 'soft-member' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to {tier === 'browser' ? 'Engaged' : 'Soft Member'}</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{tier === 'browser' ? '0' : '30'} points</span>
            <span>{getNextTierThreshold(tier || 'browser')} points</span>
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {showDetails && scoreBreakdown && (
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-900">Score Breakdown</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Page Views:</span>
              <span className="font-medium">{scoreBreakdown.pageViewsScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tool Usage:</span>
              <span className="font-medium">{scoreBreakdown.toolUsageScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Content:</span>
              <span className="font-medium">{scoreBreakdown.contentDownloadsScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Webinars:</span>
              <span className="font-medium">{scoreBreakdown.webinarRegistrationScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time on Site:</span>
              <span className="font-medium">{scoreBreakdown.timeOnSiteScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement:</span>
              <span className="font-medium">{scoreBreakdown.ctaEngagementScore}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tier Benefits */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Your Current Benefits</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {canAccessTier('browser') && (
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Access to basic tools and assessments
            </li>
          )}
          
          {canAccessTier('engaged') && (
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Premium content and webinar access
            </li>
          )}
          
          {canAccessTier('soft-member') && (
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Full access and personalized consultation
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshScore}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Refresh Score'}
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={updateScore}
          disabled={isLoading}
        >
          Update & Sync
        </Button>
      </div>
    </Card>
  )
}