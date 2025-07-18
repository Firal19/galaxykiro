"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, Play, BookOpen, Calculator, Target, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { useABTesting } from "@/lib/hooks/use-ab-testing"
import { Button } from "@/components/ui/button"

interface EnhancedSectionHookProps {
  sectionId: 'decision-door' | 'leadership-lever' | 'vision-void' | 'change-paradox' | 'success-gap'
  question: string
  questionLink: string
  hookVariation?: 'question' | 'statement' | 'story' | 'statistic'
  className?: string
  children?: ReactNode
}

interface HookContent {
  question: {
    primary: string
    secondary: string
    expandedContent: string
    relatedTools: Array<{
      name: string
      description: string
      url: string
      icon: React.ComponentType<{ className?: string }>
    }>
  }
  statement: {
    primary: string
    secondary: string
    expandedContent: string
    relatedTools: Array<{
      name: string
      description: string
      url: string
      icon: React.ComponentType<{ className?: string }>
    }>
  }
  story: {
    primary: string
    secondary: string
    expandedContent: string
    relatedTools: Array<{
      name: string
      description: string
      url: string
      icon: React.ComponentType<{ className?: string }>
    }>
  }
  statistic: {
    primary: string
    secondary: string
    expandedContent: string
    relatedTools: Array<{
      name: string
      description: string
      url: string
      icon: React.ComponentType<{ className?: string }>
    }>
  }
}

const sectionHooks: Record<EnhancedSectionHookProps['sectionId'], HookContent> = {
  'decision-door': {
    question: {
      primary: "What if every 'maybe later' is actually a 'no' in disguise?",
      secondary: "The decisions you avoid are still decisions – they're just decisions to stay where you are.",
      expandedContent: "Research shows that the average person makes 35,000 decisions per day, yet most people struggle with the big ones that could transform their lives. The Decision Door isn't about making perfect choices – it's about making empowered ones. When you understand your decision-making patterns, you can break free from analysis paralysis and start creating the life you actually want.",
      relatedTools: [
        {
          name: "Decision Style Profiler",
          description: "Discover your unique decision-making patterns",
          url: "/tools/decision-style",
          icon: Target
        },
        {
          name: "Choice Clarity Calculator",
          description: "Get clear on your next big decision",
          url: "/tools/choice-clarity",
          icon: Calculator
        }
      ]
    },
    statement: {
      primary: "Your next level of life is waiting behind a decision you haven't made yet.",
      secondary: "Every successful person has one thing in common: they decided to act when others decided to wait.",
      expandedContent: "The Decision Door represents the moment when potential becomes reality. It's not about having all the answers – it's about having the courage to step forward anyway. Behind every transformation is a decision that felt scary at the time but became the turning point that changed everything.",
      relatedTools: [
        {
          name: "Courage Quotient Assessment",
          description: "Measure your readiness to make bold decisions",
          url: "/tools/courage-quotient",
          icon: Target
        },
        {
          name: "Next Level Planner",
          description: "Map your path to your next breakthrough",
          url: "/tools/next-level-planner",
          icon: BookOpen
        }
      ]
    },
    story: {
      primary: "Sarah stared at the job application for 3 months before finally hitting 'submit.'",
      secondary: "Six months later, she was leading a team of 50 people in her dream role.",
      expandedContent: "The Decision Door isn't just about big, life-changing moments – it's about recognizing that every small decision is practice for the big ones. Sarah's story isn't unique. What made the difference wasn't her qualifications or timing – it was her willingness to walk through the door of uncertainty. The Decision Door teaches you to see opportunities where others see obstacles.",
      relatedTools: [
        {
          name: "Opportunity Recognition Quiz",
          description: "Learn to spot hidden opportunities",
          url: "/tools/opportunity-recognition",
          icon: Target
        },
        {
          name: "Confidence Builder Toolkit",
          description: "Build the confidence to take action",
          url: "/tools/confidence-builder",
          icon: Play
        }
      ]
    },
    statistic: {
      primary: "87% of people regret the chances they didn't take, not the ones they did.",
      secondary: "The biggest risk is not taking any risk at all.",
      expandedContent: "Harvard Business School studied 10,000 professionals over 20 years and found that career satisfaction wasn't correlated with perfect decisions – it was correlated with decisive action. The Decision Door framework helps you make better decisions faster, so you can spend less time wondering 'what if' and more time creating 'what is.'",
      relatedTools: [
        {
          name: "Regret Prevention Planner",
          description: "Make decisions you will be proud of later",
          url: "/tools/regret-prevention",
          icon: BookOpen
        },
        {
          name: "Risk Assessment Matrix",
          description: "Evaluate opportunities with confidence",
          url: "/tools/risk-assessment",
          icon: Calculator
        }
      ]
    }
  },
  'leadership-lever': {
    question: {
      primary: "Are you leading your life, or is your life leading you?",
      secondary: "Leadership isn't a title – it's a choice you make every single day.",
      expandedContent: "The Leadership Lever reveals that everyone is a leader – the question is what you're leading toward. Whether you're leading a team of thousands or just leading yourself toward your goals, the principles are the same. True leadership starts with self-leadership: the ability to influence your own thoughts, emotions, and actions in service of your vision.",
      relatedTools: [
        {
          name: "Self-Leadership Assessment",
          description: "Discover your leadership starting point",
          url: "/tools/self-leadership",
          icon: Target
        },
        {
          name: "Influence Impact Calculator",
          description: "Measure your leadership effectiveness",
          url: "/tools/influence-impact",
          icon: Calculator
        }
      ]
    },
    statement: {
      primary: "Every expert was once a beginner who refused to give up.",
      secondary: "Leadership is not about being perfect – it's about being persistent.",
      expandedContent: "The Leadership Lever shows you that leadership development is not about waiting until you feel ready – it's about growing into readiness through action. Every time you choose growth over comfort, you're exercising leadership. Every time you help someone else succeed, you're building your leadership muscle.",
      relatedTools: [
        {
          name: "Leadership Growth Tracker",
          description: "Monitor your leadership development",
          url: "/tools/leadership-growth",
          icon: BookOpen
        },
        {
          name: "Mentorship Readiness Quiz",
          description: "Assess your readiness to lead others",
          url: "/tools/mentorship-readiness",
          icon: Target
        }
      ]
    },
    story: {
      primary: "Marcus was promoted to manager and felt completely unprepared.",
      secondary: "Two years later, his team had the highest performance rating in the company.",
      expandedContent: "Marcus discovered that leadership isn't about having all the answers – it's about asking the right questions and creating an environment where others can succeed. The Leadership Lever taught him that authentic leadership comes from serving others' growth, not from proving your own worth. His transformation from reluctant manager to inspiring leader happened one conversation, one decision, one day at a time.",
      relatedTools: [
        {
          name: "Leadership Style Profiler",
          description: "Discover your natural leadership approach",
          url: "/tools/leadership-style",
          icon: Target
        },
        {
          name: "Team Dynamics Analyzer",
          description: "Optimize your team's performance",
          url: "/tools/team-dynamics",
          icon: Calculator
        }
      ]
    },
    statistic: {
      primary: "Companies with strong leadership development are 2.3x more likely to outperform peers.",
      secondary: "But 77% of organizations report a leadership shortage.",
      expandedContent: "The Leadership Lever addresses this gap by showing you that leadership development starts with personal development. You can't lead others to places you haven't been yourself. The most effective leaders are those who commit to continuous growth and model the behaviors they want to see in others.",
      relatedTools: [
        {
          name: "Leadership Gap Analysis",
          description: "Identify your development opportunities",
          url: "/tools/leadership-gap",
          icon: Calculator
        },
        {
          name: "Executive Presence Builder",
          description: "Develop your leadership presence",
          url: "/tools/executive-presence",
          icon: Play
        }
      ]
    }
  },
  'vision-void': {
    question: {
      primary: "Can you describe your life 5 years from now in vivid detail?",
      secondary: "If you can't see it clearly, how will you know when you've arrived?",
      expandedContent: "The Vision Void is the gap between where you are and where you want to be – but more importantly, it's the gap between having a vague idea of 'better' and having a crystal-clear vision that pulls you forward. Most people live in the void, hoping things will improve without a clear picture of what improvement looks like.",
      relatedTools: [
        {
          name: "Future Self Visualizer",
          description: "Create a detailed vision of your future",
          url: "/tools/future-self",
          icon: Target
        },
        {
          name: "Vision Clarity Score",
          description: "Measure how clear your vision really is",
          url: "/tools/vision-clarity",
          icon: Calculator
        }
      ]
    },
    statement: {
      primary: "A goal without a vision is just a wish with a deadline.",
      secondary: "Vision is the bridge between your current reality and your desired future.",
      expandedContent: "The Vision Void teaches you that clarity is power. When you can see your future self clearly – what you're doing, how you're feeling, what you've accomplished – your brain starts working to make that vision reality. Vision isn't just about setting goals; it's about creating a magnetic future that draws you forward even when the path gets difficult.",
      relatedTools: [
        {
          name: "Vision Board Creator",
          description: "Build a compelling visual representation",
          url: "/tools/vision-board",
          icon: BookOpen
        },
        {
          name: "Goal Alignment Checker",
          description: "Ensure your goals match your vision",
          url: "/tools/goal-alignment",
          icon: Target
        }
      ]
    },
    story: {
      primary: "Lisa had been 'working on herself' for years but felt like she was going in circles.",
      secondary: "Everything changed when she got specific about what 'better' actually looked like.",
      expandedContent: "Lisa's breakthrough came when she realized she was trying to improve without a destination. The Vision Void helped her understand that personal development without direction is just expensive therapy. Once she created a clear, compelling vision of her future self, every decision became easier because she had a filter: 'Does this move me toward my vision or away from it?'",
      relatedTools: [
        {
          name: "Life Direction Compass",
          description: "Find your true north",
          url: "/tools/life-direction",
          icon: Target
        },
        {
          name: "Progress Tracking System",
          description: "Monitor your journey toward your vision",
          url: "/tools/progress-tracking",
          icon: Calculator
        }
      ]
    },
    statistic: {
      primary: "People with written goals are 42% more likely to achieve them.",
      secondary: "But only 3% of people have written goals with specific deadlines.",
      expandedContent: "The Vision Void bridges this gap by helping you not just set goals, but create a compelling future vision that makes achieving those goals inevitable. Research shows that visualization activates the same neural pathways as actual experience, essentially training your brain for success before you even begin.",
      relatedTools: [
        {
          name: "Goal Achievement Predictor",
          description: "Calculate your likelihood of success",
          url: "/tools/goal-achievement",
          icon: Calculator
        },
        {
          name: "Visualization Training Program",
          description: "Master the art of mental rehearsal",
          url: "/tools/visualization-training",
          icon: Play
        }
      ]
    }
  },
  'change-paradox': {
    question: {
      primary: "Why do you keep doing things you know aren't working?",
      secondary: "The definition of insanity is doing the same thing and expecting different results.",
      expandedContent: "The Change Paradox reveals why change is simultaneously the most natural thing in the world (everything changes) and the most difficult thing for humans to do intentionally. Understanding this paradox is the key to making lasting transformation possible instead of just temporary improvement.",
      relatedTools: [
        {
          name: "Change Readiness Assessment",
          description: "Discover what is really stopping you",
          url: "/tools/change-readiness",
          icon: Target
        },
        {
          name: "Habit Loop Analyzer",
          description: "Understand your automatic behaviors",
          url: "/tools/habit-loop",
          icon: Calculator
        }
      ]
    },
    statement: {
      primary: "You are always one decision away from a completely different life.",
      secondary: "The question isn't whether you can change – it's whether you will.",
      expandedContent: "The Change Paradox shows you that resistance to change isn't a character flaw – it's a feature of human psychology designed to keep you safe. But what kept you safe in the past might be keeping you stuck in the present. True change happens when you understand how to work with your psychology, not against it.",
      relatedTools: [
        {
          name: "Transformation Timeline",
          description: "Map your personal change journey",
          url: "/tools/transformation-timeline",
          icon: BookOpen
        },
        {
          name: "Resistance Pattern Identifier",
          description: "Recognize what holds you back",
          url: "/tools/resistance-patterns",
          icon: Target
        }
      ]
    },
    story: {
      primary: "David tried to quit smoking 47 times before it finally stuck.",
      secondary: "The difference wasn't willpower – it was understanding why he smoked in the first place.",
      expandedContent: "David's story illustrates the Change Paradox perfectly: he had the motivation, the knowledge, and the desire to change, but he was fighting against unconscious patterns that served a purpose he didn't understand. Once he addressed the underlying need his smoking habit was meeting, change became not just possible, but inevitable.",
      relatedTools: [
        {
          name: "Underlying Need Detector",
          description: "Discover what your habits are really doing for you",
          url: "/tools/underlying-needs",
          icon: Target
        },
        {
          name: "Sustainable Change Planner",
          description: "Create lasting transformation strategies",
          url: "/tools/sustainable-change",
          icon: BookOpen
        }
      ]
    },
    statistic: {
      primary: "92% of people fail to achieve their New Year's resolutions.",
      secondary: "But those who understand the psychology of change have a 73% success rate.",
      expandedContent: "The Change Paradox explains why most change attempts fail and provides a framework for joining the 8% who succeed. It's not about having more willpower – it's about understanding how change actually works and designing your approach accordingly.",
      relatedTools: [
        {
          name: "Change Success Predictor",
          description: "Calculate your likelihood of lasting change",
          url: "/tools/change-success",
          icon: Calculator
        },
        {
          name: "Psychology-Based Change Kit",
          description: "Tools based on behavioral science",
          url: "/tools/psychology-change-kit",
          icon: Play
        }
      ]
    }
  },
  'success-gap': {
    question: {
      primary: "What's the difference between knowing what to do and actually doing it?",
      secondary: "Everyone knows they should exercise, eat well, and follow their dreams. So why don't they?",
      expandedContent: "The Success Gap is the space between knowledge and action, between intention and implementation. It's where most dreams go to die and where most potential remains unrealized. Bridging this gap isn't about learning more – it's about understanding why you don't act on what you already know.",
      relatedTools: [
        {
          name: "Knowledge-Action Gap Analyzer",
          description: "Identify what stops you from taking action",
          url: "/tools/knowledge-action-gap",
          icon: Calculator
        },
        {
          name: "Implementation Intention Builder",
          description: "Turn knowledge into automatic action",
          url: "/tools/implementation-intentions",
          icon: Target
        }
      ]
    },
    statement: {
      primary: "The gap between who you are and who you could be is measured in actions, not intentions.",
      secondary: "Success isn't about what you know – it's about what you do with what you know.",
      expandedContent: "The Success Gap reveals that information is not transformation. You can read every self-help book, attend every seminar, and know all the strategies, but until you bridge the gap between knowing and doing, nothing changes. The gap isn't closed by learning more – it's closed by implementing better.",
      relatedTools: [
        {
          name: "Action Bias Assessment",
          description: "Discover your natural tendency toward action",
          url: "/tools/action-bias",
          icon: Target
        },
        {
          name: "Execution Excellence Tracker",
          description: "Monitor your follow-through rate",
          url: "/tools/execution-excellence",
          icon: Calculator
        }
      ]
    },
    story: {
      primary: "Jennifer had three business plans, five workout routines, and two relationship books.",
      secondary: "But she was still single, out of shape, and working for someone else.",
      expandedContent: "Jennifer's story is the Success Gap in action. She was incredibly knowledgeable about what she wanted to change but couldn't understand why she wasn't changing. The breakthrough came when she realized that knowing what to do was actually preventing her from doing it – she was addicted to the feeling of progress that came from learning without the risk that came from acting.",
      relatedTools: [
        {
          name: "Learning vs. Doing Audit",
          description: "Balance knowledge acquisition with action",
          url: "/tools/learning-doing-audit",
          icon: Calculator
        },
        {
          name: "Accountability System Builder",
          description: "Create structures that ensure follow-through",
          url: "/tools/accountability-system",
          icon: BookOpen
        }
      ]
    },
    statistic: {
      primary: "The average person consumes 34GB of information daily but acts on less than 1%.",
      secondary: "Information overload is the new procrastination.",
      expandedContent: "The Success Gap has never been wider. We have access to more knowledge than any generation in history, yet rates of anxiety, depression, and feeling stuck are at all-time highs. The solution isn't more information – it's better implementation. The Success Gap framework helps you become someone who acts on what they learn.",
      relatedTools: [
        {
          name: "Information Diet Planner",
          description: "Optimize your learning for action",
          url: "/tools/information-diet",
          icon: BookOpen
        },
        {
          name: "Implementation Score Calculator",
          description: "Measure your action-to-knowledge ratio",
          url: "/tools/implementation-score",
          icon: Calculator
        }
      ]
    }
  }
}

export function EnhancedSectionHook({ 
  sectionId, 
  question, 
  questionLink, 
  hookVariation = 'question', 
  className,
  children 
}: EnhancedSectionHookProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showBenefits, setShowBenefits] = useState(false)
  const [benefitsVisible, setBenefitsVisible] = useState(false)
  const hookRef = useRef<HTMLDivElement>(null)
  const { trackEngagement } = useEngagementTracking()
  const { getVariation, trackVariationExposure } = useABTesting()

  // Get A/B test variation for this section
  const variation = getVariation(sectionId)
  const hookContent = sectionHooks[sectionId][hookVariation]

  // Track visibility and time spent
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          trackEngagement({
            type: 'hook_view',
            section: `${sectionId}-hook`,
            hookVariation,
            metadata: {
              deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
            }
          })
          
          // Track A/B test exposure
          if (variation) {
            trackVariationExposure(sectionId)
          }
        }
      },
      { threshold: 0.5 }
    )

    if (hookRef.current) {
      observer.observe(hookRef.current)
    }

    return () => observer.disconnect()
  }, [sectionId, hookVariation, isVisible, trackEngagement, variation, trackVariationExposure])

  // Track time spent when expanded
  useEffect(() => {
    if (!isExpanded) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [isExpanded])

  // Progressive disclosure of benefits
  useEffect(() => {
    if (isVisible && !benefitsVisible) {
      const timer = setTimeout(() => {
        setShowBenefits(true)
        setBenefitsVisible(true)
        trackEngagement({
          type: 'progressive_disclosure_view',
          section: `${sectionId}-hook`,
          metadata: {
            disclosureType: 'benefits'
          }
        })
      }, 3000) // Show benefits after 3 seconds of visibility
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, benefitsVisible, sectionId, trackEngagement])

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    
    trackEngagement({
      type: 'hook_expand',
      section: `${sectionId}-hook`,
      hookVariation,
      metadata: {
        expandDuration: timeSpent / 1000
      }
    })
  }

  const handleQuestionClick = () => {
    trackEngagement({
      type: 'question_click',
      section: `${sectionId}-hook`,
      metadata: {
        destination: questionLink
      }
    })
    
    // Navigate to the question's dedicated page
    window.location.href = questionLink
  }

  const handleToolClick = (toolName: string, toolUrl: string) => {
    trackEngagement({
      type: 'cta_click',
      section: `${sectionId}-hook`,
      metadata: {
        ctaType: 'tool',
        destination: toolUrl
      }
    })

    // Navigate to tool
    window.location.href = toolUrl
  }

  const handleLearnMore = () => {
    trackEngagement({
      type: 'learn_more_click',
      section: `${sectionId}-hook`,
      metadata: {
        destination: `/${sectionId}/learn-more`
      }
    })

    // Navigate to section page
    window.location.href = `/${sectionId}/learn-more`
  }
  
  const handleBenefitInteraction = (benefitIndex: number) => {
    trackEngagement({
      type: 'benefit_interaction',
      section: `${sectionId}-hook`,
      metadata: {
        benefitIndex
      }
    })
  }

  return (
    <motion.div
      ref={hookRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-sm",
        "hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Clickable Question */}
      <motion.div
        className="flex items-center gap-2 mb-4 cursor-pointer group"
        onClick={handleQuestionClick}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-[var(--color-energy-600)] transition-colors">
          {question}
        </h3>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Enhanced Hook from A/B Testing */}
      <div className="mb-4 pb-4 border-b border-border">
        <p className="text-muted-foreground leading-relaxed">
          {variation ? variation.content.hook : hookContent.secondary}
        </p>
      </div>
      
      {/* Progressive Disclosure of Benefits */}
      <AnimatePresence>
        {showBenefits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="space-y-2">
              {variation && variation.content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-2"
                  onClick={() => handleBenefitInteraction(index)}
                >
                  <div className="w-2 h-2 bg-[var(--color-energy-500)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <button
        onClick={handleExpand}
        className="flex items-center space-x-2 text-[var(--color-energy-600)] hover:text-[var(--color-energy-700)] transition-colors mb-4"
      >
        <span className="text-sm font-medium">
          {isExpanded ? 'Show Less' : 'Learn More'}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      {/* Render children if provided */}
      {children}
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border pt-4 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {hookContent.expandedContent}
              </p>

              {/* Related Tools */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground mb-3">
                  Try These Tools:
                </h4>
                {hookContent.relatedTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-[var(--color-energy-500)] transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[var(--color-energy-500)]/10 rounded-lg group-hover:bg-[var(--color-energy-500)]/20 transition-colors">
                        <tool.icon className="h-4 w-4 text-[var(--color-energy-600)]" />
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          {tool.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToolClick(tool.name, tool.url)}
                      className="shrink-0"
                    >
                      Try Now
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Learn More CTA */}
              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  variant="cta"
                  onClick={handleLearnMore}
                  className="w-full"
                >
                  Explore {sectionId.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')} Framework
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}