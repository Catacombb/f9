-- Updated version of create_profile_direct.sql
-- This version only creates a user profile but does not automatically create a project

-- Get current user ID using a simple query approach
CREATE OR REPLACE FUNCTION get_my_id() RETURNS UUID AS $$
  SELECT auth.uid()
$$ LANGUAGE SQL;

-- Direct profile creation - this is still needed
INSERT INTO public.user_profiles (id, role, created_at, updated_at)
SELECT 
  get_my_id(), 
  'client', 
  NOW(), 
  NOW()
WHERE 
  NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = get_my_id()
  )
  AND get_my_id() IS NOT NULL;

-- REMOVED: Direct project creation
-- We no longer auto-create projects here to prevent duplicates
-- All project creation should go through getOrCreateProject function

-- Instead, run a diagnostic query to show if user has projects
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_profiles WHERE id = get_my_id()) 
    THEN 'User profile exists'
    ELSE 'No user profile - are you logged in?'
  END AS profile_status,
  (SELECT COUNT(*) FROM public.projects WHERE user_id = get_my_id()) AS project_count,
  get_my_id() AS user_id;

-- Clean up temporary function
DROP FUNCTION IF EXISTS get_my_id(); 