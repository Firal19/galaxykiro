-- Enable RLS on office visit tables
ALTER TABLE office_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;

-- Office Visits Policies
-- Users can only see their own office visits
CREATE POLICY "Users can view their own office visits" ON office_visits
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own office visits
CREATE POLICY "Users can create their own office visits" ON office_visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own office visits (for cancellations, etc.)
CREATE POLICY "Users can update their own office visits" ON office_visits
    FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all office visits (for admin functions)
CREATE POLICY "Service role can manage all office visits" ON office_visits
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Office Locations Policies
-- Everyone can view active office locations (public information)
CREATE POLICY "Anyone can view active office locations" ON office_locations
    FOR SELECT USING (is_active = true);

-- Only service role can manage office locations
CREATE POLICY "Service role can manage office locations" ON office_locations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Appointment Slots Policies
-- Everyone can view available appointment slots
CREATE POLICY "Anyone can view available appointment slots" ON appointment_slots
    FOR SELECT USING (is_available = true AND is_blocked = false);

-- Only service role can manage appointment slots
CREATE POLICY "Service role can manage appointment slots" ON appointment_slots
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to automatically generate appointment slots
CREATE OR REPLACE FUNCTION generate_appointment_slots(
    office_id UUID,
    start_date DATE,
    end_date DATE
) RETURNS INTEGER AS $$
DECLARE
    current_date DATE;
    current_time TIME;
    office_hours JSONB;
    day_name TEXT;
    start_time TIME;
    end_time TIME;
    slot_count INTEGER := 0;
BEGIN
    -- Get office operating hours
    SELECT operating_hours INTO office_hours
    FROM office_locations
    WHERE id = office_id;

    -- Loop through each date
    current_date := start_date;
    WHILE current_date <= end_date LOOP
        -- Get day name
        day_name := LOWER(TO_CHAR(current_date, 'Day'));
        day_name := TRIM(day_name);
        
        -- Check if office is open on this day
        IF office_hours ? day_name AND NOT (office_hours -> day_name ? 'closed') THEN
            start_time := (office_hours -> day_name ->> 'start')::TIME;
            end_time := (office_hours -> day_name ->> 'end')::TIME;
            
            -- Generate hourly slots
            current_time := start_time;
            WHILE current_time < end_time LOOP
                -- Insert slot if it doesn't exist
                INSERT INTO appointment_slots (office_location_id, slot_date, slot_time)
                VALUES (office_id, current_date, current_time)
                ON CONFLICT (office_location_id, slot_date, slot_time) DO NOTHING;
                
                slot_count := slot_count + 1;
                current_time := current_time + INTERVAL '1 hour';
            END LOOP;
        END IF;
        
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN slot_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update appointment slot availability when booking
CREATE OR REPLACE FUNCTION update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- When an office visit is created, mark the slot as unavailable
    IF TG_OP = 'INSERT' THEN
        UPDATE appointment_slots
        SET is_available = false
        WHERE office_location_id = (
            SELECT id FROM office_locations 
            WHERE name = NEW.office_location
        )
        AND slot_date = NEW.appointment_date::DATE
        AND slot_time = NEW.appointment_date::TIME;
        
        RETURN NEW;
    END IF;
    
    -- When an office visit is cancelled, mark the slot as available again
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        UPDATE appointment_slots
        SET is_available = true
        WHERE office_location_id = (
            SELECT id FROM office_locations 
            WHERE name = NEW.office_location
        )
        AND slot_date = NEW.appointment_date::DATE
        AND slot_time = NEW.appointment_date::TIME;
        
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update slot availability
CREATE TRIGGER update_appointment_slot_availability
    AFTER INSERT OR UPDATE ON office_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_slot_availability();

-- Generate initial appointment slots for the next 3 months for all offices
DO $$
DECLARE
    office_record RECORD;
BEGIN
    FOR office_record IN SELECT id FROM office_locations WHERE is_active = true LOOP
        PERFORM generate_appointment_slots(
            office_record.id,
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '3 months'
        );
    END LOOP;
END $$;