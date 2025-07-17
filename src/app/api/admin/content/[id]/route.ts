import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../../lib/supabase'
import { ContentItem } from '../../../../../lib/models/content'
import { auth } from '../../../../../lib/auth'

// GET /api/admin/content/[id] - Get content by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
      }
      console.error('Error fetching content:', error)
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

// PUT /api/admin/content/[id] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const contentData = await request.json()
    
    // Validate content data
    const validationResult = validateContentData(contentData)
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      )
    }
    
    // Update content
    const { data, error } = await supabase
      .from('content')
      .update({
        ...contentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating content:', error)
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

// DELETE /api/admin/content/[id] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting content:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
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