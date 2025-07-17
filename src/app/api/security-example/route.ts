import { NextRequest, NextResponse } from 'next/server';
import { withSecurity, validateAndSanitize } from '@/lib/security';
import { z } from 'zod';

// Define a schema for request validation
const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

// API route handler with security features
async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      // Parse and validate request body
      const body = await req.json();
      const validatedData = validateAndSanitize(body, ContactFormSchema);
      
      // Process the form submission (in a real app, this would save to database or send email)
      console.log('Received valid form submission:', validatedData);
      
      // Return success response
      return NextResponse.json({ 
        success: true, 
        message: 'Form submitted successfully' 
      });
    } catch (error) {
      console.error('Form validation error:', error);
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }
  }
  
  // Method not allowed
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

// Export the handler with security wrapper
export const GET = withSecurity(handler, {
  rateLimit: 50,
  cors: true,
  securityHeaders: true
});

export const POST = withSecurity(handler, {
  rateLimit: 10, // Stricter rate limit for POST
  cors: true,
  securityHeaders: true,
  validateSchema: ContactFormSchema
});