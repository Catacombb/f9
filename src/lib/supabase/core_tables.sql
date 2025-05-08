-- Core tables for design brief application

-- Projects table - stores main project information
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name TEXT NOT NULL,
  project_address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  project_type TEXT,
  project_description TEXT,
  budget_range TEXT,
  move_in_preference TEXT,
  move_in_date TEXT,
  project_goals TEXT,
  coordinates FLOAT[] -- [longitude, latitude]
);

-- Project settings table - stores additional settings for each project
CREATE TABLE IF NOT EXISTS public.project_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  budget_flexibility TEXT,
  budget_priorities TEXT[],
  budget_notes TEXT,
  lifestyle_notes TEXT,
  home_feeling TEXT,
  site_constraints TEXT[],
  site_access TEXT,
  site_views TEXT,
  outdoor_spaces TEXT[],
  site_notes TEXT,
  home_level_type TEXT,
  level_assignment_notes TEXT,
  home_size TEXT,
  eliminable_spaces TEXT,
  room_arrangement TEXT,
  preferred_styles TEXT[],
  material_preferences TEXT[],
  external_materials_selected TEXT[],
  internal_materials_selected TEXT[],
  sustainability_features TEXT[],
  technology_requirements TEXT[],
  architecture_notes TEXT,
  communication_notes TEXT
);

-- Rooms table - stores information about rooms
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  description TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  custom_name TEXT,
  display_name TEXT,
  primary_users TEXT[]
);

-- Occupants table - stores information about occupants
CREATE TABLE IF NOT EXISTS public.occupants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  notes TEXT
);

-- Professionals table - stores information about professionals
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  notes TEXT,
  is_custom BOOLEAN DEFAULT FALSE
);

-- Inspiration entries table - stores inspiration links
CREATE TABLE IF NOT EXISTS public.inspiration_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  link TEXT NOT NULL,
  description TEXT
);

-- Project files table - stores metadata for uploaded files
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT NOT NULL
);

-- Summaries table - stores generated and edited summaries
CREATE TABLE IF NOT EXISTS public.summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  generated_summary TEXT,
  edited_summary TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies - projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Basic RLS policies - for all related tables using project_id relation
-- This is a simplified approach that applies to all child tables
-- In a more complex application, you might want more granular policies
CREATE POLICY "Users can access their project data" ON project_settings
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_settings.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can access their project data" ON rooms
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = rooms.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can access their project data" ON occupants
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = occupants.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can access their project data" ON professionals
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = professionals.project_id AND projects.user_id = auth.uid()));
  
CREATE POLICY "Users can access their project data" ON inspiration_entries
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = inspiration_entries.project_id AND projects.user_id = auth.uid()));
  
CREATE POLICY "Users can access their project data" ON project_files
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid()));
  
CREATE POLICY "Users can access their project data" ON summaries
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = summaries.project_id AND projects.user_id = auth.uid()));

-- Create a storage bucket for project files
-- Note: Run this in the Supabase dashboard SQL editor
-- INSERT INTO storage.buckets (id, name) VALUES ('project-files', 'Project Files Bucket'); 