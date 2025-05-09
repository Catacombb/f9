-- Migration to remove automatic project creation trigger
-- This will disable automatic project creation when a user registers
-- and ensure all project creation goes through the getOrCreateProject function

-- 1. First, drop the existing trigger that auto-creates projects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Create a new user registration handler that only creates the profile (no automatic project)
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

-- 3. Recreate the trigger with the simplified function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Clean up existing duplicate projects
-- This will keep the oldest project for each user and remove duplicates
WITH ranked_projects AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rn
  FROM public.projects
)
DELETE FROM public.projects
WHERE id IN (
  SELECT id FROM ranked_projects WHERE rn > 1
);

-- 5. Report the current state after cleanup
SELECT
  'Reporting project counts per user after cleanup' as operation,
  user_id,
  COUNT(*) as project_count
FROM
  public.projects
GROUP BY
  user_id
ORDER BY
  project_count DESC; 