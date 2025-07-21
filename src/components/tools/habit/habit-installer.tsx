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
      },
      {
        id: 'habit-type',
        type: 'multiple-choice',
        text: 'What type of habit is this?',
        required: true,
        category: 'habit-details',
        weight: 0.8,
        options: [
          {
            id: 'ht-1',
            text: 'Health & Fitness (exercise, diet, sleep)',
            value: 'health'
          },
          {
            id: 'ht-2',
            text: 'Productivity & Work (planning, focus, skills)',
            value: 'productivity'
          },
          {
            id: 'ht-3',
            text: 'Personal Development (learning, reading, meditation)',
            value: 'personal'
          },
          {
            id: 'ht-4',
            text: 'Relationships & Social (communication, networking)',
            value: 'social'
          },
          {
            id: 'ht-5',
            text: 'Financial (saving, budgeting, investing)',
            value: 'financial'
          },
          {
            id: 'ht-6',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'motivation-level',
        type: 'multiple-choice',
        text: 'How motivated are you to establish this habit?',
        required: true,
        category: 'motivation',
        weight: 1.2,
        options: [
          {
            id: 'ml-1',
            text: 'Very motivated - I\'m committed to making this change',
            value: 'very_high'
          },
          {
            id: 'ml-2',
            text: 'Moderately motivated - I want this but have some doubts',
            value: 'high'
          },
          {
            id: 'ml-3',
            text: 'Somewhat motivated - I think this would be good for me',
            value: 'moderate'
          },
          {
            id: 'ml-4',
            text: 'Not very motivated - I\'m doing this because I should',
            value: 'low'
          }
        ]
      },
      {
        id: 'primary-motivation',
        type: 'multiple-choice',
        text: 'What is your primary motivation for this habit?',
        required: true,
        category: 'motivation',
        weight: 1.0,
        options: [
          {
            id: 'pm-1',
            text: 'To improve my health and wellbeing',
            value: 'health'
          },
          {
            id: 'pm-2',
            text: 'To achieve a specific goal or outcome',
            value: 'goal'
          },
          {
            id: 'pm-3',
            text: 'To become a better version of myself',
            value: 'self_improvement'
          },
          {
            id: 'pm-4',
            text: 'To reduce stress or anxiety',
            value: 'stress_reduction'
          },
          {
            id: 'pm-5',
            text: 'To improve my relationships or social life',
            value: 'relationships'
          },
          {
            id: 'pm-6',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'biggest-obstacle',
        type: 'multiple-choice',
        text: 'What do you think will be your biggest obstacle to establishing this habit?',
        required: true,
        category: 'obstacles',
        weight: 1.1,
        options: [
          {
            id: 'bo-1',
            text: 'Lack of time or busy schedule',
            value: 'time'
          },
          {
            id: 'bo-2',
            text: 'Lack of motivation or willpower',
            value: 'motivation'
          },
          {
            id: 'bo-3',
            text: 'Forgetting to do it',
            value: 'forgetting'
          },
          {
            id: 'bo-4',
            text: 'Physical discomfort or difficulty',
            value: 'physical'
          },
          {
            id: 'bo-5',
            text: 'Environmental factors (no space, equipment, etc.)',
            value: 'environment'
          },
          {
            id: 'bo-6',
            text: 'Social pressure or lack of support',
            value: 'social'
          },
          {
            id: 'bo-7',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'previous-attempts',
        type: 'multiple-choice',
        text: 'How many times have you tried to establish this habit before?',
        required: true,
        category: 'history',
        weight: 0.9,
        options: [
          {
            id: 'pa-1',
            text: 'This is my first attempt',
            value: 'first'
          },
          {
            id: 'pa-2',
            text: '1-2 times before',
            value: 'few'
          },
          {
            id: 'pa-3',
            text: '3-5 times before',
            value: 'several'
          },
          {
            id: 'pa-4',
            text: 'More than 5 times before',
            value: 'many'
          }
        ]
      },
      {
        id: 'best-time',
        type: 'multiple-choice',
        text: 'When would be the best time of day for you to do this habit?',
        required: true,
        category: 'timing',
        weight: 1.0,
        options: [
          {
            id: 'bt-1',
            text: 'Early morning (before 9 AM)',
            value: 'early_morning'
          },
          {
            id: 'bt-2',
            text: 'Morning (9 AM - 12 PM)',
            value: 'morning'
          },
          {
            id: 'bt-3',
            text: 'Afternoon (12 PM - 5 PM)',
            value: 'afternoon'
          },
          {
            id: 'bt-4',
            text: 'Evening (5 PM - 9 PM)',
            value: 'evening'
          },
          {
            id: 'bt-5',
            text: 'Late evening (after 9 PM)',
            value: 'late_evening'
          },
          {
            id: 'bt-6',
            text: 'I\'m flexible - depends on the day',
            value: 'flexible'
          }
        ]
      },
      {
        id: 'frequency-preference',
        type: 'multiple-choice',
        text: 'How often do you want to do this habit?',
        required: true,
        category: 'timing',
        weight: 1.0,
        options: [
          {
            id: 'fp-1',
            text: 'Every day',
            value: 'daily'
          },
          {
            id: 'fp-2',
            text: 'Most days (5-6 times per week)',
            value: 'most_days'
          },
          {
            id: 'fp-3',
            text: 'A few times per week (3-4 times)',
            value: 'few_times'
          },
          {
            id: 'fp-4',
            text: 'Once or twice per week',
            value: 'weekly'
          },
          {
            id: 'fp-5',
            text: 'Other frequency',
            value: 'other'
          }
        ]
      },
      {
        id: 'duration-preference',
        type: 'multiple-choice',
        text: 'How long do you want to spend on this habit each time?',
        required: true,
        category: 'timing',
        weight: 0.9,
        options: [
          {
            id: 'dp-1',
            text: '5 minutes or less',
            value: '5_min'
          },
          {
            id: 'dp-2',
            text: '10-15 minutes',
            value: '10_15_min'
          },
          {
            id: 'dp-3',
            text: '20-30 minutes',
            value: '20_30_min'
          },
          {
            id: 'dp-4',
            text: '30-60 minutes',
            value: '30_60_min'
          },
          {
            id: 'dp-5',
            text: 'More than 1 hour',
            value: '1_plus_hour'
          }
        ]
      },
      {
        id: 'environment-support',
        type: 'multiple-choice',
        text: 'How supportive is your current environment for this habit?',
        required: true,
        category: 'environment',
        weight: 0.8,
        options: [
          {
            id: 'es-1',
            text: 'Very supportive - I have everything I need',
            value: 'very_supportive'
          },
          {
            id: 'es-2',
            text: 'Somewhat supportive - I have most things I need',
            value: 'somewhat_supportive'
          },
          {
            id: 'es-3',
            text: 'Not very supportive - I need to make some changes',
            value: 'not_supportive'
          },
          {
            id: 'es-4',
            text: 'Unsupportive - I need to make significant changes',
            value: 'unsupportive'
          }
        ]
      },
      {
        id: 'social-support',
        type: 'multiple-choice',
        text: 'How much social support do you have for this habit?',
        required: true,
        category: 'environment',
        weight: 0.8,
        options: [
          {
            id: 'ss-1',
            text: 'Strong support - family/friends encourage this',
            value: 'strong'
          },
          {
            id: 'ss-2',
            text: 'Some support - some people encourage this',
            value: 'some'
          },
          {
            id: 'ss-3',
            text: 'Neutral - people don\'t really care either way',
            value: 'neutral'
          },
          {
            id: 'ss-4',
            text: 'Little support - people don\'t understand or support this',
            value: 'little'
          },
          {
            id: 'ss-5',
            text: 'Negative support - people discourage this',
            value: 'negative'
          }
        ]
      },
      {
        id: 'tracking-preference',
        type: 'multiple-choice',
        text: 'How would you prefer to track your progress?',
        required: true,
        category: 'tracking',
        weight: 0.7,
        options: [
          {
            id: 'tp-1',
            text: 'Digital app or online tracking',
            value: 'digital'
          },
          {
            id: 'tp-2',
            text: 'Physical journal or notebook',
            value: 'physical'
          },
          {
            id: 'tp-3',
            text: 'Calendar or habit tracker',
            value: 'calendar'
          },
          {
            id: 'tp-4',
            text: 'Social media or sharing with others',
            value: 'social'
          },
          {
            id: 'tp-5',
            text: 'I don\'t want to track formally',
            value: 'none'
          }
        ]
      },
      {
        id: 'accountability-preference',
        type: 'multiple-choice',
        text: 'What type of accountability would work best for you?',
        required: true,
        category: 'accountability',
        weight: 0.8,
        options: [
          {
            id: 'ap-1',
            text: 'Partner or friend to check in with',
            value: 'partner'
          },
          {
            id: 'ap-2',
            text: 'Group or community support',
            value: 'group'
          },
          {
            id: 'ap-3',
            text: 'Coach or mentor',
            value: 'coach'
          },
          {
            id: 'ap-4',
            text: 'Self-accountability with reminders',
            value: 'self'
          },
          {
            id: 'ap-5',
            text: 'No external accountability needed',
            value: 'none'
          }
        ]
      },
      {
        id: 'success-definition',
        type: 'text',
        text: 'How will you know this habit is successfully established?',
        description: 'What specific outcome or behavior will indicate success?',
        required: true,
        category: 'success',
        weight: 1.1,
        placeholder: 'Example: I will meditate for 10 minutes every morning without missing more than 2 days in a row'
      }
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