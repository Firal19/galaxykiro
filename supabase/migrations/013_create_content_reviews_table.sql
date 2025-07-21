-- Create content_reviews table for storing user reviews and ratings
CREATE TABLE IF NOT EXISTS content_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  
  -- Review data
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Review metadata
  verified BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  reported_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_reviews_user_id ON content_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_content_id ON content_reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_content_type ON content_reviews(content_type);
CREATE INDEX IF NOT EXISTS idx_content_reviews_rating ON content_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_content_reviews_created_at ON content_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_content_reviews_verified ON content_reviews(verified);

-- Create composite indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_content_reviews_user_content ON content_reviews(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_content_rating ON content_reviews(content_id, rating);

-- Create GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_content_reviews_tags ON content_reviews USING GIN (tags);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_content_reviews_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_reviews_updated_at 
  BEFORE UPDATE ON content_reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_content_reviews_timestamps();

-- Enable Row Level Security
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all content reviews" ON content_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own content reviews" ON content_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content reviews" ON content_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all content reviews" ON content_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create content_metrics view for aggregated review data
CREATE OR REPLACE VIEW content_metrics AS
SELECT 
  content_id,
  content_type,
  COUNT(*) as total_reviews,
  AVG(rating) as average_rating,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4_count,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5_count,
  COUNT(CASE WHEN verified = true THEN 1 END) as verified_reviews_count,
  SUM(helpful_votes) as total_helpful_votes,
  COUNT(CASE WHEN report_count > 0 THEN 1 END) as reported_reviews_count,
  MAX(created_at) as last_review_at,
  -- Calculate engagement score based on rating, helpful votes, and verification
  (
    AVG(rating) * 0.4 + 
    (COUNT(CASE WHEN helpful_votes > 0 THEN 1 END)::DECIMAL / COUNT(*)) * 0.3 +
    (COUNT(CASE WHEN verified = true THEN 1 END)::DECIMAL / COUNT(*)) * 0.3
  ) * 100 as engagement_score
FROM content_reviews
GROUP BY content_id, content_type;

-- Create function to get content insights
CREATE OR REPLACE FUNCTION get_content_insights(content_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'strengths', (
      SELECT array_agg(tag ORDER BY frequency DESC LIMIT 3)
      FROM (
        SELECT unnest(tags) as tag, COUNT(*) as frequency
        FROM content_reviews
        WHERE content_id = content_id_param
        GROUP BY tag
        HAVING COUNT(*) > 1
      ) tag_counts
    ),
    'improvements', (
      SELECT array_agg(tag ORDER BY frequency DESC LIMIT 3)
      FROM (
        SELECT unnest(tags) as tag, COUNT(*) as frequency
        FROM content_reviews
        WHERE content_id = content_id_param AND rating <= 3
        GROUP BY tag
        HAVING COUNT(*) > 1
      ) improvement_tags
    ),
    'sentiment', (
      CASE 
        WHEN AVG(rating) >= 4.0 THEN 'positive'
        WHEN AVG(rating) >= 3.0 THEN 'neutral'
        ELSE 'negative'
      END
    ),
    'recommendation_score', (
      AVG(rating) * 0.6 + 
      (COUNT(CASE WHEN helpful_votes > 0 THEN 1 END)::DECIMAL / COUNT(*)) * 0.4
    ) * 100
  ) INTO result
  FROM content_reviews
  WHERE content_id = content_id_param;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 