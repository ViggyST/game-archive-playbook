export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action_type: string
          created_at: string | null
          description: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          session_date: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          session_date?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          session_date?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      collection_tags: {
        Row: {
          collection_id: string
          tag_id: string
        }
        Insert: {
          collection_id: string
          tag_id: string
        }
        Update: {
          collection_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_tags_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          catalog_game_id: number
          collection_type: Database["public"]["Enums"]["collection_type_enum"]
          created_at: string
          id: string
          is_manual: boolean | null
          notes: string | null
          player_id: string
          rulebook_url: string | null
        }
        Insert: {
          catalog_game_id: number
          collection_type: Database["public"]["Enums"]["collection_type_enum"]
          created_at?: string
          id?: string
          is_manual?: boolean | null
          notes?: string | null
          player_id: string
          rulebook_url?: string | null
        }
        Update: {
          catalog_game_id?: number
          collection_type?: Database["public"]["Enums"]["collection_type_enum"]
          created_at?: string
          id?: string
          is_manual?: boolean | null
          notes?: string | null
          player_id?: string
          rulebook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_catalog_game_id_fkey"
            columns: ["catalog_game_id"]
            isOneToOne: false
            referencedRelation: "game_catalog"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "collections_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_catalog: {
        Row: {
          avg_rating: number | null
          description: string | null
          game_id: number
          geek_rating: number | null
          imported_at: string | null
          link: string | null
          rank: number | null
          thumbnail: string | null
          title: string
          voters: number | null
          year: number | null
        }
        Insert: {
          avg_rating?: number | null
          description?: string | null
          game_id: number
          geek_rating?: number | null
          imported_at?: string | null
          link?: string | null
          rank?: number | null
          thumbnail?: string | null
          title: string
          voters?: number | null
          year?: number | null
        }
        Update: {
          avg_rating?: number | null
          description?: string | null
          game_id?: number
          geek_rating?: number | null
          imported_at?: string | null
          link?: string | null
          rank?: number | null
          thumbnail?: string | null
          title?: string
          voters?: number | null
          year?: number | null
        }
        Relationships: []
      }
      games: {
        Row: {
          cover_url: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          weight: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          weight?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          weight?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          auth_uid: string | null
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          username: string | null
        }
        Insert: {
          auth_uid?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          username?: string | null
        }
        Update: {
          auth_uid?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          username?: string | null
        }
        Relationships: []
      }
      scores: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          is_winner: boolean | null
          player_id: string | null
          score: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_winner?: boolean | null
          player_id?: string | null
          score?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_winner?: boolean | null
          player_id?: string | null
          score?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          complexity: string | null
          created_at: string | null
          date: string
          deleted_at: string | null
          duration_minutes: number | null
          game_id: string | null
          highlights: string | null
          id: string
          location: string | null
        }
        Insert: {
          complexity?: string | null
          created_at?: string | null
          date: string
          deleted_at?: string | null
          duration_minutes?: number | null
          game_id?: string | null
          highlights?: string | null
          id?: string
          location?: string | null
        }
        Update: {
          complexity?: string | null
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          duration_minutes?: number | null
          game_id?: string | null
          highlights?: string | null
          id?: string
          location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          tag_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tag_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tag_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      session_retag_game: {
        Args: { p_new_game_name: string; p_session_id: string }
        Returns: string
      }
      session_retag_player: {
        Args: {
          p_new_player_name: string
          p_old_player_id: string
          p_session_id: string
        }
        Returns: string
      }
    }
    Enums: {
      collection_type_enum: "owned" | "wishlist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collection_type_enum: ["owned", "wishlist"],
    },
  },
} as const
