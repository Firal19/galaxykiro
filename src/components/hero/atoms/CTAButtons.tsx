/**
 * CTAButtons - Call to action buttons component
 */

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

interface CTAButtonsProps {
  onDiscoverClick: () => void
  onLearnMoreClick: () => void
  className?: string
}

export function CTAButtons({ onDiscoverClick, onLearnMoreClick, className }: CTAButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={`flex flex-col sm:flex-row gap-4 ${className}`}
    >
      <Button
        size="lg"
        onClick={onDiscoverClick}
        className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
        Discover Your Hidden 90%
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={onLearnMoreClick}
        className="group border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 px-8 py-4 text-lg font-semibold hover:bg-purple-50 transition-all duration-300"
      >
        Learn How It Works
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  )
}