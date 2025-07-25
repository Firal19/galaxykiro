/**
 * SoftMemberLayout - Simplified layout using unified navigation
 */

"use client"

import { useEffect, useState } from 'react'
import { useSoftMembership } from '@/lib/hooks/use-soft-membership'
import { UnifiedSidebar } from '@/components/navigation/layouts/UnifiedSidebar'
import { NavigationUser } from '@/components/navigation/core/NavigationTypes'
import { useAuthService } from '@/components/providers/ServiceProvider'

interface SoftMemberLayoutProps {
  children: React.ReactNode
}

export function SoftMemberLayout({ children }: SoftMemberLayoutProps) {
  const { user, status, loading } = useSoftMembership()
  const [navigationUser, setNavigationUser] = useState<NavigationUser | undefined>()
  const authService = useAuthService()

  // Convert user data to navigation user format
  useEffect(() => {
    if (user) {
      const session = authService.getCurrentSession()
      setNavigationUser({
        id: user.id || 'member',
        name: user.name || user.email?.split('@')[0] || 'Member',
        email: user.email || '',
        role: 'member',
        status: status || 'active',
        notifications: 0, // TODO: Get actual notification count
        isOnline: true
      })
    }
  }, [user, status, authService])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <UnifiedSidebar
      variant="member"
      user={navigationUser}
    >
      {children}
    </UnifiedSidebar>
  )
}