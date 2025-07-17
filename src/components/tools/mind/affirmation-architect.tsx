"use client"

import { useState } from 'react'
import { AssessmentTool } from '@/components/assessment/assessment-tool'
import { AssessmentConfig } from '@/lib/assessment-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, MessageSquare, Target } from 'lucide-react'

export function AffirmationArchitect() {
  const [started, setStarted] = useState(false)
  
  // Assessment configuration
  const config: AssessmentConfig = {
    id: 'affirmation-architect',
    title: 'Affirmation Architect',
    description: 'Create personalized affirmations based on your specific goals',
    questions: [
      {
        id: 'goal-area',
        type: 'multiple-choice',
        text: 'Which area would you like to create affirmations for?',
        required: true,
        category: 'goal-area',
        weight: 1.0,
        options: [
          {
            id: 'ga-1',
            text: 'Career/Professional Growth',
            value: 'career'
          },
          {
            id: 'ga-2',
            text: 'Health & Fitness',
            value: 'health'
          },
          {
            id: 'ga-3',
            text: 'Relationships',
            value: 'relationships'
          },
          {
            id: 'ga-4',
            text: 'Self-Confidence',
            value: 'confidence'
          },
          {
            id: 'ga-5',
            text: 'Wealth & Abundance',
            value: 'wealth'
          },
          {
            id: 'ga-6',
            text: 'Personal Growth',
            value: 'growth'
          },
          {
            id: 'ga-7',
            text: 'Creativity',
            value: 'creativity'
          },
          {
            id: 'ga-8',
            text: 'Other (you'll specify later)',
            value: 'other'
          }
        ]
      },
      {
        id: 'specific-goal',
        type: 'text',
        text: 'What specific goal are you working toward in this area?',
        description: 'Be as specific as possible about what you want to achieve',
        required: true,
        category: 'goal-details',
        weight: 1.0,
        placeholder: 'Example: Getting promoted to senior manager, losing 20 pounds, etc.'
      },
      {
        id: 'current-beliefs-1',
        type: 'multiple-choice',
        text: 'Which of these statements best describes your current beliefs about achieving this goal?',
        required: true,
        category: 'current-beliefs',
        weight: 1.5,
        options: [
          {
            id: 'cb1-1',
            text: 'I doubt I can achieve this goal',
            value: 1,
            score: 1
          },
          {
            id: 'cb1-2',
            text: 'I'm uncertain if I can achieve this goal',
            value: 2,
            score: 3
          },
          {
            id: 'cb1-3',
            text: 'I believe I can achieve this goal with effort',
            value: 3,
            score: 7
          },
          {
            id: 'cb1-4',
            text: 'I'm confident I will achieve this goal',
            value: 4,
            score: 10
          }
        ]
      },
      {
        id: 'limiting-beliefs',
        type: 'text',
        text: 'What doubts, fears, or limiting beliefs do you have about achieving this goal?',
        description: 'Be honest about your inner concerns',
        required: true,
        category: 'current-beliefs',
        weight: 1.4,
        placeholder: 'Example: I'm not smart enough, I don't have enough time, etc.'
      },
      {
        id: 'strengths',
        type: 'text',
        text: 'What personal strengths, skills, or qualities will help you achieve this goal?',
        required: true,
        category: 'strengths',
        weight: 1.3,
        placeholder: 'List your relevant strengths and qualities...'
      },
      {
        id: 'ideal-identity',
        type: 'text',
        text: 'Describe the type of person you need to become to achieve this goal:',
        description: 'Focus on identity and character traits rather than outcomes',
        required: true,
        category: 'identity',
        weight: 1.6,
        placeholder: 'Example: I am someone who consistently prioritizes health, etc.'
      },
      {
        id: 'affirmation-style',
        type: 'multiple-choice',
        text: 'Which affirmation style resonates with you most?',
        required: true,
        category: 'preferences',
        weight: 1.2,
        options: [
          {
            id: 'as-1',
            text: 'Present tense statements ("I am...")',
            value: 'present'
          },
          {
            id: 'as-2',
            text: 'Process-focused statements ("I am becoming...")',
            value: 'process'
          },
          {
            id: 'as-3',
            text: 'Question-based affirmations ("Why am I so...?")',
            value: 'question'
          },
          {
            id: 'as-4',
            text: 'Gratitude-based affirmations ("I am grateful for...")',
            value: 'gratitude'
          }
        ]
      },
      {
        id: 'affirmation-length',
        type: 'multiple-choice',
        text: 'Do you prefer shorter or longer affirmations?',
        required: true,
        category: 'preferences',
        weight: 1.1,
        options: [
          {
            id: 'al-1',
            text: 'Short and memorable (3-5 words)',
            value: 'short'
          },
          {
            id: 'al-2',
            text: 'Medium length (6-10 words)',
            value: 'medium'
          },
          {
            id: 'al-3',
            text: 'Detailed and specific (11+ words)',
            value: 'long'
          }
        ]
      },
      {
        id: 'emotion-words',
        type: 'text',
        text: 'List 3-5 emotion words you want to feel when achieving your goal:',
        required: true,
        category: 'emotions',
        weight: 1.3,
        placeholder: 'Example: confident, proud, energized, fulfilled, etc.'
      },
      {
        id: 'visualization',
        type: 'text',
        text: 'Briefly describe how you'll look, feel, and act when you've achieved this goal:',
        required: false,
        category: 'visualization',
        weight: 1.2,
        placeholder: 'Describe the future version of yourself who has achieved this goal...'
      },
      {
        id: 'obstacles',
        type: 'text',
        text: 'What obstacles or challenges might you face while pursuing this goal?',
        required: false,
        category: 'obstacles',
        weight: 1.2,
        placeholder: 'List potential obstacles or challenges...'
      },
      {
        id: 'affirmation-frequency',
        type: 'multiple-choice',
        text: 'How often are you willing to practice your affirmations?',
        required: true,
        category: 'implementation',
        weight: 1.4,
        options: [
          {
            id: 'af-1',
            text: 'Multiple times per day',
            value: 4,
            score: 10
          },
          {
            id: 'af-2',
            text: 'Once daily',
            value: 3,
            score: 7
          },
          {
            id: 'af-3',
            text: 'Several times per week',
            value: 2,
            score: 4
          },
          {
            id: 'af-4',
            text: 'Occasionally when I remember',
            value: 1,
            score: 1
          }
        ]
      },
      {
        id: 'preferred-method',
        type: 'multiple-choice',
        text: 'How would you prefer to practice your affirmations? (Select all that apply)',
        required: true,
        category: 'implementation',
        weight: 1.3,
        allowMultiple: true,
        options: [
          {
            id: 'pm-1',
            text: 'Speaking aloud in front of a mirror',
            value: 'mirror'
          },
          {
            id: 'pm-2',
            text: 'Writing in a journal',
            value: 'writing'
          },
          {
            id: 'pm-3',
            text: 'Recording and listening to audio',
            value: 'audio'
          },
          {
            id: 'pm-4',
            text: 'Reading from phone/computer reminders',
            value: 'digital'
          },
          {
            id: 'pm-5',
            text: 'Meditation or visualization practice',
            value: 'meditation'
          },
          {
            id: 'pm-6',
            text: 'Physical cards or visual reminders',
            value: 'cards'
          }
        ]
      },
      {
        id: 'reminder-times',
        type: 'multiple-choice',
        text: 'When would be the best times for you to practice affirmations? (Select all that apply)',
        required: true,
        category: 'implementation',
        weight: 1.2,
        allowMultiple: true,
        options: [
          {
            id: 'rt-1',
            text: 'First thing in the morning',
            value: 'morning'
          },
          {
            id: 'rt-2',
            text: 'During morning routine (shower, brushing teeth, etc.)',
            value: 'routine-am'
          },
          {
            id: 'rt-3',
            text: 'During commute/travel time',
            value: 'commute'
          },
          {
            id: 'rt-4',
            text: 'Lunch break',
            value: 'lunch'
          },
          {
            id: 'rt-5',
            text: 'Afternoon energy dip',
            value: 'afternoon'
          },
          {
            id: 'rt-6',
            text: 'Evening wind-down',
            value: 'evening'
          },
          {
            id: 'rt-7',
            text: 'Right before bed',
            value: 'bedtime'
          }
        ]
      }
    ],
    scoringConfig: {
      type: 'custom',
      customScoring: (responses, questions) => {
        // Extract key information from responses
        let goalArea = ''
        let specificGoal = ''
        let limitingBeliefs = ''
        let strengths = ''
        let idealIdentity = ''
        let affirmationStyle = ''
        let affirmationLength = ''
        let emotionWords = ''
        let beliefScore = 0
        let implementationScore = 0
        
        responses.forEach(response => {
          const question = questions.find(q => q.id === response.questionId)
          if (!question) return
          
          switch (question.id) {
            case 'goal-area':
              if (typeof response.answer === 'string') {
                goalArea = response.answer
              }
              break
            case 'specific-goal':
              if (typeof response.answer === 'string') {
                specificGoal = response.answer
              }
              break
            case 'limiting-beliefs':
              if (typeof response.answer === 'string') {
                limitingBeliefs = response.answer
              }
              break
            case 'strengths':
              if (typeof response.answer === 'string') {
                strengths = response.answer
              }
              break
            case 'ideal-identity':
              if (typeof response.answer === 'string') {
                idealIdentity = response.answer
              }
              break
            case 'affirmation-style':
              if (typeof response.answer === 'string') {
                affirmationStyle = response.answer
              }
              break
            case 'affirmation-length':
              if (typeof response.answer === 'string') {
                affirmationLength = response.answer
              }
              break
            case 'emotion-words':
              if (typeof response.answer === 'string') {
                emotionWords = response.answer
              }
              break
            case 'current-beliefs-1':
              if (typeof response.answer === 'number') {
                beliefScore = response.answer
              }
              break
            case 'affirmation-frequency':
              if (typeof response.answer === 'number') {
                implementationScore = response.answer
              }
              break
          }
        })
        
        // Generate personalized affirmations based on responses
        const affirmations = generateAffirmations(
          goalArea,
          specificGoal,
          limitingBeliefs,
          strengths,
          idealIdentity,
          affirmationStyle,
          affirmationLength,
          emotionWords
        )
        
        // Calculate overall score (belief + implementation plan)
        const totalScore = Math.min(100, ((beliefScore + implementationScore) / 8) * 100)
        
        // Determine tier based on belief score and implementation plan
        let tier
        if (beliefScore >= 3 && implementationScore >= 3) {
          tier = {
            label: 'Affirmation Master',
            description: 'You have strong belief and a solid implementation plan.',
            insights: [
              'Your belief in your goal provides a strong foundation',
              'Your implementation plan will support consistent practice',
              'Your personalized affirmations align well with your goals and identity'
            ],
            recommendations: [
              'Practice your affirmations using your preferred methods and times',
              'Track your progress and notice how your beliefs shift over time',
              'Update your affirmations as you make progress toward your goal',
              'Consider creating affirmations for other life areas using this approach'
            ]
          }
        } else if (beliefScore >= 2 || implementationScore >= 2) {
          tier = {
            label: 'Affirmation Practitioner',
            description: 'You have moderate belief and a developing implementation plan.',
            insights: [
              'Your belief in your goal is developing',
              'Your implementation plan has some solid elements',
              'Consistent practice will help strengthen your belief'
            ],
            recommendations: [
              'Start with the affirmations that feel most believable to you',
              'Create reminders to practice at your identified optimal times',
              'Consider journaling about any resistance you notice',
              'Gradually increase your practice frequency as you see results'
            ]
          }
        } else {
          tier = {
            label: 'Affirmation Beginner',
            description: 'You're just starting to work with affirmations and belief building.',
            insights: [
              'You may have significant doubts about achieving your goal',
              'Your implementation plan needs strengthening',
              'Starting small and building consistency will be key'
            ],
            recommendations: [
              'Begin with process-focused affirmations that feel more believable',
              'Start with just 1-2 minutes of practice at the same time each day',
              'Consider working with a coach or therapist on limiting beliefs',
              'Track small wins to build confidence in the process'
            ]
          }
        }
        
        // Add affirmations to recommendations
        tier.recommendations.unshift(...affirmations.map(a => `Affirmation: "${a}"`))
        
        return {
          total: Math.round(totalScore),
          percentage: Math.round(totalScore),
          breakdown: {
            belief: beliefScore * 10,
            implementation: implementationScore * 10
          },
          categoryScores: {
            'belief-level': {
              score: beliefScore * 10,
              percentage: (beliefScore / 4) * 100,
              maxPossible: 40
            },
            'implementation-plan': {
              score: implementationScore * 10,
              percentage: (implementationScore / 4) * 100,
              maxPossible: 40
            }
          },
          tier
        }
        
        // Helper function to generate personalized affirmations
        function generateAffirmations(
          goalArea: string,
          specificGoal: string,
          limitingBeliefs: string,
          strengths: string,
          idealIdentity: string,
          style: string,
          length: string,
          emotions: string
        ): string[] {
          const affirmations: string[] = []
          
          // Extract key words
          const goalWords = extractKeywords(specificGoal)
          const strengthWords = extractKeywords(strengths)
          const identityWords = extractKeywords(idealIdentity)
          const emotionWordsList = extractKeywords(emotions)
          const oppositeBeliefs = generateOppositeBeliefs(limitingBeliefs)
          
          // Generate identity-based affirmation
          let identityAffirmation = ''
          switch (style) {
            case 'present':
              identityAffirmation = `I am ${getAppropriateLength(identityWords, length)}`
              break
            case 'process':
              identityAffirmation = `I am becoming ${getAppropriateLength(identityWords, length)}`
              break
            case 'question':
              identityAffirmation = `Why am I so ${getAppropriateLength(identityWords, length)}?`
              break
            case 'gratitude':
              identityAffirmation = `I am grateful to be ${getAppropriateLength(identityWords, length)}`
              break
          }
          affirmations.push(identityAffirmation)
          
          // Generate strength-based affirmation
          let strengthAffirmation = ''
          switch (style) {
            case 'present':
              strengthAffirmation = `I have the ${getAppropriateLength(strengthWords, length)} to achieve my goals`
              break
            case 'process':
              strengthAffirmation = `I am developing ${getAppropriateLength(strengthWords, length)} every day`
              break
            case 'question':
              strengthAffirmation = `Why do I find it so natural to use my ${getAppropriateLength(strengthWords, length)}?`
              break
            case 'gratitude':
              strengthAffirmation = `I am grateful for my ${getAppropriateLength(strengthWords, length)}`
              break
          }
          affirmations.push(strengthAffirmation)
          
          // Generate goal-based affirmation
          let goalAffirmation = ''
          switch (style) {
            case 'present':
              goalAffirmation = `I am successfully ${getAppropriateLength(goalWords, length)}`
              break
            case 'process':
              goalAffirmation = `I am making progress toward ${getAppropriateLength(goalWords, length)} every day`
              break
            case 'question':
              goalAffirmation = `Why is it becoming easier for me to ${getAppropriateLength(goalWords, length)}?`
              break
            case 'gratitude':
              goalAffirmation = `I am grateful for the opportunity to ${getAppropriateLength(goalWords, length)}`
              break
          }
          affirmations.push(goalAffirmation)
          
          // Generate emotion-based affirmation
          let emotionAffirmation = ''
          switch (style) {
            case 'present':
              emotionAffirmation = `I feel ${getAppropriateLength(emotionWordsList, length)} as I achieve my goals`
              break
            case 'process':
              emotionAffirmation = `I am becoming more ${getAppropriateLength(emotionWordsList, length)} every day`
              break
            case 'question':
              emotionAffirmation = `Why do I feel so ${getAppropriateLength(emotionWordsList, length)} when I take action?`
              break
            case 'gratitude':
              emotionAffirmation = `I am grateful to feel ${getAppropriateLength(emotionWordsList, length)}`
              break
          }
          affirmations.push(emotionAffirmation)
          
          // Generate opposite belief affirmation
          if (oppositeBeliefs.length > 0) {
            let oppositeAffirmation = ''
            switch (style) {
              case 'present':
                oppositeAffirmation = `I am ${getAppropriateLength(oppositeBeliefs, length)}`
                break
              case 'process':
                oppositeAffirmation = `I am becoming ${getAppropriateLength(oppositeBeliefs, length)}`
                break
              case 'question':
                oppositeAffirmation = `Why am I so ${getAppropriateLength(oppositeBeliefs, length)}?`
                break
              case 'gratitude':
                oppositeAffirmation = `I am grateful to be ${getAppropriateLength(oppositeBeliefs, length)}`
                break
            }
            affirmations.push(oppositeAffirmation)
          }
          
          return affirmations
        }
        
        // Helper function to extract keywords
        function extractKeywords(text: string): string[] {
          if (!text) return []
          
          // Remove common filler words and split into words
          const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => 
              !['i', 'am', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'nor', 'so', 'yet', 'to', 'of', 'in', 'on', 'at', 'by', 'with'].includes(word)
            )
          
          return words
        }
        
        // Helper function to generate opposite beliefs
        function generateOppositeBeliefs(limitingBeliefs: string): string[] {
          if (!limitingBeliefs) return []
          
          const opposites: string[] = []
          const beliefs = limitingBeliefs.toLowerCase().split(/[.,;]/)
          
          beliefs.forEach(belief => {
            if (belief.includes('not') || belief.includes('n\'t')) {
              // Remove negation and add positive version
              opposites.push(belief.replace(/not |n't /g, '').trim())
            } else if (belief.includes('can\'t') || belief.includes('cannot')) {
              // Replace can't/cannot with can
              opposites.push(belief.replace(/can't|cannot/g, 'can').trim())
            } else if (belief.includes('never')) {
              // Replace never with always
              opposites.push(belief.replace(/never/g, 'always').trim())
            } else if (belief.includes('too')) {
              // Replace too with perfectly
              opposites.push(belief.replace(/too/g, 'perfectly').trim())
            } else {
              // For other cases, try to create an opposite
              if (belief.includes('bad')) opposites.push(belief.replace(/bad/g, 'good').trim())
              else if (belief.includes('weak')) opposites.push(belief.replace(/weak/g, 'strong').trim())
              else if (belief.includes('fail')) opposites.push(belief.replace(/fail/g, 'succeed').trim())
              else if (belief.includes('hard')) opposites.push(belief.replace(/hard/g, 'easy').trim())
              else if (belief.includes('difficult')) opposites.push(belief.replace(/difficult/g, 'achievable').trim())
              else if (belief.includes('impossible')) opposites.push(belief.replace(/impossible/g, 'possible').trim())
              else if (belief.trim().length > 0) opposites.push('capable of ' + belief.trim())
            }
          })
          
          return opposites.filter(o => o.length > 0)
        }
        
        // Helper function to get appropriate length of text
        function getAppropriateLength(words: string[], lengthPref: string): string {
          if (!words || words.length === 0) return ''
          
          switch (lengthPref) {
            case 'short':
              return words.slice(0, Math.min(3, words.length)).join(' ')
            case 'medium':
              return words.slice(0, Math.min(6, words.length)).join(' ')
            case 'long':
              return words.slice(0, Math.min(10, words.length)).join(' ')
            default:
              return words.slice(0, Math.min(5, words.length)).join(' ')
          }
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
            <Sparkles className="h-6 w-6 text-primary" />
            Affirmation Architect
          </CardTitle>
          <CardDescription>
            Create personalized affirmations based on your specific goals and identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Custom Affirmations</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Create affirmations tailored to your specific goals and identity
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Transform Self-Talk</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Convert limiting beliefs into empowering statements
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Implementation Plan</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Get a personalized practice plan for maximum effectiveness
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What You'll Receive:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>5 personalized affirmations tailored to your specific goal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Affirmations that counter your specific limiting beliefs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>A customized practice plan based on your preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">✓</span>
                <span>Guidance on how to maximize the effectiveness of your affirmations</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Takes approximately 7-10 minutes to complete • Your affirmations are saved to your account
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AssessmentTool
      toolId="affirmation-architect"
      title="Affirmation Architect"
      description="Create personalized affirmations based on your specific goals"
      config={config}
      leadCaptureLevel={2}
      showSharing={true}
    />
  )
}