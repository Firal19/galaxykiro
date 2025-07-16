export interface OfficeVisit {
  id: string;
  user_id: string;
  
  // Appointment details
  appointment_date: string;
  appointment_duration: number;
  appointment_type: string;
  
  // Office location
  office_location: string;
  office_address?: string;
  office_city: string;
  office_phone?: string;
  
  // User preferences
  preferred_language: string;
  special_requests?: string;
  preparation_materials_sent: boolean;
  
  // Status tracking
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  confirmation_sent_at?: string;
  reminder_sent_at?: string;
  follow_up_sent_at?: string;
  
  // Conversion tracking
  booking_source?: string;
  engagement_score_at_booking?: number;
  user_tier_at_booking?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  
  // Operating hours
  operating_hours: {
    [key: string]: {
      start?: string;
      end?: string;
      closed?: boolean;
    };
  };
  
  // Availability settings
  is_active: boolean;
  max_daily_appointments: number;
  appointment_duration: number;
  
  // Location details
  timezone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  created_at: string;
  updated_at: string;
}

export interface AppointmentSlot {
  id: string;
  office_location_id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  appointment_date: string;
  office_location: string;
  appointment_type?: string;
  preferred_language?: string;
  special_requests?: string;
  booking_source?: string;
}

export interface AvailabilityRequest {
  office_location_id: string;
  date_from: string;
  date_to: string;
}

export interface AvailableSlot {
  date: string;
  time: string;
  office_location: OfficeLocation;
}