-- FIX FOR POLICY CONFLICTS
-- Run this in the Supabase SQL Editor to fix the "policy already exists" errors

-- First, drop all policies on the projects table
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  -- Loop through all policies for the projects table
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'projects'
    AND schemaname = 'public'
  LOOP
    -- Drop each policy
    EXECUTE format('DROP POLICY IF EXISTS %I ON projects', policy_record.policyname);
    RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
  END LOOP;
END $$;

-- Now recreate the necessary policies
-- Base view policies
CREATE POLICY "Users can view their own projects" ON projects
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Admin view policy
CREATE POLICY "Admins can view all projects" ON projects
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin')));

-- Insert policies with proper role checking
CREATE POLICY "Users can insert their own projects" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'client'))
);

CREATE POLICY "Admins can create projects for clients only" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'))
  AND 
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = user_id) AND (user_profiles.role = 'client'))
);

-- Update policies
CREATE POLICY "Users can update their own projects" ON projects
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Delete policies
CREATE POLICY "Users can delete their own projects" ON projects
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Verify all policies were created correctly
SELECT 
  tablename, 
  policyname, 
  roles, 
  cmd, 
  qual::text AS using_expression,
  with_check::text AS with_check_expression
FROM 
  pg_policies 
WHERE 
  tablename = 'projects' 
ORDER BY 
  policyname; 