import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'
import { ContentItem } from '../../../../lib/models/content'
import { auth } from '../../../../lib/auth'

// GET /api/admin/content - Get all content
export async function GET(request: NextRequest) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const contentType = searchParams.get('contentType')
    const depthLevel = searchParams.get('depthLevel')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Build query
    let query = supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (contentType) {
      query = query.eq('content_type', contentType)
    }
    
    if (depthLevel) {
      query = query.eq('depth_level', depthLevel)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching content:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, contents: data })
  } catch (error) {
    console.error('Error in content API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/content - Create new content
export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const contentData = await request.json()
    
    // Validate content data
    const validationResult = validateContentData(contentData)
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      )
    }
    
    // Generate slug if not provided
    if (!contentData.slug) {
      contentData.slug = generateSlug(contentData.title)
    }
    
    // Set default values
    const now = new Date().toISOString()
    const newContent = {
      ...contentData,
      created_at: now,
      updated_at: now,
      view_count: 0,
      engagement_rate: 0,
      conversion_rate: 0
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('content')
      .insert(newContent)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating content:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, content: data })
  } catch (error) {
    console.error('Error in content API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to validate content data
function validateContentData(data: Partial<ContentItem>): { valid: boolean; error?: string } {
  // Required fields
  const requiredFields = [
    'title', 
    'category', 
    'depthLevel', 
    'contentType', 
    'hook', 
    'insight', 
    'application', 
    'hungerBuilder', 
    'nextStep',
    'content',
    'excerpt',
    'requiredCaptureLevel',
    'estimatedReadTime',
    'tags',
    'publishedAt',
    'author'
  ]
  
  for (const field of requiredFields) {
    if (!data[field as keyof Partial<ContentItem>]) {
      return { valid: false, error: `Missing required field: ${field}` }
    }
  }
  
  // Value Escalator format validation
  const valueEscalatorFields = ['hook', 'insight', 'application', 'hungerBuilder', 'nextStep']
  for (const field of valueEscalatorFields) {
    const value = data[field as keyof Partial<ContentItem>] as string
    if (!value || value.length < 10) {
      return { 
        valid: false, 
        error: `Value Escalator field "${field}" must be at least 10 characters long` 
      }
    }
  }
  
  // Validate content length based on depth level
  const content = data.content as string
  const depthLevel = data.depthLevel as string
  
  if (depthLevel === 'surface' && content.length < 300) {
    return { valid: false, error: 'Surface content should be at least 300 characters' }
  } else if (depthLevel === 'medium' && content.length < 1000) {
    return { valid: false, error: 'Medium content should be at least 1000 characters' }
  } else if (depthLevel === 'deep' && content.length < 2000) {
    return { valid: false, error: 'Deep content should be at least 2000 characters' }
  }
  
  return { valid: true }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
}