"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/soft-member/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Settings,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
  Bell,
  Globe,
  User,
  Target,
  BookOpen,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { leadScoringService } from '@/lib/lead-scoring-service'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  type: 'assessment' | 'webinar' | 'coaching' | 'meeting' | 'content' | 'personal'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  location?: string
  isVirtual: boolean
  meetingLink?: string
  attendees?: string[]
  reminderTime?: number // minutes before
  color?: string
  recurring?: {
    frequency: 'none' | 'daily' | 'weekly' | 'monthly'
    endDate?: string
  }
}

interface CalendarStats {
  thisWeekEvents: number
  upcomingAssessments: number
  completedThisMonth: number
  totalHoursScheduled: number
}

export default function SoftMemberCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<CalendarStats>({
    thisWeekEvents: 0,
    upcomingAssessments: 0,
    completedThisMonth: 0,
    totalHoursScheduled: 0
  })

  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'personal',
    isVirtual: false,
    location: '',
    reminderTime: 15
  })

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        // Mock calendar events - in production this would come from API
        const mockEvents: CalendarEvent[] = [
          {
            id: '1',
            title: 'Leadership Assessment Session',
            description: 'Complete the comprehensive leadership style assessment',
            startTime: '2025-01-25T10:00:00Z',
            endTime: '2025-01-25T11:30:00Z',
            type: 'assessment',
            status: 'scheduled',
            isVirtual: true,
            meetingLink: 'https://meet.galaxykiro.com/assessment-1',
            reminderTime: 30,
            color: '#3B82F6'
          },
          {
            id: '2',
            title: 'Goal Setting Workshop',
            description: 'Interactive workshop on setting and achieving transformation goals',
            startTime: '2025-01-26T14:00:00Z',
            endTime: '2025-01-26T16:00:00Z',
            type: 'webinar',
            status: 'scheduled',
            isVirtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            attendees: ['instructor@galaxykiro.com'],
            reminderTime: 15,
            color: '#10B981'
          },
          {
            id: '3',
            title: 'One-on-One Coaching Call',
            description: 'Personal coaching session with Sarah Martinez',
            startTime: '2025-01-27T16:00:00Z',
            endTime: '2025-01-27T17:00:00Z',
            type: 'coaching',
            status: 'scheduled',
            isVirtual: true,
            meetingLink: 'https://calendly.com/coach-sarah',
            attendees: ['sarah.martinez@coach.com'],
            reminderTime: 15,
            color: '#8B5CF6'
          },
          {
            id: '4',
            title: 'Team Leadership Review',
            description: 'Review progress on team leadership development',
            startTime: '2025-01-28T09:00:00Z',
            endTime: '2025-01-28T10:00:00Z',
            type: 'meeting',
            status: 'scheduled',
            isVirtual: false,
            location: 'Conference Room A, TechCorp Inc.',
            attendees: ['manager@techcorp.com'],
            reminderTime: 30,
            color: '#F59E0B'
          },
          {
            id: '5',
            title: 'Decision Making Masterclass',
            description: 'Deep dive into cognitive biases and decision frameworks',
            startTime: '2025-01-29T13:00:00Z',
            endTime: '2025-01-29T14:30:00Z',
            type: 'content',
            status: 'scheduled',
            isVirtual: true,
            reminderTime: 15,
            color: '#EF4444'
          },
          {
            id: '6',
            title: 'Weekly Reflection',
            description: 'Personal time for weekly goal review and planning',
            startTime: '2025-01-24T18:00:00Z',
            endTime: '2025-01-24T19:00:00Z',
            type: 'personal',
            status: 'completed',
            isVirtual: false,
            reminderTime: 10,
            color: '#6B7280',
            recurring: {
              frequency: 'weekly'
            }
          }
        ]

        setEvents(mockEvents)

        // Calculate stats
        const now = new Date()
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        const thisWeekEvents = mockEvents.filter(event => {
          const eventDate = parseISO(event.startTime)
          return eventDate >= weekStart && eventDate <= weekEnd
        }).length

        const upcomingAssessments = mockEvents.filter(event => 
          event.type === 'assessment' && 
          event.status === 'scheduled' &&
          parseISO(event.startTime) > now
        ).length

        const completedThisMonth = mockEvents.filter(event => 
          event.status === 'completed' &&
          parseISO(event.startTime) >= monthStart &&
          parseISO(event.startTime) <= monthEnd
        ).length

        const totalHours = mockEvents.reduce((sum, event) => {
          const start = parseISO(event.startTime)
          const end = parseISO(event.endTime)
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        }, 0)

        setStats({
          thisWeekEvents,
          upcomingAssessments,
          completedThisMonth,
          totalHoursScheduled: Math.round(totalHours * 10) / 10
        })

        // Track calendar visit
        leadScoringService.updateEngagement('high_engagement', {
          eventType: 'page_visit',
          page: 'soft_member_calendar'
        })

      } catch (error) {
        console.error('Error loading calendar data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCalendarData()
  }, [])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in required fields')
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type || 'personal',
      status: 'scheduled',
      isVirtual: newEvent.isVirtual || false,
      location: newEvent.location,
      reminderTime: newEvent.reminderTime || 15,
      color: getEventTypeColor(newEvent.type || 'personal')
    }

    setEvents(prev => [...prev, event])
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'personal',
      isVirtual: false,
      location: '',
      reminderTime: 15
    })

    // Track event creation
    leadScoringService.updateEngagement('high_engagement', {
      eventType: 'calendar_event',
      eventAction: 'create',
      calendarEventType: event.type
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return '#3B82F6'
      case 'webinar': return '#10B981'
      case 'coaching': return '#8B5CF6'
      case 'meeting': return '#F59E0B'
      case 'content': return '#EF4444'
      case 'personal': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return Target
      case 'webinar': return Users
      case 'coaching': return User
      case 'meeting': return Users
      case 'content': return BookOpen
      case 'personal': return CalendarIcon
      default: return CalendarIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.startTime), date)
    )
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const startWeek = startOfWeek(start)
    const endWeek = endOfWeek(end)
    
    const days = []
    let day = startWeek
    
    while (day <= endWeek) {
      days.push(day)
      day = addDays(day, 1)
    }
    
    return days
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Calendar</h1>
              <p className="text-muted-foreground">
                Manage your transformation journey schedule and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Day
                </Button>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          placeholder="Event title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Select
                          value={newEvent.type}
                          onValueChange={(value: CalendarEvent['type']) => setNewEvent(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="assessment">Assessment</SelectItem>
                            <SelectItem value="webinar">Webinar</SelectItem>
                            <SelectItem value="coaching">Coaching</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="content">Content Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Event description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isVirtual"
                        checked={newEvent.isVirtual}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, isVirtual: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isVirtual">Virtual Event</Label>
                    </div>

                    <div>
                      <Label htmlFor="location">
                        {newEvent.isVirtual ? 'Meeting Link' : 'Location'}
                      </Label>
                      <Input
                        id="location"
                        placeholder={newEvent.isVirtual ? 'https://...' : 'Event location'}
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleCreateEvent}>Create Event</Button>
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.thisWeekEvents}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.upcomingAssessments}</div>
              <div className="text-xs text-muted-foreground">Assessments</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.completedThisMonth}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.totalHoursScheduled}h</div>
              <div className="text-xs text-muted-foreground">Scheduled</div>
            </div>
          </Card>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, -30))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, 30))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
            </div>

            {/* Month View */}
            {viewMode === 'month' && (
              <div className="space-y-4">
                {/* Week Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth().map((day, index) => {
                    const dayEvents = getEventsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    const isSelected = isSameDay(day, selectedDate)

                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                          isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                        } ${isToday ? 'border-primary' : 'border-muted'} ${
                          isSelected ? 'bg-primary/5' : ''
                        } hover:bg-muted/50`}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                        } ${isToday ? 'text-primary' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                              style={{ backgroundColor: event.color + '20', color: event.color }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEventClick(event)
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events
                .filter(event => parseISO(event.startTime) > new Date() && event.status === 'scheduled')
                .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                .slice(0, 5)
                .map(event => {
                  const Icon = getEventTypeIcon(event.type)
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: event.color + '20' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: event.color }} />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {format(parseISO(event.startTime), 'MMM dd, HH:mm')} - 
                                {format(parseISO(event.endTime), 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {event.isVirtual ? (
                                <Video className="w-3 h-3" />
                              ) : (
                                <MapPin className="w-3 h-3" />
                              )}
                              <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        {event.reminderTime && (
                          <Bell className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </Card>
        </motion.div>

        {/* Event Details Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedEvent?.title}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowEventDialog(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: selectedEvent.color + '20' }}
                  >
                    {React.createElement(getEventTypeIcon(selectedEvent.type), {
                      className: "w-6 h-6",
                      style: { color: selectedEvent.color }
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                    <Badge className={getStatusColor(selectedEvent.status)}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Date & Time</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{format(parseISO(selectedEvent.startTime), 'EEEE, MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(selectedEvent.startTime), 'HH:mm')} - 
                          {format(parseISO(selectedEvent.endTime), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      {selectedEvent.isVirtual ? (
                        <>
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span>Virtual Meeting</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedEvent.location || 'No location specified'}</span>
                        </>
                      )}
                    </div>
                    {selectedEvent.meetingLink && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </div>

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attendees</h4>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {selectedEvent.reminderTime && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Bell className="w-4 h-4" />
                        <span>Reminder {selectedEvent.reminderTime} min before</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {selectedEvent.status === 'scheduled' && (
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}