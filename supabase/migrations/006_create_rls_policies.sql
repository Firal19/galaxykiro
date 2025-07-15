-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Service role can do everything (for Netlify functions)
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Anonymous users can insert (for initial user creation)
CREATE POLICY "Anonymous can create users" ON users
  FOR INSERT WITH CHECK (true);

-- Interactions table policies
-- Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON interactions
  FOR SELECT USING (auth.uid()::text = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to interactions" ON interactions
  FOR ALL USING (auth.role() = 'service_role');

-- Anonymous users can insert interactions (for tracking before auth)
CREATE POLICY "Anonymous can create interactions" ON interactions
  FOR INSERT WITH CHECK (true);

-- Tool usage table policies
-- Users can view their own tool usage
CREATE POLICY "Users can view own tool usage" ON tool_usage
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can update their own tool usage
CREATE POLICY "Users can update own tool usage" ON tool_usage
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can insert their own tool usage
CREATE POLICY "Users can create own tool usage" ON tool_usage
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to tool usage" ON tool_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to shared tool results
CREATE POLICY "Public can view shared tool results" ON tool_usage
  FOR SELECT USING (is_shared = true AND share_token IS NOT NULL);

-- Content engagement table policies
-- Users can view their own content engagement
CREATE POLICY "Users can view own content engagement" ON content_engagement
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can update their own content engagement
CREATE POLICY "Users can update own content engagement" ON content_engagement
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to content engagement" ON content_engagement
  FOR ALL USING (auth.role() = 'service_role');

-- Anonymous users can insert content engagement (for tracking before auth)
CREATE POLICY "Anonymous can create content engagement" ON content_engagement
  FOR INSERT WITH CHECK (true);

-- Lead scores table policies
-- Users can view their own lead scores
CREATE POLICY "Users can view own lead scores" ON lead_scores
  FOR SELECT USING (auth.uid()::text = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to lead scores" ON lead_scores
  FOR ALL USING (auth.role() = 'service_role');

-- Create functions for lead scoring calculations
CREATE OR REPLACE FUNCTION calculate_lead_score(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  page_views_count INTEGER := 0;
  tool_usage_count INTEGER := 0;
  content_downloads_count INTEGER := 0;
  webinar_registrations_count INTEGER := 0;
  total_time_on_site INTEGER := 0;
  avg_scroll_depth NUMERIC := 0;
  cta_clicks_count INTEGER := 0;
  total_score INTEGER := 0;
BEGIN
  -- Count page views (0.5 points each, max 10)
  SELECT COUNT(*) INTO page_views_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'page_view';
  
  -- Count tool usage (5 points each, max 30)
  SELECT COUNT(*) INTO tool_usage_count
  FROM tool_usage 
  WHERE user_id = p_user_id AND is_completed = true;
  
  -- Count content downloads (4 points each, max 20)
  SELECT COUNT(*) INTO content_downloads_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'content_download';
  
  -- Count webinar registrations (25 points each)
  SELECT COUNT(*) INTO webinar_registrations_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'webinar_registration';
  
  -- Calculate total time on site (max 10 for 5+ minutes)
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (
    CASE 
      WHEN event_data->>'time_spent' IS NOT NULL 
      THEN (event_data->>'time_spent')::INTEGER 
      ELSE 0 
    END
  )) / 60), 0) INTO total_time_on_site
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'time_on_page';
  
  -- Calculate average scroll depth (max 5)
  SELECT COALESCE(AVG(
    CASE 
      WHEN event_data->>'depth' IS NOT NULL 
      THEN (event_data->>'depth')::NUMERIC 
      ELSE 0 
    END
  ), 0) INTO avg_scroll_depth
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'scroll_depth';
  
  -- Count CTA clicks (2 points each, bonus 10 for 5+)
  SELECT COUNT(*) INTO cta_clicks_count
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'cta_click';
  
  -- Calculate total score
  total_score := 
    LEAST(10, page_views_count * 0.5)::INTEGER +
    LEAST(30, tool_usage_count * 5) +
    LEAST(20, content_downloads_count * 4) +
    (webinar_registrations_count * 25) +
    LEAST(10, CASE WHEN total_time_on_site >= 5 THEN 10 ELSE total_time_on_site * 2 END)::INTEGER +
    LEAST(5, avg_scroll_depth / 20)::INTEGER +
    LEAST(10, cta_clicks_count * 2) +
    CASE WHEN cta_clicks_count >= 5 THEN 10 ELSE 0 END;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tier from score
CREATE OR REPLACE FUNCTION get_tier_from_score(p_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF p_score >= 70 THEN
    RETURN 'soft-member';
  ELSIF p_score >= 30 THEN
    RETURN 'engaged';
  ELSE
    RETURN 'browser';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update lead score
CREATE OR REPLACE FUNCTION update_lead_score(p_user_id TEXT)
RETURNS VOID AS $$
DECLARE
  new_score INTEGER;
  new_tier TEXT;
  current_record RECORD;
  page_views_score INTEGER := 0;
  tool_usage_score INTEGER := 0;
  content_downloads_score INTEGER := 0;
  webinar_registration_score INTEGER := 0;
  time_on_site_score INTEGER := 0;
  scroll_depth_score INTEGER := 0;
  cta_engagement_score INTEGER := 0;
BEGIN
  -- Calculate new score
  new_score := calculate_lead_score(p_user_id);
  new_tier := get_tier_from_score(new_score);
  
  -- Calculate individual component scores
  SELECT COUNT(*) * 0.5 INTO page_views_score
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'page_view';
  page_views_score := LEAST(10, page_views_score);
  
  SELECT COUNT(*) * 5 INTO tool_usage_score
  FROM tool_usage 
  WHERE user_id = p_user_id AND is_completed = true;
  tool_usage_score := LEAST(30, tool_usage_score);
  
  SELECT COUNT(*) * 4 INTO content_downloads_score
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'content_download';
  content_downloads_score := LEAST(20, content_downloads_score);
  
  SELECT COUNT(*) * 25 INTO webinar_registration_score
  FROM interactions 
  WHERE user_id = p_user_id AND event_type = 'webinar_registration';
  
  -- Get current record if exists
  SELECT * INTO current_record FROM lead_scores WHERE user_id = p_user_id;
  
  IF current_record IS NULL THEN
    -- Insert new record
    INSERT INTO lead_scores (
      user_id,
      page_views_score,
      tool_usage_score,
      content_downloads_score,
      webinar_registration_score,
      time_on_site_score,
      scroll_depth_score,
      cta_engagement_score,
      total_score,
      previous_score,
      tier,
      previous_tier,
      scoring_data,
      tier_progression,
      calculated_at,
      tier_changed_at
    ) VALUES (
      p_user_id,
      page_views_score,
      tool_usage_score,
      content_downloads_score,
      webinar_registration_score,
      time_on_site_score,
      scroll_depth_score,
      cta_engagement_score,
      new_score,
      0,
      new_tier,
      'browser',
      jsonb_build_object(
        'page_views_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'page_view'),
        'tool_usage_count', (SELECT COUNT(*) FROM tool_usage WHERE user_id = p_user_id AND is_completed = true),
        'content_downloads_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'content_download'),
        'webinar_registrations_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'webinar_registration')
      ),
      jsonb_build_array(
        jsonb_build_object(
          'tier', new_tier,
          'score', new_score,
          'timestamp', NOW(),
          'previousTier', 'browser'
        )
      ),
      NOW(),
      CASE WHEN new_tier != 'browser' THEN NOW() ELSE NULL END
    );
  ELSE
    -- Update existing record
    UPDATE lead_scores SET
      page_views_score = page_views_score,
      tool_usage_score = tool_usage_score,
      content_downloads_score = content_downloads_score,
      webinar_registration_score = webinar_registration_score,
      time_on_site_score = time_on_site_score,
      scroll_depth_score = scroll_depth_score,
      cta_engagement_score = cta_engagement_score,
      previous_score = total_score,
      total_score = new_score,
      previous_tier = tier,
      tier = new_tier,
      scoring_data = jsonb_build_object(
        'page_views_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'page_view'),
        'tool_usage_count', (SELECT COUNT(*) FROM tool_usage WHERE user_id = p_user_id AND is_completed = true),
        'content_downloads_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'content_download'),
        'webinar_registrations_count', (SELECT COUNT(*) FROM interactions WHERE user_id = p_user_id AND event_type = 'webinar_registration')
      ),
      tier_progression = CASE 
        WHEN new_tier != current_record.tier THEN
          tier_progression || jsonb_build_array(
            jsonb_build_object(
              'tier', new_tier,
              'score', new_score,
              'timestamp', NOW(),
              'previousTier', current_record.tier
            )
          )
        ELSE tier_progression
      END,
      calculated_at = NOW(),
      tier_changed_at = CASE 
        WHEN new_tier != current_record.tier THEN NOW() 
        ELSE tier_changed_at 
      END,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate share tokens
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interactions_user_event ON interactions(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_interactions_session ON interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tool_usage_user ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_completed ON tool_usage(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_tool_usage_share_token ON tool_usage(share_token) WHERE is_shared = true;
CREATE INDEX IF NOT EXISTS idx_content_engagement_user ON content_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_content_engagement_content ON content_engagement(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_lead_scores_user ON lead_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_tier ON lead_scores(tier);
CREATE INDEX IF NOT EXISTS idx_lead_scores_score ON lead_scores(total_score DESC);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO anon, authenticated;
GRANT SELECT, INSERT ON interactions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON tool_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE ON content_engagement TO anon, authenticated;
GRANT SELECT ON lead_scores TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION calculate_lead_score(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_tier_from_score(INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_lead_score(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION generate_share_token() TO authenticated, service_role;