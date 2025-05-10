# Improvement Plan – Phase-2 (Backend, Auth & Dashboard)

This document translates the requirements outlined in the latest discussion into **an actionable, step-by-step plan**.  It complements `current_app_status.md`, bringing the project from a "pure-frontend demo" to a **full-stack, multi-tenant Design-Brief platform** backed by Supabase.

---
## 1. Objectives
1. Add **email / password authentication** via Supabase with SSR capabilities.
2. Introduce **role-based dashboards** (Admin vs. Client).  
   • Admins see _all_ briefs.  
   • Clients see _only their own_ briefs.  
   • All newly-registered users default to `client`; admins are assigned manually in the DB.
3. Enable **brief life-cycle management**: create, auto-save, edit, delete.
4. Persist all brief data (form fields **and** uploads) in **Postgres + Storage buckets**.
5. Implement reliable **autosave** (section-level granularity) with debounce & conflict-free updates.
6. Guarantee **no duplicates / race-conditions** (server-side constraints + optimistic UI).

---
## 2. High-Level Architecture
```
React (TS) SPA ─┬─> /auth/*         (public)
                ├─> /dashboard     (protected)
                └─> /design-brief/:id  (protected)

Supabase  ─┬─ Postgres
           ├─ Storage (bucket: brief_uploads)
           └─ Auth (email/password with SSR cookies)
```

* **Supabase JS SDK** + **@supabase/ssr** for cookie-based auth  
* **Row Level Security** with optimized query patterns for performance
* **TanStack Query** for client caching, mutations, and auto-refetching
* **Standard uploads** for small files, **TUS resumable uploads** for larger docs

---
## 3. Database Schema (SQL sketch)
```sql
-- 3.1  User profile & roles ---------------------------------------------
create table user_profiles (
  id uuid primary key references auth.users on delete cascade,
  role text default 'client' check (role in ('client','admin')),
  full_name text,
  created_at timestamptz default now()
);

-- 3.2  Brief -------------------------------------------------------------
create table briefs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references user_profiles(id) on delete cascade,
  title text not null,
  status text default 'draft', -- future use
  data jsonb default '{}',     -- autosaved form snapshot
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_briefs_owner_id on briefs(owner_id); -- performance optimization
create index idx_briefs_updated_at on briefs using brin(updated_at); -- for efficient sorting

-- 3.3  File metadata -----------------------------------------------------
create table brief_files (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs(id) on delete cascade,
  category text not null, -- e.g., 'inspiration', 'floorplan', etc.
  bucket text not null,
  path text not null, -- storage object path
  size int,
  mime text,
  created_at timestamptz default now()
);
create index idx_brief_files_brief_id on brief_files(brief_id);

-- 3.4 JSON Schema validation (using pg_jsonschema extension) ------------
create extension if not exists pg_jsonschema; -- validate brief data structure

alter table briefs add constraint validate_brief_data 
check (jsonb_matches_schema('{
  "type": "object",
  "properties": {
    "projectInfo": {"type": "object"},
    "budget": {"type": "object"},
    "lifestyle": {"type": "object"},
    "site": {"type": "object"},
    "spaces": {"type": "array"},
    "architecture": {"type": "object"},
    "contractors": {"type": "object"},
    "communication": {"type": "object"},
    "uploads": {"type": "object"},
    "summary": {"type": "object"}
  }
}', data));
```

### Row Level Security
```sql
-- Enable RLS on every table
alter table briefs enable row level security;
alter table brief_files enable row level security;
alter table user_profiles enable row level security;

-- User profile policies
create policy "Users can read own profile"
  on user_profiles for select
  using ((select auth.uid()) = id);
  
create policy "Users can update own profile"
  on user_profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Brief policies 
-- Client can read/write/delete own briefs
create policy "Client select own briefs" on briefs
  for select using ((select auth.uid()) = owner_id);
  
create policy "Client insert own briefs" on briefs
  for insert with check ((select auth.uid()) = owner_id);
  
create policy "Client update own briefs" on briefs
  for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
  
create policy "Client delete own briefs" on briefs
  for delete using ((select auth.uid()) = owner_id);

-- Brief file policies 
create policy "Client access own brief files" on brief_files
  using (exists (
    select 1 from briefs b where b.id = brief_id and b.owner_id = (select auth.uid())
  ));

-- Admin overrides - optimized to use security definer functions
create or replace function is_admin()
returns boolean
language plpgsql security definer
as $$
begin
  return exists (
    select 1 from user_profiles 
    where id = (select auth.uid()) 
    and role = 'admin'
  );
end;
$$;

create policy "Admin access all briefs" on briefs
  for all using ((select is_admin()));
  
create policy "Admin access all brief files" on brief_files
  for all using ((select is_admin()));
  
create policy "Admin access all profiles" on user_profiles
  for all using ((select is_admin()));
```

---
## 4. Storage Bucket Strategy
```
Bucket  : brief_uploads
Path    : <userId>/<briefId>/<category>/<filename>.<ext>
Public? : false (signed URLs)
```
* Category-based organization (inspiration, floorplan, site, etc.)
* Automatic metadata tracking in `brief_files` table
* Optimized bucket policies using RLS
* File size handling:
  * Small files (<6MB): standard uploads
  * Large files (>6MB): TUS resumable uploads

### Storage RLS Policies
```sql
-- Set up storage RLS policies
insert into storage.buckets (id, name) values ('brief_uploads', 'brief_uploads');

-- Apply RLS to storage
create policy "User can upload files to own brief folders"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'brief_uploads' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

create policy "User can view files from own brief folders"
on storage.objects for select
to authenticated
using (
  bucket_id = 'brief_uploads' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

create policy "User can update files in own brief folders"
on storage.objects for update
to authenticated
using (
  bucket_id = 'brief_uploads' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

create policy "User can delete files in own brief folders"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'brief_uploads' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Admin storage RLS policy override
create policy "Admin access all files"
on storage.objects for all
to authenticated
using ((select is_admin()));
```

---
## 5. Supabase Setup
1. **Create project** in the Supabase dashboard.  
2. **Environment vars** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).  
3. **Run SQL** from §3 in the SQL Editor.  
4. **Enable extensions**:
   * `pg_jsonschema` for data validation
   * `pg_cron` for potential scheduled cleanups
5. **Create buckets** for file storage.
6. **Admin setup**:
   ```sql
   -- Run after first admin user signs up
   update user_profiles set role='admin' where id='<auth-user-id>';
   ```

---
## 6. Front-end Implementation
| # | Feature | Key Files / Components |
|---|---------|------------------------|
| 1 | Supabase Client Setup | `src/lib/supabase/client.ts` - SSR-compatible client with cookie auth |
| 2 | Auth Components | `src/components/auth/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx` |
| 3 | Auth Hook | `src/hooks/useSupabase.tsx` - session, signIn, signUp, signOut |
| 4 | Protected Routes | `src/components/auth/ProtectedRoute.tsx` with role-based access |
| 5 | Brief Service | `src/lib/supabase/services/briefService.ts` - CRUD with JSONB handling |
| 6 | Dashboard | `src/components/dashboard/DashboardLayout.tsx`, `AdminDashboard.tsx`, `ClientDashboard.tsx` |
| 7 | Brief Management | `src/components/dashboard/BriefCard.tsx`, `BriefList.tsx` with optimal query strategies |

### 6.1 Supabase SSR Client (client.ts)
```typescript
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { type Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Browser client for client-side usage
export const createBrowserSupabaseClient = () => 
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Server client for SSR scenarios
export const createServerSupabaseClient = (
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options: any) => void;
  }
) => 
  createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    { cookies: cookies }
  );
```

### 6.2 Auth Hook (useSupabase.tsx)
```typescript
import { useEffect, useState, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();

export interface SupabaseContextProps {
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is admin
        const { data, error } = await supabase.rpc('is_admin');
        setIsAdmin(!!data);
      }
      
      setIsLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data?.session) {
      // Check if user is admin
      const { data: isAdminData } = await supabase.rpc('is_admin');
      setIsAdmin(!!isAdminData);
    }
    
    return { data: data.session, error };
  };
  
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { data, error };
  };
  
  const signOut = async () => {
    setIsAdmin(false);
    return await supabase.auth.signOut();
  };
  
  const value = {
    signIn,
    signUp,
    signOut,
    user,
    isLoading,
    isAdmin,
  };
  
  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
```

### 6.3 BriefService (briefService.ts)
```typescript
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { BriefData, BriefFile } from '@/types/brief';

const supabase = createBrowserSupabaseClient();

export const briefService = {
  async create(title: string): Promise<{ id: string; error: Error | null }> {
    const { data, error } = await supabase
      .from('briefs')
      .insert({ 
        title, 
        data: {
          projectInfo: {},
          budget: {},
          lifestyle: {},
          site: {},
          spaces: [],
          architecture: {},
          contractors: {},
          communication: {},
          uploads: {},
          summary: {}
        }
      })
      .select('id')
      .single();
      
    return { id: data?.id, error };
  },
  
  async getById(id: string): Promise<{ data: BriefData | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, data, owner_id, created_at, updated_at, status')
      .eq('id', id)
      .single();
      
    return { data, error };
  },
  
  async getUserBriefs(): Promise<{ data: BriefData[]; error: Error | null }> {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, owner_id, created_at, updated_at, status')
      .order('updated_at', { ascending: false });
      
    return { data: data || [], error };
  },
  
  async getAllBriefs(): Promise<{ data: BriefData[]; error: Error | null }> {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, owner_id, created_at, updated_at, status, user_profiles(full_name)')
      .order('updated_at', { ascending: false });
      
    return { data: data || [], error };
  },
  
  async updateSection(id: string, section: string, sectionData: any): Promise<{ error: Error | null }> {
    const { data: existingBrief } = await supabase
      .from('briefs')
      .select('data')
      .eq('id', id)
      .single();
      
    if (!existingBrief) return { error: new Error('Brief not found') };
    
    const newData = {
      ...existingBrief.data,
      [section]: sectionData
    };
    
    const { error } = await supabase
      .from('briefs')
      .update({ 
        data: newData,
        updated_at: new Date()
      })
      .eq('id', id);
      
    return { error };
  },
  
  async delete(id: string): Promise<{ error: Error | null }> {
    // First, delete files from storage
    const { data: fileData } = await supabase
      .from('brief_files')
      .select('path, bucket')
      .eq('brief_id', id);
      
    if (fileData && fileData.length > 0) {
      for (const file of fileData) {
        await supabase
          .storage
          .from(file.bucket)
          .remove([file.path]);
      }
    }
    
    // Then delete the brief (cascade will handle brief_files table)
    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', id);
      
    return { error };
  },
  
  async uploadFile(briefId: string, category: string, file: File): Promise<{ data: BriefFile | null; error: Error | null }> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { data: null, error: new Error('Not authenticated') };
    
    // Create path: userId/briefId/category/filename
    const userId = userData.user.id;
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${userId}/${briefId}/${category}/${fileName}`;
    const bucket = 'brief_uploads';
    
    // Choose upload method based on file size
    let uploadResult;
    if (file.size <= 6 * 1024 * 1024) { // 6MB
      // Standard upload for small files
      uploadResult = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
    } else {
      // For larger files, would implement TUS resumable upload
      // This is simplified - actual implementation would use Uppy or similar
      uploadResult = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
    }
    
    if (uploadResult.error) {
      return { data: null, error: uploadResult.error };
    }
    
    // Record file metadata in the database
    const { data, error } = await supabase
      .from('brief_files')
      .insert({
        brief_id: briefId,
        category,
        bucket,
        path: filePath,
        size: file.size,
        mime: file.type
      })
      .select()
      .single();
      
    return { data, error };
  },
  
  async getFiles(briefId: string): Promise<{ data: BriefFile[]; error: Error | null }> {
    const { data, error } = await supabase
      .from('brief_files')
      .select('*')
      .eq('brief_id', briefId);
      
    if (data) {
      // Add signed URLs to the files
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from(file.bucket)
            .createSignedUrl(file.path, 3600); // 1 hour expiry
            
          return {
            ...file,
            url: urlData?.signedUrl
          };
        })
      );
      
      return { data: filesWithUrls, error };
    }
    
    return { data: [], error };
  }
};
```

### 6.4 Optimized Autosave Hook
```typescript
import { useRef, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { briefService } from '@/lib/supabase/services/briefService';

export function useAutosave<T>(
  briefId: string,
  section: string, 
  data: T, 
  debounceMs: number = 1500
) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  
  // Setup mutation for updating the section
  const mutation = useMutation({
    mutationFn: (newData: T) => briefService.updateSection(briefId, section, newData),
    onSuccess: () => {
      // Invalidate and refetch the brief query if needed
      queryClient.invalidateQueries({ queryKey: ['brief', briefId] });
    }
  });
  
  // Debounced save effect
  useEffect(() => {
    // Skip the initial effect call or if data hasn't changed
    if (JSON.stringify(previousDataRef.current) === JSON.stringify(data)) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      mutation.mutate(data);
      previousDataRef.current = data;
    }, debounceMs);
    
    // Cleanup on unmount or when data changes again
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, briefId, section]);
  
  // Function to force immediate save
  const saveImmediately = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
      mutation.mutate(data);
      previousDataRef.current = data;
    }
  };
  
  return {
    isSaving: mutation.isPending,
    error: mutation.error,
    saveImmediately
  };
}
```

---
## 7. User Flow & Navigation
```
1. [Visitor] ─→ /auth/login 
           │
           └─→ /auth/register
           
2. [Login Success] ─→ Check user role in JWT
                   │
                   ├─→ [Admin] ─→ /dashboard (Admin Dashboard)
                   │
                   └─→ [Client] ─→ /dashboard (Client Dashboard)
                   
3. [Dashboard] ─→ "Create Brief" button ─→ Create brief in DB ─→ Redirect to /design-brief/:id
              │
              └─→ Brief card ─→ Click to edit ─→ /design-brief/:id
                            └─→ Delete button ─→ Delete confirmation modal ─→ Delete brief + files
                            
4. [Design Brief] ─→ Fill form pages ─→ Autosave (1500ms debounce) ─→ Persist to Supabase
                 │
                 └─→ Upload files ─→ Store in Supabase Storage ─→ Track in brief_files
                 │
                 └─→ "Save & Exit" ─→ Dashboard
```

---
## 8. Performance & Optimization Strategies
1. **RLS Performance**:
   * Use `(select auth.uid())` instead of direct `auth.uid()` in RLS policies
   * Optimize joins in RLS using `security definer` functions
   * Maintain proper indexes on filter columns (`owner_id`, etc.)
   * Add role to `TO authenticated` clauses for efficiency

2. **Storage**:
   * Use standard uploads for small files (<6MB)
   * Consider TUS resumable uploads for larger files
   * Include progress indicators for large file uploads
   * Implement file type validation

3. **JSONB Strategy**:
   * Store all brief data as a single JSONB document per brief
   * Use schema validation with `pg_jsonschema`
   * Update individual sections rather than the whole document
   * Create partial indexes on frequently queried JSONB fields

4. **Autosave**:
   * Implement optimized debouncing with refs (not useState)
   * Track previous data to prevent unnecessary updates
   * Use TanStack Query for caching and mutations
   * Add forced save on page navigation

5. **Concurrency**:
   * Set `updated_at` timestamp on every update
   * Use optimistic UI updates but validate with server response
   * Handle conflict errors gracefully in the UI
   * Consider using transactions for complex operations

---
## 9. Milestones & Timeline
| Week | Deliverable |
|------|-------------|
| 1 | **Foundation**: Set up Supabase project, implement schema, deploy storage buckets |
| 2 | **Auth System**: Implement auth components, SSR integration, protected routes |
| 3 | **Dashboard**: Create admin/client dashboards with role-based views |
| 4 | **Brief Management**: Develop brief creation, listing, deletion with proper RLS |
| 5 | **Form Integration**: Connect existing form to backend with autosave |
| 6 | **File Uploads**: Implement file upload/download with storage integration |
| 7 | **Testing & Hardening**: End-to-end testing, security review, performance optimizations |
| 8 | **Launch Preparation**: Final polish, documentation, deployment |

---
## 10. Security Considerations
1. **Auth & Authorization**:
   * Implement proper cookie-based auth with `@supabase/ssr`
   * Add robust role-based access control
   * Secure all routes with proper authentication checks

2. **Storage Security**:
   * Use signed URLs with short expirations for file access
   * Validate file types and sizes on upload
   * Implement proper bucket RLS policies

3. **Row-Level Security**:
   * All tables must have RLS enabled and policies defined
   * Optimize RLS with `security definer` functions where appropriate
   * Avoid using sensitive data in RLS policies

4. **Data Validation**:
   * Use JSON schema validation for JSONB data integrity
   * Implement server-side validation in addition to client-side
   * Sanitize all user inputs to prevent injection attacks

---

_This enhanced implementation plan provides a comprehensive blueprint for transforming the current frontend-only Design Brief application into a secure, multi-tenant platform with Supabase. The plan leverages Supabase's latest SSR auth capabilities, JSONB optimization techniques, and performance best practices to ensure a scalable and maintainable solution._

## 9. Vercel Deployment Strategy

Deploying this design brief application on Vercel provides significant advantages for a Supabase-backed application. Vercel's platform is optimized for React applications and has first-class integration with Supabase, making it an ideal hosting solution.

### 9.1 Vercel + Supabase Integration

Vercel offers a [native Supabase integration](https://vercel.com/integrations/supabase) that simplifies the deployment process by:

- Automatically syncing environment variables between Supabase and Vercel
- Setting up proper redirect URLs for authentication flows
- Providing IPv4 connections to Supabase (important since Supabase has moved to IPv6 but Vercel requires IPv4)
- Streamlining the local development workflow with CLI tools

### 9.2 Deployment Steps

1. **Repository Setup**:
   - Push the codebase to a GitHub repository
   - Connect the repository to Vercel

2. **Supabase Integration**:
   - Install the Supabase integration from Vercel's marketplace
   - Link the Supabase project to the Vercel project
   - Verify environment variables are correctly imported

3. **Environment Configuration**:
   - Set up additional environment variables for:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
     - Environment-specific variables (development, preview, production)

4. **Deployment Settings**:
   - Configure build settings for the application
   - Set up custom domains if necessary
   - Configure preview deployments for development branches

5. **CI/CD Pipeline**:
   - Vercel automatically creates preview deployments for pull requests
   - Production deployments trigger automatically on main branch merges

### 9.3 Storage and Infrastructure Considerations

Given this application's requirements for file uploads and storage, we'll utilize:

- **Supabase Storage**: For storing design documents, images, and file uploads
- **Vercel Edge Network**: For performant global content delivery
- **Supabase Database**: For all structured data with proper Row-Level Security

### 9.4 Optimizing for Vercel's Platform Limits

Vercel's free Hobby tier has [certain limitations](https://vercel.com/docs/limits), while the Pro tier expands these:

**Hobby Tier Limitations**:
- 100 deployments per day
- Function execution limit of 100 GB-Hrs per month
- Maximum of 1000 image optimizations per month

**Pro Tier Benefits** (recommended for production):
- Unlimited deployments
- Higher function execution limits (1000 GB-Hrs)
- Team collaboration features
- More generous bandwidth and storage allowances

For this application, the Pro tier is recommended due to the file upload/storage requirements and the need for team collaboration features.

### 9.5 Environment Variable Management

Since the application will handle sensitive authentication data and storage credentials:

1. Use Vercel's environment variable system to store:
   - Supabase credentials
   - API keys
   - Configuration settings

2. Utilize preview environments to segment variables by:
   - Development environment
   - Staging/testing
   - Production

3. Employ `.env.local` for local development via `vercel env pull`

### 9.6 Deploy Command Reference

```bash
# Deploy to development/preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables to local development
vercel env pull
```

By implementing this deployment strategy, we ensure the application is scalable, secure, and follows modern deployment best practices while leveraging the tight integration between Vercel and Supabase.
