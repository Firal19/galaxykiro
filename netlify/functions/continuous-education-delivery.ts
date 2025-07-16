import { Handler } from '@netlify/functions'
import { continuousEducationEngine } from '../../src/lib/continuous-education'

interface DeliveryRequest {
  action: 'schedule' | 'deliver' | 'get-content' | 'mark-completed' | 'get-progress'
  userId: string
  contentId?: string
  deliveryTime?: string
  method?: 'email' | 'push' | 'in-app'
  preferences?: any
  pathId?: string
}

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const request: DeliveryRequest = JSON.parse(event.body || '{}')
    const { action, userId } = request

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      }
    }

    switch (action) {
      case 'get-content': {
        const limit = parseInt(event.queryStringParameters?.limit || '3')
        const content = continuousEducationEngine.getPersonalizedContent(userId, limit)
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            content,
            timestamp: new Date().toISOString()
          })
        }
      }

      case 'mark-completed': {
        const { contentId } = request
        if (!contentId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Content ID is required' })
          }
        }

        continuousEducationEngine.markContentCompleted(userId, contentId)
        const stats = continuousEducationEngine.getUserStats(userId)

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Content marked as completed',
            stats,
            timestamp: new Date().toISOString()
          })
        }
      }

      case 'get-progress': {
        const { pathId } = request
        
        if (pathId) {
          const pathProgress = continuousEducationEngine.getLearningPathProgress(userId, pathId)
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              pathProgress,
              timestamp: new Date().toISOString()
            })
          }
        } else {
          const stats = continuousEducationEngine.getUserStats(userId)
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              stats,
              timestamp: new Date().toISOString()
            })
          }
        }
      }

      case 'schedule': {
        const { contentId, deliveryTime, method } = request
        
        if (!contentId || !deliveryTime || !method) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Content ID, delivery time, and method are required for scheduling' 
            })
          }
        }

        const schedule = continuousEducationEngine.scheduleContentDelivery(
          userId,
          contentId,
          new Date(deliveryTime),
          method
        )

        // In a real implementation, you would save this schedule to a database
        // and set up the actual delivery mechanism (email service, push notifications, etc.)
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            schedule,
            message: 'Content delivery scheduled',
            timestamp: new Date().toISOString()
          })
        }
      }

      case 'deliver': {
        // This would be called by a scheduled job or webhook
        const { contentId, method } = request
        
        if (!contentId || !method) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Content ID and method are required for delivery' 
            })
          }
        }

        const content = continuousEducationEngine.getContentById(contentId)
        if (!content) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Content not found' })
          }
        }

        // Simulate delivery based on method
        let deliveryResult
        switch (method) {
          case 'email':
            deliveryResult = await deliverViaEmail(userId, content)
            break
          case 'push':
            deliveryResult = await deliverViaPush(userId, content)
            break
          case 'in-app':
            deliveryResult = await deliverInApp(userId, content)
            break
          default:
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Invalid delivery method' })
            }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            deliveryResult,
            message: 'Content delivered successfully',
            timestamp: new Date().toISOString()
          })
        }
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        }
    }

  } catch (error) {
    console.error('Continuous education delivery error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

// Delivery method implementations
async function deliverViaEmail(userId: string, content: any) {
  // In a real implementation, this would integrate with an email service like SendGrid, Mailgun, etc.
  console.log(`Delivering content "${content.title}" to user ${userId} via email`)
  
  // Simulate email delivery
  const emailContent = {
    to: userId, // In practice, you'd look up the user's email
    subject: `Your Daily Growth: ${content.title}`,
    html: generateEmailTemplate(content),
    text: generateTextVersion(content)
  }

  // Mock successful delivery
  return {
    method: 'email',
    status: 'delivered',
    messageId: `email-${Date.now()}`,
    deliveredAt: new Date().toISOString()
  }
}

async function deliverViaPush(userId: string, content: any) {
  // In a real implementation, this would integrate with a push notification service
  console.log(`Delivering content "${content.title}" to user ${userId} via push notification`)
  
  const pushContent = {
    title: 'Your Daily Growth Moment',
    body: `${content.title} - ${content.estimatedTime} min read`,
    data: {
      contentId: content.id,
      type: content.type,
      category: content.category
    }
  }

  // Mock successful delivery
  return {
    method: 'push',
    status: 'delivered',
    notificationId: `push-${Date.now()}`,
    deliveredAt: new Date().toISOString()
  }
}

async function deliverInApp(userId: string, content: any) {
  // In a real implementation, this would save to a database for in-app display
  console.log(`Delivering content "${content.title}" to user ${userId} via in-app notification`)
  
  const inAppContent = {
    userId,
    contentId: content.id,
    title: content.title,
    message: `New ${content.type} available: ${content.title}`,
    type: 'education_content',
    priority: 'normal',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }

  // Mock successful delivery
  return {
    method: 'in-app',
    status: 'delivered',
    notificationId: `inapp-${Date.now()}`,
    deliveredAt: new Date().toISOString()
  }
}

function generateEmailTemplate(content: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.title}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .action-items { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Your Daily Growth</h1>
            <p>${content.type.charAt(0).toUpperCase() + content.type.slice(1)} • ${content.estimatedTime} minutes</p>
        </div>
        
        <div class="content">
            <h2>${content.title}</h2>
            <div>${content.content.replace(/\n/g, '<br>')}</div>
        </div>
        
        ${content.actionItems && content.actionItems.length > 0 ? `
        <div class="action-items">
            <h3>Today's Action Items:</h3>
            <ul>
                ${content.actionItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <div style="text-align: center;">
            <a href="#" class="cta-button">Mark as Complete</a>
        </div>
        
        <div class="footer">
            <p>Keep growing! 🌱</p>
            <p>Galaxy Dream Team - Ethiopia's Premier Personal Development Platform</p>
        </div>
    </body>
    </html>
  `
}

function generateTextVersion(content: any): string {
  let text = `Your Daily Growth: ${content.title}\n\n`
  text += `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} • ${content.estimatedTime} minutes\n\n`
  text += `${content.content}\n\n`
  
  if (content.actionItems && content.actionItems.length > 0) {
    text += `Today's Action Items:\n`
    content.actionItems.forEach((item: string, index: number) => {
      text += `${index + 1}. ${item}\n`
    })
    text += '\n'
  }
  
  text += `Keep growing! 🌱\n`
  text += `Galaxy Dream Team - Ethiopia's Premier Personal Development Platform`
  
  return text
}