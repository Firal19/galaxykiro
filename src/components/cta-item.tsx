'use client'

import React from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import type { EnhancedCTAConfig } from '../types/cta-types'

interface CTAItemProps {
  cta: EnhancedCTAConfig
  variant?: string
  showDescription?: boolean
  showBadges?: boolean
  enableABTesting?: boolean
  onClick: () => void
}

export function CTAItem({
  cta,
  variant = 'control',
  showDescription = true,
  showBadges = true,
  enableABTesting = true,
  onClick
}: CTAItemProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-400">
      <div className="space-y-3">
        {showBadges && (
          <div className="flex gap-2 flex-wrap">
            <Badge className={`text-xs ${
              cta.commitmentLevel === 'micro' ? 'bg-green-100 text-green-800' :
              cta.commitmentLevel === 'midi' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cta.commitmentLevel.toUpperCase()}
            </Badge>
            {enableABTesting && variant !== 'control' && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                {variant}
              </Badge>
            )}
          </div>
        )}
        
        <div>
          <Button
            variant={cta.styling.variant}
            size={cta.styling.size}
            className={`w-full transition-all duration-200 ${cta.styling.className || ''}`}
            onClick={onClick}
          >
            {cta.text}
          </Button>
          
          {showDescription && cta.description && (
            <p className="text-sm text-gray-600 mt-2">
              {cta.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}