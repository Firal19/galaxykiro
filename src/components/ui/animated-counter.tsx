"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  from, 
  to, 
  duration = 2000, 
  suffix = "", 
  className = "" 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
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

    const element = document.getElementById(`counter-${from}-${to}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [from, to, isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = from
    const endValue = to
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
  }, [isVisible, from, to, duration])

  return (
    <motion.span
      id={`counter-${from}-${to}`}
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: isVisible ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {count}{suffix}
    </motion.span>
  )
}