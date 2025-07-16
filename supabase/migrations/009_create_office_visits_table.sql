-- Create office_visits table for appointment booking
CREATE TABLE office_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Appointment details
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_duration INTEGER DEFAULT 60, -- minutes
  appointment_type VARCHAR(50) DEFAULT 'consultation',
  
  -- Office location
  office_location VARCHAR(100) NOT NULL,
  office_address TEXT,
  office_city VARCHAR(50) NOT NULL,
  office_phone VARCHAR(20),
  
  -- User preferences and notes
  preferred_language VARCHAR(10) DEFAULT 'en',
  special_requests TEXT,
  preparation_materials_sent BOOLEAN DEFAULT FALSE,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Conversion tracking
  booking_source VARCHAR(50), -- which page/tool led to booking
  engagement_score_at_booking INTEGER,
  user_tier_at_booking VARCHAR(20),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create office_locations table for available offices
CREATE TABLE office_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  
  -- Operating hours (stored as JSON)
  operating_hours JSONB DEFAULT '{}',
  
  -- Availability settings
  is_active BOOLEAN DEFAULT TRUE,
  max_daily_appointments INTEGER DEFAULT 8,
  appointment_duration INTEGER DEFAULT 60, -- minutes
  
  -- Location details
  timezone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
  coordinates POINT, -- for distance calculations
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment_slots table for availability management
CREATE TABLE appointment_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_location_id UUID REFERENCES office_locations(id) ON DELETE CASCADE,
  
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE, -- for holidays/breaks
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(office_location_id, slot_date, slot_time)
);

-- Insert default Ethiopian office locations
INSERT INTO office_locations (name, city, address, phone, email, operating_hours) VALUES
('Galaxy Dream Team - Addis Ababa Main', 'Addis Ababa', 'Bole Road, Near Edna Mall, Addis Ababa, Ethiopia', '+251-11-123-4567', 'addis@galaxydreamteam.com', 
 '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "13:00"}, "sunday": {"closed": true}}'),
('Galaxy Dream Team - Bahir Dar', 'Bahir Dar', 'Blue Nile Avenue, Bahir Dar, Ethiopia', '+251-58-123-4567', 'bahirdar@galaxydreamteam.com',
 '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "13:00"}, "sunday": {"closed": true}}'),
('Galaxy Dream Team - Hawassa', 'Hawassa', 'Haile Gebreselassie Road, Hawassa, Ethiopia', '+251-46-123-4567', 'hawassa@galaxydreamteam.com',
 '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "13:00"}, "sunday": {"closed": true}}');

-- Create indexes for performance
CREATE INDEX idx_office_visits_user_id ON office_visits(user_id);
CREATE INDEX idx_office_visits_appointment_date ON office_visits(appointment_date);
CREATE INDEX idx_office_visits_status ON office_visits(status);
CREATE INDEX idx_office_visits_office_location ON office_visits(office_location);
CREATE INDEX idx_appointment_slots_office_date ON appointment_slots(office_location_id, slot_date);
CREATE INDEX idx_office_locations_city ON office_locations(city);

-- Create updated_at trigger for office_visits
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_office_visits_updated_at BEFORE UPDATE ON office_visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_office_locations_updated_at BEFORE UPDATE ON office_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();