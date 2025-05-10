import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Regular client with anonymous key (will be used in Phase 2)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for Phase 1 testing (bypasses RLS)
// This should be removed in Phase 2 when proper authentication is implemented
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey) 