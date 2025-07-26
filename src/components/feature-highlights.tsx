'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on advanced psychological assessment algorithms.',
    color: 'from-purple-500 to-pink-500',
    link: '/tools/potential-quotient-calculator'
  },
  {
    icon: Target,
    title: 'Goal Achievement',
    description: 'Set, track, and achieve your personal and professional goals with our proven framework.',
    color: 'from-blue-500 to-cyan-500',
    link: '/success-gap'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with like-minded individuals on similar transformation journeys.',
    color: 'from-green-500 to-emerald-500',
    link: '/member'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your growth with detailed analytics and progress reports.',
    color: 'from-orange-500 to-red-500',
    link: '/soft-member/dashboard'
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Earn certificates as you complete assessments and achieve milestones.',
    color: 'from-indigo-500 to-purple-500',
    link: '/soft-member/achievements'
  },
  {
    icon: Zap,
    title: 'Quick Results',
    description: 'Get instant, actionable insights from our 5-minute assessment tools.',
    color: 'from-yellow-500 to-orange-500',
    link: '/tools'
  }
]

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Galaxy Kiro?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for personal transformation and growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  {/* Icon with gradient background */}
                  <div className="mb-6 relative">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Learn more link */}
                  <Link 
                    href={feature.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                  >
                    Learn more 
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/tools">
              <Button size="lg" className="min-w-[200px]">
                Explore All Features
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}