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
        {/* Enhanced Sidebar Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50",
          state.isCollapsed && "justify-center"
        )}>
          {!state.isCollapsed && (
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-sm">GK</span>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity -z-10"></div>
              </motion.div>
              <motion.div
                whileHover={{ x: 2 }}
                className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent"
              >
                Galaxy Kiro
              </motion.div>
            </Link>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Enhanced Collapse Toggle (Desktop) */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.toggleCollapse}
                className="hidden lg:flex hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: state.isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
            
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

        {/* Enhanced User Profile */}
        {user && !state.isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-border/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
          >
            <div className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full shadow-md group-hover:shadow-lg transition-shadow"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="font-semibold text-white text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                {user.badge ? (
                  <Badge variant="secondary" className="text-xs mt-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                    {user.badge}
                  </Badge>
                ) : user.status && (
                  <Badge variant="secondary" className="text-xs mt-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                    {user.status}
                  </Badge>
                )}
              </div>
              {user.notifications && user.notifications > 0 && (
                <motion.div 
                  className="relative"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
                    {user.notifications > 9 ? '9+' : user.notifications}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
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

        {/* Enhanced Sidebar Footer */}
        <div className="p-4 border-t border-border/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
          {state.isCollapsed ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-center hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-600 transition-all duration-200 group"
              >
                <motion.div
                  whileHover={{ x: 2 }}
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span>Sign Out</span>
                </motion.div>
              </Button>
            </motion.div>
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
        {/* Enhanced Top Bar (Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30 shadow-sm">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.toggleOpen}
              className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: state.isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            </Button>
          </motion.div>
          
          <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {variant === 'member' ? 'Member Portal' : 'Admin Panel'}
          </div>
          
          {user && user.notifications && user.notifications > 0 ? (
            <motion.div 
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Bell className="w-6 h-6 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
                {user.notifications > 9 ? '9+' : user.notifications}
              </span>
            </motion.div>
          ) : (
            <div className="w-10" />
          )}
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