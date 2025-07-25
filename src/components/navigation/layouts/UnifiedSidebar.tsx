/**
 * UnifiedSidebar - Sidebar navigation for member and admin layouts
 */

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Menu, X, Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { NavigationProvider, useNavigation, useNavigationGroups } from '../core/NavigationContext'
import { NavigationGroup } from '../components/NavigationGroup'
import { LayoutVariant, NavigationUser } from '../core/NavigationTypes'
import { useAuthService } from '@/components/providers/ServiceProvider'

interface UnifiedSidebarProps {
  variant: LayoutVariant
  user?: NavigationUser
  children: React.ReactNode
  className?: string
}

function SidebarContent({ variant, user, children, className }: UnifiedSidebarProps) {
  const { state, actions, config } = useNavigation()
  const groups = useNavigationGroups()
  const authService = useAuthService()

  const handleSignOut = async () => {
    await authService.signOut()
    window.location.href = '/'
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
        state.isCollapsed ? "w-16" : "w-64",
        "lg:translate-x-0",
        state.isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-border",
          state.isCollapsed && "justify-center"
        )}>
          {!state.isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Galaxy Kiro
              </div>
            </Link>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Collapse Toggle (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.toggleCollapse}
              className="hidden lg:flex"
            >
              <ChevronLeft className={cn(
                "w-4 h-4 transition-transform",
                state.isCollapsed && "rotate-180"
              )} />
            </Button>
            
            {/* Close Button (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.toggleOpen}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {user && !state.isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                {user.status && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {user.status}
                  </Badge>
                )}
              </div>
              {user.notifications && user.notifications > 0 && (
                <div className="relative">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {user.notifications > 9 ? '9+' : user.notifications}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {groups.map((group) => (
            <NavigationGroup
              key={group.id}
              group={group}
              variant="sidebar"
              showIcons={true}
              showBadges={true}
              showDescriptions={false}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          {state.isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {state.isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={actions.toggleOpen}
        />
      )}

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        state.isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.toggleOpen}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="text-lg font-semibold">
            {variant === 'member' ? 'Member Portal' : 'Admin Panel'}
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Main component with provider
export function UnifiedSidebar(props: UnifiedSidebarProps) {
  return (
    <NavigationProvider variant={props.variant} context="sidebar" user={props.user}>
      <SidebarContent {...props} />
    </NavigationProvider>
  )
}