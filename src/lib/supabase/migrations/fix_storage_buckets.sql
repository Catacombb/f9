-- Fix storage buckets for file uploads
-- This script ensures the project-files bucket exists and has the correct permissions

-- First check if the storage extension is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'storage'
  ) THEN
    RAISE EXCEPTION 'Storage extension is not enabled. Please enable it in your Supabase dashboard first.';
  END IF;
END $$;

-- Create the project-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'Project Files Bucket', true)
ON CONFLICT (id) DO 
  UPDATE SET public = true;

-- Set up storage policies for the project-files bucket
-- First, remove any conflicting policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Individual user access" ON storage.objects;
DROP POLICY IF EXISTS "Project owner access" ON storage.objects;
DROP POLICY IF EXISTS "Admin user access" ON storage.objects;

-- Anyone can read public files
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT
USING (bucket_id = 'project-files' AND public = true);

-- Project owners can access their own files
CREATE POLICY "Project Owner Access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'project-files' AND
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN auth.users u ON p.user_id = u.id
    WHERE 
      -- Extract the project ID from the storage path (format: fileType/projectId/filename)
      p.id::text = (storage.foldername(name))[2] AND
      p.user_id = auth.uid()
  )
);

-- Admin users can access all files
CREATE POLICY "Admin Access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'project-files' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Make sure existing projects have the latest version field for optimistic locking
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Update any existing projects to have version 1
UPDATE public.projects
SET version = 1
WHERE version IS NULL OR version < 1; 