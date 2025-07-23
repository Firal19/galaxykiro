import { createClient } from '@supabase/supabase-js'

// Email service configuration
interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'console'
  apiKey?: string
  domain?: string
  fromEmail: string
  fromName: string
}

interface EmailData {
  to: string | string[]
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private config: EmailConfig
  private supabase: any

  constructor() {
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as any) || 'console',
      apiKey: process.env.EMAIL_API_KEY,
      domain: process.env.EMAIL_DOMAIN,
      fromEmail: process.env.FROM_EMAIL || 'noreply@galaxydreamteam.com',
      fromName: process.env.FROM_NAME || 'Galaxy Dream Team'
    }

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      // Log email for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email Service - Sending:', {
          to: emailData.to,
          subject: emailData.subject,
          provider: this.config.provider
        });
      }

      // Send based on provider
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData)
        case 'mailgun':
          return await this.sendWithMailgun(emailData)
        case 'ses':
          return await this.sendWithSES(emailData)
        case 'console':
        default:
          return await this.sendToConsole(emailData)
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Email service error:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * SendGrid implementation
   */
  private async sendWithSendGrid(emailData: EmailData): Promise<EmailResult> {
    try {
      if (!this.config.apiKey) {
        throw new Error('SendGrid API key not configured')
      }

      // Dynamic import to avoid bundling issues
      const sgMail = await import('@sendgrid/mail')
      sgMail.setApiKey(this.config.apiKey)

      const msg = {
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        subject: emailData.subject,
        html: emailData.htmlContent,
        text: emailData.textContent,
        replyTo: emailData.replyTo
      }

      const response = await sgMail.send(msg)
      
      // Log to database
      await this.logEmailToDatabase(emailData, 'sendgrid', response[0]?.headers['x-message-id'])

      return {
        success: true,
        messageId: response[0]?.headers['x-message-id']
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('SendGrid error:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SendGrid error'
      }
    }
  }

  /**
   * Mailgun implementation
   */
  private async sendWithMailgun(emailData: EmailData): Promise<EmailResult> {
    try {
      if (!this.config.apiKey || !this.config.domain) {
        throw new Error('Mailgun API key or domain not configured')
      }

      const formData = new URLSearchParams()
      formData.append('from', `${this.config.fromName} <${this.config.fromEmail}>`)
      formData.append('to', Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to)
      formData.append('subject', emailData.subject)
      formData.append('html', emailData.htmlContent)
      if (emailData.textContent) {
        formData.append('text', emailData.textContent)
      }
      if (emailData.replyTo) {
        formData.append('h:Reply-To', emailData.replyTo)
      }

      const response = await fetch(
        `https://api.mailgun.net/v3/${this.config.domain}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${this.config.apiKey}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`Mailgun error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      // Log to database
      await this.logEmailToDatabase(emailData, 'mailgun', result.id)

      return {
        success: true,
        messageId: result.id
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Mailgun error:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mailgun error'
      }
    }
  }

  /**
   * AWS SES implementation
   */
  private async sendWithSES(emailData: EmailData): Promise<EmailResult> {
    try {
      if (!this.config.apiKey) {
        throw new Error('AWS SES credentials not configured')
      }

      // For AWS SES, you would typically use the AWS SDK
      // This is a simplified implementation
      const sesParams = {
        Source: `${this.config.fromName} <${this.config.fromEmail}>`,
        Destination: {
          ToAddresses: Array.isArray(emailData.to) ? emailData.to : [emailData.to]
        },
        Message: {
          Subject: {
            Data: emailData.subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: emailData.htmlContent,
              Charset: 'UTF-8'
            },
            ...(emailData.textContent && {
              Text: {
                Data: emailData.textContent,
                Charset: 'UTF-8'
              }
            })
          }
        },
        ...(emailData.replyTo && {
          ReplyToAddresses: [emailData.replyTo]
        })
      }

      // In a real implementation, you would use AWS SDK
      // const ses = new AWS.SES({ region: 'us-east-1' })
      // const result = await ses.sendEmail(sesParams).promise()
      
      // For now, we'll simulate success
      const messageId = `ses-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Log to database
      await this.logEmailToDatabase(emailData, 'ses', messageId)

      return {
        success: true,
        messageId
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('AWS SES error:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AWS SES error'
      }
    }
  }

  /**
   * Console logging for development
   */
  private async sendToConsole(emailData: EmailData): Promise<EmailResult> {
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 CONSOLE EMAIL (Development Mode):');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('HTML Content:', emailData.htmlContent);
      console.log('Text Content:', emailData.textContent);
      console.log('---');
    }

    // Log to database
    await this.logEmailToDatabase(emailData, 'console', `console-${Date.now()}`)

    return {
      success: true,
      messageId: `console-${Date.now()}`
    }
  }

  /**
   * Log email to database for tracking
   */
  private async logEmailToDatabase(
    emailData: EmailData, 
    provider: string, 
    messageId?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('email_logs')
        .insert({
          to_email: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
          subject: emailData.subject,
          provider,
          message_id: messageId,
          sent_at: new Date().toISOString(),
          status: 'sent'
        })

      if (error && process.env.NODE_ENV !== 'production') {
        console.error('Error logging email to database:', error);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error logging email to database:', error);
      }
    }
  }

  /**
   * Send template-based email
   */
  async sendTemplate(
    templateId: string,
    to: string | string[],
    data: Record<string, any>
  ): Promise<EmailResult> {
    const template = await this.getEmailTemplate(templateId)
    if (!template) {
      return {
        success: false,
        error: `Template ${templateId} not found`
      }
    }

    const personalizedContent = this.personalizeTemplate(template, data)
    
    return await this.sendEmail({
      to,
      subject: personalizedContent.subject,
      htmlContent: personalizedContent.html,
      textContent: personalizedContent.text
    })
  }

  /**
   * Get email template from database
   */
  private async getEmailTemplate(templateId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('email_templates')
        .select('*')
        .eq('template_id', templateId)
        .single()

      if (error || !data) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching email template:', error);
        }
        return null;
      }

      return data
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching email template:', error);
      }
      return null;
    }
  }

  /**
   * Personalize template with data
   */
  private personalizeTemplate(template: any, data: Record<string, any>): {
    subject: string
    html: string
    text: string
  } {
    let subject = template.subject
    let html = template.html_content
    let text = template.text_content || ''

    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
      html = html.replace(new RegExp(placeholder, 'g'), String(value))
      text = text.replace(new RegExp(placeholder, 'g'), String(value))
    })

    return { subject, html, text }
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Get email statistics
   */
  async getEmailStats(): Promise<{
    totalSent: number
    successRate: number
    providerStats: Record<string, number>
  }> {
    try {
      const { data, error } = await this.supabase
        .from('email_logs')
        .select('provider, status')

      if (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching email stats:', error);
        }
        return { totalSent: 0, successRate: 0, providerStats: {} };
      }

      const totalSent = data.length
      const successful = data.filter(log => log.status === 'sent').length
      const successRate = totalSent > 0 ? (successful / totalSent) * 100 : 0

      const providerStats = data.reduce((acc: Record<string, number>, log) => {
        acc[log.provider] = (acc[log.provider] || 0) + 1
        return acc
      }, {})

      return { totalSent, successRate, providerStats }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error getting email stats:', error);
      }
      return { totalSent: 0, successRate: 0, providerStats: {} };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export types for use in other files
export type { EmailData, EmailResult, EmailConfig }