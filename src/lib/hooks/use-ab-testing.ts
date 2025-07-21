"use client"

import { useState, useEffect } from 'react'

interface ABTestVariation {
  id: string
  name: string
  weight: number
  content: {
    hook: string
    benefits: string[]
    cta?: string
  }
}

interface ABTest {
  id: string
  name: string
  variations: ABTestVariation[]
  active: boolean
}

// Hook variations for different sections
const HOOK_TESTS: Record<string, ABTest> = {
  'success-gap': {
    id: 'success-gap-hooks',
    name: 'Success Gap Hook Variations',
    active: true,
    variations: [
      {
        id: 'original',
        name: 'Foundation-Focused Hook',
        weight: 25,
        content: {
          hook: "Understanding success factors is the difference between dreaming and achieving. Most people focus on motivation, but research shows it's actually about specific, measurable habits that compound over time.",
          benefits: [
            "Discover the exact habits that separate achievers from dreamers",
            "Learn why motivation fails and what actually works",
            "Get a personalized roadmap to bridge your success gap",
            "Build systems that create automatic success"
          ]
        }
      },
      {
        id: 'urgency',
        name: 'Urgency-Focused Hook',
        weight: 25,
        content: {
          hook: "Every day you wait, the gap between where you are and where you could be grows wider. The difference between dreamers and achievers isn't talent—it's knowing the exact success factors that create unstoppable momentum.",
          benefits: [
            "Stop wasting time on strategies that don't work",
            "Discover the hidden patterns of high achievers",
            "Transform your potential into measurable results",
            "Create momentum that compounds daily"
          ]
        }
      },
      {
        id: 'social_proof',
        name: 'Social Proof Hook',
        weight: 25,
        content: {
          hook: "While 73% of people never achieve their goals, the top 27% follow a specific set of success factors. These aren't secrets—they're proven strategies that anyone can learn and apply starting today.",
          benefits: [
            "Join the 27% who actually achieve their dreams",
            "Access the same strategies used by high achievers",
            "Get step-by-step implementation guidance",
            "See results within the first 2-3 weeks"
          ]
        }
      },
      {
        id: 'transformation',
        name: 'Transformation Hook',
        weight: 25,
        content: {
          hook: "What if the gap between your current life and your dream life could be bridged in just 90 days? The success factors that create this transformation are simpler than you think—but most people never discover them.",
          benefits: [
            "Bridge your success gap in 90 days or less",
            "Discover surprisingly simple success factors",
            "Transform your life using proven methods",
            "Start seeing changes within the first week"
          ]
        }
      }
    ]
  },
  'change-paradox': {
    id: 'change-paradox-hooks',
    name: 'Change Paradox Hook Variations',
    active: true,
    variations: [
      {
        id: 'original',
        name: 'Brain Science Hook',
        weight: 25,
        content: {
          hook: "The gap between knowing and doing isn't about willpower—it's about understanding how your brain's automatic systems work. Once you master this, lasting change becomes inevitable.",
          benefits: [
            "Understand why willpower fails and what actually works",
            "Master your brain's automatic habit systems",
            "Make lasting change feel effortless and natural",
            "Create habits that stick without constant effort"
          ]
        }
      },
      {
        id: 'scientific',
        name: 'Research-Based Hook',
        weight: 25,
        content: {
          hook: "Neuroscience reveals why 92% of people fail to change: they're fighting their brain's automatic systems instead of working with them. Once you understand the science, transformation becomes predictable.",
          benefits: [
            "Learn the neuroscience behind lasting change",
            "Work with your brain instead of against it",
            "Use proven scientific methods for transformation",
            "Make change predictable and sustainable"
          ]
        }
      },
      {
        id: 'frustration',
        name: 'Frustration-Focused Hook',
        weight: 25,
        content: {
          hook: "You know exactly what you should do, but you keep doing what you've always done. This isn't a character flaw—it's a habit loop problem. And habit loops can be rewired in just 21 days.",
          benefits: [
            "Stop the cycle of knowing but not doing",
            "Rewire your habit loops in 21 days",
            "Transform frustration into automatic action",
            "Finally become the person you know you can be"
          ]
        }
      },
      {
        id: 'identity',
        name: 'Identity-Based Hook',
        weight: 25,
        content: {
          hook: "The reason change feels so hard is because you're trying to change your actions without changing your identity. When you shift who you are, the actions follow automatically.",
          benefits: [
            "Change your identity, not just your actions",
            "Make new behaviors feel natural and automatic",
            "Align your actions with your true self",
            "Create lasting change from the inside out"
          ]
        }
      }
    ]
  },
  'vision-void': {
    id: 'vision-void-hooks',
    name: 'Vision Void Hook Variations',
    active: true,
    variations: [
      {
        id: 'original',
        name: 'Navigation Hook',
        weight: 25,
        content: {
          hook: "Vision clarity is the foundation of all achievement. Without it, you're like a ship without a compass—you might be moving, but you're not going anywhere meaningful.",
          benefits: [
            "Create crystal-clear vision for your ideal future",
            "Stop drifting and start moving with purpose",
            "Transform vague dreams into specific, achievable goals",
            "Navigate life with confidence and direction"
          ]
        }
      },
      {
        id: 'emotional',
        name: 'Pain-Point Hook',
        weight: 25,
        content: {
          hook: "The pain of an unclear future is subtle but devastating. It shows up as restlessness, procrastination, and the nagging feeling that you're capable of so much more. Clear vision ends this suffering.",
          benefits: [
            "End the frustration of feeling directionless",
            "Replace restlessness with focused excitement",
            "Finally know exactly where you're going",
            "Stop the nagging feeling of unfulfilled potential"
          ]
        }
      },
      {
        id: 'statistical',
        name: 'Statistics Hook',
        weight: 25,
        content: {
          hook: "Harvard research shows that only 8% of people can describe their life vision in detail—and they're 10x more likely to achieve their goals. The other 92% are living by default, not by design.",
          benefits: [
            "Join the 8% who live by design, not default",
            "Become 10x more likely to achieve your goals",
            "Create a detailed roadmap for your ideal life",
            "Stop living randomly and start living intentionally"
          ]
        }
      },
      {
        id: 'future_self',
        name: 'Future Self Hook',
        weight: 25,
        content: {
          hook: "Your future self is trying to send you a message about the life you're meant to live. But without clear vision, you can't hear it. It's time to tune in and discover what your best life actually looks like.",
          benefits: [
            "Connect with your future self's wisdom",
            "Discover the life you're truly meant to live",
            "Tune into your deepest aspirations and dreams",
            "Create alignment between who you are and who you're becoming"
          ]
        }
      }
    ]
  },
  'leadership-lever': {
    id: 'leadership-lever-hooks',
    name: 'Leadership Lever Hook Variations',
    active: true,
    variations: [
      {
        id: 'original',
        name: 'Self-Leadership Hook',
        weight: 25,
        content: {
          hook: "Leadership isn't just about managing others—it's about mastering yourself first. Your leadership style determines your impact in every area of life, from career to relationships to personal growth.",
          benefits: [
            "Discover your natural leadership strengths",
            "Learn to influence without authority",
            "Maximize your impact in all areas of life",
            "Master the art of self-leadership first"
          ]
        }
      },
      {
        id: 'personal',
        name: 'Multiplier Hook',
        weight: 25,
        content: {
          hook: "The most successful people aren't just good at what they do—they're exceptional at leading themselves. Self-leadership is the hidden skill that multiplies every other ability you have.",
          benefits: [
            "Master the art of self-leadership",
            "Multiply the effectiveness of all your skills",
            "Become the leader others naturally follow",
            "Unlock your hidden leadership potential"
          ]
        }
      },
      {
        id: 'influence',
        name: 'Influence Hook',
        weight: 25,
        content: {
          hook: "You're already leading—whether you realize it or not. Every interaction is an opportunity to influence, inspire, or impact others. The question is: are you leading consciously or by accident?",
          benefits: [
            "Lead consciously in every interaction",
            "Maximize your influence and impact",
            "Inspire others through authentic leadership",
            "Turn everyday moments into leadership opportunities"
          ]
        }
      },
      {
        id: 'potential',
        name: 'Potential Hook',
        weight: 25,
        content: {
          hook: "Your leadership potential is like a sleeping giant. Most people never wake it up because they don't know their natural leadership style. Once you discover yours, everything changes.",
          benefits: [
            "Awaken your sleeping leadership giant",
            "Discover your unique leadership style",
            "Transform how others see and respond to you",
            "Step into your full leadership potential"
          ]
        }
      }
    ]
  },
  'decision-door': {
    id: 'decision-door-hooks',
    name: 'Decision Door Hook Variations',
    active: true,
    variations: [
      {
        id: 'original',
        name: 'Cost-Focused Hook',
        weight: 25,
        content: {
          hook: "Every moment of inaction has a cost. Every day you wait, the gap between where you are and where you could be grows wider. The question isn't whether you can afford to invest in yourself—it's whether you can afford not to.",
          benefits: [
            "Calculate the true cost of staying where you are",
            "Understand what delayed action is really costing you",
            "Make decisions based on facts, not fear",
            "Stop paying the price of inaction"
          ]
        }
      },
      {
        id: 'opportunity',
        name: 'Crossroads Hook',
        weight: 25,
        content: {
          hook: "Right now, you're at a crossroads that will define your next five years. You can choose the path of transformation or the path of regret. Most people choose regret because it feels safer. But you're not most people.",
          benefits: [
            "Seize this moment of opportunity",
            "Choose transformation over regret",
            "Take the path that leads to your best life",
            "Define your next five years starting now"
          ]
        }
      },
      {
        id: 'urgency',
        name: 'Time-Sensitive Hook',
        weight: 25,
        content: {
          hook: "This moment—right now—is the youngest you'll ever be and the oldest you've ever been. The perfect time to start was 10 years ago. The second-best time is now. What will you choose?",
          benefits: [
            "Stop waiting for the 'perfect' time",
            "Seize this moment before it's gone",
            "Make the choice your future self will thank you for",
            "Turn this moment into your transformation point"
          ]
        }
      },
      {
        id: 'identity',
        name: 'Identity Hook',
        weight: 25,
        content: {
          hook: "You've spent your whole life becoming who you are today. The question is: is this who you want to be for the rest of your life? If not, this is your moment to choose who you become next.",
          benefits: [
            "Choose who you become next",
            "Stop accepting limitations as permanent",
            "Design the person you want to be",
            "Make this your transformation moment"
          ]
        }
      }
    ]
  }
}

export function useABTesting() {
  const [userVariations, setUserVariations] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load existing variations from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ab_test_variations')
      if (stored) {
        setUserVariations(JSON.parse(stored))
      } else {
        // Assign variations for new user
        const newVariations: Record<string, string> = {}
        
        Object.entries(HOOK_TESTS).forEach(([sectionId, test]) => {
          if (test.active) {
            const randomValue = Math.random() * 100
            let cumulativeWeight = 0
            
            for (const variation of test.variations) {
              cumulativeWeight += variation.weight
              if (randomValue <= cumulativeWeight) {
                newVariations[sectionId] = variation.id
                break
              }
            }
          }
        })
        
        setUserVariations(newVariations)
        localStorage.setItem('ab_test_variations', JSON.stringify(newVariations))
      }
    }
  }, [])

  const getVariation = (sectionId: string): ABTestVariation | null => {
    const test = HOOK_TESTS[sectionId]
    if (!test || !test.active) return null

    const variationId = userVariations[sectionId]
    if (!variationId) return test.variations[0] // Default to first variation

    return test.variations.find(v => v.id === variationId) || test.variations[0]
  }

  const trackVariationExposure = async (sectionId: string) => {
    const variation = getVariation(sectionId)
    if (!variation) return

    try {
              await fetch('/api/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ab_test_exposure',
          data: {
            testId: HOOK_TESTS[sectionId]?.id,
            variationId: variation.id,
            sectionId,
            timestamp: Date.now(),
            sessionId: typeof window !== 'undefined' ? localStorage.getItem('session_id') : null
          }
        }),
      })
    } catch (error) {
      console.error('Error tracking A/B test exposure:', error)
    }
  }

  return {
    getVariation,
    trackVariationExposure,
    userVariations
  }
}