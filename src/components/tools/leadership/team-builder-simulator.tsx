"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, UserPlus, Users, PuzzleIcon } from 'lucide-react'

export function TeamBuilderSimulator() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'team-builder-simulator',
    title: 'Team Builder Simulator',
    description: 'Create optimal team structures based on complementary strengths',
    questions: [
      // Questions would go here - simplified for brevity
      {
        id: 'team-purpose',
        type: 'text',
        text: 'What is the primary purpose or mission of your team?',
        required: true,
        category: 'purpose',
        weight: 1.5,
        placeholder: 'Describe your team's main purpose or mission...'
      },
      {
        id: 'team-size',
        type: 'multiple-choice',
        text: 'What is the current or planned size of your team?',
        required: true,
        category: 'structure',
        weight: 1.0,
        options: [
          {
            id: 'ts-1',
            text: 'Small (2-5 people)',
            value: 'small'
          },
          {
            id: 'ts-2',
            text: 'Medium (6-15 people)',
            value: 'medium'
          },
          {
            id: 'ts-3',
            text: 'Large (16-30 people)',
            value: 'large'
          },
          {
            id: 'ts-4',
            text: 'Very large (31+ people)',
            value: 'very-large'
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
          label: 'Team Architect',
          description: 'You are ready to build an effective team structure.',
          insights: [
            'Your team purpose provides clear direction for structure design',
            'Complementary strengths will enhance team performance',
            'Clear roles and communication systems are essential'
          ],
          recommendations: [
            'Implement the suggested team structure based on your inputs',
            'Use the provided role clarity framework for each position',
            'Establish the recommended communication and decision-making processes',
            'Review team effectiveness quarterly using the provided assessment'
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
            <UserPlus className="h-6 w-6 text-primary" />
            Team Builder Simulator
          </CardTitle>
          <CardDescription>
            Create optimal team structures based on complementary strengths.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Design Team Structure</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Create an optimal team composition for your specific goals
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <PuzzleIcon className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Map Complementary Strengths</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Identify the right mix of skills and personalities
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <UserPlus className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Optimize Team Dynamics</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get strategies for communication and decision-making
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Receive:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your customized team structure blueprint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Role clarity frameworks for each position</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Communication and decision-making process recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Team effectiveness assessment tools</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
              Start Building Your Team
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Takes approximately 10-15 minutes to complete • Your plan is saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="team-builder-simulator"
      title="Team Builder Simulator"
      description="Create optimal team structures based on complementary strengths"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}