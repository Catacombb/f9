-- This script fixes the infinite recursion problems in RLS policies
-- by creating a security definer function to check if a user is an admin.

-- 1. Create a helper schema for security definer functions (not exposed to the API)
CREATE SCHEMA IF NOT EXISTS auth_helpers;

-- 2. Create a function to check if user has admin role (bypasses RLS)
CREATE OR REPLACE FUNCTION auth_helpers.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop existing policies with recursion problems
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all activities" ON activities;
DROP POLICY IF EXISTS "Admins can insert activities for any project" ON activities;

-- 4. Create new policies that use the security definer function
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (auth_helpers.is_admin());

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (auth_helpers.is_admin());

CREATE POLICY "Admins can view all activities" ON activities
  FOR SELECT USING (auth_helpers.is_admin());

CREATE POLICY "Admins can insert activities for any project" ON activities
  FOR INSERT WITH CHECK (auth_helpers.is_admin());

-- 5. Grant execute permission on the function to authenticated users
GRANT USAGE ON SCHEMA auth_helpers TO authenticated;
GRANT EXECUTE ON FUNCTION auth_helpers.is_admin TO authenticated; 