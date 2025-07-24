"use client"

/**
 * Comprehensive Webinar System for Galaxy Kiro
 * 
 * This system provides:
 * - Webinar creation and management
 * - Automated email sequences
 * - Registration management
 * - Live streaming integration
 * - Recording management
 * - Attendee tracking
 * - Follow-up automation
 * - Analytics and reporting
 */

export interface WebinarAttendee {
  id: string
  userId?: string
  email: string
  firstName: string
  lastName: string
  registrationDate: string
  attendanceStatus: 'registered' | 'attended' | 'partially_attended' | 'no_show'
  joinTime?: string
  leaveTime?: string
  engagementScore: number
  questionsAsked: number
  source: string
  metadata: {
    timezone: string
    device: string
    browser: string
    referrer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
}

export interface WebinarQuestion {
  id: string
  attendeeId: string
  question: string
  timestamp: string
  answered: boolean
  answerText?: string
  answerTimestamp?: string
  upvotes: number
  category: 'general' | 'technical' | 'pricing' | 'product'
  isPublic: boolean
}

export interface WebinarPoll {
  id: string
  question: string
  options: string[]
  responses: Map<string, number> // attendeeId -> optionIndex
  isActive: boolean
  duration: number // seconds
  createdAt: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'confirmation' | 'reminder' | 'follow_up' | 'replay' | 'thank_you'
  timing: number // hours before/after webinar
  isActive: boolean
  variables: string[] // Available template variables
}

export interface WebinarAutomation {
  id: string
  webinarId: string
  type: 'email_sequence' | 'lead_scoring' | 'tag_assignment' | 'crm_sync'
  trigger: 'registration' | 'attendance' | 'completion' | 'no_show'
  conditions: {
    attendancePercentage?: number
    engagementScore?: number
    questionsAsked?: number
    pollParticipation?: boolean
  }
  actions: {
    sendEmail?: string // template ID
    addTags?: string[]
    updateLeadScore?: number
    assignToSales?: boolean
    createTask?: {
      title: string
      description: string
      assignee: string
      dueDate: string
    }
  }
  isActive: boolean
}

export interface Webinar {
  id: string
  title: string
  description: string
  hostId: string
  hostName: string
  scheduledDate: string
  duration: number // minutes
  timezone: string
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled'
  registrationLimit?: number
  registrationDeadline?: string
  isRecorded: boolean
  recordingUrl?: string
  streamingUrl?: string
  presentationUrl?: string
  
  // Registration settings
  requireApproval: boolean
  allowQuestions: boolean
  enablePolls: boolean
  enableChat: boolean
  customFields: {
    name: string
    type: 'text' | 'email' | 'select' | 'checkbox'
    required: boolean
    options?: string[]
  }[]
  
  // Content and materials
  agenda: string[]
  resources: {
    title: string
    url: string
    type: 'pdf' | 'video' | 'link' | 'image'
    accessLevel: 'all' | 'attendees' | 'registered'
  }[]
  
  // Analytics
  totalRegistrations: number
  totalAttendees: number
  maxConcurrent: number
  averageAttendance: number
  engagementRate: number
  
  // Settings
  emailTemplates: EmailTemplate[]
  automations: WebinarAutomation[]
  
  // Tracking
  attendees: WebinarAttendee[]
  questions: WebinarQuestion[]
  polls: WebinarPoll[]
  
  createdAt: string
  updatedAt: string
}

export interface WebinarAnalytics {
  webinarId: string
  overview: {
    totalRegistrations: number
    showUpRate: number
    attendanceRate: number
    completionRate: number
    engagementScore: number
    averageWatchTime: number
  }
  attendance: {
    timeline: { time: string; count: number }[]
    dropOffPoints: string[]
    peakAttendance: number
    averageDuration: number
  }
  engagement: {
    questionsAsked: number
    pollParticipation: number
    chatMessages: number
    averageEngagementScore: number
  }
  conversion: {
    totalConversions: number
    conversionRate: number
    revenueGenerated: number
    followUpMeetings: number
  }
  demographics: {
    sources: { source: string; count: number }[]
    timezones: { timezone: string; count: number }[]
    devices: { device: string; count: number }[]
  }
  feedback: {
    averageRating: number
    totalResponses: number
    recommendations: number
    satisfactionScore: number
  }
}

class WebinarSystem {
  private static instance: WebinarSystem
  private webinars: Map<string, Webinar> = new Map()
  private templates: Map<string, EmailTemplate> = new Map()
  
  constructor() {
    this.initializeDefaultTemplates()
    this.loadWebinars()
  }

  static getInstance(): WebinarSystem {
    if (!WebinarSystem.instance) {
      WebinarSystem.instance = new WebinarSystem()
    }
    return WebinarSystem.instance
  }

  // Webinar Management
  async createWebinar(webinarData: Omit<Webinar, 'id' | 'createdAt' | 'updatedAt' | 'attendees' | 'questions' | 'polls' | 'totalRegistrations' | 'totalAttendees' | 'maxConcurrent' | 'averageAttendance' | 'engagementRate'>): Promise<string> {
    const id = `webinar_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const webinar: Webinar = {
      ...webinarData,
      id,
      attendees: [],
      questions: [],
      polls: [],
      totalRegistrations: 0,
      totalAttendees: 0,
      maxConcurrent: 0,
      averageAttendance: 0,
      engagementRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.webinars.set(id, webinar)
    await this.persistWebinars()
    
    // Set up automated emails
    await this.setupWebinarAutomation(id)
    
    return id
  }

  async updateWebinar(id: string, updates: Partial<Webinar>): Promise<boolean> {
    const webinar = this.webinars.get(id)
    if (!webinar) return false

    const updatedWebinar = {
      ...webinar,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.webinars.set(id, updatedWebinar)
    await this.persistWebinars()
    return true
  }

  getWebinar(id: string): Webinar | null {
    return this.webinars.get(id) || null
  }

  getAllWebinars(): Webinar[] {
    return Array.from(this.webinars.values())
  }

  async deleteWebinar(id: string): Promise<boolean> {
    const deleted = this.webinars.delete(id)
    if (deleted) {
      await this.persistWebinars()
    }
    return deleted
  }

  // Registration Management
  async registerAttendee(webinarId: string, attendeeData: Omit<WebinarAttendee, 'id' | 'registrationDate' | 'attendanceStatus' | 'engagementScore' | 'questionsAsked'>): Promise<string | null> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return null

    // Check registration limits
    if (webinar.registrationLimit && webinar.attendees.length >= webinar.registrationLimit) {
      throw new Error('Registration limit reached')
    }

    // Check registration deadline
    if (webinar.registrationDeadline && new Date() > new Date(webinar.registrationDeadline)) {
      throw new Error('Registration deadline has passed')
    }

    const attendeeId = `attendee_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const attendee: WebinarAttendee = {
      ...attendeeData,
      id: attendeeId,
      registrationDate: new Date().toISOString(),
      attendanceStatus: 'registered',
      engagementScore: 0,
      questionsAsked: 0
    }

    webinar.attendees.push(attendee)
    webinar.totalRegistrations = webinar.attendees.length
    webinar.updatedAt = new Date().toISOString()
    
    await this.persistWebinars()
    
    // Trigger registration automation
    await this.triggerAutomation(webinarId, 'registration', attendee)
    
    // Send confirmation email
    await this.sendConfirmationEmail(webinarId, attendee)
    
    return attendeeId
  }

  async updateAttendeeStatus(webinarId: string, attendeeId: string, status: WebinarAttendee['attendanceStatus'], metadata?: Partial<WebinarAttendee>): Promise<boolean> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return false

    const attendee = webinar.attendees.find(a => a.id === attendeeId)
    if (!attendee) return false

    attendee.attendanceStatus = status
    if (metadata) {
      Object.assign(attendee, metadata)
    }

    // Update webinar stats
    webinar.totalAttendees = webinar.attendees.filter(a => 
      a.attendanceStatus === 'attended' || a.attendanceStatus === 'partially_attended'
    ).length

    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()

    // Trigger automation based on status
    if (status === 'attended') {
      await this.triggerAutomation(webinarId, 'attendance', attendee)
    } else if (status === 'no_show') {
      await this.triggerAutomation(webinarId, 'no_show', attendee)
    }

    return true
  }

  // Question Management
  async submitQuestion(webinarId: string, attendeeId: string, question: string, category: WebinarQuestion['category'] = 'general'): Promise<string | null> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar || !webinar.allowQuestions) return null

    const questionId = `question_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const questionObj: WebinarQuestion = {
      id: questionId,
      attendeeId,
      question,
      timestamp: new Date().toISOString(),
      answered: false,
      upvotes: 0,
      category,
      isPublic: true
    }

    webinar.questions.push(questionObj)
    
    // Update attendee's questions count
    const attendee = webinar.attendees.find(a => a.id === attendeeId)
    if (attendee) {
      attendee.questionsAsked++
      attendee.engagementScore += 5 // Increase engagement for asking questions
    }

    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()
    
    return questionId
  }

  async answerQuestion(webinarId: string, questionId: string, answer: string): Promise<boolean> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return false

    const question = webinar.questions.find(q => q.id === questionId)
    if (!question) return false

    question.answered = true
    question.answerText = answer
    question.answerTimestamp = new Date().toISOString()

    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()
    
    return true
  }

  // Poll Management
  async createPoll(webinarId: string, question: string, options: string[], duration: number = 60): Promise<string | null> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar || !webinar.enablePolls) return null

    const pollId = `poll_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const poll: WebinarPoll = {
      id: pollId,
      question,
      options,
      responses: new Map(),
      isActive: true,
      duration,
      createdAt: new Date().toISOString()
    }

    webinar.polls.push(poll)
    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()

    // Auto-close poll after duration
    setTimeout(async () => {
      await this.closePoll(webinarId, pollId)
    }, duration * 1000)
    
    return pollId
  }

  async submitPollResponse(webinarId: string, pollId: string, attendeeId: string, optionIndex: number): Promise<boolean> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return false

    const poll = webinar.polls.find(p => p.id === pollId)
    if (!poll || !poll.isActive || optionIndex >= poll.options.length) return false

    poll.responses.set(attendeeId, optionIndex)
    
    // Update attendee engagement
    const attendee = webinar.attendees.find(a => a.id === attendeeId)
    if (attendee) {
      attendee.engagementScore += 3
    }

    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()
    
    return true
  }

  async closePoll(webinarId: string, pollId: string): Promise<boolean> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return false

    const poll = webinar.polls.find(p => p.id === pollId)
    if (!poll) return false

    poll.isActive = false
    webinar.updatedAt = new Date().toISOString()
    await this.persistWebinars()
    
    return true
  }

  // Email Automation
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<string> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const emailTemplate: EmailTemplate = {
      ...template,
      id
    }

    this.templates.set(id, emailTemplate)
    await this.persistTemplates()
    
    return id
  }

  async sendConfirmationEmail(webinarId: string, attendee: WebinarAttendee): Promise<boolean> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return false

    const template = webinar.emailTemplates.find(t => t.type === 'confirmation' && t.isActive)
    if (!template) return false

    const emailContent = this.processEmailTemplate(template, webinar, attendee)
    
    try {
      await this.sendEmail(attendee.email, emailContent.subject, emailContent.content)
      return true
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      return false
    }
  }

  async sendReminderEmails(webinarId: string): Promise<void> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return

    const reminderTemplates = webinar.emailTemplates.filter(t => t.type === 'reminder' && t.isActive)
    
    for (const template of reminderTemplates) {
      const targetTime = new Date(webinar.scheduledDate).getTime() - (template.timing * 60 * 60 * 1000)
      const now = Date.now()
      
      if (Math.abs(now - targetTime) < 5 * 60 * 1000) { // Within 5 minutes
        await this.sendBulkEmails(webinar, template)
      }
    }
  }

  // Analytics
  async getWebinarAnalytics(webinarId: string): Promise<WebinarAnalytics | null> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return null

    const attendedCount = webinar.attendees.filter(a => 
      a.attendanceStatus === 'attended' || a.attendanceStatus === 'partially_attended'
    ).length

    const analytics: WebinarAnalytics = {
      webinarId,
      overview: {
        totalRegistrations: webinar.totalRegistrations,
        showUpRate: webinar.totalRegistrations > 0 ? (attendedCount / webinar.totalRegistrations) * 100 : 0,
        attendanceRate: this.calculateAttendanceRate(webinar),
        completionRate: this.calculateCompletionRate(webinar),
        engagementScore: this.calculateAverageEngagement(webinar),
        averageWatchTime: this.calculateAverageWatchTime(webinar)
      },
      attendance: {
        timeline: this.generateAttendanceTimeline(webinar),
        dropOffPoints: this.identifyDropOffPoints(webinar),
        peakAttendance: webinar.maxConcurrent,
        averageDuration: this.calculateAverageWatchTime(webinar)
      },
      engagement: {
        questionsAsked: webinar.questions.length,
        pollParticipation: this.calculatePollParticipation(webinar),
        chatMessages: 0, // Would need chat implementation
        averageEngagementScore: this.calculateAverageEngagement(webinar)
      },
      conversion: {
        totalConversions: this.countConversions(webinar),
        conversionRate: this.calculateConversionRate(webinar),
        revenueGenerated: this.calculateRevenue(webinar),
        followUpMeetings: this.countFollowUpMeetings(webinar)
      },
      demographics: {
        sources: this.analyzeRegistrationSources(webinar),
        timezones: this.analyzeTimezones(webinar),
        devices: this.analyzeDevices(webinar)
      },
      feedback: {
        averageRating: 0, // Would need feedback implementation
        totalResponses: 0,
        recommendations: 0,
        satisfactionScore: 0
      }
    }

    return analytics
  }

  // Automation Triggers
  private async triggerAutomation(webinarId: string, trigger: WebinarAutomation['trigger'], attendee: WebinarAttendee): Promise<void> {
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return

    const automations = webinar.automations.filter(a => a.trigger === trigger && a.isActive)
    
    for (const automation of automations) {
      const shouldTrigger = this.evaluateAutomationConditions(automation, attendee)
      if (shouldTrigger) {
        await this.executeAutomationActions(automation, webinar, attendee)
      }
    }
  }

  private evaluateAutomationConditions(automation: WebinarAutomation, attendee: WebinarAttendee): boolean {
    const conditions = automation.conditions

    if (conditions.engagementScore && attendee.engagementScore < conditions.engagementScore) {
      return false
    }

    if (conditions.questionsAsked && attendee.questionsAsked < conditions.questionsAsked) {
      return false
    }

    // Add more condition evaluations as needed
    
    return true
  }

  private async executeAutomationActions(automation: WebinarAutomation, webinar: Webinar, attendee: WebinarAttendee): Promise<void> {
    const actions = automation.actions

    if (actions.sendEmail) {
      const template = this.templates.get(actions.sendEmail)
      if (template) {
        const emailContent = this.processEmailTemplate(template, webinar, attendee)
        await this.sendEmail(attendee.email, emailContent.subject, emailContent.content)
      }
    }

    if (actions.updateLeadScore) {
      // Update lead scoring system
      await this.updateLeadScore(attendee.userId || attendee.email, actions.updateLeadScore)
    }

    if (actions.createTask) {
      await this.createTask(actions.createTask, attendee)
    }

    // Add more action executions as needed
  }

  // Helper Methods
  private processEmailTemplate(template: EmailTemplate, webinar: Webinar, attendee: WebinarAttendee): { subject: string; content: string } {
    const variables = {
      '{{firstName}}': attendee.firstName,
      '{{lastName}}': attendee.lastName,
      '{{email}}': attendee.email,
      '{{webinarTitle}}': webinar.title,
      '{{webinarDate}}': new Date(webinar.scheduledDate).toLocaleDateString(),
      '{{webinarTime}}': new Date(webinar.scheduledDate).toLocaleTimeString(),
      '{{hostName}}': webinar.hostName,
      '{{joinUrl}}': webinar.streamingUrl || '',
      '{{recordingUrl}}': webinar.recordingUrl || ''
    }

    let subject = template.subject
    let content = template.content

    Object.entries(variables).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value)
      content = content.replace(new RegExp(placeholder, 'g'), value)
    })

    return { subject, content }
  }

  private calculateAttendanceRate(webinar: Webinar): number {
    const totalMinutes = webinar.duration
    const totalPossibleMinutes = webinar.attendees.length * totalMinutes
    
    const actualMinutes = webinar.attendees.reduce((sum, attendee) => {
      if (attendee.joinTime && attendee.leaveTime) {
        const joinTime = new Date(attendee.joinTime).getTime()
        const leaveTime = new Date(attendee.leaveTime).getTime()
        return sum + (leaveTime - joinTime) / (1000 * 60)
      }
      return sum
    }, 0)

    return totalPossibleMinutes > 0 ? (actualMinutes / totalPossibleMinutes) * 100 : 0
  }

  private calculateCompletionRate(webinar: Webinar): number {
    const threshold = webinar.duration * 0.8 // 80% completion threshold
    const completed = webinar.attendees.filter(attendee => {
      if (attendee.joinTime && attendee.leaveTime) {
        const duration = (new Date(attendee.leaveTime).getTime() - new Date(attendee.joinTime).getTime()) / (1000 * 60)
        return duration >= threshold
      }
      return false
    }).length

    return webinar.attendees.length > 0 ? (completed / webinar.attendees.length) * 100 : 0
  }

  private calculateAverageEngagement(webinar: Webinar): number {
    if (webinar.attendees.length === 0) return 0
    
    const totalEngagement = webinar.attendees.reduce((sum, attendee) => sum + attendee.engagementScore, 0)
    return totalEngagement / webinar.attendees.length
  }

  private calculateAverageWatchTime(webinar: Webinar): number {
    const attendeesWithTime = webinar.attendees.filter(a => a.joinTime && a.leaveTime)
    if (attendeesWithTime.length === 0) return 0

    const totalMinutes = attendeesWithTime.reduce((sum, attendee) => {
      const joinTime = new Date(attendee.joinTime!).getTime()
      const leaveTime = new Date(attendee.leaveTime!).getTime()
      return sum + (leaveTime - joinTime) / (1000 * 60)
    }, 0)

    return totalMinutes / attendeesWithTime.length
  }

  private generateAttendanceTimeline(webinar: Webinar): { time: string; count: number }[] {
    // Simplified timeline generation
    const timeline = []
    const startTime = new Date(webinar.scheduledDate)
    
    for (let i = 0; i < webinar.duration; i += 5) { // 5-minute intervals
      const time = new Date(startTime.getTime() + i * 60 * 1000)
      timeline.push({
        time: time.toISOString(),
        count: Math.floor(Math.random() * webinar.totalAttendees) // Mock data
      })
    }
    
    return timeline
  }

  private identifyDropOffPoints(webinar: Webinar): string[] {
    // Simplified drop-off analysis
    return ['15:30', '32:45', '48:20'] // Mock data - would need real-time tracking
  }

  private calculatePollParticipation(webinar: Webinar): number {
    if (webinar.polls.length === 0 || webinar.attendees.length === 0) return 0
    
    const totalPossibleResponses = webinar.polls.length * webinar.attendees.length
    const actualResponses = webinar.polls.reduce((sum, poll) => sum + poll.responses.size, 0)
    
    return (actualResponses / totalPossibleResponses) * 100
  }

  private countConversions(webinar: Webinar): number {
    // Mock conversion counting - would integrate with actual conversion tracking
    return Math.floor(webinar.totalAttendees * 0.15) // 15% conversion rate
  }

  private calculateConversionRate(webinar: Webinar): number {
    const conversions = this.countConversions(webinar)
    return webinar.totalAttendees > 0 ? (conversions / webinar.totalAttendees) * 100 : 0
  }

  private calculateRevenue(webinar: Webinar): number {
    // Mock revenue calculation
    return this.countConversions(webinar) * 1500 // $1500 average deal size
  }

  private countFollowUpMeetings(webinar: Webinar): number {
    // Mock follow-up meeting counting
    return Math.floor(this.countConversions(webinar) * 0.8) // 80% book follow-up
  }

  private analyzeRegistrationSources(webinar: Webinar): { source: string; count: number }[] {
    const sources = webinar.attendees.reduce((acc, attendee) => {
      acc[attendee.source] = (acc[attendee.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(sources).map(([source, count]) => ({ source, count }))
  }

  private analyzeTimezones(webinar: Webinar): { timezone: string; count: number }[] {
    const timezones = webinar.attendees.reduce((acc, attendee) => {
      const tz = attendee.metadata.timezone
      acc[tz] = (acc[tz] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(timezones).map(([timezone, count]) => ({ timezone, count }))
  }

  private analyzeDevices(webinar: Webinar): { device: string; count: number }[] {
    const devices = webinar.attendees.reduce((acc, attendee) => {
      const device = attendee.metadata.device
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(devices).map(([device, count]) => ({ device, count }))
  }

  private async setupWebinarAutomation(webinarId: string): Promise<void> {
    // Set up default automation rules for new webinars
    const webinar = this.webinars.get(webinarId)
    if (!webinar) return

    // Schedule reminder emails
    const reminderTimes = [24, 1] // 24 hours and 1 hour before
    reminderTimes.forEach(hours => {
      const reminderTime = new Date(webinar.scheduledDate).getTime() - (hours * 60 * 60 * 1000)
      const now = Date.now()
      
      if (reminderTime > now) {
        setTimeout(async () => {
          await this.sendReminderEmails(webinarId)
        }, reminderTime - now)
      }
    })
  }

  private async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Mock email sending - would integrate with actual email service
    console.log(`Sending email to ${to}:`, { subject, content })
    
    // Would implement actual email sending here
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, content })
      })
    } catch (error) {
      console.error('Email sending failed:', error)
    }
  }

  private async sendBulkEmails(webinar: Webinar, template: EmailTemplate): Promise<void> {
    const registeredAttendees = webinar.attendees.filter(a => a.attendanceStatus === 'registered')
    
    for (const attendee of registeredAttendees) {
      const emailContent = this.processEmailTemplate(template, webinar, attendee)
      await this.sendEmail(attendee.email, emailContent.subject, emailContent.content)
      
      // Add small delay to avoid overwhelming email service
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private async updateLeadScore(userIdentifier: string, scoreChange: number): Promise<void> {
    // Would integrate with lead scoring system
    console.log(`Updating lead score for ${userIdentifier} by ${scoreChange}`)
  }

  private async createTask(taskData: WebinarAutomation['actions']['createTask'], attendee: WebinarAttendee): Promise<void> {
    if (!taskData) return
    
    // Would integrate with CRM/task management system
    console.log('Creating task:', {
      ...taskData,
      attendeeEmail: attendee.email
    })
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: Omit<EmailTemplate, 'id'>[] = [
      {
        name: 'Registration Confirmation',
        subject: 'You\'re registered for {{webinarTitle}}!',
        content: `
          <h1>Welcome {{firstName}}!</h1>
          <p>Thank you for registering for our upcoming webinar: <strong>{{webinarTitle}}</strong></p>
          <p><strong>Date:</strong> {{webinarDate}} at {{webinarTime}}</p>
          <p><strong>Host:</strong> {{hostName}}</p>
          <p>We'll send you a reminder before the event starts.</p>
          <p><a href="{{joinUrl}}">Join the webinar</a></p>
        `,
        type: 'confirmation',
        timing: 0,
        isActive: true,
        variables: ['firstName', 'webinarTitle', 'webinarDate', 'webinarTime', 'hostName', 'joinUrl']
      },
      {
        name: '24 Hour Reminder',
        subject: 'Tomorrow: {{webinarTitle}}',
        content: `
          <h1>Don't forget, {{firstName}}!</h1>
          <p>Your webinar <strong>{{webinarTitle}}</strong> is tomorrow at {{webinarTime}}.</p>
          <p>Make sure to mark your calendar and prepare any questions you'd like to ask.</p>
          <p><a href="{{joinUrl}}">Join the webinar</a></p>
        `,
        type: 'reminder',
        timing: 24,
        isActive: true,
        variables: ['firstName', 'webinarTitle', 'webinarTime', 'joinUrl']
      },
      {
        name: 'Thank You & Recording',
        subject: 'Thank you for attending {{webinarTitle}}',
        content: `
          <h1>Thank you {{firstName}}!</h1>
          <p>We hope you enjoyed our webinar on {{webinarTitle}}.</p>
          <p>As promised, here's the recording: <a href="{{recordingUrl}}">Watch the recording</a></p>
          <p>If you have any questions, feel free to reach out to us.</p>
        `,
        type: 'thank_you',
        timing: 2,
        isActive: true,
        variables: ['firstName', 'webinarTitle', 'recordingUrl']
      }
    ]

    defaultTemplates.forEach(template => {
      this.createEmailTemplate(template)
    })
  }

  private async loadWebinars(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('galaxy_kiro_webinars')
        if (stored) {
          const webinars = JSON.parse(stored)
          webinars.forEach((webinar: Webinar) => {
            this.webinars.set(webinar.id, webinar)
          })
        }
      } catch (error) {
        console.error('Error loading webinars:', error)
      }
    }
  }

  private async persistWebinars(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const webinars = Array.from(this.webinars.values())
        localStorage.setItem('galaxy_kiro_webinars', JSON.stringify(webinars))
      } catch (error) {
        console.error('Error persisting webinars:', error)
      }
    }
  }

  private async persistTemplates(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const templates = Array.from(this.templates.values())
        localStorage.setItem('galaxy_kiro_email_templates', JSON.stringify(templates))
      } catch (error) {
        console.error('Error persisting templates:', error)
      }
    }
  }
}

// Export singleton instance (only on client)
export const webinarSystem = typeof window !== 'undefined' ? WebinarSystem.getInstance() : null as any

// Export types and system
export default webinarSystem