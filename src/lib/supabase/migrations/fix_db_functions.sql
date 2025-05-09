-- Fix for database functions to ensure project creation works properly
-- This addresses the issue where pressing the "Create Brief" button doesn't create a project

-- First, ensure get_or_create_project function returns the expected values
DROP FUNCTION IF EXISTS get_or_create_project(UUID);

-- Recreate the function with simpler logic
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
  -- Check if user ID is valid
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
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_or_create_project(UUID) TO authenticated;

-- Fix type mismatch in check_project_counts function
DROP FUNCTION IF EXISTS check_project_counts();

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
    u.email::TEXT, 
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