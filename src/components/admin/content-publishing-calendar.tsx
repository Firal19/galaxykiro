'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Badge } from '../ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  ContentModel, 
  ContentCategory, 
  ContentDepthLevel, 
  ContentType,
  CONTENT_CATEGORIES
} from '../../lib/models/content'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

interface ContentPublishingCalendarProps {
  contents: ContentModel[]
  onCreateContent: () => void
  onEditContent: (content: ContentModel) => void
}

interface ScheduledContent {
  id: string
  title: string
  category: ContentCategory
  contentType: ContentType
  depthLevel: ContentDepthLevel
}

interface CalendarDay {
  date: Date
  contents: ScheduledContent[]
}

export function ContentPublishingCalendar({ 
  contents, 
  onCreateContent, 
  onEditContent 
}: ContentPublishingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDateContents, setSelectedDateContents] = useState<ScheduledContent[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all')
  
  // Generate calendar days for the current month
  useEffect(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    
    const calendarDays: CalendarDay[] = days.map(day => {
      const dayContents = contents
        .filter(content => {
          const publishDate = new Date(content.publishedAt)
          return isSameDay(publishDate, day)
        })
        .filter(content => {
          if (categoryFilter !== 'all' && content.category !== categoryFilter) {
            return false
          }
          if (contentTypeFilter !== 'all' && content.contentType !== contentTypeFilter) {
            return false
          }
          return true
        })
        .map(content => ({
          id: content.id,
          title: content.title,
          category: content.category,
          contentType: content.contentType,
          depthLevel: content.depthLevel
        }))
      
      return {
        date: day,
        contents: dayContents
      }
    })
    
    setCalendarDays(calendarDays)
  }, [contents, currentMonth, categoryFilter, contentTypeFilter])
  
  // Update selected date contents when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDateContents([])
      return
    }
    
    const dayContents = contents
      .filter(content => {
        const publishDate = new Date(content.publishedAt)
        return isSameDay(publishDate, selectedDate)
      })
      .filter(content => {
        if (categoryFilter !== 'all' && content.category !== categoryFilter) {
          return false
        }
        if (contentTypeFilter !== 'all' && content.contentType !== contentTypeFilter) {
          return false
        }
        return true
      })
      .map(content => ({
        id: content.id,
        title: content.title,
        category: content.category,
        contentType: content.contentType,
        depthLevel: content.depthLevel
      }))
    
    setSelectedDateContents(dayContents)
  }, [selectedDate, contents, categoryFilter, contentTypeFilter])
  
  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1))
  }
  
  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1))
  }
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }
  
  // Handle content edit
  const handleEditContent = (contentId: string) => {
    const content = contents.find(c => c.id === contentId)
    if (content) {
      onEditContent(content)
    }
  }
  
  // Handle create content for selected date
  const handleCreateForDate = () => {
    // This would typically set the initial date in the content form
    onCreateContent()
  }
  
  // Get content count for a specific date
  const getContentCountForDate = (date: Date): number => {
    // Handle invalid dates
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 0
    }

    return contents.filter(content => {
      if (!content.publishedAt) return false
      
      const publishDate = new Date(content.publishedAt)
      
      // Handle invalid publish dates
      if (isNaN(publishDate.getTime())) return false
      
      return isSameDay(publishDate, date)
    }).length
  }
  
  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    // Handle invalid dates
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span>-</span>
        </div>
      )
    }

    const contentCount = getContentCountForDate(day)
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{format(day, 'd')}</span>
        {contentCount > 0 && (
          <span className="absolute bottom-1 right-1 flex h-3 w-3">
            <span className="animate-none relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            <span className="absolute inline-flex rounded-full h-3 w-3 bg-blue-400 opacity-75"></span>
          </span>
        )}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Publishing Calendar</h2>
        <div className="flex gap-2">
          <Button onClick={handlePreviousMonth} variant="outline">Previous</Button>
          <Button onClick={() => setCurrentMonth(new Date())} variant="outline">Today</Button>
          <Button onClick={handleNextMonth} variant="outline">Next</Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Filters</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CONTENT_CATEGORIES).map(([id, category]) => (
                      <SelectItem key={id} value={id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Content Type</label>
                <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="tool">Tools</SelectItem>
                    <SelectItem value="guide">Guides</SelectItem>
                    <SelectItem value="template">Templates</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Weekly Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="font-medium">Articles</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span className="font-medium">Tools</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span className="font-medium">Videos</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span className="font-medium">Guides</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium">Templates</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Monthly Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Content</span>
                <span className="font-medium">{contents.length}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-medium">
                  {contents.filter(content => {
                    const publishDate = new Date(content.publishedAt)
                    return publishDate.getMonth() === currentMonth.getMonth() &&
                           publishDate.getFullYear() === currentMonth.getFullYear()
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Articles</span>
                <span className="font-medium">
                  {contents.filter(content => content.contentType === 'article').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Videos</span>
                <span className="font-medium">
                  {contents.filter(content => content.contentType === 'video').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tools</span>
                <span className="font-medium">
                  {contents.filter(content => content.contentType === 'tool').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Calendar */}
        <div className="w-full md:w-3/4">
          <Card className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              className="rounded-md border"
              components={{
                Day: ({ date, ...props }) => (
                  <div {...props}>
                    {renderDay(date)}
                  </div>
                )
              }}
            />
            
            {selectedDate && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Content for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button onClick={handleCreateForDate} size="sm">
                    Add Content
                  </Button>
                </div>
                
                {selectedDateContents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No content scheduled for this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateContents.map(content => (
                      <div 
                        key={content.id} 
                        className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              {CONTENT_CATEGORIES[content.category].name}
                            </Badge>
                            <Badge variant="outline">
                              {content.contentType}
                            </Badge>
                            <Badge variant="outline">
                              {content.depthLevel}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{content.title}</h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditContent(content.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}