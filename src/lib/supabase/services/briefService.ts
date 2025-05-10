import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { FormData as BriefDataType } from '@/types';
import type { Database, Json } from '@/lib/supabase/database.types';

// Define a more specific type for what briefService.getById and others will return
export type BriefFull = Database['public']['Tables']['briefs']['Row'] & {
  user_profiles?: { full_name: string | null } | null;
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
      
      // Create the brief with minimal data
      const { data, error } = await supabase
        .from('briefs')
        .insert({ 
          title, 
          owner_id: user.id, 
          data: { 
            projectInfo: { clientName: title },
            budget: {},
            lifestyle: {},
            site: {},
            spaces: [],
            architecture: {},
            contractors: {},
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
      const { data, error } = await supabase
        .from('briefs')
        .select('id, title, owner_id, created_at, updated_at, status')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('[briefService] Error fetching user briefs:', error);
        return { data: [], error };
      }
      
      console.log('[briefService] Retrieved', data?.length || 0, 'briefs for user');
      return { data: (data as BriefFull[]) || [], error: null };
    } catch (unexpectedError) {
      console.error('[briefService] Unexpected error in getUserBriefs:', unexpectedError);
      return { data: [], error: unexpectedError };
    }
  },

  async getAllBriefs(): Promise<{ data: BriefFull[]; error: any }> {
    console.log('[briefService] getAllBriefs called (admin function)');
    
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('id, title, owner_id, created_at, updated_at, status, user_profiles(full_name)')
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
      const { error } = await supabase.from('briefs').delete().eq('id', briefId);
      
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
  }
  // File related methods will be added in Phase 4
}; 