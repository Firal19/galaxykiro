'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">15,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">5 Min Assessments</span>
            </div>
          </div>

          {/* Main content */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Unlock Your
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Hidden Potential?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have discovered their true capabilities and are living their best lives.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/tools/potential-quotient-calculator">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-white/90 min-w-[250px] text-lg h-14 shadow-xl hover:shadow-2xl transition-all"
              >
                Start Your Free Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/member">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 min-w-[200px] text-lg h-14"
              >
                Join Community
              </Button>
            </Link>
          </div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-white/80"
          >
            <p>✓ No credit card required &nbsp;&nbsp; ✓ 100% Free &nbsp;&nbsp; ✓ Instant results</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
    </section>
  )
}