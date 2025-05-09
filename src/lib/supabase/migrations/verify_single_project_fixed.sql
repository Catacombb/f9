-- Updated script to verify project creation uniqueness
-- This script safely handles cases where the user is not authenticated

-- 1. First, show how many projects each user has 
SELECT 
  'Current User Projects' as operation,
  u.email,
  COUNT(p.id) as project_count
FROM 
  auth.users u
LEFT JOIN
  public.projects p ON u.id = p.user_id
GROUP BY 
  u.id, u.email
ORDER BY 
  project_count DESC;

-- 2. Check for users with no projects
SELECT 
  'Users with no projects' as operation,
  u.email
FROM 
  auth.users u
LEFT JOIN
  public.projects p ON u.id = p.user_id
WHERE
  p.id IS NULL;

-- 3. Check for users with multiple projects
SELECT 
  'Users with multiple projects' as operation,
  u.email,
  COUNT(p.id) as project_count,
  ARRAY_AGG(p.id) as project_ids,
  ARRAY_AGG(p.created_at) as created_at_times
FROM 
  auth.users u
JOIN
  public.projects p ON u.id = p.user_id
GROUP BY 
  u.id, u.email
HAVING
  COUNT(p.id) > 1
ORDER BY 
  project_count DESC;

-- 4. Check if we're authenticated before testing the function
DO $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Report authentication status
  IF current_user_id IS NULL THEN
    RAISE NOTICE 'Not authenticated. Skipping getOrCreateProject test.';
  ELSE
    RAISE NOTICE 'Authenticated as user ID: %', current_user_id;
    
    -- If authenticated, we can safely test the function
    PERFORM get_or_create_project(current_user_id);
    
    -- Check the result
    RAISE NOTICE 'Projects for current user:';
    PERFORM COUNT(*) 
    FROM public.projects 
    WHERE user_id = current_user_id;
  END IF;
END $$;

-- 5. Execute project cleanup (this can run even if not authenticated)
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
  'Duplicate projects deleted' as operation,
  COUNT(*) as deleted_count
FROM 
  deleted_projects; 