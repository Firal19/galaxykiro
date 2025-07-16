'use client'

import React from 'react'
import { DynamicCTA, useDynamicCTA } from './dynamic-cta'
import { Card } from './ui/card'

// Demo component to showcase the Dynamic CTA and Personalization Engine
export function DynamicCTADemo() {
  const { getCurrentRecommendation } = useDynamicCTA()

  const handleCTAClick = (ctaId: string, action: string) => {
    console.log(`CTA clicked: ${ctaId} with action: ${action}`)
  }

  const recommendation = getCurrentRecommendation()

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dynamic CTA & Personalization Engine Demo</h2>
        <p className="text-gray-600 mb-6">
          This demonstrates the complete Dynamic CTA and Personalization Engine implementation.
        </p>
      </div>

      {/* Current User State */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current User State</h3>
        {recommendation.engagement && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Engagement Score:</span>
              <div className="text-lg font-bold text-blue-600">
                {recommendation.engagement.score}
              </div>
            </div>
            <div>
              <span className="font-medium">Level:</span>
              <div className="text-lg font-bold text-green-600">
                {recommendation.engagement.level}
              </div>
            </div>
            <div>
              <span className="font-medium">Tier:</span>
              <div className="text-lg font-bold text-purple-600">
                {recommendation.engagement.tier}
              </div>
            </div>
            <div>
              <span className="font-medium">Pattern:</span>
              <div className="text-lg font-bold text-orange-600">
                {recommendation.engagement.behaviorPattern}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Personalized Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Insights</h3>
        {recommendation.insights && (
          <div className="space-y-3">
            <div>
              <span className="font-medium">Primary Interest:</span>
              <span className="ml-2 text-blue-600">{recommendation.insights.primaryInterest}</span>
            </div>
            <div>
              <span className="font-medium">Next Best Action:</span>
              <span className="ml-2 text-green-600">{recommendation.insights.nextBestAction}</span>
            </div>
            <div>
              <span className="font-medium">Personalized Message:</span>
              <p className="mt-1 text-gray-700 italic">{recommendation.insights.personalizedMessage}</p>
            </div>
            <div>
              <span className="font-medium">Recommended Content:</span>
              <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                {recommendation.insights.recommendedContent.map((content, index) => (
                  <li key={index}>{content}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>

      {/* Dynamic CTAs - Vertical Layout */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dynamic CTAs - Vertical Layout</h3>
        <DynamicCTA
          context="demo-vertical"
          maxCTAs={3}
          layout="vertical"
          showDescription={true}
          showBadges={true}
          onCTAClick={handleCTAClick}
        />
      </Card>

      {/* Dynamic CTAs - Horizontal Layout */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dynamic CTAs - Horizontal Layout</h3>
        <DynamicCTA
          context="demo-horizontal"
          maxCTAs={4}
          layout="horizontal"
          showDescription={false}
          showBadges={false}
          onCTAClick={handleCTAClick}
        />
      </Card>

      {/* Dynamic CTAs - Grid Layout */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dynamic CTAs - Grid Layout</h3>
        <DynamicCTA
          context="demo-grid"
          maxCTAs={6}
          layout="grid"
          showDescription={true}
          showBadges={true}
          onCTAClick={handleCTAClick}
        />
      </Card>

      {/* Recommended CTAs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Recommended CTAs</h3>
        <div className="space-y-2">
          {recommendation.recommendedCTAs.map((cta, index) => (
            <div key={cta.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{cta.text}</span>
                <span className="ml-2 text-sm text-gray-500">({cta.commitmentLevel})</span>
              </div>
              <div className="text-sm text-gray-600">
                Priority: {cta.priority}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Implementation Summary */}
      <Card className="p-6 bg-green-50">
        <h3 className="text-lg font-semibold mb-4 text-green-800">✅ Implementation Complete</h3>
        <div className="space-y-2 text-sm text-green-700">
          <div>✅ Dynamic CTA component that adapts based on user behavior patterns</div>
          <div>✅ Engagement scoring algorithm using time on page, scroll depth, and interactions</div>
          <div>✅ CTA optimization system with A/B testing capabilities</div>
          <div>✅ Personalized content recommendation engine</div>
          <div>✅ Behavioral trigger system for escalating commitment asks</div>
        </div>
      </Card>
    </div>
  )
}

export default DynamicCTADemo