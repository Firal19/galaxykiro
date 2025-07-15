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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);