-- Fix for the handle_new_user function that had a syntax error
-- This script drops and recreates the function with proper syntax

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with correct syntax
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  project_id UUID;
  user_email TEXT;
BEGIN
  -- Create a user profile with client role by default
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'client');
  
  -- Get the user's email
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- For client users, automatically create a default project
  -- Skip this for admin users who will be manually designated later
  IF EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = NEW.id AND role = 'client'
  ) THEN -- Fixed syntax error: added missing THEN
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a profile for the existing user
-- This will insert a profile for any existing auth user who doesn't have one
INSERT INTO public.user_profiles (id, role, created_at, updated_at)
SELECT 
  id, 
  'client', 
  NOW(), 
  NOW()
FROM 
  auth.users
WHERE 
  NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.users.id
  );

-- Report the result
SELECT 
  (SELECT COUNT(*) FROM auth.users) AS total_auth_users,
  (SELECT COUNT(*) FROM public.user_profiles) AS total_profiles,
  (SELECT COUNT(*) FROM auth.users WHERE 
    NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.users.id)
  ) AS users_without_profiles; 