# Current Application Status

## Overview

The current application is a Design Brief tool built with React, TypeScript, and Vite. It allows users to fill out a comprehensive design brief for construction or renovation projects. The application collects information across multiple sections including project details, budget, lifestyle preferences, site information, space requirements, and more. It also supports file uploads, PDF generation, and has a UI built with ShadCN UI components and Tailwind CSS. The application uses Supabase for authentication and data persistence, including backend functionality for a client onboarding dashboard.

## File Structure and Organization

### Root Structure
```
├── public/                      # Public static assets
├── src/                         # Source code
│   ├── __tests__/             # Vitest test files
│   ├── components/              # UI components
│   │   ├── auth/                # Authentication components (Login, Register, etc.)
│   │   ├── dashboard/           # Dashboard UI components (Currently Empty)
│   │   ├── sections/            # Design brief section components
│   │   └── ui/                  # UI components (ShadCN UI)
│   ├── context/                 # React context providers
│   ├── emailTemplates/          # Email templates
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Library code and utilities
│   │   └── supabase/            # Supabase client, schema, types, and services
│   ├── pages/                   # Page components
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
├── vitest.config.ts             # Vitest configuration
└── tsconfig.json                # TypeScript configuration
```

### Key Directory Contents

#### Components Structure
```
components/
├── auth/                        # Authentication components
│   ├── Login.tsx                # Login component
│   ├── Register.tsx             # Registration component
│   ├── ForgotPassword.tsx       # Password recovery
│   ├── ResetPassword.tsx        # Reset password
│   ├── ProtectedRoute.tsx       # Route protection HOC
│   └── index.ts                 # Export barrel
├── dashboard/                   # Dashboard components
│   ├── DashboardLayout.tsx      # Main dashboard layout
│   ├── DashboardSidebar.tsx     # Dashboard navigation sidebar
│   ├── DashboardHeader.tsx      # Dashboard header with user info
│   ├── AdminDashboard.tsx       # Admin dashboard container
│   ├── ClientDashboard.tsx      # Client dashboard container
│   ├── DashboardRouter.tsx      # Router for dashboard views
│   └── index.ts                 # Export barrel
├── sections/                    # Design brief sections
│   ├── ArchitectureSection.tsx
│   ├── BudgetSection.tsx
│   ├── CommunicationSection.tsx
│   ├── ContractorsSection.tsx
│   ├── FeedbackSection.tsx
│   ├── InspirationSection.tsx
│   ├── IntroSection.tsx
│   ├── LifestyleSection.tsx
│   ├── ProjectInfoSection.tsx
│   ├── SiteSection.tsx
│   ├── SpacesSection.tsx
│   ├── SummarySection.tsx
│   └── UploadsSection.tsx
├── ui/                          # UI components (ShadCN UI)
├── DesignBrief.tsx              # Main design brief component
├── DesignBriefLayout.tsx        # Layout for design brief
└── DesignBriefSidebar.tsx       # Sidebar navigation
```

#### Context Management
```
context/
├── DesignBriefContext.tsx       # Main context provider (Supabase integrated)
├── designBriefUtils.ts          # Utility functions for context
├── initialState.ts              # Initial state data
├── types.ts                     # Context type definitions
├── useFileAndSummaryManagement.ts # File and summary hooks (Supabase integrated)
├── useProfessionalsManagement.ts  # Professional management hooks
└── useRoomsManagement.ts        # Room management hooks
```

#### Supabase Integration
```
lib/supabase/
├── core_tables.sql              # Core database schema for design brief
├── dashboard_schema.sql         # SQL for dashboard schema extensions (status, roles, activities)
├── migrations.sql               # Additional SQL for RLS policies
├── fix_*.sql                    # SQL scripts for specific fixes (triggers, RLS recursion)
├── database.types.ts            # Generated database types (includes dashboard tables)
├── schema.ts                    # Supabase client initialization and core type exports
└── services/
    ├── projectService.ts        # Detailed project data service (save/load design brief)
    ├── statusService.ts         # Service for managing project statuses
    ├── roleService.ts           # Service for role-based access control
    ├── activitiesService.ts     # Service for logging and retrieving activities
    └── dashboardService.ts      # Service aggregating data for dashboards
```

#### Utility Functions
```
utils/
├── pdfGenerator/                # PDF generation utilities
│   ├── helpers.ts               # Helper functions
│   ├── index.ts                 # Main PDF generator
│   ├── layout.ts                # PDF layout functions
│   ├── types.ts                 # PDF generator types
│   └── sections/                # Section-specific PDF generators
└── testDataGenerator.ts         # Test data generation
```

#### Hooks
```
hooks/
├── use-mobile.tsx               # Mobile detection hook
├── use-toast.ts                 # Toast notification hook
└── useSupabase.tsx              # Supabase authentication hook (provides signIn, signUp, signOut)
```

#### Pages
```
pages/                           # Top-level page components
├── Index.tsx                    # Main landing page / entry point for the Design Brief
├── About.tsx                    # About page
├── TestSupabasePage.tsx         # Supabase connection test page
├── TestDashboardSchemePage.tsx  # Page for testing dashboard schema/services
└── NotFound.tsx                 # Catch-all 404 page
```

## Application Architecture

### Frontend Framework
- **React 18** with **TypeScript**
- **Vite** as the build tool and development server
- **React Router** for navigation with protected routes
- **TanStack Query** for data fetching and caching

### State Management
- Uses React Context API via `DesignBriefContext` for global state management of the design brief.
- State is organized into sections corresponding to the design brief sections.
- Custom hooks (`useRoomsManagement`, `useProfessionalsManagement`, `useFileAndSummaryManagement`) encapsulate specific state logic within the context.
- Context integrates with Supabase via `projectService.ts` for data persistence.

### UI Components
- **Tailwind CSS** for styling
- **ShadCN UI** component library
- Custom components for specific UI needs (Map, Sidebar, Sections, etc.)
- Theme hardcoded to 'light' via `ThemeProvider.tsx`, `next-themes` dependency not actively used for theme switching.

### Data Management
- Form data stored in `DesignBriefContext` and persisted to Supabase.
- File uploads handled by Supabase Storage.
- PDF generation using `jsPDF` and `html2canvas` via utility functions.

### Backend Integration
- **Supabase** (`@supabase/supabase-js`) for authentication and data storage.
- Supabase client initialized in `lib/supabase/schema.ts` using environment variables.
- `useSupabase.tsx` hook provides authentication functions (signIn, signUp, signOut) and manages session/user state.
- `projectService.ts` implements comprehensive data operations for creating, updating, and retrieving project data. **(Note: Contains bug in file loading)**
- Dashboard services (`statusService`, `roleService`, `activitiesService`, `dashboardService`) provide backend logic for dashboard features.
- Database schema includes tables (`user_profiles`, `activities`) and columns (`projects.status`) for dashboard functionality.
- Database triggers automate profile creation, project creation for clients, and activity logging for status changes.
- Row Level Security (RLS) policies ensure users can only access their own data, with specific admin overrides.

## Current Features

1. **Multi-section Design Brief Form**:
   - Project Information
   - Budget Information
   - Lifestyle & Occupants
   - Site Information
   - Spaces & Rooms
   - Architecture & Materials
   - Contractors & Professionals
   - Communication Preferences
   - Uploads
   - Summary
   - Feedback

2. **Interactive Elements**:
   - Room management (add, edit, remove)
   - Professional management (add, edit, remove)
   - File uploads
   - Map location selection

3. **PDF Generation**:
   - Complete PDF generation of the design brief using `jsPDF` and `html2canvas`.
   - Includes a `sendByEmail` (mailto) utility for the PDF.

4. **Data Persistence**:
   - Full Supabase integration for data persistence
   - Authentication required to save project data
   - File uploads stored in Supabase Storage
   - Auto-save functionality with debounce

5. **Authentication System**:
   - Complete authentication flow with login, registration, password recovery
   - Protected routes requiring authentication
   - Authentication state management with session persistence

6. **Dashboard Backend Functionality (Phase 1 & 2 Complete)**:
   - Database schema extended with `status` column in `projects`, `user_profiles` table (for roles), and `activities` table.
   - Core backend services implemented (`statusService`, `roleService`, `activitiesService`, `dashboardService`) providing logic for:
     - Project status transitions (Brief -> Sent -> Complete, with some flexibility)
     - User role checking (admin/client) and permission validation
     - Activity logging and retrieval (status changes, system events)
     - Data aggregation for potential dashboard views

## Missing/Incomplete Features

1. **Client Onboarding Dashboard UI (Phase 3 In Progress)**:
   - Basic dashboard layout components implemented (DashboardLayout, DashboardSidebar, DashboardHeader, AdminDashboard, ClientDashboard)
   - Project management UI components implemented (ProjectList, ProjectCard with filtering, sorting, and status management)
   - Statistics and visualization components implemented (StatusSummary, ActivityFeed, RecentClients)
   - Still needed:
     - Detail views for clients

2. **Client Portal UI (Phase 4 Not Started)**:
   - No dedicated client portal interface exists beyond the core design brief tool.

3. **Notifications (Phase 4/5 Not Started)**:
   - No notification system (in-app or email) for status changes or other events.

## Technical Debt and Observations

1.  **Critical Bug in `projectService.loadProject`**: The function fetches file metadata from `project_files` but fails to map it back into the `ProjectData.files` structure, preventing previously uploaded files from being displayed upon loading a project.
2.  **Redundant Activity Logging**: `statusService.changeProjectStatus` logs status changes directly, which is also handled by a database trigger (`handle_status_change`), potentially causing duplicate entries in the `activities` table. The trigger should likely be the sole source.
3.  **Duplicate Toaster Libraries**: `App.tsx` imports and renders both Shadcn's `Toaster` and `Sonner`. One should be chosen and consistently used.
4.  **Hardcoded Light Theme**: `ThemeProvider.tsx` forces a light theme, bypassing the installed `next-themes` dependency. Dark mode is effectively disabled.
5.  **Potentially Unused CSS/Code**: `App.css` contains boilerplate Vite styles that might be unused or conflict. `src/lib/animation.ts` duplicates the `cn` utility function from `src/lib/utils.ts`.
6.  **Service Join Syntax**: Some Supabase joins in services (e.g., fetching user role associated with an activity or project) use implicit relationship syntax (`user_profiles:user_id(role)`) that should be verified for correctness against the DB schema and Supabase relationship setup.
7.  **Vitest Migration**: Tests were migrated from Jest to Vitest, but some test failures might remain or require further refinement.

## Next Steps for Implementing Dashboard

Based on the current codebase and the implementation plan (`DOCS/tasks.md`), the next steps are:

1.  **Continue Dashboard UI Implementation (Phase 3)**:
    *   Basic layout components have been implemented (DashboardLayout, DashboardSidebar, DashboardHeader, AdminDashboard, ClientDashboard)
    *   Project management UI components have been implemented (ProjectList, ProjectCard, ProjectDetailPage)
    *   Statistics and visualization components have been implemented (StatusSummary with charts, ActivityFeed, RecentClients)
    *   Next priority: Build detail views
        * Create ProjectDetail view with comprehensive information
        * Build ClientDetail view with projects and activity
        * Implement project timeline component
        * Add document management UI for brief files

2.  **Fix `projectService.loadProject` Bug**: Correct the function to properly map loaded file metadata into the `ProjectData.files` object.
3.  **Address Other Technical Debt**:
    *   Remove redundant activity logging in `statusService`.
    *   Consolidate toaster usage.
    *   Decide on theme strategy (remove `next-themes` or implement theme switching properly).
    *   Clean up unused CSS/code.
    *   Verify service join syntax.
4.  **Implement Client Portal UI (Phase 4)**: Design and build the client-specific interface for viewing status and history.
5.  **Implement Notifications (Phase 4/5)**: Add real-time or other notification mechanisms.
6.  **Polish & Optimization (Phase 5)**: Refine UX, optimize performance, and conduct final reviews.

The application has a solid backend foundation for the dashboard; the main remaining work is building the user interface and addressing the identified technical debt, particularly the file loading bug. 