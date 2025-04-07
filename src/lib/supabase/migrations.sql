
-- Create tables for design brief application

-- Enable RLS
alter table public.projects enable row level security;
alter table public.rooms enable row level security;
alter table public.occupants enable row level security;
alter table public.professionals enable row level security;
alter table public.inspiration_entries enable row level security;
alter table public.project_files enable row level security;
alter table public.project_settings enable row level security;
alter table public.summaries enable row level security;

-- Create RLS policies
-- Projects policy
create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);
  
create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);
  
create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- Room policies
create policy "Users can select rooms through projects" on rooms
  for select using (
    exists (
      select 1 from projects p 
      where p.id = rooms.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert rooms through projects" on rooms
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = rooms.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update rooms through projects" on rooms
  for update using (
    exists (
      select 1 from projects p 
      where p.id = rooms.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete rooms through projects" on rooms
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = rooms.project_id and p.user_id = auth.uid()
    )
  );

-- Occupants policies
create policy "Users can select occupants through projects" on occupants
  for select using (
    exists (
      select 1 from projects p 
      where p.id = occupants.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert occupants through projects" on occupants
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = occupants.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update occupants through projects" on occupants
  for update using (
    exists (
      select 1 from projects p 
      where p.id = occupants.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete occupants through projects" on occupants
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = occupants.project_id and p.user_id = auth.uid()
    )
  );

-- Professionals policies
create policy "Users can select professionals through projects" on professionals
  for select using (
    exists (
      select 1 from projects p 
      where p.id = professionals.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert professionals through projects" on professionals
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = professionals.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update professionals through projects" on professionals
  for update using (
    exists (
      select 1 from projects p 
      where p.id = professionals.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete professionals through projects" on professionals
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = professionals.project_id and p.user_id = auth.uid()
    )
  );

-- Inspiration entries policies
create policy "Users can select inspiration entries through projects" on inspiration_entries
  for select using (
    exists (
      select 1 from projects p 
      where p.id = inspiration_entries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert inspiration entries through projects" on inspiration_entries
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = inspiration_entries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update inspiration entries through projects" on inspiration_entries
  for update using (
    exists (
      select 1 from projects p 
      where p.id = inspiration_entries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete inspiration entries through projects" on inspiration_entries
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = inspiration_entries.project_id and p.user_id = auth.uid()
    )
  );

-- Project files policies
create policy "Users can select project files through projects" on project_files
  for select using (
    exists (
      select 1 from projects p 
      where p.id = project_files.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert project files through projects" on project_files
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = project_files.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update project files through projects" on project_files
  for update using (
    exists (
      select 1 from projects p 
      where p.id = project_files.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete project files through projects" on project_files
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = project_files.project_id and p.user_id = auth.uid()
    )
  );

-- Project settings policies
create policy "Users can select project settings through projects" on project_settings
  for select using (
    exists (
      select 1 from projects p 
      where p.id = project_settings.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert project settings through projects" on project_settings
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = project_settings.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update project settings through projects" on project_settings
  for update using (
    exists (
      select 1 from projects p 
      where p.id = project_settings.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete project settings through projects" on project_settings
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = project_settings.project_id and p.user_id = auth.uid()
    )
  );

-- Summaries policies
create policy "Users can select summaries through projects" on summaries
  for select using (
    exists (
      select 1 from projects p 
      where p.id = summaries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can insert summaries through projects" on summaries
  for insert with check (
    exists (
      select 1 from projects p 
      where p.id = summaries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can update summaries through projects" on summaries
  for update using (
    exists (
      select 1 from projects p 
      where p.id = summaries.project_id and p.user_id = auth.uid()
    )
  );
  
create policy "Users can delete summaries through projects" on summaries
  for delete using (
    exists (
      select 1 from projects p 
      where p.id = summaries.project_id and p.user_id = auth.uid()
    )
  );

-- Create storage bucket for project files
-- This needs to be done in the Supabase dashboard or via their API
