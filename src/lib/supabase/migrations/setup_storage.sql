-- Storage setup script
-- Run this after enabling the storage extension in your Supabase dashboard
-- 1. Go to your Supabase dashboard (https://app.supabase.io)
-- 2. Select your project
-- 3. Navigate to "Database" → "Extensions"
-- 4. Find "storage" in the list of extensions
-- 5. Click the toggle switch to enable it
-- 6. Then run this script

-- First check if the column 'public' exists in storage.buckets
DO $$
DECLARE
  column_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'storage'
      AND table_name = 'buckets'
      AND column_name = 'public'
  ) INTO column_exists;

  IF column_exists THEN
    -- Create the project-files bucket if it doesn't exist (for Supabase with 'public' column)
    EXECUTE '
      INSERT INTO storage.buckets (id, name, public)
      VALUES (''project-files'', ''Project Files Bucket'', true)
      ON CONFLICT (id) DO 
        UPDATE SET public = true
    ';
  ELSE
    -- Create the project-files bucket if it doesn't exist (for newer Supabase versions)
    EXECUTE '
      INSERT INTO storage.buckets (id, name)
      VALUES (''project-files'', ''Project Files Bucket'')
      ON CONFLICT (id) DO 
        UPDATE SET name = ''Project Files Bucket''
    ';
  END IF;
END $$;

-- Set up storage policies for the project-files bucket
-- First, remove any conflicting policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Individual user access" ON storage.objects;
DROP POLICY IF EXISTS "Project owner access" ON storage.objects;
DROP POLICY IF EXISTS "Admin user access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Project Owner Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access" ON storage.objects;

-- Anyone can read files (public access policy)
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT
USING (bucket_id = 'project-files');

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