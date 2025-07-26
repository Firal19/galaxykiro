'use client'

import React, { useEffect } from 'react'
// import { CTAItem } from './cta-item' // Component removed - inline implementation
import { PsychologicalTriggerDisplay } from './psychological-trigger-display'
import { useEnhancedCTA } from '../hooks/use-enhanced-cta'
import type { EnhancedCTAProps } from '../types/cta-types'

interface ExtendedEnhancedCTAProps extends EnhancedCTAProps {
  layout?: 'vertical' | 'horizontal' | 'grid'
  showDescription?: boolean
  showBadges?: boolean
  showPsychologicalTriggers?: boolean
  enableABTesting?: boolean
}

export function EnhancedCTA({
  context = 'general',
  placement = 'content',
  maxCTAs = 3,
  layout = 'vertical',
  showDescription = true,
  showBadges = true,
  showPsychologicalTriggers = false,
  enableABTesting = true,
  className = '',
  onCTAClick
}: ExtendedEnhancedCTAProps) {
  const {
    selectedCTAs,
    ctaVariants,
    activeTrigger,
    handleCTAClick,
    getCTAWithVariant,
    getPersonalizedContent,
    trackDisplay
  } = useEnhancedCTA({
    context,
    maxCTAs,
    enableABTesting,
    onCTAClick
  })

  // Track display of psychological triggers
  useEffect(() => {
    if (activeTrigger && showPsychologicalTriggers) {
      trackDisplay(activeTrigger.id)
    }
  }, [activeTrigger, showPsychologicalTriggers, trackDisplay])

  if (selectedCTAs.length === 0) {
    return null
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4 overflow-x-auto'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'vertical':
      default:
        return 'space-y-4'
    }
  }

  const getContainerClasses = () => {
    const baseClasses = 'enhanced-cta-container'
    const placementClasses = {
      hero: 'max-w-4xl mx-auto',
      content: 'max-w-3xl mx-auto',
      sidebar: 'max-w-sm',
      footer: 'max-w-6xl mx-auto',
      modal: 'max-w-lg mx-auto'
    }
    
    return `${baseClasses} ${placementClasses[placement]} ${className}`
  }

  return (
    <div className={getContainerClasses()}>
      <div className={getLayoutClasses()}>
        {selectedCTAs.map((cta) => {
          const ctaWithVariant = getCTAWithVariant(cta)
          const variant = ctaVariants.get(cta.id) || 'control'

          return (
            <CTAItem
              key={cta.id}
              cta={ctaWithVariant}
              variant={variant}
              showDescription={showDescription}
              showBadges={showBadges}
              enableABTesting={enableABTesting}
              onClick={() => handleCTAClick(cta)}
            />
          )
        })}
      </div>
      
      <PsychologicalTriggerDisplay
        activeTrigger={activeTrigger}
        getPersonalizedContent={getPersonalizedContent}
        show={showPsychologicalTriggers}
      />
    </div>
  )
}

export default EnhancedCTA