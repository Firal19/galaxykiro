import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { InteractionModel } from '../../src/lib/models/interaction'
import { UserModel } from '../../src/lib/models/user'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'
import { ContentEngagementModel } from '../../src/lib/models/content-engagement'

// Initialize Supabase client for real-time subscriptions and direct operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface InteractionRequest {
  userId?: string
  sessionId: string
  eventType: string
  eventData: Record<string, unknown>
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  timestamp?: string
}

interface BatchInteractionRequest {
  interactions: InteractionRequest[]
  userId?: string
  sessionId: string
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const requestBody = JSON.parse(event.body || '{}')

    // Check if this is a batch request
    if (requestBody.interactions && Array.isArray(requestBody.interactions)) {
      return await handleBatchInteractions(requestBody as BatchInteractionRequest)
    } else {
      return await handleSingleInteraction(requestBody as InteractionRequest)
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

async function handleSingleInteraction(interactionRequest: InteractionRequest): Promise<HandlerResponse> {
  // Validate required fields
  if (!interactionRequest.sessionId || !interactionRequest.eventType) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required fields',
        details: 'sessionId and eventType are required',
      }),
    }
  }

  // Create interaction record
  const interaction = await InteractionModel.create({
    user_id: interactionRequest.userId,
    session_id: interactionRequest.sessionId,
    event_type: interactionRequest.eventType,
    event_data: interactionRequest.eventData || {},
    page_url: interactionRequest.pageUrl,
    referrer: interactionRequest.referrer,
    user_agent: interactionRequest.userAgent,
    ip_address: interactionRequest.ipAddress,
    timestamp: interactionRequest.timestamp || new Date().toISOString()
  })

  // Process interaction for business logic
  const processingResult = await processInteractionBusinessLogic(interaction)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Interaction tracked successfully',
      data: {
        interaction: interaction.toJSON(),
        processing: processingResult
      },
    }),
  }
}

async function handleBatchInteractions(batchRequest: BatchInteractionRequest): Promise<HandlerResponse> {
  // Validate batch request
  if (!batchRequest.sessionId || !batchRequest.interactions || batchRequest.interactions.length === 0) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing required fields',
        details: 'sessionId and interactions array are required',
      }),
    }
  }

  const results = []
  const errors = []

  // Process each interaction in the batch
  for (let i = 0; i < batchRequest.interactions.length; i++) {
    const interactionRequest = batchRequest.interactions[i]
    
    try {
      // Use batch sessionId if individual interaction doesn't have one
      if (!interactionRequest.sessionId) {
        interactionRequest.sessionId = batchRequest.sessionId
      }
      
      // Use batch userId if individual interaction doesn't have one
      if (!interactionRequest.userId && batchRequest.userId) {
        interactionRequest.userId = batchRequest.userId
      }

      const interaction = await InteractionModel.create({
        user_id: interactionRequest.userId,
        session_id: interactionRequest.sessionId,
        event_type: interactionRequest.eventType,
        event_data: interactionRequest.eventData || {},
        page_url: interactionRequest.pageUrl,
        referrer: interactionRequest.referrer,
        user_agent: interactionRequest.userAgent,
        ip_address: interactionRequest.ipAddress,
        timestamp: interactionRequest.timestamp || new Date().toISOString()
      })

      const processingResult = await processInteractionBusinessLogic(interaction)

      results.push({
        index: i,
        success: true,
        interaction: interaction.toJSON(),
        processing: processingResult
      })
    } catch (error) {
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Unknown error',
        interaction: interactionRequest
      })
    }
  }

  // Update lead scores once for the user if applicable
  if (batchRequest.userId) {
    try {
      await LeadScoresModel.updateScore(batchRequest.userId)
    } catch (error) {
      console.error('Error updating lead score for batch:', error)
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: `Batch processed: ${results.length} successful, ${errors.length} failed`,
      data: {
        successful: results,
        failed: errors,
        totalProcessed: batchRequest.interactions.length,
        sessionId: batchRequest.sessionId,
        userId: batchRequest.userId
      },
    }),
  }
}

interface ProcessingResult {
  triggers: string[];
  updates: string[];
  notifications: Array<Record<string, unknown>>;
  errors?: string[];
}

async function processInteractionBusinessLogic(interaction: InteractionModel): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    triggers: [],
    updates: [],
    notifications: []
  }

  try {
    // Process different event types with specific business logic
    switch (interaction.eventType) {
      case 'page_view':
        await processPageViewLogic(interaction, result)
        break

      case 'cta_click':
        await processCTAClickLogic(interaction, result)
        break

      case 'tool_start':
        await processToolStartLogic(interaction, result)
        break

      case 'tool_complete':
        await processToolCompleteLogic(interaction, result)
        break

      case 'content_engagement':
        await processContentEngagementLogic(interaction, result)
        break

      case 'form_submission':
        await processFormSubmissionLogic(interaction, result)
        break

      case 'webinar_registration':
        await processWebinarRegistrationLogic(interaction, result)
        break

      case 'scroll_depth':
        await processScrollDepthLogic(interaction, result)
        break

      case 'time_on_page':
        await processTimeOnPageLogic(interaction, result)
        break

      case 'exit_intent':
        await processExitIntentLogic(interaction, result)
        break

      default:
        (result.triggers as string[]).push('generic_interaction_processed')
    }

    // Update lead score if user is identified
    if (interaction.userId) {
      await LeadScoresModel.updateScore(interaction.userId)
      result.updates.push('lead_score_updated')

      // Check for tier changes
      const leadScore = await LeadScoresModel.findByUserId(interaction.userId)
      const user = await UserModel.findById(interaction.userId)
      
      if (leadScore && user) {
        const calculatedTier = await LeadScoresModel.getTierFromScore(leadScore.totalScore)
        if (calculatedTier !== user.currentTier) {
          await user.updateTier(calculatedTier)
          result.updates.push('user_tier_updated')
          result.notifications.push({
            type: 'tier_change',
            previousTier: user.currentTier,
            newTier: calculatedTier,
            score: leadScore.totalScore
          })

          // Trigger tier change notification
          await triggerTierChangeNotification(user.id, user.currentTier, calculatedTier, leadScore.totalScore)
        }
      }
    }

    // Send real-time updates
    await supabase
      .channel('interaction-processing')
      .send({
        type: 'broadcast',
        event: 'interaction-processed',
        payload: {
          interactionId: interaction.id,
          userId: interaction.userId,
          sessionId: interaction.sessionId,
          eventType: interaction.eventType,
          processing: result,
          timestamp: new Date().toISOString()
        }
      })

  } catch (error) {
    console.error('Error processing interaction business logic:', error)
    result.errors = [error instanceof Error ? error.message : 'Unknown processing error']
  }

  return result
}

async function processPageViewLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('page_view_tracked')
  
  // Track page popularity
  const eventData = interaction.eventData
  if (eventData.page_url) {
    // In a real implementation, you might update page analytics
    result.updates.push('page_analytics_updated')
  }
}

async function processCTAClickLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('cta_engagement_tracked')
  
  const eventData = interaction.eventData
  const ctaId = eventData.cta_id as string
  
  // High-value interaction - trigger engagement boost
  if (interaction.userId) {
    const user = await UserModel.findById(interaction.userId)
    if (user) {
      await user.updateEngagementScore(user.engagementScore + 2)
      result.updates.push('engagement_score_boosted')
    }
  }

  // Trigger specific CTA follow-up actions
  if (ctaId?.includes('webinar')) {
    result.triggers.push('webinar_interest_detected')
  } else if (ctaId?.includes('assessment')) {
    result.triggers.push('assessment_interest_detected')
  } else if (ctaId?.includes('office-visit')) {
    result.triggers.push('office_visit_interest_detected')
  }
}

async function processToolStartLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('tool_engagement_started')
  
  if (interaction.userId) {
    // Check if this is user's first tool
    const userToolUsage = await InteractionModel.findByUserId(interaction.userId, 50)
    const previousToolStarts = userToolUsage.filter(i => i.eventType === 'tool_start')
    
    if (previousToolStarts.length === 1) { // This is the first one
      result.notifications.push({
        type: 'first_tool_milestone',
        toolName: interaction.eventData.tool_name
      })
    }
  }
}

async function processToolCompleteLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('tool_completion_achieved')
  
  if (interaction.userId) {
    // Trigger assessment completion email sequence
    await triggerEmailSequence(interaction.userId, 'assessment_complete', 'tool_completed', {
      toolName: interaction.eventData.tool_name,
      completionTime: new Date().toISOString()
    })
    
    result.triggers.push('assessment_complete_sequence_triggered')
    
    // Check for multiple tool completions milestone
    const completedTools = await InteractionModel.findByUserId(interaction.userId, 100)
    const toolCompletions = completedTools.filter(i => i.eventType === 'tool_complete')
    
    if (toolCompletions.length === 5) {
      result.notifications.push({
        type: 'five_tools_milestone',
        count: 5
      })
    }
  }
}

async function processContentEngagementLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('content_engagement_tracked')
  
  const eventData = interaction.eventData
  if (interaction.userId && eventData.content_id) {
    // Update or create content engagement record
    const contentEngagement = await ContentEngagementModel.findOrCreate(
      interaction.userId,
      eventData.content_id as string,
      eventData.content_type as string || 'article',
      interaction.sessionId,
      eventData.content_category as string
    )
    
    if (eventData.time_spent) {
      await contentEngagement.updateTimeSpent(eventData.time_spent as number)
    }
    
    result.updates.push('content_engagement_updated')
  }
}

async function processFormSubmissionLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('form_submission_processed')
  
  const eventData = interaction.eventData
  const formId = eventData.form_id as string
  
  // Trigger appropriate email sequences based on form type
  if (interaction.userId) {
    if (formId?.includes('newsletter') || formId?.includes('subscribe')) {
      await triggerEmailSequence(interaction.userId, 'new_subscriber', 'newsletter_signup')
      result.triggers.push('new_subscriber_sequence_triggered')
    } else if (formId?.includes('assessment') || formId?.includes('tool')) {
      await triggerEmailSequence(interaction.userId, 'tool_user', 'tool_signup')
      result.triggers.push('tool_user_sequence_triggered')
    }
  }
}

async function processWebinarRegistrationLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('webinar_registration_processed')
  
  if (interaction.userId) {
    // High-value conversion - significant engagement boost
    const user = await UserModel.findById(interaction.userId)
    if (user) {
      await user.updateEngagementScore(user.engagementScore + 25)
      result.updates.push('webinar_registration_score_boost')
    }
    
    // Trigger webinar attendee sequence
    await triggerEmailSequence(interaction.userId, 'webinar_attendee', 'webinar_registration', {
      webinarTitle: interaction.eventData.webinar_title,
      webinarDate: interaction.eventData.webinar_date
    })
    
    result.triggers.push('webinar_attendee_sequence_triggered')
  }
}

async function processScrollDepthLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  const scrollDepth = interaction.eventData.depth as number
  
  if (scrollDepth >= 75) {
    result.triggers.push('high_scroll_engagement')
    
    if (interaction.userId) {
      const user = await UserModel.findById(interaction.userId)
      if (user) {
        await user.updateEngagementScore(user.engagementScore + 1)
        result.updates.push('scroll_engagement_score_boost')
      }
    }
  }
}

async function processTimeOnPageLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  const timeSpent = interaction.eventData.time_spent as number
  
  if (timeSpent >= 300) { // 5 minutes
    result.triggers.push('high_time_engagement')
    
    if (interaction.userId) {
      const user = await UserModel.findById(interaction.userId)
      if (user) {
        const timeBonus = Math.min(10, Math.floor(timeSpent / 60)) // 1 point per minute, max 10
        await user.updateEngagementScore(user.engagementScore + timeBonus)
        result.updates.push('time_engagement_score_boost')
      }
    }
  }
}

async function processExitIntentLogic(interaction: InteractionModel, result: ProcessingResult): Promise<void> {
  result.triggers.push('exit_intent_detected')
  
  // This could trigger exit-intent popups or special offers
  if (interaction.userId) {
    result.notifications.push({
      type: 'exit_intent_opportunity',
      pageUrl: interaction.pageUrl,
      sessionDuration: interaction.eventData.session_duration
    })
  }
}

async function triggerTierChangeNotification(
  userId: string, 
  previousTier: string, 
  newTier: string, 
  score: number
): Promise<void> {
  // This would call the realtime-notifications function
  try {
    await fetch(`${process.env.URL}/.netlify/functions/realtime-notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tier_change',
        userId,
        data: {
          userId,
          previousTier,
          newTier,
          score,
          timestamp: new Date().toISOString()
        },
        immediate: true
      })
    })
  } catch (error) {
    console.error('Error triggering tier change notification:', error)
  }
}

async function triggerEmailSequence(
  userId: string, 
  sequenceType: string, 
  triggerEvent: string, 
  customData?: Record<string, unknown>
): Promise<void> {
  // This would call the trigger-email-sequence function
  try {
    await fetch(`${process.env.URL}/.netlify/functions/trigger-email-sequence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        sequenceType,
        triggerEvent,
        customData,
        immediate: true
      })
    })
  } catch (error) {
    console.error('Error triggering email sequence:', error)
  }
}