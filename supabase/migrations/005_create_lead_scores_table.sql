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

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_lead_scores_scoring_data ON lead_scores USING GIN (scoring_data);
CREATE INDEX IF NOT EXISTS idx_lead_scores_tier_progression ON lead_scores USING GIN (tier_progression);

-- Create unique constraint to ensure one score record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_scores_user_unique ON lead_scores(user_id);

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lead_scores_updated_at 
  BEFORE UPDATE ON lead_scores 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own lead scores" ON lead_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert lead scores" ON lead_scores
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "System can update lead scores" ON lead_scores
  FOR UPDATE USING (TRUE);