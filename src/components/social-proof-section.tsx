"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote, TrendingUp, Users, Award, CheckCircle } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Sarah Tesfaye",
    title: "Marketing Director, Addis Ababa",
    avatar: "/testimonials/sarah.jpg",
    rating: 5,
    quote: "The Potential Quotient Calculator revealed hidden strengths I never knew I had. Within 3 months, I got promoted to a leadership role I thought was years away.",
    result: "Promoted to Senior Director",
    timeframe: "3 months"
  },
  {
    id: 2,
    name: "Daniel Mulugeta",
    title: "Entrepreneur, Dire Dawa",
    avatar: "/testimonials/daniel.jpg", 
    rating: 5,
    quote: "The Goal Achievement Predictor was eerily accurate. It predicted I'd struggle with consistency, and gave me the exact tools to overcome it. My business revenue doubled.",
    result: "200% Revenue Growth",
    timeframe: "6 months"
  },
  {
    id: 3,
    name: "Hanan Mohammed",
    title: "Software Engineer, Bahir Dar",
    avatar: "/testimonials/hanan.jpg",
    rating: 5,
    quote: "I was skeptical about personal development tools, but the Transformation Readiness Score changed my perspective. It prepared me for changes I didn't even know I needed.",
    result: "Career Transition to Tech Lead",
    timeframe: "4 months"
  },
  {
    id: 4,
    name: "Yohannes Bekele",
    title: "University Professor, Mekelle",
    avatar: "/testimonials/yohannes.jpg",
    rating: 5,
    quote: "The Leadership Style Profiler transformed how I interact with my students and colleagues. My teaching evaluations improved dramatically, and I feel more confident as an educator.",
    result: "Outstanding Professor Award",
    timeframe: "1 semester"
  },
  {
    id: 5,
    name: "Meron Assefa",
    title: "HR Manager, Hawassa",
    avatar: "/testimonials/meron.jpg",
    rating: 5,
    quote: "The insights from these tools helped me understand not just myself, but how to better support my team. Our department's productivity increased by 40% this quarter.",
    result: "40% Team Productivity Increase",
    timeframe: "3 months"
  },
  {
    id: 6,
    name: "Kaleab Girma",
    title: "Small Business Owner, Jimma",
    avatar: "/testimonials/kaleab.jpg",
    rating: 5,
    quote: "I was struggling to grow my business beyond a certain point. The assessment tools helped me identify limiting beliefs and develop new strategies. Now I'm expanding to two new cities.",
    result: "Business Expansion to 3 Cities",
    timeframe: "8 months"
  }
]

const stats = [
  {
    number: "50,000+",
    label: "Lives Transformed",
    description: "People who discovered their potential",
    icon: Users
  },
  {
    number: "94%",
    label: "Success Rate",
    description: "Report significant positive changes",
    icon: TrendingUp
  },
  {
    number: "4.9/5",
    label: "Average Rating",
    description: "From over 12,000 reviews",
    icon: Star
  },
  {
    number: "15+",
    label: "Assessment Tools",
    description: "Scientifically-backed instruments",
    icon: Award
  }
]

export function SocialProofSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-200">Proven Results</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Real People, Real Transformations
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Ethiopians who have unlocked their potential and transformed their lives through our proven assessment tools and guidance.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 p-8 relative overflow-hidden">
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200 dark:text-blue-700" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Result Badge */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg p-3 mb-6">
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200">
                    ✨ Result: {testimonial.result}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Achieved in {testimonial.timeframe}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="testimonialPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#testimonialPattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Your Transformation Story Starts Here
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join the community of achievers who discovered their potential and built extraordinary lives
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-lg font-semibold">
                  <Users className="w-6 h-6 mr-2" />
                  <span>Join 50,000+ Members</span>
                </div>
                <div className="flex items-center text-lg font-semibold">
                  <Star className="w-6 h-6 mr-2 text-yellow-300" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center text-lg font-semibold">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-300" />
                  <span>94% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}