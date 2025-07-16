-- Progressive Engagement Website - Complete Database Setup
-- Run this entire script in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE USERS TABLE
-- =====================================================

-- Create users table with progressive capture levels and engagement tracking
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  city TEXT,
  
  -- Progressive capture tracking
  capture_level INTEGER DEFAULT 1 CHECK (capture_level IN (1, 2, 3)),
  capture_timestamps JSONB DEFAULT '{"level1": null, "level2": null, "level3": null}'::jsonb,
  
  -- Engagement tracking
  engagement_score INTEGER DEFAULT 0,
  readiness_indicator INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Journey tracking
  entry_point TEXT,
  current_tier TEXT DEFAULT 'browser' CHECK (current_tier IN ('browser', 'engaged', 'soft-member')),
  
  -- Preferences
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'am')),
  timezone TEXT DEFAULT 'UTC',
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(current_tier);
CREATE INDEX IF NOT EXISTS idx_users_engagement_score ON users(engagement_score);
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. CREATE INTERACTIONS TABLE
-- =====================================================

-- Create interactions table for comprehensive user journey tracking
CREATE TABLE IF NOT EXISTS interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  
  -- Event tracking
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Timing
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_session_id ON interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_interactions_event_type ON interactions(event_type);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_user_event ON interactions(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_interactions_session ON interactions(session_id);

-- Create GIN index for JSONB event_data
CREATE INDEX IF NOT EXISTS idx_interactions_event_data ON interactions USING GIN (event_data);

-- =====================================================
-- 3. CREATE TOOL USAGE TABLE
-- =====================================================

-- Create tool_usage table with JSONB results storage for flexible assessment data
CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  
  -- Assessment data stored as JSONB for flexibility
  responses JSONB DEFAULT '[]'::jsonb,
  scores JSONB DEFAULT '{}'::jsonb,
  insights JSONB DEFAULT '[]'::jsonb,
  
  -- Completion tracking
  completion_rate DECIMAL(3,2) DEFAULT 0.0 CHECK (completion_rate >= 0.0 AND completion_rate <= 1.0),
  time_spent INTEGER DEFAULT 0, -- in seconds
  
  -- Results and sharing
  is_completed BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON tool_usage(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_usage_is_completed ON tool_usage(is_completed);
CREATE INDEX IF NOT EXISTS idx_tool_usage_share_token ON tool_usage(share_token);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_usage_user ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_completed ON tool_usage(user_id, is_completed);

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_tool_usage_responses ON tool_usage USING GIN (responses);
CREATE INDEX IF NOT EXISTS idx_tool_usage_scores ON tool_usage USING GIN (scores);
CREATE INDEX IF NOT EXISTS idx_tool_usage_insights ON tool_usage USING GIN (insights);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tool_usage_updated_at 
  BEFORE UPDATE ON tool_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to set completed_at when completion_rate reaches 1.0
CREATE OR REPLACE FUNCTION set_completion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completion_rate = 1.0 AND OLD.completion_rate < 1.0 THEN
    NEW.completed_at = NOW();
    NEW.is_completed = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tool_usage_completion 
  BEFORE UPDATE ON tool_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION set_completion_timestamp();

-- =====================================================
-- 4. CREATE CONTENT ENGAGEMENT TABLE
-- =====================================================

-- Create content_engagement table for tracking user content interactions
CREATE TABLE IF NOT EXISTS content_engagement (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_category TEXT,
  
  -- Engagement metrics
  time_spent INTEGER DEFAULT 0, -- in seconds
  scroll_depth DECIMAL(3,2) DEFAULT 0.0 CHECK (scroll_depth >= 0.0 AND scroll_depth <= 1.0),
  interactions_count INTEGER DEFAULT 0,
  
  -- Engagement details stored as JSONB
  engagement_data JSONB DEFAULT '{}'::jsonb,
  
  -- Session tracking
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_engagement_user_id ON content_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_content_id ON content_engagement(content_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_content_type ON content_engagement(content_type);
CREATE INDEX IF NOT EXISTS idx_content_engagement_content_category ON content_engagement(content_category);
CREATE INDEX IF NOT EXISTS idx_content_engagement_session_id ON content_engagement(session_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_created_at ON content_engagement(created_at);
CREATE INDEX IF NOT EXISTS idx_content_engagement_user ON content_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_content ON content_engagement(content_id, content_type);

-- Create GIN index for JSONB engagement_data
CREATE INDEX IF NOT EXISTS idx_content_engagement_data ON content_engagement USING GIN (engagement_data);

-- Create composite indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_content_engagement_user_content ON content_engagement(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_type_category ON content_engagement(content_type, content_category);

-- Create trigger to automatically update updated_at and last_interaction_at
CREATE OR REPLACE FUNCTION update_content_engagement_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_interaction_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_engagement_updated_at 
  BEFORE UPDATE ON content_engagement 
  FOR EACH ROW 
  EXECUTE FUNCTION update_content_engagement_timestamps();

-- =====================================================
-- 5. CREATE LEAD SCORES TABLE
-- =====================================================

-- Create lead_scores table with automated scoring calculations and tier assignments
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Scoring breakdown
  page_views_score INTEGER DEFAULT 0,
  tool_usage_score INTEGER DEFAULT 0,
  content_downloads_score INTEGER DEFAULT 0,
  webinar_registration_score INTEGER DEFAULT 0,
  time_on_site_score INTEGER DEFAULT 0,
  scroll_depth_score INTEGER DEFAULT 0,
  cta_engagement_score INTEGER DEFAULT 0,
  
  -- Total score and tier
  total_score INTEGER DEFAULT 0,
  previous_score INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'browser' CHECK (tier IN ('browser', 'engaged', 'soft-member')),
  previous_tier TEXT DEFAULT 'browser' CHECK (previous_tier IN ('browser', 'engaged', 'soft-member')),
  
  -- Scoring metadata
  scoring_data JSONB DEFAULT '{}'::jsonb,
  tier_progression JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tier_changed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_scores_user_id ON lead_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_total_score ON lead_scores(total_score);
CREATE INDEX IF NOT EXISTS idx_lead_scores_tier ON lead_scores(tier);
CREATE INDEX IF NOT EXISTS idx_lead_scores_calculated_at ON lead_scores(calculated_at);
CREATE INDEX IF NOT EXISTS idx_lead_scores_user ON lead_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_score ON lead_scores(total_score DESC);

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_lead_scores_scoring_data ON lead_scores USING GIN (scoring_data);
CREATE INDEX IF NOT EXISTS idx_lead_scores_tier_progression ON lead_scores USING GIN (tier_progression);

-- Create unique constraint to ensure one score record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_scores_user_unique ON lead_scores(user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lead_scores_updated_at 
  BEFORE UPDATE ON lead_scores 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. CREATE LEAD SCORING FUNCTIONS
-- =====================================================

-- Create function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_page_views_score INTEGER := 0;
  v_tool_usage_score INTEGER := 0;
  v_content_downloads_score INTEGER := 0;
  v_webinar_registration_score INTEGER := 0;
  v_time_on_site_score INTEGER := 0;
  v_scroll_depth_score INTEGER := 0;
  v_cta_engagement_score INTEGER := 0;
  v_total_score INTEGER := 0;
  v_page_views_count INTEGER;
  v_tool_usage_count INTEGER;
  v_content_downloads_count INTEGER;
  v_webinar_registrations_count INTEGER;
  v_total_time_on_site INTEGER;
  v_avg_scroll_depth DECIMAL;
  v_cta_clicks_count INTEGER;
BEGIN
  -- Calculate page views score (0.5 each, max 10)
  SELECT COUNT(DISTINCT page_url) INTO v_page_views_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'page_view';
  v_page_views_score := LEAST(v_page_views_count * 0.5, 10)::INTEGER;
  
  -- Calculate tool usage score (5 each, max 30)
  SELECT COUNT(*) INTO v_tool_usage_count
  FROM tool_usage 
  WHERE user_id = p_user_id AND is_completed = TRUE;
  v_tool_usage_score := LEAST(v_tool_usage_count * 5, 30);
  
  -- Calculate content downloads score (4 each, max 20)
  SELECT COUNT(*) INTO v_content_downloads_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'content_download';
  v_content_downloads_score := LEAST(v_content_downloads_count * 4, 20);
  
  -- Calculate webinar registration score (25 each)
  SELECT COUNT(*) INTO v_webinar_registrations_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'webinar_registration';
  v_webinar_registration_score := v_webinar_registrations_count * 25;
  
  -- Calculate time on site score (max 10 for 5+ minutes)
  SELECT COALESCE(SUM(time_spent), 0) INTO v_total_time_on_site
  FROM content_engagement 
  WHERE user_id = p_user_id;
  v_time_on_site_score := CASE 
    WHEN v_total_time_on_site >= 300 THEN 10 -- 5+ minutes
    ELSE (v_total_time_on_site / 30)::INTEGER -- 1 point per 30 seconds
  END;
  
  -- Calculate scroll depth score (max 5)
  SELECT COALESCE(AVG(scroll_depth), 0) INTO v_avg_scroll_depth
  FROM content_engagement 
  WHERE user_id = p_user_id;
  v_scroll_depth_score := (v_avg_scroll_depth * 5)::INTEGER;
  
  -- Calculate CTA engagement score (10 bonus for 5+ clicks)
  SELECT COUNT(*) INTO v_cta_clicks_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'cta_click';
  v_cta_engagement_score := CASE 
    WHEN v_cta_clicks_count >= 5 THEN 10
    ELSE 0
  END;
  
  -- Calculate total score
  v_total_score := v_page_views_score + v_tool_usage_score + v_content_downloads_score + 
                   v_webinar_registration_score + v_time_on_site_score + v_scroll_depth_score + 
                   v_cta_engagement_score;
  
  RETURN v_total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to determine tier based on score
CREATE OR REPLACE FUNCTION get_tier_from_score(p_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE 
    WHEN p_score >= 70 THEN RETURN 'soft-member';
    WHEN p_score >= 30 THEN RETURN 'engaged';
    ELSE RETURN 'browser';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update lead score
CREATE OR REPLACE FUNCTION update_lead_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_new_score INTEGER;
  v_new_tier TEXT;
  v_current_score INTEGER := 0;
  v_current_tier TEXT := 'browser';
  v_tier_changed BOOLEAN := FALSE;
BEGIN
  -- Calculate new score
  v_new_score := calculate_lead_score(p_user_id);
  v_new_tier := get_tier_from_score(v_new_score);
  
  -- Get current score and tier
  SELECT total_score, tier INTO v_current_score, v_current_tier
  FROM lead_scores 
  WHERE user_id = p_user_id;
  
  -- Check if tier changed
  v_tier_changed := (v_current_tier != v_new_tier);
  
  -- Insert or update lead score
  INSERT INTO lead_scores (
    user_id, 
    total_score, 
    previous_score,
    tier, 
    previous_tier,
    tier_changed_at,
    calculated_at
  ) VALUES (
    p_user_id, 
    v_new_score, 
    COALESCE(v_current_score, 0),
    v_new_tier, 
    COALESCE(v_current_tier, 'browser'),
    CASE WHEN v_tier_changed THEN NOW() ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    previous_score = lead_scores.total_score,
    total_score = v_new_score,
    previous_tier = lead_scores.tier,
    tier = v_new_tier,
    tier_changed_at = CASE WHEN v_tier_changed THEN NOW() ELSE lead_scores.tier_changed_at END,
    calculated_at = NOW(),
    updated_at = NOW();
  
  -- Update user tier if changed
  IF v_tier_changed THEN
    UPDATE users 
    SET current_tier = v_new_tier, updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CREATE RLS POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anonymous can create users" ON users
  FOR INSERT WITH CHECK (true);

-- Interactions table policies
CREATE POLICY "Users can view own interactions" ON interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to interactions" ON interactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anonymous can create interactions" ON interactions
  FOR INSERT WITH CHECK (true);

-- Tool usage table policies
CREATE POLICY "Users can view own tool usage" ON tool_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tool usage" ON tool_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tool usage" ON tool_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to tool usage" ON tool_usage
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public can view shared tool results" ON tool_usage
  FOR SELECT USING (is_shared = true AND share_token IS NOT NULL);

-- Content engagement table policies
CREATE POLICY "Users can view own content engagement" ON content_engagement
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own content engagement" ON content_engagement
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to content engagement" ON content_engagement
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anonymous can create content engagement" ON content_engagement
  FOR INSERT WITH CHECK (true);

-- Lead scores table policies
CREATE POLICY "Users can view own lead scores" ON lead_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to lead scores" ON lead_scores
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO anon, authenticated;
GRANT SELECT, INSERT ON interactions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON tool_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE ON content_engagement TO anon, authenticated;
GRANT SELECT ON lead_scores TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION calculate_lead_score(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_tier_from_score(INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_lead_score(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION generate_share_token() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION set_completion_timestamp() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_content_engagement_timestamps() TO authenticated, service_role;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Your Progressive Engagement Website database is now ready with:
-- ✅ 5 main tables (users, interactions, tool_usage, content_engagement, lead_scores)
-- ✅ Lead scoring functions and automation
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Proper permissions and grants