/**
 * HeroStats - Statistics display component
 */

"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface HeroStatsProps {
  className?: string
}

export function HeroStats({ className }: HeroStatsProps) {
  const stats = [
    {
      key: "transformed",
      value: 15420,
      label: "Lives Transformed",
      suffix: "+"
    },
    {
      key: "success_rate", 
      value: 94,
      label: "Success Rate",
      suffix: "%"
    },
    {
      key: "countries",
      value: 23,
      label: "Countries Reached",
      suffix: ""
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className={`grid grid-cols-3 gap-8 ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <AnimatedCounter from={0} to={stat.value} duration={2000} />
            {stat.suffix}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}