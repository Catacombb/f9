// This file defines the database schema and types that match our Supabase tables

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables for Supabase connection
// These are provided by the Supabase integration in Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types that match our Supabase tables
export type Project = Database['public']['Tables']['projects']['Row'];
export type Room = Database['public']['Tables']['rooms']['Row'];
export type Occupant = Database['public']['Tables']['occupants']['Row'];
export type Professional = Database['public']['Tables']['professionals']['Row'];
export type InspirationEntry = Database['public']['Tables']['inspiration_entries']['Row'];
export type ProjectFile = Database['public']['Tables']['project_files']['Row'];
export type ProjectSettings = Database['public']['Tables']['project_settings']['Row'];
export type Summary = Database['public']['Tables']['summaries']['Row'];

// New types for dashboard functionality
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row']; 

// Status type for projects
export type ProjectStatus = 'brief' | 'sent' | 'complete';
