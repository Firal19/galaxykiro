import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    const { event_type, event_data, session_id, page_url } = body

    // Skip logging if essential data is missing
    if (!event_type || !session_id) {
      console.warn('⚠️ Skipping incomplete tracking request:', {
        event_type: event_type || 'undefined',
        session_id: session_id || 'undefined',
        page_url: page_url || 'undefined'
      })
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Log the interaction for debugging
    console.log('🔍 Tracking interaction:', {
      event_type,
      session_id,
      page_url: page_url || 'unknown',
      timestamp: new Date().toISOString()
    })

    // In a real implementation, you would:
    // 1. Store this data in your database (Supabase, PostgreSQL, etc.)
    // 2. Update user profiles and lead scores
    // 3. Trigger automation sequences based on events
    // 4. Send data to analytics platforms
    
    // For now, we'll simulate database storage and return success
    const interactionRecord = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      event_type,
      event_data,
      session_id,
      page_url,
      timestamp: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    }

    // Simulate async database operation
    await new Promise(resolve => setTimeout(resolve, 50))

    // Special handling for different event types
    if (event_type === 'status_progression') {
      console.log('🎯 Lead Status Progression:', {
        session_id,
        previous_status: event_data.previous_status,
        new_status: event_data.new_status,
        trigger: event_data.trigger_action,
        score: event_data.engagement_score,
        conversion_probability: event_data.conversion_probability
      })
    }

    if (event_type === 'tool_usage') {
      console.log('🔧 Tool Usage Tracked:', {
        session_id,
        tool_id: event_data.tool_id,
        tool_name: event_data.tool_name,
        engagement_score: event_data.engagement_score
      })
    }

    if (event_type === 'engagement_action') {
      console.log('⚡ Engagement Action:', {
        session_id,
        action: event_data.action,
        points: event_data.points_awarded,
        total_score: event_data.total_score,
        status: event_data.visitor_status
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Interaction tracked successfully',
      data: {
        interaction_id: interactionRecord.id,
        timestamp: interactionRecord.timestamp
      }
    })

  } catch (error) {
    console.error('Error tracking interaction:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track interaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle GET requests for debugging/testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const session_id = searchParams.get('session_id')

  try {
    // In a real implementation, fetch interaction history from database
    const mockData = {
      session_id,
      total_interactions: 42,
      recent_interactions: [
        {
          id: 'interaction_1',
          event_type: 'page_visit',
          timestamp: new Date().toISOString(),
          event_data: { page: '/tools' }
        },
        {
          id: 'interaction_2',
          event_type: 'tool_usage',
          timestamp: new Date().toISOString(),
          event_data: { tool_id: 'potential-quotient', tool_name: 'Potential Quotient Calculator' }
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: mockData
    })

  } catch (error) {
    console.error('Error fetching interaction data:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch interaction data'
    }, { status: 500 })
  }
} 