"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Activity, BarChart3, Repeat } from 'lucide-react'

export function HabitStrengthAnalyzer() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'habit-strength-analyzer',
    title: 'Habit Strength Analyzer',
    description: 'Measure the strength of your habits and identify areas for improvement',
    questions: [
      {
        id: 'habit-selection',
        type: 'multiple-choice',
        text: 'Which habit would you like to analyze?',
        required: true,
        category: 'habit-selection',
        weight: 1.0,
        options: [
          {
            id: 'hs-1',
            text: 'Morning routine',
            value: 'morning-routine'
          },
          {
            id: 'hs-2',
            text: 'Exercise habit',
            value: 'exercise'
          },
          {
            id: 'hs-3',
            text: 'Healthy eating',
            value: 'healthy-eating'
          },
          {
            id: 'hs-4',
            text: 'Sleep routine',
            value: 'sleep'
          },
          {
            id: 'hs-5',
            text: 'Productivity/work habit',
            value: 'productivity'
          },
          {
            id: 'hs-6',
            text: 'Learning/reading habit',
            value: 'learning'
          },
          {
            id: 'hs-7',
            text: 'Mindfulness/meditation',
            value: 'mindfulness'
          },
          {
            id: 'hs-8',
            text: 'Other habit (you\'ll specify later)',
            value: 'other'
          }
        ]
      },
      {
        id: 'habit-description',
        type: 'text',
        text: 'Briefly describe the specific habit you want to analyze:',
        description: 'Example: "Going for a 30-minute walk every morning" or "Reading for 20 minutes before bed"',
        required: true,
        category: 'habit-details',
        weight: 1.0,
        placeholder: 'Describe your specific habit here...'
      },
      {
        id: 'consistency-1',
        type: 'multiple-choice',
        text: 'How consistently have you performed this habit over the past month?',
        required: true,
        category: 'consistency',
        weight: 1.5,
        options: [
          {
            id: 'c1-1',
            text: 'Rarely or never (0-20% of intended times)',
            value: 1,
            score: 1
          },
          {
            id: 'c1-2',
            text: 'Occasionally (21-50% of intended times)',
            value: 2,
            score: 3
          },
          {
            id: 'c1-3',
            text: 'Often (51-80% of intended times)',
            value: 3,
            score: 7
          },
          {
            id: 'c1-4',
            text: 'Almost always or always (81-100% of intended times)',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'consistency-2',
        type: 'multiple-choice',
        text: 'When you miss performing this habit, how quickly do you get back on track?',
        required: true,
        category: 'consistency',
        weight: 1.3,
        options: [
          {
            id: 'c2-1',
            text: 'I often don\'t get back on track once I miss it',
            value: 1,
            score: 1
          },
          {
            id: 'c2-2',
            text: 'It usually takes me several days or weeks to restart',
            value: 2,
            score: 3
          },
          {
            id: 'c2-3',
            text: 'I typically get back on track the next opportunity',
            value: 3,
            score: 7
          },
          {
            id: 'c2-4',
            text: 'I almost never miss, or immediately get back on track if I do',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'automaticity-1',
        type: 'scale',
        text: 'I perform this habit automatically without having to consciously remember or motivate myself.',
        required: true,
        category: 'automaticity',
        weight: 1.6,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'automaticity-2',
        type: 'multiple-choice',
        text: 'How much mental effort or willpower does it take to perform this habit?',
        required: true,
        category: 'automaticity',
        weight: 1.4,
        options: [
          {
            id: 'a2-1',
            text: 'Significant effort every time',
            value: 1,
            score: 1
          },
          {
            id: 'a2-2',
            text: 'Moderate effort most times',
            value: 2,
            score: 3
          },
          {
            id: 'a2-3',
            text: 'Minimal effort most times',
            value: 3,
            score: 7
          },
          {
            id: 'a2-4',
            text: 'Almost no effort, I do it on autopilot',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'identity-1',
        type: 'scale',
        text: 'This habit feels like a natural part of who I am and my identity.',
        required: true,
        category: 'identity',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'identity-2',
        type: 'multiple-choice',
        text: 'Which statement best describes how you view this habit?',
        required: true,
        category: 'identity',
        weight: 1.3,
        options: [
          {
            id: 'i2-1',
            text: 'It is something I am trying to do but does not feel like "me"',
            value: 1,
            score: 1
          },
          {
            id: 'i2-2',
            text: 'It is something I do but not a core part of my identity',
            value: 2,
            score: 3
          },
          {
            id: 'i2-3',
            text: 'It is becoming part of how I see myself',
            value: 3,
            score: 7
          },
          {
            id: 'i2-4',
            text: 'It is completely aligned with who I am as a person',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'cue-1',
        type: 'multiple-choice',
        text: 'Is this habit linked to a specific and consistent cue or trigger?',
        required: true,
        category: 'cue-strength',
        weight: 1.4,
        options: [
          {
            id: 'cue1-1',
            text: 'No, I do not have a specific cue or trigger',
            value: 1,
            score: 1
          },
          {
            id: 'cue1-2',
            text: 'I have a vague cue but it is not very consistent',
            value: 2,
            score: 3
          },
          {
            id: 'cue1-3',
            text: 'I have a specific cue that works most of the time',
            value: 3,
            score: 7
          },
          {
            id: 'cue1-4',
            text: 'I have a very specific and reliable cue that always triggers my habit',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'cue-2',
        type: 'text',
        text: 'What specific cue or trigger initiates this habit for you?',
        description: 'Example: "After brushing my teeth" or "When my alarm goes off at 6am"',
        required: false,
        category: 'cue-strength',
        weight: 1.2,
        placeholder: 'Describe your habit cue here...'
      },
      {
        id: 'reward-1',
        type: 'scale',
        text: 'I find this habit satisfying or rewarding to perform.',
        required: true,
        category: 'reward-strength',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'reward-2',
        type: 'multiple-choice',
        text: 'What type of reward do you experience from this habit?',
        required: true,
        category: 'reward-strength',
        weight: 1.3,
        options: [
          {
            id: 'r2-1',
            text: 'I do not experience any reward, I just do it because I should',
            value: 1,
            score: 1
          },
          {
            id: 'r2-2',
            text: 'I mainly feel relief from avoiding guilt or negative consequences',
            value: 2,
            score: 3
          },
          {
            id: 'r2-3',
            text: 'I experience some positive feelings or benefits afterward',
            value: 3,
            score: 7
          },
          {
            id: 'r2-4',
            text: 'I experience immediate and significant positive feelings or benefits',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'environment-1',
        type: 'scale',
        text: 'My physical environment makes this habit easy to perform.',
        required: true,
        category: 'environment',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'environment-2',
        type: 'multiple-choice',
        text: 'How have you designed your environment to support this habit?',
        required: true,
        category: 'environment',
        weight: 1.3,
        options: [
          {
            id: 'e2-1',
            text: 'I have not made any environmental changes to support this habit',
            value: 1,
            score: 1
          },
          {
            id: 'e2-2',
            text: 'I have made minor adjustments to my environment',
            value: 2,
            score: 3
          },
          {
            id: 'e2-3',
            text: 'I have made several significant changes to my environment',
            value: 3,
            score: 7
          },
          {
            id: 'e2-4',
            text: 'I have completely optimized my environment to make this habit almost inevitable',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'social-1',
        type: 'scale',
        text: 'The people around me support or encourage this habit.',
        required: true,
        category: 'social-support',
        weight: 1.3,
        min: 1,
        max: 10,
        labels: {
          min: 'Strongly Disagree',
          max: 'Strongly Agree'
        }
      },
      {
        id: 'social-2',
        type: 'multiple-choice',
        text: 'How would you describe the social influence on this habit?',
        required: true,
        category: 'social-support',
        weight: 1.2,
        options: [
          {
            id: 's2-1',
            text: 'People around me discourage or undermine this habit',
            value: 1,
            score: 1
          },
          {
            id: 's2-2',
            text: 'People are neutral or unaware of this habit',
            value: 2,
            score: 3
          },
          {
            id: 's2-3',
            text: 'Some people support this habit',
            value: 3,
            score: 7
          },
          {
            id: 's2-4',
            text: 'I have strong social support or accountability for this habit',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'obstacles-1',
        type: 'text',
        text: 'What are the biggest obstacles that prevent you from performing this habit consistently?',
        required: false,
        category: 'obstacles',
        weight: 1.3,
        placeholder: 'Describe your main obstacles here...'
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'consistency',
          name: 'Consistency',
          weight: 1.5,
          questions: ['consistency-1', 'consistency-2']
        },
        {
          id: 'automaticity',
          name: 'Automaticity',
          weight: 1.6,
          questions: ['automaticity-1', 'automaticity-2']
        },
        {
          id: 'identity',
          name: 'Identity Integration',
          weight: 1.5,
          questions: ['identity-1', 'identity-2']
        },
        {
          id: 'cue-strength',
          name: 'Cue Strength',
          weight: 1.4,
          questions: ['cue-1']
        },
        {
          id: 'reward-strength',
          name: 'Reward Strength',
          weight: 1.5,
          questions: ['reward-1', 'reward-2']
        },
        {
          id: 'environment',
          name: 'Environmental Design',
          weight: 1.4,
          questions: ['environment-1', 'environment-2']
        },
        {
          id: 'social-support',
          name: 'Social Support',
          weight: 1.3,
          questions: ['social-1', 'social-2']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Fragile Habit',
          description: 'This habit is in its early stages and needs significant strengthening.',
          insights: [
            'Your habit is not yet firmly established in your routine',
            'You likely need to exert significant willpower to maintain it',
            'The habit is vulnerable to disruption when your circumstances change'
          ],
          recommendations: [
            'Focus on creating a specific, consistent cue for your habit',
            'Make the habit extremely small and easy to perform initially',
            'Design your environment to reduce friction and make the habit obvious',
            'Create immediate rewards to reinforce the behavior',
            'Track your habit daily to build momentum and awareness'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Developing Habit',
          description: 'This habit is establishing but needs reinforcement in specific areas.',
          insights: [
            'Your habit has moderate strength but is not fully automatic yet',
            'You have some good foundations but specific areas need strengthening',
            'The habit may falter under stress or significant disruption'
          ],
          recommendations: [
            'Strengthen your habit cue by making it more specific and consistent',
            'Enhance the reward experience by celebrating completions',
            'Optimize your environment further to remove remaining friction',
            'Connect the habit to your identity through reflection and affirmations',
            'Consider adding social accountability or support'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Strong Habit',
          description: 'This habit is well-established and operates largely on autopilot.',
          insights: [
            'Your habit is firmly established and requires minimal willpower',
            'The behavior feels like a natural part of your identity',
            'You have strong systems in place that make the habit almost inevitable'
          ],
          recommendations: [
            'Consider how to build upon this strong foundation',
            'Look for ways to optimize the habit for even better results',
            'Use this strong habit as a platform to stack new related habits',
            'Share your successful habit-building approach with others',
            'Periodically review to ensure the habit continues serving your goals'
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
            <Activity className="h-6 w-6 text-primary" />
            Habit Strength Analyzer
          </CardTitle>
          <CardDescription>
            Measure the strength of your habits and identify specific areas for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Measure Habit Strength</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Assess 7 key dimensions of habit formation
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Weak Points</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover exactly what's preventing habit consistency
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Repeat className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Get Strengthening Strategies</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Receive science-backed techniques to reinforce your habits
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your overall habit strength score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Detailed breakdown across 7 habit formation dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your strongest and weakest habit components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to strengthen your specific habit</span>
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
            Takes approximately 5-7 minutes to complete • Your results are saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="habit-strength-analyzer"
      title="Habit Strength Analyzer"
      description="Measure the strength of your habits and identify areas for improvement"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}