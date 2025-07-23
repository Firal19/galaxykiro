'use client'

import React from 'react'
import type { PsychologicalTrigger } from '../lib/psychological-triggers'

interface PsychologicalTriggerDisplayProps {
  activeTrigger: PsychologicalTrigger | null
  getPersonalizedContent: (trigger: PsychologicalTrigger) => {
    text: string
    subtext?: string
  }
  show?: boolean
}

export function PsychologicalTriggerDisplay({
  activeTrigger,
  getPersonalizedContent,
  show = false
}: PsychologicalTriggerDisplayProps) {
  if (!activeTrigger || !show) {
    return null
  }

  const personalizedContent = getPersonalizedContent(activeTrigger)

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">{activeTrigger.content.icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {personalizedContent.text}
          </p>
          {activeTrigger.content.subtext && (
            <p className="text-xs text-gray-600">
              {personalizedContent.subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}