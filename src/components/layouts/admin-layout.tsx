/**
 * AdminLayout - Admin layout using unified MainNav
 */

"use client"

import { MainNav } from '@/components/navigation/main-nav'
import { Footer } from '@/components/footer'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}