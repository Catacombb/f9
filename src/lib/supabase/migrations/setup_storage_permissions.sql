-- Storage Permissions Check & Setup Guide
-- This script will check your current permissions and provide guidance

DO $$
DECLARE
  storage_available BOOLEAN;
  can_create_bucket BOOLEAN;
  project_files_exists BOOLEAN;
BEGIN
  -- Check if storage extension is available
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'storage') INTO storage_available;
  
  IF NOT storage_available THEN
    RAISE NOTICE '----------------------------------------------------------------------';
    RAISE NOTICE 'IMPORTANT: Storage extension is NOT enabled. File uploads will NOT work.';
    RAISE NOTICE 'To enable it:';
    RAISE NOTICE '1. Go to your Supabase dashboard (https://app.supabase.io)';
    RAISE NOTICE '2. Navigate to "Database" → "Extensions"';
    RAISE NOTICE '3. Find "storage" in the list and enable it';
    RAISE NOTICE '----------------------------------------------------------------------';
    RETURN;
  END IF;
  
  -- Check if we can see the buckets table
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) INTO can_create_bucket;
  EXCEPTION WHEN insufficient_privilege THEN
    can_create_bucket := FALSE;
  END;
  
  -- Check if project-files bucket exists
  IF can_create_bucket THEN
    BEGIN
      SELECT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'project-files'
      ) INTO project_files_exists;
    EXCEPTION WHEN insufficient_privilege THEN
      project_files_exists := FALSE;
    END;
  END IF;
  
  -- Output results and guidance
  RAISE NOTICE 'Storage extension is enabled: %', storage_available;
  RAISE NOTICE 'Can see storage.buckets: %', can_create_bucket;
  RAISE NOTICE 'project-files bucket exists: %', project_files_exists;
  
  RAISE NOTICE '';
  RAISE NOTICE '----------------------------------------------------------------------';
  RAISE NOTICE 'RECOMMENDED SETUP THROUGH SUPABASE DASHBOARD:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to your Supabase dashboard (https://app.supabase.io)';
  RAISE NOTICE '2. Select your project';
  RAISE NOTICE '3. Navigate to "Storage" in the left sidebar';
  RAISE NOTICE '4. Click "Create a new bucket"';
  RAISE NOTICE '5. Name it "project-files" (this exact name is important)';
  RAISE NOTICE '6. Enable "Public bucket" if you want files to be publicly accessible';
  RAISE NOTICE '';
  RAISE NOTICE 'SETTING UP RLS POLICIES:';
  RAISE NOTICE '7. Once the bucket is created, click on its name';
  RAISE NOTICE '8. Go to the "Policies" tab';
  RAISE NOTICE '9. Click "Create a policy" and add the following policies:';
  RAISE NOTICE '';
  RAISE NOTICE '   a. Policy for public access (SELECT only):';
  RAISE NOTICE '      - Name: "Public Read Access"';
  RAISE NOTICE '      - Allowed operations: SELECT';
  RAISE NOTICE '      - Policy definition: bucket_id = ''project-files''';
  RAISE NOTICE '';
  RAISE NOTICE '   b. Policy for project owners (ALL permissions):';
  RAISE NOTICE '      - Name: "Project Owner Access"';
  RAISE NOTICE '      - Allowed operations: ALL';
  RAISE NOTICE '      - Policy definition: bucket_id = ''project-files'' AND EXISTS (';
  RAISE NOTICE '           SELECT 1 FROM public.projects p';
  RAISE NOTICE '           JOIN auth.users u ON p.user_id = u.id';
  RAISE NOTICE '           WHERE p.id::text = (storage.foldername(name))[2]';
  RAISE NOTICE '           AND p.user_id = auth.uid()';
  RAISE NOTICE '        )';
  RAISE NOTICE '';
  RAISE NOTICE '   c. Policy for admin users (ALL permissions):';
  RAISE NOTICE '      - Name: "Admin Access"';
  RAISE NOTICE '      - Allowed operations: ALL';
  RAISE NOTICE '      - Policy definition: bucket_id = ''project-files'' AND EXISTS (';
  RAISE NOTICE '           SELECT 1 FROM public.user_profiles';
  RAISE NOTICE '           WHERE id = auth.uid() AND role = ''admin''';
  RAISE NOTICE '        )';
  RAISE NOTICE '';
  RAISE NOTICE 'After setting up these policies, your storage should work correctly.';
  RAISE NOTICE '----------------------------------------------------------------------';
END $$; 