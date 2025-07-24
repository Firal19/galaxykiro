/**
 * Soft Member Nurturing System
 * Based on Galaxy Dream Team Master Project Plan
 * Implements progressive chunk-based learning and engagement
 */

import { leadScoringService, VisitorStatus } from './lead-scoring-service'

export type NurturingStage = 'onboarding' | 'foundation' | 'growth' | 'mastery' | 'transformation'
export type ChunkType = 'concept' | 'exercise' | 'reflection' | 'application' | 'assessment' | 'milestone'
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered'

export interface NurturingChunk {
  id: string
  title: string
  description: string
  type: ChunkType
  stage: NurturingStage
  order: number
  
  // Content Structure
  content: {
    hook: string
    insight: string
    application: string
    hungerBuilder: string
    nextStep: string
    mainContent: string
  }
  
  // Learning Requirements
  prerequisites: string[]
  estimatedTime: number // in minutes
  difficultyLevel: 1 | 2 | 3 | 4 | 5
  
  // Engagement Elements
  interactionElements: InteractionElement[]
  reflectionPrompts: string[]
  actionItems: ActionItem[]
  
  // Progress Tracking
  completionCriteria: CompletionCriteria
  rewards: ChunkReward[]
  
  // Personalization
  visitorStatusRequired: VisitorStatus
  personalityTypes: string[] // Which personality types this chunk is optimized for
  learningStyles: string[] // Visual, auditory, kinesthetic, reading
  
  // Metadata
  tags: string[]
  category: string
  createdAt: string
  updatedAt: string
}

export interface InteractionElement {
  id: string
  type: 'quiz' | 'poll' | 'reflection' | 'action_plan' | 'progress_check' | 'peer_discussion'
  title: string
  content: string
  options?: string[]
  correctAnswer?: string
  points: number
  required: boolean
}

export interface ActionItem {
  id: string
  title: string
  description: string
  estimatedTime: number
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  category: 'habit' | 'exercise' | 'reflection' | 'practice' | 'research'
}

export interface CompletionCriteria {
  minimumTimeSpent: number // in minutes
  requiredInteractions: string[] // IDs of required interaction elements
  requiredActionItems: string[] // IDs of required action items
  minimumScore?: number // For assessments
  reflectionRequired: boolean
}

export interface ChunkReward {
  id: string
  type: 'points' | 'badge' | 'unlock' | 'access' | 'recognition'
  value: number | string
  description: string
  icon?: string
}

export interface MemberProgress {
  memberId: string
  chunkId: string
  status: CompletionStatus
  
  // Progress Details
  timeSpent: number
  completedInteractions: string[]
  completedActionItems: string[]
  reflectionNotes: string[]
  score?: number
  
  // Timestamps
  startedAt: string
  lastAccessedAt: string
  completedAt?: string
  
  // Engagement Metrics
  engagementScore: number
  strugglingAreas: string[]
  strengths: string[]
}

export interface NurturingPath {
  id: string
  name: string
  description: string
  stages: NurturingStage[]
  totalChunks: number
  estimatedDuration: number // in days
  targetAudience: VisitorStatus[]
  
  // Personalization
  personalityAdaptations: Record<string, string[]> // personality type -> chunk modifications
  learningStyleAdaptations: Record<string, string[]>
  
  // Success Metrics
  completionRate: number
  averageEngagement: number
  conversionRate: number // to next visitor status
}

class SoftMemberNurturingService {
  private static instance: SoftMemberNurturingService
  private memberProgress: Map<string, MemberProgress[]> = new Map()
  private nurturingPaths: Map<string, NurturingPath> = new Map()

  private constructor() {
    this.initializeNurturingPaths()
  }

  public static getInstance(): SoftMemberNurturingService {
    if (!SoftMemberNurturingService.instance) {
      SoftMemberNurturingService.instance = new SoftMemberNurturingService()
    }
    return SoftMemberNurturingService.instance
  }

  /**
   * Initialize default nurturing paths
   */
  private initializeNurturingPaths(): void {
    const coldLeadPath: NurturingPath = {
      id: 'cold_lead_journey',
      name: 'Cold Lead Discovery Journey',
      description: 'Transform from interested visitor to engaged prospect',
      stages: ['onboarding', 'foundation', 'growth'],
      totalChunks: 12,
      estimatedDuration: 21, // 3 weeks
      targetAudience: ['cold_lead'],
      personalityAdaptations: {
        'analytical': ['data-driven chunks', 'research-heavy content'],
        'creative': ['visual content', 'creative exercises'],
        'social': ['community elements', 'peer discussions'],
        'practical': ['action-oriented chunks', 'real-world applications']
      },
      learningStyleAdaptations: {
        'visual': ['infographics', 'video content', 'visual exercises'],
        'auditory': ['audio content', 'discussion prompts'],
        'kinesthetic': ['hands-on exercises', 'movement-based activities'],
        'reading': ['text-heavy content', 'written reflections']
      },
      completionRate: 0.78,
      averageEngagement: 82.3,
      conversionRate: 0.45 // 45% convert to candidate status
    }

    const candidatePath: NurturingPath = {
      id: 'candidate_development',
      name: 'Candidate Development Program',
      description: 'Deepen understanding and build advanced skills',
      stages: ['foundation', 'growth', 'mastery'],
      totalChunks: 18,
      estimatedDuration: 35, // 5 weeks
      targetAudience: ['candidate'],
      personalityAdaptations: {
        'analytical': ['advanced frameworks', 'systems thinking'],
        'creative': ['innovation exercises', 'creative problem solving'],
        'social': ['leadership content', 'influence training'],
        'practical': ['implementation guides', 'case studies']
      },
      learningStyleAdaptations: {
        'visual': ['complex diagrams', 'process flows'],
        'auditory': ['expert interviews', 'guided meditations'],
        'kinesthetic': ['simulation exercises', 'role-playing'],
        'reading': ['research papers', 'detailed analyses']
      },
      completionRate: 0.85,
      averageEngagement: 89.1,
      conversionRate: 0.62 // 62% convert to hot lead status
    }

    this.nurturingPaths.set(coldLeadPath.id, coldLeadPath)
    this.nurturingPaths.set(candidatePath.id, candidatePath)
  }

  /**
   * Get personalized nurturing path for a member
   */
  public async getPersonalizedPath(
    memberId: string, 
    visitorStatus: VisitorStatus,
    personalityType?: string,
    learningStyle?: string
  ): Promise<NurturingPath | null> {
    // Find appropriate path based on visitor status
    const availablePaths = Array.from(this.nurturingPaths.values())
      .filter(path => path.targetAudience.includes(visitorStatus))

    if (availablePaths.length === 0) return null

    // For now, return the first matching path
    // In a real implementation, this would consider personality and learning style
    const selectedPath = availablePaths[0]

    // Apply personalizations based on personality and learning style
    if (personalityType && selectedPath.personalityAdaptations[personalityType]) {
      // Modify path based on personality
    }

    if (learningStyle && selectedPath.learningStyleAdaptations[learningStyle]) {
      // Modify path based on learning style
    }

    return selectedPath
  }

  /**
   * Get current chunks for a member
   */
  public async getCurrentChunks(memberId: string): Promise<NurturingChunk[]> {
    // Get member's current progress and visitor status
    const leadProfile = leadScoringService.getCurrentProfile()
    if (!leadProfile) return []

    const personalizedPath = await this.getPersonalizedPath(memberId, leadProfile.status)
    if (!personalizedPath) return []

    // Get member's progress
    const progress = this.memberProgress.get(memberId) || []
    
    // Determine next chunks based on completion status
    const availableChunks = this.getAvailableChunks(personalizedPath, progress)
    
    return availableChunks.slice(0, 3) // Return next 3 chunks
  }

  /**
   * Get available chunks based on prerequisites and progress
   */
  private getAvailableChunks(path: NurturingPath, progress: MemberProgress[]): NurturingChunk[] {
    // This would typically fetch from database
    // For now, return mock chunks
    return this.generateMockChunks(path, progress)
  }

  /**
   * Generate mock chunks for demonstration
   */
  private generateMockChunks(path: NurturingPath, progress: MemberProgress[]): NurturingChunk[] {
    const completedChunkIds = progress
      .filter(p => p.status === 'completed')
      .map(p => p.chunkId)

    const mockChunks: NurturingChunk[] = [
      {
        id: 'chunk_welcome',
        title: 'Welcome to Your Transformation Journey',
        description: 'Set the foundation for your personal growth adventure',
        type: 'concept',
        stage: 'onboarding',
        order: 1,
        content: {
          hook: 'You\'ve taken the first step into a journey that millions dream of but few actually begin.',
          insight: 'Research shows that people who actively engage in structured personal development are 10x more likely to achieve their life goals.',
          application: 'Complete your personal assessment and create your transformation roadmap.',
          hungerBuilder: 'Imagine where you\'ll be in 90 days with the right system and support.',
          nextStep: 'Complete your Welcome Assessment to personalize your journey.',
          mainContent: `# Welcome to Your Transformation Journey

You've made a decision that will change everything. Not because this program is magic, but because you've decided to invest in the most important person in your life: you.

## What Makes This Different

Unlike generic self-help content, your journey is:
- **Personalized** to your unique situation and goals
- **Progressive** with each step building on the last
- **Practical** with immediate action steps
- **Proven** by thousands of successful transformations

## Your Journey Ahead

Over the next few weeks, you'll discover:
1. Your hidden potential and biggest growth opportunities
2. A clear vision of your ideal future
3. Daily habits that compound into extraordinary results
4. The mindset shifts that make everything easier

## What's Expected

- **15-20 minutes daily** for content and exercises
- **Weekly reflection** to track your progress
- **Action steps** to apply what you learn
- **Community engagement** for support and accountability

Ready to begin?`
        },
        prerequisites: [],
        estimatedTime: 15,
        difficultyLevel: 1,
        interactionElements: [
          {
            id: 'welcome_quiz',
            type: 'quiz',
            title: 'Journey Readiness Assessment',
            content: 'How ready are you to commit to your transformation?',
            options: [
              'Extremely ready - I\'m all in',
              'Very ready - I\'m committed',
              'Somewhat ready - I\'ll try my best',
              'Not sure - just exploring'
            ],
            points: 10,
            required: true
          }
        ],
        reflectionPrompts: [
          'What brought you to this moment of deciding to transform your life?',
          'What would success look like for you in 90 days?',
          'What past attempts at change have you made, and what did you learn?'
        ],
        actionItems: [
          {
            id: 'action_vision',
            title: 'Write Your 90-Day Vision',
            description: 'Spend 10 minutes writing about where you want to be in 90 days',
            estimatedTime: 10,
            priority: 'high',
            category: 'reflection'
          }
        ],
        completionCriteria: {
          minimumTimeSpent: 10,
          requiredInteractions: ['welcome_quiz'],
          requiredActionItems: ['action_vision'],
          reflectionRequired: true
        },
        rewards: [
          {
            id: 'welcome_badge',
            type: 'badge',
            value: 'Journey Starter',
            description: 'You\'ve officially begun your transformation journey!',
            icon: '🚀'
          },
          {
            id: 'welcome_points',
            type: 'points',
            value: 50,
            description: 'Engagement points for completing your welcome'
          }
        ],
        visitorStatusRequired: 'cold_lead',
        personalityTypes: ['all'],
        learningStyles: ['all'],
        tags: ['onboarding', 'foundation', 'mindset'],
        category: 'untapped-you',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'chunk_potential_discovery',
        title: 'Discover Your Hidden Potential',
        description: 'Uncover the 90% of your capabilities you\'re not using',
        type: 'assessment',
        stage: 'foundation',
        order: 2,
        content: {
          hook: 'Most people die with their music still inside them. Today, we change that.',
          insight: 'Neuroscience reveals that the average person uses less than 10% of their mental capacity - not because they can\'t access more, but because they don\'t know how.',
          application: 'Take the Comprehensive Potential Assessment to map your untapped capabilities.',
          hungerBuilder: 'What if you could double your effectiveness in just 30 days by activating dormant abilities?',
          nextStep: 'Complete your Potential Mapping Assessment.',
          mainContent: `# Your Hidden 90%

The difference between extraordinary people and everyone else isn't talent, intelligence, or luck. It's activation.

## The Potential Paradox

You have capabilities you've never accessed:
- **Cognitive reserves** that can triple your learning speed
- **Emotional intelligence** that transforms your relationships
- **Creative capacity** that solves problems others can't see
- **Physical energy** that sustains peak performance
- **Intuitive wisdom** that guides better decisions

## The Activation Process

Today, you'll discover:
1. Your strongest potential areas
2. Your biggest opportunity gaps  
3. Your personalized activation plan
4. Your first breakthrough exercise

This isn't about becoming someone else. It's about becoming fully yourself.`
        },
        prerequisites: ['chunk_welcome'],
        estimatedTime: 25,
        difficultyLevel: 2,
        interactionElements: [
          {
            id: 'potential_assessment',
            type: 'quiz',
            title: 'Comprehensive Potential Assessment',
            content: 'Evaluate your current potential across 8 key dimensions',
            points: 25,
            required: true
          },
          {
            id: 'activation_plan',
            type: 'action_plan',
            title: 'Personal Activation Plan',
            content: 'Create your customized potential activation strategy',
            points: 15,
            required: true
          }
        ],
        reflectionPrompts: [
          'Which potential area surprised you the most?',
          'What patterns do you see in your underutilized capabilities?',
          'How would activating these potentials change your life?'
        ],
        actionItems: [
          {
            id: 'daily_activation',
            title: 'Daily Activation Practice',
            description: 'Spend 10 minutes daily on your highest-potential area',
            estimatedTime: 10,
            priority: 'high',
            category: 'practice'
          }
        ],
        completionCriteria: {
          minimumTimeSpent: 20,
          requiredInteractions: ['potential_assessment', 'activation_plan'],
          requiredActionItems: ['daily_activation'],
          minimumScore: 80,
          reflectionRequired: true
        },
        rewards: [
          {
            id: 'potential_badge',
            type: 'badge',
            value: 'Potential Explorer',
            description: 'You\'ve mapped your hidden capabilities!',
            icon: '🔓'
          },
          {
            id: 'next_unlock',
            type: 'unlock',
            value: 'Advanced Assessment Tools',
            description: 'Unlocked access to deeper assessment tools'
          }
        ],
        visitorStatusRequired: 'cold_lead',
        personalityTypes: ['all'],
        learningStyles: ['all'],
        tags: ['potential', 'assessment', 'self-discovery'],
        category: 'untapped-you',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Filter out completed chunks and return next available
    return mockChunks.filter(chunk => !completedChunkIds.includes(chunk.id))
  }

  /**
   * Start a chunk for a member
   */
  public async startChunk(memberId: string, chunkId: string): Promise<MemberProgress> {
    const progress: MemberProgress = {
      memberId,
      chunkId,
      status: 'in_progress',
      timeSpent: 0,
      completedInteractions: [],
      completedActionItems: [],
      reflectionNotes: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      engagementScore: 0,
      strugglingAreas: [],
      strengths: []
    }

    // Store progress
    const memberProgressList = this.memberProgress.get(memberId) || []
    memberProgressList.push(progress)
    this.memberProgress.set(memberId, memberProgressList)

    // Track engagement
    await leadScoringService.updateEngagement('content_consumption', {
      content_type: 'nurturing_chunk',
      chunk_id: chunkId,
      action: 'chunk_started'
    })

    return progress
  }

  /**
   * Update chunk progress
   */
  public async updateChunkProgress(
    memberId: string, 
    chunkId: string, 
    updates: Partial<MemberProgress>
  ): Promise<MemberProgress | null> {
    const memberProgressList = this.memberProgress.get(memberId) || []
    const progressIndex = memberProgressList.findIndex(p => p.chunkId === chunkId)
    
    if (progressIndex === -1) return null

    const currentProgress = memberProgressList[progressIndex]
    const updatedProgress = {
      ...currentProgress,
      ...updates,
      lastAccessedAt: new Date().toISOString()
    }

    memberProgressList[progressIndex] = updatedProgress
    this.memberProgress.set(memberId, memberProgressList)

    // Check for completion
    if (updates.status === 'completed') {
      await this.handleChunkCompletion(memberId, chunkId, updatedProgress)
    }

    return updatedProgress
  }

  /**
   * Handle chunk completion
   */
  private async handleChunkCompletion(
    memberId: string, 
    chunkId: string, 
    progress: MemberProgress
  ): Promise<void> {
    // Award rewards
    // Unlock next chunks
    // Update lead scoring
    await leadScoringService.updateEngagement('content_consumption', {
      content_type: 'nurturing_chunk',
      chunk_id: chunkId,
      action: 'chunk_completed',
      time_spent: progress.timeSpent,
      engagement_score: progress.engagementScore
    })

    console.log('🎉 Chunk Completed:', {
      memberId,
      chunkId,
      timeSpent: progress.timeSpent,
      engagementScore: progress.engagementScore
    })
  }

  /**
   * Get member's overall nurturing progress
   */
  public getMemberNurturingStats(memberId: string): {
    totalChunksStarted: number
    totalChunksCompleted: number
    averageEngagement: number
    currentStreak: number
    totalTimeSpent: number
    strengthAreas: string[]
    improvementAreas: string[]
  } {
    const memberProgressList = this.memberProgress.get(memberId) || []
    
    const completed = memberProgressList.filter(p => p.status === 'completed')
    const totalTime = memberProgressList.reduce((sum, p) => sum + p.timeSpent, 0)
    const avgEngagement = memberProgressList.length > 0 
      ? memberProgressList.reduce((sum, p) => sum + p.engagementScore, 0) / memberProgressList.length 
      : 0

    // Calculate current streak (consecutive days with activity)
    const currentStreak = this.calculateCurrentStreak(memberProgressList)

    // Aggregate strengths and improvement areas
    const allStrengths = memberProgressList.flatMap(p => p.strengths)
    const allStrugglingAreas = memberProgressList.flatMap(p => p.strugglingAreas)

    return {
      totalChunksStarted: memberProgressList.length,
      totalChunksCompleted: completed.length,
      averageEngagement: Math.round(avgEngagement * 10) / 10,
      currentStreak,
      totalTimeSpent: totalTime,
      strengthAreas: [...new Set(allStrengths)],
      improvementAreas: [...new Set(allStrugglingAreas)]
    }
  }

  /**
   * Calculate current activity streak
   */
  private calculateCurrentStreak(progressList: MemberProgress[]): number {
    if (progressList.length === 0) return 0

    // Sort by last accessed date
    const sortedProgress = progressList.sort((a, b) => 
      new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    )

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const progress of sortedProgress) {
      const progressDate = new Date(progress.lastAccessedAt)
      progressDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }

    return streak
  }

  /**
   * Get recommended next actions for member
   */
  public getRecommendedActions(memberId: string): {
    primary: string
    secondary: string[]
    urgentItems: ActionItem[]
  } {
    const stats = this.getMemberNurturingStats(memberId)
    const memberProgressList = this.memberProgress.get(memberId) || []
    
    let primary = 'Continue your transformation journey'
    const secondary: string[] = []
    const urgentItems: ActionItem[] = []

    // Generate personalized recommendations
    if (stats.currentStreak === 0) {
      primary = 'Jump back into your journey - your transformation is waiting!'
      secondary.push('Review your last completed chunk')
      secondary.push('Set a daily learning reminder')
    } else if (stats.currentStreak < 3) {
      primary = 'Build momentum with consistent daily progress'
      secondary.push('Complete today\'s chunk')
      secondary.push('Share your progress with the community')
    } else {
      primary = 'You\'re on fire! Keep the momentum going'
      secondary.push('Challenge yourself with advanced content')
      secondary.push('Mentor someone starting their journey')
    }

    // Add improvement recommendations
    if (stats.improvementAreas.length > 0) {
      secondary.push(`Focus on improving: ${stats.improvementAreas.join(', ')}`)
    }

    return {
      primary,
      secondary,
      urgentItems
    }
  }
}

// Export singleton instance
export const softMemberNurturingService = SoftMemberNurturingService.getInstance()

// Export types for use in components
export type {
  NurturingChunk,
  MemberProgress,
  NurturingPath,
  InteractionElement,
  ActionItem,
  ChunkReward
}