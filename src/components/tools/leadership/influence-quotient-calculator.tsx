"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Users, BarChart3 } from 'lucide-react'

export function InfluenceQuotientCalculator() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'influence-quotient-calculator',
    title: 'Influence Quotient Calculator',
    description: 'Measure your ability to influence others effectively',
    questions: [
      {
        id: 'communication-clarity',
        type: 'scale',
        text: 'How clearly can you articulate complex ideas in a way others can understand?',
        required: true,
        category: 'communication',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Struggle to Explain',
          max: 'Crystal Clear'
        }
      },
      {
        id: 'relationship-building',
        type: 'scale',
        text: 'How effectively do you build rapport and trust with different types of people?',
        required: true,
        category: 'relationships',
        weight: 1.6,
        min: 1,
        max: 10,
        labels: {
          min: 'Difficult for Me',
          max: 'Very Effective'
        }
      },
      {
        id: 'active-listening',
        type: 'scale',
        text: 'How well do you listen to understand others\' perspectives and concerns?',
        required: true,
        category: 'communication',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'I Often Interrupt',
          max: 'Deep Understanding'
        }
      },
      {
        id: 'emotional-intelligence',
        type: 'scale',
        text: 'How well can you read and respond to others\' emotions?',
        required: true,
        category: 'emotional-intelligence',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Often Miss Cues',
          max: 'Highly Attuned'
        }
      },
      {
        id: 'credibility-establishment',
        type: 'scale',
        text: 'How effectively do you establish credibility and expertise in your field?',
        required: true,
        category: 'credibility',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Struggle to Show Value',
          max: 'Highly Respected'
        }
      },
      {
        id: 'persuasion-techniques',
        type: 'multiple-choice',
        text: 'Which persuasion approach do you use most effectively?',
        required: true,
        category: 'persuasion',
        weight: 1.2,
        options: [
          {
            id: 'pt-1',
            text: 'Logical arguments and data',
            value: 'logical'
          },
          {
            id: 'pt-2',
            text: 'Stories and emotional appeals',
            value: 'emotional'
          },
          {
            id: 'pt-3',
            text: 'Social proof and testimonials',
            value: 'social_proof'
          },
          {
            id: 'pt-4',
            text: 'Reciprocity and mutual benefit',
            value: 'reciprocity'
          },
          {
            id: 'pt-5',
            text: 'Authority and expertise',
            value: 'authority'
          },
          {
            id: 'pt-6',
            text: 'Scarcity and urgency',
            value: 'scarcity'
          }
        ]
      },
      {
        id: 'influence-context',
        type: 'multiple-choice',
        text: 'In what context do you most often need to influence others?',
        required: true,
        category: 'context',
        weight: 1.1,
        options: [
          {
            id: 'ic-1',
            text: 'Workplace and professional settings',
            value: 'workplace'
          },
          {
            id: 'ic-2',
            text: 'Sales and business development',
            value: 'sales'
          },
          {
            id: 'ic-3',
            text: 'Leadership and team management',
            value: 'leadership'
          },
          {
            id: 'ic-4',
            text: 'Personal relationships and family',
            value: 'personal'
          },
          {
            id: 'ic-5',
            text: 'Public speaking and presentations',
            value: 'public_speaking'
          },
          {
            id: 'ic-6',
            text: 'Negotiations and conflict resolution',
            value: 'negotiation'
          }
        ]
      },
      {
        id: 'resistance-handling',
        type: 'scale',
        text: 'How effectively do you handle resistance and objections?',
        required: true,
        category: 'resistance',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Often Get Stuck',
          max: 'Skilled at Overcoming'
        }
      },
      {
        id: 'influence-style',
        type: 'multiple-choice',
        text: 'What best describes your natural influence style?',
        required: true,
        category: 'style',
        weight: 1.3,
        options: [
          {
            id: 'is-1',
            text: 'Direct and assertive',
            value: 'direct'
          },
          {
            id: 'is-2',
            text: 'Collaborative and inclusive',
            value: 'collaborative'
          },
          {
            id: 'is-3',
            text: 'Analytical and data-driven',
            value: 'analytical'
          },
          {
            id: 'is-4',
            text: 'Inspirational and visionary',
            value: 'inspirational'
          },
          {
            id: 'is-5',
            text: 'Supportive and encouraging',
            value: 'supportive'
          },
          {
            id: 'is-6',
            text: 'Adaptive - I adjust to the situation',
            value: 'adaptive'
          }
        ]
      },
      {
        id: 'network-building',
        type: 'scale',
        text: 'How effectively do you build and maintain professional networks?',
        required: true,
        category: 'networking',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Find It Challenging',
          max: 'Natural Networker'
        }
      },
      {
        id: 'follow-through',
        type: 'scale',
        text: 'How consistently do you follow through on commitments and promises?',
        required: true,
        category: 'reliability',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Sometimes Fall Short',
          max: 'Always Deliver'
        }
      },
      {
        id: 'influence-challenge',
        type: 'text',
        text: 'What is your biggest challenge when trying to influence others?',
        description: 'Describe a specific situation where you struggled to influence someone',
        required: true,
        category: 'challenges',
        weight: 1.4,
        placeholder: 'Describe your influence challenge...'
      },
      {
        id: 'success-story',
        type: 'text',
        text: 'Describe a time when you successfully influenced someone or a group:',
        description: 'What made this influence attempt successful?',
        required: true,
        category: 'success',
        weight: 1.5,
        placeholder: 'Describe your influence success story...'
      },
      {
        id: 'influence-goal',
        type: 'multiple-choice',
        text: 'What aspect of influence would you most like to improve?',
        required: true,
        category: 'improvement',
        weight: 1.2,
        options: [
          {
            id: 'ig-1',
            text: 'Communication and presentation skills',
            value: 'communication'
          },
          {
            id: 'ig-2',
            text: 'Building relationships and trust',
            value: 'relationships'
          },
          {
            id: 'ig-3',
            text: 'Handling resistance and objections',
            value: 'resistance'
          },
          {
            id: 'ig-4',
            text: 'Establishing credibility and authority',
            value: 'credibility'
          },
          {
            id: 'ig-5',
            text: 'Understanding others\' motivations',
            value: 'motivations'
          },
          {
            id: 'ig-6',
            text: 'Using different influence techniques',
            value: 'techniques'
          }
        ]
      },
      {
        id: 'influence-impact',
        type: 'scale',
        text: 'How much impact do you believe you currently have on others\' decisions and actions?',
        required: true,
        category: 'impact',
        weight: 1.1,
        min: 1,
        max: 10,
        labels: {
          min: 'Minimal Impact',
          max: 'Significant Impact'
        }
      }
    ],
    scoringConfig: {
      type: 'simple',
      resultTiers: [
        {
          min: 0,
          max: 100,
          label: 'Influence Developer',
          description: 'You are developing your influence capabilities.',
          insights: [
            'Your influence style has both strengths and areas for development',
            'Enhancing specific influence skills can significantly increase your impact',
            'Practicing influence techniques consistently will build your capabilities'
          ],
          recommendations: [
            'Focus on developing your communication clarity and emotional intelligence',
            'Practice active listening to better understand others\' perspectives',
            'Build your credibility through consistent follow-through',
            'Study influence principles from authors like Robert Cialdini'
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
            <Target className="h-6 w-6 text-primary" />
            Influence Quotient Calculator
          </CardTitle>
          <CardDescription>
            Measure your ability to influence others effectively and identify key areas for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Measure Your Influence</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover your current influence capabilities across key dimensions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Your Style</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn which influence approaches come most naturally to you
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Enhance Your Impact</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get personalized strategies to increase your influence effectiveness
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your overall influence quotient score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your strengths across 6 key influence dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your primary and secondary influence styles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to enhance your influence capabilities</span>
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
      toolId="influence-quotient-calculator"
      title="Influence Quotient Calculator"
      description="Measure your ability to influence others effectively"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}