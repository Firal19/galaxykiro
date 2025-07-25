import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: offices, error } = await supabase
      .from('office_locations')
      .select('*')
      .eq('is_active', true)
      .order('city');

    if (error) {
      console.error('Error fetching office locations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch office locations' },
        { status: 500 }
      );
    }

    return NextResponse.json(offices);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}