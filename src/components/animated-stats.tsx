'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { Users, TrendingUp, Award, Target } from 'lucide-react'

interface Stat {
  label: string
  value: number
  suffix: string
  icon: React.ComponentType<any>
  color: string
}

const stats: Stat[] = [
  {
    label: 'Active Members',
    value: 15000,
    suffix: '+',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Success Rate',
    value: 94,
    suffix: '%',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Assessments Completed',
    value: 50000,
    suffix: '+',
    icon: Award,
    color: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Average Score Improvement',
    value: 78,
    suffix: '%',
    icon: Target,
    color: 'from-orange-500 to-red-500'
  }
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(value)
      setHasAnimated(true)
    }
  }, [isInView, spring, value, hasAnimated])

  return (
    <span ref={ref} className="font-bold text-4xl md:text-5xl">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

export function AnimatedStats() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Champions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our growing community of individuals who have transformed their lives through our proven assessment tools and methodologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                  
                  {/* Decorative gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}