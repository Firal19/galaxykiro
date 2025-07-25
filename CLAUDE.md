# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Galaxy Kiro is a progressive engagement website designed to nurture leads through curiosity-driven conversion using interactive tools and assessments. It's branded as "Galaxy Dream Team" and targets personal development and growth in Ethiopia.

## Build and Development Commands

```bash
# Development
npm run dev              # Start dev server on port 3000
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run Jest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Cypress E2E tests
npm run test:e2e:open    # Open Cypress UI
npm run test:a11y        # Run accessibility tests
npm run test:perf        # Run performance tests

# Code Quality
npm run lint             # Run ESLint

# Deployment
npm run deploy:staging   # Deploy to Netlify staging
npm run deploy:production # Deploy to Netlify production

# Utilities
npm run setup:monitoring # Setup Sentry monitoring
npm run setup:backups    # Setup Supabase backups
npm run health:check     # Check application health
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15.4.1 with App Router, React 19.1.0, TypeScript
- **UI**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Netlify with serverless functions
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Monitoring**: Sentry for error tracking

### Key Architectural Patterns

1. **Route Structure**: Uses Next.js 13+ App Router with file-based routing
   - Protected routes handled by middleware (`/src/middleware.ts`)
   - Admin routes under `/admin/*`
   - Member routes under `/soft-member/*`
   - Tool routes under `/tools/*`

2. **Authentication Flow**:
   - Session-based auth using cookies (`galaxy_kiro_session`)
   - Middleware intercepts protected routes
   - Role-based access control (admin, soft_member)
   - Progressive user status: visitor → cold_lead → candidate → hot_lead

3. **Lead Scoring System** (`/src/lib/lead-scoring-service.ts`):
   - Singleton service tracking user engagement
   - Automatic status progression based on scoring thresholds
   - Integration with analytics and conversion tracking
   - Attribution tracking via URL parameters (c, m, p)

4. **Component Architecture**:
   - Large monolithic components (e.g., revolutionary-pqc.tsx with 5,554 lines)
   - Heavy use of client-side components (`"use client"`)
   - Components organized by feature in `/src/components/`

5. **State Management**:
   - Zustand stores in `/src/lib/store.ts`
   - Local storage persistence for user progress
   - Server state managed via Supabase real-time subscriptions

6. **Database Schema** (Supabase PostgreSQL):
   - 14 migration files in `/supabase/migrations/`
   - Row Level Security (RLS) policies
   - Key tables: users, interactions, tool_usage, content_engagement, lead_scores

7. **Internationalization** (`/src/lib/i18n.ts`):
   - English/Amharic support
   - SSR-compatible translation system
   - Ethiopian calendar and number formatting

### Critical Business Logic

1. **Progressive Information Capture**:
   - 3-level system: email → phone → full details
   - Each level unlocks more features
   - Tracked in lead scoring service

2. **Tool Assessment Flow**:
   - 16+ psychological assessment tools
   - Results stored in tool_usage table
   - Impacts lead scoring and user progression

3. **Attribution System**:
   - URL parameters tracked: campaign (c), member (m), platform (p)
   - Stored in middleware headers and lead profiles
   - Used for member referral tracking

### Known Issues and Considerations

1. **Performance**:
   - Large component files need splitting
   - Bundle size exceeds 2MB
   - Some components have 12+ levels of prop drilling

2. **Testing**:
   - Only 8% component test coverage
   - Jest configured with 20% threshold
   - Critical business logic lacks comprehensive tests

3. **Security**:
   - API validation gaps noted
   - Ensure all Supabase RLS policies are properly configured
   - Environment variables must be properly secured

4. **Ethiopian Market Focus**:
   - Color scheme: Gold (#FFD700), Green (#078930), Red (#DA121A)
   - Amharic language support required
   - Ethiopian calendar integration in date pickers

## Environment Configuration

Required environment variables (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

## Development Workflow

1. **Feature Development**:
   - Create feature branch from main
   - Follow TypeScript-first approach
   - Use Zod for all form validation
   - Test on mobile devices (mobile-first design)

2. **Component Creation**:
   - Use shadcn/ui components as base
   - Follow existing patterns in `/src/components/`
   - Include proper TypeScript types
   - Add "use client" directive for client components

3. **API Development**:
   - Create routes in `/src/app/api/`
   - Use Netlify functions for complex operations
   - Validate all inputs with Zod schemas
   - Handle errors consistently

4. **Database Changes**:
   - Create migration files in `/supabase/migrations/`
   - Test RLS policies thoroughly
   - Backup before major changes

## Monitoring and Debugging

- **Sentry**: Configured for error tracking (check NEXT_PUBLIC_SENTRY_DSN)
- **Console Errors**: Lead scoring service errors are common during development
- **Hydration Issues**: Watch for SSR/client mismatches, especially in i18n
- **Cookie Issues**: Check middleware for session cookie handling