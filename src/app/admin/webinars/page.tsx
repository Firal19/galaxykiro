"use client"

import { WebinarDashboard } from '@/components/admin/webinar-dashboard'

export default function AdminWebinarsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <WebinarDashboard />
      </div>
    </div>
  )
}