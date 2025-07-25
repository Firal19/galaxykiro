/**
 * NavigationGroup - Navigation group with collapsible sections
 */

"use client"

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavigationGroup as NavigationGroupType } from '../core/NavigationTypes'
import { NavigationItem } from './NavigationItem'
import { useNavigation } from '../core/NavigationContext'

interface NavigationGroupProps {
  group: NavigationGroupType
  variant?: 'sidebar' | 'header' | 'mobile'
  showIcons?: boolean
  showBadges?: boolean
  showDescriptions?: boolean
  className?: string
}

export function NavigationGroup({
  group,
  variant = 'sidebar',
  showIcons = true,
  showBadges = true,
  showDescriptions = false,
  className
}: NavigationGroupProps) {
  const { state, actions } = useNavigation()
  const isOpen = !group.collapsible || 
                 group.defaultOpen !== false && 
                 state.openGroups.includes(group.id)

  const handleGroupToggle = () => {
    if (group.collapsible) {
      actions.toggleGroup(group.id)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Group Header */}
      {group.label && (
        <div
          className={cn(
            "flex items-center justify-between",
            variant === 'sidebar' ? "px-4 py-2" : "px-2 py-1",
            group.collapsible && "cursor-pointer hover:bg-muted rounded-md"
          )}
          onClick={handleGroupToggle}
          role={group.collapsible ? "button" : undefined}
          aria-expanded={group.collapsible ? isOpen : undefined}
          tabIndex={group.collapsible ? 0 : -1}
        >
          <h3 className={cn(
            "font-semibold text-muted-foreground uppercase tracking-wider",
            variant === 'sidebar' ? "text-xs" : "text-sm"
          )}>
            {group.label}
          </h3>
          
          {group.collapsible && (
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-200 text-muted-foreground",
              isOpen && "rotate-180"
            )} />
          )}
        </div>
      )}

      {/* Group Items */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={cn(
          "space-y-1",
          group.label && variant === 'sidebar' && "ml-2"
        )}>
          {group.items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              variant={variant === 'header' ? 'horizontal' : 'vertical'}
              showIcon={showIcons}
              showBadge={showBadges}
              showDescription={showDescriptions}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}