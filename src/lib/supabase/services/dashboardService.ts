import { supabase } from '@/lib/supabase/schema';
import { Database } from '@/lib/supabase/database.types';
import { getProjectsByStatus, getProjectStatusSummary } from './statusService';
import { getUserRole, isAdmin, getUsersByRole } from './roleService';
import { getRecentActivities, getProjectActivities } from './activitiesService';

type Project = Database['public']['Tables']['projects']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];

interface DashboardStats {
  projectCounts: {
    brief: number;
    sent: number;
    complete: number;
    total: number;
  };
  recentActivity: Activity[];
  userCounts: {
    admins: number;
    clients: number;
    total: number;
  };
}

interface ClientDashboardData {
  projects: Project[];
  recentActivities: Activity[];
  stats: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
  };
}

interface AdminDashboardData extends DashboardStats {
  recentProjects: Project[];
  recentClients: UserProfile[];
}

/**
 * Get dashboard statistics
 * @returns Dashboard statistics including project counts and recent activity
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get project counts by status
    const projectCounts = await getProjectStatusSummary();
    
    // Get recent activity
    const recentActivity = await getRecentActivities(10);
    
    // Get user counts by role
    const admins = await getUsersByRole('admin');
    const clients = await getUsersByRole('client');
    
    return {
      projectCounts,
      recentActivity,
      userCounts: {
        admins: admins.length,
        clients: clients.length,
        total: admins.length + clients.length
      }
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}

/**
 * Get dashboard data for an admin user
 * @returns Admin dashboard data
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    // Get dashboard stats
    const stats = await getDashboardStats();
    
    // Get recent projects
    const recentProjects = await getRecentProjects(5);
    
    // Get recent clients (users with client role)
    const recentClients = await getRecentClients(5);
    
    return {
      ...stats,
      recentProjects,
      recentClients
    };
  } catch (error) {
    console.error('Error in getAdminDashboardData:', error);
    throw error;
  }
}

/**
 * Get dashboard data for a client user
 * @param userId The ID of the client user
 * @returns Client dashboard data
 */
export async function getClientDashboardData(userId: string): Promise<ClientDashboardData> {
  try {
    // Get projects for this client
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }
    
    // Get recent activities for this client's projects
    const projectIds = projects.map(project => project.id);
    
    // If there are no projects, return empty data
    if (projectIds.length === 0) {
      return {
        projects: [],
        recentActivities: [],
        stats: {
          totalProjects: 0,
          completedProjects: 0,
          inProgressProjects: 0
        }
      };
    }
    
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (activitiesError) {
      console.error(`Error fetching activities: ${activitiesError.message}`);
    }
    
    // Calculate stats
    const completedProjects = projects.filter(p => p.status === 'complete').length;
    const inProgressProjects = projects.filter(p => p.status === 'sent').length;
    
    return {
      projects,
      recentActivities: activities || [],
      stats: {
        totalProjects: projects.length,
        completedProjects,
        inProgressProjects
      }
    };
  } catch (error) {
    console.error('Error in getClientDashboardData:', error);
    throw error;
  }
}

/**
 * Get dashboard data based on user role
 * @param userId The ID of the user
 * @returns Dashboard data appropriate for the user's role
 */
export async function getDashboardDataForUser(userId: string): Promise<AdminDashboardData | ClientDashboardData> {
  try {
    const userIsAdmin = await isAdmin(userId);
    
    if (userIsAdmin) {
      return getAdminDashboardData();
    } else {
      return getClientDashboardData(userId);
    }
  } catch (error) {
    console.error('Error in getDashboardDataForUser:', error);
    throw error;
  }
}

/**
 * Get recent projects
 * @param limit Optional limit for the number of projects returned
 * @returns An array of recent projects
 */
export async function getRecentProjects(limit: number = 5): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, user_profiles:user_id(role)')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Error fetching recent projects: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRecentProjects:', error);
    throw error;
  }
}

/**
 * Get recent clients
 * @param limit Optional limit for the number of clients returned
 * @returns An array of recent client user profiles
 */
export async function getRecentClients(limit: number = 5): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, projects:projects(*)')
      .eq('role', 'client')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Error fetching recent clients: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRecentClients:', error);
    throw error;
  }
}

/**
 * Search projects by client name or description
 * @param searchTerm The term to search for
 * @param userId Optional user ID to filter projects by
 * @param limit Optional limit for the number of results
 * @returns An array of matching projects
 */
export async function searchProjects(searchTerm: string, userId?: string, limit: number = 10): Promise<Project[]> {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .or(`client_name.ilike.%${searchTerm}%,project_description.ilike.%${searchTerm}%,project_address.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    // If user ID is provided and they're not an admin, filter by user ID
    if (userId) {
      const userIsAdmin = await isAdmin(userId);
      
      if (!userIsAdmin) {
        query = query.eq('user_id', userId);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error searching projects: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchProjects:', error);
    throw error;
  }
} 