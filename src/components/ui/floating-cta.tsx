'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the CTA
    const dismissed = localStorage.getItem('floating_cta_dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show CTA after scrolling 30% of the page
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100
      if (scrollPercentage > 30 && !isVisible) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('floating_cta_dismissed', 'true')
  }

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Ready to Transform?</h3>
                <p className="text-sm text-white/90 mb-3">
                  Take your first assessment and unlock your potential in just 5 minutes.
                </p>
                <Link href="/tools">
                  <Button 
                    size="sm" 
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    Start Free Assessment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}