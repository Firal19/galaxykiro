-- Create webinars table
CREATE TABLE IF NOT EXISTS public.webinars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    presenter_name VARCHAR(255),
    presenter_bio TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    max_attendees INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    webinar_url TEXT,
    recording_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    tags TEXT[],
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webinar_registrations table
CREATE TABLE IF NOT EXISTS public.webinar_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    registration_source VARCHAR(100),
    registration_data JSONB DEFAULT '{}',
    attended BOOLEAN DEFAULT FALSE,
    attendance_duration_minutes INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    no_show_follow_up_sent BOOLEAN DEFAULT FALSE,
    recording_accessed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(webinar_id, user_id)
);

-- Create webinar_email_sequences table
CREATE TABLE IF NOT EXISTS public.webinar_email_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID REFERENCES public.webinar_registrations(id) ON DELETE CASCADE,
    sequence_type VARCHAR(50) NOT NULL CHECK (sequence_type IN ('confirmation', 'reminder_24h', 'reminder_1h', 'no_show_follow_up', 'attendee_follow_up')),
    email_subject VARCHAR(255),
    email_content TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_at ON public.webinars(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON public.webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar_id ON public.webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user_id ON public.webinar_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_email_sequences_registration_id ON public.webinar_email_sequences(registration_id);
CREATE INDEX IF NOT EXISTS idx_webinar_email_sequences_scheduled_at ON public.webinar_email_sequences(scheduled_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON public.webinars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webinar_registrations_updated_at BEFORE UPDATE ON public.webinar_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();