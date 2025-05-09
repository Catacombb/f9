-- Add version column for optimistic locking
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Add comment for the version column
COMMENT ON COLUMN public.projects.version IS 'Version number for optimistic locking';

-- Update any existing projects to have version 1
UPDATE public.projects
SET version = 1
WHERE version IS NULL OR version < 1; 