import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.appointment_date || !bookingData.office_location) {
      return NextResponse.json(
        { error: 'appointment_date and office_location are required' },
        { status: 400 }
      );
    }

    // Get user's current engagement data for conversion tracking
    const { data: userData } = await supabase
      .from('users')
      .select('engagement_score, user_tier')
      .eq('id', user.id)
      .single();

    // Get office location details
    const { data: office } = await supabase
      .from('office_locations')
      .select('*')
      .eq('name', bookingData.office_location)
      .single();

    // Create the office visit record
    const { data: officeVisit, error: insertError } = await supabase
      .from('office_visits')
      .insert({
        user_id: user.id,
        appointment_date: bookingData.appointment_date,
        appointment_type: bookingData.appointment_type || 'consultation',
        office_location: bookingData.office_location,
        office_address: office?.address,
        office_city: office?.city || 'Addis Ababa',
        office_phone: office?.phone,
        preferred_language: bookingData.preferred_language || 'en',
        special_requests: bookingData.special_requests,
        booking_source: bookingData.booking_source || 'direct',
        engagement_score_at_booking: userData?.engagement_score || 0,
        user_tier_at_booking: userData?.user_tier || 'browser',
        status: 'scheduled'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating office visit:', insertError);
      return NextResponse.json(
        { error: 'Failed to book appointment' },
        { status: 500 }
      );
    }

    // Trigger confirmation email and preparation materials
    await triggerAppointmentConfirmation(officeVisit);

    // Update user engagement score for booking office visit
    await supabase
      .from('users')
      .update({
        engagement_score: (userData?.engagement_score || 0) + 50, // High value action
        last_activity: new Date().toISOString()
      })
      .eq('id', user.id);

    // Track the conversion event
    await supabase
      .from('interactions')
      .insert({
        user_id: user.id,
        interaction_type: 'office_visit_booked',
        page_url: bookingData.booking_source || '/office-visit',
        metadata: {
          office_location: bookingData.office_location,
          appointment_date: bookingData.appointment_date,
          appointment_type: bookingData.appointment_type
        }
      });

    return NextResponse.json({
      success: true,
      appointment: officeVisit
    });

  } catch (error) {
    console.error('Error booking office visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function triggerAppointmentConfirmation(appointment: any) {
  try {
    // This would typically trigger an email service
    // For now, we'll just update the confirmation timestamp
    await supabase
      .from('office_visits')
      .update({
        confirmation_sent_at: new Date().toISOString()
      })
      .eq('id', appointment.id);

    // In a real implementation, you would:
    // 1. Send confirmation email with appointment details
    // 2. Send calendar invite
    // 3. Send preparation materials
    // 4. Schedule reminder emails
    
    console.log('Appointment confirmation triggered for:', appointment.id);
  } catch (error) {
    console.error('Error triggering confirmation:', error);
  }
}