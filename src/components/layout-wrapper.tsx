"use client"

// LayoutWrapper now serves as a simple pass-through container
// All navigation is handled by individual layouts:
// - PublicLayout for public pages (uses MainNav)
// - AdminLayout for admin pages (uses UnifiedSidebar)
// - SoftMemberLayout for member pages (uses UnifiedSidebar)

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // Simply pass through children - layouts handle their own navigation
  return <>{children}</>
}