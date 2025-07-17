-- Create performance_metrics table for storing real user metrics (RUM)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    page_path VARCHAR(500) NOT NULL,
    performance_category VARCHAR(20),
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    connection_type VARCHAR(20),
    connection_downlink DECIMAL(5,2),
    connection_rtt INTEGER,
    tags JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_path ON performance_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_performance_category ON performance_metrics(performance_category);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_timestamp ON performance_metrics(metric_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_timestamp ON performance_metrics(page_path, timestamp);

-- Add comments for documentation
COMMENT ON TABLE performance_metrics IS 'Stores real user metrics (RUM) for performance monitoring';
COMMENT ON COLUMN performance_metrics.metric_name IS 'Name of the performance metric (LCP, FID, CLS, TTFB, etc.)';
COMMENT ON COLUMN performance_metrics.value IS 'Numeric value of the metric';
COMMENT ON COLUMN performance_metrics.page_path IS 'URL path where the metric was measured';
COMMENT ON COLUMN performance_metrics.performance_category IS 'Performance category: good, needs-improvement, poor';
COMMENT ON COLUMN performance_metrics.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN performance_metrics.connection_type IS 'Network connection type (4g, 3g, etc.)';
COMMENT ON COLUMN performance_metrics.connection_downlink IS 'Network downlink speed in Mbps';
COMMENT ON COLUMN performance_metrics.connection_rtt IS 'Network round-trip time in milliseconds';
COMMENT ON COLUMN performance_metrics.tags IS 'Additional metadata as JSON';

-- Enable Row Level Security
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts for performance tracking" ON performance_metrics
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated reads
CREATE POLICY "Allow authenticated reads for performance metrics" ON performance_metrics
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access to performance metrics" ON performance_metrics
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);