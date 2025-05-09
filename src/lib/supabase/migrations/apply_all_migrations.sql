-- Apply all migrations in order to resolve duplicate project issues

-- 1. First apply version column to enable optimistic locking
-- Add version column for optimistic locking
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Add comment for the version column
COMMENT ON COLUMN public.projects.version IS 'Version number for optimistic locking';

-- Update any existing projects to have version 1
UPDATE public.projects
SET version = 1
WHERE version IS NULL OR version < 1;

-- 2. Create the transactional project functions
-- Create an RPC function for atomic get-or-create project operations
CREATE OR REPLACE FUNCTION get_or_create_project(p_user_id UUID)
RETURNS TABLE(project_id UUID, is_new_project BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_project_id UUID;
  v_is_new_project BOOLEAN := FALSE;
  v_user_email TEXT;
BEGIN
  -- Start a transaction block
  BEGIN
    -- First try to get an existing project for the user
    SELECT id INTO v_project_id
    FROM public.projects
    WHERE user_id = p_user_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- If no project exists, create one
    IF v_project_id IS NULL THEN
      -- Get the user's email
      SELECT email INTO v_user_email 
      FROM auth.users 
      WHERE id = p_user_id;
      
      -- Create a new project
      INSERT INTO public.projects (
        user_id,
        client_name,
        project_description,
        status,
        created_at,
        updated_at
      ) VALUES (
        p_user_id,
        COALESCE(v_user_email, 'New Client'),
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
  END;
END;
$$;

-- Allow authenticated users to call this function
GRANT EXECUTE ON FUNCTION get_or_create_project(UUID) TO authenticated;

-- Create a function to clean up duplicate projects
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
    
    -- Delete all other projects for this user
    WITH deleted AS (
      DELETE FROM public.projects p
      WHERE 
        p.user_id = r.user_id AND
        p.id != v_kept_project_id
      RETURNING p.id
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;
    
    -- Return result for this user
    user_id := r.user_id;
    kept_project_id := v_kept_project_id;
    deleted_count := v_deleted_count;
    RETURN NEXT;
  END LOOP;
  
  RETURN;
END;
$$;

-- Allow only authenticated users to execute the cleanup function
REVOKE EXECUTE ON FUNCTION clean_duplicate_projects() FROM public;
GRANT EXECUTE ON FUNCTION clean_duplicate_projects() TO authenticated;

-- 3. Clean up existing duplicate projects
SELECT * FROM clean_duplicate_projects();

-- 4. Report the current state
SELECT
  user_id,
  COUNT(*) as project_count
FROM
  projects
GROUP BY
  user_id
HAVING
  COUNT(*) > 1;

-- 5. Fix the handle_new_user trigger
-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with correct syntax and duplicate prevention
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  project_id UUID;
  user_email TEXT;
  existing_project_count INTEGER;
BEGIN
  -- Create a user profile with client role by default
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'client');
  
  -- Get the user's email
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Check if the user already has projects
  SELECT COUNT(*) INTO existing_project_count
  FROM public.projects
  WHERE user_id = NEW.id;
  
  -- For client users, automatically create a default project
  -- Skip this for admin users who will be manually designated later
  -- Also skip if the user already has projects
  IF EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = NEW.id AND role = 'client'
  ) THEN
    -- Only create a project if the user doesn't already have one
    IF existing_project_count = 0 THEN
      -- Create a default project for the client
      INSERT INTO public.projects (
        user_id,
        client_name,
        project_description,
        status
      ) VALUES (
        NEW.id,
        COALESCE(user_email, 'New Client'),
        'Default project created on registration',
        'brief'
      )
      RETURNING id INTO project_id;
      
      -- Log the project creation in activities
      INSERT INTO public.activities (
        project_id,
        user_id,
        activity_type,
        details,
        is_system_generated
      ) VALUES (
        project_id,
        NEW.id,
        'system_event',
        jsonb_build_object(
          'event', 'project_created',
          'message', 'Project automatically created on user registration'
        ),
        TRUE
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 