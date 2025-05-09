-- Comprehensive fix for all identified issues
-- This script resolves admin access, file upload handling, and duplicate project issues

-- Part 1: First run the admin access policies to ensure they can see all data
-- Fix admin access to projects and related entities
-- Drop any existing overlapping policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can update all projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete all projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects for any user" ON projects;

-- Create policies that allow admins to access all projects
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert projects for any user" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Also add admin access policies for related entities like files, settings, etc.
DROP POLICY IF EXISTS "Admins can access all project data" ON project_settings;
DROP POLICY IF EXISTS "Admins can access all project data" ON rooms;
DROP POLICY IF EXISTS "Admins can access all project data" ON occupants;
DROP POLICY IF EXISTS "Admins can access all project data" ON professionals;
DROP POLICY IF EXISTS "Admins can access all project data" ON inspiration_entries;
DROP POLICY IF EXISTS "Admins can access all project data" ON project_files;
DROP POLICY IF EXISTS "Admins can access all project data" ON summaries;

-- Create policies for all project-related tables
CREATE POLICY "Admins can access all project data" ON project_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON occupants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON professionals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON inspiration_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON project_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON summaries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Make sure existing projects have the latest version field for optimistic locking
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Update any existing projects to have version 1
UPDATE public.projects
SET version = 1
WHERE version IS NULL OR version < 1;

-- Part 3: Apply the clean_duplicate_projects function with fixed ambiguous references
-- Drop the existing function first to ensure we're using the fixed version
DROP FUNCTION IF EXISTS clean_duplicate_projects();

-- Recreate the function with table aliases to avoid ambiguity
CREATE OR REPLACE FUNCTION clean_duplicate_projects()
RETURNS TABLE(user_id UUID, kept_project_id UUID, deleted_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
  v_deleted_count INTEGER;
  v_kept_project_id UUID;
BEGIN
  -- Find users with multiple projects
  FOR r IN 
    SELECT p.user_id, COUNT(*) as project_count
    FROM public.projects p
    GROUP BY p.user_id
    HAVING COUNT(*) > 1
  LOOP
    -- Get the oldest project (the one to keep)
    SELECT p.id INTO v_kept_project_id
    FROM public.projects p
    WHERE p.user_id = r.user_id
    ORDER BY p.created_at ASC
    LIMIT 1;
    
    -- Delete duplicate projects (all except the oldest)
    WITH deleted AS (
      DELETE FROM public.projects p
      WHERE p.user_id = r.user_id
      AND p.id != v_kept_project_id
      RETURNING p.id
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;
    
    -- Return the results
    user_id := r.user_id;
    kept_project_id := v_kept_project_id;
    deleted_count := v_deleted_count;
    RETURN NEXT;
  END LOOP;
  
  -- If no rows processed, return null
  IF NOT FOUND THEN
    RETURN;
  END IF;
END;
$$;

-- Part 4: IMPORTANT NOTE ABOUT STORAGE
/*
  The storage extension is required for file upload functionality.
  To enable it:
  1. Go to your Supabase dashboard (https://app.supabase.io)
  2. Select your project
  3. Navigate to "Database" → "Extensions"
  4. Find "storage" in the list of extensions
  5. Click the toggle switch to enable it
  
  Then run the following SQL separately to set up storage buckets:
  
  ---- Storage Setup SQL ----
  CREATE POLICY "Public Read Access" 
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND public = true);

  -- Project owners can access their own files
  CREATE POLICY "Project Owner Access"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'project-files' AND
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN auth.users u ON p.user_id = u.id
      WHERE 
        -- Extract the project ID from the storage path (format: fileType/projectId/filename)
        p.id::text = (storage.foldername(name))[2] AND
        p.user_id = auth.uid()
    )
  );

  -- Admin users can access all files
  CREATE POLICY "Admin Access"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'project-files' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

  -- Ensure RLS is enabled
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
*/ 