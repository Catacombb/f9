-- COMPREHENSIVE FIX FOR DUPLICATE BRIEF ISSUE
-- This script fixes the problem where creating one brief results in three briefs in the admin dashboard
-- It also addresses the NULL user_id error when testing the function

-- =====================================================
-- PART 1: Disable automatic project creation in trigger
-- =====================================================

-- First, drop the existing trigger that auto-creates projects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the existing function
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
-- PART 2: Fix the get_or_create_project function
-- =====================================================

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_or_create_project(UUID);

-- Recreate the function with proper NULL checks and error handling
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
    -- First check if user ID is valid
    IF p_user_id IS NULL THEN
      RAISE EXCEPTION 'User ID cannot be NULL';
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
      SELECT email INTO v_user_email 
      FROM auth.users 
      WHERE id = p_user_id;
      
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
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error
      RAISE NOTICE 'Error in get_or_create_project: %', SQLERRM;
      RAISE;
  END;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_or_create_project(UUID) TO authenticated;

-- =====================================================
-- PART 3: Clean up existing duplicate projects
-- =====================================================

-- This will keep the oldest project for each user and remove duplicates
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
-- PART 4: Report on current state
-- =====================================================

-- Report project counts by user
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

-- Report users with multiple projects (should be none after cleanup)
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