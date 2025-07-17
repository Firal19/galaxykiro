# Monitoring and Observability

## Overview

This document outlines the monitoring and observability setup for the Progressive Engagement Website.

## Error Tracking

We use Sentry for error tracking and performance monitoring. Sentry captures:

- JavaScript errors
- API failures
- Performance issues
- User experience problems

### Sentry Dashboard

Access the Sentry dashboard at: https://sentry.io/organizations/your-org/

### Error Alerts

Error alerts are configured to notify the team via:
- Email
- Slack channel: #website-alerts

## Performance Monitoring

### Real User Metrics (RUM)

We collect the following Core Web Vitals metrics:

- **LCP (Largest Contentful Paint)**: Measures loading performance
  - Good: ≤ 2.5s
  - Needs Improvement: 2.5s - 4.0s
  - Poor: > 4.0s

- **FID (First Input Delay)**: Measures interactivity
  - Good: ≤ 100ms
  - Needs Improvement: 100ms - 300ms
  - Poor: > 300ms

- **CLS (Cumulative Layout Shift)**: Measures visual stability
  - Good: ≤ 0.1
  - Needs Improvement: 0.1 - 0.25
  - Poor: > 0.25

- **TTFB (Time to First Byte)**: Measures server response time
  - Good: ≤ 800ms
  - Needs Improvement: 800ms - 1800ms
  - Poor: > 1800ms

### Performance Dashboard

An internal performance dashboard is available at: /admin/analytics/performance

### Data Storage

Performance metrics are stored in the `performance_metrics` table in Supabase.

## Deployment Monitoring

### Netlify Deployment Notifications

Deployment status notifications are sent to:
- Slack channel: #website-deployments
- Email to the development team

### Deployment Checks

Each deployment runs the following checks:
1. Unit tests
2. Integration tests
3. Accessibility tests
4. Performance tests
5. Lighthouse audits

## Health Checks

Health check endpoints:
- API Health: /api/health
- Database Connection: /api/health/database

## Incident Response

In case of incidents:

1. **Severity 1 (Critical)**: Site down or major functionality broken
   - Response time: Immediate
   - Contact: On-call engineer via PagerDuty

2. **Severity 2 (High)**: Significant degradation but site usable
   - Response time: Within 2 hours
   - Contact: Development team lead

3. **Severity 3 (Medium)**: Minor issues affecting small number of users
   - Response time: Next business day
   - Contact: Support team

## Monitoring Tools Integration

- **Sentry**: Error tracking and performance monitoring
- **Netlify Analytics**: Traffic and usage patterns
- **Supabase**: Database performance and storage
- **GitHub Actions**: CI/CD pipeline monitoring

## Adding Custom Monitoring

To add custom performance monitoring to a component:

```tsx
import { usePerformanceMonitoring } from '@/lib/performance-monitoring';

const MyComponent = () => {
  const { trackRender, trackInteraction } = usePerformanceMonitoring('MyComponent');
  
  // Track component render time
  trackRender();
  
  // Track interaction time
  const handleClick = () => {
    const endTracking = trackInteraction('button-click');
    
    // Your logic here
    
    // End tracking when interaction is complete
    endTracking();
  };
  
  return (
    <button onClick={handleClick}>Click Me</button>
  );
};
```