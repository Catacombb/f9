import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { type Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Browser client for client-side usage
export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);

// Server client for SSR scenarios
// This function will be called with a request-specific cookie store when used server-side.
export const createServerSupabaseClient = (
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options: any) => void;
    remove?: (name: string, options: any) => void; // remove is optional in some cookie stores
  }
) =>
  createServerClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get: cookies.get,
        set: cookies.set,
        remove: cookies.remove,
      },
    }
  ); 