"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Target, 
  Users, 
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Lightbulb,
  BarChart3,
  Heart,
  BookOpen,
  Compass,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function VisionVoidPage() {
  const voidTypes = [
    {
      title: "Dream-Reality Gap",
      description: "The space between what you want and what you have",
      icon: Eye,
      color: "bg-purple-500"
    },
    {
      title: "Clarity Void",
      description: "Unclear vision of what you truly want to achieve",
      icon: Compass,
      color: "bg-blue-500"
    },
    {
      title: "Action Void",
      description: "Knowing what to do but not doing it consistently",
      icon: Target,
      color: "bg-green-500"
    },
    {
      title: "Support Void",
      description: "Lack of guidance and accountability to reach your vision",
      icon: Users,
      color: "bg-orange-500"
    }
  ];

  const solutions = [
    {
      title: "Vision Clarity Framework",
      description: "Create a crystal-clear picture of your desired future",
      icon: Eye,
      color: "bg-purple-500"
    },
    {
      title: "Goal Mapping System",
      description: "Break down your vision into actionable steps",
      icon: MapPin,
      color: "bg-blue-500"
    },
    {
      title: "Accountability Network",
      description: "Build support systems to keep you on track",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Progress Tracking",
      description: "Monitor and celebrate your journey to your vision",
      icon: BarChart3,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Vision Void</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The gap between your dreams and reality is filled with uncertainty, doubt, and inaction. 
            Learn how to bridge this void and turn your vision into your reality.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Badge variant="default" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              Vision Framework
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Fill the Void Between Dreams and Reality
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Most people have dreams but struggle to turn them into reality. The Vision Void is the 
              space between what you want and what you have. Our proven framework helps you bridge 
              this gap with clarity, action, and support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Eye className="w-5 h-5 mr-2" />
                Create Your Vision
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-purple-500 mr-1" />
                <span>60K+ Visions Created</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 text-green-500 mr-1" />
                <span>85% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 max-w-md">
              <div className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Vision Void</h3>
                <p className="text-sm text-gray-600 mb-6">Bridging dreams and reality</p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Dreams</span>
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-600">What you want</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">The Void</span>
                    <p className="text-xs text-purple-600">Uncertainty & inaction</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Reality</span>
                      <Target className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">What you have</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* The Voids */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Four Types of Vision Voids
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {voidTypes.map((voidType, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${voidType.color} text-white mb-4`}>
                  <voidType.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {voidType.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {voidType.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Filling Your Vision Void
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${solution.color} text-white mb-4`}>
                  <solution.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Vision Void Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clarify Your Vision</h3>
              <p className="text-gray-600 mb-6">
                Create a crystal-clear picture of your desired future using our proven vision framework.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Guided process</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Map Your Path</h3>
              <p className="text-gray-600 mb-6">
                Break down your vision into actionable steps and create a roadmap to your desired reality.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Step-by-step</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Execute & Transform</h3>
              <p className="text-gray-600 mb-6">
                Take consistent action with support and accountability to bridge the gap to your vision.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ongoing support</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AK
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Abebe Kebede</h3>
                  <p className="text-sm text-gray-600">Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I had a dream of starting my own business but no clear path. The Vision Void framework 
                helped me create a roadmap and turn my dream into reality."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Dream to Reality</Badge>
                <span className="text-sm text-gray-500">8 months</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  SC
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I knew what I wanted but couldn't see how to get there. The vision clarity process 
                gave me the roadmap I needed to achieve my goals."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Vision Achieved</Badge>
                <span className="text-sm text-gray-500">6 months</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Eye className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Fill Your Vision Void?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stop dreaming and start doing. Create a clear vision, map your path, and turn your 
              dreams into reality with proven strategies and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Eye className="w-5 h-5 mr-2" />
                Create Your Vision
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-purple-600">
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