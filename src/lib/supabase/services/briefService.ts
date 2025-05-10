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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { id: null, error: userError || new Error('User not authenticated') };
    }
    const initialBriefData: Json = {
      projectInfo: {},
      budget: {},
      lifestyle: {},
      site: {},
      spaces: [],
      architecture: {},
      contractors: {},
      communication: {},
      uploads: {},
      summary: {}
    };
    const { data, error } = await supabase
      .from('briefs')
      .insert({ title, owner_id: user.id, data: initialBriefData })
      .select('id')
      .single();
    return { id: data?.id || null, error };
  },

  async getBriefById(briefId: string): Promise<{ data: BriefFull | null; error: any }> {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, data, owner_id, created_at, updated_at, status')
      .eq('id', briefId)
      .single();
    return { data: data as BriefFull | null, error };
  },

  async getUserBriefs(): Promise<{ data: BriefFull[]; error: any }> {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, owner_id, created_at, updated_at, status')
      .order('updated_at', { ascending: false });
    return { data: (data as BriefFull[]) || [], error };
  },

  async getAllBriefs(): Promise<{ data: BriefFull[]; error: any }> {
    // This is for admin use
    // It requires RLS to allow admins to see all, or will only return user's briefs
    const { data, error } = await supabase
      .from('briefs')
      .select('id, title, owner_id, created_at, updated_at, status, user_profiles(full_name)')
      .order('updated_at', { ascending: false });
    return { data: (data as BriefFull[]) || [], error };
  },
  
  async updateBriefData(briefId: string, briefData: BriefDataType): Promise<{ error: any }> {
    const { error } = await supabase
      .from('briefs')
      .update({ data: briefData as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', briefId);
    return { error };
  },

  async updateSection(briefId: string, section: string, sectionData: any): Promise<{ error: any }> {
    const { data: existingBrief, error: fetchError } = await supabase
      .from('briefs')
      .select('data')
      .eq('id', briefId)
      .single();
    if (fetchError || !existingBrief) {
      return { error: fetchError || new Error('Brief not found') };
    }
    const currentData = (existingBrief.data as Json || {}) as { [key: string]: Json | undefined };
    const newData: Json = { ...currentData, [section]: sectionData as Json };
    const { error } = await supabase
      .from('briefs')
      .update({ data: newData, updated_at: new Date().toISOString() })
      .eq('id', briefId);
    return { error };
  },
  
  async deleteBrief(briefId: string): Promise<{ error: any }> {
    // Cascade delete in the DB should handle related entries if configured
    const { error } = await supabase.from('briefs').delete().eq('id', briefId);
    return { error };
  }
  // File related methods will be added in Phase 4
}; 