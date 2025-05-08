export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_name: string
          project_address: string | null
          contact_email: string | null
          contact_phone: string | null
          project_type: string | null
          project_description: string | null
          budget_range: string | null
          move_in_preference: string | null
          move_in_date: string | null
          project_goals: string | null
          coordinates: [number, number] | null
          user_id: string
          status: 'brief' | 'sent' | 'complete'
          status_updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          client_name: string
          project_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          project_type?: string | null
          project_description?: string | null
          budget_range?: string | null
          move_in_preference?: string | null
          move_in_date?: string | null
          project_goals?: string | null
          coordinates?: [number, number] | null
          user_id: string
          status?: 'brief' | 'sent' | 'complete'
          status_updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          client_name?: string
          project_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          project_type?: string | null
          project_description?: string | null
          budget_range?: string | null
          move_in_preference?: string | null
          move_in_date?: string | null
          project_goals?: string | null
          coordinates?: [number, number] | null
          user_id?: string
          status?: 'brief' | 'sent' | 'complete'
          status_updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rooms: {
        Row: {
          id: string
          created_at: string
          project_id: string
          type: string
          quantity: number
          description: string | null
          is_custom: boolean
          custom_name: string | null
          display_name: string | null
          primary_users: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          type: string
          quantity: number
          description?: string | null
          is_custom: boolean
          custom_name?: string | null
          display_name?: string | null
          primary_users?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          type?: string
          quantity?: number
          description?: string | null
          is_custom?: boolean
          custom_name?: string | null
          display_name?: string | null
          primary_users?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      occupants: {
        Row: {
          id: string
          created_at: string
          project_id: string
          type: string
          name: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          type: string
          name: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          type?: string
          name?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "occupants_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      professionals: {
        Row: {
          id: string
          created_at: string
          project_id: string
          type: string
          name: string
          contact: string | null
          notes: string | null
          is_custom: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          type: string
          name: string
          contact?: string | null
          notes?: string | null
          is_custom?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          type?: string
          name?: string
          contact?: string | null
          notes?: string | null
          is_custom?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "professionals_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      inspiration_entries: {
        Row: {
          id: string
          created_at: string
          project_id: string
          link: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          link: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          link?: string
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspiration_entries_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_files: {
        Row: {
          id: string
          created_at: string
          project_id: string
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          file_path?: string
          file_name?: string
          file_type?: string
          file_size?: number
          category?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_settings: {
        Row: {
          id: string
          created_at: string
          project_id: string
          budget_flexibility: string | null
          budget_priorities: string[] | null
          budget_notes: string | null
          lifestyle_notes: string | null
          home_feeling: string | null
          site_constraints: string[] | null
          site_access: string | null
          site_views: string | null
          outdoor_spaces: string[] | null
          site_notes: string | null
          home_level_type: string | null
          level_assignment_notes: string | null
          home_size: string | null
          eliminable_spaces: string | null
          room_arrangement: string | null
          preferred_styles: string[] | null
          material_preferences: string[] | null
          external_materials_selected: string[] | null
          internal_materials_selected: string[] | null
          sustainability_features: string[] | null
          technology_requirements: string[] | null
          architecture_notes: string | null
          communication_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          budget_flexibility?: string | null
          budget_priorities?: string[] | null
          budget_notes?: string | null
          lifestyle_notes?: string | null
          home_feeling?: string | null
          site_constraints?: string[] | null
          site_access?: string | null
          site_views?: string | null
          outdoor_spaces?: string[] | null
          site_notes?: string | null
          home_level_type?: string | null
          level_assignment_notes?: string | null
          home_size?: string | null
          eliminable_spaces?: string | null
          room_arrangement?: string | null
          preferred_styles?: string[] | null
          material_preferences?: string[] | null
          external_materials_selected?: string[] | null
          internal_materials_selected?: string[] | null
          sustainability_features?: string[] | null
          technology_requirements?: string[] | null
          architecture_notes?: string | null
          communication_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          budget_flexibility?: string | null
          budget_priorities?: string[] | null
          budget_notes?: string | null
          lifestyle_notes?: string | null
          home_feeling?: string | null
          site_constraints?: string[] | null
          site_access?: string | null
          site_views?: string | null
          outdoor_spaces?: string[] | null
          site_notes?: string | null
          home_level_type?: string | null
          level_assignment_notes?: string | null
          home_size?: string | null
          eliminable_spaces?: string | null
          room_arrangement?: string | null
          preferred_styles?: string[] | null
          material_preferences?: string[] | null
          external_materials_selected?: string[] | null
          internal_materials_selected?: string[] | null
          sustainability_features?: string[] | null
          technology_requirements?: string[] | null
          architecture_notes?: string | null
          communication_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_settings_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      summaries: {
        Row: {
          id: string
          created_at: string
          project_id: string
          generated_summary: string | null
          edited_summary: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          generated_summary?: string | null
          edited_summary?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          generated_summary?: string | null
          edited_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "summaries_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          role: 'admin' | 'client'
          first_name: string | null
          last_name: string | null
          company: string | null
          phone: string | null
          notification_preferences: Json
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'client'
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          phone?: string | null
          notification_preferences?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'client'
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          phone?: string | null
          notification_preferences?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activities: {
        Row: {
          id: string
          created_at: string
          project_id: string | null
          user_id: string | null
          activity_type: 'status_change' | 'comment' | 'document_upload' | 'system_event'
          details: Json
          is_system_generated: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          project_id?: string | null
          user_id?: string | null
          activity_type: 'status_change' | 'comment' | 'document_upload' | 'system_event'
          details: Json
          is_system_generated?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string | null
          user_id?: string | null
          activity_type?: 'status_change' | 'comment' | 'document_upload' | 'system_event'
          details?: Json
          is_system_generated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "activities_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
