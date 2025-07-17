/**
 * Monitoring Setup Script
 * 
 * This script sets up monitoring for the application, including:
 * 1. Sentry for error tracking and performance monitoring
 * 2. Database table for performance metrics
 * 3. Environment variables for monitoring configuration
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create performance_metrics table if it doesn't exist
async function setupPerformanceMetricsTable() {
  console.log('Setting up performance_metrics table...');
  
  try {
    // Check if the table exists
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'performance_metrics');
    
    if (tablesError) {
      throw new Error(`Error checking for performance_metrics table: ${tablesError.message}`);
    }
    
    // If table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      console.log('Creating performance_metrics table...');
      
      // Create the table using SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE public.performance_metrics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            metric_name TEXT NOT NULL,
            value FLOAT NOT NULL,
            page_path TEXT NOT NULL,
            performance_category TEXT,
            user_agent TEXT,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            connection_type TEXT,
            connection_downlink FLOAT,
            connection_rtt FLOAT,
            tags JSONB,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          
          -- Create index for faster queries
          CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics (timestamp);
          CREATE INDEX idx_performance_metrics_metric_name ON public.performance_metrics (metric_name);
          CREATE INDEX idx_performance_metrics_page_path ON public.performance_metrics (page_path);
        `
      });
      
      if (createError) {
        throw new Error(`Error creating performance_metrics table: ${createError.message}`);
      }
      
      console.log('Performance metrics table created successfully!');
    } else {
      console.log('Performance metrics table already exists.');
    }
  } catch (error) {
    console.error('Error setting up performance metrics table:', error);
    process.exit(1);
  }
}

// Configure Sentry
function configureSentry() {
  console.log('Configuring Sentry...');
  
  if (!SENTRY_DSN) {
    console.warn('Warning: NEXT_PUBLIC_SENTRY_DSN environment variable is not set. Sentry will not be configured.');
    return;
  }
  
  try {
    // Create or update .env.local with Sentry configuration
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update Sentry configuration
    const sentryConfig = [
      `NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}`,
      `NEXT_PUBLIC_SENTRY_ENVIRONMENT=${ENVIRONMENT}`,
      'SENTRY_TRACES_SAMPLE_RATE=0.2',
      'SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1',
      'SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0',
    ];
    
    // Add or update Sentry configuration in .env.local
    let updatedEnvContent = envContent;
    sentryConfig.forEach(config => {
      const [key] = config.split('=');
      const regex = new RegExp(`^${key}=.*$`, 'm');
      
      if (regex.test(updatedEnvContent)) {
        updatedEnvContent = updatedEnvContent.replace(regex, config);
      } else {
        updatedEnvContent += `\n${config}`;
      }
    });
    
    fs.writeFileSync(envPath, updatedEnvContent.trim() + '\n');
    console.log('Sentry configuration updated in .env.local');
    
  } catch (error) {
    console.error('Error configuring Sentry:', error);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Setting up monitoring for Progressive Engagement Website...');
  
  try {
    // Setup performance metrics table
    await setupPerformanceMetricsTable();
    
    // Configure Sentry
    configureSentry();
    
    console.log('\nMonitoring setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set up Sentry project at https://sentry.io/');
    console.log('2. Add NEXT_PUBLIC_SENTRY_DSN to your environment variables');
    console.log('3. Configure Netlify deployment notifications');
    console.log('4. Set up alerting for critical errors');
    
  } catch (error) {
    console.error('Error setting up monitoring:', error);
    process.exit(1);
  }
}

// Run the script
main();