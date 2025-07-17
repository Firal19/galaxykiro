"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Compass, Target, Sparkles } from 'lucide-react'

export function DreamClarityGenerator() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'dream-clarity-generator',
    title: 'Dream Clarity Generator',
    description: 'Clarify your vision and create a compelling future',
    questions: [
      {
        id: 'values-1',
        type: 'ranking',
        text: 'Rank these values in order of importance to you:',
        description: 'Drag and drop to reorder based on what matters most to you',
        required: true,
        category: 'values',
        weight: 1.5,
        items: [
          {
            id: 'v1',
            text: 'Freedom and independence',
            value: 'freedom'
          },
          {
            id: 'v2',
            text: 'Security and stability',
            value: 'security'
          },
          {
            id: 'v3',
            text: 'Growth and learning',
            value: 'growth'
          },
          {
            id: 'v4',
            text: 'Connection and relationships',
            value: 'connection'
          },
          {
            id: 'v5',
            text: 'Achievement and recognition',
            value: 'achievement'
          },
          {
            id: 'v6',
            text: 'Contribution and service',
            value: 'contribution'
          },
          {
            id: 'v7',
            text: 'Health and wellbeing',
            value: 'health'
          }
        ]
      },
      {
        id: 'values-2',
        type: 'text',
        text: 'What are 2-3 additional values that are extremely important to you that weren\'t listed above?',
        placeholder: 'Enter your additional core values...',
        required: false,
        category: 'values',
        weight: 1.3
      },
      {
        id: 'life-areas-1',
        type: 'scale',
        text: 'Rate your current satisfaction with your career/work life:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-2',
        type: 'scale',
        text: 'Rate your current satisfaction with your relationships (family, friends, romantic):',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-3',
        type: 'scale',
        text: 'Rate your current satisfaction with your health and wellbeing:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-4',
        type: 'scale',
        text: 'Rate your current satisfaction with your personal growth and learning:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-5',
        type: 'scale',
        text: 'Rate your current satisfaction with your finances:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-6',
        type: 'scale',
        text: 'Rate your current satisfaction with your spiritual/inner life:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-7',
        type: 'scale',
        text: 'Rate your current satisfaction with your recreation and fun:',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'life-areas-8',
        type: 'scale',
        text: 'Rate your current satisfaction with your physical environment (home, workspace):',
        required: true,
        category: 'life-areas',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'priorities-1',
        type: 'multiple-choice',
        text: 'Which life area do you feel needs the MOST improvement right now?',
        required: true,
        category: 'priorities',
        weight: 1.4,
        options: [
          {
            id: 'p1-1',
            text: 'Career/Work',
            value: 'career'
          },
          {
            id: 'p1-2',
            text: 'Relationships',
            value: 'relationships'
          },
          {
            id: 'p1-3',
            text: 'Health & Wellbeing',
            value: 'health'
          },
          {
            id: 'p1-4',
            text: 'Personal Growth',
            value: 'growth'
          },
          {
            id: 'p1-5',
            text: 'Finances',
            value: 'finances'
          },
          {
            id: 'p1-6',
            text: 'Spiritual/Inner Life',
            value: 'spiritual'
          },
          {
            id: 'p1-7',
            text: 'Recreation & Fun',
            value: 'recreation'
          },
          {
            id: 'p1-8',
            text: 'Physical Environment',
            value: 'environment'
          }
        ]
      },
      {
        id: 'priorities-2',
        type: 'multiple-choice',
        text: 'Which life area would you like to focus on SECOND for improvement?',
        required: true,
        category: 'priorities',
        weight: 1.3,
        options: [
          {
            id: 'p2-1',
            text: 'Career/Work',
            value: 'career'
          },
          {
            id: 'p2-2',
            text: 'Relationships',
            value: 'relationships'
          },
          {
            id: 'p2-3',
            text: 'Health & Wellbeing',
            value: 'health'
          },
          {
            id: 'p2-4',
            text: 'Personal Growth',
            value: 'growth'
          },
          {
            id: 'p2-5',
            text: 'Finances',
            value: 'finances'
          },
          {
            id: 'p2-6',
            text: 'Spiritual/Inner Life',
            value: 'spiritual'
          },
          {
            id: 'p2-7',
            text: 'Recreation & Fun',
            value: 'recreation'
          },
          {
            id: 'p2-8',
            text: 'Physical Environment',
            value: 'environment'
          }
        ]
      },
      {
        id: 'vision-1',
        type: 'text',
        text: 'Imagine your ideal life 3 years from now. Describe what your average day would look like:',
        description: 'Be specific about where you are, what you\'re doing, who you\'re with, how you feel',
        required: true,
        category: 'vision',
        weight: 1.6,
        placeholder: 'Describe your ideal day 3 years from now...',
        maxLength: 1000
      },
      {
        id: 'vision-2',
        type: 'multiple-choice',
        text: 'When you think about your future vision, how clear is it to you right now?',
        required: true,
        category: 'vision',
        weight: 1.5,
        options: [
          {
            id: 'v2-1',
            text: 'Very fuzzy and unclear',
            value: 1,
            score: 1
          },
          {
            id: 'v2-2',
            text: 'Somewhat unclear with some general ideas',
            value: 2,
            score: 3
          },
          {
            id: 'v2-3',
            text: 'Moderately clear with some specific details',
            value: 3,
            score: 7
          },
          {
            id: 'v2-4',
            text: 'Very clear and detailed',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'vision-3',
        type: 'multiple-choice',
        text: 'How emotionally connected do you feel to your vision of the future?',
        required: true,
        category: 'vision',
        weight: 1.5,
        options: [
          {
            id: 'v3-1',
            text: 'Not emotionally connected at all',
            value: 1,
            score: 1
          },
          {
            id: 'v3-2',
            text: 'Slightly emotionally connected',
            value: 2,
            score: 3
          },
          {
            id: 'v3-3',
            text: 'Moderately emotionally connected',
            value: 3,
            score: 7
          },
          {
            id: 'v3-4',
            text: 'Deeply emotionally connected',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'obstacles-1',
        type: 'text',
        text: 'What are the biggest obstacles or challenges you anticipate in achieving your vision?',
        required: false,
        category: 'obstacles',
        weight: 1.3,
        placeholder: 'List your anticipated obstacles...'
      },
      {
        id: 'strengths-1',
        type: 'text',
        text: 'What personal strengths, skills, or resources do you have that will help you achieve your vision?',
        required: false,
        category: 'strengths',
        weight: 1.3,
        placeholder: 'List your key strengths and resources...'
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'values-alignment',
          name: 'Values Alignment',
          weight: 1.5,
          questions: ['values-1', 'values-2']
        },
        {
          id: 'life-balance',
          name: 'Life Balance',
          weight: 1.3,
          questions: ['life-areas-1', 'life-areas-2', 'life-areas-3', 'life-areas-4', 'life-areas-5', 'life-areas-6', 'life-areas-7', 'life-areas-8']
        },
        {
          id: 'vision-clarity',
          name: 'Vision Clarity',
          weight: 1.6,
          questions: ['vision-1', 'vision-2', 'vision-3']
        },
        {
          id: 'action-readiness',
          name: 'Action Readiness',
          weight: 1.4,
          questions: ['obstacles-1', 'strengths-1']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Vision Seeker',
          description: 'You\'re in the early stages of clarifying your vision and dreams.',
          insights: [
            'Your vision is still forming and needs more clarity',
            'You may be experiencing uncertainty about what you truly want',
            'There may be a disconnect between your values and current life direction'
          ],
          recommendations: [
            'Engage in regular reflection about what truly matters to you',
            'Explore different possibilities through reading, conversations, and experiences',
            'Create a vision board to help visualize potential futures',
            'Start a journal to capture emerging insights about your ideal future'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Vision Developer',
          description: 'You have a developing vision with some clarity but room for refinement.',
          insights: [
            'You have a general sense of direction but need more specific details',
            'Some areas of your vision are clearer than others',
            'You're beginning to align your values with your future vision'
          ],
          recommendations: [
            'Focus on adding specific details to your vision in key life areas',
            'Create a more structured vision statement with measurable elements',
            'Identify potential obstacles and develop strategies to overcome them',
            'Share your vision with trusted others to gain feedback and clarity'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Vision Master',
          description: 'You have a clear, compelling vision that aligns with your core values.',
          insights: [
            'Your vision is well-defined and emotionally compelling',
            'You have strong alignment between your values and future direction',
            'You have good awareness of both obstacles and resources'
          ],
          recommendations: [
            'Create a detailed implementation plan with milestones',
            'Develop accountability systems to maintain focus on your vision',
            'Regularly revisit and refine your vision as you progress',
            'Consider how to leverage your clarity to inspire and lead others'
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
            <Compass className="h-6 w-6 text-primary" />
            Dream Clarity Generator
          </CardTitle>
          <CardDescription>
            Clarify your vision and create a compelling future aligned with your deepest values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Compass className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Discover Your True North</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Identify your core values and life priorities
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Create Your Vision</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Develop a clear, compelling picture of your ideal future
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Build Your Dream Map</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a personalized roadmap to bring your vision to life
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your core values and how they should guide your vision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your life wheel balance and priority areas for improvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>A structured vision statement that captures your ideal future</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to overcome obstacles and leverage strengths</span>
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
      toolId="dream-clarity-generator"
      title="Dream Clarity Generator"
      description="Clarify your vision and create a compelling future"
      config={config}
      leadCaptureLevel={1}
      showSharing={true}
    />
  )
}