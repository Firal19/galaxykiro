"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Lightbulb, Zap } from 'lucide-react'

export function PotentialQuotientCalculator() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'potential-quotient-calculator',
    title: 'Potential Quotient Calculator',
    description: 'Discover your untapped potential and growth mindset indicators',
    questions: [
      {
        id: 'growth-mindset-1',
        type: 'scale',
        text: 'When faced with a challenge, I believe I can develop the skills needed to overcome it.',
        description: 'This measures your belief in your ability to grow and develop new abilities.',
        required: true,
        category: 'growth-mindset',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree',
          middle: 'Neutral'
        }
      },
      {
        id: 'growth-mindset-2',
        type: 'multiple-choice',
        text: 'When I encounter setbacks, I typically:',
        required: true,
        category: 'growth-mindset',
        weight: 1.2,
        options: [
          {
            id: 'gm2-1',
            text: 'Give up and move on to something else',
            value: 1,
            score: 1
          },
          {
            id: 'gm2-2',
            text: 'Try a few more times before giving up',
            value: 2,
            score: 3
          },
          {
            id: 'gm2-3',
            text: 'Try different approaches until I find one that works',
            value: 3,
            score: 5
          },
          {
            id: 'gm2-4',
            text: 'See it as an opportunity to learn and grow',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'learning-orientation-1',
        type: 'multiple-choice',
        text: 'Which statement best describes your approach to learning?',
        required: true,
        category: 'learning-orientation',
        weight: 1.3,
        options: [
          {
            id: 'lo1-1',
            text: 'I avoid learning new things that might make me look incompetent',
            value: 1,
            score: 1
          },
          {
            id: 'lo1-2',
            text: 'I learn new things when required for work or school',
            value: 2,
            score: 3
          },
          {
            id: 'lo1-3',
            text: 'I enjoy learning new things in areas I'm already good at',
            value: 3,
            score: 7
          },
          {
            id: 'lo1-4',
            text: 'I actively seek out challenging learning opportunities, even in unfamiliar areas',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'feedback-receptivity-1',
        type: 'scale',
        text: 'I actively seek feedback, even when it might be critical.',
        required: true,
        category: 'feedback-receptivity',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'feedback-receptivity-2',
        type: 'multiple-choice',
        text: 'When receiving constructive criticism, I typically:',
        required: true,
        category: 'feedback-receptivity',
        weight: 1.1,
        options: [
          {
            id: 'fr2-1',
            text: 'Feel defensive and reject it',
            value: 1,
            score: 1
          },
          {
            id: 'fr2-2',
            text: 'Listen politely but rarely change my approach',
            value: 2,
            score: 3
          },
          {
            id: 'fr2-3',
            text: 'Consider it carefully and sometimes make changes',
            value: 3,
            score: 7
          },
          {
            id: 'fr2-4',
            text: 'Appreciate it and use it to improve',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'comfort-discomfort-1',
        type: 'scale',
        text: 'I willingly put myself in challenging situations that push me outside my comfort zone.',
        required: true,
        category: 'comfort-discomfort',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'comfort-discomfort-2',
        type: 'multiple-choice',
        text: 'When faced with an opportunity that feels uncomfortable but could lead to growth:',
        required: true,
        category: 'comfort-discomfort',
        weight: 1.3,
        options: [
          {
            id: 'cd2-1',
            text: 'I almost always avoid it',
            value: 1,
            score: 1
          },
          {
            id: 'cd2-2',
            text: 'I sometimes take it if the risk seems low',
            value: 2,
            score: 4
          },
          {
            id: 'cd2-3',
            text: 'I often take it if I can see clear benefits',
            value: 3,
            score: 7
          },
          {
            id: 'cd2-4',
            text: 'I regularly embrace such opportunities',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'effort-belief-1',
        type: 'scale',
        text: 'I believe that consistent effort is more important than natural talent for achieving success.',
        required: true,
        category: 'effort-belief',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'effort-belief-2',
        type: 'multiple-choice',
        text: 'When I see someone who's highly successful in their field, I primarily attribute it to:',
        required: true,
        category: 'effort-belief',
        weight: 1.2,
        options: [
          {
            id: 'eb2-1',
            text: 'Natural talent or innate ability',
            value: 1,
            score: 2
          },
          {
            id: 'eb2-2',
            text: 'Luck and good connections',
            value: 2,
            score: 1
          },
          {
            id: 'eb2-3',
            text: 'A combination of talent and hard work',
            value: 3,
            score: 6
          },
          {
            id: 'eb2-4',
            text: 'Consistent effort, practice, and learning from failures',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'resilience-1',
        type: 'scale',
        text: 'I bounce back quickly from disappointments and setbacks.',
        required: true,
        category: 'resilience',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'resilience-2',
        type: 'multiple-choice',
        text: 'After experiencing a significant failure, I typically:',
        required: true,
        category: 'resilience',
        weight: 1.3,
        options: [
          {
            id: 'r2-1',
            text: 'Avoid similar situations in the future',
            value: 1,
            score: 1
          },
          {
            id: 'r2-2',
            text: 'Take a long time to recover before trying again',
            value: 2,
            score: 3
          },
          {
            id: 'r2-3',
            text: 'Reflect on what happened and try again with adjustments',
            value: 3,
            score: 7
          },
          {
            id: 'r2-4',
            text: 'See it as valuable feedback and immediately look for the next opportunity',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'curiosity-1',
        type: 'scale',
        text: 'I regularly explore topics outside my main areas of expertise out of curiosity.',
        required: true,
        category: 'curiosity',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'curiosity-2',
        type: 'multiple-choice',
        text: 'When I encounter information that contradicts my existing beliefs:',
        required: true,
        category: 'curiosity',
        weight: 1.1,
        options: [
          {
            id: 'c2-1',
            text: 'I typically dismiss it',
            value: 1,
            score: 1
          },
          {
            id: 'c2-2',
            text: 'I acknowledge it but maintain my original beliefs',
            value: 2,
            score: 3
          },
          {
            id: 'c2-3',
            text: 'I consider it and sometimes adjust my thinking',
            value: 3,
            score: 7
          },
          {
            id: 'c2-4',
            text: 'I eagerly explore it to expand my understanding',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'self-efficacy-1',
        type: 'scale',
        text: 'I believe I can achieve most goals I set for myself with enough effort and persistence.',
        required: true,
        category: 'self-efficacy',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'self-efficacy-2',
        type: 'multiple-choice',
        text: 'When starting a challenging new project or goal:',
        required: true,
        category: 'self-efficacy',
        weight: 1.3,
        options: [
          {
            id: 'se2-1',
            text: 'I often doubt my ability to complete it successfully',
            value: 1,
            score: 1
          },
          {
            id: 'se2-2',
            text: 'I feel uncertain but hope for the best',
            value: 2,
            score: 3
          },
          {
            id: 'se2-3',
            text: 'I'm cautiously optimistic about my chances',
            value: 3,
            score: 7
          },
          {
            id: 'se2-4',
            text: 'I'm confident that I'll find a way to succeed',
            value: 4,
            score: 10
          }
        ]
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'growth-mindset',
          name: 'Growth Mindset',
          weight: 1.5,
          questions: ['growth-mindset-1', 'growth-mindset-2']
        },
        {
          id: 'learning-orientation',
          name: 'Learning Orientation',
          weight: 1.3,
          questions: ['learning-orientation-1']
        },
        {
          id: 'feedback-receptivity',
          name: 'Feedback Receptivity',
          weight: 1.2,
          questions: ['feedback-receptivity-1', 'feedback-receptivity-2']
        },
        {
          id: 'comfort-discomfort',
          name: 'Comfort with Discomfort',
          weight: 1.4,
          questions: ['comfort-discomfort-1', 'comfort-discomfort-2']
        },
        {
          id: 'effort-belief',
          name: 'Effort Belief',
          weight: 1.5,
          questions: ['effort-belief-1', 'effort-belief-2']
        },
        {
          id: 'resilience',
          name: 'Resilience',
          weight: 1.4,
          questions: ['resilience-1', 'resilience-2']
        },
        {
          id: 'curiosity',
          name: 'Curiosity',
          weight: 1.2,
          questions: ['curiosity-1', 'curiosity-2']
        },
        {
          id: 'self-efficacy',
          name: 'Self-Efficacy',
          weight: 1.5,
          questions: ['self-efficacy-1', 'self-efficacy-2']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Fixed Mindset',
          description: 'You tend to believe abilities are mostly fixed and unchangeable.',
          insights: [
            'You may avoid challenges to prevent failure',
            'You might see effort as fruitless rather than a path to mastery',
            'You tend to give up easily when facing obstacles'
          ],
          recommendations: [
            'Start viewing challenges as opportunities to grow',
            'Practice embracing failure as a learning experience',
            'Focus on the process rather than just outcomes',
            'Celebrate effort and improvement, not just achievement'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Developing Mindset',
          description: 'You show elements of both fixed and growth mindsets depending on the situation.',
          insights: [
            'You're open to growth in some areas but may have fixed beliefs in others',
            'You sometimes embrace challenges but might avoid them when feeling uncertain',
            'You're developing resilience but may still be discouraged by significant setbacks'
          ],
          recommendations: [
            'Identify specific areas where you hold fixed beliefs',
            'Practice positive self-talk when facing challenges',
            'Seek feedback more regularly and view it as valuable information',
            'Set learning goals alongside performance goals'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Growth Mindset',
          description: 'You strongly believe in your ability to develop and grow through effort and learning.',
          insights: [
            'You embrace challenges as opportunities to develop',
            'You persist in the face of setbacks and see effort as a path to mastery',
            'You learn from criticism and find inspiration in others' success'
          ],
          recommendations: [
            'Continue nurturing your growth mindset in all areas of life',
            'Share your approach with others to help them develop',
            'Take on increasingly challenging goals to expand your potential',
            'Maintain your curiosity and love of learning'
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
            <Brain className="h-6 w-6 text-primary" />
            Potential Quotient Calculator
          </CardTitle>
          <CardDescription>
            Discover your untapped potential and growth mindset indicators through this comprehensive assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Growth Mindset Indicators</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Measure your beliefs about growth, learning, and development
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Discover Your Potential Score</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a personalized score with detailed breakdown
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Receive Actionable Insights</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get personalized recommendations to unlock your potential
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your current mindset profile across 8 key dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Areas where you're already leveraging your potential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Specific opportunities for growth and development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to unlock your full potential</span>
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
      toolId="potential-quotient-calculator"
      title="Potential Quotient Calculator"
      description="Discover your untapped potential and growth mindset indicators"
      config={config}
      leadCaptureLevel={1}
      showSharing={true}
    />
  )
}