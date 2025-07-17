import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PerformanceMetric {
  metric: string;
  value: number;
  id?: string;
  page: string;
  performanceCategory?: string;
  userAgent?: string;
  timestamp: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  tags?: Record<string, string>;
}

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming performance data
    const performanceData: PerformanceMetric = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!performanceData.metric || typeof performanceData.value !== 'number' || !performanceData.page) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid performance data' }),
      };
    }

    // Store in Supabase
    const { error } = await supabase
      .from('performance_metrics')
      .insert({
        metric_name: performanceData.metric,
        value: performanceData.value,
        page_path: performanceData.page,
        performance_category: performanceData.performanceCategory || null,
        user_agent: performanceData.userAgent || null,
        timestamp: new Date(performanceData.timestamp).toISOString(),
        connection_type: performanceData.connection?.effectiveType || null,
        connection_downlink: performanceData.connection?.downlink || null,
        connection_rtt: performanceData.connection?.rtt || null,
        tags: performanceData.tags || null,
      });

    if (error) {
      console.error('Error storing performance metric:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to store performance metric' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };