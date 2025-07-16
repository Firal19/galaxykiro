"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Compass, Star, Users, BookOpen, Download } from "lucide-react"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import Link from "next/link"

export default function VisionVoidPage() {
  const { trackEngagement } = useEngagementTracking()

  const handleEngagement = (type: string) => {
    trackEngagement({ 
      type: type as any, 
      section: 'vision-void-educational',
      metadata: {
        pageType: 'educational',
        timestamp: Date.now()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[var(--color-energy-50)] dark:to-[var(--color-energy-900)]">
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
            Can You Describe Your Life 5 Years From Now in Detail?
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl">
            Most people can't. They're living in the vision void—drifting through life without a clear picture 
            of where they're going. But vision clarity is the foundation of all achievement.
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
            <Eye className="h-8 w-8 text-[var(--color-energy-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vision Clarity</h3>
            <p className="text-muted-foreground">
              Only 8% of people can describe their 5-year vision in detail—and they're 10x more likely to achieve their goals.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Compass className="h-8 w-8 text-[var(--color-transformation-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Life Navigation</h3>
            <p className="text-muted-foreground">
              Without clear vision, you're like a ship without a compass—you might be moving, but you're not going anywhere meaningful.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm">
            <Star className="h-8 w-8 text-[var(--color-growth-600)] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Future Self</h3>
            <p className="text-muted-foreground">
              Your future self is trying to send you a message about the life you're meant to live. Clear vision helps you hear it.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The Vision Void Problem */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The Vision Void: Why Most People Live by Default</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-energy-600)]">Living in Reaction Mode</h3>
                  <p className="text-muted-foreground mb-3">
                    Without a clear vision, you're constantly reacting to whatever life throws at you. You make decisions 
                    based on immediate circumstances rather than long-term direction. This leads to a scattered, unfulfilling life.
                  </p>
                  <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Signs you're in reaction mode: Feeling busy but not productive, saying yes to everything, lacking clear priorities.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-transformation-600)]">The Drift Effect</h3>
                  <p className="text-muted-foreground mb-3">
                    When you don't have a destination, any road will take you there—and usually, it's not where you want to be. 
                    Most people drift through life, making small decisions that compound into a life they never consciously chose.
                  </p>
                  <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">The drift effect: Small, unconscious choices compound into major life outcomes over time.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-growth-600)]">The Clarity Advantage</h3>
                  <p className="text-muted-foreground mb-3">
                    People with clear vision make better decisions, stay motivated longer, and achieve their goals at a much higher rate. 
                    They live by design, not by default.
                  </p>
                  <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-4 rounded-lg">
                    <p className="text-sm font-medium">Harvard research: People who write down detailed goals are 10x more likely to achieve them.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Life Wheel Assessment */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The 8 Life Areas: Where's Your Vision Void?</h2>
              
              <p className="text-muted-foreground mb-6">
                Most people have unclear vision in most areas of their life. Here are the 8 key areas where you need crystal clarity:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-[var(--color-energy-200)] dark:border-[var(--color-energy-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-energy-600)] mb-2">Career & Work</h4>
                    <p className="text-sm text-muted-foreground">What work energizes you? What impact do you want to make? Where do you see yourself professionally?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-transformation-200)] dark:border-[var(--color-transformation-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-transformation-600)] mb-2">Health & Fitness</h4>
                    <p className="text-sm text-muted-foreground">How do you want to feel in your body? What physical capabilities do you want to maintain or develop?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-growth-600)] mb-2">Relationships</h4>
                    <p className="text-sm text-muted-foreground">What kind of relationships do you want? How do you want to show up for the people you love?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-energy-200)] dark:border-[var(--color-energy-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-energy-600)] mb-2">Personal Growth</h4>
                    <p className="text-sm text-muted-foreground">What skills do you want to develop? What kind of person do you want to become?</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-[var(--color-transformation-200)] dark:border-[var(--color-transformation-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-transformation-600)] mb-2">Family</h4>
                    <p className="text-sm text-muted-foreground">What kind of family life do you want? What legacy do you want to create for future generations?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-growth-200)] dark:border-[var(--color-growth-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-growth-600)] mb-2">Money & Finances</h4>
                    <p className="text-sm text-muted-foreground">What does financial freedom look like for you? What do you want money to enable in your life?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-energy-200)] dark:border-[var(--color-energy-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-energy-600)] mb-2">Fun & Recreation</h4>
                    <p className="text-sm text-muted-foreground">How do you want to play and recharge? What experiences do you want to have?</p>
                  </div>
                  
                  <div className="p-4 border border-[var(--color-transformation-200)] dark:border-[var(--color-transformation-700)] rounded-lg">
                    <h4 className="font-semibold text-[var(--color-transformation-600)] mb-2">Contribution & Legacy</h4>
                    <p className="text-sm text-muted-foreground">How do you want to contribute to the world? What do you want to be remembered for?</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-energy-50)] to-[var(--color-transformation-50)] dark:from-[var(--color-energy-900)] dark:to-[var(--color-transformation-900)] rounded-lg">
                <p className="font-medium mb-2">Vision Clarity Challenge:</p>
                <p className="text-sm text-muted-foreground">
                  Rate each area from 1-10 on how clearly you can envision your ideal future. 
                  Areas below 7 need immediate attention.
                </p>
              </div>
            </motion.section>

            {/* Future Self Visualization */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4">The Future Self Visualization Technique</h2>
              
              <p className="text-muted-foreground mb-6">
                This powerful exercise helps you connect with your future self and gain clarity on the life you're meant to live.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-energy-600)]">Set the Scene</h3>
                    <p className="text-muted-foreground mb-2">
                      Find a quiet space and close your eyes. Take three deep breaths and imagine it's exactly 5 years from today. 
                      You're living your ideal life—everything has gone exactly as you hoped.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-transformation-600)]">Engage Your Senses</h3>
                    <p className="text-muted-foreground mb-2">
                      What do you see around you? What sounds do you hear? How do you feel in your body? 
                      What does your typical day look like? Make it as vivid and detailed as possible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-growth-600)]">Capture the Vision</h3>
                    <p className="text-muted-foreground mb-2">
                      Immediately write down everything you experienced. Don't edit or judge—just capture the raw vision. 
                      This becomes your north star for decision-making.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--color-energy-600)] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[var(--color-energy-600)]">Bridge the Gap</h3>
                    <p className="text-muted-foreground mb-2">
                      Identify the key differences between your current life and your vision. 
                      These gaps become your priorities and action items.
                    </p>
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
                <Users className="h-5 w-5 text-[var(--color-energy-600)]" />
                <h3 className="font-semibold">Vision Success Stories</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Rahel M. - Life Coach</p>
                  <p className="text-xs text-muted-foreground">
                    "After feeling lost for years, I created a crystal-clear 5-year vision. 
                    I achieved my first major goal in just 6 months because I finally knew where I was going."
                  </p>
                </div>
                
                <div className="p-3 bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] rounded-lg">
                  <p className="text-sm font-medium mb-1">Daniel K. - Entrepreneur</p>
                  <p className="text-xs text-muted-foreground">
                    "The future self visualization changed everything. I could see exactly what I wanted to build, 
                    and it gave me the clarity to make tough decisions with confidence."
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
                <BookOpen className="h-5 w-5 text-[var(--color-energy-600)]" />
                <h3 className="font-semibold">Free Resources</h3>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Life Wheel Assessment
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Vision Board Template
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleEngagement('resource_download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Future Self Worksheet
                </Button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] p-6 rounded-lg text-white"
            >
              <h3 className="font-semibold mb-2">Ready to Eliminate Your Vision Void?</h3>
              <p className="text-sm opacity-90 mb-4">
                Use our Future Self Visualizer to create a crystal-clear vision of your ideal life in all 8 areas.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  handleEngagement('cta_click')
                  window.open('/#vision-void', '_self')
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Visualize Your Future Self
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}