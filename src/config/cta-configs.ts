import type { EnhancedCTAConfig } from '../types/cta-types'

// Enhanced CTA Configurations with A/B Testing and Psychological Triggers
export const ENHANCED_CTA_CONFIGS: EnhancedCTAConfig[] = [
  // Micro CTAs (Low Commitment)
  {
    id: 'see-your-score',
    text: 'See Your Score',
    description: 'Quick 2-minute assessment',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    psychologicalTriggers: ['curiosity'],
    action: 'open-assessment',
    priority: 10,
    abTestId: 'cta-copy-test',
    conditions: {
      maxEngagementScore: 30,
      minTimeOnPage: 30,
    },
    styling: {
      variant: 'outline',
      size: 'sm',
      className: 'border-blue-200 hover:border-blue-400 text-blue-600'
    },
    variants: {
      control: {
        text: 'See Your Score',
        description: 'Quick 2-minute assessment'
      },
      curiosity: {
        text: 'Discover Your Hidden Potential',
        description: 'What if you\'re only using 10% of your abilities?'
      },
      urgency: {
        text: 'Get Your Score Now',
        description: 'Limited time - see your results instantly'
      },
      'social-proof': {
        text: 'Join 10,000+ Who Discovered Their Score',
        description: 'See why thousands trust our assessment'
      }
    }
  },
  {
    id: 'get-the-answer',
    text: 'Get the Answer',
    description: 'Discover what\'s holding you back',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    psychologicalTriggers: ['curiosity', 'loss-aversion'],
    action: 'reveal-insight',
    priority: 9,
    abTestId: 'cta-color-test',
    conditions: {
      maxEngagementScore: 25,
      requiredSections: ['success-gap', 'change-paradox'],
    },
    styling: {
      variant: 'ghost',
      size: 'sm',
      className: 'text-purple-600 hover:text-purple-800'
    },
    variants: {
      control: {
        styling: { className: 'bg-blue-600 hover:bg-blue-700 text-white' }
      },
      'variant-a': {
        styling: { className: 'bg-orange-600 hover:bg-orange-700 text-white' }
      },
      'variant-b': {
        styling: { className: 'bg-green-600 hover:bg-green-700 text-white' }
      }
    }
  },
  {
    id: 'calculate-now',
    text: 'Calculate Now',
    description: 'Free instant results',
    commitmentLevel: 'micro',
    triggers: ['curiosity', 'urgency'],
    psychologicalTriggers: ['urgency', 'curiosity'],
    action: 'open-calculator',
    priority: 8,
    abTestId: 'cta-timing-test',
    conditions: {
      maxEngagementScore: 35,
      requiredBehaviorPattern: ['explorer', 'action-taker'],
    },
    styling: {
      variant: 'secondary',
      size: 'default',
      className: 'bg-green-50 hover:bg-green-100 text-green-700'
    }
  },
  {
    id: 'save-for-later',
    text: 'Save for Later',
    description: 'Bookmark this assessment',
    commitmentLevel: 'micro',
    triggers: ['personalization'],
    psychologicalTriggers: ['reciprocity', 'commitment'],
    action: 'save-progress',
    priority: 5,
    conditions: {
      minTimeOnPage: 120,
      requiredBehaviorPattern: ['researcher', 'skeptic'],
    },
    styling: {
      variant: 'ghost',
      size: 'sm',
      className: 'text-gray-600 hover:text-gray-800'
    }
  },

  // Midi CTAs (Medium Commitment)
  {
    id: 'get-personalized-report',
    text: 'Get Your Personalized Report',
    description: 'Detailed insights + action plan',
    commitmentLevel: 'midi',
    triggers: ['personalization', 'social-proof'],
    psychologicalTriggers: ['personalization', 'authority'],
    action: 'generate-report',
    priority: 15,
    abTestId: 'cta-placement-test',
    conditions: {
      minEngagementScore: 30,
      maxEngagementScore: 70,
      requiredBehaviorPattern: ['researcher', 'action-taker'],
    },
    styling: {
      variant: 'default',
      size: 'default',
      className: 'bg-blue-600 hover:bg-blue-700'
    }
  },
  {
    id: 'join-free-webinar',
    text: 'Join Free Webinar',
    description: '90-min live training + Q&A',
    commitmentLevel: 'midi',
    triggers: ['social-proof', 'urgency'],
    psychologicalTriggers: ['social-proof', 'scarcity', 'reciprocity'],
    action: 'register-webinar',
    priority: 14,
    conditions: {
      minEngagementScore: 25,
      maxEngagementScore: 65,
      minTimeOnPage: 180,
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-purple-600 hover:bg-purple-700'
    }
  },
  {
    id: 'download-guide',
    text: 'Download the Guide',
    description: 'Complete transformation roadmap',
    commitmentLevel: 'midi',
    triggers: ['personalization'],
    psychologicalTriggers: ['reciprocity', 'authority'],
    action: 'download-resource',
    priority: 12,
    conditions: {
      minEngagementScore: 35,
      requiredBehaviorPattern: ['researcher'],
      requiredSections: ['vision-void', 'leadership-lever'],
    },
    styling: {
      variant: 'outline',
      size: 'default',
      className: 'border-green-300 hover:border-green-500 text-green-700'
    }
  },
  {
    id: 'start-7-day-challenge',
    text: 'Start Your 7-Day Challenge',
    description: 'Daily actions for transformation results',
    commitmentLevel: 'midi',
    triggers: ['urgency', 'social-proof'],
    psychologicalTriggers: ['commitment', 'social-proof'],
    action: 'join-challenge',
    priority: 13,
    conditions: {
      minEngagementScore: 40,
      requiredBehaviorPattern: ['action-taker', 'explorer'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-orange-600 hover:bg-orange-700'
    }
  },

  // Macro CTAs (High Commitment)
  {
    id: 'book-transformation-session',
    text: 'Book Your Transformation Session',
    description: 'Personal 1-on-1 consultation',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'scarcity'],
    psychologicalTriggers: ['scarcity', 'authority', 'personalization'],
    action: 'schedule-consultation',
    priority: 20,
    conditions: {
      minEngagementScore: 70,
      requiredTier: ['soft-member'],
      requiredBehaviorPattern: ['action-taker'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-red-600 hover:bg-red-700 text-white font-semibold'
    }
  },
  {
    id: 'visit-our-office',
    text: 'Visit Our Office',
    description: 'In-person consultation in Addis Ababa',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'social-proof'],
    psychologicalTriggers: ['authority', 'social-proof'],
    action: 'schedule-office-visit',
    priority: 18,
    conditions: {
      minEngagementScore: 60,
      requiredTier: ['engaged', 'soft-member'],
    },
    styling: {
      variant: 'outline',
      size: 'lg',
      className: 'border-red-300 hover:border-red-500 text-red-700 font-medium'
    }
  },
  {
    id: 'apply-for-program',
    text: 'Apply for the Program',
    description: 'Exclusive transformation program',
    commitmentLevel: 'macro',
    triggers: ['scarcity', 'social-proof'],
    psychologicalTriggers: ['scarcity', 'authority', 'social-proof'],
    action: 'apply-program',
    priority: 19,
    conditions: {
      minEngagementScore: 80,
      requiredTier: ['soft-member'],
      minTimeOnPage: 600,
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold'
    }
  },
  {
    id: 'transform-your-life',
    text: 'Transform Your Life',
    description: 'Complete life transformation system',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'urgency'],
    psychologicalTriggers: ['loss-aversion', 'commitment', 'personalization'],
    action: 'full-transformation',
    priority: 17,
    conditions: {
      minEngagementScore: 75,
      requiredBehaviorPattern: ['action-taker'],
      requiredSections: ['decision-door'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold'
    }
  }
]