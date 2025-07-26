'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (props: { row: T; value: any }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: number | string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  enableVirtualization?: boolean
  rowHeight?: number
  maxHeight?: number
  emptyMessage?: string
  isLoading?: boolean
  onExport?: () => void
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  onRowClick,
  actions,
  enableVirtualization = true,
  rowHeight = 48,
  maxHeight = 600,
  emptyMessage = 'No data available',
  isLoading = false,
  onExport,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchQuery && searchKeys.length > 0) {
      const query = searchQuery.toLowerCase()
      filtered = data.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key]
          return value && String(value).toLowerCase().includes(query)
        })
      )
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      const column = columns.find((col) => col.id === sortColumn)
      if (column) {
        filtered = [...filtered].sort((a, b) => {
          const aValue = column.accessorFn
            ? column.accessorFn(a)
            : column.accessorKey
            ? a[column.accessorKey]
            : null
          const bValue = column.accessorFn
            ? column.accessorFn(b)
            : column.accessorKey
            ? b[column.accessorKey]
            : null

          if (aValue === null || aValue === undefined) return 1
          if (bValue === null || bValue === undefined) return -1

          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }
    }

    return filtered
  }, [data, searchQuery, searchKeys, sortColumn, sortDirection, columns])

  // Handle sort toggle
  const handleSort = useCallback((columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection])

  // Virtualization setup
  const parentRef = React.useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: processedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (!columns.find((col) => col.id === columnId)?.sortable) return null

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        return <ChevronUp className="w-4 h-4" />
      } else if (sortDirection === 'desc') {
        return <ChevronDown className="w-4 h-4" />
      }
    }
    return <ChevronsUpDown className="w-4 h-4 opacity-50" />
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <div className="border rounded-lg">
          <div className="h-12 bg-gray-100 animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 border-t animate-pulse">
              <div className="flex items-center p-3 gap-4">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ width: column.width }}
                  className={cn(
                    column.sortable && 'cursor-pointer select-none hover:bg-gray-100',
                    'transition-colors'
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center justify-between">
                    {column.header}
                    {renderSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : enableVirtualization ? (
              <div
                ref={parentRef}
                style={{ height: `${Math.min(maxHeight, processedData.length * rowHeight)}px` }}
                className="overflow-auto"
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const row = processedData[virtualItem.index]
                    return (
                      <div
                        key={virtualItem.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <TableRow
                          className={cn(
                            onRowClick && 'cursor-pointer hover:bg-gray-50',
                            'border-b'
                          )}
                          onClick={() => onRowClick?.(row)}
                        >
                          {columns.map((column) => {
                            const value = column.accessorFn
                              ? column.accessorFn(row)
                              : column.accessorKey
                              ? row[column.accessorKey]
                              : null
                            return (
                              <TableCell key={column.id}>
                                {column.cell
                                  ? column.cell({ row, value })
                                  : value?.toString() || '-'}
                              </TableCell>
                            )
                          })}
                          {actions && <TableCell>{actions(row)}</TableCell>}
                        </TableRow>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              processedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-gray-50',
                    'transition-colors'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    const value = column.accessorFn
                      ? column.accessorFn(row)
                      : column.accessorKey
                      ? row[column.accessorKey]
                      : null
                    return (
                      <TableCell key={column.id}>
                        {column.cell ? column.cell({ row, value }) : value?.toString() || '-'}
                      </TableCell>
                    )
                  })}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}