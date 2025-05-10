import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase admin client with service role key
// This bypasses RLS and should ONLY be used for privileged operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceKey, 
  {
    auth: {
      persistSession: false, // Don't persist the auth session for admin client
      autoRefreshToken: false,
    }
  }
);

/**
 * SECURITY WARNING: This client bypasses all Row Level Security (RLS) policies.
 * Only use this client for:
 * 1. Storage operations that require elevated privileges
 * 2. Admin-only actions that can't be performed with regular user permissions
 * 3. Never expose this client to the frontend directly
 * 
 * Always validate user permissions before using this client to perform operations.
 */ 