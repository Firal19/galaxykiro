/**
 * QuickAccessButtons - Development bypass buttons
 */

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface QuickAccessButtonsProps {
  className?: string
}

export function QuickAccessButtons({ className }: QuickAccessButtonsProps) {
  const handleQuickAccess = (type: 'admin' | 'member') => {
    window.location.href = type === 'admin' ? '/admin/dashboard' : '/soft-member/dashboard'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className={`flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0 sm:mr-4 flex items-center">
        🚀 Quick Access:
      </div>
      <Button
        variant="outline" 
        size="sm"
        onClick={() => handleQuickAccess('admin')}
        className="text-sm px-6 py-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 font-semibold transition-all duration-200"
      >
        🔐 Admin Panel
      </Button>
      <Button
        variant="outline"
        size="sm" 
        onClick={() => handleQuickAccess('member')}
        className="text-sm px-6 py-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 font-semibold transition-all duration-200"
      >
        👤 Member Area
      </Button>
    </motion.div>
  )
}