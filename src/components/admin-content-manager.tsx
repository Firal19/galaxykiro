"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'

export function AdminContentManager() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Management System
            </h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
        
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Content Management System
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create, edit, and manage all content including articles, videos, assessments, and announcements. 
            Organize content by packages and target specific member tiers.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Content Library</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage all content pieces</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Publishing Calendar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Schedule content releases</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">A/B Testing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Test content performance</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}