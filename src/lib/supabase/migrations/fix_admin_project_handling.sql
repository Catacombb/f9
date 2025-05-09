-- FIX FOR ADMIN PROJECT HANDLING
-- This script addresses the issue where admin users incorrectly have projects assigned to them
-- It ensures that only client users can have projects

-- =====================================================
-- PART 1: Remove projects associated with admin users
-- =====================================================

-- First, identify admin users with projects
WITH admin_users AS (
  SELECT u.id, u.email, p.id as project_id
  FROM user_profiles up
  JOIN auth.users u ON up.id = u.id
  JOIN projects p ON u.id = p.user_id
  WHERE up.role = 'admin'
)
-- Log which admin projects will be removed
SELECT 
  'Admin users with projects to be removed:' as operation,
  email,
  COUNT(project_id) as project_count,
  ARRAY_AGG(project_id) as project_ids
FROM 
  admin_users
GROUP BY 
  id, email;

-- Now delete projects associated with admin users
DELETE FROM projects
WHERE user_id IN (
  SELECT id 
  FROM user_profiles 
  WHERE role = 'admin'
);

-- =====================================================
-- PART 2: Update the get_or_create_project function to prevent admin project creation
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
-- PART 3: Create a function to verify each user has at most one project
-- =====================================================

-- Function to verify and report project counts
CREATE OR REPLACE FUNCTION check_project_counts()
RETURNS TABLE(
  email TEXT,
  project_count BIGINT,
  project_ids UUID[],
  created_at_timestamps TIMESTAMPTZ[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.email::TEXT, -- Cast to TEXT explicitly 
    COUNT(p.id) as project_count,
    ARRAY_AGG(p.id) as project_ids,
    ARRAY_AGG(p.created_at) as created_at_timestamps
  FROM 
    auth.users u
  JOIN
    public.projects p ON u.id = p.user_id
  JOIN
    user_profiles up ON u.id = up.id
  WHERE
    up.role != 'admin' -- Exclude admin users
  GROUP BY 
    u.id, u.email
  ORDER BY 
    project_count DESC;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Run the check function
SELECT * FROM check_project_counts();

-- =====================================================
-- PART 4: Create a verification view for easier debugging
-- =====================================================

CREATE OR REPLACE VIEW project_user_summary AS
SELECT 
  u.email,
  up.role,
  COUNT(p.id) AS project_count,
  ARRAY_AGG(p.id) AS project_ids,
  ARRAY_AGG(p.status) AS project_statuses,
  ARRAY_AGG(p.created_at) AS created_at_timestamps
FROM 
  auth.users u
LEFT JOIN
  user_profiles up ON u.id = up.id
LEFT JOIN
  projects p ON u.id = p.user_id
GROUP BY 
  u.id, u.email, up.role
ORDER BY 
  up.role, project_count DESC; 