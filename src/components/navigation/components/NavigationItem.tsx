/**
 * NavigationItem - Reusable navigation item component
 */

"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavigationItem as NavigationItemType } from '../core/NavigationTypes'
import { useNavigation } from '../core/NavigationContext'

interface NavigationItemProps {
  item: NavigationItemType
  level?: number
  variant?: 'horizontal' | 'vertical' | 'dropdown'
  showIcon?: boolean
  showBadge?: boolean
  showDescription?: boolean
  className?: string
  children?: ReactNode
}

export function NavigationItem({
  item,
  level = 0,
  variant = 'vertical',
  showIcon = true,
  showBadge = true,
  showDescription = false,
  className,
  children
}: NavigationItemProps) {
  const { state, actions, analytics } = useNavigation()
  const isActive = state.activeItem === item.id
  const hasChildren = item.children && item.children.length > 0
  const isOpen = hasChildren && state.openGroups.includes(`item-${item.id}`)

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && !item.href) {
      e.preventDefault()
      actions.toggleGroup(`item-${item.id}`)
      return
    }

    // Track click
    analytics?.trackClick(item)

    // Handle navigation
    if (item.href) {
      actions.navigate(item.href)
    }
  }

  const itemContent = (
    <>
      {/* Icon */}
      {showIcon && item.icon && (
        <item.icon className={cn(
          "flex-shrink-0",
          variant === 'horizontal' ? "w-4 h-4" : "w-5 h-5",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
      )}

      {/* Label */}
      <span className={cn(
        "font-medium",
        variant === 'horizontal' ? "text-sm" : "text-base",
        isActive ? "text-primary" : "text-foreground",
        level > 0 && "text-sm"
      )}>
        {item.label}
      </span>

      {/* Badge */}
      {showBadge && item.badge && (
        <span className={cn(
          "ml-auto px-2 py-1 text-xs font-semibold rounded-full",
          typeof item.badge === 'number' 
            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        )}>
          {item.badge}
        </span>
      )}

      {/* External link indicator */}
      {item.isExternal && (
        <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
      )}

      {/* Dropdown arrow */}
      {hasChildren && (
        <ChevronDown className={cn(
          "w-4 h-4 ml-auto transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      )}
    </>
  )

  const itemClasses = cn(
    "group flex items-center gap-3 transition-all duration-200",
    variant === 'horizontal' 
      ? "px-3 py-2 rounded-md hover:bg-muted"
      : "px-4 py-3 rounded-lg hover:bg-muted",
    level > 0 && "pl-12",
    isActive && "bg-primary/10 text-primary border-r-2 border-primary",
    !item.href && hasChildren && "cursor-pointer",
    className
  )

  return (
    <div>
      {/* Main item */}
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          className={itemClasses}
          onClick={handleClick}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
        >
          {itemContent}
        </Link>
      ) : (
        <div
          className={itemClasses}
          onClick={handleClick}
          role={hasChildren ? "button" : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          tabIndex={hasChildren ? 0 : -1}
        >
          {itemContent}
        </div>
      )}

      {/* Description */}
      {showDescription && item.description && (
        <p className="px-4 pb-2 text-sm text-muted-foreground">
          {item.description}
        </p>
      )}

      {/* Children */}
      {hasChildren && (
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="py-2 space-y-1">
            {item.children?.map((child) => (
              <NavigationItem
                key={child.id}
                item={child}
                level={level + 1}
                variant={variant}
                showIcon={showIcon}
                showBadge={showBadge}
                showDescription={showDescription}
              />
            ))}
          </div>
        </motion.div>
      )}

      {children}
    </div>
  )
}