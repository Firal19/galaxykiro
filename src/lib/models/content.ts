import { ContentEngagementModel } from './content-engagement'

export type ContentCategory = 
  | 'untapped-you'
  | 'dreams-to-reality'
  | 'daily-edge'
  | 'inner-game'
  | 'multiplier-effect'

export type ContentDepthLevel = 'surface' | 'medium' | 'deep'

export type ContentType = 'article' | 'video' | 'tool' | 'guide' | 'template' | 'audio'

export interface ContentItem {
  id: string
  title: string
  category: ContentCategory
  depthLevel: ContentDepthLevel
  contentType: ContentType
  
  // Value Escalator structure
  hook: string
  insight: string
  application: string
  hungerBuilder: string
  nextStep: string
  
  // Content body
  content: string
  excerpt: string
  
  // Access control
  requiredCaptureLevel: 1 | 2 | 3
  
  // Metadata
  estimatedReadTime: number
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  author: string
  
  // Media
  featuredImage?: string
  videoUrl?: string
  audioUrl?: string
  downloadUrl?: string
  
  // Analytics (calculated)
  viewCount: number
  engagementRate: number
  conversionRate: number
  
  // SEO
  slug: string
  metaDescription: string
}

export interface ContentCategoryInfo {
  id: ContentCategory
  name: string
  description: string
  icon: string
  color: string
  tagline: string
}

export interface SearchFilters {
  category?: ContentCategory
  depthLevel?: ContentDepthLevel
  contentType?: ContentType
  tags?: string[]
  requiredCaptureLevel?: 1 | 2 | 3
  searchQuery?: string
}

export interface ContentStats {
  totalViews: number
  uniqueUsers: number
  averageTimeSpent: number
  averageScrollDepth: number
  totalInteractions: number
  engagementRate: number
  conversionRate: number
}

export class ContentModel {
  private data: ContentItem

  constructor(data: ContentItem) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get title(): string {
    return this.data.title
  }

  get category(): ContentCategory {
    return this.data.category
  }

  get depthLevel(): ContentDepthLevel {
    return this.data.depthLevel
  }

  get contentType(): ContentType {
    return this.data.contentType
  }

  get hook(): string {
    return this.data.hook
  }

  get insight(): string {
    return this.data.insight
  }

  get application(): string {
    return this.data.application
  }

  get hungerBuilder(): string {
    return this.data.hungerBuilder
  }

  get nextStep(): string {
    return this.data.nextStep
  }

  get content(): string {
    return this.data.content
  }

  get excerpt(): string {
    return this.data.excerpt
  }

  get requiredCaptureLevel(): 1 | 2 | 3 {
    return this.data.requiredCaptureLevel
  }

  get estimatedReadTime(): number {
    return this.data.estimatedReadTime
  }

  get tags(): string[] {
    return this.data.tags
  }

  get publishedAt(): Date {
    return this.data.publishedAt
  }

  get slug(): string {
    return this.data.slug
  }

  get featuredImage(): string | undefined {
    return this.data.featuredImage
  }

  get videoUrl(): string | undefined {
    return this.data.videoUrl
  }

  get downloadUrl(): string | undefined {
    return this.data.downloadUrl
  }

  get viewCount(): number {
    return this.data.viewCount
  }

  get engagementRate(): number {
    return this.data.engagementRate
  }

  // Check if user can access this content
  canUserAccess(userCaptureLevel: number): boolean {
    return userCaptureLevel >= this.data.requiredCaptureLevel
  }

  // Get content stats from engagement tracking
  async getStats(): Promise<ContentStats> {
    const stats = await ContentEngagementModel.getContentStats(this.data.id)
    return {
      ...stats,
      conversionRate: stats.engagementRate // Use engagement rate as conversion rate for now
    }
  }

  // Track content view
  async trackView(userId?: string, sessionId?: string): Promise<ContentEngagementModel> {
    return await ContentEngagementModel.findOrCreate(
      userId,
      this.data.id,
      this.data.contentType,
      sessionId,
      this.data.category
    )
  }

  // Get formatted content for display
  getFormattedContent(): {
    hook: string
    insight: string
    application: string
    hungerBuilder: string
    nextStep: string
    mainContent: string
  } {
    return {
      hook: this.data.hook,
      insight: this.data.insight,
      application: this.data.application,
      hungerBuilder: this.data.hungerBuilder,
      nextStep: this.data.nextStep,
      mainContent: this.data.content
    }
  }

  // Convert to JSON
  toJSON(): ContentItem {
    return { ...this.data }
  }

  // Get public summary (without full content)
  toSummary(): Omit<ContentItem, 'content'> {
    const { content: _, ...summary } = this.data
    return summary
  }
}

// Content categories configuration
export const CONTENT_CATEGORIES: Record<ContentCategory, ContentCategoryInfo> = {
  'untapped-you': {
    id: 'untapped-you',
    name: 'The Untapped You',
    description: 'Discover your hidden potential and unlock capabilities you never knew you had',
    icon: '🔓',
    color: '#10B981',
    tagline: 'Unlock Your Hidden 90%'
  },
  'dreams-to-reality': {
    id: 'dreams-to-reality',
    name: 'Dreams to Reality',
    description: 'Transform your biggest dreams into achievable goals and concrete action plans',
    icon: '🎯',
    color: '#3B82F6',
    tagline: 'Make It Happen'
  },
  'daily-edge': {
    id: 'daily-edge',
    name: 'The Daily Edge',
    description: 'Small daily habits and routines that compound into extraordinary results',
    icon: '⚡',
    color: '#F59E0B',
    tagline: 'Win Every Day'
  },
  'inner-game': {
    id: 'inner-game',
    name: 'The Inner Game',
    description: 'Master your mindset, overcome limiting beliefs, and develop unshakeable confidence',
    icon: '🧠',
    color: '#8B5CF6',
    tagline: 'Master Your Mind'
  },
  'multiplier-effect': {
    id: 'multiplier-effect',
    name: 'The Multiplier Effect',
    description: 'Leadership and influence strategies that amplify your impact on others',
    icon: '🚀',
    color: '#EF4444',
    tagline: 'Amplify Your Impact'
  }
}

// Sample content data (this would typically come from a CMS or database)
export const SAMPLE_CONTENT: ContentItem[] = [
  // Untapped You - Surface Level
  {
    id: 'untapped-potential-quiz',
    title: 'Are You Using Only 10% of Your Potential?',
    category: 'untapped-you',
    depthLevel: 'surface',
    contentType: 'article',
    hook: 'Most people live their entire lives using only a fraction of their true capabilities. What if you could access the other 90%?',
    insight: 'Research shows that the average person uses less than 10% of their mental capacity and potential. The difference between high achievers and everyone else isn\'t talent—it\'s activation.',
    application: 'Take our 5-minute Potential Quotient Calculator to discover which areas of your potential are lying dormant and get a personalized activation plan.',
    hungerBuilder: 'Imagine if you could double your effectiveness in just 30 days by activating dormant capabilities you already possess.',
    nextStep: 'Complete the Potential Assessment to get your personalized Potential Activation Blueprint.',
    content: `# The Hidden 90% That Changes Everything

Have you ever wondered why some people seem to effortlessly achieve what others struggle with for years? The answer isn't what you think.

## The Potential Paradox

Scientists have discovered that most humans operate at less than 10% of their true potential. This isn't about intelligence or talent—it's about activation.

Think about it: Your smartphone has incredible capabilities, but most people only use a handful of apps. Your potential works the same way.

## The Three Layers of Untapped Potential

### Layer 1: Cognitive Capacity
Your brain has approximately 86 billion neurons, each capable of forming thousands of connections. Most people use established neural pathways, leaving vast networks untapped.

### Layer 2: Emotional Intelligence
Research by Daniel Goleman shows that EQ accounts for 58% of job performance across all industries, yet most people have never systematically developed these skills.

### Layer 3: Physical Energy
Your body is designed for peak performance, but modern lifestyles activate only basic survival functions, leaving energy reserves untapped.

## The Activation Process

The key isn't working harder—it's activating what's already there:

1. **Identify** your dormant capabilities
2. **Activate** through targeted exercises
3. **Integrate** into daily routines
4. **Amplify** through consistent practice

## Your Next Step

Don't let another day pass using only 10% of what you're capable of. Take the Potential Assessment and discover your hidden 90%.`,
    excerpt: 'Discover why most people use only 10% of their potential and how to activate the hidden 90% that changes everything.',
    requiredCaptureLevel: 1,
    estimatedReadTime: 3,
    tags: ['potential', 'self-discovery', 'assessment'],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    author: 'Galaxy Dream Team',
    featuredImage: '/images/content/untapped-potential.jpg',
    viewCount: 0,
    engagementRate: 0,
    conversionRate: 0,
    slug: 'untapped-potential-quiz',
    metaDescription: 'Discover your hidden potential with our comprehensive assessment. Most people use only 10% of their capabilities—unlock your remaining 90%.'
  },

  // Dreams to Reality - Medium Level
  {
    id: 'dream-clarity-generator',
    title: 'The Dream Clarity Generator: From Vague Wishes to Crystal Clear Vision',
    category: 'dreams-to-reality',
    depthLevel: 'medium',
    contentType: 'guide',
    hook: 'Your dreams are not too big. They\'re too vague. Here\'s how to transform fuzzy wishes into laser-focused vision.',
    insight: 'The #1 reason dreams don\'t become reality isn\'t lack of motivation—it\'s lack of clarity. Vague dreams create vague results.',
    application: 'Use our Dream Clarity Generator to transform your biggest aspirations into specific, measurable, and achievable goals with clear action steps.',
    hungerBuilder: 'What if you could see your future so clearly that achieving it becomes inevitable?',
    nextStep: 'Access the Dream Clarity Generator and create your personalized Vision Blueprint.',
    content: `# From Fuzzy Dreams to Crystal Clear Vision

Most people's dreams are like looking through a foggy window—you can see shapes and colors, but nothing is clear enough to act on.

## The Clarity Crisis

Research from Harvard Business School shows that people with clear, written goals are 10x more likely to achieve them. Yet 97% of people have never written down their goals.

Why? Because they don't know how to transform vague wishes into actionable vision.

## The Dream Clarity Framework

### Step 1: Dream Extraction
Most people suppress their biggest dreams because they seem "unrealistic." We'll help you extract and examine these dreams without judgment.

### Step 2: Vision Crystallization
Transform abstract dreams into specific, vivid mental movies of your future reality.

### Step 3: Goal Architecture
Break down your vision into measurable milestones and actionable steps.

### Step 4: Reality Bridge
Create the connection between where you are now and where you want to be.

## The Power of Clarity

When your vision is crystal clear:
- Decision-making becomes effortless
- Opportunities become obvious
- Motivation becomes automatic
- Progress becomes measurable

## Your Vision Blueprint

The Dream Clarity Generator creates a personalized blueprint that includes:
- Your core life vision statement
- 5-year milestone map
- 1-year focus areas
- 90-day action plan
- Weekly progress metrics

Don't spend another year with fuzzy dreams. Get crystal clear on what you want and how to achieve it.`,
    excerpt: 'Transform vague dreams into crystal clear vision with our comprehensive Dream Clarity Generator framework.',
    requiredCaptureLevel: 2,
    estimatedReadTime: 7,
    tags: ['goals', 'vision', 'planning', 'clarity'],
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    author: 'Galaxy Dream Team',
    featuredImage: '/images/content/dream-clarity.jpg',
    downloadUrl: '/downloads/dream-clarity-workbook.pdf',
    viewCount: 0,
    engagementRate: 0,
    conversionRate: 0,
    slug: 'dream-clarity-generator',
    metaDescription: 'Transform vague dreams into achievable goals with our Dream Clarity Generator. Get crystal clear vision and actionable plans.'
  },

  // Daily Edge - Deep Level
  {
    id: 'morning-routine-optimizer',
    title: 'The Morning Routine Optimizer: Engineer Your Perfect Day',
    category: 'daily-edge',
    depthLevel: 'deep',
    contentType: 'tool',
    hook: 'Your morning routine determines your entire day. Most people wing it. High performers engineer it.',
    insight: 'The first 90 minutes of your day set the neurochemical foundation for everything that follows. Get this right, and everything else becomes easier.',
    application: 'Use our Morning Routine Optimizer to design a personalized morning routine based on your chronotype, goals, and lifestyle constraints.',
    hungerBuilder: 'Imagine waking up energized, focused, and already winning before most people even start their day.',
    nextStep: 'Complete the Morning Routine Assessment and get your personalized optimization plan.',
    content: `# Engineering Your Perfect Morning

The difference between successful people and everyone else often comes down to the first 90 minutes of their day.

## The Science of Morning Optimization

### Cortisol Awakening Response
Your body naturally produces cortisol in the morning to wake you up. The key is working with this biological rhythm, not against it.

### Neuroplasticity Window
The first 90 minutes after waking is when your brain is most plastic and receptive to new information and habits.

### Dopamine Regulation
How you start your day determines your dopamine baseline for the entire day, affecting motivation, focus, and mood.

## The 5-Phase Morning Architecture

### Phase 1: Activation (0-15 minutes)
- Hydration protocol
- Light exposure
- Movement activation
- Breathing exercises

### Phase 2: Centering (15-30 minutes)
- Meditation or mindfulness
- Gratitude practice
- Intention setting
- Visualization

### Phase 3: Priming (30-60 minutes)
- Physical exercise
- Cold exposure (optional)
- Nutrition optimization
- Supplement protocol

### Phase 4: Creation (60-90 minutes)
- Deep work session
- Learning/reading
- Planning/organizing
- Creative projects

### Phase 5: Connection (90+ minutes)
- Family time
- Team check-ins
- Communication
- Relationship building

## Personalization Factors

Your optimal morning routine depends on:
- **Chronotype**: Are you naturally a morning person or night owl?
- **Life Stage**: Different phases of life require different approaches
- **Goals**: Your routine should align with your current priorities
- **Constraints**: Work schedule, family obligations, living situation

## The Optimization Process

1. **Assessment**: Understand your current patterns and preferences
2. **Design**: Create your ideal routine based on science and personal factors
3. **Implementation**: Start with small changes and build gradually
4. **Tracking**: Monitor energy, mood, and productivity metrics
5. **Refinement**: Adjust based on results and changing needs

## Common Optimization Mistakes

- Trying to change everything at once
- Copying someone else's routine without personalization
- Ignoring your natural chronotype
- Not accounting for seasonal changes
- Focusing on duration over quality

Your morning routine is your competitive advantage. Don't leave it to chance.`,
    excerpt: 'Engineer your perfect morning routine based on science, your chronotype, and personal goals for maximum daily performance.',
    requiredCaptureLevel: 3,
    estimatedReadTime: 12,
    tags: ['morning routine', 'habits', 'optimization', 'productivity', 'science'],
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    author: 'Galaxy Dream Team',
    featuredImage: '/images/content/morning-routine.jpg',
    downloadUrl: '/downloads/morning-routine-optimizer.pdf',
    viewCount: 0,
    engagementRate: 0,
    conversionRate: 0,
    slug: 'morning-routine-optimizer',
    metaDescription: 'Design your perfect morning routine with our science-based optimizer. Personalized recommendations for maximum daily performance.'
  }
]

// Content filtering and search utilities
export class ContentLibrary {
  private content: ContentModel[]

  constructor(content: ContentItem[] = SAMPLE_CONTENT) {
    this.content = content.map(item => new ContentModel(item))
  }

  // Get all content
  getAll(): ContentModel[] {
    return this.content
  }

  // Get content by category
  getByCategory(category: ContentCategory): ContentModel[] {
    return this.content.filter(item => item.category === category)
  }

  // Get content by depth level
  getByDepthLevel(depthLevel: ContentDepthLevel): ContentModel[] {
    return this.content.filter(item => item.depthLevel === depthLevel)
  }

  // Get content accessible to user
  getAccessibleContent(userCaptureLevel: number): ContentModel[] {
    return this.content.filter(item => item.canUserAccess(userCaptureLevel))
  }

  // Search and filter content
  search(filters: SearchFilters): ContentModel[] {
    let results = this.content

    if (filters.category) {
      results = results.filter(item => item.category === filters.category)
    }

    if (filters.depthLevel) {
      results = results.filter(item => item.depthLevel === filters.depthLevel)
    }

    if (filters.contentType) {
      results = results.filter(item => item.contentType === filters.contentType)
    }

    if (filters.requiredCaptureLevel) {
      results = results.filter(item => item.requiredCaptureLevel <= filters.requiredCaptureLevel!)
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(item => 
        filters.tags!.some(tag => item.tags.includes(tag))
      )
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      results = results.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return results
  }

  // Get content by ID
  getById(id: string): ContentModel | undefined {
    return this.content.find(item => item.id === id)
  }

  // Get content by slug
  getBySlug(slug: string): ContentModel | undefined {
    return this.content.find(item => item.slug === slug)
  }

  // Get recommended content based on user engagement
  getRecommended(userCaptureLevel: number, limit: number = 5): ContentModel[] {
    const accessible = this.getAccessibleContent(userCaptureLevel)
    
    // Sort by engagement rate and recency
    return accessible
      .sort((a, b) => {
        const scoreA = a.engagementRate * 0.7 + (Date.now() - a.publishedAt.getTime()) * 0.3
        const scoreB = b.engagementRate * 0.7 + (Date.now() - b.publishedAt.getTime()) * 0.3
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  // Get content statistics
  getStats(): {
    totalContent: number
    byCategory: Record<ContentCategory, number>
    byDepthLevel: Record<ContentDepthLevel, number>
    byAccessLevel: Record<string, number>
  } {
    const byCategory = {} as Record<ContentCategory, number>
    const byDepthLevel = {} as Record<ContentDepthLevel, number>
    const byAccessLevel = { '1': 0, '2': 0, '3': 0 }

    this.content.forEach(item => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1
      byDepthLevel[item.depthLevel] = (byDepthLevel[item.depthLevel] || 0) + 1
      const levelKey = item.requiredCaptureLevel.toString() as '1' | '2' | '3'
      byAccessLevel[levelKey] += 1
    })

    return {
      totalContent: this.content.length,
      byCategory,
      byDepthLevel,
      byAccessLevel
    }
  }
}