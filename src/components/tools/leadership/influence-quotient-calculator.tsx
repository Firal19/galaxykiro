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
      // Questions would go here - simplified for brevity
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
      }
      // Additional questions would be added here
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