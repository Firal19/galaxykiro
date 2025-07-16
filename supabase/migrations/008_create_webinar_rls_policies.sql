-- Enable RLS on webinar tables
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_email_sequences ENABLE ROW LEVEL SECURITY;

-- Webinars policies (public read access for scheduled webinars)
CREATE POLICY "Public can view scheduled webinars" ON public.webinars
    FOR SELECT USING (status = 'scheduled' OR status = 'completed');

CREATE POLICY "Authenticated users can view all webinars" ON public.webinars
    FOR SELECT USING (auth.role() = 'authenticated');

-- Admin/service role can manage webinars
CREATE POLICY "Service role can manage webinars" ON public.webinars
    FOR ALL USING (auth.role() = 'service_role');

-- Webinar registrations policies
CREATE POLICY "Users can view their own registrations" ON public.webinar_registrations
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own registrations" ON public.webinar_registrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own registrations" ON public.webinar_registrations
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Service role can manage all registrations
CREATE POLICY "Service role can manage registrations" ON public.webinar_registrations
    FOR ALL USING (auth.role() = 'service_role');

-- Webinar email sequences policies (service role only)
CREATE POLICY "Service role can manage email sequences" ON public.webinar_email_sequences
    FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own email sequences
CREATE POLICY "Users can view their email sequences" ON public.webinar_email_sequences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.webinar_registrations wr
            WHERE wr.id = webinar_email_sequences.registration_id
            AND wr.user_id = auth.uid()::text
        )
    );