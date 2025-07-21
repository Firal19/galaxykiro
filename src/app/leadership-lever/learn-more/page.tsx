'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Clock, Zap, Target, BookOpen, Download, Share2, ArrowRight, 
  CheckCircle, TrendingUp, Brain, ArrowLeft, Crown
} from 'lucide-react'
import Link from 'next/link'
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo'

export default function LeadershipLeverLearnMorePage() {
  const handleCTAClick = (ctaType: string, ctaText: string) => {
    console.log('CTA clicked:', { ctaType, ctaText })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <GalaxyDreamTeamLogo className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Galaxy Dream Team</span>
            </Link>
            <Link href="/leadership-lever">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leadership Lever
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Crown className="h-4 w-4 mr-2" />
              Leadership Development Framework
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Leadership Lever Framework
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Discover how to amplify your influence and create lasting impact through strategic leadership principles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-green-50"
                onClick={() => handleCTAClick('get-started', 'Get Started with Leadership Lever')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Your Leadership Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleCTAClick('download-guide', 'Download Leadership Guide')}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Free Guide
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Psychology of Leadership</h2>
              </div>
              <p className="text-gray-600 mb-4">
                True leadership isn't about authority—it's about influence, vision, and the ability to 
                inspire others to achieve their potential. The Leadership Lever framework helps you 
                develop these essential skills.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Master the art of influence without authority</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Develop emotional intelligence and empathy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create compelling visions that inspire action</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Four Lever Principles</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our framework is built on four core principles that transform how you lead and influence others.
              </p>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Vision Lever</h4>
                    <p className="text-sm text-gray-600">Create and communicate compelling futures</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Trust Lever</h4>
                    <p className="text-sm text-gray-600">Build authentic relationships and credibility</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Growth Lever</h4>
                    <p className="text-sm text-gray-600">Develop others and create opportunities</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Impact Lever</h4>
                    <p className="text-sm text-gray-600">Create lasting change and legacy</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Leadership Impact</h2>
              </div>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                  <div className="text-gray-600">Increased team engagement</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.1x</div>
                  <div className="text-gray-600">Faster goal achievement</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                  <div className="text-gray-600">Improved team retention</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Start Your Leadership Journey</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Join thousands of leaders who have transformed their approach and 
                created lasting impact with our framework.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                  onClick={() => handleCTAClick('start-assessment', 'Start Leadership Assessment')}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Take Leadership Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={() => handleCTAClick('download-framework', 'Download Framework PDF')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Framework PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={() => handleCTAClick('book-consultation', 'Book Free Consultation')}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Book Free Consultation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Amplify Your Leadership Impact?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Stop managing and start leading. Transform your influence and create 
              lasting impact that inspires others to follow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleCTAClick('final-cta', 'Start Leadership Lever Journey')}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleCTAClick('learn-more-cta', 'Learn More About Framework')}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share This Framework
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

 