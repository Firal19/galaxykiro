"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Target, LineChart } from 'lucide-react'

export function GoalAchievementPredictor() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'goal-achievement-predictor',
    title: 'Goal Achievement Predictor',
    description: 'Calculate your likelihood of achieving specific goals',
    questions: [
      {
        id: 'goal-description',
        type: 'text',
        text: 'Describe the specific goal you want to analyze:',
        description: 'Be as specific as possible about what you want to achieve',
        required: true,
        category: 'goal-details',
        weight: 1.0,
        placeholder: 'Example: Lose 20 pounds in 6 months, Launch my business by Q3, etc.'
      },
      {
        id: 'goal-timeline',
        type: 'multiple-choice',
        text: 'What is the timeframe for achieving this goal?',
        required: true,
        category: 'goal-details',
        weight: 1.0,
        options: [
          {
            id: 'gt-1',
            text: 'Less than 1 month',
            value: 'short-term'
          },
          {
            id: 'gt-2',
            text: '1-3 months',
            value: 'medium-term'
          },
          {
            id: 'gt-3',
            text: '4-12 months',
            value: 'long-term'
          },
          {
            id: 'gt-4',
            text: 'More than 1 year',
            value: 'very-long-term'
          }
        ]
      },
      {
        id: 'specificity-1',
        type: 'scale',
        text: 'How specific and measurable is your goal?',
        description: 'A specific goal has clear criteria for success',
        required: true,
        category: 'specificity',
        weight: 1.6,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Vague',
          max: 'Extremely Specific'
        }
      },
      {
        id: 'specificity-2',
        type: 'multiple-choice',
        text: 'Which best describes your goal?',
        required: true,
        category: 'specificity',
        weight: 1.4,
        options: [
          {
            id: 's2-1',
            text: 'General aspiration without specific metrics (e.g., "get in better shape")',
            value: 1,
            score: 1
          },
          {
            id: 's2-2',
            text: 'Somewhat specific but missing key details (e.g., "lose weight by summer")',
            value: 2,
            score: 3
          },
          {
            id: 's2-3',
            text: 'Mostly specific with some measurable elements (e.g., "lose 20 pounds")',
            value: 3,
            score: 7
          },
          {
            id: 's2-4',
            text: 'Completely specific and measurable (e.g., "lose 20 pounds by June 30th by exercising 3x weekly and following meal plan")',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'motivation-1',
        type: 'scale',
        text: 'How motivated are you to achieve this goal?',
        required: true,
        category: 'motivation',
        weight: 1.7,
        min: 1,
        max: 10,
        labels: {
          min: 'Minimal Motivation',
          max: 'Extremely Motivated'
        }
      },
      {
        id: 'motivation-2',
        type: 'multiple-choice',
        text: 'What is your primary motivation for this goal?',
        required: true,
        category: 'motivation',
        weight: 1.5,
        options: [
          {
            id: 'm2-1',
            text: 'External pressure (others want me to do this)',
            value: 1,
            score: 1
          },
          {
            id: 'm2-2',
            text: 'Avoiding negative consequences',
            value: 2,
            score: 3
          },
          {
            id: 'm2-3',
            text: 'Gaining rewards or recognition',
            value: 3,
            score: 7
          },
          {
            id: 'm2-4',
            text: 'Deep personal fulfillment or alignment with core values',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'planning-1',
        type: 'scale',
        text: 'How detailed is your plan for achieving this goal?',
        required: true,
        category: 'planning',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'No Plan',
          max: 'Detailed Plan'
        }
      },
      {
        id: 'planning-2',
        type: 'multiple-choice',
        text: 'Which best describes your planning approach for this goal?',
        required: true,
        category: 'planning',
        weight: 1.3,
        options: [
          {
            id: 'p2-1',
            text: 'I have no specific plan yet',
            value: 1,
            score: 1
          },
          {
            id: 'p2-2',
            text: 'I have a general idea of what I need to do',
            value: 2,
            score: 3
          },
          {
            id: 'p2-3',
            text: 'I have identified specific steps and milestones',
            value: 3,
            score: 7
          },
          {
            id: 'p2-4',
            text: 'I have a detailed plan with timeline, resources, and contingencies',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'environment-1',
        type: 'scale',
        text: 'How supportive is your environment (people, places, systems) for achieving this goal?',
        required: true,
        category: 'environment',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Unsupportive',
          max: 'Extremely Supportive'
        }
      },
      {
        id: 'environment-2',
        type: 'multiple-choice',
        text: 'How would the people closest to you respond to your pursuit of this goal?',
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
            text: 'They would actively encourage and help me succeed',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'skills-1',
        type: 'scale',
        text: 'How would you rate your current skills/abilities needed for this goal?',
        required: true,
        category: 'skills',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Lacking Required Skills',
          max: 'Have All Required Skills'
        }
      },
      {
        id: 'skills-2',
        type: 'multiple-choice',
        text: 'Which best describes your skill level for this goal?',
        required: true,
        category: 'skills',
        weight: 1.2,
        options: [
          {
            id: 'sk2-1',
            text: 'I need to develop most of the required skills from scratch',
            value: 1,
            score: 1
          },
          {
            id: 'sk2-2',
            text: 'I have some foundational skills but need significant development',
            value: 2,
            score: 3
          },
          {
            id: 'sk2-3',
            text: 'I have most of the necessary skills with some gaps to fill',
            value: 3,
            score: 7
          },
          {
            id: 'sk2-4',
            text: 'I already possess all or nearly all the skills needed',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'resources-1',
        type: 'scale',
        text: 'How would you rate your access to resources (time, money, tools) needed for this goal?',
        required: true,
        category: 'resources',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Severely Limited',
          max: 'Abundant Resources'
        }
      },
      {
        id: 'resources-2',
        type: 'multiple-choice',
        text: 'Which best describes your resource situation for this goal?',
        required: true,
        category: 'resources',
        weight: 1.2,
        options: [
          {
            id: 'r2-1',
            text: 'I lack most of the necessary resources and don\'t know how to get them',
            value: 1,
            score: 1
          },
          {
            id: 'r2-2',
            text: 'I have limited resources and will need to be creative',
            value: 2,
            score: 3
          },
          {
            id: 'r2-3',
            text: 'I have most resources needed with some gaps to fill',
            value: 3,
            score: 7
          },
          {
            id: 'r2-4',
            text: 'I have all the resources I need to achieve this goal',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'history-1',
        type: 'scale',
        text: 'How successful have you been with similar goals in the past?',
        required: true,
        category: 'history',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Never Successful',
          max: 'Always Successful'
        }
      },
      {
        id: 'history-2',
        type: 'multiple-choice',
        text: 'Which best describes your history with similar goals?',
        required: true,
        category: 'history',
        weight: 1.3,
        options: [
          {
            id: 'h2-1',
            text: 'I\'ve consistently failed to achieve similar goals',
            value: 1,
            score: 1
          },
          {
            id: 'h2-2',
            text: 'I've had mixed results, with more failures than successes',
            value: 2,
            score: 3
          },
          {
            id: 'h2-3',
            text: 'I've had mixed results, with more successes than failures',
            value: 3,
            score: 7
          },
          {
            id: 'h2-4',
            text: 'I've consistently succeeded with similar goals',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'obstacles-1',
        type: 'text',
        text: 'What are the biggest obstacles you anticipate in achieving this goal?',
        required: false,
        category: 'obstacles',
        weight: 1.0,
        placeholder: 'List your anticipated obstacles...'
      },
      {
        id: 'strategies-1',
        type: 'text',
        text: 'What strategies do you plan to use to overcome these obstacles?',
        required: false,
        category: 'strategies',
        weight: 1.0,
        placeholder: 'Describe your strategies...'
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'specificity',
          name: 'Goal Specificity',
          weight: 1.6,
          questions: ['specificity-1', 'specificity-2']
        },
        {
          id: 'motivation',
          name: 'Motivation Level',
          weight: 1.7,
          questions: ['motivation-1', 'motivation-2']
        },
        {
          id: 'planning',
          name: 'Planning Quality',
          weight: 1.5,
          questions: ['planning-1', 'planning-2']
        },
        {
          id: 'environment',
          name: 'Environmental Support',
          weight: 1.4,
          questions: ['environment-1', 'environment-2']
        },
        {
          id: 'skills',
          name: 'Skill Readiness',
          weight: 1.3,
          questions: ['skills-1', 'skills-2']
        },
        {
          id: 'resources',
          name: 'Resource Availability',
          weight: 1.3,
          questions: ['resources-1', 'resources-2']
        },
        {
          id: 'history',
          name: 'Past Performance',
          weight: 1.4,
          questions: ['history-1', 'history-2']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Low Probability',
          description: 'Your current success probability is below 40%',
          insights: [
            'Several critical success factors need significant improvement',
            'Without changes, you may struggle to achieve this goal',
            'Focus on addressing your lowest-scoring areas first'
          ],
          recommendations: [
            'Redefine your goal to be more specific and measurable',
            'Break down your goal into smaller, more achievable milestones',
            'Develop a detailed implementation plan with specific action steps',
            'Identify resources and support systems you'll need',
            'Consider adjusting your timeline to be more realistic'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Moderate Probability',
          description: 'Your current success probability is between 40-70%',
          insights: [
            'You have a reasonable foundation for success',
            'Some key areas need strengthening to increase your probability',
            'With targeted improvements, you can significantly boost your chances'
          ],
          recommendations: [
            'Focus on improving your 2-3 lowest-scoring areas',
            'Enhance your plan with more specific milestones and deadlines',
            'Build additional accountability systems',
            'Identify and prepare for potential obstacles in advance',
            'Consider finding a mentor or coach who has achieved similar goals'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'High Probability',
          description: 'Your current success probability is above 70%',
          insights: [
            'You have a strong foundation for achieving this goal',
            'Your preparation, motivation, and environment support success',
            'Maintain your current approach while watching for complacency'
          ],
          recommendations: [
            'Implement your plan with confidence',
            'Set up regular progress reviews to stay on track',
            'Prepare contingency plans for any remaining weak areas',
            'Consider raising your target or accelerating your timeline',
            'Document your approach to replicate success with future goals'
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
            <BarChart3 className="h-6 w-6 text-primary" />
            Goal Achievement Predictor
          </CardTitle>
          <CardDescription>
            Calculate your likelihood of achieving specific goals and identify key success factors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Calculate Success Probability</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a data-driven prediction of your goal achievement likelihood
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Success Factors</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover what will make or break your goal achievement
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <LineChart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Get a Success Roadmap</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Receive personalized strategies to increase your success odds
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your overall goal achievement probability score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Analysis of 7 critical success factors for your specific goal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your strongest assets and biggest risk factors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to significantly increase your success probability</span>
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
      toolId="goal-achievement-predictor"
      title="Goal Achievement Predictor"
      description="Calculate your likelihood of achieving specific goals"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}