import { NextRequest, NextResponse } from 'next/server'
import { leadScoringService } from '@/lib/lead-scoring-service'

// GET /api/leads/[leadId] - Get specific lead details
export async function GET(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    // Check admin authentication
    const session = request.cookies.get('galaxy_kiro_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { leadId } = params

    // Get lead profile
    const lead = leadScoringService.getProfileById(leadId)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Get interaction history
    const interactions = leadScoringService.getInteractionHistory(leadId)

    // Get lead timeline (interactions + profile changes)
    const timeline = [
      ...interactions.map(interaction => ({
        ...interaction,
        type: 'interaction'
      })),
      {
        id: `profile_${lead.id}`,
        type: 'profile_created',
        timestamp: lead.createdAt,
        details: {
          action: 'Profile Created',
          data: {
            email: lead.email,
            name: lead.name,
            source: lead.source
          }
        }
      }
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Calculate engagement metrics
    const engagementMetrics = {
      totalInteractions: interactions.length,
      lastActive: lead.lastInteraction,
      toolsUsed: interactions.filter(i => i.eventType === 'tool_completion').length,
      contentViewed: interactions.filter(i => i.eventType === 'content_view').length,
      pageViews: interactions.filter(i => i.eventType === 'page_visit').length,
      avgSessionTime: '8.5 minutes', // Would be calculated from actual data
      conversionProbability: Math.min((lead.score / 1000) * 100, 100)
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: lead,
        timeline,
        interactions,
        metrics: engagementMetrics
      }
    })

  } catch (error) {
    console.error('Error fetching lead details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/leads/[leadId] - Update lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    // Check admin authentication
    const session = request.cookies.get('galaxy_kiro_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { leadId } = params
    const body = await request.json()
    const { name, phone, status, source, notes } = body

    // Get existing lead
    const existingLead = leadScoringService.getProfileById(leadId)
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Update lead data
    const updatedLead = {
      ...existingLead,
      name: name || existingLead.name,
      phone: phone || existingLead.phone,
      status: status || existingLead.status,
      source: source || existingLead.source,
      lastUpdated: new Date().toISOString(),
      metadata: {
        ...existingLead.metadata,
        notes: notes !== undefined ? notes : existingLead.metadata?.notes,
        updatedBy: sessionData.id
      }
    }

    // Update in storage
    leadScoringService.updateProfile(leadId, updatedLead)

    // Track update event
    leadScoringService.trackInteraction({
      eventType: 'lead_updated',
      userId: leadId,
      adminId: sessionData.id,
      details: {
        changes: {
          name: name !== existingLead.name ? { from: existingLead.name, to: name } : null,
          status: status !== existingLead.status ? { from: existingLead.status, to: status } : null,
          source: source !== existingLead.source ? { from: existingLead.source, to: source } : null
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[leadId] - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    // Check admin authentication
    const session = request.cookies.get('galaxy_kiro_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { leadId } = params

    // Check if lead exists
    const existingLead = leadScoringService.getProfileById(leadId)
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Delete lead (in production, you might want to soft delete)
    leadScoringService.deleteProfile(leadId)

    // Track deletion event
    leadScoringService.trackInteraction({
      eventType: 'lead_deleted',
      userId: leadId,
      adminId: sessionData.id,
      details: {
        deletedProfile: {
          email: existingLead.email,
          name: existingLead.name,
          status: existingLead.status
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}