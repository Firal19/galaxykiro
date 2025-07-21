"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  BookOpen, 
  Video, 
  Users, 
  Target,
  TrendingUp,
  Award,
  Star,
  Clock,
  Eye,
  Heart
} from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Personal Transformation Guide",
      description: "Complete step-by-step guide to unlocking your hidden potential",
      type: "PDF Guide",
      size: "2.4 MB",
      downloads: "12,450",
      rating: 4.9,
      icon: BookOpen,
      color: "bg-blue-500",
      badge: "Popular"
    },
    {
      title: "Goal Achievement Template",
      description: "Proven framework for setting and achieving your goals",
      type: "Template",
      size: "156 KB",
      downloads: "8,230",
      rating: 4.8,
      icon: Target,
      color: "bg-green-500"
    },
    {
      title: "Leadership Assessment Tool",
      description: "Evaluate and develop your leadership capabilities",
      type: "Interactive Tool",
      size: "1.2 MB",
      downloads: "5,670",
      rating: 4.7,
      icon: Users,
      color: "bg-purple-500",
      badge: "New"
    },
    {
      title: "Habit Formation Workbook",
      description: "Transform your daily routines for lasting success",
      type: "Workbook",
      size: "3.1 MB",
      downloads: "9,120",
      rating: 4.9,
      icon: TrendingUp,
      color: "bg-orange-500"
    },
    {
      title: "Mindset Mastery Video Series",
      description: "5-part video series on developing a growth mindset",
      type: "Video Series",
      size: "45 MB",
      downloads: "6,890",
      rating: 4.8,
      icon: Video,
      color: "bg-pink-500"
    },
    {
      title: "Success Stories Collection",
      description: "Inspiring stories from people who transformed their lives",
      type: "E-book",
      size: "4.2 MB",
      downloads: "7,340",
      rating: 4.9,
      icon: Star,
      color: "bg-yellow-500"
    },
    {
      title: "Time Management Framework",
      description: "Optimize your productivity with proven time management techniques",
      type: "Framework",
      size: "890 KB",
      downloads: "4,560",
      rating: 4.6,
      icon: Clock,
      color: "bg-indigo-500"
    },
    {
      title: "Communication Skills Guide",
      description: "Master the art of effective communication in all situations",
      type: "Guide",
      size: "1.8 MB",
      downloads: "3,210",
      rating: 4.7,
      icon: Eye,
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Resources</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of guides, templates, and tools designed to help you unlock your full potential and achieve remarkable transformations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Download className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </Card>
          <Card className="p-6 text-center">
            <FileText className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">25+</div>
            <div className="text-sm text-gray-600">Resources Available</div>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Free Access</div>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.color} text-white`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                {resource.badge && (
                  <Badge variant={resource.badge === "Popular" ? "default" : "secondary"}>
                    {resource.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{resource.type}</span>
                  <span>•</span>
                  <span>{resource.size}</span>
                  <span>•</span>
                  <span>{resource.downloads} downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{resource.rating}</span>
                </div>
              </div>
              
              <Button className="w-full" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Free
              </Button>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guides & Manuals</h3>
              <p className="text-sm text-gray-600 mb-4">Step-by-step instructions for personal development</p>
              <Badge variant="outline">12 Resources</Badge>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Templates & Tools</h3>
              <p className="text-sm text-gray-600 mb-4">Ready-to-use frameworks and assessment tools</p>
              <Badge variant="outline">8 Resources</Badge>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <Video className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Content</h3>
              <p className="text-sm text-gray-600 mb-4">Visual learning materials and tutorials</p>
              <Badge variant="outline">5 Resources</Badge>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Award className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Need Personalized Guidance?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              While our resources are comprehensive, nothing beats personalized guidance from our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Book Consultation
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Join Community
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 