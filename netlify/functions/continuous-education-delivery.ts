import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface DeliveryRequest {
  userId?: string;
  deliveryType: 'scheduled' | 'immediate' | 'test';
  channels?: string[];
}

interface ContentDeliveryPayload {
  email?: {
    to: string;
    subject: string;
    content: string;
    recommendations: any[];
  };
  sms?: {
    to: string;
    message: string;
  };
  telegram?: {
    chatId: string;
    message: string;
  };
}

export const handler: Handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, deliveryType, channels }: DeliveryRequest = JSON.parse(event.body || '{}');

    if (deliveryType === 'scheduled') {
      // Process scheduled deliveries for all users
      await processScheduledDeliveries();
    } else if (deliveryType === 'immediate' && userId) {
      // Process immediate delivery for specific user
      await processImmediateDelivery(userId, channels);
    } else if (deliveryType === 'test' && userId) {
      // Send test delivery
      await sendTestDelivery(userId);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Content delivery processed successfully' 
      })
    };

  } catch (error) {
    console.error('Content delivery error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to process content delivery',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function processScheduledDeliveries() {
  try {
    // Get all users with scheduled deliveries due
    const { data: scheduledDeliveries, error } = await supabase
      .from('content_delivery_schedule')
      .select(`
        *,
        users (
          id,
          email,
          phone,
          telegram_handle,
          subscription_preferences,
          content_preferences
        )
      `)
      .lte('next_delivery', new Date().toISOString())
      .eq('is_active', true);

    if (error) throw error;

    for (const delivery of scheduledDeliveries || []) {
      await processUserDelivery(delivery);
    }

    console.log(`Processed ${scheduledDeliveries?.length || 0} scheduled deliveries`);
  } catch (error) {
    console.error('Error processing scheduled deliveries:', error);
    throw error;
  }
}

async function processImmediateDelivery(userId: string, channels?: string[]) {
  try {
    // Get user data and preferences
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Generate personalized recommendations
    const recommendations = await generatePersonalizedRecommendations(userId);

    // Create delivery payload
    const deliveryPayload = await createDeliveryPayload(user, recommendations);

    // Send through specified channels or user preferences
    const targetChannels = channels || user.subscription_preferences || ['email'];
    
    for (const channel of targetChannels) {
      await sendContentDelivery(channel, deliveryPayload, user);
    }

    // Track delivery
    await trackContentDelivery(userId, 'immediate', targetChannels, recommendations);

  } catch (error) {
    console.error('Error processing immediate delivery:', error);
    throw error;
  }
}

async function processUserDelivery(delivery: any) {
  try {
    const user = delivery.users;
    const userId = user.id;

    // Generate fresh personalized recommendations
    const recommendations = await generatePersonalizedRecommendations(userId);

    // Create delivery payload
    const deliveryPayload = await createDeliveryPayload(user, recommendations);

    // Send through user's preferred channels
    for (const channel of delivery.delivery_channels) {
      await sendContentDelivery(channel, deliveryPayload, user);
    }

    // Update delivery schedule for next time
    await updateDeliverySchedule(delivery.id, delivery.frequency);

    // Track delivery
    await trackContentDelivery(userId, 'scheduled', delivery.delivery_channels, recommendations);

  } catch (error) {
    console.error(`Error processing delivery for user ${delivery.user_id}:`, error);
  }
}

async function generatePersonalizedRecommendations(userId: string) {
  try {
    // Get user's engagement patterns
    const { data: engagementData } = await supabase
      .from('user_engagement_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user's recent activity
    const { data: recentActivity } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get available educational content
    const { data: availableContent } = await supabase
      .from('educational_content')
      .select('*')
      .eq('is_active', true)
      .order('engagement_score', { ascending: false })
      .limit(20);

    // Simple recommendation algorithm
    const recommendations = [];
    
    if (availableContent) {
      // Add high-engagement content
      const topContent = availableContent
        .filter(content => content.engagement_score > 0.8)
        .slice(0, 3);
      
      recommendations.push(...topContent.map(content => ({
        ...content,
        reason: 'Highly rated by other users',
        priority: 'high'
      })));

      // Add content based on user preferences
      const userPreferences = engagementData?.content_preferences || [];
      const preferredContent = availableContent
        .filter(content => userPreferences.includes(content.category))
        .slice(0, 2);
      
      recommendations.push(...preferredContent.map(content => ({
        ...content,
        reason: 'Matches your interests',
        priority: 'medium'
      })));

      // Add new content
      const newContent = availableContent
        .filter(content => {
          const daysSinceCreated = Math.floor(
            (new Date().getTime() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceCreated <= 7;
        })
        .slice(0, 1);
      
      recommendations.push(...newContent.map(content => ({
        ...content,
        reason: 'Newly published',
        priority: 'low'
      })));
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

async function createDeliveryPayload(user: any, recommendations: any[]): Promise<ContentDeliveryPayload> {
  const payload: ContentDeliveryPayload = {};

  // Email content
  if (user.subscription_preferences?.includes('email')) {
    payload.email = {
      to: user.email,
      subject: `Your Weekly Growth Insights - ${new Date().toLocaleDateString()}`,
      content: generateEmailContent(user, recommendations),
      recommendations
    };
  }

  // SMS content
  if (user.subscription_preferences?.includes('sms') && user.phone) {
    payload.sms = {
      to: user.phone,
      message: generateSMSContent(user, recommendations)
    };
  }

  // Telegram content
  if (user.subscription_preferences?.includes('telegram') && user.telegram_handle) {
    payload.telegram = {
      chatId: user.telegram_handle,
      message: generateTelegramContent(user, recommendations)
    };
  }

  return payload;
}

function generateEmailContent(user: any, recommendations: any[]): string {
  const firstName = user.email.split('@')[0];
  
  let content = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Galaxy Dream Team</h1>
          <p style="color: white; margin: 10px 0 0 0;">Your Personal Growth Journey Continues</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${firstName}!</h2>
          <p>Here are your personalized recommendations for this week:</p>
          
          <div style="margin: 20px 0;">
  `;

  recommendations.forEach((rec, index) => {
    content += `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <h3 style="color: #1f2937; margin: 0 0 10px 0;">${rec.title}</h3>
        <p style="color: #6b7280; margin: 0 0 10px 0;">${rec.description}</p>
        <p style="color: #10b981; font-size: 14px; margin: 0 0 10px 0;">
          <strong>Why this matters:</strong> ${rec.reason}
        </p>
        <div style="margin-top: 10px;">
          <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #6b7280;">
            ${rec.content_type} • ${rec.estimated_time} min
          </span>
        </div>
      </div>
    `;
  });

  content += `
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.URL}/membership/dashboard" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Keep growing, keep achieving!</p>
            <p>The Galaxy Dream Team</p>
            <p>
              <a href="${process.env.URL}/membership/settings" style="color: #6b7280;">Update Preferences</a> | 
              <a href="${process.env.URL}/membership/settings" style="color: #6b7280;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return content;
}

function generateSMSContent(user: any, recommendations: any[]): string {
  const topRec = recommendations[0];
  if (!topRec) {
    return `🌟 Galaxy Dream Team: Your weekly growth content is ready! Check your dashboard for personalized recommendations. ${process.env.URL}/membership/dashboard`;
  }

  return `🌟 Galaxy Dream Team: New recommendation for you: "${topRec.title}" - ${topRec.reason}. View more: ${process.env.URL}/membership/dashboard`;
}

function generateTelegramContent(user: any, recommendations: any[]): string {
  let message = `🌟 *Galaxy Dream Team - Weekly Growth Update*\n\n`;
  message += `Hello! Here are your personalized recommendations:\n\n`;

  recommendations.slice(0, 3).forEach((rec, index) => {
    message += `${index + 1}. *${rec.title}*\n`;
    message += `   ${rec.description}\n`;
    message += `   _${rec.reason}_\n\n`;
  });

  message += `📊 [View Your Dashboard](${process.env.URL}/membership/dashboard)\n`;
  message += `⚙️ [Update Preferences](${process.env.URL}/membership/settings)`;

  return message;
}

async function sendContentDelivery(channel: string, payload: ContentDeliveryPayload, user: any) {
  try {
    switch (channel) {
      case 'email':
        if (payload.email) {
          await sendEmail(payload.email);
        }
        break;
      case 'sms':
        if (payload.sms) {
          await sendSMS(payload.sms);
        }
        break;
      case 'telegram':
        if (payload.telegram) {
          await sendTelegram(payload.telegram);
        }
        break;
    }
  } catch (error) {
    console.error(`Error sending ${channel} delivery:`, error);
  }
}

async function sendEmail(emailData: any) {
  // In a real implementation, you would integrate with an email service like SendGrid, Mailgun, etc.
  console.log('Email would be sent:', {
    to: emailData.to,
    subject: emailData.subject,
    contentLength: emailData.content.length
  });
  
  // Placeholder for actual email sending
  // await emailService.send(emailData);
}

async function sendSMS(smsData: any) {
  // In a real implementation, you would integrate with an SMS service like Twilio
  console.log('SMS would be sent:', {
    to: smsData.to,
    messageLength: smsData.message.length
  });
  
  // Placeholder for actual SMS sending
  // await smsService.send(smsData);
}

async function sendTelegram(telegramData: any) {
  // In a real implementation, you would integrate with Telegram Bot API
  console.log('Telegram message would be sent:', {
    chatId: telegramData.chatId,
    messageLength: telegramData.message.length
  });
  
  // Placeholder for actual Telegram sending
  // await telegramBot.sendMessage(telegramData.chatId, telegramData.message);
}

async function updateDeliverySchedule(scheduleId: string, frequency: string) {
  try {
    const nextDelivery = calculateNextDeliveryTime(frequency);
    
    await supabase
      .from('content_delivery_schedule')
      .update({
        last_delivery: new Date().toISOString(),
        next_delivery: nextDelivery,
        updated_at: new Date().toISOString()
      })
      .eq('id', scheduleId);
  } catch (error) {
    console.error('Error updating delivery schedule:', error);
  }
}

function calculateNextDeliveryTime(frequency: string): string {
  const now = new Date();
  const nextDelivery = new Date(now);

  switch (frequency) {
    case 'daily':
      nextDelivery.setDate(nextDelivery.getDate() + 1);
      break;
    case 'weekly':
      nextDelivery.setDate(nextDelivery.getDate() + 7);
      break;
    case 'monthly':
      nextDelivery.setMonth(nextDelivery.getMonth() + 1);
      break;
    default:
      nextDelivery.setDate(nextDelivery.getDate() + 7); // Default to weekly
  }

  return nextDelivery.toISOString();
}

async function trackContentDelivery(
  userId: string, 
  deliveryType: string, 
  channels: string[], 
  recommendations: any[]
) {
  try {
    await supabase
      .from('interactions')
      .insert({
        user_id: userId,
        interaction_type: 'content_delivery',
        metadata: {
          delivery_type: deliveryType,
          channels,
          recommendations_count: recommendations.length,
          recommendation_ids: recommendations.map(r => r.id)
        }
      });
  } catch (error) {
    console.error('Error tracking content delivery:', error);
  }
}

async function sendTestDelivery(userId: string) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) throw new Error('User not found');

    const testRecommendations = [
      {
        id: 'test-1',
        title: 'Test Recommendation',
        description: 'This is a test delivery to verify your subscription preferences.',
        content_type: 'article',
        estimated_time: 5,
        reason: 'Testing your delivery preferences'
      }
    ];

    const deliveryPayload = await createDeliveryPayload(user, testRecommendations);

    for (const channel of user.subscription_preferences || ['email']) {
      await sendContentDelivery(channel, deliveryPayload, user);
    }

    await trackContentDelivery(userId, 'test', user.subscription_preferences, testRecommendations);
  } catch (error) {
    console.error('Error sending test delivery:', error);
    throw error;
  }
}