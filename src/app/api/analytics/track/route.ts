import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// Analytics event interface
interface AnalyticsEvent {
  id: string
  userId?: string
  sessionId: string
  type: 'page_view' | 'tool_use' | 'content_view' | 'cta_click' | 'form_submit' | 'conversion' | 'exit'
  category: 'engagement' | 'conversion' | 'retention' | 'acquisition'
  action: string
  label?: string
  value?: number
  timestamp: number
  metadata: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const { event } = await request.json()
    
    if (!event || typeof event !== 'object') {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['sessionId', 'type', 'category', 'action', 'timestamp']
    for (const field of requiredFields) {
      if (!event[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Initialize Supabase client
    const supabase = createSupabaseClient()

    // Store event in database
    const { data, error } = await supabase
      .from('analytics_events')
      .insert([{
        id: event.id,
        user_id: event.userId || null,
        session_id: event.sessionId,
        event_type: event.type,
        category: event.category,
        action: event.action,
        label: event.label || null,
        value: event.value || null,
        timestamp: new Date(event.timestamp).toISOString(),
        metadata: event.metadata,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error storing analytics event:', error)
      return NextResponse.json(
        { error: 'Failed to store event' },
        { status: 500 }
      )
    }

    // Process real-time analytics updates
    await processRealTimeAnalytics(event)

    // Process conversion events
    if (event.type === 'conversion') {
      await processConversionEvent(event)
    }

    // Process A/B test events
    if (event.metadata?.abTest) {
      await processABTestEvent(event)
    }

    return NextResponse.json({ 
      success: true,
      eventId: event.id
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Process real-time analytics
async function processRealTimeAnalytics(event: AnalyticsEvent) {
  try {
    const supabase = createSupabaseClient()
    
    // Update real-time metrics table
    const { error } = await supabase
      .from('analytics_realtime')
      .upsert({
        metric_type: event.type,
        value: 1,
        session_id: event.sessionId,
        timestamp: new Date().toISOString(),
        metadata: {
          action: event.action,
          category: event.category,
          page: event.metadata?.page
        }
      }, {
        onConflict: 'session_id,metric_type'
      })

    if (error) {
      console.error('Error updating real-time analytics:', error)
    }
  } catch (error) {
    console.error('Real-time analytics processing error:', error)
  }
}

// Process conversion events
async function processConversionEvent(event: AnalyticsEvent) {
  try {
    const supabase = createSupabaseClient()
    
    // Store conversion data
    const { error } = await supabase
      .from('analytics_conversions')
      .insert([{
        user_id: event.userId || null,
        session_id: event.sessionId,
        conversion_type: event.action,
        value: event.value || 0,
        timestamp: new Date(event.timestamp).toISOString(),
        metadata: event.metadata
      }])

    if (error) {
      console.error('Error storing conversion event:', error)
    }

    // Update user conversion metrics
    if (event.userId) {
      await updateUserConversionMetrics(event.userId, event)
    }
  } catch (error) {
    console.error('Conversion processing error:', error)
  }
}

// Process A/B test events
async function processABTestEvent(event: AnalyticsEvent) {
  try {
    const supabase = createSupabaseClient()
    
    const testId = event.metadata.abTest
    const variant = event.metadata.abVariant
    
    if (!testId || !variant) return

    // Update A/B test results
    const { error } = await supabase
      .from('analytics_ab_tests')
      .upsert({
        test_id: testId,
        variant_id: variant,
        user_id: event.userId || null,
        session_id: event.sessionId,
        event_type: event.type,
        converted: event.type === 'conversion',
        timestamp: new Date(event.timestamp).toISOString()
      }, {
        onConflict: 'test_id,variant_id,session_id'
      })

    if (error) {
      console.error('Error updating A/B test data:', error)
    }
  } catch (error) {
    console.error('A/B test processing error:', error)
  }
}

// Update user conversion metrics
async function updateUserConversionMetrics(userId: string, event: AnalyticsEvent) {
  try {
    const supabase = createSupabaseClient()
    
    // Get current user metrics
    const { data: currentMetrics } = await supabase
      .from('user_analytics_summary')
      .select('*')
      .eq('user_id', userId)
      .single()

    const newMetrics = {
      user_id: userId,
      total_conversions: (currentMetrics?.total_conversions || 0) + 1,
      total_revenue: (currentMetrics?.total_revenue || 0) + (event.value || 0),
      last_conversion: new Date(event.timestamp).toISOString(),
      conversion_types: {
        ...currentMetrics?.conversion_types,
        [event.action]: (currentMetrics?.conversion_types?.[event.action] || 0) + 1
      },
      updated_at: new Date().toISOString()
    }

    // Upsert user metrics
    const { error } = await supabase
      .from('user_analytics_summary')
      .upsert(newMetrics, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error updating user conversion metrics:', error)
    }
  } catch (error) {
    console.error('User metrics update error:', error)
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}