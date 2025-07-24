"use client"

import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}