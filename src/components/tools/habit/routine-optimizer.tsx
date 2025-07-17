"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Repeat, Clock, BarChart3 } from 'lucide-react'

export function RoutineOptimizer() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'routine-optimizer',
    title: 'Routine Optimizer',
    description: 'Design optimal daily routines based on your goals and energy patterns',
    questions: [
      // Questions would go here - simplified for brevity
      {
        id: 'energy-pattern',
        type: 'multiple-choice',
        text: 'Which best describes your natural energy pattern throughout the day?',
        required: true,
        category: 'energy',
        weight: 1.5,
        options: [
          {
            id: 'ep-1',
            text: 'Morning person (highest energy early in the day)',
            value: 'morning'
          },
          {
            id: 'ep-2',
            text: 'Afternoon person (highest energy midday)',
            value: 'afternoon'
          },
          {
            id: 'ep-3',
            text: 'Evening person (highest energy later in the day)',
            value: 'evening'
          },
          {
            id: 'ep-4',
            text: 'Variable (energy fluctuates unpredictably)',
            value: 'variable'
          }
        ]
      },
      {
        id: 'priority-goals',
        type: 'text',
        text: 'What are your top 2-3 goals or priorities right now?',
        required: true,
        category: 'goals',
        weight: 1.6,
        placeholder: 'List your top goals or priorities...'
      }
      // Additional questions would be added here
    ],
    scoringConfig: {
      type: 'simple',
      resultTiers: [
        {
          min: 0,
          max: 100,
          label: 'Routine Builder',
          description: 'You are ready to optimize your daily routines for maximum effectiveness.',
          insights: [
            'Your energy patterns provide valuable insights for routine design',
            'Aligning routines with your goals will accelerate your progress',
            'Small, consistent habits can create significant results over time'
          ],
          recommendations: [
            'Schedule your most important work during your peak energy periods',
            'Create morning and evening routines that support your top goals',
            'Build transition rituals between different parts of your day',
            'Review and adjust your routines weekly based on results'
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
            <Repeat className="h-6 w-6 text-primary" />
            Routine Optimizer
          </CardTitle>
          <CardDescription>
            Design optimal daily routines based on your goals and energy patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Map Your Energy Patterns</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover your optimal times for different types of work
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Align With Your Goals</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Create routines that accelerate progress on what matters most
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Repeat className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Design Ideal Routines</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get personalized morning, workday, and evening routines
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Receive:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your personalized energy pattern profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Customized morning and evening routine templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Workday optimization recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Strategies to maintain consistency with your routines</span>
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
      toolId="routine-optimizer"
      title="Routine Optimizer"
      description="Design optimal daily routines based on your goals and energy patterns"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}