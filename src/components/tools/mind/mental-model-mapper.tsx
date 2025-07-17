"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Lightbulb, Brain, Network } from 'lucide-react'

export function MentalModelMapper() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'mental-model-mapper',
    title: 'Mental Model Mapper',
    description: 'Discover which mental models shape your thinking and decision-making',
    questions: [
      // Questions would go here - simplified for brevity
      {
        id: 'decision-scenario',
        type: 'text',
        text: 'Describe a significant decision you need to make or recently made:',
        required: true,
        category: 'scenario',
        weight: 1.0,
        placeholder: 'Describe your decision scenario in detail...'
      },
      {
        id: 'thinking-process',
        type: 'text',
        text: 'How are you approaching this decision? What factors are you considering?',
        required: true,
        category: 'process',
        weight: 1.5,
        placeholder: 'Describe your thinking process...'
      }
      // Additional questions would be added here
    ],
    scoringConfig: {
      type: 'simple',
      resultTiers: [
        {
          min: 0,
          max: 100,
          label: 'Mental Model Explorer',
          description: 'You are beginning to explore mental models in your thinking.',
          insights: [
            'You use some mental models in your decision-making',
            'Expanding your mental model toolkit can enhance your thinking',
            'Regular practice with diverse models will improve your decisions'
          ],
          recommendations: [
            'Learn about the most useful mental models for your specific context',
            'Practice applying different models to the same problem',
            'Create a mental model journal to track which models you use',
            'Study how mental models can complement each other'
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
            <Lightbulb className="h-6 w-6 text-primary" />
            Mental Model Mapper
          </CardTitle>
          <CardDescription>
            Discover which mental models shape your thinking and decision-making.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Map Your Mental Models</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Identify the thinking frameworks you use most often
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Network className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Expand Your Toolkit</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover powerful new models to enhance your thinking
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Improve Decision-Making</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn to apply the right models to different situations
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your dominant mental models and thinking patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Blind spots and biases in your current thinking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>New mental models that complement your thinking style</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to apply mental models effectively</span>
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
            Takes approximately 10-15 minutes to complete • Your results are saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="mental-model-mapper"
      title="Mental Model Mapper"
      description="Discover which mental models shape your thinking and decision-making"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}