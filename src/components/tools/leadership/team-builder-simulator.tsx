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
      {
        id: 'team-purpose',
        type: 'text',
        text: 'What is the primary purpose or mission of your team?',
        required: true,
        category: 'purpose',
        weight: 1.5,
        placeholder: 'Describe your team\'s main purpose or mission...'
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
      },
      {
        id: 'team-type',
        type: 'multiple-choice',
        text: 'What type of team are you building?',
        required: true,
        category: 'type',
        weight: 1.2,
        options: [
          {
            id: 'tt-1',
            text: 'Project team (temporary, goal-focused)',
            value: 'project'
          },
          {
            id: 'tt-2',
            text: 'Functional team (ongoing, specialized)',
            value: 'functional'
          },
          {
            id: 'tt-3',
            text: 'Cross-functional team (diverse skills)',
            value: 'cross_functional'
          },
          {
            id: 'tt-4',
            text: 'Leadership team (strategic, decision-making)',
            value: 'leadership'
          },
          {
            id: 'tt-5',
            text: 'Innovation team (creative, experimental)',
            value: 'innovation'
          },
          {
            id: 'tt-6',
            text: 'Other',
            value: 'other'
          }
        ]
      },
      {
        id: 'critical-skills',
        type: 'text',
        text: 'What are the most critical skills needed for your team to succeed?',
        description: 'List the essential skills, knowledge, or expertise required',
        required: true,
        category: 'skills',
        weight: 1.4,
        placeholder: 'Example: Technical expertise, communication, project management, creativity'
      },
      {
        id: 'team-diversity',
        type: 'multiple-choice',
        text: 'How important is diversity in your team composition?',
        required: true,
        category: 'diversity',
        weight: 1.1,
        options: [
          {
            id: 'td-1',
            text: 'Very important - I actively seek diverse perspectives',
            value: 'very_important'
          },
          {
            id: 'td-2',
            text: 'Somewhat important - I value different viewpoints',
            value: 'somewhat_important'
          },
          {
            id: 'td-3',
            text: 'Moderately important - I consider it when possible',
            value: 'moderately_important'
          },
          {
            id: 'td-4',
            text: 'Not a priority - I focus on skills and fit',
            value: 'not_priority'
          }
        ]
      },
      {
        id: 'leadership-style',
        type: 'multiple-choice',
        text: 'What is your preferred leadership style for this team?',
        required: true,
        category: 'leadership',
        weight: 1.3,
        options: [
          {
            id: 'ls-1',
            text: 'Directive - I provide clear direction and oversight',
            value: 'directive'
          },
          {
            id: 'ls-2',
            text: 'Participative - I involve team members in decisions',
            value: 'participative'
          },
          {
            id: 'ls-3',
            text: 'Delegative - I empower team members to lead',
            value: 'delegative'
          },
          {
            id: 'ls-4',
            text: 'Transformational - I inspire and motivate the team',
            value: 'transformational'
          },
          {
            id: 'ls-5',
            text: 'Adaptive - I adjust my style to the situation',
            value: 'adaptive'
          }
        ]
      },
      {
        id: 'communication-preference',
        type: 'multiple-choice',
        text: 'How do you prefer team communication to be structured?',
        required: true,
        category: 'communication',
        weight: 1.0,
        options: [
          {
            id: 'cp-1',
            text: 'Frequent, informal check-ins',
            value: 'frequent_informal'
          },
          {
            id: 'cp-2',
            text: 'Structured, scheduled meetings',
            value: 'structured_scheduled'
          },
          {
            id: 'cp-3',
            text: 'Asynchronous, written communication',
            value: 'asynchronous'
          },
          {
            id: 'cp-4',
            text: 'Hybrid approach - mix of methods',
            value: 'hybrid'
          },
          {
            id: 'cp-5',
            text: 'Minimal communication - let people work independently',
            value: 'minimal'
          }
        ]
      },
      {
        id: 'decision-making-process',
        type: 'multiple-choice',
        text: 'How should important decisions be made in your team?',
        required: true,
        category: 'decision-making',
        weight: 1.2,
        options: [
          {
            id: 'dmp-1',
            text: 'Consensus - everyone must agree',
            value: 'consensus'
          },
          {
            id: 'dmp-2',
            text: 'Majority vote',
            value: 'majority'
          },
          {
            id: 'dmp-3',
            text: 'Leader decides after input',
            value: 'leader_decides'
          },
          {
            id: 'dmp-4',
            text: 'Expert decides in their domain',
            value: 'expert_decides'
          },
          {
            id: 'dmp-5',
            text: 'Autonomous - each person decides their area',
            value: 'autonomous'
          }
        ]
      },
      {
        id: 'team-culture',
        type: 'multiple-choice',
        text: 'What type of team culture do you want to create?',
        required: true,
        category: 'culture',
        weight: 1.1,
        options: [
          {
            id: 'tc-1',
            text: 'High performance - focus on results and excellence',
            value: 'high_performance'
          },
          {
            id: 'tc-2',
            text: 'Collaborative - emphasis on teamwork and support',
            value: 'collaborative'
          },
          {
            id: 'tc-3',
            text: 'Innovative - encourage creativity and experimentation',
            value: 'innovative'
          },
          {
            id: 'tc-4',
            text: 'Learning - focus on growth and development',
            value: 'learning'
          },
          {
            id: 'tc-5',
            text: 'Balanced - mix of performance and wellbeing',
            value: 'balanced'
          }
        ]
      },
      {
        id: 'current-challenges',
        type: 'text',
        text: 'What are the biggest challenges you face with your current team?',
        description: 'Describe specific issues or problems you\'re trying to solve',
        required: true,
        category: 'challenges',
        weight: 1.3,
        placeholder: 'Example: Communication gaps, skill gaps, personality conflicts, unclear roles'
      },
      {
        id: 'success-metrics',
        type: 'text',
        text: 'How will you measure the success of your team?',
        description: 'What specific outcomes or metrics matter most?',
        required: true,
        category: 'success',
        weight: 1.4,
        placeholder: 'Example: Project completion, customer satisfaction, team engagement, revenue growth'
      },
      {
        id: 'resource-constraints',
        type: 'multiple-choice',
        text: 'What are your main constraints when building this team?',
        required: true,
        category: 'constraints',
        weight: 1.0,
        options: [
          {
            id: 'rc-1',
            text: 'Budget limitations',
            value: 'budget'
          },
          {
            id: 'rc-2',
            text: 'Time constraints',
            value: 'time'
          },
          {
            id: 'rc-3',
            text: 'Limited talent pool',
            value: 'talent_pool'
          },
          {
            id: 'rc-4',
            text: 'Organizational politics',
            value: 'politics'
          },
          {
            id: 'rc-5',
            text: 'No major constraints',
            value: 'none'
          }
        ]
      },
      {
        id: 'team-development',
        type: 'multiple-choice',
        text: 'How do you plan to develop your team members?',
        required: true,
        category: 'development',
        weight: 1.1,
        options: [
          {
            id: 'td-1',
            text: 'Formal training and education programs',
            value: 'formal_training'
          },
          {
            id: 'td-2',
            text: 'On-the-job learning and mentoring',
            value: 'on_job_learning'
          },
          {
            id: 'td-3',
            text: 'Cross-training and skill rotation',
            value: 'cross_training'
          },
          {
            id: 'td-4',
            text: 'External coaching and consulting',
            value: 'external_coaching'
          },
          {
            id: 'td-5',
            text: 'Self-directed learning and development',
            value: 'self_directed'
          }
        ]
      },
      {
        id: 'team-timeline',
        type: 'multiple-choice',
        text: 'What is your timeline for building this team?',
        required: true,
        category: 'timeline',
        weight: 0.9,
        options: [
          {
            id: 'tt-1',
            text: 'Immediate - need to start right away',
            value: 'immediate'
          },
          {
            id: 'tt-2',
            text: 'Short-term - within the next month',
            value: 'short_term'
          },
          {
            id: 'tt-3',
            text: 'Medium-term - within 3-6 months',
            value: 'medium_term'
          },
          {
            id: 'tt-4',
            text: 'Long-term - 6+ months to build',
            value: 'long_term'
          }
        ]
      },
      {
        id: 'ideal-outcome',
        type: 'text',
        text: 'What would an ideal team look like for your situation?',
        description: 'Describe your vision of the perfect team for your needs',
        required: true,
        category: 'outcome',
        weight: 1.5,
        placeholder: 'Example: A team that communicates effectively, delivers high-quality results, and enjoys working together'
      }
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