"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Layers,
  Star,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('potential')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container py-16 space-y-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Scientifically Designed Assessment Suite
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
            Transform Your
            <span className="block">Potential Into Power</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unlock deep insights about yourself with our research-backed assessment tools. 
            Each tool is designed to reveal hidden patterns and accelerate your personal growth journey.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>15+ Professional Tools</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Personalized Action Plans</span>
            </div>
          </div>
        </div>
      
        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="potential" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-transparent gap-1">
                <TabsTrigger 
                  value="potential" 
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-white/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Potential</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="goal" 
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-white/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Goals</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="habit" 
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-white/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Habits</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="mind" 
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-white/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Mindset</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="leadership" 
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-white/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Leadership</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        
          <div className="mt-12">
            <TabsContent value="potential" className="mt-0">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Unlock Your Hidden Potential</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover the untapped capabilities within you and identify what's been holding you back from achieving greatness.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ToolCard 
                    icon={<Brain className="h-8 w-8" />}
                    title="Potential Quotient Calculator"
                    description="Discover your untapped potential and growth mindset indicators through our scientifically-validated assessment"
                    href="/tools/potential-quotient-calculator"
                    leadCaptureLevel={1}
                    gradient="from-purple-500 to-pink-500"
                    duration="12 min"
                    popularity={95}
                    featured
                  />
                  <ToolCard 
                    icon={<Unlock className="h-8 w-8" />}
                    title="Limiting Belief Identifier"
                    description="Uncover the hidden beliefs that may be holding you back from reaching your full potential"
                    href="/tools/limiting-belief-identifier"
                    leadCaptureLevel={2}
                    gradient="from-orange-500 to-red-500"
                    duration="8 min"
                    popularity={87}
                  />
                  <ToolCard 
                    icon={<Gauge className="h-8 w-8" />}
                    title="Transformation Readiness Score"
                    description="Assess your readiness for meaningful personal change and receive customized preparation strategies"
                    href="/tools/transformation-readiness-score"
                    leadCaptureLevel={3}
                    gradient="from-emerald-500 to-teal-500"
                    duration="15 min"
                    popularity={92}
                  />
                </div>
              </div>
            </TabsContent>
          
            <TabsContent value="goal" className="mt-0">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Achieve Your Dreams</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Transform vague aspirations into concrete, achievable goals with our strategic planning and visualization tools.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ToolCard 
                    icon={<Compass className="h-8 w-8" />}
                    title="Dream Clarity Generator"
                    description="Clarify your vision and create a compelling future roadmap with our structured goal-setting framework"
                    href="/tools/dream-clarity-generator"
                    leadCaptureLevel={1}
                    gradient="from-blue-500 to-cyan-500"
                    duration="10 min"
                    popularity={89}
                    featured
                  />
                  <ToolCard 
                    icon={<BarChart3 className="h-8 w-8" />}
                    title="Goal Achievement Predictor"
                    description="Calculate your likelihood of achieving specific goals based on proven success factors and personal patterns"
                    href="/tools/goal-achievement-predictor"
                    leadCaptureLevel={2}
                    gradient="from-indigo-500 to-purple-500"
                    duration="12 min"
                    popularity={91}
                    comingSoon
                  />
                  <ToolCard 
                    icon={<Layers className="h-8 w-8" />}
                    title="Life Wheel Diagnostic"
                    description="Visualize balance across all areas of your life and identify where to focus your energy for maximum impact"
                    href="/tools/life-wheel-diagnostic"
                    leadCaptureLevel={3}
                    gradient="from-teal-500 to-green-500"
                    duration="15 min"
                    popularity={85}
                    comingSoon
                  />
                </div>
              </div>
            </TabsContent>
          
            <TabsContent value="habit" className="mt-0">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Build Powerful Habits</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Master the science of habit formation and create sustainable routines that compound your success over time.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ToolCard 
                    icon={<Activity className="h-8 w-8" />}
                    title="Habit Strength Analyzer"
                    description="Measure the strength of your current habits and identify which ones need reinforcement or replacement"
                    href="/tools/habit-strength-analyzer"
                    leadCaptureLevel={2}
                    gradient="from-green-500 to-emerald-500"
                    duration="8 min"
                    popularity={93}
                    featured
                  />
                  <ToolCard 
                    icon={<Repeat className="h-8 w-8" />}
                    title="Routine Optimizer"
                    description="Design optimal daily routines based on your natural energy patterns, goals, and lifestyle constraints"
                    href="/tools/routine-optimizer"
                    leadCaptureLevel={2}
                    gradient="from-cyan-500 to-blue-500"
                    duration="14 min"
                    popularity={88}
                    comingSoon
                  />
                  <ToolCard 
                    icon={<LineChart className="h-8 w-8" />}
                    title="21-Day Habit Installer"
                    description="Create a personalized, science-backed plan to install any new habit with maximum success probability"
                    href="/tools/habit-installer"
                    leadCaptureLevel={3}
                    gradient="from-violet-500 to-purple-500"
                    duration="10 min"
                    popularity={96}
                    comingSoon
                  />
                </div>
              </div>
            </TabsContent>
          
            <TabsContent value="mind" className="mt-0">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Master Your Mindset</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Rewire your thinking patterns and develop the mental frameworks that drive extraordinary performance and resilience.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ToolCard 
                    icon={<MessageSquare className="h-8 w-8" />}
                    title="Inner Dialogue Decoder"
                    description="Identify and transform patterns in your self-talk and internal narratives that shape your reality"
                    href="/tools/inner-dialogue-decoder"
                    leadCaptureLevel={1}
                    gradient="from-yellow-500 to-orange-500"
                    duration="9 min"
                    popularity={84}
                    comingSoon
                  />
                  <ToolCard 
                    icon={<Sparkles className="h-8 w-8" />}
                    title="Affirmation Architect"
                    description="Create scientifically-optimized, personalized affirmations that align with your brain's learning patterns"
                    href="/tools/affirmation-architect"
                    leadCaptureLevel={2}
                    gradient="from-pink-500 to-rose-500"
                    duration="11 min"
                    popularity={90}
                    featured
                    comingSoon
                  />
                  <ToolCard 
                    icon={<Lightbulb className="h-8 w-8" />}
                    title="Mental Model Mapper"
                    description="Discover which mental models shape your thinking and learn to upgrade your cognitive frameworks"
                    href="/tools/mental-model-mapper"
                    leadCaptureLevel={3}
                    gradient="from-amber-500 to-yellow-500"
                    duration="16 min"
                    popularity={88}
                    comingSoon
                  />
                </div>
              </div>
            </TabsContent>
          
            <TabsContent value="leadership" className="mt-0">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Develop Your Leadership</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover your unique leadership style and develop the influence skills needed to inspire and guide others to greatness.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ToolCard 
                    icon={<Users className="h-8 w-8" />}
                    title="Leadership Style Profiler"
                    description="Discover your natural leadership style, core strengths, and areas for development as an influential leader"
                    href="/tools/leadership-style-profiler"
                    leadCaptureLevel={3}
                    gradient="from-indigo-500 to-purple-500"
                    duration="18 min"
                    popularity={92}
                    featured
                  />
                  <ToolCard 
                    icon={<Target className="h-8 w-8" />}
                    title="Influence Quotient Calculator"
                    description="Measure your ability to influence others effectively and learn proven techniques for ethical persuasion"
                    href="/tools/influence-quotient-calculator"
                    leadCaptureLevel={2}
                    gradient="from-red-500 to-pink-500"
                    duration="13 min"
                    popularity={87}
                    comingSoon
                  />
                  <ToolCard 
                    icon={<UserPlus className="h-8 w-8" />}
                    title="Team Builder Simulator"
                    description="Create optimal team structures based on complementary strengths, working styles, and shared objectives"
                    href="/tools/team-builder-simulator"
                    leadCaptureLevel={3}
                    gradient="from-emerald-500 to-cyan-500"
                    duration="20 min"
                    popularity={89}
                    comingSoon
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Enhanced Benefits Section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Our Assessment Suite?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tool is crafted by behavioral scientists and backed by years of research to ensure you get accurate, actionable insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Insights</h3>
                <p className="text-gray-600">
                  Receive customized analysis tailored to your unique personality, goals, and behavioral patterns
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Science-Backed</h3>
                <p className="text-gray-600">
                  All assessments are built on proven psychological frameworks and validated through extensive research
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor your growth over time with detailed progress tracking and comparative analysis
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">
                  Get immediate, actionable insights with detailed reports and practical next steps
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-2xl">
              <Award className="h-6 w-6" />
              <span className="text-lg font-semibold">Join 50,000+ people transforming their lives</span>
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
  gradient: string;
  duration: string;
  popularity: number;
  featured?: boolean;
  comingSoon?: boolean;
}

function ToolCard({ 
  icon, 
  title, 
  description, 
  href, 
  leadCaptureLevel, 
  gradient, 
  duration, 
  popularity, 
  featured, 
  comingSoon 
}: ToolCardProps) {
  return (
    <div className="group relative">
      {featured && (
        <div className="absolute -top-3 left-6 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            MOST POPULAR
          </div>
        </div>
      )}
      
      <Card className="relative overflow-hidden h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
        {/* Gradient Header */}
        <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <div className="text-white/90">
              {icon}
            </div>
          </div>
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </div>
            <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full text-center">
              {popularity}% ★
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{title}</CardTitle>
          <CardDescription className="text-gray-600 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                leadCaptureLevel === 1 ? 'bg-green-500' : 
                leadCaptureLevel === 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs font-medium text-gray-600">
                {leadCaptureLevel === 1 && "Email Required"}
                {leadCaptureLevel === 2 && "Email + Phone Required"}
                {leadCaptureLevel === 3 && "Full Registration Required"}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Level {leadCaptureLevel}
            </Badge>
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Completion Rate</span>
              <span>{popularity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${gradient}`}
                style={{ width: `${popularity}%` }}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {comingSoon ? (
            <Button 
              variant="outline" 
              disabled 
              className="w-full bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Button>
          ) : (
            <Button asChild className="w-full group/btn bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-lg">
              <Link href={href} className="flex items-center justify-center gap-2">
                <span>Start Assessment</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}