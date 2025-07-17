"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Unlock, Shield, Lightbulb } from 'lucide-react'

export function LimitingBeliefIdentifier() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'limiting-belief-identifier',
    title: 'Limiting Belief Identifier',
    description: 'Uncover the hidden beliefs that may be holding you back',
    questions: [
      {
        id: 'scenario-1',
        type: 'multiple-choice',
        text: 'You're offered a promotion at work that would be a significant step up in responsibility. Your first thought is:',
        required: true,
        category: 'self-worth',
        weight: 1.5,
        options: [
          {
            id: 's1-1',
            text: '"I'm not ready for this level of responsibility yet."',
            value: 1,
            score: 1
          },
          {
            id: 's1-2',
            text: '"I wonder if they asked anyone else before me."',
            value: 2,
            score: 2
          },
          {
            id: 's1-3',
            text: '"I'll probably have to work twice as hard to prove myself."',
            value: 3,
            score: 3
          },
          {
            id: 's1-4',
            text: '"This is a great opportunity to grow and develop."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'scenario-2',
        type: 'multiple-choice',
        text: 'You make a significant mistake on an important project. Your immediate reaction is:',
        required: true,
        category: 'failure',
        weight: 1.4,
        options: [
          {
            id: 's2-1',
            text: '"This proves I'm not good enough for this role."',
            value: 1,
            score: 1
          },
          {
            id: 's2-2',
            text: '"I should have known better. I always mess things up."',
            value: 2,
            score: 2
          },
          {
            id: 's2-3',
            text: '"I hope no one notices or finds out it was me."',
            value: 3,
            score: 3
          },
          {
            id: 's2-4',
            text: '"What can I learn from this to improve next time?"',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'scenario-3',
        type: 'multiple-choice',
        text: 'You want to start a new business or side project. What thought is most likely to stop you?',
        required: true,
        category: 'capability',
        weight: 1.3,
        options: [
          {
            id: 's3-1',
            text: '"I don't have what it takes to be successful as an entrepreneur."',
            value: 1,
            score: 1
          },
          {
            id: 's3-2',
            text: '"The market is too competitive; I'll never stand out."',
            value: 2,
            score: 2
          },
          {
            id: 's3-3',
            text: '"I should wait until I have more experience/knowledge/money."',
            value: 3,
            score: 3
          },
          {
            id: 's3-4',
            text: '"I can start small and learn as I go."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'scenario-4',
        type: 'multiple-choice',
        text: 'When you think about pursuing your biggest dream, what's the main thought that comes up?',
        required: true,
        category: 'deserving',
        weight: 1.5,
        options: [
          {
            id: 's4-1',
            text: '"People like me don't achieve things like that."',
            value: 1,
            score: 1
          },
          {
            id: 's4-2',
            text: '"I'm not sure I deserve that level of success."',
            value: 2,
            score: 2
          },
          {
            id: 's4-3',
            text: '"It would require too much sacrifice or change."',
            value: 3,
            score: 3
          },
          {
            id: 's4-4',
            text: '"I can create a plan to make it happen step by step."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'scenario-5',
        type: 'multiple-choice',
        text: 'You see someone similar to you achieve great success. Your honest reaction is:',
        required: true,
        category: 'possibility',
        weight: 1.2,
        options: [
          {
            id: 's5-1',
            text: '"They must have had advantages or connections I don't have."',
            value: 1,
            score: 1
          },
          {
            id: 's5-2',
            text: '"They got lucky with timing or circumstances."',
            value: 2,
            score: 2
          },
          {
            id: 's5-3',
            text: '"Good for them, but my situation is different."',
            value: 3,
            score: 3
          },
          {
            id: 's5-4',
            text: '"If they can do it, maybe I can too with the right approach."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'direct-1',
        type: 'multiple-choice',
        text: 'Complete this sentence: "Deep down, I believe success is..."',
        required: true,
        category: 'success-beliefs',
        weight: 1.4,
        options: [
          {
            id: 'd1-1',
            text: '"...mostly determined by luck and who you know."',
            value: 1,
            score: 1
          },
          {
            id: 'd1-2',
            text: '"...for people with natural talent or special advantages."',
            value: 2,
            score: 2
          },
          {
            id: 'd1-3',
            text: '"...possible but requires extreme sacrifice or struggle."',
            value: 3,
            score: 3
          },
          {
            id: 'd1-4',
            text: '"...achievable through consistent effort and growth."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'direct-2',
        type: 'multiple-choice',
        text: 'Which statement do you find yourself thinking most often?',
        required: true,
        category: 'self-talk',
        weight: 1.5,
        options: [
          {
            id: 'd2-1',
            text: '"I'm not _____ enough." (smart, talented, experienced, etc.)',
            value: 1,
            score: 1
          },
          {
            id: 'd2-2',
            text: '"What if I fail or look foolish?"',
            value: 2,
            score: 2
          },
          {
            id: 'd2-3',
            text: '"I should wait until conditions are better."',
            value: 3,
            score: 3
          },
          {
            id: 'd2-4',
            text: '"I can figure this out and grow through the process."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'direct-3',
        type: 'multiple-choice',
        text: 'When you think about changing careers or pursuing a passion, what stops you most?',
        required: true,
        category: 'change-beliefs',
        weight: 1.3,
        options: [
          {
            id: 'd3-1',
            text: '"It's too late for me to make such a big change."',
            value: 1,
            score: 1
          },
          {
            id: 'd3-2',
            text: '"I've invested too much in my current path to change now."',
            value: 2,
            score: 2
          },
          {
            id: 'd3-3',
            text: '"I'm not sure I can succeed in a new field."',
            value: 3,
            score: 3
          },
          {
            id: 'd3-4',
            text: '"It would be challenging but potentially worth it."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'direct-4',
        type: 'multiple-choice',
        text: 'Which belief about money resonates with you most?',
        required: true,
        category: 'money-beliefs',
        weight: 1.2,
        options: [
          {
            id: 'd4-1',
            text: '"Money is scarce and hard to come by for people like me."',
            value: 1,
            score: 1
          },
          {
            id: 'd4-2',
            text: '"Wealthy people usually had to do something unethical to get there."',
            value: 2,
            score: 2
          },
          {
            id: 'd4-3',
            text: '"I can make money, but it requires sacrificing what I enjoy."',
            value: 3,
            score: 3
          },
          {
            id: 'd4-4',
            text: '"I can create value and be rewarded financially for it."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'direct-5',
        type: 'multiple-choice',
        text: 'Which statement about relationships do you most believe?',
        required: true,
        category: 'relationship-beliefs',
        weight: 1.1,
        options: [
          {
            id: 'd5-1',
            text: '"I have to be perfect or achieve certain things to be loved."',
            value: 1,
            score: 1
          },
          {
            id: 'd5-2',
            text: '"People will eventually leave or disappoint me."',
            value: 2,
            score: 2
          },
          {
            id: 'd5-3',
            text: '"I need to put others' needs before my own to maintain relationships."',
            value: 3,
            score: 3
          },
          {
            id: 'd5-4',
            text: '"Healthy relationships involve mutual growth and support."',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'origin-1',
        type: 'text',
        text: 'Think about a limiting belief you identified with. When do you first remember thinking this way?',
        description: 'This helps identify the origin of your limiting beliefs',
        required: false,
        category: 'origins',
        placeholder: 'Describe when and how this belief might have started...'
      },
      {
        id: 'impact-1',
        type: 'text',
        text: 'How has this limiting belief affected your choices or actions in the past?',
        description: 'Understanding impact helps in creating change',
        required: false,
        category: 'impact',
        placeholder: 'Describe specific situations where this belief influenced your decisions...'
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'self-worth',
          name: 'Self-Worth Beliefs',
          weight: 1.5,
          questions: ['scenario-1', 'direct-2']
        },
        {
          id: 'failure',
          name: 'Failure Beliefs',
          weight: 1.4,
          questions: ['scenario-2']
        },
        {
          id: 'capability',
          name: 'Capability Beliefs',
          weight: 1.3,
          questions: ['scenario-3', 'direct-3']
        },
        {
          id: 'deserving',
          name: 'Deservingness Beliefs',
          weight: 1.5,
          questions: ['scenario-4']
        },
        {
          id: 'possibility',
          name: 'Possibility Beliefs',
          weight: 1.2,
          questions: ['scenario-5', 'direct-1']
        },
        {
          id: 'success-beliefs',
          name: 'Success Beliefs',
          weight: 1.4,
          questions: ['direct-1']
        },
        {
          id: 'money-beliefs',
          name: 'Money Beliefs',
          weight: 1.2,
          questions: ['direct-4']
        },
        {
          id: 'relationship-beliefs',
          name: 'Relationship Beliefs',
          weight: 1.1,
          questions: ['direct-5']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Highly Limited',
          description: 'Your beliefs are significantly limiting your potential and actions.',
          insights: [
            'You have several strong limiting beliefs that are holding you back',
            'These beliefs likely affect multiple areas of your life',
            'You may frequently feel stuck or unable to progress'
          ],
          recommendations: [
            'Work with a coach or therapist to address deep-rooted limiting beliefs',
            'Practice daily affirmations that directly counter your top limiting beliefs',
            'Start a belief journal to track and challenge negative thoughts',
            'Surround yourself with people who demonstrate growth mindsets'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Partially Limited',
          description: 'You have some limiting beliefs mixed with more empowering perspectives.',
          insights: [
            'You have a mix of limiting and empowering beliefs',
            'You may feel capable in some areas but restricted in others',
            'Your limiting beliefs likely surface during stress or challenges'
          ],
          recommendations: [
            'Focus on reframing your top 3 limiting beliefs into empowering alternatives',
            'Create evidence lists that contradict your limiting beliefs',
            'Practice stepping outside your comfort zone in areas where limiting beliefs are strongest',
            'Develop awareness of when limiting beliefs are activated and practice interrupting them'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Mostly Empowered',
          description: 'You generally hold empowering beliefs that support your growth and potential.',
          insights: [
            'You have predominantly empowering beliefs about yourself and your capabilities',
            'You likely approach challenges with a growth mindset',
            'You may still have specific areas where limiting beliefs appear'
          ],
          recommendations: [
            'Continue strengthening your empowering belief systems',
            'Address any remaining specific limiting beliefs',
            'Share your mindset strategies with others who might benefit',
            'Challenge yourself to reach for even bigger goals that test your belief boundaries'
          ]
        }
      ]
    },
    progressSaving: true,
    showProgress: true,
    allowBackNavigation: true
  }

  if (!started) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Unlock className="h-6 w-6 text-primary" />
            Limiting Belief Identifier
          </CardTitle>
          <CardDescription>
            Uncover the hidden beliefs that may be holding you back from reaching your full potential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Hidden Barriers</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover beliefs that limit your actions and decisions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Unlock className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Understand Origins & Impact</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn where these beliefs came from and how they affect you
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Get Transformation Strategies</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Receive personalized techniques to reframe limiting beliefs
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your top 3 limiting beliefs that may be holding you back</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>The specific life areas most affected by these beliefs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Potential origins of these beliefs in your past experiences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to transform limiting beliefs into empowering ones</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
              Start Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Takes approximately 5-7 minutes to complete • Your results are saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="limiting-belief-identifier"
      title="Limiting Belief Identifier"
      description="Uncover the hidden beliefs that may be holding you back"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}