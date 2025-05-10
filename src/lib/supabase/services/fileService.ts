import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { briefService } from './briefService';

// Types for file management
export interface UploadedFile {
  id: string;
  name: string;
  category: string;
  mime_type: string;
  size_bytes: number;
  path: string;
  url: string;
  created_at: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: any;
}

export interface FileDeleteResult {
  success: boolean;
  error?: any;
}

export const fileService = {
  /**
   * Upload a file for a specific brief
   * @param briefId The ID of the brief to associate the file with
   * @param category The category of the file (e.g., 'inspirations', 'site_documents')
   * @param file The file to upload
   * @returns Promise resolving to an object with success status and file data or error
   */
  async uploadFile(
    briefId: string,
    category: string,
    file: File
  ): Promise<FileUploadResult> {
    console.log('[fileService] uploadFile called for brief:', briefId, 'category:', category, 'file:', file.name);
    
    try {
      // Use the briefService to handle the upload
      const { data, error } = await briefService.uploadFileToBrief(briefId, category, file);
      
      if (error || !data) {
        console.error('[fileService] Error uploading file:', error);
        return { success: false, error: error || new Error('Unknown upload error') };
      }
      
      // Generate a public URL for the file
      const supabase = createBrowserSupabaseClient();
      const { data: publicUrlData } = supabase.storage
        .from(data.bucket_id)
        .getPublicUrl(data.storage_path);
      
      const uploadedFile: UploadedFile = {
        id: data.id,
        name: data.file_name,
        category: data.category,
        mime_type: data.mime_type || 'application/octet-stream',
        size_bytes: data.size_bytes || 0,
        path: data.storage_path,
        url: publicUrlData.publicUrl,
        created_at: data.created_at
      };
      
      console.log('[fileService] File successfully uploaded:', uploadedFile);
      return { success: true, file: uploadedFile };
    } catch (error) {
      console.error('[fileService] Unexpected error uploading file:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Get all files for a brief, optionally filtered by category
   * @param briefId The ID of the brief
   * @param category Optional category to filter by
   * @returns Promise resolving to an array of uploaded files and their metadata
   */
  async getFilesForBrief(
    briefId: string,
    category?: string
  ): Promise<{ files: UploadedFile[], error?: any }> {
    console.log('[fileService] getFilesForBrief called for brief:', briefId, 'category:', category || 'all');
    
    try {
      // Use the briefService to fetch file metadata
      const { data, error } = await briefService.getFilesForBrief(briefId, category);
      
      if (error) {
        console.error('[fileService] Error fetching files:', error);
        return { files: [], error };
      }
      
      if (!data || data.length === 0) {
        console.log('[fileService] No files found for brief:', briefId);
        return { files: [] };
      }
      
      // Generate public URLs for all files
      const supabase = createBrowserSupabaseClient();
      const files: UploadedFile[] = data.map(file => {
        const { data: publicUrlData } = supabase.storage
          .from(file.bucket_id)
          .getPublicUrl(file.storage_path);
        
        return {
          id: file.id,
          name: file.file_name,
          category: file.category,
          mime_type: file.mime_type || 'application/octet-stream',
          size_bytes: file.size_bytes || 0,
          path: file.storage_path,
          url: publicUrlData.publicUrl,
          created_at: file.created_at
        };
      });
      
      console.log('[fileService] Successfully fetched files:', files.length);
      return { files };
    } catch (error) {
      console.error('[fileService] Unexpected error fetching files:', error);
      return { files: [], error };
    }
  },
  
  /**
   * Delete a file from a brief
   * @param fileId The ID of the file to delete
   * @returns Promise resolving to an object with success status or error
   */
  async deleteFile(fileId: string): Promise<FileDeleteResult> {
    console.log('[fileService] deleteFile called for file ID:', fileId);
    
    try {
      const { error } = await briefService.deleteFileFromBrief(fileId);
      
      if (error) {
        console.error('[fileService] Error deleting file:', error);
        return { success: false, error };
      }
      
      console.log('[fileService] File successfully deleted');
      return { success: true };
    } catch (error) {
      console.error('[fileService] Unexpected error deleting file:', error);
      return { success: false, error };
    }
  }
}; 