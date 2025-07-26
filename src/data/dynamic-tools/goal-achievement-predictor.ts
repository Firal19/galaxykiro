import { DynamicTool } from '@/lib/tool-migration-utility'

export const goalAchievementPredictor: DynamicTool = {
  id: 'goal-achievement-predictor',
  title: 'Goal Achievement Predictor',
  description: 'Discover your probability of achieving your goals with our scientifically-backed assessment tool that analyzes 6 critical success factors.',
  category: 'goal',
  icon: '🎯',
  estimatedTime: 10,
  leadCaptureLevel: 2,
  progressSaving: true,
  questions: [
    {
      id: 'q1',
      type: 'scale',
      text: 'How clearly defined is your goal?',
      description: 'A clear goal has specific, measurable outcomes and deadlines',
      required: true,
      weight: 1.5,
      category: 'specificity',
      validation: {
        min: 1,
        max: 10
      }
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      text: 'What is your primary motivation for this goal?',
      required: true,
      weight: 1.3,
      category: 'motivation',
      options: [
        {
          value: 'intrinsic',
          label: 'Personal fulfillment and growth',
          description: 'Driven by internal satisfaction and self-improvement'
        },
        {
          value: 'extrinsic',
          label: 'External rewards and recognition',
          description: 'Motivated by money, status, or others\' approval'
        },
        {
          value: 'mixed',
          label: 'Both internal and external factors',
          description: 'A combination of personal and external motivations'
        }
      ]
    },
    {
      id: 'q3',
      type: 'text_input',
      text: 'Describe your action plan in detail',
      description: 'Include specific steps, milestones, and timelines',
      required: true,
      weight: 1.7,
      category: 'planning',
      validation: {
        minLength: 50,
        maxLength: 500
      }
    },
    {
      id: 'q4',
      type: 'slider',
      text: 'How supportive is your environment?',
      description: 'Consider family, friends, workspace, and resources',
      required: true,
      weight: 1.0,
      category: 'environment',
      validation: {
        min: 0,
        max: 100
      }
    },
    {
      id: 'q5',
      type: 'multiple_choice',
      text: 'Do you have the necessary skills for this goal?',
      required: true,
      weight: 1.2,
      category: 'skills',
      options: [
        {
          value: 'yes',
          label: 'Yes, I have all required skills'
        },
        {
          value: 'mostly',
          label: 'I have most skills, need minor development'
        },
        {
          value: 'some',
          label: 'I have some skills, need significant learning'
        },
        {
          value: 'no',
          label: 'I need to develop most skills from scratch'
        }
      ]
    },
    {
      id: 'q6',
      type: 'ranking',
      text: 'Rank these potential obstacles by impact',
      description: 'Drag to reorder from most to least challenging',
      required: true,
      weight: 1.0,
      category: 'obstacles',
      options: [
        { value: 'time', label: 'Lack of time' },
        { value: 'money', label: 'Financial constraints' },
        { value: 'skills', label: 'Skill gaps' },
        { value: 'support', label: 'Lack of support' },
        { value: 'motivation', label: 'Loss of motivation' }
      ]
    },
    {
      id: 'q7',
      type: 'scale',
      text: 'How committed are you to this goal?',
      description: 'Rate your willingness to persist through challenges',
      required: true,
      weight: 1.5,
      category: 'commitment',
      validation: {
        min: 1,
        max: 10
      }
    },
    {
      id: 'q8',
      type: 'binary',
      text: 'Have you achieved similar goals before?',
      required: true,
      weight: 0.8,
      category: 'experience',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'q9',
      type: 'emoji_scale',
      text: 'How do you feel about this goal right now?',
      required: true,
      weight: 0.9,
      category: 'emotion',
      options: [
        { value: 1, label: '😟' },
        { value: 2, label: '😕' },
        { value: 3, label: '😐' },
        { value: 4, label: '🙂' },
        { value: 5, label: '😄' }
      ]
    },
    {
      id: 'q10',
      type: 'scenario',
      text: 'You face a major setback. What do you do?',
      required: true,
      weight: 1.2,
      category: 'resilience',
      options: [
        {
          value: 'persist',
          label: 'Push through and find alternative solutions',
          description: 'Shows high resilience and problem-solving'
        },
        {
          value: 'pause',
          label: 'Take a break and reassess the situation',
          description: 'Shows balanced approach to challenges'
        },
        {
          value: 'pivot',
          label: 'Modify the goal to be more achievable',
          description: 'Shows flexibility and adaptability'
        },
        {
          value: 'quit',
          label: 'Consider abandoning this goal',
          description: 'May indicate low commitment or poor goal fit'
        }
      ]
    }
  ],
  scoringConfig: {
    type: 'category',
    categories: [
      {
        id: 'specificity',
        name: 'Goal Clarity',
        description: 'How well-defined and specific your goal is',
        weight: 1.5
      },
      {
        id: 'motivation',
        name: 'Motivation Type',
        description: 'The quality and sustainability of your motivation',
        weight: 1.3
      },
      {
        id: 'planning',
        name: 'Action Planning',
        description: 'The detail and feasibility of your plan',
        weight: 1.7
      },
      {
        id: 'environment',
        name: 'Environmental Support',
        description: 'How supportive your surroundings are',
        weight: 1.0
      },
      {
        id: 'skills',
        name: 'Skill Readiness',
        description: 'Your current capability to achieve the goal',
        weight: 1.2
      },
      {
        id: 'commitment',
        name: 'Commitment Level',
        description: 'Your dedication and persistence',
        weight: 1.5
      }
    ],
    thresholds: [
      {
        min: 0,
        max: 40,
        label: 'Low Probability',
        description: 'Your goal needs significant refinement and preparation',
        recommendations: [
          'Clarify your goal with specific, measurable outcomes',
          'Build a detailed action plan with milestones',
          'Identify and address major skill gaps',
          'Seek mentorship or guidance',
          'Start with smaller, related goals to build confidence'
        ]
      },
      {
        min: 41,
        max: 70,
        label: 'Moderate Probability',
        description: 'You have a good foundation but need to strengthen key areas',
        recommendations: [
          'Refine your action plan with specific deadlines',
          'Build accountability systems',
          'Address your top 2-3 obstacles proactively',
          'Connect with others pursuing similar goals',
          'Track progress weekly and adjust as needed'
        ]
      },
      {
        min: 71,
        max: 89,
        label: 'High Probability',
        description: 'You\'re well-positioned for success with minor adjustments',
        recommendations: [
          'Execute your plan with consistent daily actions',
          'Set up systems to maintain momentum',
          'Plan for potential setbacks',
          'Celebrate milestones to maintain motivation',
          'Consider stretch goals to maximize growth'
        ]
      },
      {
        min: 90,
        max: 100,
        label: 'Very High Probability',
        description: 'You\'re exceptionally prepared to achieve this goal',
        recommendations: [
          'Focus on consistent execution',
          'Document your journey to help others',
          'Look for ways to exceed your original goal',
          'Prepare for your next big challenge',
          'Share your knowledge with your community'
        ]
      }
    ],
    algorithm: 'weighted_category_average'
  },
  resultsConfig: {
    showOverallScore: true,
    showCategoryScores: true,
    showDetailedAnalysis: true,
    shareableResults: true,
    certificateEnabled: false
  },
  metadata: {
    author: 'Galaxy Dream Team',
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    tags: ['goal-setting', 'achievement', 'success', 'planning', 'motivation'],
    scientificBasis: 'Based on research from Goal-Setting Theory (Locke & Latham), Self-Determination Theory (Deci & Ryan), and Implementation Intentions (Gollwitzer)'
  }
}