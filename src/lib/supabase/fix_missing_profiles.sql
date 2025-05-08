-- This script ensures all authenticated users have a profile in the user_profiles table
-- It creates profiles for any existing auth users that don't have one yet

-- First check if the current user has a profile
DO $$
DECLARE
  current_user_id UUID;
  has_profile BOOLEAN;
BEGIN
  -- Get the current authenticated user's ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE NOTICE 'Not authenticated. Please log in first.';
    RETURN;
  END IF;
  
  -- Check if the user already has a profile
  SELECT EXISTS(
    SELECT 1 FROM user_profiles WHERE id = current_user_id
  ) INTO has_profile;
  
  -- If no profile exists, create one
  IF NOT has_profile THEN
    INSERT INTO user_profiles (
      id,
      role,
      created_at,
      updated_at
    ) VALUES (
      current_user_id,
      'client',  -- Default role
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created profile for the current user with ID: %', current_user_id;
  ELSE
    RAISE NOTICE 'User already has a profile';
  END IF;
  
  -- For testing purposes, check if the user has a project
  -- If not, create a sample project for testing
  IF NOT EXISTS (
    SELECT 1 FROM projects WHERE user_id = current_user_id
  ) THEN
    INSERT INTO projects (
      user_id,
      client_name,
      project_description,
      status,
      created_at,
      updated_at
    ) VALUES (
      current_user_id,
      'Test Client',
      'Test project for dashboard testing',
      'brief',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created a test project for the current user';
  END IF;
END $$;

-- Optional: Create an admin user for testing
-- Uncomment and run this section if you need to create/designate an admin
/*
UPDATE user_profiles
SET role = 'admin'
WHERE id = auth.uid();
RAISE NOTICE 'Current user set as admin';
*/ 