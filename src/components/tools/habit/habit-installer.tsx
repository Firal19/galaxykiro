"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, LineChart, Calendar, CheckCircle } from 'lucide-react'

export function HabitInstaller() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'habit-installer',
    title: '21-Day Habit Installer',
    description: 'Create a personalized plan to install any new habit in 21 days',
    questions: [
      // Questions would go here - simplified for brevity
      {
        id: 'habit-goal',
        type: 'text',
        text: 'What specific habit do you want to install in the next 21 days?',
        description: 'Be as specific as possible about what you want to achieve',
        required: true,
        category: 'habit-details',
        weight: 1.0,
        placeholder: 'Example: Meditate for 10 minutes every morning'
      },
      {
        id: 'current-status',
        type: 'multiple-choice',
        text: 'What is your current status with this habit?',
        required: true,
        category: 'habit-details',
        weight: 1.0,
        options: [
          {
            id: 'cs-1',
            text: 'I\'ve never done this before',
            value: 'never'
          },
          {
            id: 'cs-2',
            text: 'I\'ve tried it a few times inconsistently',
            value: 'tried'
          },
          {
            id: 'cs-3',
            text: 'I do it occasionally but not regularly',
            value: 'occasional'
          },
          {
            id: 'cs-4',
            text: 'I used to do it regularly but stopped',
            value: 'lapsed'
          }
        ]
      }
      // Additional questions would be added here
    ],
    scoringConfig: {
      type: 'simple',
      resultTiers: [
        {
          min: 0,
          max: 100,
          label: 'Habit Builder',
          description: 'You are ready to install your new habit with a structured 21-day plan.',
          insights: [
            'The 21-day period is ideal for establishing initial habit patterns',
            'Your specific implementation intentions will significantly increase success',
            'Tracking and accountability will help maintain consistency'
          ],
          recommendations: [
            'Follow your personalized 21-day habit installation plan',
            'Use the provided tracking system to monitor your progress',
            'Implement the suggested cue-routine-reward structure',
            'Review your progress weekly and adjust as needed'
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
            <LineChart className="h-6 w-6 text-primary" />
            21-Day Habit Installer
          </CardTitle>
          <CardDescription>
            Create a personalized plan to install any new habit in 21 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">21-Day Roadmap</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a day-by-day plan to establish your new habit
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Implementation Formula</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn the science-backed formula for habit formation
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <LineChart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get tools to track your consistency and momentum
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Receive:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your personalized 21-day habit installation plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Custom cue-routine-reward structure for your specific habit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Strategies to overcome your specific obstacles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Daily tracking system and accountability tools</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
              Start Creating Your Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Takes approximately 7-10 minutes to complete • Your plan is saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="habit-installer"
      title="21-Day Habit Installer"
      description="Create a personalized plan to install any new habit in 21 days"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}