import { Handler, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { UserModel } from '../../src/lib/models/user'
import { InteractionModel } from '../../src/lib/models/interaction'
import { LeadScoresModel } from '../../src/lib/models/lead-scores'
import { validateProgressiveCapture } from '../../src/lib/validations'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const { level, data, userId, sessionId, entryPoint } = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!level || !data || !sessionId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'Level, data, and sessionId are required',
        }),
      }
    }

    // Validate capture level
    if (![1, 2, 3].includes(level)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid capture level',
          details: 'Level must be 1, 2, or 3',
        }),
      }
    }

    // Validate data against schema
    const validation = validateProgressiveCapture(level, data)
    if (!validation.success) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Validation failed',
          details: validation.error.issues,
        }),
      }
    }

    const validatedData = validation.data as any

    let user: UserModel
    let isNewUser = false

    if (userId) {
      // Update existing user
      const existingUser = await UserModel.findById(userId)
      if (!existingUser) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'User not found',
            details: 'The specified user ID does not exist',
          }),
        }
      }

      // Update user with new capture level and data
      const updateData: any = {}
      if (level >= 1) updateData.email = validatedData.email
      if (level >= 2) updateData.phone = validatedData.phone
      if (level >= 3) {
        updateData.full_name = validatedData.fullName
        updateData.city = validatedData.city
      }

      await existingUser.updateCaptureLevel(level, updateData)
      user = existingUser
    } else {
      // Create new user or find by email
      const existingUser = await UserModel.findByEmail(validatedData.email)
      
      if (existingUser) {
        // Update existing user found by email
        const updateData: any = {}
        if (level >= 2) updateData.phone = validatedData.phone
        if (level >= 3) {
          updateData.full_name = validatedData.fullName
          updateData.city = validatedData.city
        }

        await existingUser.updateCaptureLevel(level, updateData)
        user = existingUser
      } else {
        // Create new user
        const userData: any = {
          email: validatedData.email,
          capture_level: level,
          entry_point: entryPoint || 'direct',
        }

        if (level >= 2) userData.phone = validatedData.phone
        if (level >= 3) {
          userData.full_name = validatedData.fullName
          userData.city = validatedData.city
        }

        user = await UserModel.create(userData)
        isNewUser = true
      }
    }

    // Track the form submission interaction
    await InteractionModel.trackFormSubmission(
      sessionId,
      `progressive-capture-level-${level}`,
      {
        level,
        fields_captured: Object.keys(validatedData),
        is_new_user: isNewUser,
        previous_capture_level: isNewUser ? 0 : user.captureLevel - 1
      },
      user.id
    )

    // Update lead score
    await LeadScoresModel.updateScore(user.id)

    // Get updated user data
    const updatedUser = await UserModel.findById(user.id)
    const leadScore = await LeadScoresModel.findByUserId(user.id)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: `Level ${level} information captured successfully`,
        data: {
          user: updatedUser?.toJSON(),
          leadScore: leadScore?.toJSON(),
          isNewUser,
          captureLevel: level,
        },
      }),
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