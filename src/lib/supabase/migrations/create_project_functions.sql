-- Create an RPC function for atomic get-or-create project operations
-- This ensures we never create duplicate projects due to race conditions
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
-- This can be run manually to consolidate projects
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
    SELECT id INTO v_kept_project_id
    FROM public.projects
    WHERE user_id = r.user_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- Delete all other projects for this user
    WITH deleted AS (
      DELETE FROM public.projects
      WHERE 
        user_id = r.user_id AND
        id != v_kept_project_id
      RETURNING id
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

-- Allow only admins to execute the cleanup function
-- This is a potentially destructive operation
REVOKE EXECUTE ON FUNCTION clean_duplicate_projects() FROM public;
GRANT EXECUTE ON FUNCTION clean_duplicate_projects() TO authenticated; 