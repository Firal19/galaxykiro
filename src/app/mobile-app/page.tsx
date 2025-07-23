"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  Zap,
  Award,
  Shield,
  Wifi,
  Clock,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Apple,
  TrendingUp,
  Target,
  Globe
} from "lucide-react";

export default function MobileAppPage() {
  const features = [
    {
      title: "Personalized Assessments",
      description: "Take assessments on-the-go and get instant insights",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your transformation journey with detailed analytics",
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      title: "Offline Access",
      description: "Download content for offline learning and practice",
      icon: Wifi,
      color: "bg-purple-500"
    },
    {
      title: "Community Connect",
      description: "Connect with like-minded individuals in your area",
      icon: Users,
      color: "bg-orange-500"
    },
    {
      title: "Daily Reminders",
      description: "Get personalized reminders for your goals and habits",
      icon: Clock,
      color: "bg-pink-500"
    },
    {
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise security",
      icon: Shield,
      color: "bg-indigo-500"
    }
  ];

  const appStats = [
    { label: "Downloads", value: "50K+", icon: Download },
    { label: "Rating", value: "4.8", icon: Star },
    { label: "Active Users", value: "25K+", icon: Users },
    { label: "Countries", value: "15+", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Mobile App</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your life on-the-go with our powerful mobile application. Access all your tools, track your progress, and connect with our community from anywhere.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-sm">
                <Star className="w-3 h-3 mr-1" />
                New Release
              </Badge>
              <Badge variant="outline" className="text-sm">
                Version 2.1
              </Badge>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Your Personal Transformation Companion
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Take your personal development journey with you wherever you go. Our mobile app provides all the tools, assessments, and community features you need to unlock your full potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Apple className="w-5 h-5 mr-2" />
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Smartphone className="w-5 h-5 mr-2" />
                Download for Android
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Download className="w-4 h-4 text-blue-500 mr-1" />
                <span>50K+ Downloads</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-1" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-96 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
                <div className="text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">GalaxyKiro</h3>
                  <p className="text-sm opacity-90 mb-6">Transform Your Life</p>
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Assessment</span>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progress</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Community</span>
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {appStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Powerful Features at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
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

        {/* Screenshots Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            See It in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-48 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Assessment Screen</h3>
                  <p className="text-sm text-gray-600 mt-2">Take assessments on-the-go</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Assessment Screen</h3>
              <p className="text-sm text-gray-600">Take assessments on-the-go</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-48 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Progress Dashboard</h3>
                  <p className="text-sm text-gray-600 mt-2">Track your transformation</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Progress Dashboard</h3>
              <p className="text-sm text-gray-600">Track your transformation</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-48 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-sm text-gray-600 mt-2">Connect with others</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600">Connect with others</p>
            </Card>
          </div>
        </div>

        {/* Download Section */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-6 text-white" />
              <h2 className="text-3xl font-bold mb-4">Download Now</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who are already transforming their lives with our mobile app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Apple className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* System Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Requirements</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">iOS Version</span>
                <span className="font-semibold">iOS 12.0 or later</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Android Version</span>
                <span className="font-semibold">Android 8.0 or later</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage Space</span>
                <span className="font-semibold">50 MB available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Internet</span>
                <span className="font-semibold">Required for sync</span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">What's New in v2.1</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Enhanced Assessments</span>
                  <p className="text-sm text-gray-600">New interactive assessment types</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Offline Mode</span>
                  <p className="text-sm text-gray-600">Download content for offline access</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Community Features</span>
                  <p className="text-sm text-gray-600">Connect with local community members</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Performance Improvements</span>
                  <p className="text-sm text-gray-600">Faster loading and better battery life</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 