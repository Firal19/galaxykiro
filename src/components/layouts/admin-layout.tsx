/**
 * AdminLayout - Simplified admin layout using unified navigation
 */

"use client"

import { useEffect, useState } from 'react'
import { UnifiedSidebar } from '@/components/navigation/layouts/UnifiedSidebar'
import { NavigationUser } from '@/components/navigation/core/NavigationTypes'
import { useAuthService } from '@/components/providers/ServiceProvider'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [navigationUser, setNavigationUser] = useState<NavigationUser | undefined>()
  const authService = useAuthService()

  // Get admin user data
  useEffect(() => {
    const session = authService.getCurrentSession()
    if (session) {
      setNavigationUser({
        id: session.userId,
        name: session.email.split('@')[0] || 'Admin',
        email: session.email,
        role: 'admin',
        status: 'admin',
        notifications: 5, // TODO: Get actual notification count
        isOnline: true
      })
    }
  }, [authService])

  return (
    <UnifiedSidebar
      variant="admin"
      user={navigationUser}
    >
      {children}
    </UnifiedSidebar>
  )
}