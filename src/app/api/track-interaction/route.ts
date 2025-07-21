import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the interaction for debugging
    console.log('Track interaction received:', {
      timestamp: new Date().toISOString(),
      data: body,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    })

    // In a real implementation, this would:
    // 1. Validate the data
    // 2. Store in database
    // 3. Update analytics
    // 4. Trigger any necessary workflows

    return NextResponse.json({ 
      success: true, 
      message: 'Interaction tracked successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error tracking interaction:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track interaction' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Track interaction endpoint is working',
    timestamp: new Date().toISOString()
  })
} 