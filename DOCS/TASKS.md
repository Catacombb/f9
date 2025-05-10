# Application Implementation Tasks

This document outlines the phased implementation plan to enhance the Design Brief application from its current frontend-only state to a full-stack solution using Supabase. It is based on the current application status documented in `DOCS/current_app_status.md` and the target features in `DOCS/improvements.md`.

---

## Phase 0: Project Setup & Foundational Supabase Integration
*Goal: Prepare the project for Supabase and establish initial, basic connectivity.*

- [x] **Project Setup**:
    - [x] Install Supabase SDKs (`@supabase/supabase-js`, `@supabase/ssr`).
    - [x] Ensure Supabase project is active and accessible (URL, anon key).
    - [x] Configure Supabase environment variables in `.env` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- [x] **Basic Supabase Client**:
    - [x] Create `src/lib/supabase/client.ts` with a basic (non-SSR) Supabase client instance.
- [x] **Initial Database Schema**:
    - [x] In Supabase Studio (SQL Editor), create the `user_profiles` table:
        ```sql
        CREATE TABLE public.user_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
          role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
          full_name TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        -- Enable RLS
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ```
    - [x] In Supabase Studio, create the `briefs` table:
        ```sql
        CREATE TABLE public.briefs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          data JSONB DEFAULT '{}', -- For the existing form structure
          status TEXT DEFAULT 'draft',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_briefs_owner_id ON public.briefs(owner_id);
        -- Enable RLS
        ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
        ```
    - [x] Create a trigger function to automatically update `updated_at` on `user_profiles` and `briefs`.
        ```sql
        CREATE OR REPLACE FUNCTION public.handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER on_user_profiles_updated
          BEFORE UPDATE ON public.user_profiles
          FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

        CREATE TRIGGER on_briefs_updated
          BEFORE UPDATE ON public.briefs
          FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
        ```

---

## Phase 1: Core Brief Persistence
*Goal: Enable saving and loading of the existing design brief form data to Supabase.*

- [x] **Brief Service (`src/lib/supabase/services/briefService.ts`)**:
    - [x] Implement `createBrief(title: string, ownerId: string): Promise<{ id: string | null, error }>` (inserts new brief with default empty data).
    - [x] Implement `getBriefById(briefId: string): Promise<{ data: YourBriefDataType | null, error }>` (fetches a brief).
    - [x] Implement `updateBriefData(briefId: string, briefData: YourBriefDataType): Promise<{ error }>` (updates the `data` JSONB field).
    - [x] (Define `YourBriefDataType` based on the existing `DesignBriefContext` state structure).
    - [x] *Note: Temporarily using service role client (bypassing RLS) for Phase 1 testing due to 401 errors with anon role.*
- [x] **Context Integration (`src/context/DesignBriefContext.tsx`)**:
    - [x] Modify context to hold `currentBriefId`.
    - [x] On form initialization/load:
        - If a `briefId` is present (e.g., from URL for editing), call `briefService.getBriefById` and populate context state.
        - If no `briefId` (new brief scenario), context initializes with `initialState.ts`.
    - [x] Implement a `saveBrief()` function in the context:
        - If `currentBriefId` exists, call `briefService.updateBriefData`.
        - If no `currentBriefId` (first save of a new brief):
            - This needs a proper trigger, perhaps after basic info is filled. For now, `updateBriefData` will be the primary focus, assuming a brief record is created first (see Phase 3). Alternatively, handle create & first update.
- [x] **UI for Testing Persistence**:
    - [x] Temporarily add buttons or effects in `DesignBrief.tsx` to trigger save/load for testing. (Proper UI flow comes later).
    - [x] (No user association for briefs yet, can use a hardcoded `owner_id` from a test user in `user_profiles` for now if `owner_id` is NOT NULL).

---

## Phase 2: User Authentication with Supabase Auth (SSR)
*Goal: Implement secure user registration, login, and session management.*

- [x] **SSR Supabase Client**:
    - [x] Install `@supabase/ssr` package.
    - [x] Update `src/lib/supabase/client.ts` to use `createBrowserClient` and `createServerClient` from `@supabase/ssr` (refer to `improvements.md` for example).
- [x] **Auth UI Components (`src/components/auth/`)**:
    - [x] Create `Login.tsx`.
    - [x] Create `Register.tsx`.
    - [x] Create `ForgotPassword.tsx` (optional for first pass, can be added later).
- [x] **Auth Hook (`src/hooks/useSupabase.tsx`)**:
    - [x] Implement functions for `signIn`, `signUp`, `signOut`.
    - [x] Manage user session state (`user`, `isLoading`, `session`).
    - [x] Provide this context via a `SupabaseProvider` wrapping the app in `App.tsx` or `main.tsx`.
- [x] **Routing & Protection**:
    - [x] Create `src/components/auth/ProtectedRoute.tsx` to guard routes.
    - [x] Update `App.tsx` to include routes for `/login`, `/register`.
    - [x] Protect dashboard and design brief creation/editing routes using `ProtectedRoute`.
- [x] **User Profile Functionality**:
    - [x] After user registration (`signUp`), create a corresponding entry in `public.user_profiles` table (can be done via a Supabase Edge Function triggered on `auth.users` insert, or client-side after successful signup).
    - [x] Enhance registration to capture and store user's full name in profile.
- [x] **Brief Ownership**:
    - [x] When a new brief is created, associate it with the `auth.uid()` of the logged-in user as `owner_id`.
    - [x] Modify `briefService` methods to work with the authenticated user's ID where appropriate.
    - [x] Update the database schema to make `owner_id` column in `briefs` table required again (NOT NULL). *Note: In Phase 1, we temporarily made this column nullable to allow for testing without authentication.*
- [x] **Row Level Security (RLS) - Initial**:
    - [x] `user_profiles`:
        - Users can `SELECT` their own profile.
        - Users can `UPDATE` their own profile.
        - (Admins will be handled later).
    - [x] `briefs`:
        - Users can `SELECT` their own briefs.
        - Users can `INSERT` briefs with their `owner_id`.
        - Users can `UPDATE` their own briefs.
        - Users can `DELETE` their own briefs.
        - (Admins will be handled later).
- [ ] **Fix Infinite Loading Spinner Issue**:
    - [x] Implement the `is_admin()` RPC function (moved up from Phase 5).
    - [x] Add improved error handling and logging to auth flow.
    - [ ] Fix the remaining loading spinner issues in the ProtectedRoute component or BriefWrapper component.

---

## Phase 3: Client Dashboard & Brief Management
*Goal: Provide clients a view to manage their design briefs.*

- [ ] **Dashboard UI Components**:
    - [ ] Create `src/pages/DashboardPage.tsx`.
    - [ ] Create `src/components/dashboard/ClientDashboardView.tsx`.
    - [ ] `DashboardPage.tsx` should render `ClientDashboardView.tsx` if a non-admin user is logged in.
- [ ] **Client Dashboard Features (`ClientDashboardView.tsx`)**:
    - [ ] Fetch and display a list of briefs owned by the logged-in client (using `briefService.getUserBriefs(ownerId)` or similar).
        - Each brief should be a card/list item showing title, date, status.
    - [ ] "Create New Brief" button:
        - On click, potentially show a modal for brief `title`.
        - Call `briefService.createBrief(title, ownerId)`.
        - On success, redirect to `/design-brief/[briefId]` (the newly created brief's ID).
    - [ ] Edit Brief:
        - Link/button on each brief card to navigate to `/design-brief/[briefId]`.
    - [ ] Delete Brief:
        - Button on each brief card.
        - Show confirmation modal.
        - On confirm, call `briefService.deleteBrief(briefId)`.
        - Refresh the list of briefs.
- [ ] **Design Brief Page (`/design-brief/[briefId]`)**:
    - [ ] Modify this page (or its wrapper) to accept `briefId` from URL.
    - [ ] On load, fetch the brief data using `briefService.getBriefById(briefId)` and populate `DesignBriefContext`.
    - [ ] Ensure save operations in `DesignBriefContext` now use the `currentBriefId` to update the correct brief.

---

## Phase 4: File Uploads with Supabase Storage
*Goal: Integrate file uploads for various sections of the design brief.*

- [ ] **Database Schema for Files**:
    - [ ] Create `public.brief_files` table (as per `improvements.md` schema: `id`, `brief_id`, `category`, `bucket`, `path`, `size`, `mime`, `created_at`).
        ```sql
        CREATE TABLE public.brief_files (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE,
          category TEXT NOT NULL, -- e.g., 'inspiration', 'floorplan'
          bucket TEXT NOT NULL,
          path TEXT NOT NULL,
          size INT,
          mime TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_brief_files_brief_id ON public.brief_files(brief_id);
        ALTER TABLE public.brief_files ENABLE ROW LEVEL SECURITY;
        ```
- [ ] **Supabase Storage Setup**:
    - [ ] Create a storage bucket named `brief_uploads` in Supabase Studio.
    - [ ] Configure bucket policies (RLS for storage, as per `improvements.md`).
- [ ] **File Service Logic (in `briefService.ts` or a new `fileService.ts`)**:
    - [ ] Implement `uploadFileToBrief(briefId: string, category: string, file: File): Promise<{ data: BriefFileMetadata | null, error }>`
        - Uploads file to `brief_uploads/<userId>/<briefId>/<category>/<filename>`.
        - Inserts metadata into `brief_files` table.
    - [ ] Implement `getFilesForBrief(briefId: string, category?: string): Promise<{ data: BriefFileMetadata[] | null, error }>`
    - [ ] Implement `deleteFile(fileId: string): Promise<{ error }>` (deletes from storage and `brief_files` table).
- [ ] **Frontend Integration**:
    - [ ] Modify existing upload components (e.g., `src/components/uploads/InspirationsUploader.tsx`, `SiteDocumentsUploader.tsx`) to use the new file service.
    - [ ] Display uploaded files within the relevant brief sections.
    - [ ] Allow deletion of uploaded files.
- [ ] **RLS for `brief_files`**:
    - [ ] Users can CRUD files associated with their own briefs.
    - [ ] (Admins later).

---

## Phase 5: Admin Role & Dashboard
*Goal: Enable admin users to view and manage all design briefs.*

- [ ] **Admin Role & Access**:
    - [ ] Implement the `is_admin()` PostgreSQL function (as per `improvements.md`).
    - [ ] Update `useSupabaseAuth` hook (or similar) to include an `isAdmin` flag, possibly by calling the `is_admin()` RPC after login.
- [ ] **Admin Dashboard UI Components**:
    - [ ] Create `src/components/dashboard/AdminDashboardView.tsx`.
    - [ ] `DashboardPage.tsx` should now render `AdminDashboardView.tsx` if an admin user is logged in.
- [ ] **Admin Dashboard Features (`AdminDashboardView.tsx`)**:
    - [ ] Fetch and display ALL briefs from all clients (new method in `briefService.getAllBriefs()` - should join with `user_profiles` to show client name).
    - [ ] Admin should be able to view any brief's details (navigate to `/design-brief/[briefId]`).
    - [ ] (Optional based on requirements: Admin edit/delete capabilities for any brief).
- [ ] **RLS for Admin Access**:
    - [ ] `user_profiles`: Admins can `SELECT` all profiles.
    - [ ] `briefs`: Admins can `SELECT` all briefs. (Consider if `UPDATE`/`DELETE` needed).
    - [ ] `brief_files`: Admins can `SELECT` all brief files. (Consider if `DELETE` needed).
    - [ ] Use the `is_admin()` function in RLS policies for admin overrides.

---

## Phase 6: Autosave Implementation
*Goal: Automatically save brief form data periodically as the user types.*

- [ ] **Setup TanStack Query (React Query)**:
    - [ ] Install ` TanStack Query` (`@tanstack/react-query`).
    - [ ] Wrap the application with `QueryClientProvider` in `main.tsx` or `App.tsx`.
- [ ] **Autosave Hook (`src/hooks/useAutosave.ts`)**:
    - [ ] Implement the `useAutosave` hook as detailed in `improvements.md` (or a similar debounced approach using `useMutation` from TanStack Query).
    - [ ] This hook should call `briefService.updateBriefData` (or a more granular `briefService.updateBriefSection(briefId, sectionName, sectionData)`).
- [ ] **Integration with Design Brief Form**:
    - [ ] Integrate `useAutosave` into the `DesignBriefContext` or individual section components.
    - [ ] When form data changes in a section, the autosave hook should be triggered to persist that section's data to the `briefs.data` JSONB field.

---

## Phase 7: Advanced Features, Refinements & Testing
*Goal: Enhance the application with advanced functionalities and ensure stability.*

- [ ] **JSONB Schema Validation (Postgres)**:
    - [ ] Enable and configure `pg_jsonschema` extension in Supabase.
    - [ ] Define and apply a JSON schema constraint to the `briefs.data` column (as per `improvements.md`).
- [ ] **PDF Generation (If Required)**:
    - [ ] Confirm requirement for PDF generation.
    - [ ] If yes:
        - Install `jsPDF`, `html2canvas`.
        - Re-implement or create `src/utils/pdfGenerator/` logic.
        - Add "Download PDF" button to the brief view.
- [ ] **Theme Switching (If Required)**:
    - [ ] If dynamic themes are desired:
        - Install `next-themes`.
        - Correctly implement `src/components/ThemeProvider.tsx` using `next-themes`.
        - Add UI for theme selection.
- [ ] **Performance & Optimization**:
    - [ ] Review database queries for efficiency.
    - [ ] Ensure necessary indexes are in place (e.g., BRIN index on `briefs.updated_at`).
    - [ ] Optimize frontend rendering performance.
- [ ] **Security Hardening**:
    - [ ] Thoroughly review all RLS policies.
    - [ ] Validate all user inputs on both client and server (if server-side functions are added).
    - [ ] Check for common web vulnerabilities (XSS, CSRF if applicable).
- [ ] **Email Notifications (If Required)**:
    - [ ] Choose an email provider and integrate (e.g., Supabase Auth built-in, or external like SendGrid).
    - [ ] Implement email templates (consider `src/emailTemplates/` if restored).
    - [ ] Trigger emails for events like registration, password reset, brief submission confirmation.
- [ ] **Testing**:
    - [ ] Write unit tests for services and complex components.
    - [ ] Conduct end-to-end testing of all user flows (client and admin).
- [ ] **UI/UX Polish**:
    - [ ] Review and refine the user interface and experience.
    - [ ] Ensure consistent styling and branding.
    - [ ] Address any remaining bugs.

---

## Phase 8: Deployment to Vercel
*Goal: Deploy the full-stack application to Vercel.*

- [ ] **Vercel Project Setup**:
    - [ ] Create a new project on Vercel.
    - [ ] Connect the Git repository to the Vercel project.
- [ ] **Supabase Integration with Vercel**:
    - [ ] Install the Supabase integration from the Vercel Marketplace.
    - [ ] Link the Vercel project to the Supabase project.
- [ ] **Environment Variables**:
    - [ ] Configure all necessary Supabase environment variables in Vercel settings (for Production, Preview, and Development environments):
        - `NEXT_PUBLIC_SUPABASE_URL` (or `VITE_SUPABASE_URL`)
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_ANON_KEY`)
        - `SUPABASE_SERVICE_ROLE_KEY` (if any server-side functions need elevated privileges - use with caution).
- [ ] **Build & Deployment Settings**:
    - [ ] Configure Vercel build settings for a Vite React application.
    - [ ] Ensure the correct output directory is set.
- [ ] **Custom Domains (If Applicable)**:
    - [ ] Configure custom domains in Vercel.
- [ ] **Testing Deployments**:
    - [ ] Test Vercel's Preview Deployments for branches/PRs.
    - [ ] Test Production Deployment thoroughly.
- [ ] **Review Vercel Logs & Analytics**:
    - [ ] Monitor for any runtime errors or issues post-deployment.

--- 