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
      },
      {
        id: 'decision-style',
        type: 'multiple-choice',
        text: 'How do you typically approach important decisions?',
        required: true,
        category: 'decision-style',
        weight: 1.2,
        options: [
          {
            id: 'ds-1',
            text: 'Analytical - I gather data and analyze options systematically',
            value: 'analytical'
          },
          {
            id: 'ds-2',
            text: 'Intuitive - I trust my gut feeling and experience',
            value: 'intuitive'
          },
          {
            id: 'ds-3',
            text: 'Collaborative - I discuss with others and seek input',
            value: 'collaborative'
          },
          {
            id: 'ds-4',
            text: 'Risk-averse - I prefer safe, proven options',
            value: 'risk_averse'
          },
          {
            id: 'ds-5',
            text: 'Innovative - I look for creative, unconventional solutions',
            value: 'innovative'
          }
        ]
      },
      {
        id: 'problem-solving-approach',
        type: 'multiple-choice',
        text: 'When solving complex problems, what approach do you prefer?',
        required: true,
        category: 'problem-solving',
        weight: 1.1,
        options: [
          {
            id: 'psa-1',
            text: 'Breaking down into smaller, manageable parts',
            value: 'decomposition'
          },
          {
            id: 'psa-2',
            text: 'Looking for patterns and similarities to past situations',
            value: 'pattern_recognition'
          },
          {
            id: 'psa-3',
            text: 'Considering multiple perspectives and viewpoints',
            value: 'multiple_perspectives'
          },
          {
            id: 'psa-4',
            text: 'Focusing on the root cause and fundamental issues',
            value: 'root_cause'
          },
          {
            id: 'psa-5',
            text: 'Experimenting and testing different approaches',
            value: 'experimentation'
          }
        ]
      },
      {
        id: 'information-processing',
        type: 'multiple-choice',
        text: 'How do you prefer to process and organize information?',
        required: true,
        category: 'information',
        weight: 1.0,
        options: [
          {
            id: 'ip-1',
            text: 'Visual - I prefer charts, diagrams, and visual representations',
            value: 'visual'
          },
          {
            id: 'ip-2',
            text: 'Logical - I prefer structured, step-by-step frameworks',
            value: 'logical'
          },
          {
            id: 'ip-3',
            text: 'Narrative - I prefer stories and contextual information',
            value: 'narrative'
          },
          {
            id: 'ip-4',
            text: 'Systems - I prefer understanding how things connect and interact',
            value: 'systems'
          },
          {
            id: 'ip-5',
            text: 'Practical - I prefer concrete, actionable information',
            value: 'practical'
          }
        ]
      },
      {
        id: 'bias-awareness',
        type: 'multiple-choice',
        text: 'Which cognitive biases do you think affect your thinking most?',
        required: true,
        category: 'biases',
        weight: 1.3,
        options: [
          {
            id: 'ba-1',
            text: 'Confirmation bias - seeking information that confirms my views',
            value: 'confirmation'
          },
          {
            id: 'ba-2',
            text: 'Anchoring - being influenced by first impressions or numbers',
            value: 'anchoring'
          },
          {
            id: 'ba-3',
            text: 'Availability bias - overestimating what comes to mind easily',
            value: 'availability'
          },
          {
            id: 'ba-4',
            text: 'Sunk cost fallacy - continuing because of past investment',
            value: 'sunk_cost'
          },
          {
            id: 'ba-5',
            text: 'I\'m not sure which biases affect me most',
            value: 'unsure'
          }
        ]
      },
      {
        id: 'learning-preference',
        type: 'multiple-choice',
        text: 'How do you prefer to learn new concepts or skills?',
        required: true,
        category: 'learning',
        weight: 1.0,
        options: [
          {
            id: 'lp-1',
            text: 'Through examples and real-world applications',
            value: 'examples'
          },
          {
            id: 'lp-2',
            text: 'Through theoretical frameworks and principles',
            value: 'theoretical'
          },
          {
            id: 'lp-3',
            text: 'Through hands-on practice and experimentation',
            value: 'hands_on'
          },
          {
            id: 'lp-4',
            text: 'Through discussion and debate with others',
            value: 'discussion'
          },
          {
            id: 'lp-5',
            text: 'Through observation and modeling others',
            value: 'observation'
          }
        ]
      },
      {
        id: 'complexity-tolerance',
        type: 'multiple-choice',
        text: 'How do you handle complex, ambiguous situations?',
        required: true,
        category: 'complexity',
        weight: 1.1,
        options: [
          {
            id: 'ct-1',
            text: 'I embrace complexity and enjoy exploring multiple possibilities',
            value: 'embrace'
          },
          {
            id: 'ct-2',
            text: 'I simplify complex situations into clear frameworks',
            value: 'simplify'
          },
          {
            id: 'ct-3',
            text: 'I gather more information to reduce uncertainty',
            value: 'gather_info'
          },
          {
            id: 'ct-4',
            text: 'I rely on proven methods and best practices',
            value: 'proven_methods'
          },
          {
            id: 'ct-5',
            text: 'I prefer to avoid overly complex situations',
            value: 'avoid'
          }
        ]
      },
      {
        id: 'mental-model-familiarity',
        type: 'multiple-choice',
        text: 'How familiar are you with mental models and thinking frameworks?',
        required: true,
        category: 'familiarity',
        weight: 0.9,
        options: [
          {
            id: 'mmf-1',
            text: 'Very familiar - I actively use mental models in my thinking',
            value: 'very_familiar'
          },
          {
            id: 'mmf-2',
            text: 'Somewhat familiar - I know some models but don\'t use them regularly',
            value: 'somewhat_familiar'
          },
          {
            id: 'mmf-3',
            text: 'A little familiar - I\'ve heard of mental models but don\'t know many',
            value: 'little_familiar'
          },
          {
            id: 'mmf-4',
            text: 'Not familiar - I\'m new to the concept of mental models',
            value: 'not_familiar'
          }
        ]
      },
      {
        id: 'thinking-improvement-goal',
        type: 'multiple-choice',
        text: 'What aspect of your thinking would you most like to improve?',
        required: true,
        category: 'improvement',
        weight: 1.2,
        options: [
          {
            id: 'tig-1',
            text: 'Making better decisions under uncertainty',
            value: 'better_decisions'
          },
          {
            id: 'tig-2',
            text: 'Avoiding cognitive biases and blind spots',
            value: 'avoiding_biases'
          },
          {
            id: 'tig-3',
            text: 'Thinking more creatively and innovatively',
            value: 'creative_thinking'
          },
          {
            id: 'tig-4',
            text: 'Understanding complex systems and relationships',
            value: 'systems_thinking'
          },
          {
            id: 'tig-5',
            text: 'Communicating my thinking more effectively',
            value: 'communication'
          },
          {
            id: 'tig-6',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'domain-expertise',
        type: 'multiple-choice',
        text: 'In which areas do you have the most expertise or experience?',
        required: true,
        category: 'expertise',
        weight: 1.0,
        options: [
          {
            id: 'de-1',
            text: 'Business and strategy',
            value: 'business'
          },
          {
            id: 'de-2',
            text: 'Science and technology',
            value: 'science_tech'
          },
          {
            id: 'de-3',
            text: 'Psychology and human behavior',
            value: 'psychology'
          },
          {
            id: 'de-4',
            text: 'Mathematics and logic',
            value: 'mathematics'
          },
          {
            id: 'de-5',
            text: 'Arts and creativity',
            value: 'arts'
          },
          {
            id: 'de-6',
            text: 'Other or multiple areas',
            value: 'other'
          }
        ]
      },
      {
        id: 'decision-context',
        type: 'multiple-choice',
        text: 'What types of decisions do you make most frequently?',
        required: true,
        category: 'context',
        weight: 1.1,
        options: [
          {
            id: 'dc-1',
            text: 'Strategic decisions with long-term impact',
            value: 'strategic'
          },
          {
            id: 'dc-2',
            text: 'Tactical decisions about processes and operations',
            value: 'tactical'
          },
          {
            id: 'dc-3',
            text: 'People and relationship decisions',
            value: 'people'
          },
          {
            id: 'dc-4',
            text: 'Technical or analytical decisions',
            value: 'technical'
          },
          {
            id: 'dc-5',
            text: 'Creative or design decisions',
            value: 'creative'
          },
          {
            id: 'dc-6',
            text: 'Personal life decisions',
            value: 'personal'
          }
        ]
      },
      {
        id: 'thinking-challenge',
        type: 'text',
        text: 'What is the most challenging thinking problem you\'re currently facing?',
        description: 'Describe a situation where you feel your current thinking approaches are insufficient',
        required: true,
        category: 'challenge',
        weight: 1.3,
        placeholder: 'Describe the thinking challenge you\'re facing...'
      },
      {
        id: 'mental-model-application',
        type: 'text',
        text: 'How do you think mental models could help you in your current situation?',
        description: 'What specific benefits are you hoping to gain from improving your mental models?',
        required: true,
        category: 'application',
        weight: 1.4,
        placeholder: 'Describe how mental models could help you...'
      }
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