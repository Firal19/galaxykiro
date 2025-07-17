// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
  
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Capture performance data
  enablePerformanceMonitoring: true,
  performanceMonitoringRate: 0.5,
  
  // Set tracesSampler to filter transactions by URL
  tracesSampler: (samplingContext) => {
    // Don't capture traces for static assets
    if (samplingContext.request?.url?.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/)) {
      return 0;
    }
    
    // Sample all other transactions at the configured rate
    return process.env.NODE_ENV === 'production' ? 0.2 : 1.0;
  },
});