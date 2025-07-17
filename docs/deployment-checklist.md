# Deployment Checklist

## Pre-Deployment

- [ ] All tests are passing
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] End-to-end tests
  - [ ] Accessibility tests
  - [ ] Performance tests

- [ ] Code quality checks
  - [ ] Linting passes
  - [ ] TypeScript type checking passes
  - [ ] No console.log statements in production code
  - [ ] No TODO comments in critical paths

- [ ] Security checks
  - [ ] Dependencies scanned for vulnerabilities
  - [ ] API endpoints properly secured
  - [ ] Authentication flows tested
  - [ ] Environment variables properly set

- [ ] Performance optimization
  - [ ] Images optimized
  - [ ] Bundle size analyzed
  - [ ] Lazy loading implemented where appropriate
  - [ ] Server-side rendering used where beneficial

- [ ] SEO and accessibility
  - [ ] Meta tags properly set
  - [ ] Alt text for images
  - [ ] Semantic HTML used
  - [ ] Color contrast meets WCAG standards

## Deployment Process

- [ ] Update environment variables in Netlify
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SENTRY_DSN
  - [ ] NEXT_PUBLIC_SENTRY_ENVIRONMENT
  - [ ] NEXT_PUBLIC_SITE_URL
  - [ ] NEXT_PUBLIC_ANALYTICS_ENABLED

- [ ] Database migrations
  - [ ] Migrations tested in staging environment
  - [ ] Backup taken before applying migrations
  - [ ] Migration scripts reviewed for data integrity

- [ ] Deployment steps
  - [ ] Deploy to staging environment first
  - [ ] Run smoke tests on staging
  - [ ] Verify Core Web Vitals on staging
  - [ ] Deploy to production using CI/CD pipeline
  - [ ] Verify deployment was successful

## Post-Deployment

- [ ] Monitoring
  - [ ] Verify Sentry is receiving data
  - [ ] Check error rates in dashboard
  - [ ] Verify performance metrics are being collected
  - [ ] Set up alerts for critical issues

- [ ] Validation
  - [ ] Test critical user flows
  - [ ] Verify third-party integrations
  - [ ] Check mobile responsiveness
  - [ ] Verify internationalization works

- [ ] Documentation
  - [ ] Update API documentation if needed
  - [ ] Document any new features or changes
  - [ ] Update runbooks if processes changed

- [ ] Communication
  - [ ] Notify team of successful deployment
  - [ ] Communicate changes to stakeholders
  - [ ] Update release notes

## Rollback Plan

In case of critical issues:

1. Identify the issue and its severity
2. If severity is high:
   - Revert to previous deployment in Netlify
   - Notify team of rollback
   - Document issue for future resolution
3. If severity is medium/low:
   - Create hotfix branch
   - Apply fix and deploy through CI/CD pipeline
   - Monitor to ensure fix resolves the issue

## Deployment Approval

- [ ] Technical lead approval
- [ ] Product manager approval
- [ ] QA approval