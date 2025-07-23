// Enhanced CTA Types
export type PsychologicalTrigger = 
  | 'curiosity'
  | 'urgency'
  | 'social-proof'
  | 'personalization'
  | 'scarcity'
  | 'authority'
  | 'reciprocity'
  | 'commitment'
  | 'loss-aversion'
  | 'anchoring'
export type CTACommitmentLevel = 'micro' | 'midi' | 'macro'
export type CTATrigger = 'curiosity' | 'urgency' | 'social-proof' | 'personalization' | 'scarcity'

export interface EnhancedCTAConfig {
  id: string
  text: string
  description?: string
  commitmentLevel: CTACommitmentLevel
  triggers: CTATrigger[]
  action: string
  priority: number
  abTestId?: string
  psychologicalTriggers: PsychologicalTrigger[]
  conditions: {
    minEngagementScore?: number
    maxEngagementScore?: number
    requiredBehaviorPattern?: string[]
    requiredTier?: string[]
    minTimeOnPage?: number
    requiredSections?: string[]
    excludeIfCompleted?: string[]
  }
  styling: {
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
  }
  variants?: {
    [key: string]: {
      text?: string
      description?: string
      styling?: Partial<EnhancedCTAConfig['styling']>
    }
  }
}

export interface EnhancedCTAProps {
  context?: string
  maxCTAs?: number
  layout?: 'horizontal' | 'vertical' | 'grid'
  showDescription?: boolean
  showBadges?: boolean
  showPsychologicalTriggers?: boolean
  enableABTesting?: boolean
  className?: string
  onCTAClick?: (ctaId: string, action: string, variant?: string) => void
}