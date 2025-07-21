"use client";

import { QuickLinks } from "@/components/quick-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Award, 
  TrendingUp, 
  Users, 
  Target,
  ArrowRight,
  Star,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function QuickLinksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Quick Links</h1>
            <Sparkles className="w-8 h-8 text-blue-600 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your life, all in one place. 
            Discover your potential, access resources, and connect with our community.
          </p>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <Target className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">Lives Transformed</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">90%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <Star className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <div className="text-2xl font-bold text-gray-900">1000+</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </Card>
        </div>

        {/* Quick Links Component */}
        <QuickLinks variant="default" />

        {/* Additional Sections */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Resources */}
          <Card className="p-8">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Popular Resources</h2>
            </div>
            <div className="space-y-4">
              <Link href="/tools" className="block">
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">Assessment Tools</h3>
                    <p className="text-sm text-gray-600">Discover your hidden potential</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
              <Link href="/webinars" className="block">
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Webinars</h3>
                    <p className="text-sm text-gray-600">Join expert-led sessions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
              <Link href="/content-library" className="block">
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">Content Library</h3>
                    <p className="text-sm text-gray-600">Access exclusive materials</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Get Started */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Get Started Today</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">1. Take Assessment</h3>
                <p className="text-sm text-gray-600 mb-3">Discover your hidden potential with our free assessment</p>
                <Link href="/membership/register">
                  <Button size="sm" className="w-full">
                    Start Assessment
                  </Button>
                </Link>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">2. Join Community</h3>
                <p className="text-sm text-gray-600 mb-3">Connect with like-minded individuals</p>
                <Link href="/membership/register">
                  <Button size="sm" variant="outline" className="w-full">
                    Join Free
                  </Button>
                </Link>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">3. Book Consultation</h3>
                <p className="text-sm text-gray-600 mb-3">Get personalized guidance</p>
                <Link href="/office-visit">
                  <Button size="sm" variant="outline" className="w-full">
                    Book Visit
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Award className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of people who have already discovered their hidden potential and achieved remarkable transformations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/office-visit">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 