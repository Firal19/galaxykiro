"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, BookOpen, Users, Target, TrendingUp, Clock, Star } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import Link from "next/link"

export default function SuccessGapLearnMorePage() {
  const { trackEngagement } = useEngagementTracking()

  const handleEngagement = (type: string, metadata?: any) => {
    trackEngagement({ 
      type: type as any, 
      section: 'success-gap-learn-more',
      metadata: {
        pageType: 'learn-more',
        timestamp: Date.now(),
        ...metadata
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[var(--color-growth-50)] dark:to-[var(--color-growth-900)]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/success-gap" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Success Gap
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master the Success Gap: Complete Learning Hub
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl">
            Everything you need to understand, identify, and bridge the gap between where you are 
            and where you want to be. Comprehensive resources, tools, and continuous learning materials.
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
                <div className="bg-gradient-to-br from-[var(--color-growth-100)] to-[var(--color-energy-100)] dark:from-[var(--color-growth-800)] dark:to-[var(--color-energy-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">The Success Factor Formula</h3>
                      <p className="text-sm text-muted-foreground">15 min masterclass</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover the exact formula that separates achievers from dreamers. 
                    Learn the 5 core factors that predict success in any area of life.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Success Factor Formula' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-energy-100)] to-[var(--color-transformation-100)] dark:from-[var(--color-energy-800)] dark:to-[var(--color-transformation-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Environment Design Mastery</h3>
                      <p className="text-sm text-muted-foreground">12 min deep dive</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    How to design your physical and social environment to make success inevitable. 
                    Practical strategies you can implement today.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Environment Design Mastery' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-transformation-100)] to-[var(--color-growth-100)] dark:from-[var(--color-transformation-800)] dark:to-[var(--color-growth-800)] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Morning Habits That Win</h3>
                      <p className="text-sm text-muted-foreground">10 min tutorial</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Step-by-step guide to building the 3 morning habits that high achievers 
                    use to start every day with momentum.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Morning Habits That Win' })}
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
                      <h3 className="font-semibold">Success Mindset Shifts</h3>
                      <p className="text-sm text-muted-foreground">18 min workshop</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    The mental shifts that separate the top 10% from everyone else. 
                    Transform your thinking patterns for lasting success.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('video_play', { videoTitle: 'Success Mindset Shifts' })}
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
                <article className="border-l-4 border-[var(--color-growth-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-growth-600)]" />
                    <span className="text-sm text-muted-foreground">8 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-growth-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'The Science Behind Success Gaps' })}
                    >
                      The Science Behind Success Gaps: Why 73% Never Achieve Their Goals
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Dive deep into the psychological and behavioral research that explains why most people 
                    stay stuck while others breakthrough to extraordinary results.
                  </p>
                </article>

                <article className="border-l-4 border-[var(--color-energy-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-energy-600)]" />
                    <span className="text-sm text-muted-foreground">12 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-energy-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'Environment Design Blueprint' })}
                    >
                      The Environment Design Blueprint: How Your Surroundings Shape Your Success
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    A comprehensive guide to designing your physical and social environment for automatic success. 
                    Includes room-by-room optimization strategies.
                  </p>
                </article>

                <article className="border-l-4 border-[var(--color-transformation-500)] pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-transformation-600)]" />
                    <span className="text-sm text-muted-foreground">15 min read</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <button 
                      className="text-left hover:text-[var(--color-transformation-600)] transition-colors"
                      onClick={() => handleEngagement('article_click', { articleTitle: 'Success Habits Decoded' })}
                    >
                      Success Habits Decoded: The Daily Routines of High Achievers
                    </button>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    An analysis of the daily habits of 100+ successful people across different industries. 
                    Discover the patterns that create extraordinary results.
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
                <div className="p-6 border border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-[var(--color-growth-600)]" />
                    <h3 className="font-semibold">Success Factor Calculator</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze your current habits and get a personalized success probability score 
                    with specific recommendations for improvement.
                  </p>
                  <Button 
                    variant="cta" 
                    className="w-full"
                    onClick={() => {
                      handleEngagement('tool_access', { toolName: 'Success Factor Calculator' })
                      window.open('/#success-gap', '_self')
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Take Assessment
                  </Button>
                </div>

                <div className="p-6 border border-[var(--color-energy-200)] dark:border-[var(--color-energy-700)] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-[var(--color-energy-600)]" />
                    <h3 className="font-semibold">Environment Audit Tool</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Evaluate your current environment and get specific recommendations 
                    for optimizing your space for success.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEngagement('tool_access', { toolName: 'Environment Audit Tool' })}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Start Audit
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
                <Star className="h-5 w-5 text-[var(--color-growth-600)]" />
                <h3 className="font-semibold">Your Learning Progress</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Videos Watched</span>
                  <span className="text-sm font-medium">0/4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-growth-500)] h-2 rounded-full" style={{ width: '0%' }}></div>
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
                  <div className="bg-[var(--color-transformation-500)] h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] rounded-lg">
                <p className="text-sm font-medium">Complete all modules to unlock:</p>
                <p className="text-xs text-muted-foreground">Success Gap Mastery Certificate</p>
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
                <h3 className="font-semibold">Join the Community</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Connect with others who are bridging their success gap. Share insights, 
                get support, and celebrate wins together.
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
                <p className="text-xs text-muted-foreground">15,000+ active members</p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-[var(--color-growth-500)] to-[var(--color-energy-500)] p-6 rounded-lg text-white"
            >
              <h3 className="font-semibold mb-2">Ready for the Next Level?</h3>
              <p className="text-sm opacity-90 mb-4">
                Once you've mastered the success gap, explore how to transform your habits 
                and create lasting change.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  handleEngagement('next_section_click')
                  window.open('/change-paradox', '_self')
                }}
              >
                Explore Change Paradox
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}