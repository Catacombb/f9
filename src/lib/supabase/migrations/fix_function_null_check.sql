-- Fix for the get_or_create_project function to properly handle NULL user IDs
-- This fixes the error: "null value in column "user_id" of relation "projects" violates not-null constraint"

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_or_create_project(UUID);

-- Recreate the function with proper NULL checks
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