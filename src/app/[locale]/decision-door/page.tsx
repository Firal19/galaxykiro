"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DoorOpen, 
  Target, 
  Users, 
  Star,
  CheckCircle,
  BarChart3,
  Heart,
  BookOpen,
  Brain,
  Clock,
  Scale
} from "lucide-react";

export default function DecisionDoorPage() {
  const decisionTypes = [
    {
      title: "Identity Decisions",
      description: "Choices that define who you are and who you become",
      icon: Brain,
      color: "bg-orange-500"
    },
    {
      title: "Career Decisions",
      description: "Professional choices that shape your future path",
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Relationship Decisions",
      description: "Choices about who you surround yourself with",
      icon: Heart,
      color: "bg-pink-500"
    },
    {
      title: "Lifestyle Decisions",
      description: "Daily choices that compound into major results",
      icon: Clock,
      color: "bg-green-500"
    }
  ];

  const frameworks = [
    {
      title: "Decision Matrix",
      description: "Systematic approach to evaluating options",
      icon: Scale,
      color: "bg-blue-500"
    },
    {
      title: "Identity-Based Decisions",
      description: "Make choices aligned with who you want to become",
      icon: Brain,
      color: "bg-orange-500"
    },
    {
      title: "Long-term Thinking",
      description: "Consider the compound effects of your choices",
      icon: Clock,
      color: "bg-green-500"
    },
    {
      title: "Values Alignment",
      description: "Ensure decisions match your core values",
      icon: Heart,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DoorOpen className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Decision Door</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every decision is a door to a different future. Learn to make better life-changing decisions 
            that align with your values and lead to the outcomes you truly want.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Badge variant="default" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              Decision Framework
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Every Decision Opens a Door to Your Future
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              The quality of your life is determined by the quality of your decisions. Most people 
              make choices based on short-term comfort rather than long-term fulfillment. Learn to 
              make decisions that create the life you truly want.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <DoorOpen className="w-5 h-5 mr-2" />
                Take Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-orange-500 mr-1" />
                <span>35K+ Decisions Made</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 text-green-500 mr-1" />
                <span>87% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 max-w-md">
              <div className="text-center">
                <DoorOpen className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Decision Door</h3>
                <p className="text-sm text-gray-600 mb-6">Choose your future wisely</p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Decision</span>
                      <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-600">What you choose now</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <span className="text-sm font-medium text-orange-800">The Door</span>
                    <p className="text-xs text-orange-600">Path to your future</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Future Reality</span>
                      <Target className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">What you become</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Decision Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Four Types of Life-Changing Decisions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {decisionTypes.map((type, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color} text-white mb-4`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Decision Frameworks */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Proven Decision-Making Frameworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {frameworks.map((framework, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${framework.color} text-white mb-4`}>
                  <framework.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {framework.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {framework.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Decision Door Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clarify Your Values</h3>
              <p className="text-gray-600 mb-6">
                Identify your core values and what truly matters to you to make aligned decisions.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Foundation</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Evaluate Options</h3>
              <p className="text-gray-600 mb-6">
                Use proven frameworks to systematically evaluate your options and their long-term impact.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Systematic</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose & Commit</h3>
              <p className="text-gray-600 mb-6">
                Make your decision with confidence and commit to the path that aligns with your future self.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Confident</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AK
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Abebe Kebede</h3>
                  <p className="text-sm text-gray-600">Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I was stuck between a safe job and starting my own business. The Decision Door framework 
                helped me make the choice that aligned with who I wanted to become."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Identity Decision</Badge>
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
                "I had to choose between staying in my comfort zone or taking a risk for growth. 
                The decision matrix helped me see the long-term benefits clearly."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Career Decision</Badge>
                <span className="text-sm text-gray-500">6 months</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
            <DoorOpen className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Make Better Decisions?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stop making decisions by default. Learn to choose the doors that lead to the future 
              you truly want to create.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <DoorOpen className="w-5 h-5 mr-2" />
                Take Decision Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-orange-600">
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