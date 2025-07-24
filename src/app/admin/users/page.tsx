"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Upload,
  Shield,
  Star,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Globe,
  MapPin,
  Smartphone,
  Laptop
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'visitor' | 'lead' | 'candidate' | 'soft_member' | 'hot_lead' | 'member' | 'admin'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  registeredAt: string
  lastActiveAt: string
  leadScore: number
  engagement: {
    emailOpens: number
    linkClicks: number
    contentViews: number
    assessmentCompletions: number
  }
  demographics: {
    age?: number
    location?: string
    industry?: string
    company?: string
    position?: string
  }
  source: string
  avatar?: string
  notes?: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  roleDistribution: Record<string, number>
  engagementRate: number
  retentionRate: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
    roleDistribution: {},
    engagementRate: 0,
    retentionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'lead' as User['role'],
    notes: ''
  })

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Mock user data - in production this would come from API
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1-555-0123',
            role: 'hot_lead',
            status: 'active',
            registeredAt: '2025-01-15T10:30:00Z',
            lastActiveAt: '2025-01-23T14:22:00Z',
            leadScore: 85,
            engagement: {
              emailOpens: 23,
              linkClicks: 15,
              contentViews: 47,
              assessmentCompletions: 3
            },
            demographics: {
              age: 34,
              location: 'San Francisco, CA',
              industry: 'Technology',
              company: 'TechCorp Inc.',
              position: 'Product Manager'
            },
            source: 'organic_search'
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@company.com',
            phone: '+1-555-0124',
            role: 'soft_member',
            status: 'active',
            registeredAt: '2025-01-10T09:15:00Z',
            lastActiveAt: '2025-01-24T11:45:00Z',
            leadScore: 92,
            engagement: {
              emailOpens: 31,
              linkClicks: 22,
              contentViews: 68,
              assessmentCompletions: 5
            },
            demographics: {
              age: 28,
              location: 'New York, NY',
              industry: 'Finance',
              company: 'Goldman Sachs',
              position: 'Analyst'
            },
            source: 'linkedin_ad'
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.r@startup.co',
            role: 'candidate',
            status: 'pending',
            registeredAt: '2025-01-20T16:45:00Z',
            lastActiveAt: '2025-01-22T08:30:00Z',
            leadScore: 67,
            engagement: {
              emailOpens: 12,
              linkClicks: 8,
              contentViews: 25,
              assessmentCompletions: 2
            },
            demographics: {
              age: 31,
              location: 'Austin, TX',
              industry: 'Startup',
              company: 'InnovateNow',
              position: 'Co-founder'
            },
            source: 'referral'
          },
          {
            id: '4',
            name: 'David Kumar',
            email: 'david.kumar@consulting.com',
            phone: '+1-555-0126',
            role: 'lead',
            status: 'active',
            registeredAt: '2025-01-18T12:20:00Z',
            lastActiveAt: '2025-01-21T17:10:00Z',
            leadScore: 54,
            engagement: {
              emailOpens: 8,
              linkClicks: 5,
              contentViews: 18,
              assessmentCompletions: 1
            },
            demographics: {
              age: 39,
              location: 'Chicago, IL',
              industry: 'Consulting',
              company: 'McKinsey & Co',
              position: 'Senior Partner'
            },
            source: 'google_ads'
          },
          {
            id: '5',
            name: 'Lisa Thompson',
            email: 'lisa.thompson@health.org',
            role: 'member',
            status: 'active',
            registeredAt: '2025-01-05T14:30:00Z',
            lastActiveAt: '2025-01-24T09:15:00Z',
            leadScore: 98,
            engagement: {
              emailOpens: 45,
              linkClicks: 34,
              contentViews: 89,
              assessmentCompletions: 8
            },
            demographics: {
              age: 42,
              location: 'Seattle, WA',
              industry: 'Healthcare',
              company: 'Seattle Medical Center',
              position: 'Director of Operations'
            },
            source: 'webinar'
          }
        ]

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)

        // Calculate stats
        const roleDistribution = mockUsers.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const activeUsers = mockUsers.filter(user => user.status === 'active').length
        const newUsersThisWeek = mockUsers.filter(user => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return new Date(user.registeredAt) > weekAgo
        }).length

        setStats({
          totalUsers: mockUsers.length,
          activeUsers,
          newUsersThisWeek,
          roleDistribution,
          engagementRate: 78.5,
          retentionRate: 82.3
        })

      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter and sort users
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.demographics.company && user.demographics.company.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

      return matchesSearch && matchesRole && matchesStatus
    })

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        case 'oldest':
          return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'lead_score':
          return b.leadScore - a.leadScore
        case 'last_active':
          return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
        default:
          return 0
      }
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, selectedRole, selectedStatus, sortBy])

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please fill in required fields')
      return
    }

    // In production, this would make an API call
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      phone: newUser.phone.trim(),
      role: newUser.role,
      status: 'active',
      registeredAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      leadScore: 50,
      engagement: {
        emailOpens: 0,
        linkClicks: 0,
        contentViews: 0,
        assessmentCompletions: 0
      },
      demographics: {},
      source: 'manual_add',
      notes: newUser.notes.trim()
    }

    setUsers(prev => [user, ...prev])
    setNewUser({ name: '', email: '', phone: '', role: 'lead', notes: '' })
    setShowAddUser(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditUser(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'visitor': return 'bg-gray-500/10 text-gray-700 border-gray-200'
      case 'lead': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'candidate': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      case 'soft_member': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'hot_lead': return 'bg-orange-500/10 text-orange-700 border-orange-200'
      case 'member': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
      case 'admin': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'inactive': return 'bg-gray-500/10 text-gray-700 border-gray-200'
      case 'suspended': return 'bg-red-500/10 text-red-700 border-red-200'
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">User Management</h1>
              <p className="text-muted-foreground">
                Manage users, roles, and track engagement across your platform
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Full name"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="Phone number"
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value: User['role']) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="candidate">Candidate</SelectItem>
                          <SelectItem value="soft_member">Soft Member</SelectItem>
                          <SelectItem value="hot_lead">Hot Lead</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes..."
                        value={newUser.notes}
                        onChange={(e) => setNewUser(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser}>
                        Add User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Week</p>
                <p className="text-2xl font-bold">{stats.newUsersThisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{stats.engagementRate}%</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        {/* User Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">User Overview</TabsTrigger>
              <TabsTrigger value="analytics">User Analytics</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="candidate">Candidate</SelectItem>
                      <SelectItem value="soft_member">Soft Member</SelectItem>
                      <SelectItem value="hot_lead">Hot Lead</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="lead_score">Lead Score</SelectItem>
                      <SelectItem value="last_active">Last Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Role
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Users Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Lead Score</th>
                        <th className="text-left p-4 font-medium">Last Active</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                {user.demographics.company && (
                                  <div className="text-xs text-muted-foreground">
                                    {user.demographics.position} at {user.demographics.company}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-full rounded-full" 
                                  style={{ width: `${user.leadScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{user.leadScore}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {format(new Date(user.lastActiveAt), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(user.lastActiveAt), 'HH:mm')}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/leads/${user.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Role Distribution */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Role Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.roleDistribution).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(role)}>
                            {role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Engagement Metrics */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email Opens</span>
                      <span className="font-medium">{stats.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Content Views</span>
                      <span className="font-medium">82.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Assessment Completions</span>
                      <span className="font-medium">45.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Retention Rate</span>
                      <span className="font-medium">{stats.retentionRate}%</span>
                    </div>
                  </div>
                </Card>

                {/* User Activity Timeline */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Last active {format(new Date(user.lastActiveAt), 'MMM dd, HH:mm')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(user.role)} variant="outline">
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(user.status)} variant="outline">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Role Permissions</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Configure access permissions for different user roles across the platform.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['visitor', 'lead', 'candidate', 'soft_member', 'hot_lead', 'member'].map((role) => (
                      <Card key={role} className="p-4">
                        <h4 className="font-medium mb-2 capitalize">{role.replace('_', ' ')}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Dashboard Access</span>
                            <Checkbox checked={role !== 'visitor'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Content Library</span>
                            <Checkbox checked={['soft_member', 'hot_lead', 'member'].includes(role)} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Assessment Tools</span>
                            <Checkbox checked={role !== 'visitor'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Network Access</span>
                            <Checkbox checked={['hot_lead', 'member'].includes(role)} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}