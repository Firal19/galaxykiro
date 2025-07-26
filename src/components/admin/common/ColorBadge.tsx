'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type BadgeVariant = 
  | 'visitor'
  | 'cold_lead'
  | 'candidate'
  | 'hot_lead'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'high'
  | 'medium'
  | 'low'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'

export interface ColorBadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const badgeStyles: Record<BadgeVariant, string> = {
  // Lead status colors
  visitor: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  cold_lead: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  candidate: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  hot_lead: 'bg-red-100 text-red-800 hover:bg-red-200',
  
  // Status colors
  active: 'bg-green-100 text-green-800 hover:bg-green-200',
  inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  approved: 'bg-green-100 text-green-800 hover:bg-green-200',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
  
  // Priority colors
  high: 'bg-red-100 text-red-800 hover:bg-red-200',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  low: 'bg-green-100 text-green-800 hover:bg-green-200',
  
  // Semantic colors
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  
  // Default
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  default: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
}

export function ColorBadge({ 
  variant, 
  children, 
  className, 
  size = 'default' 
}: ColorBadgeProps) {
  return (
    <Badge
      className={cn(
        'font-medium border-0 transition-colors',
        badgeStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Badge>
  )
}

// Utility functions for common badge patterns
export function getLeadStatusBadge(status: string) {
  const statusMap: Record<string, BadgeVariant> = {
    visitor: 'visitor',
    cold_lead: 'cold_lead',
    candidate: 'candidate',
    hot_lead: 'hot_lead',
  }
  return statusMap[status.toLowerCase()] || 'default'
}

export function getStatusBadge(status: string) {
  const statusMap: Record<string, BadgeVariant> = {
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  }
  return statusMap[status.toLowerCase()] || 'default'
}

export function getPriorityBadge(priority: string | number) {
  if (typeof priority === 'number') {
    if (priority >= 80) return 'high'
    if (priority >= 50) return 'medium'
    return 'low'
  }
  
  const priorityMap: Record<string, BadgeVariant> = {
    high: 'high',
    medium: 'medium',
    low: 'low',
    urgent: 'danger',
    critical: 'danger',
  }
  return priorityMap[priority.toLowerCase()] || 'default'
}

// Preset badge components
export function LeadStatusBadge({ status }: { status: string }) {
  const variant = getLeadStatusBadge(status)
  const labels: Record<BadgeVariant, string> = {
    visitor: 'Visitor',
    cold_lead: 'Cold Lead',
    candidate: 'Candidate', 
    hot_lead: 'Hot Lead',
    // Add other mappings
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    success: 'Success',
    warning: 'Warning',
    danger: 'Danger',
    info: 'Info',
    default: 'Default',
  }
  
  return (
    <ColorBadge variant={variant}>
      {labels[variant] || status}
    </ColorBadge>
  )
}

export function EngagementScoreBadge({ score }: { score: number }) {
  let variant: BadgeVariant = 'low'
  let label = 'Low'
  
  if (score >= 80) {
    variant = 'success'
    label = 'Excellent'
  } else if (score >= 60) {
    variant = 'info'
    label = 'Good'
  } else if (score >= 40) {
    variant = 'warning'
    label = 'Fair'
  } else {
    variant = 'danger'
    label = 'Poor'
  }
  
  return (
    <ColorBadge variant={variant}>
      {score} - {label}
    </ColorBadge>
  )
}

export function ConversionProbabilityBadge({ probability }: { probability: number }) {
  const percentage = Math.round(probability * 100)
  let variant: BadgeVariant = 'low'
  
  if (percentage >= 70) {
    variant = 'success'
  } else if (percentage >= 40) {
    variant = 'warning'
  } else {
    variant = 'danger'
  }
  
  return (
    <ColorBadge variant={variant}>
      {percentage}%
    </ColorBadge>
  )
}