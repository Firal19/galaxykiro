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

-- Enable Row Level Security
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own content engagement" ON content_engagement
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content engagement" ON content_engagement
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content engagement" ON content_engagement
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow anonymous users to track content engagement (before registration)
CREATE POLICY "Anonymous users can insert content engagement" ON content_engagement
  FOR INSERT WITH CHECK (auth.uid() IS NULL);