'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/common/DataTable'
import { LeadStatusBadge, EngagementScoreBadge, ConversionProbabilityBadge } from '@/components/admin/common/ColorBadge'
import { useLeads, useUpdateLeadStatus, useDeleteLead } from '@/hooks/admin/useAdminQueries'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LeadProfile } from '@/lib/lead-scoring-service'

// Extend LeadProfile with admin fields
type AdminLead = LeadProfile & {
  email: string
  name: string
  phone?: string
  createdAt: string
  lastSeen: string
  toolsCompleted: number
  totalTimeOnSite: number
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const { data: leads = [], isLoading, error } = useLeads()
  const updateLeadStatusMutation = useUpdateLeadStatus()
  const deleteLeadMutation = useDeleteLead()
  
  // Define table columns
  const columns: Column<AdminLead>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Lead',
      accessorKey: 'name',
      sortable: true,
      width: 200,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
          {row.phone && (
            <div className="text-xs text-gray-400">{row.phone}</div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      width: 120,
      cell: ({ value }) => <LeadStatusBadge status={value} />
    },
    {
      id: 'engagementScore',
      header: 'Engagement',
      accessorKey: 'engagementScore',
      sortable: true,
      width: 130,
      cell: ({ value }) => <EngagementScoreBadge score={value} />
    },
    {
      id: 'conversionProbability',
      header: 'Conversion',
      accessorFn: (row) => row.predictions.conversionProbability,
      sortable: true,
      width: 120,
      cell: ({ value }) => <ConversionProbabilityBadge probability={value} />
    },
    {
      id: 'source',
      header: 'Source',
      accessorKey: 'source',
      sortable: true,
      width: 100,
      cell: ({ value }) => (
        <span className="capitalize text-sm">{value.replace('_', ' ')}</span>
      )
    },
    {
      id: 'toolsCompleted',
      header: 'Tools',
      accessorKey: 'toolsCompleted',
      sortable: true,
      width: 80,
      cell: ({ value }) => (
        <div className="text-center">
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      id: 'lastActivity',
      header: 'Last Active',
      accessorKey: 'lastActivity',
      sortable: true,
      width: 120,
      cell: ({ value }) => (
        <span className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(value))} ago
        </span>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      sortable: true,
      width: 120,
      cell: ({ value }) => (
        <span className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(value))} ago
        </span>
      )
    }
  ], [])

  const handleRowClick = (lead: AdminLead) => {
    router.push(`/admin/leads/${lead.id}`)
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting leads data...')
  }

  const renderActions = (lead: AdminLead) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRowClick(lead)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Lead
        </DropdownMenuItem>
        {lead.email && (
          <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}`)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
        )}
        {lead.phone && (
          <DropdownMenuItem onClick={() => window.open(`tel:${lead.phone}`)}>
            <Phone className="mr-2 h-4 w-4" />
            Call Lead
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => deleteLeadMutation.mutate(lead.id)}
          className="text-red-600"
          disabled={deleteLeadMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteLeadMutation.isPending ? 'Deleting...' : 'Delete Lead'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load leads</h3>
          <p className="text-gray-600 mb-4">{error.message || 'An error occurred'}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all leads in your pipeline
          </p>
        </div>
        <Button onClick={() => router.push('/admin/leads/new')}>
          Add New Lead
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={leads as AdminLead[]}
        columns={columns}
        searchPlaceholder="Search leads by name, email, or source..."
        searchKeys={['name', 'email', 'source']}
        onRowClick={handleRowClick}
        actions={renderActions}
        enableVirtualization={true}
        isLoading={isLoading}
        onExport={handleExport}
        emptyMessage="No leads found. Start by adding your first lead!"
      />
    </div>
  )
}