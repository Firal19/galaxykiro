'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, Clock, Zap, Target, BookOpen, Download, Share2, ArrowRight, 
  CheckCircle, TrendingUp, Brain, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo'

export default function VisionVoidLearnMorePage() {
  const handleCTAClick = (ctaType: string, ctaText: string) => {
    console.log('CTA clicked:', { ctaType, ctaText })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <GalaxyDreamTeamLogo className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Galaxy Dream Team</span>
            </Link>
            <Link href="/vision-void">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vision Void
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Eye className="h-4 w-4 mr-2" />
              Vision & Future Planning Framework
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Vision Void Framework
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Discover how to bridge the gap between your current reality and your ideal future through strategic vision planning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-purple-50"
                onClick={() => handleCTAClick('get-started', 'Get Started with Vision Void')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Your Vision Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleCTAClick('download-guide', 'Download Vision Guide')}
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
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Psychology of Vision</h2>
              </div>
              <p className="text-gray-600 mb-4">
                The gap between where you are and where you want to be can feel overwhelming. 
                The Vision Void framework helps you systematically bridge this gap by breaking 
                down your vision into actionable steps.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Clarify your ideal future state with precision</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Identify the gaps between current and desired reality</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create systematic bridges to close the vision void</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Three Void Bridges</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our framework identifies three critical bridges that connect your current reality 
                to your ideal future.
              </p>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clarity Bridge</h4>
                    <p className="text-sm text-gray-600">Define your vision with crystal clarity</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Action Bridge</h4>
                    <p className="text-sm text-gray-600">Create systematic action plans</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Momentum Bridge</h4>
                    <p className="text-sm text-gray-600">Build sustainable progress systems</p>
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
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Vision Achievement</h2>
              </div>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                  <div className="text-gray-600">Vision clarity improvement</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 mb-2">3.8x</div>
                  <div className="text-gray-600">Faster goal achievement</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">91%</div>
                  <div className="text-gray-600">Increased motivation</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Start Your Vision Journey</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Join thousands of visionaries who have transformed their futures 
                and achieved their dreams with our framework.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                  onClick={() => handleCTAClick('start-assessment', 'Start Vision Assessment')}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Take Vision Assessment
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
              Ready to Bridge Your Vision Void?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Stop dreaming and start achieving. Transform your vision into reality 
              with systematic planning and strategic action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleCTAClick('final-cta', 'Start Vision Void Journey')}
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

 