-- Get current user ID using a simple query approach
CREATE OR REPLACE FUNCTION get_my_id() RETURNS UUID AS $$
  SELECT auth.uid()
$$ LANGUAGE SQL;

-- Direct profile creation
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

-- Direct project creation
INSERT INTO public.projects (
  user_id,
  client_name,
  project_description,
  status,
  created_at,
  updated_at
)
SELECT 
  get_my_id(),
  'Test Client',
  'Test project created through direct SQL',
  'brief',
  NOW(),
  NOW()
WHERE 
  NOT EXISTS (
    SELECT 1 FROM public.projects WHERE user_id = get_my_id()
  )
  AND get_my_id() IS NOT NULL;

-- Give feedback about the operations
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_profiles WHERE id = get_my_id()) 
    THEN 'User profile exists'
    ELSE 'No user profile - are you logged in?'
  END AS profile_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.projects WHERE user_id = get_my_id()) 
    THEN 'User has projects'
    ELSE 'No projects for this user'
  END AS project_status,
  get_my_id() AS user_id;

-- Clean up temporary function
DROP FUNCTION IF EXISTS get_my_id(); 