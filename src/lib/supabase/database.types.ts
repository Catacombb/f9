export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brief_files: {
        Row: {
          brief_id: string
          bucket_id: string
          category: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          owner_id: string
          size_bytes: number | null
          storage_path: string
          updated_at: string
        }
        Insert: {
          brief_id: string
          bucket_id?: string
          category: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          owner_id: string
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
        }
        Update: {
          brief_id?: string
          bucket_id?: string
          category?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          owner_id?: string
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brief_files_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      briefs: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          owner_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          owner_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          owner_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_project_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          project_count: number
          project_ids: string[]
          created_at_timestamps: string[]
        }[]
      }
      clean_duplicate_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          kept_project_id: string
          deleted_count: number
        }[]
      }
      create_project_for_client: {
        Args: {
          p_admin_id: string
          p_client_id: string
          p_client_name: string
          p_description?: string
        }
        Returns: {
          project_id: string
          success: boolean
          message: string
        }[]
      }
      delete_project_and_related_data: {
        Args: { p_project_id: string }
        Returns: undefined
      }
      get_available_clients: {
        Args: { p_admin_id: string }
        Returns: {
          client_id: string
          email: string
          first_name: string
          last_name: string
          company: string
          project_count: number
        }[]
      }
      get_or_create_project: {
        Args:
          | { p_user_id: string }
          | { p_user_id: string; p_target_user_id?: string }
          | {
              p_user_id: string
              p_target_user_id?: string
              p_request_id?: string
            }
        Returns: {
          project_id: string
          is_new_project: boolean
        }[]
      }
      get_recent_diagnostic_sessions: {
        Args: { limit_count?: number }
        Returns: Json[]
      }
      get_user_email_by_id: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_project_creation: {
        Args: {
          p_user_id: string
          p_action: string
          p_details: Json
          p_success: boolean
        }
        Returns: string
      }
      log_project_diagnostic: {
        Args: {
          p_user_id: string
          p_operation: string
          p_status: string
          p_step?: string
          p_details?: Json
          p_error_message?: string
          p_error_details?: string
          p_request_id?: string
          p_execution_time_ms?: number
        }
        Returns: string
      }
      log_system_maintenance: {
        Args: { p_user_id: string; p_details: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const 