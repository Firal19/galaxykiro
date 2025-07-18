interface EducationContent {
  id: string
  title: string
  type: 'article' | 'video' | 'exercise' | 'assessment' | 'challenge'
  category: 'mindset' | 'skills' | 'habits' | 'relationships' | 'career' | 'health'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // minutes
  content: string
  actionItems: string[]
  relatedTools: string[]
  prerequisites?: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  totalContent: number
  estimatedDuration: number // days
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  contentIds: string[]
  milestones: Array<{
    id: string
    title: string
    description: string
    contentIds: string[]
    requiredCompletion: number // percentage
  }>
}

interface UserProgress {
  userId: string
  contentCompleted: string[]
  currentLearningPaths: string[]
  completedLearningPaths: string[]
  streakDays: number
  lastActiveDate: string
  preferences: {
    categories: string[]
    difficulty: string
    timePerDay: number
    preferredTypes: string[]
    deliveryTime: string // "morning" | "afternoon" | "evening"
  }
  engagementScore: number
}

interface DeliverySchedule {
  userId: string
  contentId: string
  scheduledFor: string
  deliveryMethod: 'email' | 'push' | 'in-app'
  status: 'scheduled' | 'delivered' | 'opened' | 'completed'
  personalizedMessage?: string
}

class ContinuousEducationEngine {
  private content: EducationContent[] = []
  private learningPaths: LearningPath[] = []
  private userProgress: Map<string, UserProgress> = new Map()

  constructor() {
    this.initializeContent()
    this.initializeLearningPaths()
  }

  private initializeContent() {
    // Sample content - in production, this would come from a CMS or database
    this.content = [
      {
        id: 'mindset-001',
        title: 'The Growth Mindset Foundation',
        type: 'article',
        category: 'mindset',
        difficulty: 'beginner',
        estimatedTime: 5,
        content: `
          The foundation of all personal development starts with your mindset. 
          A growth mindset believes that abilities and intelligence can be developed 
          through dedication, hard work, and learning from failure.
          
          Key principles:
          1. Challenges are opportunities to grow
          2. Effort is the path to mastery
          3. Feedback is a gift
          4. Setbacks are temporary
          
          Today's reflection: Think of a recent challenge you faced. 
          How can you reframe it as a growth opportunity?
        `,
        actionItems: [
          'Identify one fixed mindset belief you hold',
          'Write down three ways you can grow from a recent setback',
          'Practice saying "I can't do this YET" instead of "I can't do this"'
        ],
        relatedTools: ['mindset-assessment', 'growth-tracker'],
        tags: ['mindset', 'growth', 'foundation'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'habits-001',
        title: 'The 2-Minute Rule for Building Habits',
        type: 'exercise',
        category: 'habits',
        difficulty: 'beginner',
        estimatedTime: 10,
        content: `
          The 2-Minute Rule: When you start a new habit, it should take less than 2 minutes to do.
          
          This isn't about the habit itself, but about establishing the identity of someone who does that habit.
          
          Examples:
          - "Read 30 pages" becomes "Read one page"
          - "Exercise for 30 minutes" becomes "Put on workout clothes"
          - "Meditate for 10 minutes" becomes "Sit in meditation position"
          
          The goal is to make it as easy as possible to start, then let momentum carry you forward.
        `,
        actionItems: [
          'Choose one habit you want to build',
          'Scale it down to a 2-minute version',
          'Do the 2-minute version for 7 days straight',
          'Track your consistency'
        ],
        relatedTools: ['habit-tracker', 'momentum-builder'],
        tags: ['habits', 'consistency', 'momentum'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'skills-001',
        title: 'The Art of Deep Work',
        type: 'video',
        category: 'skills',
        difficulty: 'intermediate',
        estimatedTime: 15,
        content: `
          Deep work is the ability to focus without distraction on cognitively demanding tasks. 
          It's a skill that allows you to quickly master complicated information and produce 
          better results in less time.
          
          Four strategies for deep work:
          1. Monastic: Complete isolation from distractions
          2. Bimodal: Alternating between deep work and collaboration
          3. Rhythmic: Establishing a regular routine
          4. Journalistic: Switching into deep work mode at any moment
          
          Today's practice: Choose one strategy and implement it for 25 minutes.
        `,
        actionItems: [
          'Identify your biggest distractions',
          'Choose a deep work strategy that fits your lifestyle',
          'Schedule one deep work session today',
          'Measure your focus quality (1-10 scale)'
        ],
        relatedTools: ['focus-tracker', 'distraction-blocker'],
        tags: ['focus', 'productivity', 'deep-work'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  private initializeLearningPaths() {
    this.learningPaths = [
      {
        id: 'foundation-path',
        title: 'Personal Development Foundation',
        description: 'Build the core mindsets and habits for lifelong growth',
        category: 'foundation',
        totalContent: 10,
        estimatedDuration: 30,
        difficulty: 'beginner',
        contentIds: ['mindset-001', 'habits-001'],
        milestones: [
          {
            id: 'milestone-1',
            title: 'Mindset Mastery',
            description: 'Develop a growth-oriented mindset',
            contentIds: ['mindset-001'],
            requiredCompletion: 100
          },
          {
            id: 'milestone-2',
            title: 'Habit Foundation',
            description: 'Build your first keystone habit',
            contentIds: ['habits-001'],
            requiredCompletion: 100
          }
        ]
      },
      {
        id: 'productivity-path',
        title: 'Peak Performance & Productivity',
        description: 'Master focus, time management, and high-performance habits',
        category: 'productivity',
        totalContent: 15,
        estimatedDuration: 45,
        difficulty: 'intermediate',
        contentIds: ['skills-001'],
        milestones: [
          {
            id: 'milestone-1',
            title: 'Deep Work Mastery',
            description: 'Develop the ability to focus intensely',
            contentIds: ['skills-001'],
            requiredCompletion: 100
          }
        ]
      }
    ]
  }

  // Content recommendation engine
  getPersonalizedContent(userId: string, limit: number = 3): EducationContent[] {
    const progress = this.userProgress.get(userId)
    if (!progress) return this.getDefaultContent(limit)

    const { preferences, contentCompleted, engagementScore } = progress

    // Filter content based on preferences and completion status
    let availableContent = this.content.filter(content => {
      // Skip completed content
      if (contentCompleted.includes(content.id)) return false
      
      // Match user preferences
      if (preferences.categories.length > 0 && !preferences.categories.includes(content.category)) return false
      if (preferences.difficulty && content.difficulty !== preferences.difficulty) return false
      if (preferences.preferredTypes.length > 0 && !preferences.preferredTypes.includes(content.type)) return false
      if (content.estimatedTime > preferences.timePerDay) return false

      return true
    })

    // Sort by relevance (engagement score, difficulty progression, etc.)
    availableContent = availableContent.sort((a, b) => {
      // Prioritize content that matches engagement level
      const aScore = this.calculateContentRelevance(a, progress)
      const bScore = this.calculateContentRelevance(b, progress)
      return bScore - aScore
    })

    return availableContent.slice(0, limit)
  }

  private calculateContentRelevance(content: EducationContent, progress: UserProgress): number {
    let score = 0

    // Category preference match
    if (progress.preferences.categories.includes(content.category)) score += 10

    // Type preference match
    if (progress.preferences.preferredTypes.includes(content.type)) score += 5

    // Difficulty progression
    const difficultyScore: Record<string, number> = {
      beginner: progress.engagementScore < 50 ? 10 : 5,
      intermediate: progress.engagementScore >= 50 && progress.engagementScore < 150 ? 10 : 5,
      advanced: progress.engagementScore >= 150 ? 10 : 2
    }
    score += difficultyScore[content.difficulty]

    // Time availability match
    if (content.estimatedTime <= progress.preferences.timePerDay) score += 5

    // Recency (newer content gets slight boost)
    const daysSinceCreated = (Date.now() - new Date(content.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 7) score += 3

    return score
  }

  private getDefaultContent(limit: number): EducationContent[] {
    return this.content
      .filter(content => content.difficulty === 'beginner')
      .slice(0, limit)
  }

  // Learning path management
  enrollInLearningPath(userId: string, pathId: string): boolean {
    const progress = this.userProgress.get(userId)
    if (!progress) return false

    const path = this.learningPaths.find(p => p.id === pathId)
    if (!path) return false

    if (!progress.currentLearningPaths.includes(pathId)) {
      progress.currentLearningPaths.push(pathId)
      this.userProgress.set(userId, progress)
    }

    return true
  }

  getLearningPathProgress(userId: string, pathId: string): {
    path: LearningPath
    completionPercentage: number
    currentMilestone: string | null
    nextContent: EducationContent | null
  } | null {
    const progress = this.userProgress.get(userId)
    const path = this.learningPaths.find(p => p.id === pathId)
    
    if (!progress || !path) return null

    const completedContent = path.contentIds.filter(id => progress.contentCompleted.includes(id))
    const completionPercentage = (completedContent.length / path.contentIds.length) * 100

    // Find current milestone
    let currentMilestone = null
    for (const milestone of path.milestones) {
      const milestoneCompleted = milestone.contentIds.filter(id => progress.contentCompleted.includes(id))
      const milestoneProgress = (milestoneCompleted.length / milestone.contentIds.length) * 100
      
      if (milestoneProgress < milestone.requiredCompletion) {
        currentMilestone = milestone.id
        break
      }
    }

    // Find next content
    const nextContentId = path.contentIds.find(id => !progress.contentCompleted.includes(id))
    const nextContent = nextContentId ? this.content.find(c => c.id === nextContentId) || null : null

    return {
      path,
      completionPercentage,
      currentMilestone,
      nextContent
    }
  }

  // Content delivery scheduling
  scheduleContentDelivery(userId: string, contentId: string, deliveryTime: Date, method: 'email' | 'push' | 'in-app'): DeliverySchedule {
    const progress = this.userProgress.get(userId)
    const content = this.content.find(c => c.id === contentId)
    
    if (!progress || !content) {
      throw new Error('User or content not found')
    }

    // Generate personalized message based on user progress and content
    const personalizedMessage = this.generatePersonalizedMessage(progress, content)

    const schedule: DeliverySchedule = {
      userId,
      contentId,
      scheduledFor: deliveryTime.toISOString(),
      deliveryMethod: method,
      status: 'scheduled',
      personalizedMessage
    }

    return schedule
  }

  private generatePersonalizedMessage(progress: UserProgress, content: EducationContent): string {
    const { streakDays, engagementScore } = progress
    const timeOfDay = progress.preferences.deliveryTime

    let greeting = ''
    switch (timeOfDay) {
      case 'morning':
        greeting = 'Good morning! Ready to start your day with growth?'
        break
      case 'afternoon':
        greeting = 'Good afternoon! Time for a quick learning break.'
        break
      case 'evening':
        greeting = 'Good evening! Let\'s end the day with some insights.'
        break
      default:
        greeting = 'Hello!'
    }

    let motivationalNote = ''
    if (streakDays > 0) {
      motivationalNote = `You're on a ${streakDays}-day learning streak! 🔥`
    } else if (engagementScore > 100) {
      motivationalNote = 'You\'re making excellent progress on your growth journey!'
    } else {
      motivationalNote = 'Every small step counts toward your transformation.'
    }

    return `${greeting} ${motivationalNote} Today's ${content.type}: "${content.title}" - estimated time: ${content.estimatedTime} minutes.`
  }

  // Progress tracking
  markContentCompleted(userId: string, contentId: string): void {
    const progress = this.userProgress.get(userId)
    if (!progress) return

    if (!progress.contentCompleted.includes(contentId)) {
      progress.contentCompleted.push(contentId)
      progress.engagementScore += 10 // Award points for completion
      progress.lastActiveDate = new Date().toISOString()
      
      // Update streak
      const lastActive = new Date(progress.lastActiveDate)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= 1) {
        progress.streakDays += 1
      } else {
        progress.streakDays = 1
      }

      this.userProgress.set(userId, progress)
    }
  }

  // User management
  initializeUser(userId: string, preferences: UserProgress['preferences']): void {
    const progress: UserProgress = {
      userId,
      contentCompleted: [],
      currentLearningPaths: [],
      completedLearningPaths: [],
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      preferences,
      engagementScore: 0
    }

    this.userProgress.set(userId, progress)
  }

  updateUserPreferences(userId: string, preferences: Partial<UserProgress['preferences']>): void {
    const progress = this.userProgress.get(userId)
    if (!progress) return

    progress.preferences = { ...progress.preferences, ...preferences }
    this.userProgress.set(userId, progress)
  }

  getUserStats(userId: string): {
    contentCompleted: number
    streakDays: number
    engagementScore: number
    activeLearningPaths: number
    completedLearningPaths: number
  } | null {
    const progress = this.userProgress.get(userId)
    if (!progress) return null

    return {
      contentCompleted: progress.contentCompleted.length,
      streakDays: progress.streakDays,
      engagementScore: progress.engagementScore,
      activeLearningPaths: progress.currentLearningPaths.length,
      completedLearningPaths: progress.completedLearningPaths.length
    }
  }

  // Content management
  addContent(content: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `content-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    const newContent: EducationContent = {
      ...content,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.content.push(newContent)
    return id
  }

  getContentById(contentId: string): EducationContent | null {
    return this.content.find(c => c.id === contentId) || null
  }

  searchContent(query: string, filters?: {
    category?: string
    type?: string
    difficulty?: string
  }): EducationContent[] {
    let results = this.content.filter(content => 
      content.title.toLowerCase().includes(query.toLowerCase()) ||
      content.content.toLowerCase().includes(query.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )

    if (filters) {
      if (filters.category) {
        results = results.filter(c => c.category === filters.category)
      }
      if (filters.type) {
        results = results.filter(c => c.type === filters.type)
      }
      if (filters.difficulty) {
        results = results.filter(c => c.difficulty === filters.difficulty)
      }
    }

    return results
  }
}

// Singleton instance
export const continuousEducationEngine = new ContinuousEducationEngine()

// Helper functions for external use
export function getPersonalizedContent(userId: string, limit?: number) {
  return continuousEducationEngine.getPersonalizedContent(userId, limit)
}

export function markContentCompleted(userId: string, contentId: string) {
  return continuousEducationEngine.markContentCompleted(userId, contentId)
}

export function initializeUserEducation(userId: string, preferences: UserProgress['preferences']) {
  return continuousEducationEngine.initializeUser(userId, preferences)
}

export function getUserEducationStats(userId: string) {
  return continuousEducationEngine.getUserStats(userId)
}

export function enrollInPath(userId: string, pathId: string) {
  return continuousEducationEngine.enrollInLearningPath(userId, pathId)
}

export function getPathProgress(userId: string, pathId: string) {
  return continuousEducationEngine.getLearningPathProgress(userId, pathId)
}

export type { EducationContent, LearningPath, UserProgress, DeliverySchedule }