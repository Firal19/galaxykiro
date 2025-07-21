import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the user info capture for debugging
    console.log('Capture user info received:', {
      timestamp: new Date().toISOString(),
      data: body,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    })

    // In a real implementation, this would:
    // 1. Validate the user data
    // 2. Store in database
    // 3. Update lead scoring
    // 4. Trigger email sequences
    // 5. Update analytics

    return NextResponse.json({ 
      success: true, 
      message: 'User info captured successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error capturing user info:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to capture user info' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Capture user info endpoint is working',
    timestamp: new Date().toISOString()
  })
} 