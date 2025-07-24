"use client"

import { usePathname } from 'next/navigation'
import { MainNavigation } from './main-navigation'
import { MemberNavigation } from './member-navigation'
import { AdminNavigation } from './admin-navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Determine which navigation to show based on the current path
  const isAdminRoute = pathname.startsWith('/admin')
  const isMemberRoute = pathname.startsWith('/membership')
  const isAuthRoute = pathname.startsWith('/auth')
  
  // Don't show navigation on auth pages
  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      {isAdminRoute ? (
        <AdminNavigation />
      ) : isMemberRoute ? (
        <MemberNavigation />
      ) : (
        <MainNavigation />
      )}
      <div className={isAdminRoute ? 'pt-16' : isMemberRoute ? 'pt-16' : ''}>
        {children}
      </div>
    </>
  )
}