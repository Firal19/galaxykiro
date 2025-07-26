"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Clock, Target, Users, BookOpen, Download } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import Link from "next/link"

export default function SuccessGapPage() {
  const { trackEngagement } = useEngagementTracking()

  const handleEngagement = (type: string) => {
    trackEngagement({ 
      type: type as any, 
      section: 'success-gap-educational',
      metadata: {
        timeSpent: Date.now()
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
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Why Some People Achieve Their Dreams While Others Just Dream
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl">
            The success gap isn't about talent, luck, or circumstances. It's about understanding and implementing 
            the specific factors that separate achievers from dreamers.
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
            <TrendingUp className="h-8 w-8 text-[var(--color-growth-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Success Factors</h3>
            <p className="text-muted-foreground">
              Research shows that 73% of people never achieve their goals because they focus on motivation instead of systems.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Clock className="h-8 w-8 text-[var(--color-energy-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Time Compound</h3>
            <p className="text-muted-foreground">
              Small, consistent actions compound over time. The difference between success and failure is often just 1% better each day.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Target className="h-8 w-8 text-[var(--color-transformation-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Environment Design</h3>
            <p className="text-muted-foreground">
              Your environment determines 50% of your success. Winners design their environment to make success inevitable.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The 3 Morning Habits */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The 3 Morning Habits of Highly Successful People</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-growth-600)]">1. Clarity Before Action</h3>
                  <p className="text-muted-foreground mb-3">
                    Before checking emails or social media, successful people spend 10 minutes reviewing their top 3 priorities for the day. 
                    This simple practice ensures they're working on what matters most, not just what's urgent.
                  </p>
                  <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Try This: Write down your top 3 priorities before touching your phone each morning.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-energy-600)]">2. Physical Activation</h3>
                  <p className="text-muted-foreground mb-3">
                    Whether it's 10 push-ups, a 5-minute walk, or stretching, successful people activate their body before their mind. 
                    This increases blood flow, releases endorphins, and sets a tone of accomplishment for the day.
                  </p>
                  <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Try This: Do 10 jumping jacks or push-ups immediately after waking up.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-transformation-600)]">3. Learning Investment</h3>
                  <p className="text-muted-foreground mb-3">
                    High achievers invest in their minds daily. Even 15 minutes of reading, listening to a podcast, or watching 
                    educational content compounds into massive knowledge gains over time.
                  </p>
                  <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Try This: Read one page of a personal development book each morning.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Environment Impact */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Why Your Environment Determines 50% of Your Success</h2>
              
              <p className="text-muted-foreground mb-6">
                Stanford research reveals that our environment shapes our behavior more than our willpower. 
                Successful people don't rely on motivation—they design their environment to make good choices automatic.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-[var(--color-growth-600)]">Physical Environment</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Remove distractions from your workspace</li>
                    <li>• Place success cues in visible locations</li>
                    <li>• Organize tools for easy access</li>
                    <li>• Create dedicated spaces for important activities</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-[var(--color-energy-600)]">Social Environment</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Surround yourself with growth-minded people</li>
                    <li>• Join communities aligned with your goals</li>
                    <li>• Limit time with negative influences</li>
                    <li>• Find accountability partners</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-growth-50)] to-[var(--color-energy-50)] dark:from-[var(--color-growth-900)] dark:to-[var(--color-energy-900)] rounded-lg">
                <p className="font-medium mb-2">Environment Audit Challenge:</p>
                <p className="text-sm text-muted-foreground">
                  Look around your workspace right now. What does it encourage? Success or distraction? 
                  Make one small change today to support your goals.
                </p>
              </div>
            </motion.section>

            {/* Research Citations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Research-Backed Success Strategies</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[var(--color-growth-500)] pl-4">
                  <p className="font-medium">Harvard Business Review Study</p>
                  <p className="text-sm text-muted-foreground">
                    "People who write down their goals are 42% more likely to achieve them." 
                    The act of writing clarifies thinking and creates commitment.
                  </p>
                </div>
                
                <div className="border-l-4 border-[var(--color-energy-500)] pl-4">
                  <p className="font-medium">Stanford Environment Research</p>
                  <p className="text-sm text-muted-foreground">
                    "Environmental design influences behavior more than personal motivation." 
                    Small changes in your surroundings create big changes in your actions.
                  </p>
                </div>
                
                <div className="border-l-4 border-[var(--color-transformation-500)] pl-4">
                  <p className="font-medium">MIT Habit Formation Study</p>
                  <p className="text-sm text-muted-foreground">
                    "Habits account for 40% of our daily actions." 
                    Success isn't about motivation—it's about building the right automatic behaviors.
                  </p>
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
                <h3 className="font-semibold">Success Stories</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Sarah K. - Entrepreneur</p>
                  <p className="text-xs text-muted-foreground">
                    "I went from struggling to make ends meet to building a 6-figure business in 8 months. 
                    The success factors framework changed everything."
                  </p>
                </div>
                
                <div className="p-3 bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Michael T. - Sales Manager</p>
                  <p className="text-xs text-muted-foreground">
                    "After years of inconsistent results, I finally understood what separates top performers. 
                    My sales increased 300% in 6 months."
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
                <BookOpen className="h-5 w-5 text-[var(--color-growth-600)]" />
                <h3 className="font-semibold">Free Resources</h3>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Success Factors Checklist
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Morning Routine Template
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Environment Audit Guide
                </Button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-[var(--color-growth-500)] to-[var(--color-energy-500)] p-6 rounded-lg text-white"
            >
              <h3 className="font-semibold mb-2">Ready to Bridge Your Success Gap?</h3>
              <p className="text-sm opacity-90 mb-4">
                Take our Success Factor Calculator to discover exactly what's keeping you from your dreams.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  handleEngagement('cta_click')
                  window.open('/#success-gap', '_self')
                }}
              >
                Calculate Your Success Probability
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}