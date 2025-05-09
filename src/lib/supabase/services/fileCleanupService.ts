import { supabase } from '@/lib/supabase/schema';
import { supabaseAdmin } from '@/lib/supabase/adminClient';

interface OrphanedFile {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  category: string;
  publicUrl: string;
  createdAt: string;
  lastModified: string;
  projectId?: string;
  status: 'orphaned_storage' | 'orphaned_db' | 'missing_project';
}

interface CleanupScanResult {
  success: boolean;
  orphanedFiles: OrphanedFile[];
  totalFilesScanned: number;
  error?: any;
}

interface CleanupStats {
  totalStorageFiles: number;
  totalDatabaseRecords: number;
  orphanedStorageFiles: number;
  orphanedDatabaseRecords: number;
  missingProjectReferences: number;
}

/**
 * Scans the storage and database to identify orphaned files.
 * This includes:
 * 1. Files that exist in storage but not referenced in the project_files table
 * 2. Files referenced in project_files but missing from storage
 * 3. Files referenced by non-existent projects
 */
export async function scanForOrphanedFiles(): Promise<CleanupScanResult> {
  try {
    // Get all files from storage using admin client
    const { data: storageFiles, error: storageError } = await supabaseAdmin.storage
      .from('project-files')
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (storageError) {
      throw new Error(`Error accessing storage: ${storageError.message}`);
    }

    // Get all file records from the database
    const { data: dbFiles, error: dbError } = await supabase
      .from('project_files')
      .select('*');

    if (dbError) {
      throw new Error(`Error querying project_files: ${dbError.message}`);
    }

    // Get all projects to check for orphaned file references
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id');

    if (projectsError) {
      throw new Error(`Error querying projects: ${projectsError.message}`);
    }

    // Convert projects array to a Map for quick lookup
    const projectIds = new Map();
    projects.forEach(project => {
      projectIds.set(project.id, true);
    });

    // Create a Map of database files by path for quick lookup
    const dbFilesByPath = new Map();
    dbFiles.forEach(file => {
      dbFilesByPath.set(file.file_path, file);
    });

    const orphanedFiles: OrphanedFile[] = [];

    // Check for files in storage that aren't in the database
    for (const storageFile of storageFiles) {
      // Skip folders
      if (storageFile.id.endsWith('/')) continue;

      // Build the full path (storage bucket uses the parent path + file name)
      const filePath = storageFile.name;

      if (!dbFilesByPath.has(filePath)) {
        // This file exists in storage but not in the database
        const { data: urlData } = supabaseAdmin.storage
          .from('project-files')
          .getPublicUrl(filePath);

        orphanedFiles.push({
          id: storageFile.id,
          path: filePath,
          name: storageFile.name,
          size: storageFile.metadata?.size || 0,
          type: storageFile.metadata?.mimetype || 'unknown',
          category: 'unknown',
          publicUrl: urlData?.publicUrl || '',
          createdAt: storageFile.created_at || '',
          lastModified: storageFile.created_at || '',
          status: 'orphaned_storage'
        });
      }
    }

    // Check for files in the database that:
    // 1. Don't exist in storage
    // 2. Reference non-existent projects
    dbFiles.forEach(dbFile => {
      const exists = storageFiles.some(storageFile => 
        storageFile.name === dbFile.file_path);

      if (!exists) {
        // This file exists in the database but not in storage
        orphanedFiles.push({
          id: dbFile.id,
          path: dbFile.file_path,
          name: dbFile.file_name,
          size: dbFile.file_size || 0,
          type: dbFile.file_type || 'unknown',
          category: dbFile.category || 'unknown',
          publicUrl: '',
          createdAt: dbFile.created_at || '',
          lastModified: dbFile.created_at || '',
          projectId: dbFile.project_id,
          status: 'orphaned_db'
        });
      } else if (!projectIds.has(dbFile.project_id)) {
        // This file references a non-existent project
        const { data: urlData } = supabaseAdmin.storage
          .from('project-files')
          .getPublicUrl(dbFile.file_path);

        orphanedFiles.push({
          id: dbFile.id,
          path: dbFile.file_path,
          name: dbFile.file_name,
          size: dbFile.file_size || 0,
          type: dbFile.file_type || 'unknown',
          category: dbFile.category || 'unknown',
          publicUrl: urlData?.publicUrl || '',
          createdAt: dbFile.created_at || '',
          lastModified: dbFile.created_at || '',
          projectId: dbFile.project_id,
          status: 'missing_project'
        });
      }
    });

    return {
      success: true,
      orphanedFiles,
      totalFilesScanned: storageFiles.length + dbFiles.length
    };
  } catch (error) {
    console.error('Error scanning for orphaned files:', error);
    return {
      success: false,
      orphanedFiles: [],
      totalFilesScanned: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get cleanup statistics
 */
export async function getCleanupStats(): Promise<CleanupStats> {
  try {
    const scanResult = await scanForOrphanedFiles();

    // Get total storage files count
    const { count: totalStorageFiles, error: storageCountError } = await supabaseAdmin.storage
      .from('project-files')
      .list('', {
        limit: 1,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
      .then(result => {
        return { count: result.data?.length || 0, error: result.error };
      });

    if (storageCountError) {
      throw new Error(`Error counting storage files: ${storageCountError.message}`);
    }

    // Get total database records count
    const { count: totalDbRecords, error: dbCountError } = await supabase
      .from('project_files')
      .select('*', { count: 'exact', head: true });

    if (dbCountError) {
      throw new Error(`Error counting database records: ${dbCountError.message}`);
    }

    // Count orphaned files by status
    const orphanedStorageFiles = scanResult.orphanedFiles.filter(
      file => file.status === 'orphaned_storage'
    ).length;

    const orphanedDatabaseRecords = scanResult.orphanedFiles.filter(
      file => file.status === 'orphaned_db'
    ).length;

    const missingProjectReferences = scanResult.orphanedFiles.filter(
      file => file.status === 'missing_project'
    ).length;

    return {
      totalStorageFiles,
      totalDatabaseRecords: totalDbRecords,
      orphanedStorageFiles,
      orphanedDatabaseRecords,
      missingProjectReferences
    };
  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    return {
      totalStorageFiles: 0,
      totalDatabaseRecords: 0,
      orphanedStorageFiles: 0,
      orphanedDatabaseRecords: 0,
      missingProjectReferences: 0
    };
  }
}

/**
 * Deletes an orphaned file based on its status
 * @param file The orphaned file to delete
 */
export async function deleteOrphanedFile(file: OrphanedFile): Promise<{ success: boolean; error?: any }> {
  try {
    switch (file.status) {
      case 'orphaned_storage':
        // Delete from storage only
        const { error: storageError } = await supabaseAdmin.storage
          .from('project-files')
          .remove([file.path]);

        if (storageError) {
          throw new Error(`Error deleting from storage: ${storageError.message}`);
        }
        break;

      case 'orphaned_db':
        // Delete from database only
        const { error: dbError } = await supabase
          .from('project_files')
          .delete()
          .eq('id', file.id);

        if (dbError) {
          throw new Error(`Error deleting from database: ${dbError.message}`);
        }
        break;

      case 'missing_project':
        // Delete from both storage and database
        const { error: storageErr } = await supabaseAdmin.storage
          .from('project-files')
          .remove([file.path]);

        if (storageErr) {
          console.error(`Error deleting from storage: ${storageErr.message}`);
        }

        const { error: dbErr } = await supabase
          .from('project_files')
          .delete()
          .eq('id', file.id);

        if (dbErr) {
          throw new Error(`Error deleting from database: ${dbErr.message}`);
        }
        break;

      default:
        throw new Error('Unknown orphaned file status');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting orphaned file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Bulk cleanup of orphaned files
 * @param files Array of orphaned files to delete
 * @param dryRun If true, only simulates deletion without actually deleting
 */
export async function bulkCleanupOrphanedFiles(
  files: OrphanedFile[],
  dryRun: boolean = false
): Promise<{ success: boolean; deletedCount: number; failedCount: number; errors: any[] }> {
  const errors: any[] = [];
  let deletedCount = 0;
  let failedCount = 0;

  if (dryRun) {
    // Simulation mode - just return success without deleting
    return {
      success: true,
      deletedCount: files.length,
      failedCount: 0,
      errors: []
    };
  }

  // Actually delete files
  for (const file of files) {
    try {
      const result = await deleteOrphanedFile(file);
      if (result.success) {
        deletedCount++;
      } else {
        failedCount++;
        errors.push(`Failed to delete ${file.name}: ${result.error}`);
      }
    } catch (error) {
      failedCount++;
      errors.push(`Error deleting ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    success: deletedCount > 0 && failedCount === 0,
    deletedCount,
    failedCount,
    errors
  };
}

/**
 * Log a cleanup activity to the activities table
 */
export async function logCleanupActivity(
  userId: string,
  details: any
): Promise<{ success: boolean; error?: any }> {
  try {
    // Try using the RPC function first
    const { error: rpcError } = await supabase.rpc('log_system_maintenance', {
      p_user_id: userId,
      p_details: details
    });

    // If the RPC call fails (possibly because the function doesn't exist yet),
    // fall back to a direct insert but using a more compatible activity_type
    if (rpcError) {
      console.warn('RPC log_system_maintenance failed, falling back to direct insert:', rpcError);
      
      const { error: insertError } = await supabase
        .from('activities')
        .insert({
          user_id: userId,
          activity_type: 'system_event', // Use system_event which definitely exists
          details: {
            event: 'file_cleanup',
            ...details
          },
          is_system_generated: true
        });
      
      if (insertError) {
        throw new Error(`Error logging activity: ${insertError.message}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error logging cleanup activity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 