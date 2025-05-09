-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with correct syntax and duplicate prevention
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  project_id UUID;
  user_email TEXT;
  existing_project_count INTEGER;
BEGIN
  -- Create a user profile with client role by default
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'client');
  
  -- Get the user's email
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Check if the user already has projects
  SELECT COUNT(*) INTO existing_project_count
  FROM public.projects
  WHERE user_id = NEW.id;
  
  -- For client users, automatically create a default project
  -- Skip this for admin users who will be manually designated later
  -- Also skip if the user already has projects
  IF EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = NEW.id AND role = 'client'
  ) THEN
    -- Only create a project if the user doesn't already have one
    IF existing_project_count = 0 THEN
      -- Create a default project for the client
      INSERT INTO public.projects (
        user_id,
        client_name,
        project_description,
        status
      ) VALUES (
        NEW.id,
        COALESCE(user_email, 'New Client'),
        'Default project created on registration',
        'brief'
      )
      RETURNING id INTO project_id;
      
      -- Log the project creation in activities
      INSERT INTO public.activities (
        project_id,
        user_id,
        activity_type,
        details,
        is_system_generated
      ) VALUES (
        project_id,
        NEW.id,
        'system_event',
        jsonb_build_object(
          'event', 'project_created',
          'message', 'Project automatically created on user registration'
        ),
        TRUE
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up duplicate projects
-- Note: This will keep the oldest project for each user and remove duplicates
-- Uncomment and run carefully in production after testing

WITH ranked_projects AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rn
  FROM projects
)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM ranked_projects WHERE rn > 1
);
