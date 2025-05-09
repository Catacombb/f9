-- Script to verify project creation uniqueness
-- This script helps verify that each user has exactly one project

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

-- 4. Test the getOrCreateProject function for the current user
SELECT 
  'Testing getOrCreateProject function' as operation,
  * 
FROM 
  get_or_create_project(auth.uid());

-- 5. Verify the current user has exactly one project after function call
SELECT 
  'Current user project count after function call' as operation,
  COUNT(*) as project_count
FROM 
  public.projects
WHERE 
  user_id = auth.uid(); 