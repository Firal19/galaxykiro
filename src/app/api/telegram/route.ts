import { NextRequest, NextResponse } from 'next/server'

interface TelegramWebhookUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
    }
    chat: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      type: 'private' | 'group' | 'supergroup' | 'channel'
    }
    date: number
    text?: string
  }
  callback_query?: {
    id: string
    from: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
    }
    message?: any
    data?: string
  }
}

interface TelegramUser {
  telegramId: number
  username?: string
  firstName: string
  lastName?: string
  chatId: number
  isSubscribed: boolean
  subscriptionDate: string
  leadScore: number
  lastInteraction: string
  preferences: {
    notifications: boolean
    contentUpdates: boolean
    assessmentReminders: boolean
  }
}

// Mock user database - in production this would use a real database
const telegramUsers: Map<number, TelegramUser> = new Map()

// Bot commands and responses
const BOT_COMMANDS = {
  '/start': {
    text: `🌟 Welcome to Galaxy Kiro!

I'm your personal transformation assistant. I can help you:

✅ Get notified about new content
📊 Track your assessment progress  
🎯 Set and monitor your goals
📚 Discover relevant resources
🔔 Receive personalized reminders

Choose an option below or type /help for more commands.`,
    keyboard: [
      [{ text: '📊 Check My Progress', callback_data: 'progress' }],
      [{ text: '🎯 Set Goals', callback_data: 'goals' }, { text: '📚 Browse Content', callback_data: 'content' }],
      [{ text: '⚙️ Settings', callback_data: 'settings' }]
    ]
  },
  '/help': {
    text: `🔧 Available Commands:

/start - Get started with Galaxy Kiro
/progress - View your transformation progress
/goals - Set and track your goals
/content - Browse latest content
/assessments - Take assessments
/reminders - Manage reminders
/settings - Update preferences
/unsubscribe - Unsubscribe from updates

💡 You can also just chat with me naturally!`,
    keyboard: null
  },
  '/progress': {
    text: `📊 Your Transformation Progress:

🎯 Assessments Completed: 3/8
📚 Content Consumed: 15 articles
⭐ Current Lead Score: 85/100
📈 Weekly Engagement: 92%

Keep up the great work! 🚀

What would you like to focus on next?`,
    keyboard: [
      [{ text: '📝 Take Assessment', callback_data: 'assessment' }],
      [{ text: '📚 Read Content', callback_data: 'content' }],
      [{ text: '🎯 Update Goals', callback_data: 'goals' }]
    ]
  }
}

// Telegram Bot API functions
async function sendMessage(chatId: number, text: string, keyboard?: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured')
    return
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  }

  if (keyboard) {
    payload.reply_markup = {
      inline_keyboard: keyboard
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error('Failed to send Telegram message:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) return

  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'Processing...'
      })
    })
  } catch (error) {
    console.error('Error answering callback query:', error)
  }
}

// Handle user registration/updates
function updateUser(telegramUser: any, chatId: number): TelegramUser {
  const existingUser = telegramUsers.get(telegramUser.id)
  
  const user: TelegramUser = {
    telegramId: telegramUser.id,
    username: telegramUser.username,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name,
    chatId,
    isSubscribed: existingUser?.isSubscribed ?? true,
    subscriptionDate: existingUser?.subscriptionDate ?? new Date().toISOString(),
    leadScore: existingUser?.leadScore ?? 50,
    lastInteraction: new Date().toISOString(),
    preferences: existingUser?.preferences ?? {
      notifications: true,
      contentUpdates: true,
      assessmentReminders: true
    }
  }

  telegramUsers.set(telegramUser.id, user)
  return user
}

// Handle different message types
async function handleMessage(message: NonNullable<TelegramWebhookUpdate['message']>) {
  const user = updateUser(message.from, message.chat.id)
  const text = message.text?.toLowerCase() || ''

  // Handle commands
  if (text.startsWith('/')) {
    const command = text.split(' ')[0] as keyof typeof BOT_COMMANDS
    const commandResponse = BOT_COMMANDS[command]
    
    if (commandResponse) {
      await sendMessage(
        message.chat.id, 
        commandResponse.text, 
        commandResponse.keyboard
      )
      return
    }
  }

  // Handle natural language
  if (text.includes('progress') || text.includes('score')) {
    await sendMessage(
      message.chat.id,
      `📊 Your current progress:
      
Lead Score: ${user.leadScore}/100
Last Activity: ${new Date(user.lastInteraction).toLocaleDateString()}

Keep engaging with our content to improve your score! 🚀`,
      [[{ text: '📝 Take Assessment', callback_data: 'assessment' }]]
    )
    return
  }

  if (text.includes('help') || text.includes('command')) {
    const helpResponse = BOT_COMMANDS['/help']
    await sendMessage(message.chat.id, helpResponse.text, helpResponse.keyboard)
    return
  }

  // Default response
  await sendMessage(
    message.chat.id,
    `Hi ${user.firstName}! 👋

I understand you're looking for help with your transformation journey. 

Try these commands:
• /progress - Check your current progress
• /content - Browse latest content
• /help - See all available commands

What can I help you with today?`,
    [
      [{ text: '📊 My Progress', callback_data: 'progress' }],
      [{ text: '📚 Browse Content', callback_data: 'content' }]
    ]
  )
}

// Handle callback queries (button presses)
async function handleCallbackQuery(callbackQuery: NonNullable<TelegramWebhookUpdate['callback_query']>) {
  const user = updateUser(callbackQuery.from, callbackQuery.message?.chat?.id || callbackQuery.from.id)
  const data = callbackQuery.data

  await answerCallbackQuery(callbackQuery.id)

  switch (data) {
    case 'progress':
      await sendMessage(
        callbackQuery.from.id,
        `📊 Your Detailed Progress:

🎯 **Assessments**: 3 completed, 5 remaining
📚 **Content**: 15 articles read this month
🌟 **Lead Score**: ${user.leadScore}/100 (+5 this week)
🏆 **Achievements**: 2 badges earned
📈 **Engagement**: 92% (Above average!)

🚀 **Next Steps**:
- Complete your Decision Making assessment
- Read the Leadership series (3 articles)
- Join the upcoming Goal Setting webinar

Keep up the excellent work! 💪`,
        [
          [{ text: '📝 Take Assessment', callback_data: 'assessment' }],
          [{ text: '📚 Read Content', callback_data: 'content' }]
        ]
      )
      break

    case 'content':
      await sendMessage(
        callbackQuery.from.id,
        `📚 **Latest Content for You**:

🔥 **Trending Now**:
• "The Psychology of Decision Making" (12 min read)
• "Leadership in Times of Change" (Video, 25 min)
• "Goal Achievement Framework" (Assessment, 20 min)

✨ **Recommended Based on Your Progress**:
• "Advanced Influence Strategies" (Case Study)
• "Building High-Performance Teams" (Workshop)

📈 **Your Reading Stats**:
• This month: 15 articles
• Avg. time: 8 minutes per article
• Completion rate: 87%

Which topic interests you most?`,
        [
          [{ text: '🧠 Psychology', callback_data: 'psychology' }],
          [{ text: '👥 Leadership', callback_data: 'leadership' }],
          [{ text: '🎯 Goal Setting', callback_data: 'goals_content' }]
        ]
      )
      break

    case 'goals':
      await sendMessage(
        callbackQuery.from.id,
        `🎯 **Goal Setting & Tracking**:

📋 **Your Current Goals**:
1. ✅ Complete 5 assessments (3/5 done)
2. 🔄 Read 20 articles this month (15/20)
3. 📅 Schedule weekly reflection time
4. 🤝 Build network of 50+ connections (23/50)

🎉 **Recent Achievements**:
• Completed Decision Making assessment
• Read 5 articles in Leadership series
• Maintained 90%+ engagement for 2 weeks

Would you like to:`,
        [
          [{ text: '➕ Add New Goal', callback_data: 'add_goal' }],
          [{ text: '📊 Track Progress', callback_data: 'track_goals' }],
          [{ text: '🔄 Update Existing Goal', callback_data: 'update_goal' }]
        ]
      )
      break

    case 'settings':
      await sendMessage(
        callbackQuery.from.id,
        `⚙️ **Your Preferences**:

🔔 **Notifications**: ${user.preferences.notifications ? '✅ Enabled' : '❌ Disabled'}
📚 **Content Updates**: ${user.preferences.contentUpdates ? '✅ Enabled' : '❌ Disabled'}
📝 **Assessment Reminders**: ${user.preferences.assessmentReminders ? '✅ Enabled' : '❌ Disabled'}

📊 **Account Info**:
• Member since: ${new Date(user.subscriptionDate).toLocaleDateString()}
• Username: @${user.username || 'Not set'}
• Lead Score: ${user.leadScore}/100

What would you like to change?`,
        [
          [{ text: '🔔 Toggle Notifications', callback_data: 'toggle_notifications' }],
          [{ text: '📚 Content Preferences', callback_data: 'content_prefs' }],
          [{ text: '❌ Unsubscribe', callback_data: 'unsubscribe' }]
        ]
      )
      break

    case 'assessment':
      await sendMessage(
        callbackQuery.from.id,
        `📝 **Available Assessments**:

🎯 **Recommended for You**:
• Decision Making Mastery (20 min) - 🔥 Popular
• Leadership Style Analysis (15 min) - ⭐ Personalized
• Goal Achievement Patterns (25 min) - 📈 Growth

📊 **Your Assessment History**:
• Completed: 3 assessments
• Average score: 82/100
• Time saved: 2.5 hours with smart insights

🏆 **Benefits**:
• Personalized recommendations
• Track your growth over time
• Unlock advanced content
• Earn achievement badges

Ready to take your next assessment?`,
        [
          [{ text: '🧠 Decision Making', callback_data: 'assessment_decision' }],
          [{ text: '👤 Leadership Style', callback_data: 'assessment_leadership' }],
          [{ text: '🎯 Goal Achievement', callback_data: 'assessment_goals' }]
        ]
      )
      break

    default:
      await sendMessage(
        callbackQuery.from.id,
        `I'm working on that feature! 🔧

In the meantime, try:
• /progress - Check your progress
• /content - Browse content
• /help - See all commands

Is there anything else I can help you with?`,
        [[{ text: '🏠 Main Menu', callback_data: 'start' }]]
      )
  }
}

// Webhook endpoint for Telegram
export async function POST(request: NextRequest) {
  try {
    const update: TelegramWebhookUpdate = await request.json()

    // Verify webhook authenticity (optional but recommended)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    if (!telegramToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
    }

    // Handle different update types
    if (update.message) {
      await handleMessage(update.message)
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint for webhook setup and bot information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
    }

    switch (action) {
      case 'webhook_info':
        // Get current webhook info
        const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
        const webhookInfo = await webhookResponse.json()
        return NextResponse.json(webhookInfo)

      case 'set_webhook':
        // Set webhook URL
        const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram`
        const setWebhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query']
          })
        })
        const setWebhookResult = await setWebhookResponse.json()
        return NextResponse.json(setWebhookResult)

      case 'bot_info':
        // Get bot information
        const botResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
        const botInfo = await botResponse.json()
        return NextResponse.json(botInfo)

      case 'stats':
        // Return usage statistics
        return NextResponse.json({
          totalUsers: telegramUsers.size,
          activeUsers: Array.from(telegramUsers.values()).filter(user => 
            new Date(user.lastInteraction) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          subscribedUsers: Array.from(telegramUsers.values()).filter(user => user.isSubscribed).length,
          averageLeadScore: Array.from(telegramUsers.values()).reduce((sum, user) => sum + user.leadScore, 0) / telegramUsers.size || 0
        })

      default:
        return NextResponse.json({
          bot: 'Galaxy Kiro Telegram Bot',
          status: 'Active',
          version: '1.0.0',
          features: [
            'Progress tracking',
            'Content recommendations',
            'Assessment reminders',
            'Goal setting assistance',
            'Personalized notifications'
          ],
          commands: Object.keys(BOT_COMMANDS),
          users: telegramUsers.size
        })
    }

  } catch (error) {
    console.error('Telegram API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Utility function to send notifications to users
async function sendNotificationToUser(telegramId: number, message: string, keyboard?: any) {
  const user = telegramUsers.get(telegramId)
  if (!user || !user.isSubscribed || !user.preferences.notifications) {
    return false
  }

  await sendMessage(user.chatId, message, keyboard)
  return true
}

// Utility function to broadcast messages to all subscribed users
async function broadcastMessage(message: string, keyboard?: any, filter?: (user: TelegramUser) => boolean) {
  const users = Array.from(telegramUsers.values())
  const targetUsers = filter ? users.filter(filter) : users.filter(user => user.isSubscribed)

  const promises = targetUsers.map(user => {
    if (user.preferences.notifications) {
      return sendMessage(user.chatId, message, keyboard)
    }
  })

  await Promise.all(promises)
  return targetUsers.length
}