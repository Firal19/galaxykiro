"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, Zap, RefreshCw, Target, Users, BookOpen, Download } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import Link from "next/link"

export default function ChangeParadoxPage() {
  const { trackEngagement } = useEngagementTracking()

  const handleEngagement = (type: string) => {
    trackEngagement({ 
      type: type as any, 
      section: 'change-paradox-educational',
      metadata: {
        timeSpent: Date.now()
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
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            You Know What to Do. So Why Aren't You Doing It?
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl">
            The gap between knowing and doing isn't about willpower or motivation. It's about understanding 
            how your brain's automatic systems work—and how to work with them instead of against them.
          </p>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Brain className="h-8 w-8 text-[var(--color-transformation-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Neuroplasticity</h3>
            <p className="text-muted-foreground">
              Your brain can rewire itself at any age. The key is understanding how to trigger the right neural pathways.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <RefreshCw className="h-8 w-8 text-[var(--color-energy-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Habit Loops</h3>
            <p className="text-muted-foreground">
              95% of your actions are automatic. Master the habit loop, and you master your life.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Zap className="h-8 w-8 text-[var(--color-growth-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Neural Pathways</h3>
            <p className="text-muted-foreground">
              Change becomes effortless when you build the right neural highways in your brain.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Neuroplasticity Facts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Neuroplasticity Facts (Simplified)</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-transformation-600)]">Your Brain Never Stops Changing</h3>
                  <p className="text-muted-foreground mb-3">
                    Scientists used to believe that adult brains were fixed. We now know that your brain creates new neural 
                    connections every day. Every time you think a thought or perform an action, you're literally rewiring your brain.
                  </p>
                  <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Key Insight: You're not stuck with the brain you have—you can build the brain you want.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-energy-600)]">Repetition Creates Highways</h3>
                  <p className="text-muted-foreground mb-3">
                    Think of neural pathways like walking paths in a forest. The more you walk the same path, the clearer and 
                    easier it becomes. Your brain works the same way—repeated thoughts and actions become automatic highways.
                  </p>
                  <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Key Insight: What you repeat, you become. Choose your repetitions wisely.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-growth-600)]">Change Happens in Layers</h3>
                  <p className="text-muted-foreground mb-3">
                    Your brain has different layers, from the primitive survival brain to the advanced thinking brain. 
                    Lasting change happens when all layers are aligned, not just the thinking layer.
                  </p>
                  <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Key Insight: Willpower lives in your thinking brain. Habits live deeper. Go deeper.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 21-Day Myth Debunked */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The 21-Day Myth Debunked</h2>
              
              <p className="text-muted-foreground mb-6">
                You've probably heard that it takes 21 days to form a habit. This is one of the most damaging myths in personal development. 
                Here's what the research actually shows:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-[var(--color-transformation-600)]">The Real Timeline</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Simple habits: 18-254 days (average 66 days)</li>
                    <li>• Complex habits: 3-8 months</li>
                    <li>• Identity-level changes: 6-18 months</li>
                    <li>• Automatic behaviors: 1-2 years</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-[var(--color-energy-600)]">What Actually Matters</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Consistency over perfection</li>
                    <li>• Starting ridiculously small</li>
                    <li>• Environmental design</li>
                    <li>• Identity alignment</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-transformation-50)] to-[var(--color-energy-50)] dark:from-[var(--color-transformation-900)] dark:to-[var(--color-energy-900)] rounded-lg">
                <p className="font-medium mb-2">The Truth About Habit Formation:</p>
                <p className="text-sm text-muted-foreground">
                  It's not about the number of days—it's about the number of repetitions and the strength of the neural pathway. 
                  Focus on consistency, not speed.
                </p>
              </div>
            </motion.section>

            {/* 4-Step Habit Installation */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The 4-Step Habit Installation Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-energy-600)]">Cue (The Trigger)</h3>
                    <p className="text-muted-foreground mb-2">
                      Every habit starts with a cue—a trigger that tells your brain to go into automatic mode. 
                      The key is making your cues obvious and unavoidable.
                    </p>
                    <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-3 rounded-lg">
                      <p className="text-sm font-medium">Example: Place your workout clothes next to your bed (visual cue for morning exercise).</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-transformation-600)]">Craving (The Motivation)</h3>
                    <p className="text-muted-foreground mb-2">
                      Cravings are the motivational force behind every habit. You need to make your good habits attractive 
                      and your bad habits unattractive.
                    </p>
                    <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-3 rounded-lg">
                      <p className="text-sm font-medium">Example: Pair exercise with your favorite podcast (make it attractive).</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-growth-600)]">Response (The Behavior)</h3>
                    <p className="text-muted-foreground mb-2">
                      This is the actual habit you perform. The key is making it as easy as possible to do the right thing 
                      and hard to do the wrong thing.
                    </p>
                    <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-3 rounded-lg">
                      <p className="text-sm font-medium">Example: Start with just 2 minutes of exercise (make it easy).</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-energy-600)] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-energy-600)]">Reward (The Benefit)</h3>
                    <p className="text-muted-foreground mb-2">
                      Rewards close the habit loop and tell your brain this sequence is worth remembering. 
                      The reward must be immediate and satisfying.
                    </p>
                    <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-3 rounded-lg">
                      <p className="text-sm font-medium">Example: Track your workout with a checkmark (immediate satisfaction).</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Success Stories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-[var(--color-transformation-600)]" />
                <h3 className="font-semibold">Transformation Stories</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Michael T. - Former Smoker</p>
                  <p className="text-xs text-muted-foreground">
                    "After 15 years of failed attempts, I finally quit smoking by understanding my habit loops. 
                    It wasn't about willpower—it was about rewiring my brain."
                  </p>
                </div>
                
                <div className="p-3 bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Lisa K. - Fitness Transformation</p>
                  <p className="text-xs text-muted-foreground">
                    "I went from never exercising to working out 5 days a week. The key was starting with 2-minute workouts 
                    and building the neural pathway first."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-[var(--color-transformation-600)]" />
                <h3 className="font-semibold">Free Resources</h3>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Habit Loop Worksheet
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  21-Day Habit Tracker
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Neural Pathway Guide
                </Button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-[var(--color-transformation-500)] to-[var(--color-energy-500)] p-6 rounded-lg text-white"
            >
              <h3 className="font-semibold mb-2">Ready to Rewire Your Brain?</h3>
              <p className="text-sm opacity-90 mb-4">
                Take our Habit Strength Analyzer to discover which habits are helping or hurting you.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  handleEngagement('cta_click')
                  window.open('/#change-paradox', '_self')
                }}
              >
                <Brain className="mr-2 h-4 w-4" />
                Analyze Your Habits
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}