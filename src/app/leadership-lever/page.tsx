'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useContentTracking, useContentActions } from '@/lib/hooks/use-content-tracking'
import { trackingService } from '@/lib/tracking'
import { 
  Crown, Users, TrendingUp, Target, BookOpen, Download, Share2, ArrowRight, 
  CheckCircle, Lightbulb, Compass, Star, Shield, Zap 
} from 'lucide-react'
import Link from 'next/link'
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo'

export default function LeadershipLeverPage() {
  const [userId, setUserId] = useState<string>()
  const [sessionId, setSessionId] = useState<string>()

  // Content tracking
  const { trackInteraction } = useContentTracking({
    contentId: 'leadership-lever-educational',
    contentType: 'educational-page',
    contentCategory: 'leadership-development',
    userId,
    sessionId,
    enabled: true
  })

  const { trackCTAClick, trackDownload, trackShare } = useContentActions(
    'leadership-lever-educational',
    userId
  )

  useEffect(() => {
    // Get session and user info
    const session = trackingService.getSessionId()
    const user = trackingService.getUserSessionId()
    setSessionId(session)
    setUserId(user || undefined)

    // Track page view
    trackingService.trackPageView(user || undefined, {
      pageType: 'educational',
      section: 'leadership-lever',
      contentDepth: 'comprehensive'
    })
  }, [])

  const handleCTAClick = (ctaType: string, ctaText: string) => {
    trackCTAClick(ctaType, ctaText)
    trackingService.trackCTAClick(`leadership-lever-${ctaType}`, ctaType, userId, {
      ctaText,
      pageSection: 'educational'
    })
  }

  const handleDownload = (resourceType: string) => {
    trackDownload(resourceType)
    trackingService.trackContentEngagement('leadership-lever-educational', 'download', userId, {
      resourceType
    })
  }

  const handleInteraction = (interactionType: string) => {
    trackInteraction(interactionType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[var(--color-growth-50)] dark:to-[var(--color-growth-900)]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GalaxyDreamTeamLogo 
                href="/"
                variant="full"
                size="medium"
                className="transition-opacity hover:opacity-90"
              />
              <Badge variant="outline" className="hidden sm:inline-flex">
                Educational Content
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload('leadership-lever-guide')}
                className="hidden sm:inline-flex"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              The Leadership Lever: Are You Leading Your Life?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Leadership isn't just about managing others—it's about mastering yourself first. 
              Discover how your leadership style determines your impact in every area of life.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm">
                <Crown className="h-4 w-4 mr-1" />
                Self-leadership
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Users className="h-4 w-4 mr-1" />
                Influence skills
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Impact amplification
              </Badge>
            </div>
            <Button
              size="lg"
              onClick={() => {
                handleCTAClick('assessment', 'Discover Leadership Style')
                document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-lg px-8 py-4 h-auto"
            >
              <Crown className="mr-2 h-5 w-5" />
              Discover Your Leadership Style
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* The Leadership Paradox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('leadership-paradox')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-growth-600)]">
                  The Leadership Paradox
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground mb-6">
                    Most people think leadership is about having a title, managing a team, or being in charge. 
                    But the most successful people understand a deeper truth: leadership starts with leading yourself.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    You can't give what you don't have. You can't lead others to places you've never been. 
                    The quality of your external leadership is a direct reflection of your internal leadership.
                  </p>
                  
                  <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-growth-600)]">
                      The Mirror Principle
                    </h3>
                    <p className="text-muted-foreground">
                      Your external world is a mirror of your internal world. The way you lead yourself 
                      determines how others respond to your leadership. Master self-leadership first, 
                      and everything else becomes possible.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* The 5 Levels of Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('leadership-levels')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-growth-600)]">
                  The 5 Levels of Leadership Impact
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  John Maxwell's research identified 5 distinct levels of leadership. 
                  Most people never progress beyond Level 2. Here's how to reach Level 5.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Position - "I Have a Title"</h3>
                      <p className="text-muted-foreground mb-4">
                        People follow you because they have to. This is the lowest level of leadership, 
                        based on rights rather than relationships.
                      </p>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          <strong>Limitation:</strong> People do only what they must. No discretionary effort.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Permission - "People Like Me"</h3>
                      <p className="text-muted-foreground mb-4">
                        People follow you because they want to. You've built relationships and trust. 
                        This is where real leadership begins.
                      </p>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          <strong>Key:</strong> Focus on connecting with people and understanding their needs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Production - "I Get Results"</h3>
                      <p className="text-muted-foreground mb-4">
                        People follow you because of what you've accomplished. You've proven your competence 
                        and ability to deliver results.
                      </p>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          <strong>Focus:</strong> Consistently deliver results while building team capability.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">People Development - "I Grow Others"</h3>
                      <p className="text-muted-foreground mb-4">
                        People follow you because of what you've done for them. You invest in developing 
                        others and helping them reach their potential.
                      </p>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          <strong>Impact:</strong> Your influence multiplies through the people you develop.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      5
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Pinnacle - "I Create Legacy"</h3>
                      <p className="text-muted-foreground mb-4">
                        People follow you because of who you are and what you represent. You've transcended 
                        personal success to create lasting impact.
                      </p>
                      <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-4 rounded-lg">
                        <p className="text-sm text-[var(--color-growth-600)]">
                          <strong>Legacy:</strong> Your influence continues long after you're gone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Leadership Styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('leadership-styles')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-transformation-600)]">
                  The 6 Leadership Styles That Drive Results
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Daniel Goleman's research identified 6 distinct leadership styles. 
                  The best leaders master all 6 and know when to use each one.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Compass className="h-6 w-6 text-[var(--color-energy-600)]" />
                        <h3 className="text-lg font-semibold">Visionary</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Come with me." Mobilizes people toward a vision. Most effective when change requires a new direction.
                      </p>
                      <div className="text-xs text-[var(--color-energy-600)] font-medium">
                        Impact on Climate: Most Positive
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-6 w-6 text-[var(--color-transformation-600)]" />
                        <h3 className="text-lg font-semibold">Coaching</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Try this." Develops people for the future. Works best with employees who want to improve.
                      </p>
                      <div className="text-xs text-[var(--color-transformation-600)] font-medium">
                        Impact on Climate: Positive
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-6 w-6 text-[var(--color-growth-600)]" />
                        <h3 className="text-lg font-semibold">Affiliative</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "People come first." Creates harmony and builds emotional bonds. Best for healing rifts or motivating during stress.
                      </p>
                      <div className="text-xs text-[var(--color-growth-600)] font-medium">
                        Impact on Climate: Positive
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold">Democratic</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "What do you think?" Forges consensus through participation. Works when you need buy-in or input.
                      </p>
                      <div className="text-xs text-blue-600 font-medium">
                        Impact on Climate: Positive
                      </div>
                    </div>

                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                        <h3 className="text-lg font-semibold">Pacesetting</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Do as I do, now." Sets high standards for performance. Use sparingly with highly motivated, competent teams.
                      </p>
                      <div className="text-xs text-purple-600 font-medium">
                        Impact on Climate: Negative (if overused)
                      </div>
                    </div>

                    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Zap className="h-6 w-6 text-red-600" />
                        <h3 className="text-lg font-semibold">Commanding</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Do what I tell you." Demands immediate compliance. Reserve for crisis situations or problem employees.
                      </p>
                      <div className="text-xs text-red-600 font-medium">
                        Impact on Climate: Negative (if overused)
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Self-Leadership Fundamentals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('self-leadership')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-energy-600)]">
                  The 4 Pillars of Self-Leadership
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Before you can lead others effectively, you must master leading yourself. 
                  These 4 pillars form the foundation of all great leadership.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-white" />
                      </div>
                      Self-Awareness
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Understanding your strengths, weaknesses, values, and impact on others. 
                      You can't change what you don't acknowledge.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-energy-500)] mt-0.5 flex-shrink-0" />
                        <span>Regular self-reflection and feedback seeking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-energy-500)] mt-0.5 flex-shrink-0" />
                        <span>Understanding your emotional triggers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-energy-500)] mt-0.5 flex-shrink-0" />
                        <span>Knowing your leadership style preferences</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      Self-Regulation
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Managing your emotions, impulses, and behaviors. The ability to pause 
                      between stimulus and response.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-transformation-500)] mt-0.5 flex-shrink-0" />
                        <span>Emotional control under pressure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-transformation-500)] mt-0.5 flex-shrink-0" />
                        <span>Consistent daily habits and routines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-transformation-500)] mt-0.5 flex-shrink-0" />
                        <span>Delayed gratification and long-term thinking</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      Self-Motivation
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      The internal drive to achieve and improve. Passion for the work itself, 
                      not just external rewards.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-growth-500)] mt-0.5 flex-shrink-0" />
                        <span>Clear personal vision and purpose</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-growth-500)] mt-0.5 flex-shrink-0" />
                        <span>Commitment to continuous learning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--color-growth-500)] mt-0.5 flex-shrink-0" />
                        <span>Resilience in the face of setbacks</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      Social Skills
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Managing relationships and building networks. The ability to find common 
                      ground and build rapport.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Active listening and empathy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Clear and persuasive communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Conflict resolution and team building</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Interactive Assessment */}
            <motion.div
              id="assessment-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <Card className="p-8 bg-gradient-to-br from-[var(--color-growth-50)] to-[var(--color-energy-50)] dark:from-[var(--color-growth-900)] dark:to-[var(--color-energy-900)]">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-[var(--color-growth-600)]">
                    Discover Your Leadership Style
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Take our comprehensive Leadership Style Identifier to understand your natural 
                    leadership preferences and areas for development.
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-growth-600)] mb-2">6</div>
                    <div className="text-sm text-muted-foreground">Leadership styles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-growth-600)] mb-2">10 min</div>
                    <div className="text-sm text-muted-foreground">Assessment time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-growth-600)] mb-2">4</div>
                    <div className="text-sm text-muted-foreground">Core competencies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-growth-600)] mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Personalized plan</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => handleCTAClick('assessment-start', 'Start Leadership Assessment')}
                    className="text-lg px-8 py-4 h-auto"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Start Your Leadership Assessment
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Get your personalized leadership development plan
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Related Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Continue Your Journey</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => handleCTAClick('related-content', 'Vision Void')}>
                  <Link href="/vision-void">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-energy-600)]">
                      The Vision Void
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Can you describe your life 5 years from now in detail? Learn why 
                      vision clarity is essential for effective leadership.
                    </p>
                    <div className="flex items-center text-[var(--color-energy-600)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCTAClick('related-content', 'Decision Door')}>
                  <Link href="/decision-door">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-transformation-600)]">
                      The Decision Door
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Every great leader is a great decision-maker. Learn the frameworks 
                      that turn decision-making into your competitive advantage.
                    </p>
                    <div className="flex items-center text-[var(--color-transformation-600)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                </Card>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 bg-gradient-to-r from-[var(--color-growth-500)] to-[var(--color-energy-500)] text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Amplify Your Leadership Impact?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Join Galaxy Dream Team and develop the leadership skills that will transform 
                  not just your career, but every area of your life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => handleCTAClick('soft-membership', 'Join Galaxy Dream Team')}
                    className="text-lg px-8 py-4 h-auto"
                  >
                    Join Galaxy Dream Team
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      handleCTAClick('learn-more', 'Learn More About Leadership Lever')
                      window.open('/leadership-lever/learn-more', '_blank')
                    }}
                    className="text-lg px-8 py-4 h-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore More Resources
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}