import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { FormData as BriefDataType } from '@/types';
import type { Database, Json } from '@/lib/supabase/database.types';

// Define a more specific type for what briefService.getById and others will return
export type BriefFull = Database['public']['Tables']['briefs']['Row'] & {
  user_profiles?: { full_name: string | null } | null;
  // Add fields for proposal workflow
  proposal_file_id?: string;
  brief_ready_at?: string;
  proposal_sent_at?: string;
  proposal_accepted_at?: string;
  acceptance_message?: string;
};

const supabase = createBrowserSupabaseClient();

// Re-export BriefDataType for external use if needed
export type { BriefDataType };

export const briefService = {
  async createBrief(title: string): Promise<{ id: string | null; error: any }> {
    console.log('[briefService] createBrief called with title:', title);
    
    try {
      // Simplified approach - just grab the user session directly
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        console.error('[briefService] No authenticated user found');
        return { id: null, error: new Error('Please sign in to create a brief') };
      }
      
      console.log('[briefService] Creating brief for user:', user.id);
      
      // Fetch the user's full name from user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('[briefService] Error fetching user profile:', profileError);
        // Continue with empty name if there's an error
      }
      
      const userFullName = profileData?.full_name || '';
      const userEmail = user.email || '';
      
      // Create the brief with minimal data
      const { data, error } = await supabase
        .from('briefs')
        .insert({ 
          title, 
          owner_id: user.id, 
          data: { 
            title: title,
            clientInfo: { 
              name: userFullName,
              email: userEmail 
            },
            projectInfo: { 
              briefName: title,
              clientName: userFullName 
            },
            budget: {},
            lifestyle: {
              occupantEntries: [] // Initialize as empty array
            },
            site: {},
            spaces: {
              rooms: [], // Ensure rooms array is properly initialized
              homeLevelType: '',
              additionalNotes: '',
              homeSize: '',
              eliminableSpaces: ''
            },
            architecture: {},
            contractors: {
              professionals: [], // Initialize professionals array
              goToTender: false,
              wantF9Build: false,
              preferredBuilder: '',
              structuralEngineer: '',
              civilEngineer: '',
              otherConsultants: '',
              additionalNotes: ''
            },
            communication: {},
            uploads: {},
            summary: {}
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('[briefService] Error creating brief:', error);
        return { id: null, error };
      }
      
      if (!data || !data.id) {
        console.error('[briefService] Insert succeeded but no ID returned');
        return { id: null, error: new Error('Brief creation succeeded but no ID was returned') };
      }
      
      console.log('[briefService] Brief successfully created with ID:', data.id);
      return { id: data?.id || null, error: null };
    } catch (error) {
      console.error('[briefService] Unexpected error:', error);
      return { id: null, error };
    }
  },

  async getBriefById(briefId: string): Promise<{ data: BriefFull | null; error: any }> {
    console.log('[briefService] getBriefById called with ID:', briefId);
    
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('id, title, data, owner_id, created_at, updated_at, status')
        .eq('id', briefId)
        .single();
      
      if (error) {
        console.error('[briefService] Error fetching brief:', error);
        return { data: null, error };
      }
      
      if (!data) {
        console.log('[briefService] No brief found with ID:', briefId);
        return { data: null, error: null };
      }
      
      console.log('[briefService] Brief successfully retrieved:', data.id);
      return { data: data as BriefFull, error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in getBriefById:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
  },

  async getUserBriefs(): Promise<{ data: BriefFull[]; error: any }> {
    console.log('[briefService] getUserBriefs called');
    
    try {
      // Get the current user's ID from session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        console.error('[briefService] No authenticated user found');
        return { data: [], error: new Error('User not authenticated') };
      }
      
      // Explicitly filter by owner_id for clarity and safety
      const { data, error } = await supabase
        .from('briefs')
        .select('*')  // Select all columns including proposal_file_id
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('[briefService] Error fetching user briefs:', error);
        return { data: [], error };
      }
      
      console.log('[briefService] Retrieved', data?.length || 0, 'briefs for user:', user.id);
      return { data: (data as BriefFull[]) || [], error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in getUserBriefs:', unexpectedError);
      return { data: [], error: unexpectedError };
    }
  },

  async getAllBriefs(): Promise<{ data: BriefFull[]; error: any }> {
    console.log('[briefService] getAllBriefs called (admin function)');
    
    try {
      // Get the current user's session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        console.error('[briefService] No authenticated user found');
        return { data: [], error: new Error('User not authenticated') };
      }
      
      // This function relies on RLS policies to limit data based on admin status
      const { data, error } = await supabase
        .from('briefs')
        .select('*, user_profiles(full_name)')  // Select all columns including proposal_file_id
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('[briefService] Error fetching all briefs:', error);
        return { data: [], error };
      }
      
      console.log('[briefService] Retrieved', data?.length || 0, 'briefs (admin view)');
      return { data: (data as BriefFull[]) || [], error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in getAllBriefs:', unexpectedError);
      return { data: [], error: unexpectedError };
    }
  },
  
  async updateBriefData(briefId: string, briefData: BriefDataType): Promise<{ error: any }> {
    console.log('[briefService] updateBriefData called for ID:', briefId);
    
    try {
      const { error } = await supabase
        .from('briefs')
        .update({ 
          data: briefData as unknown as Json, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', briefId);
      
      if (error) {
        console.error('[briefService] Error updating brief data:', error);
        return { error };
      }
      
      console.log('[briefService] Brief data successfully updated for ID:', briefId);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in updateBriefData:', unexpectedError);
      return { error: unexpectedError };
    }
  },

  async updateSection(briefId: string, section: string, sectionData: any): Promise<{ error: any }> {
    console.log('[briefService] updateSection called for ID:', briefId, 'section:', section);
    
    try {
      const { data: existingBrief, error: fetchError } = await supabase
        .from('briefs')
        .select('data')
        .eq('id', briefId)
        .single();
      
      if (fetchError) {
        console.error('[briefService] Error fetching brief for section update:', fetchError);
        return { error: fetchError };
      }
      
      if (!existingBrief) {
        console.error('[briefService] Brief not found for section update, ID:', briefId);
        return { error: new Error('Brief not found') };
      }
      
      const currentData = (existingBrief.data as Json || {}) as { [key: string]: Json | undefined };
      const newData: Json = { ...currentData, [section]: sectionData as Json };
      
      const { error } = await supabase
        .from('briefs')
        .update({ data: newData, updated_at: new Date().toISOString() })
        .eq('id', briefId);
      
      if (error) {
        console.error('[briefService] Error updating section:', error);
        return { error };
      }
      
      console.log('[briefService] Section successfully updated for ID:', briefId, 'section:', section);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in updateSection:', unexpectedError);
      return { error: unexpectedError };
    }
  },
  
  async deleteBrief(briefId: string): Promise<{ error: any }> {
    console.log('[briefService] deleteBrief called for ID:', briefId);
    
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefId);
      
      if (error) {
        console.error('[briefService] Error deleting brief:', error);
        return { error };
      }
      
      console.log('[briefService] Brief successfully deleted, ID:', briefId);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in deleteBrief:', unexpectedError);
      return { error: unexpectedError };
    }
  },

  async updateBriefTitle(briefId: string, title: string): Promise<{ error: any }> {
    console.log('[briefService] updateBriefTitle called for ID:', briefId, 'with title:', title);
    
    try {
      // Update the brief title in the briefs table
      const { error } = await supabase
        .from('briefs')
        .update({ 
          title,
          updated_at: new Date().toISOString() 
        })
        .eq('id', briefId);
      
      if (error) {
        console.error('[briefService] Error updating brief title:', error);
        return { error };
      }
      
      // Also get the current brief data to update the title within the data JSON too
      const { data: existingBrief, error: fetchError } = await supabase
        .from('briefs')
        .select('data')
        .eq('id', briefId)
        .single();
      
      if (fetchError) {
        console.error('[briefService] Error fetching brief data for title update:', fetchError);
        // We still consider the update successful even if we can't update the inner data
        console.log('[briefService] Brief title updated in table but not in data JSON');
        return { error: null };
      }
      
      if (existingBrief && existingBrief.data) {
        const briefData = existingBrief.data as any;
        
        // Update title references in the inner data structure
        if (briefData.title !== undefined) {
          briefData.title = title;
        }
        
        if (briefData.projectInfo && briefData.projectInfo.briefName !== undefined) {
          briefData.projectInfo.briefName = title;
        }
        
        // Save the updated data back
        const { error: updateError } = await supabase
          .from('briefs')
          .update({
            data: briefData as Json,
            updated_at: new Date().toISOString()
          })
          .eq('id', briefId);
        
        if (updateError) {
          console.error('[briefService] Error updating brief inner data:', updateError);
          // We still consider the update successful since the main title was updated
        }
      }
      
      console.log('[briefService] Brief title successfully updated for ID:', briefId);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in updateBriefTitle:', unexpectedError);
      return { error: unexpectedError };
    }
  },

  // --- File Management Methods ---

  async uploadFileToBrief(
    briefId: string, 
    category: string, 
    file: File
  ): Promise<{ data: Database['public']['Tables']['brief_files']['Row'] | null; error: any }> {
    console.log('[briefService] uploadFileToBrief called for brief:', briefId, 'category:', category, 'file:', file.name);
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('[briefService] No authenticated user found for file upload.', sessionError);
        return { data: null, error: sessionError || new Error('User not authenticated') };
      }
      const user = sessionData.session.user;

      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${user.id}/${briefId}/${category}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const bucketName = 'brief_uploads';

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, file, {
          cacheControl: '3600', // Cache for 1 hour
          upsert: false, // Don't upsert, always create new
           // Pass owner_id in metadata for RLS on storage.objects INSERT
          metadata: { owner_id: user.id } 
        });

      if (uploadError) {
        console.error('[briefService] Error uploading file to storage:', uploadError);
        return { data: null, error: uploadError };
      }

      if (!uploadData || !uploadData.path) {
        console.error('[briefService] File upload to storage succeeded but no path returned.');
        return { data: null, error: new Error('File upload to storage failed to return path.') };
      }
      
      console.log('[briefService] File uploaded to storage path:', uploadData.path);

      // Insert metadata into brief_files table
      const { data: dbData, error: dbError } = await supabase
        .from('brief_files')
        .insert({
          brief_id: briefId,
          owner_id: user.id,
          category,
          file_name: file.name,
          storage_path: uploadData.path, // Use the path from storage upload response
          bucket_id: bucketName,
          mime_type: file.type,
          size_bytes: file.size,
        })
        .select()
        .single();

      if (dbError) {
        console.error('[briefService] Error inserting file metadata to DB:', dbError);
        // Attempt to delete the orphaned file from storage if DB insert fails
        await supabase.storage.from(bucketName).remove([uploadData.path]);
        console.log('[briefService] Cleaned up orphaned file from storage:', uploadData.path);
        return { data: null, error: dbError };
      }

      console.log('[briefService] File metadata successfully inserted:', dbData);
      return { data: dbData, error: null };

    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in uploadFileToBrief:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
  },

  async getFilesForBrief(
    briefId: string, 
    category?: string
  ): Promise<{ data: Database['public']['Tables']['brief_files']['Row'][] | null; error: any }> {
    console.log('[briefService] getFilesForBrief called for brief:', briefId, 'category:', category || 'all');
    
    try {
      let query = supabase
        .from('brief_files')
        .select('*')
        .eq('brief_id', briefId)
        .order('created_at', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[briefService] Error fetching files for brief:', error);
        return { data: null, error };
      }

      console.log('[briefService] Successfully fetched', data?.length || 0, 'files for brief:', briefId);
      return { data, error: null };

    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in getFilesForBrief:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
  },

  async deleteFileFromBrief(
    fileId: string
  ): Promise<{ error: any }> {
    console.log('[briefService] deleteFileFromBrief called for file ID:', fileId);
    
    try {
      // First, get the file metadata to find its storage path
      const { data: fileData, error: fetchError } = await supabase
        .from('brief_files')
        .select('storage_path, bucket_id')
        .eq('id', fileId)
        .single();

      if (fetchError || !fileData) {
        console.error('[briefService] Error fetching file metadata for deletion or file not found:', fetchError);
        return { error: fetchError || new Error('File not found') };
      }

      // Delete file from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from(fileData.bucket_id)
        .remove([fileData.storage_path]);

      if (storageError) {
        // Log error but proceed to delete DB record if storage deletion fails (e.g. file already gone)
        console.warn('[briefService] Error deleting file from storage (might be already deleted):', storageError);
      } else {
        console.log('[briefService] File successfully deleted from storage:', fileData.storage_path);
      }

      // Delete metadata from brief_files table
      const { error: dbError } = await supabase
        .from('brief_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('[briefService] Error deleting file metadata from DB:', dbError);
        return { error: dbError };
      }

      console.log('[briefService] File metadata successfully deleted for ID:', fileId);
      return { error: null };

    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in deleteFileFromBrief:', unexpectedError);
      return { error: unexpectedError };
    }
  },

  // --- Status Management Methods ---

  async updateBriefStatus(
    briefId: string, 
    status: 'draft' | 'brief_ready' | 'proposal_sent' | 'proposal_accepted',
    metadata?: {
      proposalFileId?: string;
      acceptanceMessage?: string;
    }
  ): Promise<{ error: any }> {
    console.log('[briefService] updateBriefStatus called for ID:', briefId, 'new status:', status);
    
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      // Add appropriate timestamps based on status
      if (status === 'brief_ready') {
        updateData.brief_ready_at = new Date().toISOString();
      } else if (status === 'proposal_sent' && metadata?.proposalFileId) {
        updateData.proposal_sent_at = new Date().toISOString();
        updateData.proposal_file_id = metadata.proposalFileId;
      } else if (status === 'proposal_accepted') {
        updateData.proposal_accepted_at = new Date().toISOString();
        if (metadata?.acceptanceMessage) {
          updateData.acceptance_message = metadata.acceptanceMessage;
        }
      }
      
      const { error } = await supabase
        .from('briefs')
        .update(updateData)
        .eq('id', briefId);
      
      if (error) {
        console.error('[briefService] Error updating brief status:', error);
        return { error };
      }
      
      console.log('[briefService] Brief status successfully updated to', status, 'for ID:', briefId);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in updateBriefStatus:', unexpectedError);
      return { error: unexpectedError };
    }
  },
  
  async uploadProposal(
    briefId: string,
    file: File
  ): Promise<{ fileId: string | null; error: any }> {
    console.log('[briefService] uploadProposal called for brief:', briefId, 'file:', file.name);
    
    try {
      // Upload proposal PDF using the existing file upload mechanism
      const { data: fileData, error: uploadError } = await this.uploadFileToBrief(
        briefId,
        'proposal',
        file
      );
      
      if (uploadError || !fileData) {
        console.error('[briefService] Error uploading proposal file:', uploadError);
        return { fileId: null, error: uploadError };
      }
      
      // Update brief status to proposal_sent with the file ID
      const { error: statusError } = await this.updateBriefStatus(
        briefId,
        'proposal_sent',
        { proposalFileId: fileData.id }
      );
      
      if (statusError) {
        console.error('[briefService] Error updating brief status after proposal upload:', statusError);
        return { fileId: fileData.id, error: statusError };
      }
      
      console.log('[briefService] Proposal successfully uploaded for brief:', briefId);
      return { fileId: fileData.id, error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in uploadProposal:', unexpectedError);
      return { fileId: null, error: unexpectedError };
    }
  },
  
  async acceptProposal(
    briefId: string,
    acceptanceMessage?: string
  ): Promise<{ error: any }> {
    console.log('[briefService] acceptProposal called for brief:', briefId);
    
    try {
      // First verify the user is the owner of this brief
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        console.error('[briefService] No authenticated user found for accepting proposal');
        return { error: new Error('User not authenticated') };
      }
      
      // Get the brief to check ownership
      const { data: brief, error: fetchError } = await supabase
        .from('briefs')
        .select('owner_id, status')
        .eq('id', briefId)
        .single();
      
      if (fetchError || !brief) {
        console.error('[briefService] Error fetching brief for ownership check:', fetchError);
        return { error: fetchError || new Error('Brief not found') };
      }
      
      // Verify ownership
      if (brief.owner_id !== user.id) {
        console.error('[briefService] User attempted to accept proposal for brief they do not own');
        return { error: new Error('You are not authorized to accept this proposal') };
      }
      
      // Verify status is proposal_sent
      if (brief.status !== 'proposal_sent') {
        console.error('[briefService] Cannot accept proposal: brief is not in proposal_sent status');
        return { error: new Error('This brief does not have a proposal to accept') };
      }
      
      // Update the status to accepted
      const { error: updateError } = await this.updateBriefStatus(
        briefId,
        'proposal_accepted',
        { acceptanceMessage }
      );
      
      if (updateError) {
        console.error('[briefService] Error updating brief status to accepted:', updateError);
        return { error: updateError };
      }
      
      console.log('[briefService] Proposal successfully accepted for brief:', briefId);
      return { error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in acceptProposal:', unexpectedError);
      return { error: unexpectedError };
    }
  }
}; 