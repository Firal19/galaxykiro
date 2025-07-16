'use client'

import React, { useState, useEffect } from 'react'
import { ContentLibrary } from '../../components/content-library'
import { ContentViewer } from '../../components/content-viewer'
import { ContentModel } from '../../lib/models/content'
import { UserModel } from '../../lib/models/user'

// Mock user data for demonstration
const createMockUser = (level: 1 | 2 | 3): UserModel => {
  const userData = {
    id: 'mock-user-id',
    email: 'user@example.com',
    full_name: 'Demo User',
    phone: level >= 2 ? '+1234567890' : undefined,
    city: level >= 2 ? 'Demo City' : undefined,
    capture_level: level,
    capture_timestamps: {
      level1: new Date().toISOString(),
      level2: level >= 2 ? new Date().toISOString() : null,
      level3: level >= 3 ? new Date().toISOString() : null,
    },
    engagement_score: level * 25,
    readiness_indicator: level * 30,
    last_activity: new Date().toISOString(),
    entry_point: 'direct',
    current_tier: level === 1 ? 'browser' as const : level === 2 ? 'engaged' as const : 'soft-member' as const,
    language: 'en' as const,
    timezone: 'UTC',
    communication_preferences: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  return new UserModel(userData)
}

export default function ContentLibraryPage() {
  const [selectedContent, setSelectedContent] = useState<ContentModel | null>(null)
  const [userLevel, setUserLevel] = useState<1 | 2 | 3>(1)
  const [user, setUser] = useState<UserModel>(createMockUser(1))

  // Update user when level changes
  useEffect(() => {
    setUser(createMockUser(userLevel))
  }, [userLevel])

  const handleContentView = (content: ContentModel) => {
    setSelectedContent(content)
  }

  const handleBackToLibrary = () => {
    setSelectedContent(null)
  }

  const handleContentComplete = (contentId: string) => {
    console.log('Content completed:', contentId)
    // Here you would typically update user progress, trigger next steps, etc.
  }

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ContentViewer
          content={selectedContent}
          user={user}
          onBack={handleBackToLibrary}
          onComplete={handleContentComplete}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Demo Controls */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Demo Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Access Level (simulates progressive capture)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map(level => (
                  <button
                    key={level}
                    onClick={() => setUserLevel(level as 1 | 2 | 3)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      userLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <div>Level 1: Email only (Surface content)</div>
                <div>Level 2: Email + Phone (Surface + Medium content)</div>
                <div>Level 3: Full profile (All content)</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div><strong>Current User:</strong> {user.email}</div>
              <div><strong>Capture Level:</strong> {user.captureLevel}</div>
              <div><strong>Tier:</strong> {user.currentTier}</div>
              <div><strong>Engagement Score:</strong> {user.engagementScore}</div>
            </div>
          </div>
        </div>

        {/* Content Library */}
        <ContentLibrary
          user={user}
          showSearch={true}
          showFilters={true}
          onContentView={handleContentView}
        />
      </div>
    </div>
  )
}