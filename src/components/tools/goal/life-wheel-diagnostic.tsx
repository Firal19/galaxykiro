"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, PieChart, BarChart3, Layers } from 'lucide-react'

export function LifeWheelDiagnostic() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'life-wheel-diagnostic',
    title: 'Life Wheel Diagnostic',
    description: 'Visualize balance across all areas of your life',
    questions: [
      {
        id: 'career-1',
        type: 'scale',
        text: 'How satisfied are you with your career or work life?',
        description: 'Consider your job satisfaction, growth opportunities, and sense of purpose',
        required: true,
        category: 'career',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'career-2',
        type: 'text',
        text: 'What would make your career or work life more fulfilling?',
        required: false,
        category: 'career',
        weight: 1.0,
        placeholder: 'Describe what would improve your career satisfaction...'
      },
      {
        id: 'finances-1',
        type: 'scale',
        text: 'How satisfied are you with your financial situation?',
        description: 'Consider your income, savings, investments, and financial security',
        required: true,
        category: 'finances',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'finances-2',
        type: 'text',
        text: 'What would make your financial situation more satisfying?',
        required: false,
        category: 'finances',
        weight: 1.0,
        placeholder: 'Describe what would improve your financial satisfaction...'
      },
      {
        id: 'health-1',
        type: 'scale',
        text: 'How satisfied are you with your physical health and wellbeing?',
        description: 'Consider your energy levels, fitness, nutrition, and overall health',
        required: true,
        category: 'health',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'health-2',
        type: 'text',
        text: 'What would make your physical health more satisfying?',
        required: false,
        category: 'health',
        weight: 1.0,
        placeholder: 'Describe what would improve your health satisfaction...'
      },
      {
        id: 'relationships-1',
        type: 'scale',
        text: 'How satisfied are you with your relationships?',
        description: 'Consider family, friends, romantic relationships, and social connections',
        required: true,
        category: 'relationships',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'relationships-2',
        type: 'text',
        text: 'What would make your relationships more fulfilling?',
        required: false,
        category: 'relationships',
        weight: 1.0,
        placeholder: 'Describe what would improve your relationship satisfaction...'
      },
      {
        id: 'personal-growth-1',
        type: 'scale',
        text: 'How satisfied are you with your personal growth and learning?',
        description: 'Consider your intellectual development, skills acquisition, and personal development',
        required: true,
        category: 'personal-growth',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'personal-growth-2',
        type: 'text',
        text: 'What would make your personal growth more satisfying?',
        required: false,
        category: 'personal-growth',
        weight: 1.0,
        placeholder: 'Describe what would improve your personal growth satisfaction...'
      },
      {
        id: 'recreation-1',
        type: 'scale',
        text: 'How satisfied are you with your recreation and leisure time?',
        description: 'Consider hobbies, entertainment, relaxation, and fun activities',
        required: true,
        category: 'recreation',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'recreation-2',
        type: 'text',
        text: 'What would make your recreation and leisure time more fulfilling?',
        required: false,
        category: 'recreation',
        weight: 1.0,
        placeholder: 'Describe what would improve your recreation satisfaction...'
      },
      {
        id: 'environment-1',
        type: 'scale',
        text: 'How satisfied are you with your physical environment?',
        description: 'Consider your home, workspace, neighborhood, and surroundings',
        required: true,
        category: 'environment',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'environment-2',
        type: 'text',
        text: 'What would make your physical environment more satisfying?',
        required: false,
        category: 'environment',
        weight: 1.0,
        placeholder: 'Describe what would improve your environment satisfaction...'
      },
      {
        id: 'spiritual-1',
        type: 'scale',
        text: 'How satisfied are you with your spiritual or inner life?',
        description: 'Consider your sense of meaning, purpose, values, and connection',
        required: true,
        category: 'spiritual',
        weight: 1.0,
        min: 1,
        max: 10,
        labels: {
          min: 'Very Dissatisfied',
          max: 'Completely Satisfied'
        }
      },
      {
        id: 'spiritual-2',
        type: 'text',
        text: 'What would make your spiritual or inner life more fulfilling?',
        required: false,
        category: 'spiritual',
        weight: 1.0,
        placeholder: 'Describe what would improve your spiritual satisfaction...'
      },
      {
        id: 'priorities-1',
        type: 'ranking',
        text: 'Rank these life areas in order of priority for improvement:',
        description: 'Drag and drop to reorder based on where you want to focus first',
        required: true,
        category: 'priorities',
        weight: 1.0,
        items: [
          {
            id: 'p1',
            text: 'Career/Work',
            value: 'career'
          },
          {
            id: 'p2',
            text: 'Finances',
            value: 'finances'
          },
          {
            id: 'p3',
            text: 'Health & Wellbeing',
            value: 'health'
          },
          {
            id: 'p4',
            text: 'Relationships',
            value: 'relationships'
          },
          {
            id: 'p5',
            text: 'Personal Growth',
            value: 'personal-growth'
          },
          {
            id: 'p6',
            text: 'Recreation & Leisure',
            value: 'recreation'
          },
          {
            id: 'p7',
            text: 'Physical Environment',
            value: 'environment'
          },
          {
            id: 'p8',
            text: 'Spiritual/Inner Life',
            value: 'spiritual'
          }
        ]
      },
      {
        id: 'focus-1',
        type: 'multiple-choice',
        text: 'Which ONE area would you like to focus on improving first?',
        required: true,
        category: 'focus',
        weight: 1.0,
        options: [
          {
            id: 'f1-1',
            text: 'Career/Work',
            value: 'career'
          },
          {
            id: 'f1-2',
            text: 'Finances',
            value: 'finances'
          },
          {
            id: 'f1-3',
            text: 'Health & Wellbeing',
            value: 'health'
          },
          {
            id: 'f1-4',
            text: 'Relationships',
            value: 'relationships'
          },
          {
            id: 'f1-5',
            text: 'Personal Growth',
            value: 'personal-growth'
          },
          {
            id: 'f1-6',
            text: 'Recreation & Leisure',
            value: 'recreation'
          },
          {
            id: 'f1-7',
            text: 'Physical Environment',
            value: 'environment'
          },
          {
            id: 'f1-8',
            text: 'Spiritual/Inner Life',
            value: 'spiritual'
          }
        ]
      },
      {
        id: 'goal-1',
        type: 'text',
        text: 'What specific goal would you like to set for your primary focus area?',
        description: 'Make it specific, measurable, and time-bound',
        required: false,
        category: 'goals',
        weight: 1.0,
        placeholder: 'Example: Increase my daily step count to 10,000 steps within 30 days'
      }
    ],
    scoringConfig: {
      type: 'custom',
      customScoring: (responses, questions) => {
        // Extract satisfaction scores for each life area
        const areaScores: Record<string, number> = {
          career: 0,
          finances: 0,
          health: 0,
          relationships: 0,
          'personal-growth': 0,
          recreation: 0,
          environment: 0,
          spiritual: 0
        }
        
        // Get the scale responses
        responses.forEach(response => {
          const question = questions.find(q => q.id === response.questionId)
          if (question && question.type === 'scale') {
            const category = question.category
            if (category && category in areaScores) {
              areaScores[category] = Number(response.answer)
            }
          }
        })
        
        // Calculate overall balance score
        const scores = Object.values(areaScores)
        const validScores = scores.filter(score => score > 0)
        const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length
        const totalScore = Math.round(average * 10) // Scale to 0-100
        
        // Calculate standard deviation to measure balance
        const squareDiffs = validScores.map(score => Math.pow(score - average, 2))
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / validScores.length
        const stdDev = Math.sqrt(avgSquareDiff)
        
        // Balance percentage (inverse of standard deviation, normalized)
        // Lower std dev means better balance
        const maxPossibleStdDev = 4.5 // Theoretical max for 1-10 scale
        const balanceScore = Math.max(0, Math.min(100, 100 - (stdDev / maxPossibleStdDev * 100)))
        
        // Determine lowest and highest areas
        const areaEntries = Object.entries(areaScores)
        const sortedAreas = [...areaEntries].sort((a, b) => a[1] - b[1])
        const lowestAreas = sortedAreas.filter(([_, score]) => score <= 4).map(([area]) => formatAreaName(area))
        const highestAreas = sortedAreas.filter(([_, score]) => score >= 8).map(([area]) => formatAreaName(area))
        
        // Get focus area
        let focusArea = ''
        const focusResponse = responses.find(r => r.questionId === 'focus-1')
        if (focusResponse && typeof focusResponse.answer === 'string') {
          focusArea = focusResponse.answer
        }
        
        // Determine tier based on overall satisfaction and balance
        let tier
        if (totalScore >= 70 && balanceScore >= 70) {
          tier = {
            label: 'Harmonious Life',
            description: 'You have strong satisfaction and balance across most life areas.',
            insights: [
              "You've achieved good satisfaction across most life dimensions",
              "Your life shows strong overall balance with few neglected areas",
              "You have a solid foundation for continued growth and fulfillment"
            ],
            recommendations: [
              "Focus on maintaining your current balance while pursuing excellence",
              "Consider how you can leverage strengths in high-scoring areas to further improve lower areas",
              "Develop systems to ensure continued balance as life circumstances change",
              "Share your approach to life balance with others who might benefit"
            ]
          }
        } else if (totalScore >= 60 || balanceScore >= 60) {
          tier = {
            label: 'Partially Balanced Life',
            description: 'You have moderate satisfaction with some areas of imbalance.',
            insights: [
              "You have good satisfaction in several key life areas",
              "Some areas are significantly stronger than others",
              "Addressing your lower-scoring areas would improve overall life quality"
            ],
            recommendations: [
              "Create a 90-day plan to improve your lowest-scoring life area",
              "Schedule regular time for your most neglected areas",
              "Consider how improvements in one area might positively impact others",
              "Reassess your life wheel quarterly to track progress toward better balance"
            ]
          }
        } else {
          tier = {
            label: 'Opportunity for Balance',
            description: 'You have significant room for improvement in satisfaction and balance.',
            insights: [
              "Several life areas are currently showing low satisfaction",
              "There are notable imbalances across your life dimensions",
              "Focused attention on key areas could significantly improve your overall wellbeing"
            ],
            recommendations: [
              "Start with small, consistent improvements in your lowest-scoring area",
              "Create boundaries to protect time for neglected life dimensions",
              "Consider whether you're overinvesting in certain areas at the expense of others",
              "Develop a comprehensive life balance plan with specific goals for each area"
            ]
          }
        }
        
        // Add area-specific insights to tier
        if (lowestAreas.length > 0) {
          tier.insights.push(`Your lowest satisfaction areas are: ${lowestAreas.join(', ')}`)
        }
        if (highestAreas.length > 0) {
          tier.insights.push(`Your highest satisfaction areas are: ${highestAreas.join(', ')}`)
        }
        
        // Add focus area recommendation
        if (focusArea) {
          tier.recommendations.unshift(`Implement your goal for ${formatAreaName(focusArea)} as your primary focus`)
        }
        
        return {
          total: totalScore,
          percentage: totalScore,
          breakdown: areaScores,
          categoryScores: {
            'life-areas': {
              score: totalScore,
              percentage: totalScore,
              maxPossible: 100
            },
            'life-balance': {
              score: Math.round(balanceScore),
              percentage: Math.round(balanceScore),
              maxPossible: 100
            }
          },
          tier
        }
        
        // Helper function to format area names
        function formatAreaName(area: string): string {
          const nameMap: Record<string, string> = {
            'career': 'Career/Work',
            'finances': 'Finances',
            'health': 'Health & Wellbeing',
            'relationships': 'Relationships',
            'personal-growth': 'Personal Growth',
            'recreation': 'Recreation & Leisure',
            'environment': 'Physical Environment',
            'spiritual': 'Spiritual/Inner Life'
          }
          return nameMap[area] || area
        }
      },
      resultTiers: []
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
            <PieChart className="h-6 w-6 text-primary" />
            Life Wheel Diagnostic
          </CardTitle>
          <CardDescription>
            Visualize balance across all areas of your life and create a plan for greater fulfillment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <PieChart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Visualize Your Life Balance</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                See how balanced your life is across 8 key dimensions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Priority Areas</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover which life areas need most attention
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Layers className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Create a 90-Day Plan</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a personalized roadmap for greater life balance
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your satisfaction levels across 8 key life dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Visual life wheel showing your current balance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your highest and lowest satisfaction areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized 90-day plan to improve your life balance</span>
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
      toolId="life-wheel-diagnostic"
      title="Life Wheel Diagnostic"
      description="Visualize balance across all areas of your life"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}