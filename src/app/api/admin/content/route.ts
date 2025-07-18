import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'
import { ContentItem } from '../../../../lib/models/content'
import { auth } from '../../../../lib/auth'
import { withSecurity, sanitizeHtml, sanitizeObject } from '../../../../lib/security'
import { z } from 'zod'

// Define query parameters schema
const ContentQuerySchema = z.object({
  category: z.string().optional(),
  contentType: z.string().optional(),
  depthLevel: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(100),
  offset: z.number().int().min(0).default(0)
});

// GET /api/admin/content - Get all content
async function getContentHandler(request: NextRequest) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Get query parameters and validate
    const searchParams = request.nextUrl.searchParams
    const queryParams = {
      category: searchParams.get('category') || undefined,
      contentType: searchParams.get('contentType') || undefined,
      depthLevel: searchParams.get('depthLevel') || undefined,
      limit: parseInt(searchParams.get('limit') || '100'),
      offset: parseInt(searchParams.get('offset') || '0')
    };
    
    // Validate query parameters
    const validatedParams = ContentQuerySchema.parse(queryParams);
    
    // Build query
    let query = supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false })
      .range(validatedParams.offset, validatedParams.offset + validatedParams.limit - 1)
    
    if (validatedParams.category) {
      query = query.eq('category', validatedParams.category)
    }
    
    if (validatedParams.contentType) {
      query = query.eq('content_type', validatedParams.contentType)
    }
    
    if (validatedParams.depthLevel) {
      query = query.eq('depth_level', validatedParams.depthLevel)
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

// Apply security wrapper to GET handler
export const GET = withSecurity(getContentHandler, {
  rateLimit: 50,
  cors: true,
  securityHeaders: true
});

// Define content creation schema
const ContentCreateSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.string(),
  depthLevel: z.enum(['surface', 'medium', 'deep']),
  contentType: z.string(),
  hook: z.string().min(10),
  insight: z.string().min(10),
  application: z.string().min(10),
  hungerBuilder: z.string().min(10),
  nextStep: z.string().min(10),
  content: z.string().min(100),
  excerpt: z.string().min(10).max(300),
  requiredCaptureLevel: z.number().int().min(1).max(3),
  estimatedReadTime: z.number().int().min(1),
  tags: z.array(z.string()),
  publishedAt: z.string().datetime(),
  author: z.string(),
  slug: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// POST /api/admin/content - Create new content
async function postContentHandler(request: NextRequest) {
  try {
    // Verify admin authorization
    const session = await auth.getSession()
    if (!session || !session.user || !await auth.isAdmin(session.user.id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Parse and validate request body
    const contentData = await request.json();
    
    // Validate with Zod schema
    const validatedData = ContentCreateSchema.parse(contentData);
    
    // Sanitize HTML content to prevent XSS
    const sanitizedData = {
      ...validatedData,
      content: sanitizeHtml(validatedData.content),
      hook: sanitizeHtml(validatedData.hook),
      insight: sanitizeHtml(validatedData.insight),
      application: sanitizeHtml(validatedData.application),
      hungerBuilder: sanitizeHtml(validatedData.hungerBuilder),
      nextStep: sanitizeHtml(validatedData.nextStep),
      excerpt: sanitizeHtml(validatedData.excerpt),
    };
    
    // Generate slug if not provided
    if (!sanitizedData.slug) {
      sanitizedData.slug = generateSlug(sanitizedData.title);
    }
    
    // Set default values
    const now = new Date().toISOString();
    const newContent = {
      ...sanitizedData,
      created_at: now,
      updated_at: now,
      view_count: 0,
      engagement_rate: 0,
      conversion_rate: 0
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('content')
      .insert(newContent)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating content:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, content: data });
  } catch (error) {
    console.error('Error in content API:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply security wrapper to POST handler
export const POST = withSecurity(postContentHandler, {
  rateLimit: 10, // Stricter rate limit for POST
  cors: true,
  securityHeaders: true,
  validateSchema: ContentCreateSchema
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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
}