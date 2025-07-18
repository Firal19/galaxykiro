"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare, Brain, Lightbulb } from 'lucide-react'

export function InnerDialogueDecoder() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'inner-dialogue-decoder',
    title: 'Inner Dialogue Decoder',
    description: 'Identify patterns in your self-talk and mental narratives',
    questions: [
      {
        id: 'situation-1',
        type: 'text',
        text: 'Describe a recent challenging situation where your inner dialogue was particularly active:',
        description: 'This could be a difficult conversation, a setback, or a stressful event',
        required: true,
        category: 'situation',
        weight: 1.0,
        placeholder: 'Describe the situation in detail...',
        maxLength: 500
      },
      {
        id: 'thoughts-1',
        type: 'text',
        text: 'What thoughts went through your mind during this situation?',
        description: 'Try to recall your exact inner dialogue, word for word if possible',
        required: true,
        category: 'thoughts',
        weight: 1.5,
        placeholder: 'Write down your thoughts as they occurred...',
        maxLength: 500
      },
      {
        id: 'emotions-1',
        type: 'multiple-choice',
        text: 'Which emotions did you experience during this situation? (Select all that apply)',
        required: true,
        category: 'emotions',
        weight: 1.3,
        allowMultiple: true,
        options: [
          {
            id: 'e1-1',
            text: 'Anxiety/Fear',
            value: 'anxiety'
          },
          {
            id: 'e1-2',
            text: 'Frustration/Anger',
            value: 'anger'
          },
          {
            id: 'e1-3',
            text: 'Sadness/Disappointment',
            value: 'sadness'
          },
          {
            id: 'e1-4',
            text: 'Shame/Embarrassment',
            value: 'shame'
          },
          {
            id: 'e1-5',
            text: 'Inadequacy/Insecurity',
            value: 'inadequacy'
          },
          {
            id: 'e1-6',
            text: 'Overwhelm/Stress',
            value: 'overwhelm'
          },
          {
            id: 'e1-7',
            text: 'Confusion/Uncertainty',
            value: 'confusion'
          },
          {
            id: 'e1-8',
            text: 'Hope/Optimism',
            value: 'hope'
          },
          {
            id: 'e1-9',
            text: 'Confidence/Determination',
            value: 'confidence'
          },
          {
            id: 'e1-10',
            text: 'Calm/Peace',
            value: 'calm'
          }
        ]
      },
      {
        id: 'intensity-1',
        type: 'scale',
        text: 'How intense were these emotions?',
        required: true,
        category: 'emotions',
        weight: 1.2,
        min: 1,
        max: 10,
        labels: {
          min: 'Mild',
          max: 'Extremely Intense'
        }
      },
      {
        id: 'pattern-1',
        type: 'multiple-choice',
        text: 'Which of these thought patterns do you recognize in your inner dialogue? (Select all that apply)',
        required: true,
        category: 'patterns',
        weight: 1.6,
        allowMultiple: true,
        options: [
          {
            id: 'p1-1',
            text: 'All-or-Nothing Thinking (seeing things in black and white categories)',
            value: 'all-or-nothing'
          },
          {
            id: 'p1-2',
            text: 'Overgeneralization (viewing a single negative event as a never-ending pattern)',
            value: 'overgeneralization'
          },
          {
            id: 'p1-3',
            text: 'Mental Filter (dwelling on negatives while filtering out positives)',
            value: 'mental-filter'
          },
          {
            id: 'p1-4',
            text: 'Discounting Positives (rejecting positive experiences as not counting)',
            value: 'discounting-positives'
          },
          {
            id: 'p1-5',
            text: 'Jumping to Conclusions (mind reading or fortune telling without evidence)',
            value: 'jumping-to-conclusions'
          },
          {
            id: 'p1-6',
            text: 'Magnification/Minimization (exaggerating negatives or minimizing positives)',
            value: 'magnification'
          },
          {
            id: 'p1-7',
            text: 'Emotional Reasoning (believing something must be true because it "feels" true)',
            value: 'emotional-reasoning'
          },
          {
            id: 'p1-8',
            text: 'Should Statements (criticizing yourself or others with "shoulds" and "musts")',
            value: 'should-statements'
          },
          {
            id: 'p1-9',
            text: 'Labeling (attaching global labels to yourself or others instead of describing behavior)',
            value: 'labeling'
          },
          {
            id: 'p1-10',
            text: 'Personalization (seeing yourself as the cause of external events)',
            value: 'personalization'
          }
        ]
      },
      {
        id: 'frequency-1',
        type: 'multiple-choice',
        text: 'How often do you experience similar thought patterns?',
        required: true,
        category: 'patterns',
        weight: 1.4,
        options: [
          {
            id: 'f1-1',
            text: 'Rarely (a few times a month or less)',
            value: 1,
            score: 10
          },
          {
            id: 'f1-2',
            text: 'Sometimes (a few times a week)',
            value: 2,
            score: 7
          },
          {
            id: 'f1-3',
            text: 'Often (daily)',
            value: 3,
            score: 4
          },
          {
            id: 'f1-4',
            text: 'Very frequently (multiple times per day)',
            value: 4,
            score: 1
          }
        ]
      },
      {
        id: 'impact-1',
        type: 'scale',
        text: 'How much do these thought patterns impact your decisions and actions?',
        required: true,
        category: 'impact',
        weight: 1.5,
        min: 1,
        max: 10,
        labels: {
          min: 'Minimal Impact',
          max: 'Significant Impact'
        }
      },
      {
        id: 'impact-2',
        type: 'text',
        text: 'How did your inner dialogue influence your actions in this situation?',
        required: false,
        category: 'impact',
        weight: 1.3,
        placeholder: 'Describe how your thoughts affected what you did or did not do...'
      },
      {
        id: 'awareness-1',
        type: 'scale',
        text: 'How aware are you typically of your inner dialogue as it happens?',
        required: true,
        category: 'awareness',
        weight: 1.4,
        min: 1,
        max: 10,
        labels: {
          min: 'Rarely Aware',
          max: 'Highly Aware'
        }
      },
      {
        id: 'challenge-1',
        type: 'multiple-choice',
        text: 'How often do you question or challenge your negative inner dialogue?',
        required: true,
        category: 'challenge',
        weight: 1.5,
        options: [
          {
            id: 'c1-1',
            text: 'Rarely or never',
            value: 1,
            score: 1
          },
          {
            id: 'c1-2',
            text: 'Sometimes, but not consistently',
            value: 2,
            score: 4
          },
          {
            id: 'c1-3',
            text: 'Often, for major issues',
            value: 3,
            score: 7
          },
          {
            id: 'c1-4',
            text: 'Regularly and systematically',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'alternative-1',
        type: 'text',
        text: 'What might be a more balanced or helpful way to think about the situation you described?',
        required: false,
        category: 'alternative',
        weight: 1.4,
        placeholder: 'Write a more balanced perspective...'
      },
      {
        id: 'triggers-1',
        type: 'multiple-choice',
        text: 'Which situations tend to trigger your most negative inner dialogue? (Select all that apply)',
        required: true,
        category: 'triggers',
        weight: 1.3,
        allowMultiple: true,
        options: [
          {
            id: 't1-1',
            text: 'Work/career challenges',
            value: 'work'
          },
          {
            id: 't1-2',
            text: 'Relationship conflicts',
            value: 'relationships'
          },
          {
            id: 't1-3',
            text: 'Social situations',
            value: 'social'
          },
          {
            id: 't1-4',
            text: 'Performance evaluation/feedback',
            value: 'evaluation'
          },
          {
            id: 't1-5',
            text: 'Making mistakes',
            value: 'mistakes'
          },
          {
            id: 't1-6',
            text: 'Uncertainty or change',
            value: 'uncertainty'
          },
          {
            id: 't1-7',
            text: 'Comparison to others',
            value: 'comparison'
          },
          {
            id: 't1-8',
            text: 'Personal appearance/body image',
            value: 'appearance'
          },
          {
            id: 't1-9',
            text: 'Financial concerns',
            value: 'financial'
          },
          {
            id: 't1-10',
            text: 'Health issues',
            value: 'health'
          }
        ]
      },
      {
        id: 'childhood-1',
        type: 'text',
        text: 'Can you identify any origins of your inner dialogue patterns (e.g., childhood messages, past experiences)?',
        required: false,
        category: 'origins',
        weight: 1.2,
        placeholder: 'Reflect on possible origins of your thought patterns...'
      }
    ],
    scoringConfig: {
      type: 'category-based',
      categories: [
        {
          id: 'pattern-awareness',
          name: 'Pattern Awareness',
          weight: 1.6,
          questions: ['pattern-1', 'frequency-1']
        },
        {
          id: 'emotional-impact',
          name: 'Emotional Impact',
          weight: 1.5,
          questions: ['emotions-1', 'intensity-1', 'impact-1']
        },
        {
          id: 'self-regulation',
          name: 'Self-Regulation',
          weight: 1.5,
          questions: ['awareness-1', 'challenge-1']
        },
        {
          id: 'cognitive-flexibility',
          name: 'Cognitive Flexibility',
          weight: 1.4,
          questions: ['alternative-1']
        },
        {
          id: 'trigger-awareness',
          name: 'Trigger Awareness',
          weight: 1.3,
          questions: ['triggers-1']
        }
      ],
      resultTiers: [
        {
          min: 0,
          max: 40,
          label: 'Dialogue Discoverer',
          description: 'You are in the early stages of understanding your inner dialogue patterns.',
          insights: [
            'Your awareness of your thought patterns is developing',
            'Your inner dialogue may significantly influence your emotions and actions',
            'You may not regularly question or challenge negative thought patterns'
          ],
          recommendations: [
            'Practice daily thought journaling to increase awareness',
            'Learn to identify common cognitive distortions in your thinking',
            'Begin pausing before reacting to strong emotions',
            'Consider working with a therapist or coach on cognitive behavioral techniques',
            'Read "Feeling Good" by David Burns to understand thought patterns'
          ]
        },
        {
          min: 41,
          max: 70,
          label: 'Dialogue Developer',
          description: 'You have moderate awareness and some ability to manage your inner dialogue.',
          insights: [
            'You recognize several patterns in your thinking',
            'You sometimes challenge unhelpful thoughts',
            'You have developing awareness of how thoughts affect your emotions and actions'
          ],
          recommendations: [
            'Practice cognitive restructuring for your most common thought distortions',
            'Develop specific counter-statements for recurring negative thoughts',
            'Implement a "thought check" practice during trigger situations',
            'Create environmental reminders to pause and examine your thinking',
            'Consider mindfulness meditation to increase thought awareness'
          ]
        },
        {
          min: 71,
          max: 100,
          label: 'Dialogue Director',
          description: 'You have strong awareness and ability to direct your inner dialogue.',
          insights: [
            'You have good awareness of your thought patterns as they occur',
            'You regularly question and challenge unhelpful thinking',
            'You can often shift to more balanced perspectives'
          ],
          recommendations: [
            'Develop advanced cognitive flexibility through perspective-taking exercises',
            'Create a personal system for quickly reframing negative thought patterns',
            'Practice compassionate self-talk during challenging situations',
            'Share your techniques with others who might benefit',
            'Consider advanced mindfulness practices to further refine your awareness'
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
            <MessageSquare className="h-6 w-6 text-primary" />
            Inner Dialogue Decoder
          </CardTitle>
          <CardDescription>
            Identify patterns in your self-talk and learn to transform limiting mental narratives.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Decode Your Self-Talk</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Identify patterns in your inner dialogue and thought habits
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Understand Thought Impact</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Discover how your thoughts shape your emotions and actions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Transform Your Thinking</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Learn techniques to shift from limiting to empowering thoughts
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Discover:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your dominant thought patterns and cognitive distortions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>How your inner dialogue affects your emotions and decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Your key thought triggers and emotional patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Personalized strategies to transform limiting thought patterns</span>
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
      toolId="inner-dialogue-decoder"
      title="Inner Dialogue Decoder"
      description="Identify patterns in your self-talk and mental narratives"
      config={config}
      leadCaptureLevel={1}
      showSharing={true}
    />
  )
}