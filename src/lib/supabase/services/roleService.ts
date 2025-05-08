import { supabase } from '@/lib/supabase/schema';
import { Database } from '@/lib/supabase/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserRole = 'admin' | 'client';

/**
 * Get the role of a user
 * @param userId The ID of the user to check
 * @returns The user's role or null if no profile found
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error.message);
      return null;
    }
    
    return data?.role as UserRole || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Check if a user is an admin
 * @param userId The ID of the user to check
 * @returns True if the user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

/**
 * Check if a user can access a specific project
 * @param userId The ID of the user to check
 * @param projectId The ID of the project to check access for
 * @returns True if the user can access the project, false otherwise
 */
export async function canAccessProject(userId: string, projectId: string): Promise<boolean> {
  try {
    // First check if user is an admin
    const role = await getUserRole(userId);
    
    if (role === 'admin') {
      return true; // Admin can access all projects
    }
    
    // Otherwise, check if the project belongs to the user
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking project access:', error.message);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in canAccessProject:', error);
    return false;
  }
}

/**
 * Check if a user can perform a specific action
 * @param userId The ID of the user to check
 * @param action The action to check permission for
 * @param resourceId Optional resource ID relevant to the action
 * @returns True if the user has permission, false otherwise
 */
export async function hasPermission(
  userId: string, 
  action: 'view_dashboard' | 'change_status' | 'view_all_projects' | 'manage_users',
  resourceId?: string
): Promise<boolean> {
  try {
    const role = await getUserRole(userId);
    
    if (!role) {
      return false; // No profile found
    }
    
    // Define permissions based on role
    const permissions: Record<UserRole, string[]> = {
      'admin': ['view_dashboard', 'change_status', 'view_all_projects', 'manage_users'],
      'client': ['view_dashboard'] // Clients can only view their own dashboard
    };
    
    const hasActionPermission = permissions[role].includes(action);
    
    // If the action requires a resource check (like a specific project)
    if (hasActionPermission && resourceId && action === 'change_status') {
      return await canAccessProject(userId, resourceId);
    }
    
    return hasActionPermission;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

/**
 * Get all users with a specific role
 * @param role The role to filter by
 * @returns An array of user profiles with the specified role
 */
export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', role);
    
    if (error) {
      throw new Error(`Error fetching users with role ${role}: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    throw error;
  }
}

/**
 * Update a user's role
 * @param userId The ID of the user to update
 * @param newRole The new role to assign
 * @returns True if the role was updated successfully, false otherwise
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    // Only admins should be able to update roles, but we'll let the caller check that
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user role:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
}

/**
 * Get all possible user roles
 * @returns Array of valid user roles
 */
export function getAllRoles(): UserRole[] {
  return ['admin', 'client'];
}

/**
 * Get the display name for a role
 * @param role The role value
 * @returns A human-readable display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    'admin': 'Administrator',
    'client': 'Client'
  };
  
  return displayNames[role] || role;
} 