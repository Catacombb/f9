import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();

// Simple in-memory cache for admin status
const adminStatusCache: {
  [userId: string]: {
    status: boolean;
    timestamp: number;
  }
} = {};

// Cache expiry in milliseconds (5 minutes)
const CACHE_TTL = 1000 * 60 * 5;

/**
 * Check if a user has admin role
 * @param userId - The user ID to check (optional, defaults to current auth user)
 * @param bypassCache - Force a fresh check ignoring cache
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isAdmin(userId?: string, bypassCache = false): Promise<boolean> {
  try {
    console.log('[roleService] Checking admin status for user:', userId || 'current user');
    
    // If no userId provided, get the current user first
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
      
      if (!userId) {
        console.error('[roleService] No authenticated user found');
        return false;
      }
    }
    
    // Check cache first (unless bypass requested)
    if (!bypassCache && adminStatusCache[userId]) {
      const cacheEntry = adminStatusCache[userId];
      const now = Date.now();
      
      // If cache entry is still valid
      if (now - cacheEntry.timestamp < CACHE_TTL) {
        console.log('[roleService] Using cached admin status for user:', userId);
        return cacheEntry.status;
      } else {
        // Clear expired cache entry
        delete adminStatusCache[userId];
      }
    }
    
    // Get current session to compare with userId
    const { data: { session } } = await supabase.auth.getSession();
    
    // If explicit userId is provided, check against user_profiles table
    if (userId !== session?.user?.id) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[roleService] Error checking user role:', error.message);
        return false;
      }

      const isAdminStatus = data?.role === 'admin';
      
      // Cache the result
      adminStatusCache[userId] = {
        status: isAdminStatus,
        timestamp: Date.now()
      };
      
      return isAdminStatus;
    }
    
    // Otherwise use the RPC function for the current user
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('[roleService] Error checking admin status:', error.message);
      return false;
    }
    
    const isAdminStatus = !!data;
    
    // Cache the result
    adminStatusCache[userId] = {
      status: isAdminStatus,
      timestamp: Date.now()
    };
    
    return isAdminStatus;
  } catch (err) {
    console.error('[roleService] Exception checking admin status:', err);
    return false;
  }
} 