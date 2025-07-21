"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Lightbulb,
  BarChart3,
  Heart,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function SuccessGapPage() {
  const features = [
    {
      title: "Hidden Potential Assessment",
      description: "Discover the gap between your current performance and your true potential",
      icon: Target,
      color: "bg-red-500"
    },
    {
      title: "Performance Analysis",
      description: "Identify specific areas where you're underperforming",
      icon: BarChart3,
      color: "bg-blue-500"
    },
    {
      title: "Goal Achievement Framework",
      description: "Bridge the gap with proven strategies and techniques",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Success Stories",
      description: "Learn from others who have closed their success gaps",
      icon: Users,
      color: "bg-purple-500"
    }
  ];

  const statistics = [
    { label: "Average Gap", value: "47%", description: "Most people operate at 53% of their potential" },
    { label: "Success Rate", value: "89%", description: "Of participants who close their gaps" },
    { label: "Time to Close", value: "6 months", description: "Average time to see significant improvement" },
    { label: "ROI", value: "340%", description: "Average return on personal development investment" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Success Gap</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the hidden potential you're missing. Most people operate at only 53% of their true capability. 
            Learn how to identify and close your success gap to achieve remarkable results.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Badge variant="default" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900">
              The Hidden Gap Between Your Current Success and Your True Potential
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Research shows that most people operate at only 53% of their true potential. This means there's a 
              massive 47% gap between where you are and where you could be. Our Success Gap methodology helps 
              you identify, measure, and close this gap.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Target className="w-5 h-5 mr-2" />
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
                <span>50K+ Assessments</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span>89% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 max-w-md">
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Success Gap</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">47%</div>
                <p className="text-sm text-gray-600 mb-6">Average potential gap</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Performance</span>
                    <span className="font-semibold">53%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">True Potential</span>
                    <span className="font-semibold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.description}</div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How We Help You Close Your Success Gap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-red-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} text-white mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Success Gap Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assess Your Gap</h3>
              <p className="text-gray-600 mb-6">
                Take our comprehensive assessment to identify your specific success gaps and areas of untapped potential.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>15 minutes</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Action Plan</h3>
              <p className="text-gray-600 mb-6">
                Receive a personalized action plan with specific strategies to close your identified success gaps.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Customized</span>
              </div>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600 mb-6">
                Monitor your improvement with detailed analytics and celebrate milestones as you close your success gap.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  SC
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I discovered I was operating at only 45% of my potential. After 6 months of focused work, 
                I've closed my success gap and doubled my income."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">47% Gap Closed</Badge>
                <span className="text-sm text-gray-500">6 months</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AK
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Abebe Kebede</h3>
                  <p className="text-sm text-gray-600">Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The success gap assessment revealed I was missing key leadership skills. Now I run a 
                successful business and help others do the same."
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">52% Gap Closed</Badge>
                <span className="text-sm text-gray-500">8 months</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <Target className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Close Your Success Gap?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of people who have discovered and closed their success gaps. 
              Start your transformation journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Target className="w-5 h-5 mr-2" />
                Take Success Gap Assessment
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-red-600">
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