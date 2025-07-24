import { NextRequest, NextResponse } from 'next/server'
import { leadScoringService } from '@/lib/lead-scoring-service'

// GET /api/leads - Fetch leads with filtering and pagination
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const source = searchParams.get('source') || 'all'
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Get all profiles (in production, this would be a Supabase query)
    let leads = leadScoringService.getAllProfiles()

    // Apply filters
    if (status !== 'all') {
      leads = leads.filter(lead => lead.status === status)
    }

    if (source !== 'all') {
      leads = leads.filter(lead => lead.source === source)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      leads = leads.filter(lead => 
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    leads.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a] || ''
      let bValue = b[sortBy as keyof typeof b] || ''
      
      // Handle different data types
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLeads = leads.slice(startIndex, endIndex)

    // Calculate stats
    const stats = {
      total: leads.length,
      pending: leads.filter(l => l.status === 'pending_approval').length,
      soft_members: leads.filter(l => l.status === 'soft_member').length,
      candidates: leads.filter(l => l.status === 'candidate').length,
      hot_leads: leads.filter(l => l.status === 'hot_lead').length,
      totalPages: Math.ceil(leads.length / limit),
      currentPage: page
    }

    return NextResponse.json({
      success: true,
      data: paginatedLeads,
      stats,
      pagination: {
        page,
        limit,
        total: leads.length,
        totalPages: stats.totalPages,
        hasNext: page < stats.totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { email, name, phone, status, source, notes } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Check if lead already exists
    const existingLead = leadScoringService.getProfileByEmail(email)
    if (existingLead) {
      return NextResponse.json(
        { error: 'Lead already exists with this email' },
        { status: 409 }
      )
    }

    // Create new lead
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      phone: phone || null,
      status: status || 'pending_approval',
      role: 'soft_member',
      source: source || 'manual',
      score: 0,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: {
        createdBy: sessionData.id,
        notes: notes || null
      }
    }

    // Store the lead
    leadScoringService.createProfile(newLead)

    // Track creation event
    leadScoringService.trackInteraction({
      eventType: 'lead_created',
      userId: newLead.id,
      adminId: sessionData.id,
      email: email
    })

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}