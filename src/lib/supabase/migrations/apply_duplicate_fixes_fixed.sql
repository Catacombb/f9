-- COMPREHENSIVE FIXES FOR DUPLICATE PROJECT CREATION ISSUE
-- This script applies all fixes in the correct order to resolve duplicate project creation problems
-- FIXED VERSION: Handles existing policies properly by checking before creation

BEGIN;

-- =====================================================
-- PART 1: Disable automatic project creation in user registration trigger
-- =====================================================

-- Drop the existing trigger that auto-creates projects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new user registration handler that ONLY creates the profile (no automatic project)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a user profile with client role by default
  -- This is still needed but we no longer auto-create projects
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger with the simplified function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 2: Clean up existing duplicate projects
-- =====================================================

WITH ranked_projects AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rn
  FROM public.projects
),
deleted_projects AS (
  DELETE FROM public.projects
  WHERE id IN (
    SELECT id FROM ranked_projects WHERE rn > 1
  )
  RETURNING id, user_id
)
SELECT 
  'Deleted duplicate projects' as operation,
  COUNT(*) as deleted_count
FROM 
  deleted_projects;

-- =====================================================
-- PART 3: Fix get_or_create_project function to prevent admin project creation
-- =====================================================

-- Drop the existing function
DROP FUNCTION IF EXISTS get_or_create_project(UUID);

-- Re-create with admin check
CREATE OR REPLACE FUNCTION get_or_create_project(p_user_id UUID)
RETURNS TABLE(project_id UUID, is_new_project BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_project_id UUID;
  v_is_new_project BOOLEAN := FALSE;
  v_user_email TEXT;
  v_user_role TEXT;
BEGIN
  -- Start a transaction block
  BEGIN
    -- First check if user ID is valid
    IF p_user_id IS NULL THEN
      RAISE EXCEPTION 'User ID cannot be NULL';
    END IF;
  
    -- Check if this is an admin user - reject if admin
    SELECT role INTO v_user_role 
    FROM user_profiles 
    WHERE id = p_user_id;
    
    IF v_user_role = 'admin' THEN
      RAISE EXCEPTION 'Admin users cannot have projects';
    END IF;
  
    -- Try to get an existing project for the user
    SELECT id INTO v_project_id
    FROM public.projects
    WHERE user_id = p_user_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- If no project exists, create one
    IF v_project_id IS NULL THEN
      -- Get the user's email
      BEGIN
        -- Try to get the user's email safely
        SELECT email INTO v_user_email 
        FROM auth.users 
        WHERE id = p_user_id;
        
        -- If email is null, use the default
        IF v_user_email IS NULL THEN
          v_user_email := 'New Client';
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          -- Keep default value on any error
          v_user_email := 'New Client';
      END;
      
      -- Create a new project - ensure user_id is never NULL
      INSERT INTO public.projects (
        user_id,
        client_name,
        project_description,
        status,
        created_at,
        updated_at
      ) VALUES (
        p_user_id, -- This can't be NULL now due to our check above
        v_user_email,
        'Default project created via get_or_create_project function',
        'brief',
        NOW(),
        NOW()
      )
      RETURNING id INTO v_project_id;
      
      -- Mark as newly created
      v_is_new_project := TRUE;
      
      -- Log the project creation in activities
      INSERT INTO public.activities (
        project_id,
        user_id,
        activity_type,
        details,
        is_system_generated,
        created_at
      ) VALUES (
        v_project_id,
        p_user_id,
        'system_event',
        jsonb_build_object(
          'event', 'project_created',
          'message', 'Project created via get_or_create_project function'
        ),
        TRUE,
        NOW()
      );
    END IF;
    
    -- Return the project ID and creation status
    RETURN QUERY SELECT v_project_id, v_is_new_project;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error
      RAISE NOTICE 'Error in get_or_create_project: %', SQLERRM;
      RAISE;
  END;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_or_create_project(UUID) TO authenticated;

-- =====================================================
-- PART 4: Fix RLS Policies for Project Creation
-- =====================================================

-- Check and drop ALL existing project policies to ensure a clean slate
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  -- Loop through all policies for the projects table
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'projects'
    AND schemaname = 'public'
  LOOP
    -- Drop each policy
    EXECUTE format('DROP POLICY IF EXISTS %I ON projects', policy_record.policyname);
    RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
  END LOOP;
END $$;

-- Recreate ALL project policies from scratch
-- Base view policies
CREATE POLICY "Users can view their own projects" ON projects
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Admin view policy
CREATE POLICY "Admins can view all projects" ON projects
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin')));

-- Insert policies with proper role checking
CREATE POLICY "Users can insert their own projects" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'client'))
);

CREATE POLICY "Admins can create projects for clients only" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'))
  AND 
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = user_id) AND (user_profiles.role = 'client'))
);

-- Update policies
CREATE POLICY "Users can update their own projects" ON projects
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Delete policies
CREATE POLICY "Users can delete their own projects" ON projects
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Add policy comments
COMMENT ON POLICY "Users can insert their own projects" ON projects IS 
'Allows client users to create projects only for themselves. Prevents admin users from creating projects for themselves.';

COMMENT ON POLICY "Admins can create projects for clients only" ON projects IS 
'Allows admin users to create projects only for users with the client role. Prevents admin users from creating projects for other admins.';

-- =====================================================
-- PART 5: Verify and Report Results
-- =====================================================

-- Report final project counts by user
SELECT 
  'Current Project Counts Per User' as operation,
  u.email,
  COUNT(p.id) as project_count
FROM 
  auth.users u
LEFT JOIN
  public.projects p ON u.id = p.user_id
GROUP BY 
  u.email, u.id
ORDER BY 
  project_count DESC;

-- Check for any remaining users with multiple projects
SELECT 
  'Users Still With Multiple Projects' as operation,
  u.email,
  COUNT(p.id) as project_count,
  ARRAY_AGG(p.id) as project_ids
FROM 
  auth.users u
JOIN
  public.projects p ON u.id = p.user_id
GROUP BY 
  u.email, u.id
HAVING
  COUNT(p.id) > 1
ORDER BY 
  project_count DESC;

COMMIT; 