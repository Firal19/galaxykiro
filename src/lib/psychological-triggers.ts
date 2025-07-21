/**
 * Psychological Triggers Engine
 * 
 * Implements various psychological triggers and persuasion techniques
 * to enhance user engagement and conversion rates.
 */

import { useAppStore } from './store'

// Psychological trigger types
interface TriggerContext {
  userId?: string
  userAgent: string
  referrer: string
  currentPage: string
  timeOnSite: number
  previousInteractions: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  location?: string
}

interface TriggerResult {
  applied: boolean
  triggerType: string
  message: string
  urgency?: 'low' | 'medium' | 'high'
  socialProof?: {
    count: number
    type: 'reviews' | 'users' | 'downloads' | 'testimonials'
  }
  scarcity?: {
    remaining: number
    timeLeft?: number
    type: 'time' | 'quantity' | 'access'
  }
  authority?: {
    credentials: string[]
    endorsements: string[]
    achievements: string[]
  }
}

interface SocialProofData {
  totalUsers: number
  activeUsers: number
  testimonials: number
  successStories: number
  averageRating: number
  recentActivity: Array<{
    type: 'signup' | 'achievement' | 'testimonial'
    timestamp: Date
    description: string
  }>
}

interface ScarcityData {
  totalSpots: number
  remainingSpots: number
  timeUntilExpiry: number
  accessLevel: 'basic' | 'premium' | 'exclusive'
  waitlistSize: number
}

interface AuthorityData {
  credentials: string[]
  certifications: string[]
  awards: string[]
  mediaMentions: string[]
  clientList: string[]
  yearsExperience: number
}

class PsychologicalTriggersEngine {
  private socialProofData: SocialProofData
  private scarcityData: ScarcityData
  private authorityData: AuthorityData

  constructor() {
    this.initializeData()
  }

  /**
   * Initialize default psychological trigger data
   */
  private initializeData(): void {
    this.socialProofData = {
      totalUsers: 15420,
      activeUsers: 8920,
      testimonials: 342,
      successStories: 156,
      averageRating: 4.8,
      recentActivity: [
        {
          type: 'signup',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          description: 'Sarah from Toronto just joined'
        },
        {
          type: 'achievement',
          timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
          description: 'Mike completed his first assessment'
        },
        {
          type: 'testimonial',
          timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
          description: 'Jennifer left a 5-star review'
        }
      ]
    }

    this.scarcityData = {
      totalSpots: 100,
      remainingSpots: 23,
      timeUntilExpiry: 3600, // 1 hour in seconds
      accessLevel: 'premium',
      waitlistSize: 45
    }

    this.authorityData = {
      credentials: [
        'Certified Professional Coach (ICF)',
        'Master's in Organizational Psychology',
        '15+ Years Leadership Development'
      ],
      certifications: [
        'Gallup Strengths Coach',
        'DISC Certified Trainer',
        'Emotional Intelligence Assessor'
      ],
      awards: [
        'Top 100 Leadership Coaches 2023',
        'Excellence in Professional Development',
        'Innovation in Learning Award'
      ],
      mediaMentions: [
        'Featured in Harvard Business Review',
        'Guest on TEDx Talks',
        'Quoted in Forbes Leadership'
      ],
      clientList: [
        'Fortune 500 Companies',
        'Startup Founders',
        'Government Agencies'
      ],
      yearsExperience: 15
    }
  }

  /**
   * Apply social proof triggers
   */
  applySocialProof(context: TriggerContext): TriggerResult {
    const { currentPage, timeOnSite, previousInteractions } = context

    // Determine if social proof should be shown
    const shouldShow = this.shouldShowSocialProof(context)
    
    if (!shouldShow) {
      return {
        applied: false,
        triggerType: 'social_proof',
        message: ''
      }
    }

    // Select appropriate social proof message
    const message = this.selectSocialProofMessage(context)

    return {
      applied: true,
      triggerType: 'social_proof',
      message,
      socialProof: {
        count: this.socialProofData.activeUsers,
        type: 'users'
      }
    }
  }

  /**
   * Determine if social proof should be shown
   */
  private shouldShowSocialProof(context: TriggerContext): boolean {
    const { currentPage, timeOnSite, previousInteractions } = context

    // Show on homepage for new visitors
    if (currentPage === '/' && previousInteractions === 0) {
      return true
    }

    // Show after 30 seconds on any page
    if (timeOnSite > 30) {
      return true
    }

    // Show on specific conversion pages
    if (['/tools', '/webinars', '/membership'].includes(currentPage)) {
      return true
    }

    return false
  }

  /**
   * Select appropriate social proof message
   */
  private selectSocialProofMessage(context: TriggerContext): string {
    const { currentPage, previousInteractions } = context

    if (previousInteractions === 0) {
      return `Join ${this.socialProofData.totalUsers.toLocaleString()} professionals who've transformed their lives`
    }

    if (currentPage === '/tools') {
      return `${this.socialProofData.activeUsers.toLocaleString()} people are using our tools right now`
    }

    if (currentPage === '/webinars') {
      return `${this.socialProofData.testimonials} professionals have attended our webinars`
    }

    // Default message
    return `${this.socialProofData.activeUsers.toLocaleString()} active users trust our platform`
  }

  /**
   * Apply scarcity triggers
   */
  applyScarcity(context: TriggerContext): TriggerResult {
    const { currentPage, timeOnSite } = context

    // Only show scarcity on specific pages
    if (!['/webinars', '/membership', '/tools'].includes(currentPage)) {
      return {
        applied: false,
        triggerType: 'scarcity',
        message: ''
      }
    }

    // Check if scarcity should be shown
    const shouldShow = this.shouldShowScarcity(context)
    
    if (!shouldShow) {
      return {
        applied: false,
        triggerType: 'scarcity',
        message: ''
      }
    }

    const message = this.selectScarcityMessage(context)

    return {
      applied: true,
      triggerType: 'scarcity',
      message,
      urgency: this.calculateUrgency(),
      scarcity: {
        remaining: this.scarcityData.remainingSpots,
        timeLeft: this.scarcityData.timeUntilExpiry,
        type: 'quantity'
      }
    }
  }

  /**
   * Determine if scarcity should be shown
   */
  private shouldShowScarcity(context: TriggerContext): boolean {
    const { currentPage, timeOnSite } = context

    // Show after user has spent time on page
    if (timeOnSite < 15) {
      return false
    }

    // Show if spots are limited
    if (this.scarcityData.remainingSpots < 50) {
      return true
    }

    // Show if time is running out
    if (this.scarcityData.timeUntilExpiry < 7200) { // Less than 2 hours
      return true
    }

    return false
  }

  /**
   * Select appropriate scarcity message
   */
  private selectScarcityMessage(context: TriggerContext): string {
    const { currentPage } = context

    if (this.scarcityData.remainingSpots < 10) {
      return `Only ${this.scarcityData.remainingSpots} spots remaining!`
    }

    if (this.scarcityData.timeUntilExpiry < 3600) { // Less than 1 hour
      return `Offer expires in ${Math.floor(this.scarcityData.timeUntilExpiry / 60)} minutes`
    }

    if (currentPage === '/webinars') {
      return `${this.scarcityData.remainingSpots} webinar spots available`
    }

    return `${this.scarcityData.remainingSpots} premium spots remaining`
  }

  /**
   * Calculate urgency level
   */
  private calculateUrgency(): 'low' | 'medium' | 'high' {
    if (this.scarcityData.remainingSpots < 5 || this.scarcityData.timeUntilExpiry < 1800) {
      return 'high'
    }
    
    if (this.scarcityData.remainingSpots < 20 || this.scarcityData.timeUntilExpiry < 7200) {
      return 'medium'
    }
    
    return 'low'
  }

  /**
   * Apply authority triggers
   */
  applyAuthority(context: TriggerContext): TriggerResult {
    const { currentPage, timeOnSite } = context

    // Show authority on specific pages
    if (!['/about', '/tools', '/webinars'].includes(currentPage)) {
      return {
        applied: false,
        triggerType: 'authority',
        message: ''
      }
    }

    // Check if authority should be shown
    const shouldShow = this.shouldShowAuthority(context)
    
    if (!shouldShow) {
      return {
        applied: false,
        triggerType: 'authority',
        message: ''
      }
    }

    const message = this.selectAuthorityMessage(context)

    return {
      applied: true,
      triggerType: 'authority',
      message,
      authority: {
        credentials: this.authorityData.credentials,
        endorsements: this.authorityData.mediaMentions,
        achievements: this.authorityData.awards
      }
    }
  }

  /**
   * Determine if authority should be shown
   */
  private shouldShowAuthority(context: TriggerContext): boolean {
    const { currentPage, timeOnSite } = context

    // Show after user has engaged with content
    if (timeOnSite < 30) {
      return false
    }

    // Always show on about page
    if (currentPage === '/about') {
      return true
    }

    // Show on tools page after engagement
    if (currentPage === '/tools' && timeOnSite > 60) {
      return true
    }

    return false
  }

  /**
   * Select appropriate authority message
   */
  private selectAuthorityMessage(context: TriggerContext): string {
    const { currentPage } = context

    if (currentPage === '/about') {
      return `Trusted by ${this.authorityData.clientList.length} organizations worldwide`
    }

    if (currentPage === '/tools') {
      return `Developed by certified professionals with ${this.authorityData.yearsExperience}+ years experience`
    }

    return `Backed by ${this.authorityData.credentials.length} professional certifications`
  }

  /**
   * Apply reciprocity triggers
   */
  applyReciprocity(context: TriggerContext): TriggerResult {
    const { currentPage, previousInteractions } = context

    // Show reciprocity for new users
    if (previousInteractions === 0) {
      return {
        applied: true,
        triggerType: 'reciprocity',
        message: 'Get instant access to our free assessment tools - no registration required'
      }
    }

    // Show for users who haven't engaged much
    if (previousInteractions < 3) {
      return {
        applied: true,
        triggerType: 'reciprocity',
        message: 'Unlock premium content with our free trial - no credit card required'
      }
    }

    return {
      applied: false,
      triggerType: 'reciprocity',
      message: ''
    }
  }

  /**
   * Apply commitment and consistency triggers
   */
  applyCommitmentConsistency(context: TriggerContext): TriggerResult {
    const { currentPage, previousInteractions } = context

    // Show for users who have shown commitment
    if (previousInteractions > 5) {
      return {
        applied: true,
        triggerType: 'commitment_consistency',
        message: 'Continue your journey with our advanced tools and personalized coaching'
      }
    }

    // Show for users who have completed assessments
    if (currentPage === '/tools' && previousInteractions > 2) {
      return {
        applied: true,
        triggerType: 'commitment_consistency',
        message: 'Build on your assessment results with our comprehensive development plan'
      }
    }

    return {
      applied: false,
      triggerType: 'commitment_consistency',
      message: ''
    }
  }

  /**
   * Apply liking triggers
   */
  applyLiking(context: TriggerContext): TriggerResult {
    const { currentPage, timeOnSite } = context

    // Show after user has spent time on site
    if (timeOnSite > 120) { // 2 minutes
      return {
        applied: true,
        triggerType: 'liking',
        message: 'Join our community of like-minded professionals who share your values'
      }
    }

    return {
      applied: false,
      triggerType: 'liking',
      message: ''
    }
  }

  /**
   * Apply consensus triggers
   */
  applyConsensus(context: TriggerContext): TriggerResult {
    const { currentPage } = context

    // Show on conversion pages
    if (['/membership', '/webinars'].includes(currentPage)) {
      return {
        applied: true,
        triggerType: 'consensus',
        message: `${this.socialProofData.activeUsers.toLocaleString()} professionals chose our platform this month`
      }
    }

    return {
      applied: false,
      triggerType: 'consensus',
      message: ''
    }
  }

  /**
   * Get all applicable triggers for a context
   */
  getAllTriggers(context: TriggerContext): TriggerResult[] {
    const triggers: TriggerResult[] = []

    // Apply each trigger type
    const socialProof = this.applySocialProof(context)
    if (socialProof.applied) triggers.push(socialProof)

    const scarcity = this.applyScarcity(context)
    if (scarcity.applied) triggers.push(scarcity)

    const authority = this.applyAuthority(context)
    if (authority.applied) triggers.push(authority)

    const reciprocity = this.applyReciprocity(context)
    if (reciprocity.applied) triggers.push(reciprocity)

    const commitment = this.applyCommitmentConsistency(context)
    if (commitment.applied) triggers.push(commitment)

    const liking = this.applyLiking(context)
    if (liking.applied) triggers.push(liking)

    const consensus = this.applyConsensus(context)
    if (consensus.applied) triggers.push(consensus)

    return triggers
  }

  /**
   * Update trigger data
   */
  updateTriggerData(
    type: 'social_proof' | 'scarcity' | 'authority',
    data: Partial<SocialProofData | ScarcityData | AuthorityData>
  ): void {
    switch (type) {
      case 'social_proof':
        this.socialProofData = { ...this.socialProofData, ...data as Partial<SocialProofData> }
        break
      case 'scarcity':
        this.scarcityData = { ...this.scarcityData, ...data as Partial<ScarcityData> }
        break
      case 'authority':
        this.authorityData = { ...this.authorityData, ...data as Partial<AuthorityData> }
        break
    }
  }

  /**
   * Get trigger statistics
   */
  getTriggerStatistics(): {
    totalTriggersApplied: number
    mostEffectiveTrigger: string
    averageEngagement: number
    conversionRate: number
  } {
    // This would be calculated from actual usage data
    return {
      totalTriggersApplied: 15420,
      mostEffectiveTrigger: 'social_proof',
      averageEngagement: 0.78,
      conversionRate: 0.23
    }
  }
}

// Export singleton instance
export const psychologicalTriggersEngine = new PsychologicalTriggersEngine()

// Hook for React components
export function usePsychologicalTriggers() {
  const store = useAppStore()
  
  return {
    applyTriggers: (context: TriggerContext) => 
      psychologicalTriggersEngine.getAllTriggers(context),
    applySocialProof: (context: TriggerContext) => 
      psychologicalTriggersEngine.applySocialProof(context),
    applyScarcity: (context: TriggerContext) => 
      psychologicalTriggersEngine.applyScarcity(context),
    applyAuthority: (context: TriggerContext) => 
      psychologicalTriggersEngine.applyAuthority(context),
    updateTriggerData: (
      type: 'social_proof' | 'scarcity' | 'authority',
      data: Partial<SocialProofData | ScarcityData | AuthorityData>
    ) => psychologicalTriggersEngine.updateTriggerData(type, data),
    getStatistics: () => psychologicalTriggersEngine.getTriggerStatistics()
  }
}