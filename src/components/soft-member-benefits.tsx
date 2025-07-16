"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Lock, 
  Unlock, 
  Star, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Gift,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSoftMembership } from "@/lib/hooks/use-soft-membership"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

interface SoftMemberBenefitsProps {
  variant?: 'widget' | 'modal' | 'inline'
  showProgress?: boolean
  className?: string
}

const categoryIcons = {
  tools: Target,
  content: BookOpen,
  community: Users,
  insights: TrendingUp
}

const categoryColors = {
  tools: 'var(--color-energy-500)',
  content: 'var(--color-growth-500)',
  community: 'var(--color-transformation-500)',
  insights: 'var(--color-potential-500)'
}

export function SoftMemberBenefits({ 
  variant = 'widget', 
  showProgress = true,
  className 
}: SoftMemberBenefitsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const {
    membershipData,
    benefits,
    isLoading,
    getNextBenefit,
    getProgressToNextBenefit,
    isSoftMember,
    registerSoftMember,
    updateEngagementScore
  } = useSoftMembership()

  const nextBenefitProgress = getProgressToNextBenefit()
  const unlockedBenefits = benefits.filter(b => b.unlocked)
  const lockedBenefits = benefits.filter(b => !b.unlocked)

  const handleBenefitClick = (benefitId: string) => {
    const benefit = benefits.find(b => b.id === benefitId)
    if (!benefit) return

    if (benefit.unlocked) {
      // Navigate to benefit or trigger action
      updateEngagementScore(5, `benefit-accessed-${benefitId}`)
      
      // Handle specific benefit actions
      switch (benefitId) {
        case 'tool-access':
          window.location.href = '/tools'
          break
        case 'progress-tracking':
          window.location.href = '/membership/dashboard'
          break
        case 'exclusive-content':
          window.location.href = '/content-library'
          break
        case 'community-access':
          window.location.href = '/community'
          break
        default:
          console.log(`Accessing benefit: ${benefit.title}`)
      }
    } else {
      // Show how to unlock
      setIsModalOpen(true)
    }
  }

  const handleUpgrade = () => {
    updateEngagementScore(10, 'upgrade-interest')
    window.location.href = '/membership/register?source=benefits-widget'
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    )
  }

  if (!isSoftMember() && variant === 'widget') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-gradient-to-br from-[var(--color-energy-500)] to-[var(--color-transformation-500)] text-white rounded-xl p-6 shadow-lg",
          className
        )}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Unlock Your Potential</h3>
            <p className="text-white/90 text-sm">Join as a soft member - it's free!</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4" />
            <span>Free assessment tools</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4" />
            <span>Progress tracking</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4" />
            <span>Personalized insights</span>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full bg-white text-[var(--color-energy-600)] hover:bg-white/90"
          onClick={() => window.location.href = '/membership/register?source=benefits-widget'}
        >
          Join Free
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>
    )
  }

  if (variant === 'modal') {
    return (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--color-energy-500)] to-[var(--color-transformation-500)] rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Soft Membership Benefits
            </h2>
            <p className="text-muted-foreground">
              Unlock more benefits by staying engaged with our platform
            </p>
          </div>

          {/* Progress to Next Benefit */}
          {nextBenefitProgress && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">Next Unlock</h4>
                <span className="text-sm text-muted-foreground">
                  {nextBenefitProgress.pointsNeeded} points needed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextBenefitProgress.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {nextBenefitProgress.benefit.title}: {nextBenefitProgress.benefit.description}
              </p>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const IconComponent = categoryIcons[benefit.category]
              const isUnlocked = benefit.unlocked
              
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "p-4 border rounded-lg transition-all cursor-pointer",
                    isUnlocked 
                      ? "border-[var(--color-energy-500)] bg-[var(--color-energy-500)]/5 hover:bg-[var(--color-energy-500)]/10" 
                      : "border-border bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => handleBenefitClick(benefit.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isUnlocked ? "bg-[var(--color-energy-500)]/20" : "bg-muted"
                    )}>
                      {isUnlocked ? (
                        <IconComponent className="h-5 w-5 text-[var(--color-energy-600)]" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className={cn(
                          "font-medium",
                          isUnlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {benefit.title}
                        </h5>
                        {isUnlocked && <Unlock className="h-4 w-4 text-[var(--color-growth-500)]" />}
                      </div>
                      <p className={cn(
                        "text-sm",
                        isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
                      )}>
                        {benefit.description}
                      </p>
                      {!isUnlocked && benefit.requiredScore && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Requires {benefit.requiredScore} engagement points
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] text-white rounded-lg p-6 text-center">
            <h4 className="font-bold text-lg mb-2">Want More Benefits?</h4>
            <p className="text-white/90 mb-4">
              Upgrade to full membership for unlimited access to all tools and premium content
            </p>
            <Button
              variant="secondary"
              className="bg-white text-[var(--color-energy-600)] hover:bg-white/90"
              onClick={handleUpgrade}
            >
              Upgrade Membership
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  // Widget variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card border border-border rounded-xl p-6 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[var(--color-energy-500)]/10 rounded-lg">
            <Star className="h-5 w-5 text-[var(--color-energy-600)]" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Member Benefits</h3>
            <p className="text-sm text-muted-foreground">
              {membershipData?.engagementScore || 0} engagement points
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          View All
        </Button>
      </div>

      {/* Progress to Next Benefit */}
      {showProgress && nextBenefitProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Next: {nextBenefitProgress.benefit.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {nextBenefitProgress.pointsNeeded} points needed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${nextBenefitProgress.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Quick Benefits List */}
      <div className="space-y-2">
        {unlockedBenefits.slice(0, 3).map((benefit) => {
          const IconComponent = categoryIcons[benefit.category]
          return (
            <div
              key={benefit.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleBenefitClick(benefit.id)}
            >
              <div className="p-1 bg-[var(--color-energy-500)]/10 rounded">
                <IconComponent className="h-4 w-4 text-[var(--color-energy-600)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {benefit.title}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <SoftMemberBenefits variant="modal" />
    </motion.div>
  )
}