"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  from?: number
  to?: number
  value?: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  from = 0, 
  to, 
  value,
  duration = 2000, 
  suffix = "", 
  className = "" 
}: AnimatedCounterProps) {
  // Handle both value prop and from/to props
  const startValue = from
  const endValue = value !== undefined ? value : to || 0
  
  const [count, setCount] = useState(startValue)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`counter-${startValue}-${endValue}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [startValue, endValue, isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const totalChange = endValue - startValue

    const updateCounter = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (totalChange * easeOutQuart)
      
      setCount(Math.round(currentValue))

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [isVisible, startValue, endValue, duration])

  return (
    <motion.span
      id={`counter-${startValue}-${endValue}`}
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: isVisible ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {count}{suffix}
    </motion.span>
  )
}