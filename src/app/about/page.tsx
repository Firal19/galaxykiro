"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Heart,
  Target,
  Users,
  Globe,
  Award,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Transforming Lives Across Ethiopia
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Galaxy Dream Team is on a mission to unlock the hidden potential in every Ethiopian through 
            science-backed personal development and transformative education.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
              <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To empower every Ethiopian with the tools, knowledge, and mindset needed to unlock their 
                full potential and create extraordinary lives through progressive personal development.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900 dark:to-yellow-900">
              <Globe className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A transformed Ethiopia where every individual operates at their highest potential, 
                creating ripple effects of positive change in families, communities, and the nation.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authentic Transformation',
                description: 'We believe in genuine, lasting change that comes from within, not surface-level quick fixes.'
              },
              {
                icon: Users,
                title: 'Community Impact',
                description: 'Personal growth creates ripple effects. When one person transforms, entire communities benefit.'
              },
              {
                icon: Award,
                title: 'Excellence & Integrity',
                description: 'We deliver world-class content with Ethiopian context, maintaining the highest ethical standards.'
              }
            ].map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '50,000+', label: 'Lives Transformed' },
                { number: '15+', label: 'Assessment Tools' },
                { number: '94%', label: 'Success Rate' },
                { number: '7', label: 'Cities Reached' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopians who have discovered their potential and are living extraordinary lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Star className="mr-2 w-5 h-5" />
                Take Free Assessment
              </Button>
            </Link>
            <Link href="/office-visit">
              <Button size="lg" variant="outline">
                Book Office Visit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}