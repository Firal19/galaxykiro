"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, LightbulbIcon, BarChart3 } from 'lucide-react'

export function LeadershipStyleProfiler() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'leadership-style-profiler',
    title: 'Leadership Style Profiler',
    description: 'Discover your natural leadership style and strengths',
    questions: [
      {
        id: 'decision-1',
        type: 'multiple-choice',
        text: 'When making important decisions, I typically:',
        required: true,
        category: 'decision-making',
        weight: 1.5,
        options: [
          {
            id: 'd1-1',
            text: 'Make decisions quickly based on my experience and intuition',
            value: 'directive'
          },
          {
            id: 'd1-2',
            text: 'Gather input from others but ultimately make the final decision myself',
            value: 'participative'
          },
          {
            id: 'd1-3',
            text: 'Facilitate a collaborative process where we reach consensus as a group',
            value: 'collaborative'
          },
          {
            id: 'd1-4',
            text: 'Provide a framework but delegate the decision to those closest to the issue',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'decision-2',
        type: 'multiple-choice',
        text: 'When a team member disagrees with my approach, I typically:',
        required: true,
        category: 'decision-making',
        weight: 1.3,
        options: [
          {
            id: 'd2-1',
            text: 'Explain my reasoning and maintain my original direction',
            value: 'directive'
          },
          {
            id: 'd2-2',
            text: 'Listen to their perspective and potentially adjust my approach',
            value: 'participative'
          },
          {
            id: 'd2-3',
            text: 'Open the discussion to the whole team to find the best solution',
            value: 'collaborative'
          },
          {
            id: 'd2-4',
            text: 'Ask them to propose and implement their alternative approach',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'communication-1',
        type: 'multiple-choice',
        text: 'My preferred communication style is:',
        required: true,
        category: 'communication',
        weight: 1.4,
        options: [
          {
            id: 'c1-1',
            text: 'Direct, clear, and to the point',
            value: 'directive'
          },
          {
            id: 'c1-2',
            text: 'Informative with opportunities for questions and discussion',
            value: 'participative'
          },
          {
            id: 'c1-3',
            text: 'Open-ended and focused on generating dialogue',
            value: 'collaborative'
          },
          {
            id: 'c1-4',
            text: 'Supportive and focused on empowering others to communicate',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'communication-2',
        type: 'multiple-choice',
        text: 'When sharing information with a team, I prefer to:',
        required: true,
        category: 'communication',
        weight: 1.2,
        options: [
          {
            id: 'c2-1',
            text: 'Provide clear instructions and expectations',
            value: 'directive'
          },
          {
            id: 'c2-2',
            text: 'Share context and rationale behind decisions',
            value: 'participative'
          },
          {
            id: 'c2-3',
            text: 'Create an environment where everyone shares their perspectives',
            value: 'collaborative'
          },
          {
            id: 'c2-4',
            text: 'Ensure everyone has access to information they need to work independently',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'motivation-1',
        type: 'multiple-choice',
        text: 'I believe people are most motivated by:',
        required: true,
        category: 'motivation',
        weight: 1.5,
        options: [
          {
            id: 'm1-1',
            text: 'Clear goals, accountability, and recognition for results',
            value: 'directive'
          },
          {
            id: 'm1-2',
            text: 'Being involved in decisions and having their input valued',
            value: 'participative'
          },
          {
            id: 'm1-3',
            text: 'Working together toward a shared vision and purpose',
            value: 'collaborative'
          },
          {
            id: 'm1-4',
            text: 'Autonomy and the freedom to approach work in their own way',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'motivation-2',
        type: 'multiple-choice',
        text: 'When someone on my team is underperforming, I typically:',
        required: true,
        category: 'motivation',
        weight: 1.3,
        options: [
          {
            id: 'm2-1',
            text: 'Clearly communicate expectations and consequences',
            value: 'directive'
          },
          {
            id: 'm2-2',
            text: 'Have a conversation to understand their challenges and offer support',
            value: 'participative'
          },
          {
            id: 'm2-3',
            text: 'Bring the team together to help solve the problem collectively',
            value: 'collaborative'
          },
          {
            id: 'm2-4',
            text: 'Adjust their responsibilities to better match their strengths',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'conflict-1',
        type: 'multiple-choice',
        text: 'When conflict arises in a team, I typically:',
        required: true,
        category: 'conflict-resolution',
        weight: 1.4,
        options: [
          {
            id: 'cf1-1',
            text: 'Address it quickly and decisively to maintain focus',
            value: 'directive'
          },
          {
            id: 'cf1-2',
            text: 'Facilitate a discussion between the involved parties to find resolution',
            value: 'participative'
          },
          {
            id: 'cf1-3',
            text: 'Bring everyone together to work through the issue as a group',
            value: 'collaborative'
          },
          {
            id: 'cf1-4',
            text: 'Encourage those involved to work it out themselves first',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'conflict-2',
        type: 'multiple-choice',
        text: 'When someone challenges my ideas or decisions, I typically:',
        required: true,
        category: 'conflict-resolution',
        weight: 1.2,
        options: [
          {
            id: 'cf2-1',
            text: 'Defend my position with facts and logical arguments',
            value: 'directive'
          },
          {
            id: 'cf2-2',
            text: 'Listen to understand their perspective and find middle ground',
            value: 'participative'
          },
          {
            id: 'cf2-3',
            text: 'Welcome the diversity of thought and explore multiple viewpoints',
            value: 'collaborative'
          },
          {
            id: 'cf2-4',
            text: 'Consider their input and encourage them to develop alternative solutions',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'development-1',
        type: 'multiple-choice',
        text: 'When developing team members, I focus most on:',
        required: true,
        category: 'development',
        weight: 1.5,
        options: [
          {
            id: 'dv1-1',
            text: 'Setting challenging goals and providing direct feedback',
            value: 'directive'
          },
          {
            id: 'dv1-2',
            text: 'Coaching and mentoring through regular one-on-one conversations',
            value: 'participative'
          },
          {
            id: 'dv1-3',
            text: 'Creating learning opportunities through team collaboration',
            value: 'collaborative'
          },
          {
            id: 'dv1-4',
            text: 'Providing resources and opportunities for self-directed growth',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'development-2',
        type: 'multiple-choice',
        text: 'I believe the best way to help someone improve is to:',
        required: true,
        category: 'development',
        weight: 1.3,
        options: [
          {
            id: 'dv2-1',
            text: 'Provide clear, direct feedback about what needs to change',
            value: 'directive'
          },
          {
            id: 'dv2-2',
            text: 'Ask questions that help them reflect and discover insights',
            value: 'participative'
          },
          {
            id: 'dv2-3',
            text: 'Create opportunities for peer learning and feedback',
            value: 'collaborative'
          },
          {
            id: 'dv2-4',
            text: 'Give them challenging assignments that stretch their capabilities',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'change-1',
        type: 'multiple-choice',
        text: 'When implementing change, I typically:',
        required: true,
        category: 'change-management',
        weight: 1.4,
        options: [
          {
            id: 'ch1-1',
            text: 'Create a clear plan and timeline, then drive execution',
            value: 'directive'
          },
          {
            id: 'ch1-2',
            text: 'Explain the rationale and gather input before finalizing the approach',
            value: 'participative'
          },
          {
            id: 'ch1-3',
            text: 'Involve the team in co-creating the change process',
            value: 'collaborative'
          },
          {
            id: 'ch1-4',
            text: 'Set the direction but let individuals and teams determine how to adapt',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'change-2',
        type: 'multiple-choice',
        text: 'When facing resistance to change, I typically:',
        required: true,
        category: 'change-management',
        weight: 1.2,
        options: [
          {
            id: 'ch2-1',
            text: 'Emphasize the importance and benefits of moving forward',
            value: 'directive'
          },
          {
            id: 'ch2-2',
            text: 'Listen to concerns and address them individually',
            value: 'participative'
          },
          {
            id: 'ch2-3',
            text: 'Create forums for open discussion about concerns and solutions',
            value: 'collaborative'
          },
          {
            id: 'ch2-4',
            text: 'Allow people time and space to adapt at their own pace',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'situational-1',
        type: 'multiple-choice',
        text: 'In a crisis or emergency situation, I would most likely:',
        required: true,
        category: 'situational',
        weight: 1.3,
        options: [
          {
            id: 's1-1',
            text: 'Take charge immediately and give clear directions',
            value: 'directive'
          },
          {
            id: 's1-2',
            text: 'Quickly consult key people before making decisions',
            value: 'participative'
          },
          {
            id: 's1-3',
            text: 'Bring the team together to develop a response plan',
            value: 'collaborative'
          },
          {
            id: 's1-4',
            text: 'Empower those with the most relevant expertise to lead',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'situational-2',
        type: 'multiple-choice',
        text: 'When working with a highly experienced and skilled team, I would most likely:',
        required: true,
        category: 'situational',
        weight: 1.3,
        options: [
          {
            id: 's2-1',
            text: 'Set clear expectations and monitor progress closely',
            value: 'directive'
          },
          {
            id: 's2-2',
            text: 'Provide direction but regularly seek their input and ideas',
            value: 'participative'
          },
          {
            id: 's2-3',
            text: 'Focus on building team cohesion and collaborative processes',
            value: 'collaborative'
          },
          {
            id: 's2-4',
            text: 'Give them significant autonomy and focus on removing obstacles',
            value: 'delegative'
          }
        ]
      },
      {
        id: 'strengths-1',
        type: 'text',
        text: 'What do you consider to be your greatest strengths as a leader?',
        required: false,
        category: 'reflection',
        weight: 1.0,
        placeholder: 'Describe your leadership strengths...'
      },
      {
        id: 'challenges-1',
        type: 'text',
        text: 'What aspects of leadership do you find most challenging?',
        required: false,
        category: 'reflection',
        weight: 1.0,
        placeholder: 'Describe your leadership challenges...'
      }
    ],
    scoringConfig: {
      type: 'custom',
      customScoring: (responses, questions) => {
        // Initialize style counters
        const styles = {
          directive: 0,
          participative: 0,
          collaborative: 0,
          delegative: 0
        }
        
        // Count responses for each style
        responses.forEach(response => {
          const question = questions.find(q => q.id === response.questionId)
          if (question && question.type === 'multiple-choice' && typeof response.answer === 'string') {
            if (response.answer in styles) {
              styles[response.answer as keyof typeof styles] += 1
            }
          }
        })
        
        // Calculate percentages
        const total = Object.values(styles).reduce((sum, count) => sum + count, 0)
        const percentages = {
          directive: Math.round((styles.directive / total) * 100),
          participative: Math.round((styles.participative / total) * 100),
          collaborative: Math.round((styles.collaborative / total) * 100),
          delegative: Math.round((styles.delegative / total) * 100)
        }
        
        // Determine primary and secondary styles
        const sortedStyles = Object.entries(percentages)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0])
        
        const primaryStyle = sortedStyles[0]
        const secondaryStyle = sortedStyles[1]
        
        // Generate insights based on style combination
        const insights = generateInsights(primaryStyle, secondaryStyle)
        
        // Calculate overall score (not really meaningful for this assessment)
        // but needed for the interface
        const total_score = 100
        
        return {
          total: total_score,
          percentage: 100,
          breakdown: {
            directive: styles.directive,
            participative: styles.participative,
            collaborative: styles.collaborative,
            delegative: styles.delegative
          },
          categoryScores: {
            'leadership-styles': {
              score: total_score,
              percentage: 100,
              maxPossible: 100
            }
          },
          tier: {
            label: `${capitalizeFirstLetter(primaryStyle)}-${capitalizeFirstLetter(secondaryStyle)} Leader`,
            description: insights.description,
            insights: insights.strengths,
            recommendations: insights.development
          }
        }
        
        // Helper function to generate insights based on style combination
        function generateInsights(primary: string, secondary: string) {
          const insights = {
            description: '',
            strengths: [] as string[],
            development: [] as string[]
          }
          
          // Set description based on primary style
          if (primary === 'directive') {
            insights.description = 'You have a decisive, action-oriented leadership style focused on clarity and results.'
          } else if (primary === 'participative') {
            insights.description = 'You have an engaging, supportive leadership style that values input while providing direction.'
          } else if (primary === 'collaborative') {
            insights.description = 'You have an inclusive, team-centered leadership style that emphasizes shared ownership and consensus.'
          } else if (primary === 'delegative') {
            insights.description = 'You have an empowering, trust-based leadership style that focuses on autonomy and development.'
          }
          
          // Set strengths based on primary-secondary combination
          if (primary === 'directive') {
            insights.strengths = [
              'You excel at making timely decisions and driving results',
              'You provide clear direction and expectations',
              'You\'re effective in crisis situations requiring quick action'
            ]
            
            if (secondary === 'participative') {
              insights.strengths.push('You balance decisiveness with consideration of others' input')
            } else if (secondary === 'collaborative') {
              insights.strengths.push('You can shift between taking charge and fostering team problem-solving')
            } else if (secondary === 'delegative') {
              insights.strengths.push('You combine clear direction with appropriate delegation')
            }
          } else if (primary === 'participative') {
            insights.strengths = [
              'You excel at engaging others while maintaining direction',
              'You build strong individual relationships and trust',
              'You're skilled at coaching and developing others'
            ]
            
            if (secondary === 'directive') {
              insights.strengths.push('You can be decisive when needed while still valuing input')
            } else if (secondary === 'collaborative') {
              insights.strengths.push('You balance individual coaching with team cohesion')
            } else if (secondary === 'delegative') {
              insights.strengths.push('You provide support while encouraging independence')
            }
          } else if (primary === 'collaborative') {
            insights.strengths = [
              'You excel at building team cohesion and shared ownership',
              'You leverage collective intelligence effectively',
              'You create inclusive environments where diverse perspectives thrive'
            ]
            
            if (secondary === 'directive') {
              insights.strengths.push('You can provide direction when consensus isn't possible')
            } else if (secondary === 'participative') {
              insights.strengths.push('You balance team processes with individual needs')
            } else if (secondary === 'delegative') {
              insights.strengths.push('You foster team problem-solving while respecting autonomy')
            }
          } else if (primary === 'delegative') {
            insights.strengths = [
              'You excel at empowering others and building capability',
              'You create high-trust environments that foster innovation',
              'You focus on outcomes rather than controlling processes'
            ]
            
            if (secondary === 'directive') {
              insights.strengths.push('You provide clear frameworks within which others can operate independently')
            } else if (secondary === 'participative') {
              insights.strengths.push('You balance autonomy with appropriate support and guidance')
            } else if (secondary === 'collaborative') {
              insights.strengths.push('You create self-managing teams with strong collaboration')
            }
          }
          
          // Set development recommendations based on primary style
          if (primary === 'directive') {
            insights.development = [
              'Practice active listening without immediately jumping to solutions',
              'Experiment with asking more questions before providing direction',
              'Consider when team involvement might lead to better outcomes or buy-in',
              'Be mindful of how your decisive style might inhibit others' input'
            ]
          } else if (primary === 'participative') {
            insights.development = [
              'Practice making decisions more quickly when appropriate',
              'Be mindful of when seeking input might delay necessary action',
              'Consider when full team collaboration might be more effective than individual conversations',
              'Develop comfort with giving direct feedback when needed'
            ]
          } else if (primary === 'collaborative') {
            insights.development = [
              'Recognize situations where quick decisions are needed over consensus',
              'Be mindful of when collaboration might be inefficient for simple decisions',
              'Develop strategies for moving forward when consensus isn't possible',
              'Practice giving individual attention and feedback'
            ]
          } else if (primary === 'delegative') {
            insights.development = [
              'Ensure you're providing enough clarity and context for success',
              'Recognize when team members need more guidance or support',
              'Develop systems to maintain appropriate oversight without micromanaging',
              'Practice more direct involvement when team members are struggling'
            ]
          }
          
          return insights
        }
        
        function capitalizeFirstLetter(string: string) {
          return string.charAt(0).toUpperCase() + string.slice(1)
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
            <Users className="h-6 w-6 text-primary" />
            Leadership Style Profiler
          </CardTitle>
          <CardDescription>
            Discover your natural leadership style and learn how to leverage your strengths effectively.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Identify Your Style</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover your unique leadership approach across key dimensions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Understand Your Impact</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn how your style affects team dynamics and outcomes
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <LightbulbIcon className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Enhance Your Effectiveness</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get personalized strategies to leverage strengths and address blind spots
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your primary and secondary leadership styles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>How your style varies across different leadership dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your key leadership strengths and potential blind spots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized development strategies to enhance your leadership effectiveness</span>
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
      toolId="leadership-style-profiler"
      title="Leadership Style Profiler"
      description="Discover your natural leadership style and strengths"
      config={config}
      leadCaptureLevel={3}
      showSharing={true}
    />
  )
}