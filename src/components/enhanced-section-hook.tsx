"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ExternalLink, TrendingUp, Lightbulb, Target, Star, Clock, Users, BookOpen } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { useABTesting } from "@/lib/hooks/use-ab-testing"
import { cn } from "@/lib/utils"

interface EnhancedSectionHookProps {
  sectionId: string
  question: string
  questionLink: string
  className?: string
  children?: React.ReactNode
}

export function EnhancedSectionHook({ 
  sectionId, 
  question, 
  questionLink, 
  className,
  children 
}: EnhancedSectionHookProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)
  const [showProgressiveDisclosure, setShowProgressiveDisclosure] = useState(false)
  const { trackEngagement } = useEngagementTracking()
  const { getVariation, trackVariationExposure } = useABTesting()

  const variation = getVariation(sectionId)

  useEffect(() => {
    if (!hasViewed && variation) {
      setHasViewed(true)
      trackEngagement({ type: 'hook_view', section: sectionId, hookVariation: variation.id })
      trackVariationExposure(sectionId)
    }
  }, [hasViewed, variation, sectionId, trackEngagement, trackVariationExposure])

  // Progressive disclosure timer
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setShowProgressiveDisclosure(true)
        // Track progressive disclosure view
        trackEngagement({ 
          type: 'progressive_disclosure_view', 
          section: sectionId, 
          hookVariation: variation?.id,
          metadata: {
            timeSpent: 2000 // 2 seconds before disclosure
          }
        })
      }, 2000) // Show additional benefits after 2 seconds
      return () => clearTimeout(timer)
    } else {
      setShowProgressiveDisclosure(false)
    }
  }, [isExpanded, sectionId, trackEngagement, variation?.id])

  const handleQuestionClick = () => {
    trackEngagement({ type: 'question_click', section: sectionId, hookVariation: variation?.id })
    window.open(questionLink, '_blank')
  }

  const handleHookClick = () => {
    const startTime = Date.now()
    trackEngagement({ 
      type: 'hook_click', 
      section: sectionId, 
      hookVariation: variation?.id,
      metadata: {
        deviceType: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'unknown'
      }
    })
    
    if (!isExpanded) {
      // Track hook expansion
      trackEngagement({ 
        type: 'hook_expand', 
        section: sectionId, 
        hookVariation: variation?.id,
        metadata: {
          timestamp: startTime
        }
      })
    }
    
    setIsExpanded(!isExpanded)
  }

  const handleLearnMoreClick = () => {
    trackEngagement({ type: 'learn_more_click', section: sectionId, hookVariation: variation?.id })
    window.open(`${questionLink}/learn-more`, '_blank')
  }

  if (!variation) {
    return (
      <div className={className}>
        <h2 
          className="text-3xl md:text-4xl font-bold text-foreground leading-tight cursor-pointer hover:text-[var(--color-growth-600)] transition-colors"
          onClick={handleQuestionClick}
        >
          {question}
        </h2>
        {children}
      </div>
    )
  }

  const sectionData = getSectionData(sectionId)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Question - Clickable */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-foreground leading-tight cursor-pointer hover:text-[var(--color-growth-600)] transition-colors group"
        onClick={handleQuestionClick}
      >
        {question}
        <ExternalLink className="inline-block ml-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.h2>

      {/* Enhanced Hook - Clickable to expand */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <div 
          className="cursor-pointer group"
          onClick={handleHookClick}
        >
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[var(--color-growth-50)] to-[var(--color-energy-50)] dark:from-[var(--color-growth-900)] dark:to-[var(--color-energy-900)] rounded-lg border border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)] hover:border-[var(--color-growth-400)] transition-all duration-300 hover:shadow-md">
            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg text-[var(--color-growth-700)] dark:text-[var(--color-growth-300)] font-medium leading-relaxed">
                {variation.content.hook}
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm text-[var(--color-growth-600)] dark:text-[var(--color-growth-400)]">
                <span className="font-medium">Click to discover why this matters for your growth</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure of Benefits */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)] space-y-6 backdrop-blur-sm">
                
                {/* Primary Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-[var(--color-growth-600)]" />
                    <h3 className="font-semibold text-[var(--color-growth-700)] dark:text-[var(--color-growth-300)]">
                      What You'll Discover:
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {variation.content.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground font-medium">{benefit}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Progressive Disclosure - Additional Value Props */}
                <AnimatePresence>
                  {showProgressiveDisclosure && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4 pt-4 border-t border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)]"
                    >
                      {/* Growth Impact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] rounded-lg">
                          <Star className="h-5 w-5 text-[var(--color-growth-600)]" />
                          <div>
                            <div className="font-medium text-sm">Growth Impact</div>
                            <div className="text-xs text-muted-foreground">{sectionData.growthImpact}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] rounded-lg">
                          <Clock className="h-5 w-5 text-[var(--color-energy-600)]" />
                          <div>
                            <div className="font-medium text-sm">Time Investment</div>
                            <div className="text-xs text-muted-foreground">{sectionData.timeInvestment}</div>
                          </div>
                        </div>
                      </div>

                      {/* Success Stories Teaser */}
                      <div className="p-3 bg-gradient-to-r from-[var(--color-transformation-50)] to-[var(--color-energy-50)] dark:from-[var(--color-transformation-900)] dark:to-[var(--color-energy-900)] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-[var(--color-transformation-600)]" />
                          <span className="font-medium text-sm">Success Stories</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          "{sectionData.successStoryTeaser}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Impact Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)]">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-growth-600)]">
                      {getSectionMetric(sectionId, 'success_rate')}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-energy-600)]">
                      {getSectionMetric(sectionId, 'time_to_result')}
                    </div>
                    <div className="text-xs text-muted-foreground">Time to Results</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-transformation-600)]">
                      {getSectionMetric(sectionId, 'user_count')}+
                    </div>
                    <div className="text-xs text-muted-foreground">People Helped</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleLearnMoreClick}
                    className="group"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Deep Dive Learning
                    <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  <Button
                    variant="cta"
                    onClick={() => {
                      trackEngagement({ type: 'cta_click', section: sectionId, hookVariation: variation?.id })
                      // Scroll to the main CTA of the section
                      const ctaButton = document.querySelector(`[data-section="${sectionId}"] button[variant="cta"]`)
                      if (ctaButton) {
                        ctaButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                    }}
                    className="group"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Start Your Journey
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Original Content */}
      <div data-section={sectionId}>
        {children}
      </div>
    </div>
  )
}

// Helper function to get section-specific data
function getSectionData(sectionId: string) {
  const sectionData: Record<string, {
    growthImpact: string
    timeInvestment: string
    successStoryTeaser: string
  }> = {
    'success-gap': {
      growthImpact: 'High - Foundation for all achievement',
      timeInvestment: '15 min/day for 3 weeks',
      successStoryTeaser: 'Sarah went from struggling entrepreneur to 6-figure business owner in 8 months using these exact success factors.'
    },
    'change-paradox': {
      growthImpact: 'Transformational - Rewires habits',
      timeInvestment: '10 min/day for 21 days',
      successStoryTeaser: 'Michael finally quit smoking after 15 years by understanding his habit loops instead of fighting willpower.'
    },
    'vision-void': {
      growthImpact: 'Life-changing - Provides direction',
      timeInvestment: '30 min/week for 2 months',
      successStoryTeaser: 'After feeling lost for years, Rahel created a crystal-clear 5-year vision and achieved her first major goal in 6 months.'
    },
    'leadership-lever': {
      growthImpact: 'Multiplying - Amplifies all skills',
      timeInvestment: '20 min/week ongoing',
      successStoryTeaser: 'David discovered his leadership style and got promoted to team lead within 4 months of applying these insights.'
    },
    'decision-door': {
      growthImpact: 'Immediate - Clarity for action',
      timeInvestment: '5 minutes right now',
      successStoryTeaser: 'This calculation helped Meron realize she was losing 2.5M ETB over 5 years by staying in her comfort zone.'
    }
  }

  return sectionData[sectionId] || {
    growthImpact: 'Significant - Personal development',
    timeInvestment: '15-30 min/week',
    successStoryTeaser: 'Thousands have transformed their lives using these proven strategies.'
  }
}

// Helper function to get section-specific metrics
function getSectionMetric(sectionId: string, metric: 'success_rate' | 'time_to_result' | 'user_count'): string | number {
  const metrics: Record<string, Record<string, string | number>> = {
    'success-gap': {
      success_rate: 87,
      time_to_result: '2-3 weeks',
      user_count: '15K'
    },
    'change-paradox': {
      success_rate: 92,
      time_to_result: '21 days',
      user_count: '23K'
    },
    'vision-void': {
      success_rate: 78,
      time_to_result: '1-2 months',
      user_count: '8K'
    },
    'leadership-lever': {
      success_rate: 84,
      time_to_result: '3-4 weeks',
      user_count: '12K'
    },
    'decision-door': {
      success_rate: 95,
      time_to_result: 'Immediate',
      user_count: '50K'
    }
  }

  return metrics[sectionId]?.[metric] || (
    metric === 'success_rate' ? 85 : 
    metric === 'time_to_result' ? '2-4 weeks' : 
    '10K'
  )
}