import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    if (!dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'date_from and date_to parameters are required' },
        { status: 400 }
      );
    }

    // Get office location details
    const { data: office, error: officeError } = await supabase
      .from('office_locations')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single();

    if (officeError || !office) {
      return NextResponse.json(
        { error: 'Office location not found' },
        { status: 404 }
      );
    }

    // Generate available slots based on office operating hours
    const availableSlots = await generateAvailableSlots(
      office,
      dateFrom,
      dateTo
    );

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateAvailableSlots(
  office: any,
  dateFrom: string,
  dateTo: string
) {
  const slots = [];
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  
  // Get existing appointments to exclude booked slots
  const { data: existingAppointments } = await supabase
    .from('office_visits')
    .select('appointment_date')
    .eq('office_location', office.name)
    .eq('status', 'scheduled')
    .gte('appointment_date', dateFrom)
    .lte('appointment_date', dateTo);

  const bookedSlots = new Set(
    existingAppointments?.map(apt => apt.appointment_date) || []
  );

  // Generate slots for each day
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const daySchedule = office.operating_hours[dayName];
    
    // Skip if office is closed on this day
    if (!daySchedule || daySchedule.closed) continue;
    
    // Skip past dates
    if (date < new Date()) continue;

    const dateStr = date.toISOString().split('T')[0];
    
    // Generate hourly slots during operating hours
    const startHour = parseInt(daySchedule.start.split(':')[0]);
    const endHour = parseInt(daySchedule.end.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
      const slotDateTime = `${dateStr}T${timeStr}`;
      
      // Skip if slot is already booked
      if (bookedSlots.has(slotDateTime)) continue;
      
      slots.push({
        date: dateStr,
        time: timeStr,
        office_location: office
      });
    }
  }

  return slots;
}