"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, BookOpen, Users, Brain, RefreshCw, Zap, Star } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import Link from "next/link"

export default function ChangeParadoxLearnMorePage() {
  const { trackEngagement } = useEngagementTracking()

  const handleEngagement = (type: string, metadata?: any) => {
    trackEngagement({ 
      type: type as any, 
      section: 'change-paradox-learn-more',
      metadata: {
        pageType: 'learn-more',
        timestamp: Date.now(),
        ...metadata
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[var(--color-transformation-50)] dark:to-[var(--color-transformation-900)]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/change-paradox" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Change Paradox
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master the Change Paradox: Complete Learning Hub
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl">
            Everything you need to understand your brain's automatic systems, break unwanted patterns, 
            and create lasting change that feels effortless and natural.
          </p>
        </motion.div>

        {/* Learning Modules */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Video Content */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Video Learning Series</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[var(--color-transformation-100)] to-[var(--color-energy-100)] dark:from-[var(--color-transformation-800)] dark:to-[var(--color-energy-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Your Brain on Autopilot</h3>
                      <p className="text-sm text-muted-foreground">20 min deep dive</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover how 95% of your actions are automatic and why understanding 
                    this is the key to effortless change.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Your Brain on Autopilot' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-energy-100)] to-[var(--color-growth-100)] dark:from-[var(--color-energy-800)] dark:to-[var(--color-growth-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">The Habit Loop Decoded</h3>
                      <p className="text-sm text-muted-foreground">15 min tutorial</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Master the 4-step process your brain uses to create habits. 
                    Learn to hack this system for positive change.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'The Habit Loop Decoded' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-growth-100)] to-[var(--color-transformation-100)] dark:from-[var(--color-growth-800)] dark:to-[var(--color-transformation-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Neuroplasticity Mastery</h3>
                      <p className="text-sm text-muted-foreground">18 min workshop</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    How to rewire your brain at any age. Practical techniques 
                    to build new neural pathways and break old patterns.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Neuroplasticity Mastery' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-transformation-100)] to-[var(--color-energy-100)] dark:from-[var(--color-transformation-800)] dark:to-[var(--color-energy-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Identity-Based Change</h3>
                      <p className="text-sm text-muted-foreground">22 min masterclass</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Why changing your identity is more powerful than changing your actions. 
                    The secret to lasting transformation.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Identity-Based Change' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </motion.section>

            {/* Blog Articles */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-6">In-Depth Articles</h2>
              
              <div className="space-y-6">
                <article className="border-l-4 border-[var(--color-transformation-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-transformation-600)]" />
                    <span className="text-sm text-muted-foreground">12 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-transformation-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'The Neuroscience of Habit Formation' })}
                    >
                      The Neuroscience of Habit Formation: What Really Happens in Your Brain
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    A deep dive into the latest neuroscience research on habit formation. Understand exactly 
                    how your brain creates automatic behaviors and how to leverage this knowledge.
                  </p>
                </article>

                <article className="border-l-4 border-[var(--color-energy-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-energy-600)]" />
                    <span className="text-sm text-muted-foreground">10 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-energy-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'Why Willpower Fails' })}
                    >
                      Why Willpower Fails: The Science Behind Self-Control Depletion
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Discover why relying on willpower is a losing strategy and what successful people 
                    do instead to create lasting change without constant mental effort.
                  </p>
                </article>

                <article className="border-l-4 border-[var(--color-growth-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-growth-600)]" />
                    <span className="text-sm text-muted-foreground">14 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-growth-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'The 21-Day Myth Exposed' })}
                    >
                      The 21-Day Myth Exposed: How Long Habits Really Take to Form
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    The truth about habit formation timelines based on actual research. Plus, what 
                    factors actually determine how quickly new behaviors become automatic.
                  </p>
                </article>
              </div>
            </motion.section>

            {/* Interactive Tools */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Interactive Assessment Tools</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-[var(--color-transformation-200)] dark:border-[var(--color-transformation-700)] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 text-[var(--color-transformation-600)]" />
                    <h3 className="font-semibold">Habit Strength Analyzer</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze your current habits and discover which ones are helping or hurting you. 
                    Get personalized recommendations for habit optimization.
                  </p>
                  <Button 
                    variant="cta" 
                    className="w-full"
                    onClick={() => {
                      handleEngagement('tool_access', { toolName: 'Habit Strength Analyzer' })
                      window.open('/#change-paradox', '_self')
                    }}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Your Habits
                  </Button>
                </div>

                <div className="p-6 border border-[var(--color-energy-200)] dark:border-[var(--color-energy-700)] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="h-6 w-6 text-[var(--color-energy-600)]" />
                    <h3 className="font-semibold">Habit Loop Mapper</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Map out your existing habit loops and identify the cues, routines, and rewards 
                    that drive your automatic behaviors.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('tool_access', { toolName: 'Habit Loop Mapper' })}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Map Your Habits
                  </Button>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-[var(--color-transformation-600)]" />
                <h3 className="font-semibold">Your Learning Progress</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Videos Watched</span>
                  <span className="text-sm font-medium">0/4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-transformation-500)] h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Articles Read</span>
                  <span className="text-sm font-medium">0/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-energy-500)] h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tools Used</span>
                  <span className="text-sm font-medium">0/2</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-growth-500)] h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] rounded-lg">
                <p className="text-sm font-medium">Complete all modules to unlock:</p>
                <p className="text-xs text-muted-foreground">Change Mastery Certificate</p>
              </div>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-[var(--color-transformation-600)]" />
                <h3 className="font-semibold">Transformation Community</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Connect with others who are mastering the change paradox. Share your habit wins, 
                get support during challenges, and learn from others' breakthroughs.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full mb-3"
                onClick={() => handleEngagement('community_join')}
              >
                <Users className="mr-2 h-4 w-4" />
                Join Community
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">23,000+ members transforming habits</p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-[var(--color-transformation-500)] to-[var(--color-energy-500)] p-6 rounded-lg text-white"
            >
              <h3 className="font-semibold mb-2">Ready for the Next Level?</h3>
              <p className="text-sm opacity-90 mb-4">
                Once you've mastered habit change, discover how to create a crystal-clear vision 
                for your future and eliminate the vision void.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  handleEngagement('next_section_click')
                  window.open('/vision-void', '_self')
                }}
              >
                Explore Vision Void
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}