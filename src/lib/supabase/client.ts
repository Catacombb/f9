import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { type Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase Client] Missing environment variables!', {
    supabaseUrl: supabaseUrl ? 'present' : 'missing', 
    supabaseAnonKey: supabaseAnonKey ? 'present' : 'missing'
  });
}

// Singleton for browser client
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Browser client for client-side usage with singleton pattern
export const createBrowserSupabaseClient = () => {
  if (browserClient) {
    return browserClient;
  }
  
  try {
    console.log('[Supabase Client] Creating new browser client instance');
    browserClient = createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
    return browserClient;
  } catch (error) {
    console.error('[Supabase Client] Error creating browser client:', error);
    // Return a client anyway to avoid null pointer errors in consuming code
    // This might not work properly but at least won't crash the app
    return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }
};

// Server client for SSR scenarios
// This function will be called with a request-specific cookie store when used server-side.
export const createServerSupabaseClient = (
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options: any) => void;
    remove?: (name: string, options: any) => void; // remove is optional in some cookie stores
  }
) => {
  try {
    console.log('[Supabase Client] Creating server client instance');
    return createServerClient<Database>(
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
  } catch (error) {
    console.error('[Supabase Client] Error creating server client:', error);
    // Return a client anyway to avoid null pointer errors, but it might not work properly
    return createServerClient<Database>(
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
  }
}; 