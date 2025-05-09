import { supabase } from '@/lib/supabase/schema';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type Status = 'brief' | 'sent' | 'complete';

/**
 * Get all projects with a specific status
 * @param status The status to filter by (brief, sent, complete)
 * @param limit Optional limit for the number of projects returned
 * @param offset Optional offset for pagination
 * @returns An array of projects with the specified status
 */
export async function getProjectsByStatus(status: Status, limit?: number, offset?: number) {
  try {
    const query = supabase
      .from('projects')
      .select('*, user_profiles(role)')
      .eq('status', status)
      .order('updated_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching projects with status ${status}: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProjectsByStatus:', error);
    throw error;
  }
}

/**
 * Get projects summary with count by status
 * @returns An object with counts for each status
 */
export async function getProjectStatusSummary() {
  try {
    // Get count of projects grouped by status
    const { data, error } = await supabase
      .from('projects')
      .select('status')
      .not('status', 'is', null); // Only count projects with a status
    
    if (error) {
      throw new Error(`Error fetching project status summary: ${error.message}`);
    }
    
    // Calculate counts
    const summary = {
      brief: 0,
      sent: 0,
      complete: 0,
      total: data.length
    };
    
    // Count each status
    data.forEach(project => {
      if (project.status === 'brief') summary.brief++;
      else if (project.status === 'sent') summary.sent++;
      else if (project.status === 'complete') summary.complete++;
    });
    
    return summary;
  } catch (error) {
    console.error('Error in getProjectStatusSummary:', error);
    throw error;
  }
}

/**
 * Validate if a status transition is allowed
 * Rules:
 * - brief -> sent: allowed
 * - sent -> complete: allowed
 * - complete -> sent: allowed (for revisions)
 * - sent -> brief: allowed (for revisions)
 * - brief -> complete: not allowed (must go through sent first)
 * - complete -> brief: not allowed (too big of a jump back)
 * 
 * @param currentStatus The current status of the project
 * @param newStatus The new status to transition to
 * @returns True if the transition is valid, false otherwise
 */
export function isValidStatusTransition(currentStatus: Status, newStatus: Status): boolean {
  if (currentStatus === newStatus) {
    return true; // No change, always valid
  }
  
  const allowedTransitions: Record<Status, Status[]> = {
    'brief': ['sent'],
    'sent': ['complete', 'brief'],
    'complete': ['sent']
  };
  
  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Change the status of a project
 * @param projectId The ID of the project to update
 * @param newStatus The new status to set
 * @param userId The ID of the user making the change (for activity logging)
 * @returns The updated project
 */
export async function changeProjectStatus(projectId: string, newStatus: Status, userId: string) {
  try {
    // First get the current project to check the current status
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single();
    
    if (fetchError) {
      throw new Error(`Error fetching project: ${fetchError.message}`);
    }
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }
    
    const currentStatus = project.status as Status;
    
    // Validate the status transition
    if (!isValidStatusTransition(currentStatus, newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    
    // Update the project status
    // This will automatically trigger the handle_status_change database trigger
    // which will log the status change in the activities table
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ 
        status: newStatus,
        status_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (updateError) {
      throw new Error(`Error updating project status: ${updateError.message}`);
    }
    
    // No need to manually log the activity since it's handled by the database trigger
    // This removes the redundant activity log entry
    
    return updatedProject;
  } catch (error) {
    console.error('Error in changeProjectStatus:', error);
    throw error;
  }
}

/**
 * Get all possible status values
 * @returns Array of valid status values
 */
export function getAllStatusValues(): Status[] {
  return ['brief', 'sent', 'complete'];
}

/**
 * Get the display name for a status value
 * @param status The status value
 * @returns A human-readable display name
 */
export function getStatusDisplayName(status: Status): string {
  const displayNames: Record<Status, string> = {
    'brief': 'Brief',
    'sent': 'Sent',
    'complete': 'Complete'
  };
  
  return displayNames[status] || status;
} 