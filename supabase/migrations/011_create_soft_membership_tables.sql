-- Create educational_content table for continuous education system
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'tool', 'webinar', 'guide')),
    category TEXT NOT NULL,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER DEFAULT 0, -- in minutes
    tags TEXT[] DEFAULT '{}',
    content_url TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    engagement_score DECIMAL(3,2) DEFAULT 0.0,
    completion_rate DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_delivery_schedule table for personalized content delivery
CREATE TABLE IF NOT EXISTS content_delivery_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_recommendations JSONB DEFAULT '[]',
    delivery_channels TEXT[] DEFAULT '{}',
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    next_delivery TIMESTAMP WITH TIME ZONE,
    last_delivery TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add soft membership fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_preferences TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_frequency TEXT DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS content_preferences TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS telegram_handle TEXT;

-- Update content_engagement table to support more engagement types
ALTER TABLE content_engagement 
ADD COLUMN IF NOT EXISTS engagement_type TEXT DEFAULT 'view' CHECK (engagement_type IN ('view', 'click', 'complete', 'share')),
ADD COLUMN IF NOT EXISTS content_type TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_type ON educational_content(content_type);
CREATE INDEX IF NOT EXISTS idx_educational_content_active ON educational_content(is_active);
CREATE INDEX IF NOT EXISTS idx_content_delivery_user ON content_delivery_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_content_delivery_next ON content_delivery_schedule(next_delivery);
CREATE INDEX IF NOT EXISTS idx_users_subscription_prefs ON users USING GIN(subscription_preferences);
CREATE INDEX IF NOT EXISTS idx_users_content_prefs ON users USING GIN(content_preferences);
CREATE INDEX IF NOT EXISTS idx_content_engagement_type ON content_engagement(engagement_type);

-- Insert sample educational content
INSERT INTO educational_content (title, description, content_type, category, difficulty_level, estimated_time, tags, engagement_score, completion_rate) VALUES
('Understanding Your Potential', 'Discover the science behind human potential and how to unlock yours', 'article', 'Personal Development', 'beginner', 10, ARRAY['potential', 'growth', 'mindset'], 0.85, 0.78),
('The Success Gap Explained', 'Why some people achieve their dreams while others struggle', 'video', 'Goal Setting', 'beginner', 15, ARRAY['success', 'achievement', 'habits'], 0.92, 0.84),
('Habit Formation Masterclass', 'Complete guide to building lasting habits that stick', 'guide', 'Habit Formation', 'intermediate', 45, ARRAY['habits', 'behavior', 'change'], 0.88, 0.72),
('Leadership Styles Assessment', 'Interactive tool to discover your natural leadership style', 'tool', 'Leadership', 'intermediate', 20, ARRAY['leadership', 'assessment', 'style'], 0.90, 0.81),
('Vision Clarity Workshop', 'Step-by-step process to create a compelling vision for your future', 'webinar', 'Goal Setting', 'advanced', 60, ARRAY['vision', 'planning', 'future'], 0.87, 0.69),
('Overcoming Limiting Beliefs', 'Identify and transform the beliefs that hold you back', 'article', 'Mindset', 'intermediate', 12, ARRAY['beliefs', 'mindset', 'transformation'], 0.83, 0.76),
('Daily Productivity Rituals', 'Morning and evening routines of high achievers', 'guide', 'Productivity', 'beginner', 8, ARRAY['productivity', 'routines', 'habits'], 0.89, 0.82),
('The Psychology of Change', 'Understanding why change is hard and how to make it easier', 'video', 'Personal Development', 'advanced', 25, ARRAY['change', 'psychology', 'behavior'], 0.91, 0.73),
('Goal Achievement Framework', 'Proven system for setting and achieving meaningful goals', 'tool', 'Goal Setting', 'intermediate', 30, ARRAY['goals', 'achievement', 'planning'], 0.86, 0.79),
('Building Emotional Intelligence', 'Develop your EQ for better relationships and leadership', 'article', 'Leadership', 'intermediate', 18, ARRAY['emotional-intelligence', 'relationships', 'leadership'], 0.84, 0.77);

-- Create RLS policies for educational_content
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Educational content is viewable by everyone" ON educational_content
    FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify educational content" ON educational_content
    FOR ALL USING (false); -- Will be updated when admin roles are implemented

-- Create RLS policies for content_delivery_schedule
ALTER TABLE content_delivery_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own delivery schedule" ON content_delivery_schedule
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own delivery schedule" ON content_delivery_schedule
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert delivery schedules" ON content_delivery_schedule
    FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_educational_content_updated_at 
    BEFORE UPDATE ON educational_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_delivery_schedule_updated_at 
    BEFORE UPDATE ON content_delivery_schedule 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically schedule content delivery for new soft members
CREATE OR REPLACE FUNCTION schedule_content_for_new_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create schedule if user becomes a soft member
    IF NEW.user_tier = 'soft-member' AND (OLD.user_tier IS NULL OR OLD.user_tier != 'soft-member') THEN
        INSERT INTO content_delivery_schedule (
            user_id,
            delivery_channels,
            frequency,
            next_delivery
        ) VALUES (
            NEW.id,
            COALESCE(NEW.subscription_preferences, ARRAY['email']),
            COALESCE(NEW.notification_frequency, 'weekly'),
            NOW() + INTERVAL '1 day'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic content scheduling
CREATE TRIGGER schedule_content_for_new_member_trigger
    AFTER UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION schedule_content_for_new_member();

-- Create view for user engagement analytics
CREATE OR REPLACE VIEW user_engagement_analytics AS
SELECT 
    u.id as user_id,
    u.email,
    u.user_tier,
    u.membership_started_at,
    COUNT(DISTINCT tu.id) as assessments_completed,
    COUNT(DISTINCT ce.id) as content_interactions,
    COUNT(DISTINCT i.id) as total_interactions,
    COALESCE(ls.total_score, 0) as engagement_score,
    CASE 
        WHEN COUNT(DISTINCT tu.id) >= 10 THEN 'high'
        WHEN COUNT(DISTINCT tu.id) >= 5 THEN 'medium'
        ELSE 'low'
    END as engagement_level,
    MAX(GREATEST(
        COALESCE(tu.created_at, '1970-01-01'::timestamp),
        COALESCE(ce.created_at, '1970-01-01'::timestamp),
        COALESCE(i.created_at, '1970-01-01'::timestamp)
    )) as last_activity
FROM users u
LEFT JOIN tool_usage tu ON u.id = tu.user_id
LEFT JOIN content_engagement ce ON u.id = ce.user_id
LEFT JOIN interactions i ON u.id = i.user_id
LEFT JOIN lead_scores ls ON u.id = ls.user_id
WHERE u.user_tier = 'soft-member'
GROUP BY u.id, u.email, u.user_tier, u.membership_started_at, ls.total_score;

-- Grant necessary permissions
GRANT SELECT ON user_engagement_analytics TO authenticated;
GRANT SELECT ON educational_content TO authenticated;
GRANT ALL ON content_delivery_schedule TO authenticated;