'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useContentTracking, useContentActions } from '@/lib/hooks/use-content-tracking'
import { trackingService } from '@/lib/tracking'
import { 
  DoorOpen, Clock, Zap, Target, BookOpen, Download, Share2, ArrowRight, 
  CheckCircle, AlertTriangle, TrendingUp, Brain, Scale, Compass 
} from 'lucide-react'
import Link from 'next/link'
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo'

export default function DecisionDoorPage() {
  const [userId, setUserId] = useState<string>()
  const [sessionId, setSessionId] = useState<string>()

  // Content tracking
  const { trackInteraction } = useContentTracking({
    contentId: 'decision-door-educational',
    contentType: 'educational-page',
    contentCategory: 'decision-making',
    userId,
    sessionId,
    enabled: true
  })

  const { trackCTAClick, trackDownload, trackShare } = useContentActions(
    'decision-door-educational',
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
      section: 'decision-door',
      contentDepth: 'comprehensive'
    })
  }, [])

  const handleCTAClick = (ctaType: string, ctaText: string) => {
    trackCTAClick(ctaType, ctaText)
    trackingService.trackCTAClick(`decision-door-${ctaType}`, ctaType, userId, {
      ctaText,
      pageSection: 'educational'
    })
  }

  const handleDownload = (resourceType: string) => {
    trackDownload(resourceType)
    trackingService.trackContentEngagement('decision-door-educational', 'download', userId, {
      resourceType
    })
  }

  const handleInteraction = (interactionType: string) => {
    trackInteraction(interactionType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[var(--color-transformation-50)] dark:to-[var(--color-transformation-900)]">
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
                onClick={() => handleDownload('decision-door-guide')}
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
              The Decision Door: Every Moment of Inaction Has a Cost
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              You're standing at the Decision Door right now. Behind you is your past. 
              Ahead are infinite possibilities. The quality of your decisions determines 
              the quality of your life.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm">
                <DoorOpen className="h-4 w-4 mr-1" />
                Decision frameworks
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Brain className="h-4 w-4 mr-1" />
                Cognitive biases
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Zap className="h-4 w-4 mr-1" />
                Fast decisions
              </Badge>
            </div>
            <Button
              size="lg"
              onClick={() => {
                handleCTAClick('assessment', 'Analyze Decision Style')
                document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-lg px-8 py-4 h-auto"
            >
              <DoorOpen className="mr-2 h-5 w-5" />
              Analyze Your Decision Style
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* The Cost of Indecision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('cost-of-indecision')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-transformation-600)]">
                  The Hidden Cost of Indecision
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground mb-6">
                    Most people think the biggest risk is making the wrong decision. 
                    But research shows the biggest risk is making no decision at all.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    Every moment you delay a decision, you're actually making a choice—the choice 
                    to stay where you are. And staying where you are has a cost.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        The Indecision Trap
                      </h3>
                      <ul className="space-y-2 text-sm text-red-600 dark:text-red-300">
                        <li>• Opportunity cost compounds daily</li>
                        <li>• Analysis paralysis prevents progress</li>
                        <li>• Stress and anxiety increase over time</li>
                        <li>• Others make decisions for you</li>
                        <li>• Regret about missed opportunities</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        The Decision Advantage
                      </h3>
                      <ul className="space-y-2 text-sm text-green-600 dark:text-green-300">
                        <li>• Forward momentum and progress</li>
                        <li>• Learning from outcomes (good or bad)</li>
                        <li>• Increased confidence and clarity</li>
                        <li>• Control over your direction</li>
                        <li>• Compound benefits over time</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-6 rounded-lg mt-8">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-transformation-600)]">
                      The 10-10-10 Rule
                    </h3>
                    <p className="text-muted-foreground">
                      Before making any decision, ask yourself: How will I feel about this in 
                      10 minutes, 10 months, and 10 years? This simple framework helps you 
                      balance short-term emotions with long-term consequences.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Decision-Making Frameworks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('decision-frameworks')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-transformation-600)]">
                  5 Proven Decision-Making Frameworks
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Great decision-makers don't rely on gut feeling alone. They use systematic 
                  frameworks to evaluate options and minimize bias.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">The DECIDE Framework</h3>
                      <p className="text-muted-foreground mb-4">
                        A systematic 6-step process for making complex decisions with multiple variables.
                      </p>
                      <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-4 rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li><strong>D</strong>efine the problem clearly</li>
                          <li><strong>E</strong>stablish criteria for solutions</li>
                          <li><strong>C</strong>onsider alternatives</li>
                          <li><strong>I</strong>dentify best alternatives</li>
                          <li><strong>D</strong>evelop and implement action plan</li>
                          <li><strong>E</strong>valuate and monitor solution</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">The Eisenhower Matrix</h3>
                      <p className="text-muted-foreground mb-4">
                        Prioritize decisions based on urgency and importance to focus on what matters most.
                      </p>
                      <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded">
                            <strong>Urgent + Important:</strong> Do First
                          </div>
                          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
                            <strong>Important + Not Urgent:</strong> Schedule
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                            <strong>Urgent + Not Important:</strong> Delegate
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                            <strong>Not Urgent + Not Important:</strong> Eliminate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Cost-Benefit Analysis</h3>
                      <p className="text-muted-foreground mb-4">
                        Quantify the pros and cons to make data-driven decisions, especially for 
                        business or financial choices.
                      </p>
                      <div className="bg-[var(--color-growth-50)] dark:bg-[var(--color-growth-900)] p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Benefits:</strong>
                            <ul className="mt-2 space-y-1">
                              <li>• Revenue increase: $X</li>
                              <li>• Time saved: X hours</li>
                              <li>• Stress reduction: High</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Costs:</strong>
                            <ul className="mt-2 space-y-1">
                              <li>• Financial investment: $X</li>
                              <li>• Time investment: X hours</li>
                              <li>• Opportunity cost: Medium</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">The 5 Whys Technique</h3>
                      <p className="text-muted-foreground mb-4">
                        Dig deeper into the root cause of problems by asking "why" five times 
                        to ensure you're solving the right issue.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <div><strong>Problem:</strong> I'm always stressed at work</div>
                          <div><strong>Why 1:</strong> I have too many deadlines</div>
                          <div><strong>Why 2:</strong> I take on too many projects</div>
                          <div><strong>Why 3:</strong> I can't say no to requests</div>
                          <div><strong>Why 4:</strong> I fear disappointing people</div>
                          <div><strong>Why 5:</strong> I lack confidence in my value</div>
                          <div className="pt-2 border-t"><strong>Root Cause:</strong> Need to build self-confidence</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      5
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">The Pre-Mortem Analysis</h3>
                      <p className="text-muted-foreground mb-4">
                        Imagine your decision has failed spectacularly. Work backwards to identify 
                        potential failure points and create contingency plans.
                      </p>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <div><strong>Scenario:</strong> "It's one year from now, and our decision was a disaster."</div>
                          <div><strong>Questions:</strong></div>
                          <ul className="ml-4 space-y-1">
                            <li>• What went wrong?</li>
                            <li>• What warning signs did we miss?</li>
                            <li>• What assumptions were incorrect?</li>
                            <li>• How can we prevent these failures?</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Cognitive Biases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('cognitive-biases')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-energy-600)]">
                  The 7 Cognitive Biases That Sabotage Decisions
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your brain uses mental shortcuts (heuristics) to make decisions quickly. 
                  But these shortcuts can lead you astray. Here are the most dangerous ones.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Confirmation Bias</h3>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Seeking information that confirms what you already believe while ignoring contradictory evidence.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Sunk Cost Fallacy</h3>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        Continuing a bad decision because you've already invested time, money, or effort.
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Anchoring Bias</h3>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">
                        Over-relying on the first piece of information encountered when making decisions.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Availability Heuristic</h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Overestimating the likelihood of events based on how easily you can remember examples.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Status Quo Bias</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Preferring things to stay the same by doing nothing or maintaining current decisions.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Overconfidence Bias</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Overestimating your own abilities, knowledge, or chances of success.
                      </p>
                    </div>

                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                      <h3 className="font-semibold text-pink-700 dark:text-pink-400 mb-2">Loss Aversion</h3>
                      <p className="text-sm text-pink-600 dark:text-pink-300">
                        Feeling the pain of losing something twice as strongly as the pleasure of gaining it.
                      </p>
                    </div>

                    <div className="p-4 bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] rounded-lg border border-[var(--color-transformation-200)] dark:border-[var(--color-transformation-800)]">
                      <h3 className="font-semibold text-[var(--color-transformation-600)] mb-2">The Antidote</h3>
                      <p className="text-sm text-[var(--color-transformation-600)]">
                        Awareness is the first step. Use structured frameworks and seek diverse perspectives to counteract these biases.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Fast vs Slow Decisions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
              onClick={() => handleInteraction('fast-slow-decisions')}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-growth-600)]">
                  When to Decide Fast vs. When to Decide Slow
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Jeff Bezos categorizes decisions into two types: reversible (Type 2) and 
                  irreversible (Type 1). Each requires a different approach.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--color-energy-500)] rounded-full flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      Fast Decisions (Type 2)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Reversible decisions that can be changed if they don't work out. 
                      Speed is more important than perfection.
                    </p>
                    <div className="bg-[var(--color-energy-50)] dark:bg-[var(--color-energy-900)] p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Hiring decisions (can be corrected)</li>
                        <li>• Product features (can be updated)</li>
                        <li>• Marketing campaigns (can be adjusted)</li>
                        <li>• Daily routines (can be changed)</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Decision Rule:</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Make the decision with 70% of the information you wish you had. 
                        You can course-correct later.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--color-transformation-500)] rounded-full flex items-center justify-center">
                        <Scale className="h-4 w-4 text-white" />
                      </div>
                      Slow Decisions (Type 1)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Irreversible or very costly to reverse. These require careful analysis 
                      and stakeholder input.
                    </p>
                    <div className="bg-[var(--color-transformation-50)] dark:bg-[var(--color-transformation-900)] p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Marriage and major relationships</li>
                        <li>• Career changes and education</li>
                        <li>• Major financial investments</li>
                        <li>• Business acquisitions</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Decision Rule:</h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Gather extensive information, consult experts, use multiple frameworks, 
                        and consider long-term consequences.
                      </p>
                    </div>
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
              <Card className="p-8 bg-gradient-to-br from-[var(--color-transformation-50)] to-[var(--color-energy-50)] dark:from-[var(--color-transformation-900)] dark:to-[var(--color-energy-900)]">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-[var(--color-transformation-600)]">
                    Analyze Your Decision Style
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Discover your decision-making patterns, identify your biases, and get 
                    personalized strategies to improve your decision quality.
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-transformation-600)] mb-2">7</div>
                    <div className="text-sm text-muted-foreground">Bias patterns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-transformation-600)] mb-2">5</div>
                    <div className="text-sm text-muted-foreground">Decision frameworks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-transformation-600)] mb-2">8 min</div>
                    <div className="text-sm text-muted-foreground">Assessment time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-transformation-600)] mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Personalized</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => handleCTAClick('assessment-start', 'Start Decision Analysis')}
                    className="text-lg px-8 py-4 h-auto"
                  >
                    <DoorOpen className="mr-2 h-5 w-5" />
                    Start Your Decision Analysis
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Get your personalized decision-making improvement plan
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
                      onClick={() => handleCTAClick('related-content', 'Leadership Lever')}>
                  <Link href="/leadership-lever">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-growth-600)]">
                      The Leadership Lever
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Great leaders are great decision-makers. Learn how to develop the 
                      leadership skills that amplify your decision-making impact.
                    </p>
                    <div className="flex items-center text-[var(--color-growth-600)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCTAClick('related-content', 'Success Gap')}>
                  <Link href="/success-gap">
                    <h3 className="text-xl font-semibold mb-3 text-[var(--color-energy-600)]">
                      The Success Gap
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your decisions determine your results. Discover the success factors 
                      that separate achievers from dreamers.
                    </p>
                    <div className="flex items-center text-[var(--color-energy-600)]">
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
              <Card className="p-8 bg-gradient-to-r from-[var(--color-transformation-500)] to-[var(--color-energy-500)] text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Master Decision-Making?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Join Galaxy Dream Team and learn the frameworks, tools, and strategies 
                  that turn decision-making into your competitive advantage.
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
                      handleCTAClick('learn-more', 'Learn More About Decision Door')
                      window.open('/decision-door/learn-more', '_blank')
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