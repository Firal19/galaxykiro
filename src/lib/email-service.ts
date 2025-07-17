import { createClient } from '@supabase/supabase-js'
import { UserModel } from './models/user'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'welcome' | 'nurture' | 'tool' | 'webinar' | 'tier' | 'assessment'
  language: 'en' | 'am'
}

export interface EmailSequence {
  id: string
  name: string
  description: string
  triggerEvent: string
  emails: EmailSequenceStep[]
  isActive: boolean
}

export interface EmailSequenceStep {
  id: string
  templateId: string
  delayMinutes: number
  conditions?: EmailCondition[]
  abTestVariant?: string
}

export interface EmailCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface EmailPersonalization {
  userId: string
  firstName?: string
  fullName?: string
  city?: string
  language?: string
  userTier?: string
  engagementScore?: number
  lastToolUsed?: string
  assessmentResults?: Record<string, any>
  customData?: Record<string, any>
}

export interface EmailMetrics {
  emailId: string
  userId: string
  templateId: string
  sequenceId?: string
  sent: boolean
  delivered: boolean
  opened: boolean
  clicked: boolean
  bounced: boolean
  unsubscribed: boolean
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  bouncedAt?: Date
  unsubscribedAt?: Date
}

class EmailService {
  private templates: Map<string, EmailTemplate> = new Map()
  private sequences: Map<string, EmailSequence> = new Map()

  constructor() {
    this.initializeTemplates()
    this.initializeSequences()
  }

  // Template Management
  private initializeTemplates() {
    // New Subscriber Series Templates
    this.addTemplate({
      id: 'welcome_email',
      name: 'Welcome Email',
      subject: 'Welcome to Galaxy Dream Team - Your Journey Begins Now!',
      htmlContent: this.getWelcomeEmailHTML(),
      textContent: this.getWelcomeEmailText(),
      variables: ['firstName', 'fullName'],
      category: 'welcome',
      language: 'en'
    })

    this.addTemplate({
      id: 'first_assessment_invitation',
      name: 'First Assessment Invitation',
      subject: 'Discover Your Hidden Potential - Take Your First Assessment',
      htmlContent: this.getFirstAssessmentHTML(),
      textContent: this.getFirstAssessmentText(),
      variables: ['firstName', 'assessmentUrl'],
      category: 'nurture',
      language: 'en'
    })

    this.addTemplate({
      id: 'value_delivery_1',
      name: 'Value Delivery - Mistake That Keeps People Stuck',
      subject: 'The #1 Mistake That Keeps People Stuck (And How to Avoid It)',
      htmlContent: this.getValueDelivery1HTML(),
      textContent: this.getValueDelivery1Text(),
      variables: ['firstName'],
      category: 'nurture',
      language: 'en'
    })

    // Tool User Series Templates
    this.addTemplate({
      id: 'tool_completion_celebration',
      name: 'Tool Completion Celebration',
      subject: 'Congratulations! You\'ve Unlocked New Insights',
      htmlContent: this.getToolCompletionHTML(),
      textContent: this.getToolCompletionText(),
      variables: ['firstName', 'toolName', 'results'],
      category: 'tool',
      language: 'en'
    })

    // Webinar Series Templates
    this.addTemplate({
      id: 'webinar_thank_you',
      name: 'Webinar Thank You',
      subject: 'Thank You for Attending - Your Action Plan Inside',
      htmlContent: this.getWebinarThankYouHTML(),
      textContent: this.getWebinarThankYouText(),
      variables: ['firstName', 'webinarTitle', 'actionPlanUrl'],
      category: 'webinar',
      language: 'en'
    })

    // Add more templates
    this.addAdditionalTemplates()
    this.addAmharicTemplates()
  }
 
 private initializeSequences() {
    // New Subscriber Series (7-day sequence)
    this.addSequence({
      id: 'new_subscriber_series',
      name: 'New Subscriber Series',
      description: '7-day welcome sequence for new subscribers',
      triggerEvent: 'user_subscribed',
      isActive: true,
      emails: [
        { id: 'step_1', templateId: 'welcome_email', delayMinutes: 0 },
        { id: 'step_2', templateId: 'first_assessment_invitation', delayMinutes: 60 },
        { id: 'step_3', templateId: 'value_delivery_1', delayMinutes: 1440 }, // 24 hours
        { id: 'step_4', templateId: 'social_proof_stories', delayMinutes: 2880 }, // 48 hours
        { id: 'step_5', templateId: 'tool_introduction', delayMinutes: 4320 }, // 72 hours
        { id: 'step_6', templateId: 'webinar_invitation', delayMinutes: 7200 }, // 5 days
        { id: 'step_7', templateId: 'week_one_checkin', delayMinutes: 10080 } // 7 days
      ]
    })

    // Tool User Series (14-day sequence)
    this.addSequence({
      id: 'tool_user_series',
      name: 'Tool User Series',
      description: '14-day sequence for users who complete assessments',
      triggerEvent: 'tool_completed',
      isActive: true,
      emails: [
        { id: 'step_1', templateId: 'tool_completion_celebration', delayMinutes: 0 },
        { id: 'step_2', templateId: 'next_tool_suggestion', delayMinutes: 1440 },
        { id: 'step_3', templateId: 'progress_tracking', delayMinutes: 4320 },
        { id: 'step_4', templateId: 'advanced_tools_unlock', delayMinutes: 7200 },
        { id: 'step_5', templateId: 'community_invitation', delayMinutes: 10080 },
        { id: 'step_6', templateId: 'office_visit_invitation', delayMinutes: 20160 } // 14 days
      ]
    })

    // Webinar Attendee Series (21-day sequence)
    this.addSequence({
      id: 'webinar_attendee_series',
      name: 'Webinar Attendee Series',
      description: '21-day sequence for webinar attendees',
      triggerEvent: 'webinar_attended',
      isActive: true,
      emails: [
        { id: 'step_1', templateId: 'webinar_thank_you', delayMinutes: 60 },
        { id: 'step_2', templateId: 'implementation_guide', delayMinutes: 1440 },
        { id: 'step_3', templateId: 'qa_followup', delayMinutes: 2880 },
        { id: 'step_4', templateId: 'success_stories', delayMinutes: 4320 },
        { id: 'step_5', templateId: 'next_webinar_invitation', delayMinutes: 10080 },
        { id: 'step_6', templateId: 'consultation_offer', delayMinutes: 20160 },
        { id: 'step_7', templateId: 'transformation_challenge', delayMinutes: 30240 } // 21 days
      ]
    })
  }

  // Public Methods
  async sendEmail(
    to: string,
    templateId: string,
    personalization: EmailPersonalization,
    options?: {
      sequenceId?: string
      abTestVariant?: string
      scheduledAt?: Date
    }
  ): Promise<boolean> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error(`Template ${templateId} not found`)
      }

      const personalizedEmail = this.personalizeEmail(template, personalization)
      
      // In production, integrate with email service provider
      const emailSent = await this.sendViaProvider({
        to,
        subject: personalizedEmail.subject,
        htmlContent: personalizedEmail.htmlContent,
        textContent: personalizedEmail.textContent,
        scheduledAt: options?.scheduledAt
      })

      // Track email metrics
      await this.trackEmailMetrics({
        emailId: `${templateId}-${Date.now()}`,
        userId: personalization.userId,
        templateId,
        sequenceId: options?.sequenceId,
        sent: emailSent,
        delivered: false, // Will be updated by webhook
        opened: false,
        clicked: false,
        bounced: false,
        unsubscribed: false,
        sentAt: new Date()
      })

      return emailSent
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  async triggerSequence(
    userId: string,
    sequenceId: string,
    customData?: Record<string, any>
  ): Promise<boolean> {
    try {
      const sequence = this.sequences.get(sequenceId)
      if (!sequence || !sequence.isActive) {
        throw new Error(`Sequence ${sequenceId} not found or inactive`)
      }

      const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }

      const personalization: EmailPersonalization = {
        userId,
        firstName: user.fullName?.split(' ')[0] || 'Friend',
        fullName: user.fullName || 'Friend',
        city: user.city,
        language: user.language || 'en',
        userTier: user.currentTier,
        engagementScore: user.engagementScore,
        customData
      }

      // Schedule all emails in the sequence
      for (const step of sequence.emails) {
        const scheduledAt = new Date(Date.now() + step.delayMinutes * 60 * 1000)
        
        // Check conditions if any
        if (step.conditions && !this.evaluateConditions(step.conditions, personalization)) {
          continue
        }

        await this.scheduleEmail({
          userId,
          templateId: step.templateId,
          sequenceId,
          stepId: step.id,
          scheduledAt,
          personalization,
          abTestVariant: step.abTestVariant
        })
      }

      // Track sequence trigger
      await this.trackSequenceTrigger(userId, sequenceId, sequence.triggerEvent)

      return true
    } catch (error) {
      console.error('Error triggering sequence:', error)
      return false
    }
  }

  async getEngagementMetrics(userId: string): Promise<{
    emailsSent: number
    emailsOpened: number
    emailsClicked: number
    openRate: number
    clickRate: number
    lastEngagement?: Date
  }> {
    const { data: metrics } = await supabase
      .from('email_metrics')
      .select('*')
      .eq('user_id', userId)

    if (!metrics || metrics.length === 0) {
      return {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        openRate: 0,
        clickRate: 0
      }
    }

    const emailsSent = metrics.filter(m => m.sent).length
    const emailsOpened = metrics.filter(m => m.opened).length
    const emailsClicked = metrics.filter(m => m.clicked).length
    const lastEngagement = metrics
      .filter(m => m.opened_at || m.clicked_at)
      .sort((a, b) => new Date(b.opened_at || b.clicked_at).getTime() - new Date(a.opened_at || a.clicked_at).getTime())[0]
      ?.opened_at || metrics[0]?.clicked_at

    return {
      emailsSent,
      emailsOpened,
      emailsClicked,
      openRate: emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0,
      clickRate: emailsSent > 0 ? (emailsClicked / emailsSent) * 100 : 0,
      lastEngagement: lastEngagement ? new Date(lastEngagement) : undefined
    }
  }

  // Private Helper Methods
  private addTemplate(template: EmailTemplate) {
    this.templates.set(template.id, template)
  }

  private addSequence(sequence: EmailSequence) {
    this.sequences.set(sequence.id, sequence)
  }

  private personalizeEmail(
    template: EmailTemplate,
    personalization: EmailPersonalization
  ): { subject: string; htmlContent: string; textContent: string } {
    let subject = template.subject
    let htmlContent = template.htmlContent
    let textContent = template.textContent

    // Replace variables
    const replacements = {
      firstName: personalization.firstName || 'Friend',
      fullName: personalization.fullName || 'Friend',
      city: personalization.city || '',
      userTier: personalization.userTier || 'Browser',
      engagementScore: personalization.engagementScore?.toString() || '0',
      ...personalization.customData
    }

    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, String(value))
      htmlContent = htmlContent.replace(regex, String(value))
      textContent = textContent.replace(regex, String(value))
    })

    return { subject, htmlContent, textContent }
  }

  private async sendViaProvider(emailData: {
    to: string
    subject: string
    htmlContent: string
    textContent: string
    scheduledAt?: Date
  }): Promise<boolean> {
    // This would integrate with your email service provider
    // For now, we'll simulate sending
    console.log('Sending email via provider:', {
      to: emailData.to,
      subject: emailData.subject,
      scheduledAt: emailData.scheduledAt
    })

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return true
  } 
 private async scheduleEmail(data: {
    userId: string
    templateId: string
    sequenceId: string
    stepId: string
    scheduledAt: Date
    personalization: EmailPersonalization
    abTestVariant?: string
  }): Promise<void> {
    await supabase
      .from('email_queue')
      .insert({
        user_id: data.userId,
        template_id: data.templateId,
        sequence_id: data.sequenceId,
        step_id: data.stepId,
        scheduled_at: data.scheduledAt.toISOString(),
        personalization_data: data.personalization,
        ab_test_variant: data.abTestVariant,
        status: 'scheduled'
      })
  }

  private async trackEmailMetrics(metrics: EmailMetrics): Promise<void> {
    await supabase
      .from('email_metrics')
      .insert({
        email_id: metrics.emailId,
        user_id: metrics.userId,
        template_id: metrics.templateId,
        sequence_id: metrics.sequenceId,
        sent: metrics.sent,
        delivered: metrics.delivered,
        opened: metrics.opened,
        clicked: metrics.clicked,
        bounced: metrics.bounced,
        unsubscribed: metrics.unsubscribed,
        sent_at: metrics.sentAt?.toISOString(),
        delivered_at: metrics.deliveredAt?.toISOString(),
        opened_at: metrics.openedAt?.toISOString(),
        clicked_at: metrics.clickedAt?.toISOString(),
        bounced_at: metrics.bouncedAt?.toISOString(),
        unsubscribed_at: metrics.unsubscribedAt?.toISOString()
      })
  }

  private async trackSequenceTrigger(
    userId: string,
    sequenceId: string,
    triggerEvent: string
  ): Promise<void> {
    await supabase
      .from('interactions')
      .insert({
        user_id: userId,
        session_id: `email-sequence-${Date.now()}`,
        event_type: 'email_sequence_triggered',
        event_data: {
          sequence_id: sequenceId,
          trigger_event: triggerEvent,
          timestamp: new Date().toISOString()
        }
      })
  }

  private evaluateConditions(
    conditions: EmailCondition[],
    personalization: EmailPersonalization
  ): boolean {
    return conditions.every(condition => {
      const value = (personalization as any)[condition.field]
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'not_equals':
          return value !== condition.value
        case 'contains':
          return String(value).includes(String(condition.value))
        case 'greater_than':
          return Number(value) > Number(condition.value)
        case 'less_than':
          return Number(value) < Number(condition.value)
        default:
          return true
      }
    })
  }

  // Email Template Content Methods
  private getWelcomeEmailHTML(): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Galaxy Dream Team!</h1>
          <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Your transformation journey begins now</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi {{firstName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Welcome to Galaxy Dream Team! I'm thrilled you've decided to embark on this journey of personal transformation and growth.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Over the next few days, I'll be sharing powerful insights, tools, and strategies that have helped thousands of people unlock their true potential and create the life they've always dreamed of.
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">What to expect:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Personalized assessment tools to discover your hidden potential</li>
              <li style="margin-bottom: 10px;">Proven strategies for lasting transformation</li>
              <li style="margin-bottom: 10px;">Exclusive content and insights</li>
              <li style="margin-bottom: 10px;">Access to our community of growth-minded individuals</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{assessmentUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Take Your First Assessment
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your transformation starts with understanding where you are right now. Click the button above to take your first assessment and discover insights about your current potential.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            To your success,<br>
            <strong>The Galaxy Dream Team</strong>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
          <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
          <p>You're receiving this because you subscribed to our personal development platform.</p>
        </div>
      </div>
    `
  }

  private getWelcomeEmailText(): string {
    return `
Welcome to Galaxy Dream Team!

Hi {{firstName}},

Welcome to Galaxy Dream Team! I'm thrilled you've decided to embark on this journey of personal transformation and growth.

Over the next few days, I'll be sharing powerful insights, tools, and strategies that have helped thousands of people unlock their true potential and create the life they've always dreamed of.

What to expect:
- Personalized assessment tools to discover your hidden potential
- Proven strategies for lasting transformation
- Exclusive content and insights
- Access to our community of growth-minded individuals

Your transformation starts with understanding where you are right now. Visit {{assessmentUrl}} to take your first assessment and discover insights about your current potential.

To your success,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
    `
  }
  
  private getFirstAssessmentHTML(): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Discover Your Hidden Potential</h1>
          <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Your personalized assessment awaits</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi {{firstName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Are you ready to discover what's truly possible for you? I've prepared a special assessment that will reveal insights about your current potential and areas for growth.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            This 5-minute assessment has helped thousands of people identify their hidden strengths and opportunities for development. The results might surprise you!
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">What you'll discover:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Your current potential utilization score</li>
              <li style="margin-bottom: 10px;">Key areas where you can experience rapid growth</li>
              <li style="margin-bottom: 10px;">Personalized insights based on your unique responses</li>
              <li style="margin-bottom: 10px;">Actionable next steps to start your transformation</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{assessmentUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Take Your Assessment Now
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            This assessment takes just 5 minutes to complete, but the insights you'll gain can transform your approach to personal development.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            To your growth journey,<br>
            <strong>The Galaxy Dream Team</strong>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
          <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
          <p>You're receiving this because you subscribed to our personal development platform.</p>
        </div>
      </div>
    `
  }

  private getFirstAssessmentText(): string {
    return `
Discover Your Hidden Potential - Your personalized assessment awaits

Hi {{firstName}},

Are you ready to discover what's truly possible for you? I've prepared a special assessment that will reveal insights about your current potential and areas for growth.

This 5-minute assessment has helped thousands of people identify their hidden strengths and opportunities for development. The results might surprise you!

What you'll discover:
- Your current potential utilization score
- Key areas where you can experience rapid growth
- Personalized insights based on your unique responses
- Actionable next steps to start your transformation

This assessment takes just 5 minutes to complete, but the insights you'll gain can transform your approach to personal development.

Take your assessment now: {{assessmentUrl}}

To your growth journey,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
    `
  }

  private getValueDelivery1HTML(): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">The #1 Mistake That Keeps People Stuck</h1>
          <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">And how you can avoid it</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi {{firstName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Have you ever wondered why some people seem to make continuous progress while others stay stuck in the same patterns year after year?
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            After working with thousands of clients, we've identified the #1 mistake that keeps most people from achieving their true potential:
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937; text-align: center;">They focus on motivation instead of systems.</h3>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Most people believe they need more motivation, more willpower, or more inspiration to change their lives. But research shows that sustainable transformation comes from building effective systems and environments that make success inevitable.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Here are three practical ways to build systems that lead to lasting change:
          </p>
          
          <ol style="margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Environment Design:</strong> Restructure your physical space to make good habits easier and bad habits harder. For example, if you want to read more, place books in visible locations throughout your home and remove distractions like TV remotes.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Implementation Intentions:</strong> Create specific plans using the format "When X happens, I will do Y." Research shows this approach makes you 2-3 times more likely to follow through.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Habit Stacking:</strong> Link new habits to existing ones using the formula "After I [current habit], I will [new habit]." This leverages the neural pathways of established routines.
            </li>
          </ol>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{habitToolUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Try Our Habit Strength Analyzer
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            In our next email, I'll share the three morning habits that successful people use to set themselves up for daily achievement.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            To your success through systems,<br>
            <strong>The Galaxy Dream Team</strong>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
          <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
          <p>You're receiving this because you subscribed to our personal development platform.</p>
        </div>
      </div>
    `
  }

  private getValueDelivery1Text(): string {
    return `
The #1 Mistake That Keeps People Stuck (And How to Avoid It)

Hi {{firstName}},

Have you ever wondered why some people seem to make continuous progress while others stay stuck in the same patterns year after year?

After working with thousands of clients, we've identified the #1 mistake that keeps most people from achieving their true potential:

THEY FOCUS ON MOTIVATION INSTEAD OF SYSTEMS.

Most people believe they need more motivation, more willpower, or more inspiration to change their lives. But research shows that sustainable transformation comes from building effective systems and environments that make success inevitable.

Here are three practical ways to build systems that lead to lasting change:

1. Environment Design: Restructure your physical space to make good habits easier and bad habits harder. For example, if you want to read more, place books in visible locations throughout your home and remove distractions like TV remotes.

2. Implementation Intentions: Create specific plans using the format "When X happens, I will do Y." Research shows this approach makes you 2-3 times more likely to follow through.

3. Habit Stacking: Link new habits to existing ones using the formula "After I [current habit], I will [new habit]." This leverages the neural pathways of established routines.

Try our Habit Strength Analyzer: {{habitToolUrl}}

In our next email, I'll share the three morning habits that successful people use to set themselves up for daily achievement.

To your success through systems,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
    `
  }

  private getToolCompletionHTML(): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations, {{firstName}}!</h1>
          <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">You've unlocked new insights with {{toolName}}</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi {{firstName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Congratulations on completing the {{toolName}}! Your commitment to personal growth puts you ahead of 95% of people who never take action to improve their lives.
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">Your Key Insights:</h3>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              {{results}}
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            These insights are just the beginning of your transformation journey. Here are your recommended next steps:
          </p>
          
          <ol style="margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Review your complete results</strong> in your personal dashboard
            </li>
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Implement one action step</strong> from your personalized recommendations
            </li>
            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
              <strong>Share your insights</strong> with someone who will support your growth
            </li>
          </ol>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Your Complete Results
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Tomorrow, I'll recommend your next assessment tool based on your unique results and growth journey.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            To your continued growth,<br>
            <strong>The Galaxy Dream Team</strong>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
          <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
          <p>You're receiving this because you subscribed to our personal development platform.</p>
        </div>
      </div>
    `
  }

  private getToolCompletionText(): string {
    return `
Congratulations! You've Unlocked New Insights

Hi {{firstName}},

Congratulations on completing the {{toolName}}! Your commitment to personal growth puts you ahead of 95% of people who never take action to improve their lives.

YOUR KEY INSIGHTS:
{{results}}

These insights are just the beginning of your transformation journey. Here are your recommended next steps:

1. Review your complete results in your personal dashboard
2. Implement one action step from your personalized recommendations
3. Share your insights with someone who will support your growth

View your complete results: {{dashboardUrl}}

Tomorrow, I'll recommend your next assessment tool based on your unique results and growth journey.

To your continued growth,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
    `
  }

  private getWebinarThankYouHTML(): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Attending!</h1>
          <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">{{webinarTitle}}</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi {{firstName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for attending our webinar on "{{webinarTitle}}". Your presence and engagement made the session truly special.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            As promised, I've prepared a personalized action plan to help you implement what you learned and start seeing results right away.
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">Key Takeaways:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">The three-step framework for transforming challenges into opportunities</li>
              <li style="margin-bottom: 10px;">How to identify and leverage your unique strengths</li>
              <li style="margin-bottom: 10px;">Practical strategies for consistent daily progress</li>
              <li style="margin-bottom: 10px;">The accountability system that ensures follow-through</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{actionPlanUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Download Your Action Plan
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            I've also included the webinar recording and slides in your action plan package, so you can review the material at your convenience.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions about implementing these strategies, simply reply to this email. I'm here to support your journey.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            To your success,<br>
            <strong>The Galaxy Dream Team</strong>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
          <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
          <p>You're receiving this because you attended our webinar.</p>
        </div>
      </div>
    `
  }

  private getWebinarThankYouText(): string {
    return `
Thank You for Attending - Your Action Plan Inside

Hi {{firstName}},

Thank you for attending our webinar on "{{webinarTitle}}". Your presence and engagement made the session truly special.

As promised, I've prepared a personalized action plan to help you implement what you learned and start seeing results right away.

KEY TAKEAWAYS:
- The three-step framework for transforming challenges into opportunities
- How to identify and leverage your unique strengths
- Practical strategies for consistent daily progress
- The accountability system that ensures follow-through

Download your action plan: {{actionPlanUrl}}

I've also included the webinar recording and slides in your action plan package, so you can review the material at your convenience.

If you have any questions about implementing these strategies, simply reply to this email. I'm here to support your journey.

To your success,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you attended our webinar.
    `
  }
  
  private addAdditionalTemplates(): void {
    // Social Proof Stories Template
    this.addTemplate({
      id: 'social_proof_stories',
      name: 'Social Proof - Success Stories',
      subject: 'How Sarah Transformed Her Life in 90 Days',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Real Transformation Stories</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">How Sarah transformed her life in just 90 days</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              I want to share an inspiring story with you today about Sarah, one of our community members who experienced remarkable transformation in just 90 days.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">Sarah's Story:</h3>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; font-style: italic;">
                "Six months ago, I was overwhelmed, stuck in a job I didn't love, and constantly putting my own goals last. I had dreams, but no clear path to achieve them. After joining Galaxy Dream Team and using the assessment tools, I discovered that my biggest barrier wasn't external circumstances—it was my own limiting beliefs and lack of structured systems.
              </p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; font-style: italic;">
                Within 90 days of implementing the strategies I learned, I had established a powerful morning routine, clarified my vision, and built momentum toward my goals. I've now transitioned to a career I love, improved my relationships, and feel in control of my future for the first time."
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              What made Sarah's transformation possible? Three key factors:
            </p>
            
            <ol style="margin-bottom: 30px; padding-left: 20px;">
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                <strong>She identified her specific barriers</strong> using our assessment tools
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                <strong>She implemented proven systems</strong> rather than relying on motivation alone
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                <strong>She took consistent daily action</strong> guided by her personalized plan
              </li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{assessmentUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Start Your Transformation Journey
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your transformation journey can begin today. The same tools and strategies that helped Sarah are available to you right now.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To your success,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you subscribed to our personal development platform.</p>
          </div>
        </div>
      `,
      textContent: `
Real Transformation Stories - How Sarah transformed her life in just 90 days

Hi {{firstName}},

I want to share an inspiring story with you today about Sarah, one of our community members who experienced remarkable transformation in just 90 days.

SARAH'S STORY:

"Six months ago, I was overwhelmed, stuck in a job I didn't love, and constantly putting my own goals last. I had dreams, but no clear path to achieve them. After joining Galaxy Dream Team and using the assessment tools, I discovered that my biggest barrier wasn't external circumstances—it was my own limiting beliefs and lack of structured systems.

Within 90 days of implementing the strategies I learned, I had established a powerful morning routine, clarified my vision, and built momentum toward my goals. I've now transitioned to a career I love, improved my relationships, and feel in control of my future for the first time."

What made Sarah's transformation possible? Three key factors:

1. She identified her specific barriers using our assessment tools
2. She implemented proven systems rather than relying on motivation alone
3. She took consistent daily action guided by her personalized plan

Your transformation journey can begin today. The same tools and strategies that helped Sarah are available to you right now.

Start your transformation journey: {{assessmentUrl}}

To your success,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
      `,
      variables: ['firstName', 'assessmentUrl'],
      category: 'nurture',
      language: 'en'
    });

    // Tool Introduction Template
    this.addTemplate({
      id: 'tool_introduction',
      name: 'Tool Introduction',
      subject: 'Your Personal Growth Toolkit Awaits',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Personal Growth Toolkit</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Powerful tools to accelerate your transformation</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Today, I want to introduce you to our suite of personal development tools designed to help you unlock your full potential in different areas of life.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Each tool provides personalized insights and actionable recommendations based on your unique responses:
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">Your Personal Growth Toolkit:</h3>
              
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Potential Quotient Calculator:</strong> Discover how much of your potential you're currently utilizing and identify key areas for growth
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Habit Strength Analyzer:</strong> Evaluate your current habits and receive a personalized habit-building plan
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Life Wheel Diagnostic:</strong> Assess balance across 8 life areas and identify priorities for improvement
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Leadership Style Profiler:</strong> Discover your natural leadership style and how to leverage it effectively
                </li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{toolsUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Explore Your Toolkit
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              I recommend starting with the Potential Quotient Calculator to get a comprehensive overview of your current state and growth opportunities.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To your growth journey,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you subscribed to our personal development platform.</p>
          </div>
        </div>
      `,
      textContent: `
Your Personal Growth Toolkit Awaits

Hi {{firstName}},

Today, I want to introduce you to our suite of personal development tools designed to help you unlock your full potential in different areas of life.

Each tool provides personalized insights and actionable recommendations based on your unique responses:

YOUR PERSONAL GROWTH TOOLKIT:

- Potential Quotient Calculator: Discover how much of your potential you're currently utilizing and identify key areas for growth
- Habit Strength Analyzer: Evaluate your current habits and receive a personalized habit-building plan
- Life Wheel Diagnostic: Assess balance across 8 life areas and identify priorities for improvement
- Leadership Style Profiler: Discover your natural leadership style and how to leverage it effectively

I recommend starting with the Potential Quotient Calculator to get a comprehensive overview of your current state and growth opportunities.

Explore your toolkit: {{toolsUrl}}

To your growth journey,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
      `,
      variables: ['firstName', 'toolsUrl'],
      category: 'nurture',
      language: 'en'
    });

    // Webinar Invitation Template
    this.addTemplate({
      id: 'webinar_invitation',
      name: 'Webinar Invitation',
      subject: 'Exclusive Invitation: Join Our Next Masterclass',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Join our exclusive masterclass webinar</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              I'd like to personally invite you to our upcoming free masterclass:
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">"The 3 Hidden Keys to Unlocking Your Full Potential"</h3>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                <strong>Date:</strong> {{webinarDate}}
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                <strong>Time:</strong> {{webinarTime}}
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                <strong>Duration:</strong> 90 minutes (including live Q&A)
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              In this transformative session, you'll discover:
            </p>
            
            <ul style="margin-bottom: 30px; padding-left: 20px;">
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                The #1 hidden barrier that's keeping you from achieving your goals (hint: it's not what most people think)
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                A proven 3-step framework for creating lasting change in any area of your life
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                How to identify and leverage your unique strengths to accelerate your progress
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                The simple daily practice that top performers use to maintain consistent growth
              </li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{webinarRegistrationUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reserve Your Spot Now
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Space is limited to ensure we can provide personalized attention during the Q&A session, so be sure to register early.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Looking forward to seeing you there!<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you subscribed to our personal development platform.</p>
          </div>
        </div>
      `,
      textContent: `
You're Invited! Join our exclusive masterclass webinar

Hi {{firstName}},

I'd like to personally invite you to our upcoming free masterclass:

"THE 3 HIDDEN KEYS TO UNLOCKING YOUR FULL POTENTIAL"

Date: {{webinarDate}}
Time: {{webinarTime}}
Duration: 90 minutes (including live Q&A)

In this transformative session, you'll discover:

- The #1 hidden barrier that's keeping you from achieving your goals (hint: it's not what most people think)
- A proven 3-step framework for creating lasting change in any area of your life
- How to identify and leverage your unique strengths to accelerate your progress
- The simple daily practice that top performers use to maintain consistent growth

Space is limited to ensure we can provide personalized attention during the Q&A session, so be sure to register early.

Reserve your spot now: {{webinarRegistrationUrl}}

Looking forward to seeing you there!
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
      `,
      variables: ['firstName', 'webinarDate', 'webinarTime', 'webinarRegistrationUrl'],
      category: 'webinar',
      language: 'en'
    });

    // Week One Check-in Template
    this.addTemplate({
      id: 'week_one_checkin',
      name: 'Week One Check-in',
      subject: 'Your First Week Journey - How Are You Feeling?',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your First Week Journey</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">How are you feeling?</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              It's been a week since you joined the Galaxy Dream Team community, and I wanted to check in and see how you're doing on your personal development journey.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Have you had a chance to:
            </p>
            
            <ul style="margin-bottom: 30px; padding-left: 20px;">
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                Take your first assessment?
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                Explore the personal development tools?
              </li>
              <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                Implement any of the strategies we've shared?
              </li>
            </ul>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Remember, transformation is a journey, not a destination. Every small step you take compounds over time to create remarkable results.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">Your Next Steps:</h3>
              
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px; font-size: 16px; line-height: 1.6;">
                  If you haven't already, <a href="{{assessmentUrl}}" style="color: #10B981; text-decoration: none; font-weight: bold;">take your first assessment</a> to establish your baseline
                </li>
                <li style="margin-bottom: 10px; font-size: 16px; line-height: 1.6;">
                  Choose one small habit to implement this week using the strategies we shared
                </li>
                <li style="margin-bottom: 10px; font-size: 16px; line-height: 1.6;">
                  <a href="{{communityUrl}}" style="color: #10B981; text-decoration: none; font-weight: bold;">Join our community</a> to connect with like-minded individuals
                </li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Visit Your Dashboard
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions or need support, simply reply to this email. I'm here to help you succeed.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To your continued growth,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you subscribed to our personal development platform.</p>
          </div>
        </div>
      `,
      textContent: `
Your First Week Journey - How Are You Feeling?

Hi {{firstName}},

It's been a week since you joined the Galaxy Dream Team community, and I wanted to check in and see how you're doing on your personal development journey.

Have you had a chance to:
- Take your first assessment?
- Explore the personal development tools?
- Implement any of the strategies we've shared?

Remember, transformation is a journey, not a destination. Every small step you take compounds over time to create remarkable results.

YOUR NEXT STEPS:
1. If you haven't already, take your first assessment to establish your baseline: {{assessmentUrl}}
2. Choose one small habit to implement this week using the strategies we shared
3. Join our community to connect with like-minded individuals: {{communityUrl}}

Visit your dashboard: {{dashboardUrl}}

If you have any questions or need support, simply reply to this email. I'm here to help you succeed.

To your continued growth,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
      `,
      variables: ['firstName', 'assessmentUrl', 'communityUrl', 'dashboardUrl'],
      category: 'nurture',
      language: 'en'
    });

    // Next Tool Suggestion Template
    this.addTemplate({
      id: 'next_tool_suggestion',
      name: 'Next Tool Suggestion',
      subject: 'Ready for Your Next Transformation?',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Next Step</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Recommended tool based on your progress</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Based on your completion of the {{lastToolUsed}}, I've identified the perfect next tool to continue your growth journey.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">Recommended for You: {{recommendedTool}}</h3>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                {{toolDescription}}
              </p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                <strong>Estimated time:</strong> {{estimatedTime}} minutes
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{toolUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Start {{recommendedTool}} Now
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              This tool builds perfectly on the insights you've already gained and will help you take your personal development to the next level.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To your continued growth,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you subscribed to our personal development platform.</p>
          </div>
        </div>
      `,
      textContent: `
Ready for Your Next Transformation?

Hi {{firstName}},

Based on your completion of the {{lastToolUsed}}, I've identified the perfect next tool to continue your growth journey.

RECOMMENDED FOR YOU: {{recommendedTool}}

{{toolDescription}}

Estimated time: {{estimatedTime}} minutes

This tool builds perfectly on the insights you've already gained and will help you take your personal development to the next level.

Start {{recommendedTool}} now: {{toolUrl}}

To your continued growth,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you subscribed to our personal development platform.
      `,
      variables: ['firstName', 'lastToolUsed', 'recommendedTool', 'toolDescription', 'estimatedTime', 'toolUrl'],
      category: 'tool',
      language: 'en'
    });

    // Implementation Guide Template
    this.addTemplate({
      id: 'implementation_guide',
      name: 'Implementation Guide',
      subject: 'Your Step-by-Step Implementation Guide',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Implementation Guide</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">Turn insights into action</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Now that you've attended our "{{webinarTitle}}" webinar, it's time to turn those insights into action. I've prepared a step-by-step implementation guide to help you apply what you've learned.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">Your 7-Day Implementation Plan:</h3>
              
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 1:</strong> Complete the self-assessment worksheet to identify your starting point
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 2:</strong> Set up your environment for success using the environment design principles
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 3:</strong> Create your implementation intentions for your top priority habit
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 4:</strong> Practice the visualization exercise for 10 minutes
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 5:</strong> Implement the accountability system with a partner or our community
                </li>
                <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                  <strong>Day 6:</strong> Review your progress and adjust your approach as needed
                </li>
                <li style="margin-bottom: 0; font-size: 16px; line-height: 1.6;">
                  <strong>Day 7:</strong> Complete the progress tracker and celebrate your first week of implementation
                </li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{implementationGuideUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Download Your Implementation Guide
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Remember, consistent small actions lead to remarkable results. Focus on implementing just one key insight each day.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To your successful implementation,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | Addis Ababa, Ethiopia</p>
            <p>You're receiving this because you attended our webinar.</p>
          </div>
        </div>
      `,
      textContent: `
Your Step-by-Step Implementation Guide

Hi {{firstName}},

Now that you've attended our "{{webinarTitle}}" webinar, it's time to turn those insights into action. I've prepared a step-by-step implementation guide to help you apply what you've learned.

YOUR 7-DAY IMPLEMENTATION PLAN:

1. Day 1: Complete the self-assessment worksheet to identify your starting point
2. Day 2: Set up your environment for success using the environment design principles
3. Day 3: Create your implementation intentions for your top priority habit
4. Day 4: Practice the visualization exercise for 10 minutes
5. Day 5: Implement the accountability system with a partner or our community
6. Day 6: Review your progress and adjust your approach as needed
7. Day 7: Complete the progress tracker and celebrate your first week of implementation

Remember, consistent small actions lead to remarkable results. Focus on implementing just one key insight each day.

Download your implementation guide: {{implementationGuideUrl}}

To your successful implementation,
The Galaxy Dream Team

Galaxy Dream Team | Addis Ababa, Ethiopia
You're receiving this because you attended our webinar.
      `,
      variables: ['firstName', 'webinarTitle', 'implementationGuideUrl'],
      category: 'webinar',
      language: 'en'
    });
  }
  
  private addAmharicTemplates(): void {
    // Welcome Email - Amharic Version
    this.addTemplate({
      id: 'welcome_email_am',
      name: 'Welcome Email - Amharic',
      subject: 'እንኳን ወደ Galaxy Dream Team በደህና መጡ - የእርስዎ ጉዞ አሁን ይጀምራል!',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans Ethiopic', Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">እንኳን ወደ Galaxy Dream Team በደህና መጡ!</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">የእርስዎ የለውጥ ጉዞ አሁን ይጀምራል</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ሰላም {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              እንኳን ወደ Galaxy Dream Team በደህና መጡ! በዚህ የግል ለውጥና እድገት ጉዞ ላይ መሳተፍዎ ደስታ ይሰማኛል።
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              በሚቀጥሉት ጥቂት ቀናት ውስጥ፣ ሺዎች ሰዎች እውነተኛ ችሎታቸውን ለመክፈትና ሁልጊዜ የሚመኙትን ህይወት ለመፍጠር የረዷቸውን ጠንካራ ግንዛቤዎችን፣ መሳሪያዎችን እና ስልቶችን አጋራለሁ።
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">የሚጠብቁት ነገሮች:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">የተበጀ የግምገማ መሳሪያዎች የተደበቁ ችሎታዎችዎን ለማግኘት</li>
                <li style="margin-bottom: 10px;">የተረጋገጡ ስልቶች ለዘላቂ ለውጥ</li>
                <li style="margin-bottom: 10px;">ልዩ ይዘት እና ግንዛቤዎች</li>
                <li style="margin-bottom: 10px;">ለእድገት ተኮር ግለሰቦች ማህበረሰብ ተደራሽነት</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{assessmentUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                የመጀመሪያ ግምገማዎን ይውሰዱ
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              የእርስዎ ለውጥ አሁን የሚገኙበትን በመረዳት ይጀምራል። ስለ አሁኑ ችሎታዎ ግንዛቤዎችን ለማግኘት ከላይ ያለውን አዝራር ጠቅ ያድርጉ እና የመጀመሪያ ግምገማዎን ይውሰዱ።
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              ለስኬትዎ,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | አዲስ አበባ፣ ኢትዮጵያ</p>
            <p>ይህን የሚቀበሉት ለግል እድገት መድረካችን ስለተመዘገቡ ነው።</p>
          </div>
        </div>
      `,
      textContent: `
እንኳን ወደ Galaxy Dream Team በደህና መጡ!

ሰላም {{firstName}},

እንኳን ወደ Galaxy Dream Team በደህና መጡ! በዚህ የግል ለውጥና እድገት ጉዞ ላይ መሳተፍዎ ደስታ ይሰማኛል።

በሚቀጥሉት ጥቂት ቀናት ውስጥ፣ ሺዎች ሰዎች እውነተኛ ችሎታቸውን ለመክፈትና ሁልጊዜ የሚመኙትን ህይወት ለመፍጠር የረዷቸውን ጠንካራ ግንዛቤዎችን፣ መሳሪያዎችን እና ስልቶችን አጋራለሁ።

የሚጠብቁት ነገሮች:
- የተበጀ የግምገማ መሳሪያዎች የተደበቁ ችሎታዎችዎን ለማግኘት
- የተረጋገጡ ስልቶች ለዘላቂ ለውጥ
- ልዩ ይዘት እና ግንዛቤዎች
- ለእድገት ተኮር ግለሰቦች ማህበረሰብ ተደራሽነት

የእርስዎ ለውጥ አሁን የሚገኙበትን በመረዳት ይጀምራል። ስለ አሁኑ ችሎታዎ ግንዛቤዎችን ለማግኘት የመጀመሪያ ግምገማዎን ይውሰዱ: {{assessmentUrl}}

ለስኬትዎ,
The Galaxy Dream Team

Galaxy Dream Team | አዲስ አበባ፣ ኢትዮጵያ
ይህን የሚቀበሉት ለግል እድገት መድረካችን ስለተመዘገቡ ነው።
      `,
      variables: ['firstName', 'assessmentUrl'],
      category: 'welcome',
      language: 'am'
    });

    // First Assessment Invitation - Amharic Version
    this.addTemplate({
      id: 'first_assessment_invitation_am',
      name: 'First Assessment Invitation - Amharic',
      subject: 'የተደበቀ ችሎታዎን ይግለጡ - የመጀመሪያ ግምገማዎን ይውሰዱ',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans Ethiopic', Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">የተደበቀ ችሎታዎን ይግለጡ</h1>
            <p style="color: white; margin: 20px 0 0 0; font-size: 18px;">የግል ግምገማዎ እርስዎን ይጠብቃል</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ሰላም {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ለእርስዎ በእውነት ምን እንደሚቻል ለማወቅ ዝግጁ ነዎት? ስለ አሁኑ ችሎታዎ እና የእድገት ዕድሎች ግንዛቤዎችን የሚገልጥ ልዩ ግምገማ አዘጋጅቻለሁ።
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ይህ የ5 ደቂቃ ግምገማ ሺዎች ሰዎች የተደበቁ ጥንካሬዎቻቸውን እና የእድገት ዕድሎቻቸውን እንዲለዩ ረድቷቸዋል። ውጤቶቹ ሊያስገርሙዎት ይችላሉ!
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1F2937;">የሚያገኙት ነገር:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">የአሁኑ የችሎታ አጠቃቀም ውጤትዎ</li>
                <li style="margin-bottom: 10px;">ፈጣን እድገት ሊያገኙባቸው የሚችሉ ቁልፍ ዘርፎች</li>
                <li style="margin-bottom: 10px;">በእርስዎ ልዩ ምላሾች ላይ የተመሰረቱ የግል ግንዛቤዎች</li>
                <li style="margin-bottom: 10px;">ለውጥዎን ለመጀመር ተግባራዊ የሚሆኑ ቀጣይ እርምጃዎች</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{assessmentUrl}}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                ግምገማዎን አሁን ይውሰዱ
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ይህ ግምገማ ለመጨረስ 5 ደቂቃ ብቻ ይወስዳል፣ ነገር ግን የሚያገኙት ግንዛቤ ለግል እድገትዎ አቀራረብዎን ሊለውጥ ይችላል።
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              ለእድገት ጉዞዎ,<br>
              <strong>The Galaxy Dream Team</strong>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280;">
            <p>Galaxy Dream Team | አዲስ አበባ፣ ኢትዮጵያ</p>
            <p>ይህን የሚቀበሉት ለግል እድገት መድረካችን ስለተመዘገቡ ነው።</p>
          </div>
        </div>
      `,
      textContent: `
የተደበቀ ችሎታዎን ይግለጡ - የግል ግምገማዎ እርስዎን ይጠብቃል

ሰላም {{firstName}},

ለእርስዎ በእውነት ምን እንደሚቻል ለማወቅ ዝግጁ ነዎት? ስለ አሁኑ ችሎታዎ እና የእድገት ዕድሎች ግንዛቤዎችን የሚገልጥ ልዩ ግምገማ አዘጋጅቻለሁ።

ይህ የ5 ደቂቃ ግምገማ ሺዎች ሰዎች የተደበቁ ጥንካሬዎቻቸውን እና የእድገት ዕድሎቻቸውን እንዲለዩ ረድቷቸዋል። ውጤቶቹ ሊያስገርሙዎት ይችላሉ!

የሚያገኙት ነገር:
- የአሁኑ የችሎታ አጠቃቀም ውጤትዎ
- ፈጣን እድገት ሊያገኙባቸው የሚችሉ ቁልፍ ዘርፎች
- በእርስዎ ልዩ ምላሾች ላይ የተመሰረቱ የግል ግንዛቤዎች
- ለውጥዎን ለመጀመር ተግባራዊ የሚሆኑ ቀጣይ እርምጃዎች

ይህ ግምገማ ለመጨረስ 5 ደቂቃ ብቻ ይወስዳል፣ ነገር ግን የሚያገኙት ግንዛቤ ለግል እድገትዎ አቀራረብዎን ሊለውጥ ይችላል።

ግምገማዎን አሁን ይውሰዱ: {{assessmentUrl}}

ለእድገት ጉዞዎ,
The Galaxy Dream Team

Galaxy Dream Team | አዲስ አበባ፣ ኢትዮጵያ
ይህን የሚቀበሉት ለግል እድገት መድረካችን ስለተመዘገቡ ነው።
      `,
      variables: ['firstName', 'assessmentUrl'],
      category: 'nurture',
      language: 'am'
    });
  }