'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Play,
  BarChart3,
  Award,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  completed: boolean
  progress: number
  href: string
}

const assessments: Assessment[] = [
  {
    id: 'potential-quotient',
    title: 'Potential Quotient Calculator',
    description: 'Discover your untapped potential and hidden strengths through our comprehensive assessment.',
    icon: Brain,
    estimatedTime: '15-20 minutes',
    difficulty: 'Intermediate',
    category: 'Personal Development',
    completed: false,
    progress: 0,
    href: '/tools/potential-quotient-calculator'
  },
  {
    id: 'decision-style',
    title: 'Decision Door Assessment',
    description: 'Understand your decision-making patterns and improve your choice-making process.',
    icon: Target,
    estimatedTime: '10-15 minutes',
    difficulty: 'Beginner',
    category: 'Decision Making',
    completed: false,
    progress: 0,
    href: '/decision-door'
  },
  {
    id: 'leadership-style',
    title: 'Leadership Lever Assessment',
    description: 'Identify your leadership approach and develop your management skills.',
    icon: Users,
    estimatedTime: '12-18 minutes',
    difficulty: 'Intermediate',
    category: 'Leadership',
    completed: false,
    progress: 0,
    href: '/leadership-lever'
  },
  {
    id: 'success-gap',
    title: 'Success Gap Analysis',
    description: 'Bridge the gap between where you are and where you want to be.',
    icon: TrendingUp,
    estimatedTime: '15-25 minutes',
    difficulty: 'Advanced',
    category: 'Success Planning',
    completed: false,
    progress: 0,
    href: '/success-gap'
  },
  {
    id: 'vision-void',
    title: 'Vision Void Assessment',
    description: 'Clarify your vision and purpose for a more directed life path.',
    icon: Award,
    estimatedTime: '10-15 minutes',
    difficulty: 'Beginner',
    category: 'Vision & Purpose',
    completed: false,
    progress: 0,
    href: '/vision-void'
  },
  {
    id: 'change-paradox',
    title: 'Change Paradox Navigator',
    description: 'Navigate transformation challenges and embrace change effectively.',
    icon: BarChart3,
    estimatedTime: '15-20 minutes',
    difficulty: 'Intermediate',
    category: 'Change Management',
    completed: false,
    progress: 0,
    href: '/change-paradox'
  }
]

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
}

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [assessmentList, setAssessmentList] = useState<Assessment[]>(assessments)

  const categories = ['All', ...Array.from(new Set(assessments.map(a => a.category)))]
  
  const filteredAssessments = selectedCategory === 'All' 
    ? assessmentList 
    : assessmentList.filter(a => a.category === selectedCategory)

  const completedCount = assessmentList.filter(a => a.completed).length
  const totalCount = assessmentList.length
  const overallProgress = (completedCount / totalCount) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Center</h1>
        <p className="text-gray-600">
          Discover your potential through our comprehensive assessment toolkit
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Your Assessment Progress
          </CardTitle>
          <CardDescription>
            Track your journey through our assessment toolkit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{completedCount}/{totalCount} completed</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{totalCount - completedCount}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => {
          const IconComponent = assessment.icon
          
          return (
            <Card key={assessment.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <Badge 
                        className={`text-xs ${difficultyColors[assessment.difficulty]}`}
                        variant="secondary"
                      >
                        {assessment.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {assessment.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription>{assessment.description}</CardDescription>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {assessment.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {assessment.category}
                  </div>
                </div>

                {assessment.progress > 0 && !assessment.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{assessment.progress}%</span>
                    </div>
                    <Progress value={assessment.progress} className="w-full" />
                  </div>
                )}

                <div className="pt-4">
                  <Link href={assessment.href}>
                    <Button className="w-full" variant={assessment.completed ? "outline" : "default"}>
                      {assessment.completed ? (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </>
                      ) : assessment.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue Assessment
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Assessment
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Explore additional resources and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tools">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <Target className="w-6 h-6" />
                <span>Browse All Tools</span>
              </Button>
            </Link>
            <Link href="/soft-member/dashboard">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Dashboard</span>
              </Button>
            </Link>
            <Link href="/content-library">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Content Library</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}