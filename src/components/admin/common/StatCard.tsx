'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label?: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  onClick?: () => void
}

const variantStyles = {
  default: {
    icon: 'text-gray-600 bg-gray-100',
    trend: 'text-gray-600',
  },
  success: {
    icon: 'text-green-600 bg-green-100',
    trend: 'text-green-600',
  },
  warning: {
    icon: 'text-yellow-600 bg-yellow-100',
    trend: 'text-yellow-600',
  },
  danger: {
    icon: 'text-red-600 bg-red-100',
    trend: 'text-red-600',
  },
  info: {
    icon: 'text-blue-600 bg-blue-100',
    trend: 'text-blue-600',
  },
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  className,
  onClick,
}: StatCardProps) {
  const styles = variantStyles[variant]
  
  const renderTrendIcon = () => {
    if (!trend) return null
    
    if (trend.value > 0) {
      return <TrendingUp className="w-4 h-4" />
    } else if (trend.value < 0) {
      return <TrendingDown className="w-4 h-4" />
    } else {
      return <Minus className="w-4 h-4" />
    }
  }

  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn('p-2 rounded-lg', styles.icon)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm', styles.trend)}>
              {renderTrendIcon()}
              <span className="font-medium">
                {trend.value > 0 && '+'}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-gray-500 text-xs">{trend.label}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Composite stat cards for common metrics
export interface MetricGroup {
  title: string
  metrics: StatCardProps[]
}

export function StatCardGrid({ metrics, columns = 4 }: { metrics: StatCardProps[]; columns?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${columns === 2 ? '300px' : '250px'}, 1fr))`,
      }}
    >
      {metrics.map((metric, index) => (
        <StatCard key={index} {...metric} />
      ))}
    </div>
  )
}

// Preset stat card configurations
export const presetMetrics = {
  leads: (count: number, trend?: number): StatCardProps => ({
    title: 'Total Leads',
    value: count.toLocaleString(),
    description: 'Active leads in pipeline',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>,
    trend: trend ? { value: trend, label: 'vs last month' } : undefined,
    variant: 'info',
  }),
  
  conversionRate: (rate: number, trend?: number): StatCardProps => ({
    title: 'Conversion Rate',
    value: `${rate.toFixed(1)}%`,
    description: 'Lead to customer conversion',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    trend: trend ? { value: trend, label: 'vs last month' } : undefined,
    variant: rate >= 10 ? 'success' : rate >= 5 ? 'warning' : 'danger',
  }),
  
  engagement: (score: number, trend?: number): StatCardProps => ({
    title: 'Avg Engagement Score',
    value: score.toFixed(0),
    description: 'Average user engagement',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    trend: trend ? { value: trend, label: 'vs last week' } : undefined,
    variant: 'warning',
  }),
  
  revenue: (amount: number, currency = '$', trend?: number): StatCardProps => ({
    title: 'Revenue',
    value: `${currency}${amount.toLocaleString()}`,
    description: 'Total revenue this period',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    trend: trend ? { value: trend, label: 'vs last month' } : undefined,
    variant: 'success',
  }),
}