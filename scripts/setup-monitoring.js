/**
 * Monitoring Setup Script
 * 
 * This script sets up comprehensive monitoring for the progressive engagement website,
 * including performance monitoring, error tracking, and health checks.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configuration
const MONITORING_CONFIG = {
  sentry: {
    enabled: process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    netlifyAnalytics: true,
    customAnalytics: true,
  },
  healthChecks: {
    enabled: true,
    interval: '*/5 * * * *', // Every 5 minutes
    endpoints: [
      '/api/health',
      '/api/analytics/performance',
    ],
  },
  alerts: {
    email: process.env.ALERT_EMAIL || 'admin@galaxydreamteam.com',
    slack: process.env.SLACK_WEBHOOK_URL,
    performanceThresholds: {
      lcp: 4000, // 4 seconds
      fid: 300,  // 300ms
      cls: 0.25, // 0.25 CLS score
      errorRate: 0.05, // 5% error rate
    },
  },
};

console.log('🚀 Setting up monitoring configuration...');

// Create monitoring configuration file
const configDir = path.join(__dirname, '../.monitoring');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

const configPath = path.join(configDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(MONITORING_CONFIG, null, 2));
console.log(`✅ Monitoring configuration saved to ${configPath}`);

// Create health check endpoint
const healthCheckContent = `import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for health checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      memory: 'unknown',
      uptime: process.uptime(),
    },
  };

  try {
    // Check database connectivity
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    healthCheck.checks.database = error ? 'unhealthy' : 'healthy';
    
    // Check memory usage (Node.js only)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };
      
      healthCheck.checks.memory = memUsageMB.heapUsed < 512 ? 'healthy' : 'warning';
      healthCheck.memoryUsage = memUsageMB;
    }
    
    // Determine overall status
    const allChecks = Object.values(healthCheck.checks);
    if (allChecks.includes('unhealthy')) {
      healthCheck.status = 'unhealthy';
      return NextResponse.json(healthCheck, { status: 503 });
    } else if (allChecks.includes('warning')) {
      healthCheck.status = 'warning';
      return NextResponse.json(healthCheck, { status: 200 });
    }
    
    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    healthCheck.status = 'unhealthy';
    healthCheck.error = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(healthCheck, { status: 503 });
  }
}`;

const healthCheckDir = path.join(__dirname, '../src/app/api/health');
if (!fs.existsSync(healthCheckDir)) {
  fs.mkdirSync(healthCheckDir, { recursive: true });
}

fs.writeFileSync(path.join(healthCheckDir, 'route.ts'), healthCheckContent);
console.log('✅ Health check endpoint created at /api/health');

// Create alert system configuration
const alertSystemContent = `/**
 * Alert System for Performance and Error Monitoring
 * 
 * This module handles sending alerts when performance thresholds are exceeded
 * or when critical errors occur.
 */

interface AlertConfig {
  email?: string;
  slack?: string;
  performanceThresholds: {
    lcp: number;
    fid: number;
    cls: number;
    errorRate: number;
  };
}

interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  page: string;
  timestamp: string;
}

interface ErrorAlert {
  error: string;
  count: number;
  rate: number;
  timestamp: string;
}

class AlertSystem {
  private config: AlertConfig;
  private alertCooldown: Map<string, number> = new Map();
  private readonly COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutes

  constructor(config: AlertConfig) {
    this.config = config;
  }

  async sendPerformanceAlert(alert: PerformanceAlert): Promise<void> {
    const alertKey = \`perf-\${alert.metric}-\${alert.page}\`;
    
    // Check cooldown to prevent spam
    const lastAlert = this.alertCooldown.get(alertKey);
    if (lastAlert && Date.now() - lastAlert < this.COOLDOWN_PERIOD) {
      return;
    }

    const message = \`🚨 Performance Alert: \${alert.metric.toUpperCase()} threshold exceeded
    
Page: \${alert.page}
Current Value: \${alert.value}\${alert.metric === 'cls' ? '' : 'ms'}
Threshold: \${alert.threshold}\${alert.metric === 'cls' ? '' : 'ms'}
Time: \${alert.timestamp}

Please investigate the performance issue.\`;

    await this.sendAlert('Performance Alert', message);
    this.alertCooldown.set(alertKey, Date.now());
  }

  async sendErrorAlert(alert: ErrorAlert): Promise<void> {
    const alertKey = \`error-\${alert.error}\`;
    
    // Check cooldown
    const lastAlert = this.alertCooldown.get(alertKey);
    if (lastAlert && Date.now() - lastAlert < this.COOLDOWN_PERIOD) {
      return;
    }

    const message = \`🔥 Error Rate Alert: High error rate detected

Error: \${alert.error}
Count: \${alert.count}
Rate: \${(alert.rate * 100).toFixed(2)}%
Threshold: \${(this.config.performanceThresholds.errorRate * 100).toFixed(2)}%
Time: \${alert.timestamp}

Please investigate the error immediately.\`;

    await this.sendAlert('Error Rate Alert', message);
    this.alertCooldown.set(alertKey, Date.now());
  }

  private async sendAlert(subject: string, message: string): Promise<void> {
    const promises: Promise<void>[] = [];

    // Send email alert
    if (this.config.email) {
      promises.push(this.sendEmailAlert(subject, message));
    }

    // Send Slack alert
    if (this.config.slack) {
      promises.push(this.sendSlackAlert(message));
    }

    await Promise.allSettled(promises);
  }

  private async sendEmailAlert(subject: string, message: string): Promise<void> {
    try {
      // In a real implementation, you would use a service like SendGrid, AWS SES, etc.
      console.log(\`Email Alert: \${subject}\`);
      console.log(message);
      
      // Example with fetch to a serverless function
      await fetch('/.netlify/functions/send-email-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.config.email,
          subject,
          message,
        }),
      });
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  private async sendSlackAlert(message: string): Promise<void> {
    try {
      if (!this.config.slack) return;

      await fetch(this.config.slack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          username: 'Performance Monitor',
          icon_emoji: ':warning:',
        }),
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  checkPerformanceThresholds(metrics: any[]): void {
    metrics.forEach(metric => {
      const { metric_name, value, page_path } = metric;
      let threshold: number | undefined;

      switch (metric_name) {
        case 'LCP':
          threshold = this.config.performanceThresholds.lcp;
          break;
        case 'FID':
          threshold = this.config.performanceThresholds.fid;
          break;
        case 'CLS':
          threshold = this.config.performanceThresholds.cls;
          break;
      }

      if (threshold && value > threshold) {
        this.sendPerformanceAlert({
          metric: metric_name.toLowerCase(),
          value,
          threshold,
          page: page_path,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }
}

export default AlertSystem;`;

const alertSystemDir = path.join(__dirname, '../src/lib');
fs.writeFileSync(path.join(alertSystemDir, 'alert-system.ts'), alertSystemContent);
console.log('✅ Alert system created');

// Create deployment checklist
const deploymentChecklistContent = `# Deployment Checklist

## Pre-Deployment Checks

### Environment Configuration
- [ ] All environment variables are set correctly
- [ ] Sentry DSN is configured for error monitoring
- [ ] Supabase connection is working
- [ ] Analytics tracking is enabled for production

### Performance Optimization
- [ ] Bundle size is optimized (< 250KB initial load)
- [ ] Images are optimized and using WebP format
- [ ] Code splitting is implemented for large components
- [ ] Service worker is configured for caching

### Security
- [ ] Security headers are configured in netlify.toml
- [ ] HTTPS is enforced
- [ ] Content Security Policy is properly configured
- [ ] API endpoints have proper authentication

### Testing
- [ ] All unit tests pass (\`npm test\`)
- [ ] End-to-end tests pass (\`npm run test:e2e\`)
- [ ] Accessibility tests pass (\`npm run test:a11y\`)
- [ ] Performance tests pass (\`npm run test:perf\`)

### Database
- [ ] Database migrations are applied
- [ ] Backup configuration is set up
- [ ] Row Level Security (RLS) policies are enabled

## Deployment Steps

### Staging Deployment
1. [ ] Deploy to staging environment
2. [ ] Run smoke tests on staging
3. [ ] Verify all features work correctly
4. [ ] Check performance metrics
5. [ ] Test error monitoring integration

### Production Deployment
1. [ ] Create database backup before deployment
2. [ ] Deploy to production
3. [ ] Verify deployment was successful
4. [ ] Run post-deployment health checks
5. [ ] Monitor error rates and performance metrics

## Post-Deployment Monitoring

### Immediate Checks (First 30 minutes)
- [ ] Health check endpoint returns 200 OK
- [ ] Error rate is below 1%
- [ ] Core Web Vitals are within acceptable ranges:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

### Extended Monitoring (First 24 hours)
- [ ] Monitor user engagement metrics
- [ ] Check for any performance regressions
- [ ] Verify all integrations are working
- [ ] Monitor database performance

### Weekly Reviews
- [ ] Review performance trends
- [ ] Analyze error patterns
- [ ] Check backup integrity
- [ ] Update dependencies if needed

## Rollback Plan

If issues are detected:

1. [ ] Immediately rollback to previous version
2. [ ] Investigate the root cause
3. [ ] Fix the issue in development
4. [ ] Re-test thoroughly
5. [ ] Deploy the fix

## Emergency Contacts

- **Primary Developer**: [Name] - [Email] - [Phone]
- **DevOps Engineer**: [Name] - [Email] - [Phone]
- **Project Manager**: [Name] - [Email] - [Phone]
- **Supabase Support**: support@supabase.io
- **Netlify Support**: support@netlify.com

## Monitoring Dashboards

- **Performance Dashboard**: /admin/analytics
- **Sentry Error Tracking**: [Sentry Dashboard URL]
- **Netlify Analytics**: [Netlify Dashboard URL]
- **Supabase Dashboard**: [Supabase Dashboard URL]

---

**Note**: This checklist should be reviewed and updated regularly to ensure it remains current with the project's needs.`;

const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(path.join(docsDir, 'deployment-checklist.md'), deploymentChecklistContent);
console.log('✅ Deployment checklist created at docs/deployment-checklist.md');

// Update package.json scripts
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add monitoring-related scripts
packageJson.scripts = {
  ...packageJson.scripts,
  'setup:monitoring': 'node scripts/setup-monitoring.js',
  'setup:backups': 'node scripts/setup-supabase-backups.js',
  'health:check': 'curl -f http://localhost:3000/api/health || exit 1',
  'deploy:staging': 'netlify deploy --dir=.next --functions=netlify/functions',
  'deploy:production': 'netlify deploy --dir=.next --functions=netlify/functions --prod',
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Package.json scripts updated');

// Create environment variables template
const envTemplateContent = `# Environment Variables Template
# Copy this file to .env.local and fill in the actual values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
SUPABASE_PROJECT_ID=your_supabase_project_id_here

# Sentry Configuration (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development

# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backup Configuration
BACKUP_SCHEDULE="0 0 * * *"
BACKUP_RETENTION_DAYS=30
PITR_ENABLED=false
PITR_RETENTION_DAYS=7

# Alert Configuration
ALERT_EMAIL=admin@example.com
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Netlify Configuration (for CI/CD)
NETLIFY_AUTH_TOKEN=your_netlify_auth_token_here
NETLIFY_SITE_ID_DEV=your_dev_site_id_here
NETLIFY_SITE_ID_STAGING=your_staging_site_id_here
NETLIFY_SITE_ID_PROD=your_production_site_id_here`;

fs.writeFileSync(path.join(__dirname, '../.env.example'), envTemplateContent);
console.log('✅ Environment variables template updated');

console.log('\n🎉 Monitoring setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Copy .env.example to .env.local and fill in your actual values');
console.log('2. Run npm install to install any new dependencies');
console.log('3. Set up your Sentry project and add the DSN to your environment variables');
console.log('4. Configure your Netlify deployment settings');
console.log('5. Run the backup setup script: npm run setup:backups');
console.log('6. Test the health check endpoint: npm run health:check');
console.log('\nFor more information, see docs/deployment-checklist.md');