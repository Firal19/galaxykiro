"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Target, 
  Activity, 
  Users, 
  Lightbulb, 
  Unlock, 
  Gauge, 
  Compass, 
  BarChart3, 
  Repeat, 
  MessageSquare, 
  Sparkles, 
  LineChart, 
  UserPlus, 
  Layers
} from 'lucide-react'

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('potential')
  
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interactive Tools Suite</h1>
        <p className="text-xl text-muted-foreground">
          Discover insights and create personalized action plans with our interactive assessment tools
        </p>
      </div>
      
      <Tabs defaultValue="potential" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="potential" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden md:inline">Potential</span>
            </TabsTrigger>
            <TabsTrigger value="goal" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden md:inline">Goal</span>
            </TabsTrigger>
            <TabsTrigger value="habit" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Habit</span>
            </TabsTrigger>
            <TabsTrigger value="mind" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline">Mind</span>
            </TabsTrigger>
            <TabsTrigger value="leadership" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Leadership</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-8">
          <TabsContent value="potential" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ToolCard 
                icon={<Brain className="h-6 w-6 text-primary" />}
                title="Potential Quotient Calculator"
                description="Discover your untapped potential and growth mindset indicators"
                href="/tools/potential-quotient-calculator"
                leadCaptureLevel={1}
              />
              <ToolCard 
                icon={<Unlock className="h-6 w-6 text-primary" />}
                title="Limiting Belief Identifier"
                description="Uncover the hidden beliefs that may be holding you back"
                href="/tools/limiting-belief-identifier"
                leadCaptureLevel={2}
              />
              <ToolCard 
                icon={<Gauge className="h-6 w-6 text-primary" />}
                title="Transformation Readiness Score"
                description="Assess your readiness for meaningful personal change"
                href="/tools/transformation-readiness-score"
                leadCaptureLevel={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="goal" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ToolCard 
                icon={<Compass className="h-6 w-6 text-primary" />}
                title="Dream Clarity Generator"
                description="Clarify your vision and create a compelling future"
                href="/tools/dream-clarity-generator"
                leadCaptureLevel={1}
              />
              <ToolCard 
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title="Goal Achievement Predictor"
                description="Calculate your likelihood of achieving specific goals"
                href="/tools/goal-achievement-predictor"
                leadCaptureLevel={2}
                comingSoon
              />
              <ToolCard 
                icon={<Layers className="h-6 w-6 text-primary" />}
                title="Life Wheel Diagnostic"
                description="Visualize balance across all areas of your life"
                href="/tools/life-wheel-diagnostic"
                leadCaptureLevel={3}
                comingSoon
              />
            </div>
          </TabsContent>
          
          <TabsContent value="habit" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ToolCard 
                icon={<Activity className="h-6 w-6 text-primary" />}
                title="Habit Strength Analyzer"
                description="Measure the strength of your habits and identify areas for improvement"
                href="/tools/habit-strength-analyzer"
                leadCaptureLevel={2}
              />
              <ToolCard 
                icon={<Repeat className="h-6 w-6 text-primary" />}
                title="Routine Optimizer"
                description="Design optimal daily routines based on your goals and energy patterns"
                href="/tools/routine-optimizer"
                leadCaptureLevel={2}
                comingSoon
              />
              <ToolCard 
                icon={<LineChart className="h-6 w-6 text-primary" />}
                title="21-Day Habit Installer"
                description="Create a personalized plan to install any new habit in 21 days"
                href="/tools/habit-installer"
                leadCaptureLevel={3}
                comingSoon
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mind" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ToolCard 
                icon={<MessageSquare className="h-6 w-6 text-primary" />}
                title="Inner Dialogue Decoder"
                description="Identify patterns in your self-talk and mental narratives"
                href="/tools/inner-dialogue-decoder"
                leadCaptureLevel={1}
                comingSoon
              />
              <ToolCard 
                icon={<Sparkles className="h-6 w-6 text-primary" />}
                title="Affirmation Architect"
                description="Create personalized affirmations based on your specific goals"
                href="/tools/affirmation-architect"
                leadCaptureLevel={2}
                comingSoon
              />
              <ToolCard 
                icon={<Lightbulb className="h-6 w-6 text-primary" />}
                title="Mental Model Mapper"
                description="Discover which mental models shape your thinking and decision-making"
                href="/tools/mental-model-mapper"
                leadCaptureLevel={3}
                comingSoon
              />
            </div>
          </TabsContent>
          
          <TabsContent value="leadership" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ToolCard 
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Leadership Style Profiler"
                description="Discover your natural leadership style and strengths"
                href="/tools/leadership-style-profiler"
                leadCaptureLevel={3}
              />
              <ToolCard 
                icon={<Target className="h-6 w-6 text-primary" />}
                title="Influence Quotient Calculator"
                description="Measure your ability to influence others effectively"
                href="/tools/influence-quotient-calculator"
                leadCaptureLevel={2}
                comingSoon
              />
              <ToolCard 
                icon={<UserPlus className="h-6 w-6 text-primary" />}
                title="Team Builder Simulator"
                description="Create optimal team structures based on complementary strengths"
                href="/tools/team-builder-simulator"
                leadCaptureLevel={3}
                comingSoon
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="bg-muted/50 p-6 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Why Use Our Interactive Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Personalized Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Receive customized analysis based on your unique responses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Science-Backed Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Get actionable strategies based on proven research
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Save your results and monitor your growth over time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Join Our Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with others on similar personal development journeys
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  leadCaptureLevel: 1 | 2 | 3;
  comingSoon?: boolean;
}

function ToolCard({ icon, title, description, href, leadCaptureLevel, comingSoon }: ToolCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">
            {leadCaptureLevel === 1 && "Email Required"}
            {leadCaptureLevel === 2 && "Email + Phone Required"}
            {leadCaptureLevel === 3 && "Full Profile Required"}
          </span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {leadCaptureLevel === 1 && "Level 1"}
            {leadCaptureLevel === 2 && "Level 2"}
            {leadCaptureLevel === 3 && "Level 3"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {comingSoon ? (
          <Button variant="outline" disabled className="w-full">
            Coming Soon
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={href}>Start Tool</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}