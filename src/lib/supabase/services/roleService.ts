import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();

/**
 * Check if a user has admin role
 * @param userId - The user ID to check (optional, defaults to current auth user)
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    console.log('[roleService] Checking admin status for user:', userId || 'current user');
    
    // If userId is provided, check against user_profiles table
    if (userId) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[roleService] Error checking user role:', error.message);
        return false;
      }

      return data?.role === 'admin';
    }
    
    // Otherwise use the RPC function for the current user
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('[roleService] Error checking admin status:', error.message);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('[roleService] Exception checking admin status:', err);
    return false;
  }
} 