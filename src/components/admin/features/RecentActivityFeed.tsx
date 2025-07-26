'use client'

import { formatDistanceToNow } from 'date-fns'
import { ColorBadge, getPriorityBadge } from '@/components/admin/common/ColorBadge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  UserPlus, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'

interface Activity {
  id: string
  type: 'lead_created' | 'status_change' | 'tool_completion' | 'conversion'
  description: string
  timestamp: string
  userId?: string
}

interface RecentActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

const activityIcons = {
  lead_created: UserPlus,
  status_change: TrendingUp,
  tool_completion: CheckCircle,
  conversion: ArrowRight,
}

const activityColors = {
  lead_created: 'info',
  status_change: 'warning', 
  tool_completion: 'success',
  conversion: 'success',
} as const

export default function RecentActivityFeed({ 
  activities, 
  maxItems = 10 
}: RecentActivityFeedProps) {
  const recentActivities = activities.slice(0, maxItems)

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-80">
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const Icon = activityIcons[activity.type]
          const colorVariant = activityColors[activity.type]
          
          return (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-full ${
                colorVariant === 'info' ? 'bg-blue-100 text-blue-600' :
                colorVariant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-2 mt-1">
                  <ColorBadge variant={colorVariant} size="sm">
                    {activity.type.replace('_', ' ')}
                  </ColorBadge>
                  
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </span>
                  
                  {activity.userId && (
                    <span className="text-xs text-gray-400">
                      • User {activity.userId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}