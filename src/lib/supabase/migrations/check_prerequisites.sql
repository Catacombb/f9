-- Check prerequisites for migrations
-- This script will check if all required extensions and tables are available
-- Run this first to validate your environment

DO $$
DECLARE
  extension_missing TEXT[] := ARRAY[]::TEXT[];
  required_tables TEXT[] := ARRAY['projects', 'project_settings', 'rooms', 'occupants', 
                                 'professionals', 'inspiration_entries', 'project_files', 
                                 'summaries', 'user_profiles', 'activities'];
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  storage_available BOOLEAN;
  missing_table TEXT;
BEGIN
  -- Check required PostgreSQL extensions
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    extension_missing := array_append(extension_missing, 'uuid-ossp');
  END IF;
  
  -- Check if storage extension is available
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'storage') INTO storage_available;
  
  IF NOT storage_available THEN
    extension_missing := array_append(extension_missing, 'storage (needed for file uploads)');
  END IF;
  
  -- Check required tables
  FOREACH missing_table IN ARRAY required_tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = missing_table
    ) THEN
      missing_tables := array_append(missing_tables, missing_table);
    END IF;
  END LOOP;
  
  -- Output results
  IF array_length(extension_missing, 1) IS NOT NULL THEN
    RAISE NOTICE 'Missing extensions: %', extension_missing;
  ELSE
    RAISE NOTICE 'All required extensions are available!';
  END IF;
  
  IF array_length(missing_tables, 1) IS NOT NULL THEN
    RAISE NOTICE 'Missing tables: %', missing_tables;
  ELSE
    RAISE NOTICE 'All required tables are available!';
  END IF;
  
  -- Storage-specific information
  IF storage_available THEN
    RAISE NOTICE 'Storage extension is enabled and ready for file upload configuration.';
  ELSE
    RAISE NOTICE '----------------------------------------------------------------------';
    RAISE NOTICE 'IMPORTANT: Storage extension is NOT enabled. File uploads will NOT work.';
    RAISE NOTICE 'To enable it:';
    RAISE NOTICE '1. Go to your Supabase dashboard (https://app.supabase.io)';
    RAISE NOTICE '2. Navigate to "Database" → "Extensions"';
    RAISE NOTICE '3. Find "storage" in the list and enable it';
    RAISE NOTICE '4. Then run the setup_storage.sql script';
    RAISE NOTICE '----------------------------------------------------------------------';
  END IF;
  
  -- Final summary
  IF array_length(extension_missing, 1) IS NULL AND array_length(missing_tables, 1) IS NULL THEN
    RAISE NOTICE 'Your environment is ready for migrations!';
  ELSE
    RAISE NOTICE 'Please fix the issues above before proceeding with migrations.';
  END IF;
END $$; 