-- Fix admin access to projects and related entities
-- This migration adds policies that allow admin users to view, update, and delete all projects
-- and related data, regardless of who owns them

-- First, drop any existing overlapping policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can update all projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete all projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects for any user" ON projects;

-- Create policies that allow admins to access all projects
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert projects for any user" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Also add admin access policies for related entities like files, settings, etc.
DROP POLICY IF EXISTS "Admins can access all project data" ON project_settings;
DROP POLICY IF EXISTS "Admins can access all project data" ON rooms;
DROP POLICY IF EXISTS "Admins can access all project data" ON occupants;
DROP POLICY IF EXISTS "Admins can access all project data" ON professionals;
DROP POLICY IF EXISTS "Admins can access all project data" ON inspiration_entries;
DROP POLICY IF EXISTS "Admins can access all project data" ON project_files;
DROP POLICY IF EXISTS "Admins can access all project data" ON summaries;

-- Create policies for all project-related tables
CREATE POLICY "Admins can access all project data" ON project_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON occupants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON professionals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON inspiration_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON project_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can access all project data" ON summaries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Make sure storage buckets have admin access policies as well
-- This requires the storage extension to be enabled
CREATE POLICY "Admins can access all storage files" ON storage.objects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      JOIN public.user_profiles ON auth.users.id = user_profiles.id
      WHERE auth.uid() = user_profiles.id AND user_profiles.role = 'admin'
    )
  ); 