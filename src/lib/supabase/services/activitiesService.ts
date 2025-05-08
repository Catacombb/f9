import { supabase } from '@/lib/supabase/schema';
import { Database } from '@/lib/supabase/database.types';
import { getUserRole } from './roleService';

type Activity = Database['public']['Tables']['activities']['Row'];
export type ActivityType = 'status_change' | 'comment' | 'document_upload' | 'system_event';

interface LogActivityParams {
  projectId: string;
  userId: string;
  activityType: ActivityType;
  details?: Record<string, any>;
  isSystemGenerated?: boolean;
}

/**
 * Log a new activity
 * @param params Object containing activity details
 * @returns The created activity or null if there was an error
 */
export async function logActivity(params: LogActivityParams): Promise<Activity | null> {
  try {
    const { projectId, userId, activityType, details, isSystemGenerated = false } = params;
    
    const { data, error } = await supabase
      .from('activities')
      .insert({
        project_id: projectId,
        user_id: userId,
        activity_type: activityType,
        details: details || {},
        is_system_generated: isSystemGenerated
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error logging activity:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in logActivity:', error);
    return null;
  }
}

/**
 * Get activities for a specific project
 * @param projectId The ID of the project to get activities for
 * @param limit Optional limit for the number of activities returned
 * @param offset Optional offset for pagination
 * @returns An array of activities for the specified project
 */
export async function getProjectActivities(projectId: string, limit?: number, offset?: number): Promise<Activity[]> {
  try {
    const query = supabase
      .from('activities')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching project activities: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProjectActivities:', error);
    throw error;
  }
}

/**
 * Get activities for a specific user
 * @param userId The ID of the user to get activities for
 * @param limit Optional limit for the number of activities returned
 * @param offset Optional offset for pagination
 * @returns An array of activities for the specified user
 */
export async function getUserActivities(userId: string, limit?: number, offset?: number): Promise<Activity[]> {
  try {
    const isUserAdmin = await getUserRole(userId) === 'admin';
    
    // If user is an admin, they can see all activities
    // If user is a client, they can only see activities for their projects
    let query = supabase
      .from('activities')
      .select(`
        *,
        projects:project_id(id, client_name, user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (!isUserAdmin) {
      // For clients, filter activities where the project belongs to them
      query = query.eq('projects.user_id', userId);
    }
    
    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching user activities: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserActivities:', error);
    throw error;
  }
}

/**
 * Get recent activities across all projects (admin only)
 * @param limit Optional limit for the number of activities returned
 * @param offset Optional offset for pagination
 * @returns An array of recent activities
 */
export async function getRecentActivities(limit?: number, offset?: number): Promise<Activity[]> {
  try {
    const query = supabase
      .from('activities')
      .select(`
        *,
        projects:project_id(client_name)
      `)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching recent activities: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRecentActivities:', error);
    throw error;
  }
}

/**
 * Group activities by date for timeline display
 * @param activities The activities to group
 * @returns An object with dates as keys and arrays of activities as values
 */
export function groupActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
  const groupedActivities: Record<string, Activity[]> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.created_at).toLocaleDateString();
    
    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    
    groupedActivities[date].push(activity);
  });
  
  return groupedActivities;
}

/**
 * Get activity timeline for a project
 * @param projectId The ID of the project to get timeline for
 * @returns A date-grouped object of activities
 */
export async function getProjectTimeline(projectId: string): Promise<Record<string, Activity[]>> {
  const activities = await getProjectActivities(projectId);
  return groupActivitiesByDate(activities);
}

/**
 * Get a human-readable description for an activity
 * @param activity The activity to describe
 * @returns A human-readable description of the activity
 */
export function getActivityDescription(activity: Activity): string {
  const activityTypeDescriptions: Record<ActivityType, string> = {
    'status_change': 'changed project status',
    'comment': 'added a comment',
    'document_upload': 'uploaded a document',
    'system_event': 'system event occurred'
  };
  
  const baseDescription = activityTypeDescriptions[activity.activity_type as ActivityType] || 'performed an action';
  
  // For status changes, include the from/to statuses
  if (activity.activity_type === 'status_change' && activity.details) {
    const details = activity.details as Record<string, any>;
    if (details.previous_status && details.new_status) {
      return `${baseDescription} from ${details.previous_status} to ${details.new_status}`;
    }
  }
  
  return baseDescription;
} 