# Application Implementation Tasks

**Last Updated**: 2024-06-24

This document outlines the phased implementation plan to enhance the Design Brief application from its current frontend-only state to a full-stack solution using Supabase. It is based on the current application status documented in `DOCS/current_app_status.md` and the target features in `DOCS/improvements.md`.

---

## Phase 0: Project Setup & Foundational Supabase Integration
*Goal: Prepare the project for Supabase and establish initial, basic connectivity.*

- [x] **Project Setup**:
    - [x] Install Supabase SDKs (`@supabase/supabase-js`, `@supabase/ssr`). (Verified in `package.json`)
    - [x] Ensure Supabase project is active and accessible (URL, anon key). (Assumed active for current development)
    - [x] Configure Supabase environment variables in `.env` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). (Presence of `.env` observed)
- [x] **Basic Supabase Client**:
    - [x] Create `src/lib/supabase/client.ts` with a Supabase client instance. (Verified, uses `createBrowserClient`)
- [x] **Initial Database Schema**:
    - [x] In Supabase Studio (SQL Editor), create the `user_profiles` table. (Assumed complete as per previous state, `roleService.ts` and `useStableAuth.tsx` interact with it)
    - [x] In Supabase Studio, create the `briefs` table. (Assumed complete, `briefService.ts` interacts with it)
    - [x] Create a trigger function to automatically update `updated_at` on `user_profiles` and `briefs`. (Assumed complete from previous state)

---

## Phase 1: Core Brief Persistence
*Goal: Enable saving and loading of the existing design brief form data to Supabase.*

- [x] **Brief Service (`src/lib/supabase/services/briefService.ts`)**:
    - [x] Implement `createBrief(title: string): Promise<{ id: string | null, error }>` (Verified, simplified, and takes `title`, derives `ownerId` from session).
    - [x] Implement `getBriefById(briefId: string): Promise<{ data: YourBriefDataType | null, error }>` (Verified).
    - [x] Implement `updateBriefData(briefId: string, briefData: YourBriefDataType): Promise<{ error }>` (Verified).
    - [x] (Define `YourBriefDataType` - assumed to be `FormData` from `@/types` as used in `briefService.ts`).
- [x] **Context Integration (`src/context/DesignBriefContext.tsx`)**:
    - [x] Modify context to hold `currentBriefId` (passed as prop `briefId` to `DesignBriefProvider` from `BriefWrapper`).
    - [x] On form initialization/load:
        - [x] If a `briefId` is present (from URL via `BriefWrapper` and `useParams`), context should load data using `briefService.getBriefById`.
        - [x] If no `briefId` (new brief scenario), context initializes with `initialState.ts` (Standard behavior for new brief).
    - [x] Implement a `saveBrief()` function in the context (or similar mechanism to trigger updates/creations using `briefService`).
- [ ] **UI for Testing Persistence**: (Considered partially done via `CreateBriefPage` and navigating to `/design-brief/:briefId`)
    - [ ] Ensure robust UI elements for explicitly saving changes if not relying solely on autosave (Phase 6).

---

## Phase 2: User Authentication with Supabase Auth
*Goal: Implement secure user registration, login, and session management.*

- [x] **Supabase Client for Auth**:
    - [x] `@supabase/ssr` package is installed.
    - [x] `src/lib/supabase/client.ts` uses `createBrowserClient`. (Server client usage might be for SSR/API routes if introduced later).
- [x] **Auth UI Components (`src/components/auth/`)**:
    - [x] Create `Login.tsx`. (Verified, uses `useStableAuth`)
    - [x] Create `Register.tsx`. (Verified, uses `useStableAuth`)
    - [ ] Create `ForgotPassword.tsx` (optional for first pass, can be added later).
- [x] **Auth Hook (`src/hooks/useStableAuth.tsx`)**:
    - [x] Implement functions for `signIn`, `signUp`, `signOut`. (Verified)
    - [x] Manage user session state (`user`, `session`, `isLoading`, `isAuthenticated`, `isAdmin`). (Verified)
    - [x] Provide this context via a `StableAuthProvider` wrapping the app in `App.tsx`. (Verified)
- [x] **Routing & Protection**:
    - [x] Create `src/components/auth/ProtectedRoute.tsx` to guard routes. (Verified, uses `useStableAuth`)
    - [x] Update `App.tsx` to include routes for `/login`, `/register`. (Verified)
    - [x] Protect dashboard (placeholder) and design brief creation/editing routes using `ProtectedRoute`. (Verified)
- [x] **User Profile Functionality**:
    - [x] After user registration (`signUp` in `useStableAuth`), create a corresponding entry in `public.user_profiles` table. (Verified in `useStableAuth.tsx`)
    - [x] Enhance registration to capture and store user's full name in profile. (Verified in `useStableAuth.tsx` and `Register.tsx`)
- [x] **Brief Ownership**:
    - [x] When a new brief is created (`briefService.createBrief`), associate it with the `owner_id` of the logged-in user (derived from session in `briefService`).
    - [x] Modify `briefService` methods to work with the authenticated user's ID where appropriate. (Implicitly handled by RLS and `owner_id` on insert)
    - [x] Ensure `owner_id` column in `briefs` table is NOT NULL. (Assumed as per schema definition)
- [x] **Row Level Security (RLS) - Initial**:
    - [x] `user_profiles` policies (assumed configured in Supabase based on previous functionality).
    - [x] `briefs` policies (assumed configured in Supabase based on previous functionality).
- [x] **Fix Infinite Loading Spinner Issue**:
    - [x] Implement the `is_admin()` RPC function (Verified, and `roleService.ts` created to call it).
    - [x] Add improved error handling and logging to auth flow. (Implemented in `useStableAuth` and components).
    - [x] Fix the remaining loading spinner issues in the `ProtectedRoute` component or `BriefWrapper` component. (Improvements made with safety timeouts, better state management, and caching)

---

## Phase 3: Client Dashboard & Brief Management
*Goal: Provide clients a view to manage their design briefs.*

- [x] **Dashboard UI Components**:
    - [x] Create functional `src/pages/DashboardPage.tsx` (Implemented with conditional rendering based on user role)
    - [x] Create `src/components/dashboard/ClientDashboardView.tsx` (Implemented with brief display and management functionality)
    - [x] `DashboardPage.tsx` renders `ClientDashboardView.tsx` if a non-admin user is logged in (Implemented)
- [x] **Client Dashboard Features (`ClientDashboardView.tsx`)**:
    - [x] Fetch and display a list of briefs owned by the logged-in client (using `briefService.getUserBriefs()`)
        - [x] Each brief shown as a card with title, date, status
    - [x] "Create New Brief" button:
        - [x] On click, navigates to `CreateBriefPage.tsx`
        - [x] On success, redirects to `/design-brief/[briefId]`
    - [x] Edit Brief:
        - [x] Link/button on each brief card to navigate to `/design-brief/[briefId]`
    - [x] Delete Brief:
        - [x] Button on each brief card
        - [x] Confirmation modal implemented
        - [x] On confirm, calls `briefService.deleteBrief(briefId)`
        - [x] List of briefs refreshes automatically
- [x] **Design Brief Page (`/design-brief/[briefId]`)**:
    - [x] Page and wrapper (`BriefWrapper` in `App.tsx`) accept `briefId` from URL
    - [x] On load, fetches brief data using `briefService.getBriefById(briefId)` and populates `DesignBriefContext`
    - [x] Save operations in context use the correct `briefId` to update the correct brief

---

## Phase 4: File Uploads with Supabase Storage
*Goal: Add persistent file storage for design inspiration photos, site plans, and supporting documents.*

- [x] **Database Schema Setup**:
    - [x] Create `brief_files` table with references to briefs and storage objects.
    - [x] Configure appropriate permissions (Row Level Security).
- [x] **Supabase Storage Configuration**:
    - [x] Create `brief_uploads` bucket.
    - [x] Set up appropriate security policies.
    - [x] Configure bucket for proper public file access.
- [x] **File Management Service**:
    - [x] Create `fileService.ts` in `src/lib/supabase/services/` to handle upload, download, and deletion operations.
    - [x] Add methods to `briefService.ts` for file operations.
- [x] **Frontend Integration**:
    - [x] Enhance `DesignBriefContext` with file upload and management methods.
    - [x] Update file upload components to use Supabase storage.
    - [x] Add file preview and delete capabilities.
    - [x] Implement client-side validations for file types and sizes.
- [x] **Error Handling and Security**:
    - [x] Add appropriate error handling for file operations.
    - [x] Ensure proper permissions checks.
    - [x] Sanitize file uploads.
- [x] **RLS Policy Fixes**:
    - [x] Configure storage objects INSERT policy to allow authenticated uploads.
    - [x] Set bucket to public for file previews to work correctly.

---

## Phase 5: Admin Role & Dashboard
*Goal: Enable admin users to view and manage all design briefs.*

- [x] **Admin Role & Access**:
    - [x] Implement the `is_admin()` PostgreSQL function. (Assumed done, `roleService.ts` calls it).
    - [x] Update `useStableAuth.tsx` hook to include an `isAdmin` flag by calling `is_admin()` RPC via `roleService.ts`. (Verified).
- [x] **Admin Dashboard UI Components**:
    - [x] Create `src/components/dashboard/AdminDashboardView.tsx`.
    - [x] `DashboardPage.tsx` (functional version) should render `AdminDashboardView.tsx` if an admin user is logged in.
- [x] **Admin Dashboard Features (`AdminDashboardView.tsx`)**:
    - [x] Fetch and display ALL briefs from all clients (using `briefService.getAllBriefs()`).
    - [x] Admin should be able to view any brief's details (navigate to `/design-brief/[briefId]`).
    - [x] (Optional based on requirements: Admin edit/delete capabilities for any brief).
- [x] **RLS for Admin Access** (Review and implement specific policies in Supabase Studio):
    - [x] `user_profiles`: Admins can `SELECT` all profiles.
    - [x] `briefs`: Admins can `SELECT` all briefs.
    - [x] `brief_files`: Admins can `SELECT` all brief files.

---

## Phase 6: Autosave Implementation
*Goal: Automatically save brief form data periodically as the user types.*

- [x] **Setup TanStack Query (React Query)**:
    - [x] Install `@tanstack/react-query`.
    - [x] Wrap the application with `QueryClientProvider`.
- [x] **Autosave Hook (`src/hooks/useAutosave.ts`)**:
    - [x] Implement a debounced autosave hook using TanStack Query `useMutation`.
    - [x] This hook calls `briefService.updateBriefData`.
- [x] **Integration with Design Brief Form**:
    - [x] Integrate `useAutosave` into `DesignBriefContext`.

---

## Phase 7: Advanced Features, Refinements & Testing
*Goal: Enhance the application with advanced functionalities and ensure stability.*

- [ ] **JSONB Schema Validation (Postgres)**:
    - [ ] Enable and configure `pg_jsonschema` extension.
    - [ ] Define and apply schema constraint to `briefs.data`.
- [ ] **PDF Generation (If Required)**:
    - [ ] Confirm requirement.
    - [ ] If yes:
        - Install `jsPDF`, `html2canvas` (Not currently in `package.json`).
        - Re-implement or create `src/utils/pdfGenerator/` logic.
        - Add UI for PDF download.
- [ ] **Theme Switching (If Required)**:
    - [ ] If dynamic themes are desired:
        - Install `next-themes` (Not currently in `package.json`).
        - Implement `src/components/ThemeProvider.tsx` using `next-themes`.
        - Add UI for theme selection.
- [ ] **Performance & Optimization**.
- [ ] **Security Hardening** (Review RLS, input validation).
- [ ] **Email Notifications (If Required)**.
- [ ] **Testing** (Unit and E2E).
- [ ] **UI/UX Polish**.

---

## Phase 8: Deployment to Vercel
*Goal: Deploy the full-stack application to Vercel.*

- [ ] **Vercel Project Setup**.
- [ ] **Supabase Integration with Vercel**.
- [ ] **Environment Variables in Vercel**.
- [ ] **Build & Deployment Settings**.
- [ ] **Custom Domains (If Applicable)**.
- [ ] **Testing Deployments**.
- [ ] **Review Vercel Logs & Analytics**.

--- 