import { supabase, supabaseService } from '@/lib/supabase/client';
import type { FormData as BriefDataType } from '@/types';

// Re-export BriefDataType for external use if needed, or use it internally
export type { BriefDataType };

// For Phase 1 testing, use the service client to bypass RLS
// In Phase 2 with authentication, this will be switched back to regular supabase client
const client = supabaseService;

export const briefService = {
  async createBrief(title: string, ownerId?: string): Promise<{ id: string | null; error: any }> {
    // For Phase 1 testing only: create brief without specifying owner_id for now
    // This will be properly implemented in Phase 2 with authentication
    const { data, error } = await client
      .from('briefs')
      .insert({ 
        title, 
        owner_id: null, // Explicitly set to null for Phase 1
        data: {} 
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating brief:', error);
      return { id: null, error };
    }
    return { id: data?.id || null, error: null };
  },

  async getBriefById(briefId: string): Promise<{ data: BriefDataType | null; error: any }> {
    const { data, error } = await client
      .from('briefs')
      .select('data') // We only need the 'data' JSONB field for now as per YourBriefDataType
      .eq('id', briefId)
      .single();

    if (error) {
      console.error('Error fetching brief by ID:', error);
      return { data: null, error };
    }
    // The 'data' field from the table IS the BriefDataType (FormData)
    return { data: data?.data as BriefDataType || null, error: null };
  },

  async updateBriefData(briefId: string, briefData: BriefDataType): Promise<{ error: any }> {
    const { error } = await client
      .from('briefs')
      .update({ data: briefData, updated_at: new Date().toISOString() })
      .eq('id', briefId);

    if (error) {
      console.error('Error updating brief data:', error);
    }
    return { error };
  },
}; 