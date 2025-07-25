# Galaxy Kiro - Complete File Structure and Explanation

## Project Overview
Galaxy Kiro is a comprehensive Next.js 15.4.1 application with TypeScript, featuring a progressive engagement system, lead scoring, multi-language support, and integrated CMS capabilities.

**Total Files: 459 (excluding node_modules, .git, .next)**
**Last Updated: January 25, 2025**

---

## Table of Contents
1. [Root Directory Structure](#root-directory-structure)
2. [Source Code Structure (/src)](#source-code-structure)
3. [Components Directory](#components-directory)
4. [Pages and Routing](#pages-and-routing)
5. [API Routes](#api-routes)
6. [Libraries and Utilities](#libraries-and-utilities)
7. [Database and Migrations](#database-and-migrations)
8. [Serverless Functions](#serverless-functions)
9. [Configuration Files](#configuration-files)
10. [Testing Structure](#testing-structure)
11. [Build and Scripts](#build-and-scripts)
12. [Public Assets](#public-assets)
13. [File Count Summary](#file-count-summary)
14. [Architecture Patterns](#architecture-patterns)
15. [Naming Conventions](#naming-conventions)

---

## 1. Root Directory Structure

The root directory contains **28 configuration and documentation files** essential for project setup:

```
/Users/firaol/galaxykiro/ (28 files)
├── DEBUG_AND_FIX_PLAN.md          # Development debugging documentation
├── FILE_STRUCTURE_AND_EXPLANATION.md  # This documentation file
├── FIX_TICKET.md                  # Issue tracking and fixes
├── PROGRESS.md                    # Development progress log
├── README.md                      # Main project documentation
├── TESTING.md                     # Testing procedures and guidelines
├── components.json                # Shadcn/ui component configuration
├── cypress.config.ts              # End-to-end testing configuration
├── dev.log                        # Development server logs
├── eslint.config.mjs              # ESLint linting configuration
├── fix-apostrophes.js             # Utility script for text fixes
├── jest.config.js                 # Jest testing framework config
├── jest.setup.js                  # Jest test environment setup
├── netlify.toml                   # Netlify deployment configuration
├── next-env.d.ts                  # Next.js TypeScript declarations
├── next.config.ts                 # Next.js framework configuration
├── package-lock.json              # Locked dependency versions
├── package.json                   # Project dependencies and scripts
├── postcss.config.mjs             # PostCSS processing configuration
├── sentry.client.config.js        # Sentry error tracking (client)
├── sentry.server.config.js        # Sentry error tracking (server)
├── server.log                     # Server operation logs
├── tailwind.config.ts             # Tailwind CSS configuration
├── test-results.log               # Test execution results
├── tsconfig.json                  # TypeScript compiler configuration
├── tsconfig.tsbuildinfo           # TypeScript incremental build cache
└── verify-tests.js                # Test verification utility
```

### Key Configuration Files:
- **next.config.ts**: Next.js 15.4.1 with Turbopack, PWA support
- **package.json**: 393 TypeScript files, React 19.1.0, comprehensive dependencies
- **tailwind.config.ts**: Custom Ethiopian design system colors and components
- **tsconfig.json**: Strict TypeScript configuration with path aliases

## 2. Source Code Structure (/src)

The **src/** directory contains **332 files** - the core of the Galaxy Kiro application:

```
src/ (332 files total)
├── app/                   # Next.js 13+ App Router (130 files)
├── components/            # React components (137 files) 
├── lib/                   # Utilities and services (60 files)
├── config/                # Configuration files (1 file)
├── constants/             # Application constants (1 file)
├── hooks/                 # Custom React hooks (2 files)
└── types/                 # TypeScript type definitions (2 files)
```

### Directory Breakdown:
- **app/**: Next.js App Router with pages, API routes, and layouts
- **components/**: Reusable React components organized by feature
- **lib/**: Business logic, utilities, and external service integrations
- **config/**: Application configuration and settings
- **types/**: TypeScript type definitions and interfaces

## 3. Components Directory

The **components/** directory houses **137 React components** organized by functionality:

```
src/components/ (137 files)
├── [60 main components]   # Core application components
├── admin/                 # Admin panel components (8 files)
├── assessment/            # Assessment tools (2 files)  
├── layouts/               # Layout wrappers (3 files)
├── navigation/            # Navigation components (1 file)
├── network/               # Networking features (4 files)
├── soft-member/           # Member area components (3 files)
├── tools/                 # Interactive tools (46 files)
├── trust-building/        # Trust building features (2 files)
└── ui/                    # Base UI components (29 files)
```

### Key Component Categories:

#### Core Components (60 files):
- `hero-section.tsx` - Landing page hero with bypass buttons
- `lead-capture-modal.tsx` - Progressive user capture
- `potential-assessment.tsx` - Main assessment tool
- `analytics-dashboard.tsx` - Real-time analytics
- `ethiopian-success-stories.tsx` - Localized testimonials

#### UI Components (29 files):
- `button.tsx`, `card.tsx`, `modal.tsx` - Base components
- `animated-counter.tsx` - Smooth number animations
- `video-player.tsx` - Custom video player
- `toast.tsx` - Notification system

## 4. Pages and Routing

The **app/** directory uses Next.js 13+ App Router with **130 files** across multiple route segments:

```
src/app/ (130 files)
├── layout.tsx & page.tsx          # Root layout and homepage
├── globals.css                    # Global styles
├── middleware.ts                  # Route middleware
├── admin/                         # Admin panel (11 files)
│   ├── analytics/, cms/, content/, dashboard/, leads/, network/, tools/, users/, webinars/
├── api/                           # API routes (30 files)
│   ├── auth/, admin/, analytics/, capture-user-info/, cms/, leads/, office-locations/
│   ├── office-visits/, process-assessment/, security-example/, telegram/, test/
│   ├── track-interaction/, update-engagement-score/, webinars/
├── soft-member/                   # Member area (6 files)
│   ├── calendar/, content/, dashboard/, network/, profile/, toolbox/
├── tools/                         # Interactive tools (17 files)
│   ├── affirmation-architect/, dream-clarity-generator/, goal-achievement-predictor/
│   ├── habit-installer/, habit-strength-analyzer/, implementation-intention-builder/
│   ├── influence-quotient-calculator/, inner-dialogue-decoder/, knowledge-action-gap-analyzer/
│   ├── leadership-style-profiler/, limiting-belief-identifier/, mental-model-mapper/
│   ├── potential-quotient-calculator/, routine-optimizer/, team-builder-simulator/
│   ├── transformation-readiness-score/
├── auth/                          # Authentication (4 files)
├── membership/                    # Membership system (3 files)
└── [Additional pages]             # Blog, demos, tests, etc.
```

### Key Routes:
- **/** - Homepage with hero section and bypass buttons
- **/admin** - Admin dashboard with analytics and user management
- **/soft-member/dashboard** - Member area with personalized content
- **/tools/** - 16 interactive assessment and development tools
- **/api/** - 30 API endpoints for backend functionality

## 5. API Routes

The **api/** directory contains **30 RESTful API endpoints** organized by feature:

```
src/app/api/ (30 files)
├── auth/                          # Authentication (2 files)
│   ├── login/route.ts             # User login endpoint
│   └── register/route.ts          # User registration
├── admin/                         # Admin operations (2 files)
│   └── content/[id]/route.ts      # Content management CRUD
├── analytics/                     # Analytics tracking (3 files)
│   ├── metrics/route.ts           # Performance metrics
│   ├── performance/route.ts       # Performance data
│   └── track/route.ts             # User tracking
├── leads/                         # Lead management (2 files)
├── webinars/                      # Webinar system (2 files)
├── office-locations/              # Office booking (2 files)
├── capture-user-info/route.ts     # Progressive capture
├── track-interaction/route.ts     # Engagement tracking
├── process-assessment/route.ts    # Assessment processing
└── [Additional endpoints]         # CMS, Telegram, testing, etc.
```

### API Features:
- **RESTful design** with proper HTTP methods
- **TypeScript interfaces** for request/response types
- **Supabase integration** for database operations
- **Real-time tracking** for user engagement
- **Lead scoring** and analytics processing

## 6. Libraries and Utilities

The **lib/** directory contains **60 utility files** providing core business logic:

```
src/lib/ (60 files)
├── Core Services:
│   ├── auth.ts                    # Authentication service
│   ├── supabase.ts                # Database client
│   ├── i18n.ts                    # Internationalization (SSR-fixed)
│   ├── store.ts                   # State management
│   └── utils.ts                   # Common utilities
├── Analytics & Tracking:
│   ├── analytics-engine.ts        # Analytics processing
│   ├── engagement-engine.ts       # User engagement tracking
│   ├── lead-scoring-engine.ts     # Lead scoring algorithms  
│   ├── performance-monitoring.ts  # Performance tracking
│   └── tracking.ts                # Event tracking
├── Assessment System:
│   ├── assessment-engine.ts       # Assessment logic
│   ├── behavioral-analysis.ts     # Behavioral insights
│   └── psychological-triggers.ts  # Psychology-based triggers
├── Content & Personalization:
│   ├── personalization-engine.ts  # Content personalization
│   ├── content-validation.ts      # Content validation
│   └── ab-testing.ts              # A/B testing framework
└── [Additional libraries]         # Email, security, responsive utils, etc.
```

### Key Libraries:
- **authentication**: JWT-based auth with Supabase
- **lead-scoring**: Advanced scoring algorithms
- **i18n**: Multi-language support (English/Amharic)
- **assessment-engine**: Psychological assessment processing
- **analytics**: Real-time user behavior tracking

## 7. Database and Migrations

The **supabase/** directory contains **15 SQL files** for database schema management:

```
supabase/ (15 files)
├── complete-database-setup.sql   # Complete schema setup
└── migrations/ (14 files)
    ├── 001_create_users_table.sql                 # User accounts
    ├── 002_create_interactions_table.sql          # User interactions
    ├── 003_create_tool_usage_table.sql            # Tool usage tracking
    ├── 004_create_content_engagement_table.sql    # Content engagement
    ├── 005_create_lead_scores_table.sql           # Lead scoring data
    ├── 006_create_rls_policies.sql                # Row Level Security
    ├── 007_create_webinars_table.sql              # Webinar system
    ├── 008_create_webinar_rls_policies.sql        # Webinar security
    ├── 009_create_office_visits_table.sql         # Office booking
    ├── 010_create_office_visit_rls_policies.sql   # Booking security
    ├── 011_create_soft_membership_tables.sql      # Membership system
    ├── 012_create_performance_metrics_table.sql   # Performance data
    ├── 013_create_content_reviews_table.sql       # Content review
    └── 014_create_ab_testing_tables.sql           # A/B testing data
```

### Database Features:
- **PostgreSQL** with Supabase backend
- **Row Level Security (RLS)** for data protection  
- **Real-time subscriptions** for live updates
- **Comprehensive audit trails** for user actions
- **Optimized indexes** for performance

## 8. Serverless Functions

The **netlify/** directory contains **20 serverless functions** for backend processing:

```
netlify/functions/ (20 files)
├── analytics-dashboard.ts         # Analytics processing
├── automated-reporting.ts         # Report generation
├── capture-user-info.ts           # User data capture
├── continuous-education-delivery.ts # Education content
├── encrypt-sensitive-data.ts      # Data encryption
├── lead-scoring-analytics.ts      # Lead scoring
├── office-visit-confirmation.ts   # Booking confirmations
├── office-visit-reminder.ts       # Booking reminders
├── process-assessment.ts          # Assessment processing
├── process-email-queue.ts         # Email queue management
├── process-email-sequences.ts     # Email automation
├── realtime-notifications.ts     # Push notifications
├── track-interaction.ts           # Interaction tracking
├── track-performance.ts           # Performance monitoring
├── track-user-journey.ts          # User journey analysis
├── track-webinar-attendance.ts    # Webinar analytics
├── trigger-email-sequence.ts      # Email triggers
├── trigger-webinar-email.ts       # Webinar emails
├── update-engagement-score.ts     # Engagement scoring
└── update-lead-score.ts           # Lead score updates
```

### Serverless Features:
- **Netlify Functions** runtime
- **Event-driven processing** for scalability
- **Automated email workflows** with triggers
- **Real-time analytics** processing
- **Background job processing** for performance

## 9. Configuration Files

**28 configuration files** manage different aspects of the project:

```
Configuration Files:
├── next.config.ts                 # Next.js framework config
├── tailwind.config.ts             # CSS framework config  
├── tsconfig.json                  # TypeScript compiler
├── eslint.config.mjs              # Code linting rules
├── jest.config.js                 # Testing framework
├── cypress.config.ts              # E2E testing
├── postcss.config.mjs             # CSS processing
├── components.json                # UI component config
├── netlify.toml                   # Deployment config
├── package.json                   # Dependencies & scripts
├── sentry.client.config.js        # Error tracking (client)
├── sentry.server.config.js        # Error tracking (server)
└── [Additional configs]           # Logs, build files, etc.
```

## 10. Testing Structure

**19 test files** ensure code quality and reliability:

```
Testing Files:
├── cypress/ (6 files)             # E2E testing
│   └── e2e/
│       ├── conversion/ (2 files)   # Conversion testing
│       └── integration/ (4 files)  # Integration tests
├── src/lib/__tests__/ (16 files)  # Unit & integration tests
│   ├── a11y/accessibility.test.tsx          # Accessibility
│   ├── integration/ (4 files)               # Integration tests
│   ├── performance/performance.test.tsx     # Performance tests
│   ├── security/ (2 files)                 # Security tests
│   └── unit/ (4 files)                     # Unit tests
├── __mocks__/ (3 files)           # Test mocks
├── jest.config.js & jest.setup.js # Test configuration
└── verify-tests.js                # Test verification
```

## 11. Build and Scripts

**18 automation scripts** handle development and deployment:

```
scripts/ (18 files)
├── comprehensive-lint-fix-final.js    # Advanced linting fixes
├── comprehensive-lint-fix-ultimate.js # Ultimate lint cleanup
├── comprehensive-lint-fix.js          # General lint fixes
├── final-lint-cleanup.js              # Final cleanup
├── fix-lint-errors-targeted.js        # Targeted fixes
├── fix-lint-errors.js                 # Error fixes
├── fix-react-escaping.js              # React-specific fixes
├── fix-specific-lint-issues.js        # Specific issue fixes
├── fix-test-assertions.js             # Test assertion fixes
├── fix-test-files.js                  # Test file fixes
├── run-integration-tests.js           # Integration test runner
├── run-tests.js                       # Test runner
├── safe-lint-fix.js                   # Safe lint fixes
├── seed-webinars.js                   # Database seeding
├── setup-database.js                  # Database setup
├── setup-monitoring.js               # Monitoring setup
├── setup-supabase-backups.js         # Backup configuration
└── targeted-lint-fix.js               # Targeted fixes
```

## 12. Public Assets

**13 static files** for frontend resources:

```
public/ (13 files)
├── manifest.json                  # PWA manifest
├── sw.js                          # Service worker
├── offline.html                   # Offline page
├── workbox-4754cb34.js           # PWA workbox
├── icon-192x192.png              # PWA icon (small)
├── icon-512x512.png              # PWA icon (large)
├── testimonial-poster.jpg         # Video poster
├── testimonial-video.mp4          # Testimonial video
├── file.svg                       # File icon
├── globe.svg                      # Globe icon
├── next.svg                       # Next.js logo
├── vercel.svg                     # Vercel logo
└── window.svg                     # Window icon
```

## 13. File Count Summary

**Exact file counts for Galaxy Kiro project (excluding node_modules, .git, .next):**

| Directory | Files | Description |
|-----------|-------|-------------|
| **Root** | 28 | Configuration, documentation, build files |
| **src/** | 332 | **Total source code** |
| ├── app/ | 130 | Next.js pages, API routes, layouts |
| ├── components/ | 137 | React components (UI, admin, tools) |
| ├── lib/ | 60 | Utilities, services, business logic |
| ├── config/ | 1 | Application configuration |
| ├── constants/ | 1 | Application constants |
| ├── hooks/ | 2 | Custom React hooks |
| └── types/ | 2 | TypeScript type definitions |
| **supabase/** | 15 | Database schema and migrations |
| **netlify/** | 20 | Serverless functions |
| **scripts/** | 18 | Build and automation scripts |
| **public/** | 13 | Static assets and PWA files |
| **cypress/** | 6 | End-to-end test files |
| **__mocks__/** | 3 | Test mock files |
| **docs/** | 2 | Documentation files |
| **TOTAL** | **459** | **Complete project files** |

### File Type Breakdown:
- **TypeScript/React (.ts/.tsx)**: 393 files (86% of source code)
- **JavaScript (.js/.jsx)**: 143 files  
- **SQL (.sql)**: 15 files
- **JSON (.json)**: 37 files
- **CSS (.css)**: 2 files
- **Markdown (.md)**: 10 files
- **Images & Assets**: ~25 files

## 14. Architecture Patterns

Galaxy Kiro follows **modern full-stack architecture patterns**:

### **Frontend Architecture:**
- **Next.js 13+ App Router** - File-based routing with layouts
- **Component-Driven Development** - Reusable, testable components
- **TypeScript-First** - Type safety throughout the application
- **Server-Side Rendering (SSR)** - SEO optimization and performance
- **Progressive Web App (PWA)** - Offline support and mobile experience

### **Backend Architecture:**
- **API Routes** - Next.js API endpoints for backend logic
- **Serverless Functions** - Netlify Functions for scalable processing
- **Database-First Design** - PostgreSQL with Supabase backend
- **Row Level Security (RLS)** - Fine-grained data access control

### **State Management:**
- **Zustand Store** - Lightweight state management
- **Server State** - Supabase real-time subscriptions
- **Form State** - React Hook Form with Zod validation
- **Context API** - Authentication and theme context

### **Design Patterns:**
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Component and service creation
- **Observer Pattern** - Real-time updates and tracking
- **Strategy Pattern** - A/B testing and personalization
- **Facade Pattern** - Complex API simplification

### **Performance Patterns:**
- **Code Splitting** - Route-based and component-based
- **Lazy Loading** - Dynamic imports for large components
- **Image Optimization** - Next.js Image component
- **Caching Strategy** - Static generation with ISR

## 15. Naming Conventions

Galaxy Kiro follows **consistent naming conventions** across the codebase:

### **File Naming:**
- **Pages**: `kebab-case` (e.g., `user-profile.tsx`)
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Utilities**: `kebab-case` (e.g., `lead-scoring-engine.ts`)
- **API Routes**: `kebab-case` with `route.ts` (e.g., `capture-user-info/route.ts`)
- **Test Files**: `*.test.ts` or `*.spec.ts`

### **Directory Structure:**
- **Feature-based** organization in components
- **Route-based** organization in app directory
- **Domain-based** organization in lib directory
- **Type-based** organization in public assets

### **Variable Naming:**
- **camelCase** for variables and functions
- **PascalCase** for components and classes
- **SCREAMING_SNAKE_CASE** for constants
- **kebab-case** for CSS classes and IDs

### **Component Patterns:**
- **Container/Presentational** separation
- **Higher-Order Components (HOCs)** for cross-cutting concerns
- **Render Props** for flexible component composition
- **Custom Hooks** for reusable stateful logic

### **API Conventions:**
- **RESTful** endpoint design
- **HTTP status codes** for response types
- **Consistent error handling** across all endpoints
- **TypeScript interfaces** for request/response types

### **Database Conventions:**
- **snake_case** for table and column names
- **Descriptive foreign keys** with `_id` suffix
- **Timestamps** with `created_at` and `updated_at`
- **Soft deletes** with `deleted_at` column

---

*This document is auto-generated and maintained to provide a complete overview of the Galaxy Kiro project structure.*