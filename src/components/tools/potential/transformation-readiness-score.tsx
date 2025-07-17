"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gauge, BarChart3, Sparkles } from 'lucide-react'

export function TransformationReadinessScore() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'transformation-readiness-score',
    title: 'Transformation Readiness Score',
    description: 'Assess your readiness for meaningful personal change',
    questions: [
      {
        id: 'awareness-1',
        type: 'scale',
        text: 'I have a clear understanding of what specific areas of my life need transformation.',
        required: true,
        category: 'awareness',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'awareness-2',
        type: 'multiple-choice',
        text: 'How would you describe your level of self-awareness regarding your strengths and weaknesses?',
        required: true,
        category: 'awareness',
        weight: 1.3,
        options: [
          {
            id: 'a2-1',
            text: 'I rarely reflect on my strengths and weaknesses',
            value: 1,
            score: 1
          },
          {
            id: 'a2-2',
            text: 'I have a general idea but haven't deeply examined them',
            value: 2,
            score: 3
          },
          {
            id: 'a2-3',
            text: 'I've identified most of my key strengths and weaknesses',
            value: 3,
            score: 7
          },
          {
            id: 'a2-4',
            text: 'I have deep insight into my strengths and weaknesses and regularly reflect on them',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'motivation-1',
        type: 'scale',
        text: 'I feel a strong internal drive to make significant changes in my life right now.',
        required: true,
        category: 'motivation',
        weight: 1.6,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'motivation-2',
        type: 'multiple-choice',
        text: 'What best describes your motivation for change at this moment?',
        required: true,
        category: 'motivation',
        weight: 1.4,
        options: [
          {
            id: 'm2-1',
            text: 'Others are pressuring me to change',
            value: 1,
            score: 1
          },
          {
            id: 'm2-2',
            text: 'I know I should change but don't feel strongly about it',
            value: 2,
            score: 3
          },
          {
            id: 'm2-3',
            text: 'I want to change and have some motivation',
            value: 3,
            score: 7
          },
          {
            id: 'm2-4',
            text: 'I have a burning desire to transform this area of my life',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'commitment-1',
        type: 'scale',
        text: 'I am willing to make significant sacrifices of time, comfort, and resources to achieve transformation.',
        required: true,
        category: 'commitment',
        weight: 1.7,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'commitment-2',
        type: 'multiple-choice',
        text: 'How much time are you realistically willing to dedicate to your transformation process each week?',
        required: true,
        category: 'commitment',
        weight: 1.5,
        options: [
          {
            id: 'c2-1',
            text: 'Less than 1 hour per week',
            value: 1,
            score: 1
          },
          {
            id: 'c2-2',
            text: '1-3 hours per week',
            value: 2,
            score: 4
          },
          {
            id: 'c2-3',
            text: '4-7 hours per week',
            value: 3,
            score: 7
          },
          {
            id: 'c2-4',
            text: '8+ hours per week',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'environment-1',
        type: 'scale',
        text: 'My current environment (people, places, routines) supports the changes I want to make.',
        required: true,
        category: 'environment',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'environment-2',
        type: 'multiple-choice',
        text: 'How would the people closest to you respond to your transformation efforts?',
        required: true,
        category: 'environment',
        weight: 1.2,
        options: [
          {
            id: 'e2-1',
            text: 'They would actively discourage or undermine my efforts',
            value: 1,
            score: 1
          },
          {
            id: 'e2-2',
            text: 'They would be indifferent or slightly skeptical',
            value: 2,
            score: 3
          },
          {
            id: 'e2-3',
            text: 'They would be generally supportive',
            value: 3,
            score: 7
          },
          {
            id: 'e2-4',
            text: 'They would actively encourage and support my efforts',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'resources-1',
        type: 'scale',
        text: 'I have access to the resources (knowledge, tools, finances) needed to support my transformation.',
        required: true,
        category: 'resources',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'resources-2',
        type: 'multiple-choice',
        text: 'Which best describes your approach to investing in your personal development?',
        required: true,
        category: 'resources',
        weight: 1.1,
        options: [
          {
            id: 'r2-1',
            text: 'I rarely or never invest money in my personal development',
            value: 1,
            score: 1
          },
          {
            id: 'r2-2',
            text: 'I occasionally buy books or use free resources',
            value: 2,
            score: 4
          },
          {
            id: 'r2-3',
            text: 'I regularly invest in courses, books, and tools',
            value: 3,
            score: 7
          },
          {
            id: 'r2-4',
            text: 'I consistently invest significant resources in my growth (coaching, programs, etc.)',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'history-1',
        type: 'scale',
        text: 'I have successfully made and maintained significant positive changes in my life before.',
        required: true,
        category: 'history',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'history-2',
        type: 'multiple-choice',
        text: 'When you've attempted significant changes in the past, what typically happened?',
        required: true,
        category: 'history',
        weight: 1.3,
        options: [
          {
            id: 'h2-1',
            text: 'I usually gave up within the first few weeks',
            value: 1,
            score: 1
          },
          {
            id: 'h2-2',
            text: 'I maintained changes for a while but eventually reverted to old patterns',
            value: 2,
            score: 3
          },
          {
            id: 'h2-3',
            text: 'I've successfully made some lasting changes but struggled with others',
            value: 3,
            score: 7
          },
          {
            id: 'h2-4',
            text: 'I have a strong track record of making and maintaining positive changes',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'resilience-1',
        type: 'scale',
        text: 'When I face setbacks or obstacles, I quickly recover and get back on track.',
        required: true,
        category: 'resilience',
        weight: 1.5,
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
        text: 'How do you typically respond when you encounter significant obstacles to your goals?',
        required: true,
        category: 'resilience',
        weight: 1.4,
        options: [
          {
            id: 'rs2-1',
            text: 'I usually give up and move on to something else',
            value: 1,
            score: 1
          },
          {
            id: 'rs2-2',
            text: 'I get discouraged but sometimes push through',
            value: 2,
            score: 3
          },
          {
            id: 'rs2-3',
            text: 'I usually find ways to overcome obstacles after some struggle',
            value: 3,
            score: 7
          },
          {
            id: 'rs2-4',
            text: 'I consistently view obstacles as challenges to overcome and learn from',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'timing-1',
        type: 'scale',
        text: 'My current life circumstances make this an ideal time for significant personal transformation.',
        required: true,
        category: 'timing',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'timing-2',
        type: 'multiple-choice',
        text: 'Which best describes your current life situation in terms of stability and capacity for change?',
        required: true,
        category: 'timing',
        weight: 1.2,
        options: [
          {
            id: 't2-1',
            text: 'I'm in crisis or dealing with major life disruptions',
            value: 1,
            score: 1
          },
          {
            id: 't2-2',
            text: 'I'm stable but extremely busy with little margin',
            value: 2,
            score: 3
          },
          {
            id: 't2-3',
            text: 'I have reasonable stability and some capacity for new initiatives',
            value: 3,
            score: 7
          },
          {
            id: 't2-4',
            text: 'I have strong stability and significant capacity for focused transformation',
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
          id: 'awareness',
          name: 'Self-Awareness',
          weight: 1.5,
          questions: ['awareness-1', 'awareness-2']
        },
        {
          id: 'motivation',
          name: 'Motivation',
          weight: 1.6,
          questions: ['motivation-1', 'motivation-2']
        },
        {
          id: 'commitment',
          name: 'Commitment',
          weight: 1.7,
          questions: ['commitment-1', 'commitment-2']
        },
        {
          id: 'environment',
          name: 'Supportive Environment',
          weight: 1.3,
          questions: ['environment-1', 'environment-2']
        },
        {
          id: 'resources',
          name: 'Available Resources',
          weight: 1.2,
          questions: ['resources-1', 'resources-2']
        },
        {
          id: 'history',
          name: 'Success History',
          weight: 1.4,
          questions: ['history-1', 'history-2']
        },
        {
          id: 'resilience',
          name: 'Resilience',
          weight: 1.5,
          questions: ['resilience-1', 'resilience-2']
        },
        {
          id: 'timing',
          name: 'Timing & Circumstances',
          weight: 1.3,
          questions: ['timing-1', 'timing-2']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Preparation Needed',
          description: 'You need to build a stronger foundation before attempting major transformation.',
          insights: [
            'Your current readiness level suggests significant barriers to successful transformation',
            'Attempting major changes now might lead to frustration and setbacks',
            'Building foundational elements will greatly increase your chances of success'
          ],
          recommendations: [
            'Focus on building self-awareness through reflection and assessment',
            'Start with small, achievable changes to build confidence and momentum',
            'Identify and address key environmental factors that may undermine your efforts',
            'Develop support systems and gather necessary resources before attempting major changes'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Cautiously Ready',
          description: 'You have a moderate foundation for change with some areas needing strengthening.',
          insights: [
            'You have several important elements in place for successful transformation',
            'Some key areas still need development to ensure lasting change',
            'With targeted preparation, you can significantly increase your readiness'
          ],
          recommendations: [
            'Strengthen your lowest-scoring readiness factors before beginning',
            'Create detailed implementation plans that account for potential obstacles',
            'Build additional support systems to help maintain momentum',
            'Consider starting with moderate changes while building capacity for larger transformation'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Transformation Ready',
          description: 'You have a strong foundation for successful personal transformation.',
          insights: [
            'Your readiness profile indicates high potential for successful transformation',
            'You have the key elements in place for meaningful and lasting change',
            'Your past experiences and current circumstances support your transformation goals'
          ],
          recommendations: [
            'Leverage your strong readiness by setting ambitious but achievable transformation goals',
            'Create detailed action plans with specific milestones and accountability measures',
            'Maintain awareness of your few lower-scoring areas and monitor them during your journey',
            'Consider working with a coach or mentor to maximize your transformation potential'
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
            <Gauge className="h-6 w-6 text-primary" />
            Transformation Readiness Score
          </CardTitle>
          <CardDescription>
            Assess your readiness for meaningful personal change and identify key factors for successful transformation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Gauge className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Measure Your Readiness</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Assess 8 critical factors that determine transformation success
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Strengths & Gaps</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover what's supporting or hindering your transformation
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Get a Success Roadmap</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Receive personalized strategies to increase your readiness
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your overall transformation readiness score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Detailed breakdown of 8 critical readiness factors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your strongest readiness factors to leverage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Specific strategies to strengthen your readiness gaps</span>
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
            Takes approximately 7-10 minutes to complete • Your results are saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="transformation-readiness-score"
      title="Transformation Readiness Score"
      description="Assess your readiness for meaningful personal change"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}