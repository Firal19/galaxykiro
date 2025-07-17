/**
 * Integration Test Runner
 * 
 * This script runs integration tests for the application, including:
 * 1. API endpoint tests
 * 2. Database connection tests
 * 3. Authentication flow tests
 * 4. Performance monitoring tests
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Initialize Supabase client
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Helper function to run a test
async function runTest(name, testFn) {
  console.log(`\n🧪 Running test: ${name}`);
  
  try {
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    results.passed++;
    results.tests.push({ name, status: 'passed' });
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
  }
}

// Helper function to skip a test
function skipTest(name, reason) {
  console.log(`\n⏭️ SKIPPED: ${name}`);
  console.log(`   Reason: ${reason}`);
  results.skipped++;
  results.tests.push({ name, status: 'skipped', reason });
}

// Test API endpoints
async function testApiEndpoints() {
  // Test health endpoint
  const healthResponse = await fetch(`${BASE_URL}/api/health`);
  if (!healthResponse.ok) {
    throw new Error(`Health endpoint returned ${healthResponse.status}`);
  }
  
  const healthData = await healthResponse.json();
  if (healthData.status !== 'ok') {
    throw new Error(`Health check failed: ${JSON.stringify(healthData)}`);
  }
  
  // Test performance endpoint
  const perfResponse = await fetch(`${BASE_URL}/api/analytics/performance?timeRange=day`);
  if (!perfResponse.ok) {
    throw new Error(`Performance endpoint returned ${perfResponse.status}`);
  }
}

// Test database connection
async function testDatabaseConnection() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  const { data, error } = await supabase.from('performance_metrics').select('count(*)');
  
  if (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

// Test Sentry integration
async function testSentryIntegration() {
  // Check if Sentry client config exists
  const fs = require('fs');
  const path = require('path');
  
  const sentryClientPath = path.join(__dirname, '../sentry.client.config.js');
  const sentryServerPath = path.join(__dirname, '../sentry.server.config.js');
  
  if (!fs.existsSync(sentryClientPath) || !fs.existsSync(sentryServerPath)) {
    throw new Error('Sentry configuration files not found');
  }
  
  // Check if Sentry DSN is configured
  const envLocalPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    if (!envContent.includes('NEXT_PUBLIC_SENTRY_DSN=')) {
      throw new Error('Sentry DSN not configured in .env.local');
    }
  } else {
    throw new Error('.env.local file not found');
  }
}

// Test performance monitoring
async function testPerformanceMonitoring() {
  const fs = require('fs');
  const path = require('path');
  
  // Check if performance monitoring file exists
  const perfMonitoringPath = path.join(__dirname, '../src/lib/performance-monitoring.ts');
  if (!fs.existsSync(perfMonitoringPath)) {
    throw new Error('Performance monitoring file not found');
  }
  
  // Check if performance metrics table exists in database
  if (supabase) {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'performance_metrics');
    
    if (error) {
      throw new Error(`Failed to check for performance_metrics table: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Performance metrics table not found in database');
    }
  }
}

// Test Netlify configuration
async function testNetlifyConfig() {
  const fs = require('fs');
  const path = require('path');
  
  const netlifyConfigPath = path.join(__dirname, '../netlify.toml');
  if (!fs.existsSync(netlifyConfigPath)) {
    throw new Error('netlify.toml file not found');
  }
  
  const netlifyConfig = fs.readFileSync(netlifyConfigPath, 'utf8');
  
  // Check for environment-specific settings
  if (!netlifyConfig.includes('[context.production.environment]')) {
    throw new Error('Production environment configuration not found in netlify.toml');
  }
  
  if (!netlifyConfig.includes('[context.staging.environment]')) {
    throw new Error('Staging environment configuration not found in netlify.toml');
  }
  
  // Check for security headers
  if (!netlifyConfig.includes('X-Frame-Options') || !netlifyConfig.includes('Content-Security-Policy')) {
    throw new Error('Security headers not properly configured in netlify.toml');
  }
}

// Test GitHub Actions workflow
async function testGitHubWorkflow() {
  const fs = require('fs');
  const path = require('path');
  
  const workflowPath = path.join(__dirname, '../.github/workflows/ci-cd.yml');
  if (!fs.existsSync(workflowPath)) {
    throw new Error('GitHub Actions workflow file not found');
  }
  
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  // Check for required jobs
  if (!workflowContent.includes('name: Lint') || 
      !workflowContent.includes('name: Test') || 
      !workflowContent.includes('name: Build')) {
    throw new Error('Required CI jobs not found in GitHub Actions workflow');
  }
  
  // Check for deployment jobs
  if (!workflowContent.includes('name: Deploy to Production')) {
    throw new Error('Production deployment job not found in GitHub Actions workflow');
  }
}

// Main function
async function main() {
  console.log('🚀 Starting integration tests...');
  
  // Run tests
  await runTest('API Endpoints', testApiEndpoints);
  
  if (supabase) {
    await runTest('Database Connection', testDatabaseConnection);
  } else {
    skipTest('Database Connection', 'Supabase credentials not configured');
  }
  
  await runTest('Sentry Integration', testSentryIntegration);
  await runTest('Performance Monitoring', testPerformanceMonitoring);
  await runTest('Netlify Configuration', testNetlifyConfig);
  await runTest('GitHub Actions Workflow', testGitHubWorkflow);
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   Passed: ${results.passed}`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Skipped: ${results.skipped}`);
  console.log(`   Total: ${results.passed + results.failed + results.skipped}`);
  
  // Exit with appropriate code
  if (results.failed > 0) {
    console.error('\n❌ Integration tests failed');
    process.exit(1);
  } else {
    console.log('\n✅ All integration tests passed');
    process.exit(0);
  }
}

// Run the script
main().catch(error => {
  console.error('Error running integration tests:', error);
  process.exit(1);
});