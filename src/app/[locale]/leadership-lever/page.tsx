"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Lightbulb,
  BarChart3,
  Heart,
  BookOpen,
  Crown,
  TrendingUp,
  Brain
} from "lucide-react";
import Link from "next/link";

export default function LeadershipLeverPage() {
  const leadershipAreas = [
    {
      title: "Self-Leadership",
      description: "Master your own thoughts, emotions, and actions",
      icon: Brain,
      color: "bg-green-500"
    },
    {
      title: "Team Leadership",
      description: "Inspire and guide others to achieve common goals",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Strategic Leadership",
      description: "Create vision and navigate complex challenges",
      icon: Crown,
      color: "bg-purple-500"
    },
    {
      title: "Influence & Impact",
      description: "Build trust and create lasting positive change",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  const tools = [
    {
      title: "Leadership Assessment",
      description: "Evaluate your current leadership capabilities",
      icon: BarChart3,
      color: "bg-green-500"
    },
    {
      title: "Influence Quotient Calculator",
      description: "Measure and improve your influence power",
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      title: "Leadership Style Profiler",
      description: "Discover your unique leadership approach",
      icon: Crown,
      color: "bg-purple-500"
    },
    {
      title: "Team Builder Simulator",
      description: "Practice building high-performing teams",
      icon: Users,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Leadership Lever</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your leadership potential and become the person others want to follow. 
            Discover your unique leadership style and develop the skills to create lasting impact.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Badge variant="default" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              Leadership Framework
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Your Leadership Potential is Your Greatest Lever
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Leadership is not about position or title - it's about influence and impact. 
              Whether you're leading yourself, a team, or an organization, your leadership 
              skills are the ultimate multiplier for your success and the success of others.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Crown className="w-5 h-5 mr-2" />
                Take Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-1" />
                <span>40K+ Leaders Developed</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span>94% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200 max-w-md">
              <div className="text-center">
                <Crown className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership Lever</h3>
                <p className="text-sm text-gray-600 mb-6">Your potential multiplier</p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Impact</span>
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-600">1x influence</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Leadership Lever</span>
                    <p className="text-xs text-green-600">10x multiplier</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Potential Impact</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">10x influence</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Leadership Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Four Pillars of Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipAreas.map((area, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${area.color} text-white mb-4`}>
                  <area.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {area.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Leadership Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Leadership Development Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color} text-white mb-4`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Leadership Development Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assess Your Leadership</h3>
              <p className="text-gray-600 mb-6">
                Evaluate your current leadership capabilities across all four pillars and identify areas for growth.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Comprehensive</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Develop Your Skills</h3>
              <p className="text-gray-600 mb-6">
                Access targeted training and tools to strengthen your leadership capabilities in specific areas.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Personalized</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply & Lead</h3>
              <p className="text-gray-600 mb-6">
                Practice your leadership skills in real situations and create lasting positive impact.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Practical</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Leadership Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AH
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Amina Hassan</h3>
                  <p className="text-sm text-gray-600">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I wanted to make a difference in my community but didn't know how to lead effectively. 
                The Leadership Lever program gave me the skills and confidence to help over 100 people."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Community Impact</Badge>
                <span className="text-sm text-gray-500">12 months</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  YT
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Yohannes Tekle</h3>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I was good at my job but struggled to lead my team. The leadership assessment revealed 
                my blind spots and helped me become a more effective leader."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Team Leadership</Badge>
                <span className="text-sm text-gray-500">9 months</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <Crown className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Leadership Potential?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stop waiting for permission to lead. Develop your leadership skills and become the person 
              others want to follow, starting today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Crown className="w-5 h-5 mr-2" />
                Take Leadership Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-600">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 