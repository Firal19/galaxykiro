/**
 * HeroContent - Main hero content with title, subtitle, and CTA
 */

"use client"

import { motion } from "framer-motion"
import { CTAButtons } from "../atoms/CTAButtons"
import { HeroStats } from "../atoms/HeroStats"
import { QuickAccessButtons } from "../atoms/QuickAccessButtons"

interface HeroContentProps {
  onDiscoverClick: () => void
  onLearnMoreClick: () => void
  className?: string
}

export function HeroContent({ onDiscoverClick, onLearnMoreClick, className }: HeroContentProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="text-gray-900 dark:text-white">
            What if you're only using{" "}
          </span>
          <span className="text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            10% of your true potential?
          </span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl"
        >
          Most people never discover their hidden strengths. Our assessment reveals what's possible when you unlock your full potential.
        </motion.p>
      </motion.div>

      {/* CTA Buttons */}
      <CTAButtons 
        onDiscoverClick={onDiscoverClick}
        onLearnMoreClick={onLearnMoreClick}
      />

      {/* Stats */}
      <HeroStats />

      {/* Quick Access (Development) */}
      <QuickAccessButtons />
    </div>
  )
}