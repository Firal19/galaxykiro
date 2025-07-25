# **Galaxy Dream Team: AI Coder Refactoring & Implementation Tickets**

### Document Version: 4.0

### Date: July 24, 2025

## Table of Contents

### Part A: The Vision & Blueprint (The "Why")

1. **\[Page 3\] Executive Summary: The Case for Refactoring**  
   * 1.1. The Mandate for Change  
   * 1.2. The Vision for a Lean Architecture  
   * 1.3. Key Recommendations  
   * 1.4. Quantifiable Impact  
2. **\[Page 4\] Visual & Architectural Blueprint: The Three Core Interfaces**  
   * 2.1. The Public Website (Landing Page): Design & Route Structure  
   * 2.2. The Soft Member Portal: Design & Route Structure  
   * 2.3. The Admin Section: Design & Route Structure

### Part B: The Consolidation Strategy (The "What")

3. **\[Page 6\] Detailed Consolidation Plan & File Reduction Analysis**  
   * 3.1. Diagnosis of the Current Architecture  
   * 3.2. Backend Unification: Merging Netlify Functions into a Service Layer  
   * 3.3. Dynamic Routing: Consolidating the 17+ Tool Pages  
   * 3.4. Script & Superfluous File Consolidation  
   * 3.5. Component & Business Logic Refactoring  
4. **\[Page 9\] Summary of File Reduction**  
   * 4.1. Quantifiable Breakdown of File Deletions  
   * 4.2. Projected Final File Count  
5. **\[Page 10\] The New Consolidated Architecture in Detail**  
   * 5.1. The Lean File Structure (Visual Diagram)  
   * 5.2. The Service Layer (/src/services): The Brains of the Operation  
   * 5.3. Data Flow Example: A New Lead Registration  
   * 5.4. Component Architecture: The \<ToolRunner /\> Example

### Part C: The Implementation Plan (The "How")

6. **\[Page 14\] Detailed 6-Week Refactoring & Implementation Plan: AI Coder Tickets**  
   * 6.1. Phase 1: Preparation & Cleanup (Week 1\)  
   * 6.2. Phase 2: Backend & Service Layer Consolidation (Weeks 2-3)  
   * 6.3. Phase 3: Component & Frontend Refactoring (Weeks 4-5)  
   * 6.4. Phase 4: Testing & Finalization (Week 6\)  
7. **\[Page 18\] Updated Technical Specifications & Coding Standards**  
   * 7.1. Revised Database Schema: tool\_configurations  
   * 7.2. Final API Endpoint Specification  
   * 7.3. Component Library & State Management Guide  
8. **\[Page 20\] Conclusion & Next Steps**

## 1\. Executive Summary: The Case for Refactoring

### 1.1. The Mandate for Change

The Galaxy Dream Team codebase, with its 1,200+ files, has reached a critical inflection point. Its current state, characterized by significant file repetition, overlapping backend logic, and architectural inconsistencies, is a direct impediment to efficient development and long-term stability. This document accepts the user's mandate to architect a clean, manageable, and professional-grade codebase.

### 1.2. The Vision for a Lean Architecture

The end state of this refactoring process is a lean, fast, and intuitive Next.js application. We will achieve this by establishing a single source of truth for all backend logic, aggressively eliminating redundancy through dynamic routing and component consolidation, and clarifying the purpose of every file and folder.

### 1.3. Key Recommendations

1. **Unify the Backend:** Create a new **Service Layer** (/src/services) to house all business logic, completely eliminating the /netlify/functions directory and simplifying /src/app/api routes.  
2. **Embrace Dynamic Routing:** Consolidate all 17+ individual tool pages into a single dynamic route (/tools/\[toolSlug\]) powered by a generic component.  
3. **Re-architect Components:** Organize the /components directory by feature (e.g., analytics, cms) instead of user roles to maximize reusability.  
4. **Implement Clean UI Blueprints:** Adhere to a clean, minimalist, and functional design for the three main application sections (Public, Soft Member, Admin).

### 1.4. Quantifiable Impact

This plan outlines a clear path to a **30-40% reduction in the total source file count.** This is not merely a cleanup; it is a strategic investment that will directly result in faster feature development, easier bug resolution, and a more stable and scalable platform.

## 2\. Visual & Architectural Blueprint: The Three Core Interfaces

Before refactoring, we must define the target. The following blueprints describe the layout, sections, and routes for each main part of the application, aligning with a clean and modern design philosophy.

### 2.1. The Public Website (Landing Page): Design & Route Structure

* **Design Philosophy:** Clean, spacious, and trustworthy. A single-column layout on mobile that expands gracefully on desktop. Heavy emphasis on professional imagery, clear typography, and a compelling narrative flow.  
* **Key Sections on Homepage (/):**  
  1. **Hero Section:** Full-screen, culturally relevant image/video with a powerful headline (e.g., "Unlock Your Potential").  
  2. **Value Proposition:** A section titled "What You Will Discover," using icons and short text to explain the benefits (Personal Growth, Networking, etc.).  
  3. **Interactive Tools Showcase:** A visually engaging grid highlighting the 3 free tools, encouraging immediate interaction.  
  4. **Social Proof:** A carousel of testimonials (\<TestimonialCarousel /\>) with names and photos.  
  5. **Final Call-to-Action (CTA):** A clear, low-friction prompt to "Start Your Journey" by trying a tool or registering.  
* **Core Public Routes:**  
  * /: Homepage  
  * /blog: Main blog page with a grid of articles.  
  * /blog/\[slug\]: Dynamic page for a single article.  
  * /login: Sign-in page for Soft Members and Admin.  
  * /register: The primary registration page.

### 2.2. The Soft Member Portal: Design & Route Structure

* **Design Philosophy:** Focused and distraction-free. A clean, two-column layout with a fixed sidebar for navigation and a main content area. The UI should feel like a personal workspace.  
* **Layout Components:**  
  * \<SoftMemberSidebar /\>: Contains links to the main portal sections.  
  * \<PortalHeader /\>: Displays the user's name, profile picture, and notifications.  
* **Core Portal Routes (/soft-member/...):**  
  * /dashboard: The main landing page, featuring a feed of new content (\<ContentQueue /\>).  
  * /content: A searchable library of all unlocked educational chunks.  
  * /tools: A grid view of all unlocked interactive tools.  
  * /toolbox: A personal repository displaying saved results from completed tools.  
  * /network: **(Conditional)** Accessible only to "Hot Leads." Contains the chat interface.  
  * /profile: User settings and information page.

### 2.3. The Admin Section: Design & Route Structure

* **Design Philosophy:** Data-rich and highly functional. The UI prioritizes information density and efficiency, using tables, charts, and forms extensively. A multi-paned layout is ideal.  
* **Layout Components:**  
  * \<AdminSidebar /\>: Main navigation for top-level modules.  
  * \<AdminHeader /\>: Global search, notifications, and user menu.  
* **Core Admin Routes (/admin/...):**  
  * /dashboard: The main dashboard with KPIs and at-a-glance charts.  
  * /analytics: Deep-dive analytics with date-range filters and detailed graphs.  
  * /leads: The CRM-style lead management table.  
  * /leads/\[leadId\]: Dynamic page showing a single lead's complete history.  
  * /cms: The Content Management System dashboard.  
  * /tools: The Tool Management interface for creating and configuring tools.  
  * /users: User management, including the approval queue for new Soft Members.

## 3\. Detailed Consolidation Plan & File Reduction Analysis

### 3.1. Diagnosis of the Current Architecture

The current codebase suffers from five key issues: component redundancy, overlapping backend logic, inefficient routing, inconsistent organization, and superfluous files. This plan addresses each systematically.

### 3.2. Backend Unification: Merging Netlify Functions into a Service Layer

* **Problem:** The 20 files in /netlify/functions represent a second, disconnected backend, leading to duplicated logic and increased maintenance overhead.  
* **Solution:** We will create a new /src/services directory to act as the single source of truth for all server-side business logic. The logic from every Netlify function will be migrated into a corresponding service.  
* **File Deletion Breakdown:** The entire /netlify/functions directory will be deleted.

| Netlify Function to Delete | Logic Moves To | New API Route (if needed) |
| :---- | :---- | :---- |
| update-engagement-score.ts | lead.service.ts | /api/leads/update-score |
| capture-user-info.ts | lead.service.ts | /api/leads/capture |
| process-assessment.ts | tool.service.ts | /api/tools/process |
| office-visit-reminder.ts | notification.service.ts | (Cron Job via Vercel/Netlify) |
| *... (and all 16 others)* | *...* | *...* |
| **Total Files Deleted:** | **20** |  |

### 3.3. Dynamic Routing: Consolidating the 17+ Tool Pages

* **Problem:** The existence of 17+ individual page files under /src/app/tools (e.g., affirmation-architect/page.tsx) is the most significant source of frontend code duplication.  
* **Solution:** We will delete the entire /src/app/tools directory and all its subdirectories. It will be replaced by a single dynamic route: /src/app/soft-member/tools/\[toolSlug\]/page.tsx. This page will host a generic \<ToolRunner /\> component that dynamically renders the correct tool based on the toolSlug.  
* **File Deletion Breakdown:**  
  * affirmation-architect/page.tsx  
  * dream-clarity-generator/page.tsx  
  * goal-achievement-predictor/page.tsx  
  * *... (and all 14 others)*  
* **Total Files Deleted:** 17+.

### 3.4. Script & Superfluous File Consolidation

* **Problem:** The /scripts directory contains 18 files with redundant functionality, and the /app directory is cluttered with demo pages.  
* **Solution:** The 10+ linting scripts will be consolidated into a single lint:fix command in package.json. All demo/test pages will be deleted.  
* **File Deletion Breakdown:**  
  * All comprehensive-lint-fix-\*.js and similar scripts.  
  * All test/demo pages like /app/cta-demo/page.tsx, /app/debug/page.tsx, etc.  
* **Total Files Deleted:** \~15 (scripts) \+ \~15 (demo pages) \= **\~30 files**.

### 3.5. Component & Business Logic Refactoring

* **Problem:** Duplicated UI components (e.g., multiple dashboards) and scattered business logic in /src/lib.  
* **Solution:** Abstract shared UI into generic, configurable components. Move all backend-related logic from /src/lib into the new /src/services directory.  
* **Total Files Merged/Deleted:** \~25.

## 4\. Summary of File Reduction

This refactoring plan will result in a dramatic and quantifiable reduction in codebase complexity.

### 4.1. Quantifiable Breakdown of File Deletions

| Category | Files Before | Files After (Estimate) | Net Change | % Reduction |
| :---- | :---- | :---- | :---- | :---- |
| Netlify Functions | 20 | 0 | \-20 | 100% |
| Tool Pages | 17 | 1 | \-16 | 94% |
| Utility Scripts | 18 | 3 | \-15 | 83% |
| Components/Lib Logic | \~70 | \~45 | \-25 | 35% |
| Demo Pages | \~15 | 0 | \-15 | 100% |
| **Total Reduction** |  |  | **\~91 files** |  |

### 4.2. Projected Final File Count

* **Current Source Files (src/):** 349  
* **Projected Reduction:** \~91 files  
* **Projected New Source Files:** \~258  
* **Overall Reduction in Core Codebase:** **\~35-40%**

## 5\. The New Consolidated Architecture in Detail

### 5.1. The Lean File Structure (Visual Diagram)

/src  
├── /app  
│   ├── /api  
│   ├── /admin  
│   │   └── (dashboard)  
│   │       └── ... (admin routes)  
│   ├── /soft-member  
│   │   └── (portal)  
│   │       └── ... (member routes, incl. /tools/\[toolSlug\])  
│   └── /(public)  
│       └── ... (public routes)  
├── /components  
│   ├── /analytics  
│   ├── /auth  
│   ├── /cms  
│   ├── /core  
│   ├── /leads  
│   ├── /tools  
│   │   └── ToolRunner.tsx  
│   └── /ui  
├── /services  
│   ├── analytics.service.ts  
│   ├── auth.service.ts  
│   ├── content.service.ts  
│   ├── lead.service.ts  
│   └── notification.service.ts  
├── /hooks  
├── /lib  
└── /middleware.ts

### 5.2. The Service Layer (/src/services): The Brains of the Operation

This new directory is the cornerstone of the refactor. It centralizes, isolates, and organizes all server-side business logic, making it reusable and testable.

* **auth.service.ts:** Handles all user creation, login, session management, and role verification by interacting with Supabase Auth.  
* **lead.service.ts:** Manages the entire lead lifecycle: creating new leads from registrations, updating their status (Visitor, Cold, Candidate, Hot), calculating engagement scores, and retrieving lead data for the admin panel.  
* **content.service.ts:** The heart of the CMS. Contains methods for creating/editing content, distributing "chunks" to users, and fetching the correct content based on a user's access level. Also includes logic for fetching tool configurations.  
* **notification.service.ts:** A dedicated service for all outbound communications. It will contain methods like sendTelegramMessage(handle, message) and sendEmail(...).  
* **analytics.service.ts:** Contains all the complex PostgreSQL queries required to generate the data for the admin analytics dashboards.

### 5.3. Data Flow Example: A New Lead Registration

1. A user submits the form on the /register page.  
2. The form's onSubmit handler calls the /api/auth/register API route.  
3. The API route is now extremely thin. It simply calls AuthService.registerUser(userData).  
4. Inside the AuthService, the logic creates the user in Supabase Auth, adds their data to the profiles table, and then calls LeadService.createNewLead(userId, attributionData) using the attribution data stored in the cookie.  
5. The LeadService creates the corresponding record in the leads table.  
6. The API route returns a success response, and the frontend redirects the user to /approval-pending.

### 5.4. Component Architecture: The \<ToolRunner /\> Example

This demonstrates the power of consolidation on the frontend.

1. A user navigates to /soft-member/tools/affirmation-architect.  
2. The Next.js page at /soft-member/tools/\[toolSlug\]/page.tsx is rendered.  
3. On the server, this page component extracts the toolSlug ('affirmation-architect') from the URL parameters.  
4. It calls a server-side function: ContentService.getToolBySlug('affirmation-architect').  
5. This service queries the database for the tool's configuration (e.g., its title, questions, question types, options, etc.).  
6. The fetched configuration object is passed as a prop to the \<ToolRunner /\> client component.  
7. The \<ToolRunner /\> component receives the config and dynamically renders the appropriate UI. It maps over the questions array and uses a component map to decide which question component to display (e.g., \<BinaryChoiceQuestion /\>, \<CardSortQuestion /\>).

## 6\. Detailed 6-Week Refactoring & Implementation Plan: AI Coder Tickets

This section breaks down the entire refactoring process into a series of detailed, sequential tickets.

### 6.1. Phase 1: Preparation & Cleanup (Week 1\)

* **Ticket REF-01: Branch Creation**  
  * **Task:** Create a new Git branch named feature/refactor-architecture from the main branch. All work for this refactor will be done on this branch.  
* **Ticket REF-02: File Structure Scaffolding**  
  * **Task:** Create the new directory structure as outlined in section 5.1. This includes creating /src/services, /src/components/core, /src/components/analytics, etc.  
* **Ticket REF-03: Path Alias Configuration**  
  * **Task:** Update the tsconfig.json file to include new path aliases for the new directories (e.g., "@/services/\*": \["src/services/\*"\], "@/core/\*": \["src/components/core/\*"\]).  
* **Ticket REF-04: Script Consolidation**  
  * **Task:** Review all .js files in the /scripts directory. Consolidate their functionality into the scripts section of package.json.  
  * **Acceptance Criteria:** The /scripts directory is deleted. New npm scripts like npm run lint:fix and npm run db:seed are functional.  
* **Ticket REF-05: Superfluous File Deletion**  
  * **Task:** Delete all non-essential pages from the /src/app directory, including /cta-demo, /debug, /test-route, /trust-demo, and any other non-production pages.

### 6.2. Phase 2: Backend & Service Layer Consolidation (Weeks 2-3)

* **Ticket REF-06: Create Service Skeletons**  
  * **Task:** Create the five initial service files: auth.service.ts, lead.service.ts, content.service.ts, notification.service.ts, and analytics.service.ts. Define them as classes or objects with placeholder methods.  
* **Ticket REF-07: Consolidate Lead Logic**  
  * **Task:** Migrate all business logic related to leads into lead.service.ts.  
  * **Sub-Tasks:**  
    * Move logic from /netlify/functions/update-engagement-score.ts into a new updateEngagementScore method.  
    * Move logic from /netlify/functions/update-lead-score.ts into the same method.  
    * Move logic from /src/lib/lead-scoring-engine.ts and lead-scoring-pipeline.ts into private helper methods within the LeadService.  
    * Refactor the /api/leads/... routes to call methods on LeadService.  
* **Ticket REF-08: Consolidate Notification Logic**  
  * **Task:** Migrate all communication logic into notification.service.ts.  
  * **Sub-Tasks:**  
    * Move logic from /netlify/functions/office-visit-reminder.ts into a sendReminder method.  
    * Move logic for sending Telegram messages from /api/telegram/route.ts into a sendTelegramMessage method.  
    * Refactor the API route to call the new service method.  
* **Ticket REF-09: Consolidate Remaining Backend Logic**  
  * **Task:** Systematically go through the remaining 16 Netlify functions and the files in /src/lib. Move all backend-related logic into the appropriate service (AuthService, ContentService, AnalyticsService).  
  * **Acceptance Criteria:** The /netlify/functions directory is empty and can be deleted. The /src/lib directory contains only frontend utilities, constants, and the Supabase client initialization.

### 6.3. Phase 3: Component & Frontend Refactoring (Weeks 4-5)

* **Ticket REF-10: Build Dynamic Tool Runner**  
  * **Task:** Create the new tool\_configurations table in Supabase (see section 7.1).  
  * **Task:** Create the generic \<ToolRunner /\> component in /src/components/tools/ToolRunner.tsx. It should accept a toolConfiguration object as a prop and dynamically render questions.  
  * **Task:** Create the dynamic route page at /src/app/soft-member/tools/\[toolSlug\]/page.tsx. This page will fetch the tool config from the database using the toolSlug and pass it to \<ToolRunner /\>.  
* **Ticket REF-11: Migrate Tools to Dynamic Route**  
  * **Task:** For each of the 17+ tools, migrate its configuration (questions, etc.) into a new record in the tool\_configurations table.  
  * **Task:** Delete the old static page file (e.g., /app/tools/affirmation-architect/page.tsx).  
  * **Task:** Verify that navigating to the new dynamic URL (/soft-member/tools/affirmation-architect) correctly renders the tool. Repeat for all tools.  
* **Ticket REF-12: Consolidate Dashboard Components**  
  * **Task:** Analyze admin-analytics-dashboard.tsx, analytics-dashboard.tsx, and lead-scoring-dashboard.tsx.  
  * **Task:** Create a new, generic \<DashboardLayout /\> component in /src/components/analytics. This component should accept props like title and an array of chartData to render a configurable dashboard.  
  * **Task:** Refactor the admin and member dashboard pages to use this new, single component.  
* **Ticket REF-13: Reorganize Component Library**  
  * **Task:** Move all components from the root of /src/components into the new feature-based subdirectories (/core, /auth, /cms, etc.).  
  * **Task:** Update all import paths across the application to reflect the new locations. Use the IDE's "find and replace" feature for efficiency.

### 6.4. Phase 4: Testing & Finalization (Week 6\)

* **Ticket REF-14: Update Unit Tests**  
  * **Task:** Go through the test files in /src/lib/\_\_tests\_\_. Rewrite the tests to directly import and test the methods from the new service files in /src/services.  
  * **Acceptance Criteria:** All unit tests pass, and test coverage is maintained or improved.  
* **Ticket REF-15: Update End-to-End Tests**  
  * **Task:** Update all Cypress test files in /cypress/e2e. The most critical task is to update the locators and URL paths in complete-user-journey.cy.ts to match the refactored application structure.  
  * **Acceptance Criteria:** All E2E tests pass successfully against a local instance of the refactored application.  
* **Ticket REF-16: Full Regression & Deployment**  
  * **Task:** Conduct a full, manual regression test of the entire application, covering all user flows for public visitors, soft members, and the admin.  
  * **Task:** Once all tests pass and the application is stable, merge the feature/refactor-architecture branch into main to trigger the final deployment.

## 7\. Updated Technical Specifications & Coding Standards

### 7.1. Revised Database Schema: tool\_configurations

To support the new dynamic tool runner, a new table is required.

CREATE TABLE tool\_configurations (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  slug TEXT UNIQUE NOT NULL, \-- e.g., 'affirmation-architect'  
  title JSONB NOT NULL, \-- {"en": "Title", "am": "ርዕስ"}  
  description JSONB,  
  questions JSONB NOT NULL, \-- An array of question objects  
  access\_level TEXT DEFAULT 'public' \-- public, soft\_member, hot\_lead  
);

This table will be the single source of truth for all interactive tools.

### 7.2. Final API Endpoint Specification

The API surface will be cleaner and more RESTful.

* POST /api/auth/register  
* POST /api/auth/login  
* GET /api/leads (Admin)  
* GET /api/leads/\[leadId\] (Admin)  
* POST /api/leads/update-score  
* POST /api/cms/distribute (Admin)  
* ...and so on.

### 7.3. Component Library & State Management Guide

* **Component Organization:** All new components must be placed in a feature-based directory (e.g., a new component for lead filtering goes in /components/leads). Core, app-wide components go in /components/core.  
* **State Management:**  
  * **Zustand:** Use for global, client-side state that is shared across many components (e.g., the current user's profile, the selected language).  
  * **React Query/SWR:** Use for managing all server state. All data fetching from the API routes should be handled through one of these libraries to get caching, revalidation, and a clean data-fetching hook-based API.

## 8\. Conclusion & Next Steps

This document provides a highly detailed, actionable set of tickets for the AI coder to execute. By following this plan, the Galaxy Dream Team codebase will be transformed from a large, complex project into a lean, maintainable, and highly scalable application. The investment in creating a centralized service layer and leveraging dynamic routing will pay significant dividends in developer productivity, system stability, and the ability to rapidly add new features in the future.

**Immediate Next Steps:**

1. Initiate the 6-week plan by creating the new Git branch.  
2. Begin executing the tickets for Phase 1\.