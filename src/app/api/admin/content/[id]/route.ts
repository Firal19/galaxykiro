import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../../lib/supabase'
import { ContentItem } from '../../../../../lib/models/content'
import { auth } from '../../../../../lib/auth'
import { withSecurity, sanitizeHtml } from '../../../../../lib/security'
import { z } from 'zod'

// Define ID parameter schema
const IdParamSchema = z.object({
  id: z.string().uuid()
});

// GET /api/admin/content/[id] - Get content by ID
async function getContentByIdHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = IdParamSchema.parse(params);
    
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = validatedParams;
    
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid content ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply security wrapper to GET handler
export const GET = withSecurity(getContentByIdHandler, {
  rateLimit: 50,
  cors: true,
  securityHeaders: true
});

// Define content update schema
const ContentUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  category: z.string().optional(),
  depthLevel: z.enum(['surface', 'medium', 'deep']).optional(),
  contentType: z.string().optional(),
  hook: z.string().min(10).optional(),
  insight: z.string().min(10).optional(),
  application: z.string().min(10).optional(),
  hungerBuilder: z.string().min(10).optional(),
  nextStep: z.string().min(10).optional(),
  content: z.string().min(100).optional(),
  excerpt: z.string().min(10).max(300).optional(),
  requiredCaptureLevel: z.number().int().min(1).max(3).optional(),
  estimatedReadTime: z.number().int().min(1).optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string().datetime().optional(),
  author: z.string().optional(),
  slug: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// PUT /api/admin/content/[id] - Update content
async function updateContentHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = IdParamSchema.parse(params);
    
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = validatedParams;
    const contentData = await request.json();
    
    // Validate with Zod schema
    const validatedData = ContentUpdateSchema.parse(contentData);
    
    // Sanitize HTML content to prevent XSS
    const sanitizedData: any = { ...validatedData };
    
    // Only sanitize HTML fields if they exist in the update
    if (sanitizedData.content) sanitizedData.content = sanitizeHtml(sanitizedData.content);
    if (sanitizedData.hook) sanitizedData.hook = sanitizeHtml(sanitizedData.hook);
    if (sanitizedData.insight) sanitizedData.insight = sanitizeHtml(sanitizedData.insight);
    if (sanitizedData.application) sanitizedData.application = sanitizeHtml(sanitizedData.application);
    if (sanitizedData.hungerBuilder) sanitizedData.hungerBuilder = sanitizeHtml(sanitizedData.hungerBuilder);
    if (sanitizedData.nextStep) sanitizedData.nextStep = sanitizeHtml(sanitizedData.nextStep);
    if (sanitizedData.excerpt) sanitizedData.excerpt = sanitizeHtml(sanitizedData.excerpt);
    
    // Update content
    const { data, error } = await supabase
      .from('content')
      .update({
        ...sanitizedData,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply security wrapper to PUT handler
export const PUT = withSecurity(updateContentHandler, {
  rateLimit: 10, // Stricter rate limit for PUT
  cors: true,
  securityHeaders: true,
  validateSchema: ContentUpdateSchema
});

// DELETE /api/admin/content/[id] - Delete content
async function deleteContentHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = IdParamSchema.parse(params);
    
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = validatedParams;
    
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid content ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply security wrapper to DELETE handler
export const DELETE = withSecurity(deleteContentHandler, {
  rateLimit: 5, // Very strict rate limit for DELETE operations
  cors: true,
  securityHeaders: true
});

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