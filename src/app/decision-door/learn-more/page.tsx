'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DoorOpen, Clock, Zap, Target, BookOpen, Download, Share2, ArrowRight, 
  CheckCircle, TrendingUp, Brain, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo'

export default function DecisionDoorLearnMorePage() {
  const handleCTAClick = (ctaType: string, ctaText: string) => {
    console.log('CTA clicked:', { ctaType, ctaText })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <GalaxyDreamTeamLogo className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Galaxy Dream Team</span>
            </Link>
            <Link href="/decision-door">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Decision Door
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <DoorOpen className="h-4 w-4 mr-2" />
              Decision Making Framework
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Decision Door Framework
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover how to make better decisions faster and with more confidence using our proven psychological framework
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => handleCTAClick('get-started', 'Get Started with Decision Door')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Your Decision Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleCTAClick('download-guide', 'Download Decision Guide')}
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
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Psychology Behind Decisions</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Every decision you make is influenced by cognitive biases, emotional states, and environmental factors. 
                The Decision Door framework helps you recognize these influences and make more rational choices.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Identify cognitive biases that cloud your judgment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Separate emotions from facts in decision-making</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create systematic approaches to complex choices</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Three Door Method</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our framework presents every decision as three doors, each representing different approaches 
                and potential outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Door of Analysis</h4>
                    <p className="text-sm text-gray-600">Data-driven, logical decision making</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Door of Intuition</h4>
                    <p className="text-sm text-gray-600">Gut feeling and experience-based choices</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Door of Collaboration</h4>
                    <p className="text-sm text-gray-600">Seeking input and diverse perspectives</p>
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
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Proven Results</h2>
              </div>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                  <div className="text-gray-600">Better decision confidence</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3.2x</div>
                  <div className="text-gray-600">Faster decision making</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                  <div className="text-gray-600">Reduced decision regret</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Get Started Today</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Join thousands of professionals who have transformed their decision-making 
                process with our framework.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                  onClick={() => handleCTAClick('start-assessment', 'Start Decision Assessment')}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Take Decision Assessment
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
              Ready to Transform Your Decision Making?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Stop second-guessing yourself. Start making confident, informed decisions 
              that align with your goals and values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCTAClick('final-cta', 'Start Decision Door Journey')}
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

 