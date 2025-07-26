'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  Plus,
  Download,
  MessageSquare,
  Zap
} from 'lucide-react'

const quickActions = [
  {
    id: 'new-lead',
    title: 'Add Lead',
    description: 'Manually add a new lead',
    icon: Plus,
    href: '/admin/leads/new',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'view-leads',
    title: 'Manage Leads',
    description: 'View and manage all leads',
    icon: Users,
    href: '/admin/leads',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Detailed analytics dashboard',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'content',
    title: 'Manage Content',
    description: 'Create and edit content',
    icon: FileText,
    href: '/admin/content',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    id: 'export',
    title: 'Export Data',
    description: 'Download reports and data',
    icon: Download,
    href: '/admin/export',
    color: 'bg-gray-500 hover:bg-gray-600',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'System configuration',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-slate-500 hover:bg-slate-600',
  },
]

export default function QuickActionCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {quickActions.map((action) => {
        const Icon = action.icon
        
        return (
          <Link key={action.id} href={action.href}>
            <Button
              variant="ghost"
              className="w-full h-auto p-4 flex items-start gap-3 text-left hover:bg-gray-50"
            >
              <div className={`p-2 rounded-lg text-white ${action.color} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">
                  {action.title}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {action.description}
                </div>
              </div>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}