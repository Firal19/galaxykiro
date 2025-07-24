"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wrench, Plus } from 'lucide-react'

export function AdminToolManager() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Wrench className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assessment Tool Manager
            </h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Tool
          </Button>
        </div>
        
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Assessment Tool Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create and manage the 15+ interactive assessment tools. Define questions, logic, 
            scoring algorithms, and access rules for each tool.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tool Builder</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create new assessment tools</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Access Control</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Define tool unlock criteria</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track tool performance</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}