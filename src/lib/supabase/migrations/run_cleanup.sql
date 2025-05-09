  -- Execute this script to clean up duplicate projects
  -- This will preserve the oldest project for each user and delete duplicates

  -- First, drop the existing function to ensure we're using the fixed version
  DROP FUNCTION IF EXISTS clean_duplicate_projects();

  -- Then recreate the function with table aliases to avoid ambiguity
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

  -- Check if the function exists first with standard SQL
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'clean_duplicate_projects'
    ) THEN
      RAISE EXCEPTION 'Function clean_duplicate_projects does not exist';
    END IF;
  END$$;

  -- Run the cleanup function
  SELECT * FROM clean_duplicate_projects();

  -- Report the current state
  SELECT
    user_id,
    COUNT(*) as project_count
  FROM
    projects
  GROUP BY
    user_id
  HAVING
    COUNT(*) > 1;

  -- If the above query returns rows, it means there are still users with multiple projects
  -- This might happen if the function encountered errors during deletion
  -- You can run this script again to attempt cleanup again 