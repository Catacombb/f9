-- Fix RLS Policies for Project Creation
-- This migration updates the Row Level Security policies to prevent duplicate brief creation
-- and ensure admins can only create projects for client users, not themselves

-- =====================================================
-- PART 1: Drop existing conflicting policies
-- =====================================================

-- First drop the overlapping policies
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects for any user" ON projects;

-- =====================================================
-- PART 2: Create updated policies with proper checks
-- =====================================================

-- Policy for client users to create their own projects
CREATE POLICY "Users can insert their own projects" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'client'))
);

-- Policy for admin users to create projects only for clients
CREATE POLICY "Admins can create projects for clients only" ON projects
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'))
  AND 
  EXISTS (SELECT 1 FROM user_profiles WHERE (user_profiles.id = user_id) AND (user_profiles.role = 'client'))
);

-- =====================================================
-- PART 3: Verify policy implementation
-- =====================================================

-- List all RLS policies on projects to verify changes
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'projects';

-- =====================================================
-- PART 4: Document the policy changes
-- =====================================================

COMMENT ON POLICY "Users can insert their own projects" ON projects IS 
'Allows client users to create projects only for themselves. Prevents admin users from creating projects for themselves.';

COMMENT ON POLICY "Admins can create projects for clients only" ON projects IS 
'Allows admin users to create projects only for users with the client role. Prevents admin users from creating projects for other admins.'; 