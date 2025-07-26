'use client'

import { cn } from '@/lib/utils'

export interface LoadingSkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'table' | 'chart' | 'text'
  rows?: number
  columns?: number
}

export function LoadingSkeleton({
  className,
  variant = 'default',
  rows = 1,
  columns = 1,
}: LoadingSkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded'

  switch (variant) {
    case 'card':
      return (
        <div className={cn('p-6 border rounded-lg', className)}>
          <div className="space-y-4">
            <div className={cn(baseClass, 'h-6 w-1/3')} />
            <div className={cn(baseClass, 'h-4 w-2/3')} />
            <div className="pt-2">
              <div className={cn(baseClass, 'h-8 w-full')} />
            </div>
          </div>
        </div>
      )

    case 'table':
      return (
        <div className={cn('border rounded-lg overflow-hidden', className)}>
          {/* Table Header */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, i) => (
                <div key={`header-${i}`} className={cn(baseClass, 'h-4')} />
              ))}
            </div>
          </div>
          {/* Table Rows */}
          <div className="divide-y">
            {[...Array(rows)].map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="p-4">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                  {[...Array(columns)].map((_, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={cn(baseClass, 'h-4', colIndex === 0 && 'w-3/4')}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className={cn('p-6 border rounded-lg', className)}>
          <div className="space-y-4">
            {/* Chart Title */}
            <div className="flex items-center justify-between">
              <div className={cn(baseClass, 'h-6 w-1/4')} />
              <div className={cn(baseClass, 'h-8 w-24')} />
            </div>
            {/* Chart Area */}
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between gap-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(baseClass, 'flex-1')}
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn(baseClass, 'h-3 w-3')} />
                  <div className={cn(baseClass, 'h-3 w-16')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className={cn('space-y-2', className)}>
          {[...Array(rows)].map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClass,
                'h-4',
                i === rows - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      )

    default:
      return <div className={cn(baseClass, 'h-32 w-full', className)} />
  }
}

// Composite loading skeletons for common patterns
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="chart" />
      </div>
      
      {/* Table */}
      <LoadingSkeleton variant="table" rows={5} columns={4} />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 rounded h-8 w-1/3" />
        <div className="animate-pulse bg-gray-200 rounded h-4 w-2/3" />
      </div>
      
      {/* Content */}
      <DashboardSkeleton />
    </div>
  )
}