-- Create a secure function to get a user's email from their ID
-- This allows frontend code to access emails without direct access to auth.users
CREATE OR REPLACE FUNCTION get_user_email_by_id(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the permissions of the creator
SET search_path = public, auth
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- First try to get from user_profiles
  SELECT email INTO user_email 
  FROM public.user_profiles 
  WHERE id = user_id;
  
  -- If found in profiles, return it
  IF user_email IS NOT NULL THEN
    RETURN user_email;
  END IF;
  
  -- Otherwise, try to get from auth.users
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = user_id;
  
  -- Return the result (null if not found)
  RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_email_by_id(UUID) TO authenticated;

-- Add a comment to explain the function
COMMENT ON FUNCTION get_user_email_by_id IS 'Securely get a user''s email from their ID without direct access to auth schema'; 