-- Create A/B testing tables for content optimization

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'completed', 'draft')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_metric TEXT NOT NULL CHECK (target_metric IN ('engagement', 'conversion', 'completion', 'time-on-page')),
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'new-visitors', 'returning-visitors', 'soft-members')),
  sample_size INTEGER DEFAULT 1000,
  confidence_level DECIMAL(3,2) DEFAULT 0.95 CHECK (confidence_level >= 0.8 AND confidence_level <= 0.99),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ab_test_variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('title', 'hook', 'cta', 'content-format', 'image')),
  value TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ab_test_results table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES ab_test_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('impression', 'conversion', 'engagement')),
  value DECIMAL(10,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_created_at ON ab_tests(created_at);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id ON ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_variant_id ON ab_test_results(variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_user_id ON ab_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_timestamp ON ab_test_results(timestamp);

-- Create composite indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_variant ON ab_test_results(test_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_action ON ab_test_results(test_id, action);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_ab_tests_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ab_tests_updated_at 
  BEFORE UPDATE ON ab_tests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_ab_tests_timestamps();

-- Create function to update variant conversion rates
CREATE OR REPLACE FUNCTION update_variant_conversion_rate()
RETURNS TRIGGER AS $$
BEGIN
  -- Update conversion rate when impressions or conversions change
  UPDATE ab_test_variants 
  SET conversion_rate = CASE 
    WHEN impressions > 0 THEN (conversions::DECIMAL / impressions) * 100
    ELSE 0
  END
  WHERE id = NEW.variant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_variant_conversion_rate_trigger
  AFTER INSERT OR UPDATE ON ab_test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_variant_conversion_rate();

-- Enable Row Level Security
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ab_tests
CREATE POLICY "Admins can manage all A/B tests" ON ab_tests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view active A/B tests" ON ab_tests
  FOR SELECT USING (status = 'active');

-- Create RLS policies for ab_test_variants
CREATE POLICY "Admins can manage all A/B test variants" ON ab_test_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view active test variants" ON ab_test_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ab_tests 
      WHERE ab_tests.id = ab_test_variants.test_id 
      AND ab_tests.status = 'active'
    )
  );

-- Create RLS policies for ab_test_results
CREATE POLICY "Admins can view all A/B test results" ON ab_test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own test results" ON ab_test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create view for A/B test analytics
CREATE OR REPLACE VIEW ab_test_analytics AS
SELECT 
  t.id as test_id,
  t.name as test_name,
  t.status,
  t.target_metric,
  t.target_audience,
  v.id as variant_id,
  v.name as variant_name,
  v.type as variant_type,
  v.impressions,
  v.conversions,
  v.conversion_rate,
  COUNT(r.id) as total_actions,
  COUNT(CASE WHEN r.action = 'impression' THEN 1 END) as impression_count,
  COUNT(CASE WHEN r.action = 'conversion' THEN 1 END) as conversion_count,
  COUNT(CASE WHEN r.action = 'engagement' THEN 1 END) as engagement_count,
  AVG(r.value) as average_value
FROM ab_tests t
LEFT JOIN ab_test_variants v ON t.id = v.test_id
LEFT JOIN ab_test_results r ON v.id = r.variant_id
GROUP BY t.id, t.name, t.status, t.target_metric, t.target_audience, 
         v.id, v.name, v.type, v.impressions, v.conversions, v.conversion_rate;

-- Create function to get test winner
CREATE OR REPLACE FUNCTION get_test_winner(test_id_param UUID)
RETURNS TABLE (
  variant_id UUID,
  variant_name TEXT,
  conversion_rate DECIMAL(5,2),
  confidence_level DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    v.conversion_rate,
    0.95 as confidence_level -- This would be calculated based on statistical significance
  FROM ab_test_variants v
  WHERE v.test_id = test_id_param
    AND v.impressions >= 100 -- Minimum sample size
  ORDER BY v.conversion_rate DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql; 