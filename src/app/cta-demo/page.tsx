'use client'

import React, { useState } from 'react'
import { Card } from '../../components/ui/card'

import { Badge } from '../../components/ui/badge'
import { EnhancedCTA } from '../../components/enhanced-cta'
import { DynamicCTA } from '../../components/dynamic-cta'
import CTAOptimizationDashboard from '../../components/cta-optimization-dashboard'
import { useUser } from '../../lib/store'

export default function CTADemoPage() {
  const user = useUser()
  const [activeTab, setActiveTab] = useState<'enhanced' | 'dynamic' | 'dashboard'>('enhanced')
  const [demoSettings, setDemoSettings] = useState({
    showBadges: true,
    showPsychologicalTriggers: true,
    enableABTesting: true,
    layout: 'vertical' as 'horizontal' | 'vertical' | 'grid',
    maxCTAs: 3
  })

  const handleCTAClick = (ctaId: string, action: string, variant?: string) => {
    console.log('CTA Clicked:', { ctaId, action, variant })
    // In a real implementation, this would trigger the actual action
    alert(`CTA "${ctaId}" clicked with action "${action}"${variant ? ` (variant: ${variant})` : ''}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CTA Psychology & Hierarchy System Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our advanced CTA optimization system with A/B testing, psychological triggers, 
            and intelligent personalization based on user behavior patterns.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('enhanced')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'enhanced'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enhanced CTAs
            </button>
            <button
              onClick={() => setActiveTab('dynamic')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'dynamic'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dynamic CTAs
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics Dashboard
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'enhanced' && (
          <div className="space-y-8">
            {/* Settings Panel */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Demo Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={demoSettings.showBadges}
                      onChange={(e) => setDemoSettings(prev => ({ ...prev, showBadges: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Show Badges</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={demoSettings.showPsychologicalTriggers}
                      onChange={(e) => setDemoSettings(prev => ({ ...prev, showPsychologicalTriggers: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Show Psych Triggers</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={demoSettings.enableABTesting}
                      onChange={(e) => setDemoSettings(prev => ({ ...prev, enableABTesting: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Enable A/B Testing</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm mb-1">Layout</label>
                  <select
                    value={demoSettings.layout}
                    onChange={(e) => setDemoSettings(prev => ({ ...prev, layout: e.target.value as 'horizontal' | 'vertical' | 'grid' }))}
                    className="w-full px-3 py-1 border rounded text-sm"
                  >
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                    <option value="grid">Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Max CTAs</label>
                  <select
                    value={demoSettings.maxCTAs}
                    onChange={(e) => setDemoSettings(prev => ({ ...prev, maxCTAs: parseInt(e.target.value) }))}
                    className="w-full px-3 py-1 border rounded text-sm"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* CTA Hierarchy Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Micro CTAs */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800">Micro</Badge>
                  <h3 className="text-lg font-semibold">Low Commitment CTAs</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Designed for browsers and new visitors. Low friction, high curiosity.
                </p>
                <EnhancedCTA
                  context="micro-demo"
                  maxCTAs={2}
                  layout="vertical"
                  showDescription={demoSettings.showBadges}
                  showBadges={demoSettings.showBadges}
                  showPsychologicalTriggers={demoSettings.showPsychologicalTriggers}
                  enableABTesting={demoSettings.enableABTesting}
                  onCTAClick={handleCTAClick}
                />
              </Card>

              {/* Midi CTAs */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-purple-100 text-purple-800">Midi</Badge>
                  <h3 className="text-lg font-semibold">Medium Commitment CTAs</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  For engaged visitors ready to provide more information for value.
                </p>
                <EnhancedCTA
                  context="midi-demo"
                  maxCTAs={2}
                  layout="vertical"
                  showDescription={demoSettings.showBadges}
                  showBadges={demoSettings.showBadges}
                  showPsychologicalTriggers={demoSettings.showPsychologicalTriggers}
                  enableABTesting={demoSettings.enableABTesting}
                  onCTAClick={handleCTAClick}
                />
              </Card>

              {/* Macro CTAs */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-red-100 text-red-800">Macro</Badge>
                  <h3 className="text-lg font-semibold">High Commitment CTAs</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  For highly engaged users ready for significant commitment.
                </p>
                <EnhancedCTA
                  context="macro-demo"
                  maxCTAs={2}
                  layout="vertical"
                  showDescription={demoSettings.showBadges}
                  showBadges={demoSettings.showBadges}
                  showPsychologicalTriggers={demoSettings.showPsychologicalTriggers}
                  enableABTesting={demoSettings.enableABTesting}
                  onCTAClick={handleCTAClick}
                />
              </Card>
            </div>

            {/* Full Enhanced CTA Demo */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Complete Enhanced CTA System</h3>
              <p className="text-gray-600 mb-6">
                This demonstrates the full system with all psychological triggers, A/B testing, and personalization.
              </p>
              <EnhancedCTA
                context="full-demo"
                maxCTAs={demoSettings.maxCTAs}
                layout={demoSettings.layout}
                showDescription={true}
                showBadges={demoSettings.showBadges}
                showPsychologicalTriggers={demoSettings.showPsychologicalTriggers}
                enableABTesting={demoSettings.enableABTesting}
                onCTAClick={handleCTAClick}
                className="max-w-4xl mx-auto"
              />
            </Card>

            {/* Psychological Triggers Explanation */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Psychological Triggers Explained</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🧠 Curiosity</h4>
                  <p className="text-sm text-blue-800">
                    Creates intrigue and desire to learn more. Uses questions and incomplete information.
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">⏰ Urgency</h4>
                  <p className="text-sm text-red-800">
                    Creates time pressure to encourage immediate action. Uses deadlines and scarcity.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">👥 Social Proof</h4>
                  <p className="text-sm text-green-800">
                    Shows others are taking action. Uses testimonials, numbers, and community.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">🎯 Personalization</h4>
                  <p className="text-sm text-purple-800">
                    Tailors message to individual. Uses names, preferences, and behavior.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">🔒 Scarcity</h4>
                  <p className="text-sm text-orange-800">
                    Limited availability creates value. Uses exclusive access and limited spots.
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">🏆 Authority</h4>
                  <p className="text-sm text-indigo-800">
                    Establishes credibility and expertise. Uses credentials and research.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'dynamic' && (
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Dynamic CTA System</h3>
              <p className="text-gray-600 mb-6">
                This system adapts CTAs based on real-time user behavior, engagement level, and journey stage.
              </p>
              <DynamicCTA
                context="dynamic-demo"
                maxCTAs={demoSettings.maxCTAs}
                layout={demoSettings.layout}
                showDescription={true}
                showBadges={demoSettings.showBadges}
                onCTAClick={handleCTAClick}
                className="max-w-4xl mx-auto"
              />
            </Card>

            {/* Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Enhanced CTA System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ A/B Testing Framework</li>
                  <li>✅ Psychological Triggers</li>
                  <li>✅ Advanced Analytics</li>
                  <li>✅ Variant Management</li>
                  <li>✅ Statistical Significance</li>
                  <li>✅ Personalization Engine</li>
                </ul>
              </Card>
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Dynamic CTA System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Real-time Adaptation</li>
                  <li>✅ Behavior-based Selection</li>
                  <li>✅ Engagement Scoring</li>
                  <li>✅ Journey Stage Awareness</li>
                  <li>✅ Tier-based Filtering</li>
                  <li>✅ Context Sensitivity</li>
                </ul>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <CTAOptimizationDashboard />
        )}

        {/* User Info */}
        {user && (
          <Card className="p-4 mt-8">
            <h4 className="font-medium mb-2">Current User Context</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>User ID: {user.id}</div>
              <div>Email: {user.email}</div>
              <div>Capture Level: {user.captureLevel || 1}</div>
              <div>Current Tier: {user.currentTier || 'browser'}</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}