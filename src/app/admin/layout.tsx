'use client'

import { Suspense } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { PageSkeleton } from '@/components/admin/common/LoadingSkeleton'
import { Toaster } from '@/components/ui/toaster'
import { AdminErrorBoundary } from '@/components/ErrorBoundary'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminErrorBoundary>
      <AdminLayout>
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
        <Toaster />
      </AdminLayout>
    </AdminErrorBoundary>
  )
}