'use client'

import { Suspense } from 'react'
import { SoftMemberLayout } from '@/components/layouts/soft-member-layout'
import { PageSkeleton } from '@/components/ui/loading-skeleton'
import { Toaster } from '@/components/ui/toaster'

export default function SoftMemberRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SoftMemberLayout>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
      <Toaster />
    </SoftMemberLayout>
  )
}