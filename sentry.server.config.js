// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
  
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  
  // Capture performance data for server-side operations
  enablePerformanceMonitoring: true,
  performanceMonitoringRate: 0.5,
  
  // Set tracesSampler to filter transactions by URL
  tracesSampler: (samplingContext) => {
    // Don't capture traces for static assets
    if (samplingContext.request?.url?.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/)) {
      return 0;
    }
    
    // Sample API routes at a higher rate
    if (samplingContext.request?.url?.match(/^\/api\//)) {
      return process.env.NODE_ENV === 'production' ? 0.5 : 1.0;
    }
    
    // Sample all other transactions at the configured rate
    return process.env.NODE_ENV === 'production' ? 0.2 : 1.0;
  },
});