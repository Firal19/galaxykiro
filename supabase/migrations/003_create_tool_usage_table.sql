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
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$ LANGUAGE plpgsql;

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

-- Enable Row Level Security
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tool usage" ON tool_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tool usage" ON tool_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tool usage" ON tool_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow public access to shared results
CREATE POLICY "Public can view shared tool results" ON tool_usage
  FOR SELECT USING (is_shared = TRUE AND share_token IS NOT NULL);