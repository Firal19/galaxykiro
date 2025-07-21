"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Brain, 
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
  RefreshCw,
  Target,
  Clock,
  X
} from "lucide-react";
import Link from "next/link";

export default function ChangeParadoxPage() {
  const paradoxes = [
    {
      title: "The Comfort Zone Paradox",
      description: "We want change but resist leaving our comfort zone",
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      title: "The Knowledge Gap Paradox",
      description: "We know what to do but don't do what we know",
      icon: Lightbulb,
      color: "bg-green-500"
    },
    {
      title: "The Time Paradox",
      description: "We want results now but change takes time",
      icon: Clock,
      color: "bg-purple-500"
    },
    {
      title: "The Identity Paradox",
      description: "We want to change but fear losing who we are",
      icon: Users,
      color: "bg-orange-500"
    }
  ];

  const solutions = [
    {
      title: "Micro-Change Strategy",
      description: "Start with tiny, manageable changes that compound over time",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Identity-Based Change",
      description: "Change who you believe you are, not just what you do",
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      title: "Environment Design",
      description: "Design your environment to make good habits inevitable",
      icon: Target,
      color: "bg-purple-500"
    },
    {
      title: "Progress Tracking",
      description: "Measure and celebrate small wins to maintain momentum",
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
            <RefreshCw className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Change Paradox</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Why does change feel impossible even when we desperately want it? 
            Discover the hidden paradoxes that keep us stuck and learn proven strategies to break free.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Badge variant="default" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              Scientific Approach
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900">
              The Hidden Paradoxes That Keep You Stuck
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Most people want to change but find themselves trapped in familiar patterns. 
              This isn't your fault - it's the result of powerful psychological paradoxes that 
              evolution has hardwired into our brains. Understanding these paradoxes is the first 
              step to breaking free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Brain className="w-5 h-5 mr-2" />
                Take Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span>75K+ Assessments</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span>92% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 max-w-md">
              <div className="text-center">
                <RefreshCw className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Change Paradox</h3>
                <p className="text-sm text-gray-600 mb-6">Why change feels impossible</p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Want Change</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">Desire for improvement</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Resist Change</span>
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-600">Fear of uncertainty</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">The Paradox</span>
                    <p className="text-xs text-blue-600">Same person, conflicting desires</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* The Paradoxes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Four Core Paradoxes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paradoxes.map((paradox, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paradox.color} text-white mb-4`}>
                  <paradox.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {paradox.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {paradox.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Breaking Free: Proven Solutions
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
            The Change Paradox Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Identify Your Paradoxes</h3>
              <p className="text-gray-600 mb-6">
                Take our assessment to identify which specific paradoxes are keeping you stuck and preventing change.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>10 minutes</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Learn Solutions</h3>
              <p className="text-gray-600 mb-6">
                Discover proven strategies and techniques specifically designed to overcome your identified paradoxes.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Implement & Transform</h3>
              <p className="text-gray-600 mb-6">
                Apply the strategies with guided support and track your progress as you break free from limiting patterns.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ongoing</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  FA
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fatima Ahmed</h3>
                  <p className="text-sm text-gray-600">Healthcare Professional</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I was stuck in the comfort zone paradox for years. Understanding why change felt impossible 
                was the key to finally breaking free and achieving my goals."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Comfort Zone Broken</Badge>
                <span className="text-sm text-gray-500">4 months</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  TH
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tewodros Haile</h3>
                  <p className="text-sm text-gray-600">Student</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The identity paradox was my biggest obstacle. Once I learned to change who I believed 
                I was, everything else fell into place."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Identity Transformed</Badge>
                <span className="text-sm text-gray-500">3 months</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <RefreshCw className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Break Free?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stop fighting against your own psychology. Learn to work with your brain's natural tendencies 
              and create lasting change that feels effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Brain className="w-5 h-5 mr-2" />
                Take Change Paradox Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
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