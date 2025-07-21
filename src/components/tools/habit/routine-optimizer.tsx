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
      },
      {
        id: 'current-routine-satisfaction',
        type: 'multiple-choice',
        text: 'How satisfied are you with your current daily routine?',
        required: true,
        category: 'current-routine',
        weight: 1.0,
        options: [
          {
            id: 'crs-1',
            text: 'Very satisfied - my routine works well for me',
            value: 'very_satisfied'
          },
          {
            id: 'crs-2',
            text: 'Somewhat satisfied - it works but could be better',
            value: 'somewhat_satisfied'
          },
          {
            id: 'crs-3',
            text: 'Not very satisfied - I need significant improvements',
            value: 'not_satisfied'
          },
          {
            id: 'crs-4',
            text: 'Very dissatisfied - my routine is not working at all',
            value: 'very_dissatisfied'
          }
        ]
      },
      {
        id: 'work-style',
        type: 'multiple-choice',
        text: 'What best describes your preferred work style?',
        required: true,
        category: 'work-style',
        weight: 1.2,
        options: [
          {
            id: 'ws-1',
            text: 'Deep focus - I prefer long, uninterrupted work sessions',
            value: 'deep_focus'
          },
          {
            id: 'ws-2',
            text: 'Pomodoro - I work best in focused 25-minute blocks',
            value: 'pomodoro'
          },
          {
            id: 'ws-3',
            text: 'Flexible - I adapt my work style to the task',
            value: 'flexible'
          },
          {
            id: 'ws-4',
            text: 'Collaborative - I work best with others around',
            value: 'collaborative'
          },
          {
            id: 'ws-5',
            text: 'Quick bursts - I prefer short, intense work periods',
            value: 'quick_bursts'
          }
        ]
      },
      {
        id: 'morning-preference',
        type: 'multiple-choice',
        text: 'What type of morning routine do you prefer?',
        required: true,
        category: 'morning',
        weight: 1.1,
        options: [
          {
            id: 'mp-1',
            text: 'Slow and relaxed - I need time to wake up gradually',
            value: 'slow_relaxed'
          },
          {
            id: 'mp-2',
            text: 'Quick and efficient - I want to get started immediately',
            value: 'quick_efficient'
          },
          {
            id: 'mp-3',
            text: 'Active and energizing - I like exercise or movement',
            value: 'active_energizing'
          },
          {
            id: 'mp-4',
            text: 'Mindful and reflective - I prefer meditation or journaling',
            value: 'mindful_reflective'
          },
          {
            id: 'mp-5',
            text: 'Productive - I like to tackle important tasks early',
            value: 'productive'
          }
        ]
      },
      {
        id: 'evening-preference',
        type: 'multiple-choice',
        text: 'What type of evening routine do you prefer?',
        required: true,
        category: 'evening',
        weight: 1.1,
        options: [
          {
            id: 'ep-1',
            text: 'Relaxing and winding down - I need to decompress',
            value: 'relaxing'
          },
          {
            id: 'ep-2',
            text: 'Planning and preparation - I like to prepare for tomorrow',
            value: 'planning'
          },
          {
            id: 'ep-3',
            text: 'Creative and inspiring - I like to work on personal projects',
            value: 'creative'
          },
          {
            id: 'ep-4',
            text: 'Social and connecting - I prefer spending time with others',
            value: 'social'
          },
          {
            id: 'ep-5',
            text: 'Active and energizing - I like evening exercise',
            value: 'active'
          }
        ]
      },
      {
        id: 'break-preference',
        type: 'multiple-choice',
        text: 'How do you prefer to take breaks during your workday?',
        required: true,
        category: 'breaks',
        weight: 0.9,
        options: [
          {
            id: 'bp-1',
            text: 'Short, frequent breaks (every 30-60 minutes)',
            value: 'short_frequent'
          },
          {
            id: 'bp-2',
            text: 'Longer, less frequent breaks (every 2-3 hours)',
            value: 'longer_less_frequent'
          },
          {
            id: 'bp-3',
            text: 'As needed - I take breaks when I feel I need them',
            value: 'as_needed'
          },
          {
            id: 'bp-4',
            text: 'Structured breaks at specific times',
            value: 'structured'
          },
          {
            id: 'bp-5',
            text: 'I prefer to work through without many breaks',
            value: 'minimal'
          }
        ]
      },
      {
        id: 'transition-needs',
        type: 'multiple-choice',
        text: 'How do you handle transitions between different activities?',
        required: true,
        category: 'transitions',
        weight: 0.8,
        options: [
          {
            id: 'tn-1',
            text: 'I need time to mentally prepare for transitions',
            value: 'need_preparation'
          },
          {
            id: 'tn-2',
            text: 'I can switch quickly between different tasks',
            value: 'quick_switch'
          },
          {
            id: 'tn-3',
            text: 'I prefer to group similar activities together',
            value: 'group_similar'
          },
          {
            id: 'tn-4',
            text: 'I like to have clear rituals between activities',
            value: 'clear_rituals'
          },
          {
            id: 'tn-5',
            text: 'I don\'t think much about transitions',
            value: 'no_preference'
          }
        ]
      },
      {
        id: 'stress-management',
        type: 'multiple-choice',
        text: 'What helps you manage stress during your day?',
        required: true,
        category: 'stress',
        weight: 1.0,
        options: [
          {
            id: 'sm-1',
            text: 'Physical activity or exercise',
            value: 'physical_activity'
          },
          {
            id: 'sm-2',
            text: 'Mindfulness or meditation',
            value: 'mindfulness'
          },
          {
            id: 'sm-3',
            text: 'Social interaction or talking to others',
            value: 'social_interaction'
          },
          {
            id: 'sm-4',
            text: 'Creative activities or hobbies',
            value: 'creative_activities'
          },
          {
            id: 'sm-5',
            text: 'Alone time or quiet reflection',
            value: 'alone_time'
          },
          {
            id: 'sm-6',
            text: 'I don\'t have specific stress management strategies',
            value: 'none'
          }
        ]
      },
      {
        id: 'productivity-focus',
        type: 'multiple-choice',
        text: 'What is your primary focus for routine optimization?',
        required: true,
        category: 'focus',
        weight: 1.3,
        options: [
          {
            id: 'pf-1',
            text: 'Increasing productivity and getting more done',
            value: 'productivity'
          },
          {
            id: 'pf-2',
            text: 'Improving work-life balance',
            value: 'work_life_balance'
          },
          {
            id: 'pf-3',
            text: 'Reducing stress and improving wellbeing',
            value: 'stress_reduction'
          },
          {
            id: 'pf-4',
            text: 'Creating more time for personal goals',
            value: 'personal_goals'
          },
          {
            id: 'pf-5',
            text: 'Building better habits and consistency',
            value: 'habits_consistency'
          },
          {
            id: 'pf-6',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'schedule-flexibility',
        type: 'multiple-choice',
        text: 'How much flexibility do you need in your daily schedule?',
        required: true,
        category: 'flexibility',
        weight: 1.0,
        options: [
          {
            id: 'sf-1',
            text: 'Very structured - I prefer a fixed schedule',
            value: 'very_structured'
          },
          {
            id: 'sf-2',
            text: 'Somewhat structured - I like a framework but with flexibility',
            value: 'somewhat_structured'
          },
          {
            id: 'sf-3',
            text: 'Flexible - I prefer to adapt to what comes up',
            value: 'flexible'
          },
          {
            id: 'sf-4',
            text: 'Very flexible - I prefer to go with the flow',
            value: 'very_flexible'
          }
        ]
      },
      {
        id: 'current-challenges',
        type: 'text',
        text: 'What are the biggest challenges you face with your current routine?',
        description: 'Be specific about what\'s not working for you',
        required: true,
        category: 'challenges',
        weight: 1.2,
        placeholder: 'Example: I struggle to find time for exercise, or I get distracted during work hours'
      },
      {
        id: 'ideal-outcome',
        type: 'text',
        text: 'What would an ideal daily routine look like for you?',
        description: 'Describe your vision of a perfect day',
        required: true,
        category: 'outcome',
        weight: 1.4,
        placeholder: 'Example: I would wake up early, exercise, work productively, and have time for family and hobbies'
      },
      {
        id: 'commitment-level',
        type: 'multiple-choice',
        text: 'How committed are you to implementing a new routine?',
        required: true,
        category: 'commitment',
        weight: 1.1,
        options: [
          {
            id: 'cl-1',
            text: 'Very committed - I\'m ready to make significant changes',
            value: 'very_committed'
          },
          {
            id: 'cl-2',
            text: 'Moderately committed - I\'m willing to try new approaches',
            value: 'moderately_committed'
          },
          {
            id: 'cl-3',
            text: 'Somewhat committed - I\'ll try but may need support',
            value: 'somewhat_committed'
          },
          {
            id: 'cl-4',
            text: 'Not very committed - I\'m just exploring options',
            value: 'not_committed'
          }
        ]
      },
      {
        id: 'support-needs',
        type: 'multiple-choice',
        text: 'What type of support would help you implement a new routine?',
        required: true,
        category: 'support',
        weight: 0.9,
        options: [
          {
            id: 'sn-1',
            text: 'Accountability partner or coach',
            value: 'accountability'
          },
          {
            id: 'sn-2',
            text: 'Reminders and tracking tools',
            value: 'reminders_tracking'
          },
          {
            id: 'sn-3',
            text: 'Community or group support',
            value: 'community'
          },
          {
            id: 'sn-4',
            text: 'Educational resources and guidance',
            value: 'education'
          },
          {
            id: 'sn-5',
            text: 'I prefer to implement changes independently',
            value: 'independent'
          }
        ]
      }
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