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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      concerns: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          page_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          page_url?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          page_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      discovery_settings: {
        Row: {
          accommodation_types: string[] | null
          cleanliness_max: number | null
          cleanliness_min: number | null
          created_at: string
          guest_policy: string[] | null
          id: string
          interests: string[] | null
          max_budget: number | null
          max_distance: number | null
          min_budget: number | null
          pet_preference: string | null
          sleep_schedule: string | null
          smoking_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accommodation_types?: string[] | null
          cleanliness_max?: number | null
          cleanliness_min?: number | null
          created_at?: string
          guest_policy?: string[] | null
          id?: string
          interests?: string[] | null
          max_budget?: number | null
          max_distance?: number | null
          min_budget?: number | null
          pet_preference?: string | null
          sleep_schedule?: string | null
          smoking_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accommodation_types?: string[] | null
          cleanliness_max?: number | null
          cleanliness_min?: number | null
          created_at?: string
          guest_policy?: string[] | null
          id?: string
          interests?: string[] | null
          max_budget?: number | null
          max_distance?: number | null
          min_budget?: number | null
          pet_preference?: string | null
          sleep_schedule?: string | null
          smoking_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          page_url: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          page_url?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          page_url?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          liked_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accommodation_type: string | null
          age: number | null
          bio: string | null
          budget: number | null
          cleanliness_level: string | null
          created_at: string | null
          desired_location: string | null
          early_riser: boolean | null
          email: string
          full_name: string
          guest_preferences: string | null
          has_pets: boolean | null
          hobbies: string[] | null
          id: string
          ideal_flatmate: string | null
          move_in_date: string | null
          night_owl: boolean | null
          occupation: string | null
          profile_completed: boolean | null
          smoker: boolean | null
          updated_at: string | null
          user_id: string
          wants_pets: boolean | null
        }
        Insert: {
          accommodation_type?: string | null
          age?: number | null
          bio?: string | null
          budget?: number | null
          cleanliness_level?: string | null
          created_at?: string | null
          desired_location?: string | null
          early_riser?: boolean | null
          email: string
          full_name: string
          guest_preferences?: string | null
          has_pets?: boolean | null
          hobbies?: string[] | null
          id?: string
          ideal_flatmate?: string | null
          move_in_date?: string | null
          night_owl?: boolean | null
          occupation?: string | null
          profile_completed?: boolean | null
          smoker?: boolean | null
          updated_at?: string | null
          user_id: string
          wants_pets?: boolean | null
        }
        Update: {
          accommodation_type?: string | null
          age?: number | null
          bio?: string | null
          budget?: number | null
          cleanliness_level?: string | null
          created_at?: string | null
          desired_location?: string | null
          early_riser?: boolean | null
          email?: string
          full_name?: string
          guest_preferences?: string | null
          has_pets?: boolean | null
          hobbies?: string[] | null
          id?: string
          ideal_flatmate?: string | null
          move_in_date?: string | null
          night_owl?: boolean | null
          occupation?: string | null
          profile_completed?: boolean | null
          smoker?: boolean | null
          updated_at?: string | null
          user_id?: string
          wants_pets?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          accommodation_type: string | null
          age: number | null
          bio: string | null
          budget: number | null
          cleanliness_level: string | null
          created_at: string | null
          desired_location: string | null
          early_riser: boolean | null
          full_name: string | null
          guest_preferences: string | null
          has_pets: boolean | null
          hobbies: string[] | null
          id: string | null
          ideal_flatmate: string | null
          move_in_date: string | null
          night_owl: boolean | null
          occupation: string | null
          profile_completed: boolean | null
          smoker: boolean | null
          updated_at: string | null
          user_id: string | null
          wants_pets: boolean | null
        }
        Insert: {
          accommodation_type?: string | null
          age?: number | null
          bio?: string | null
          budget?: number | null
          cleanliness_level?: string | null
          created_at?: string | null
          desired_location?: string | null
          early_riser?: boolean | null
          full_name?: string | null
          guest_preferences?: string | null
          has_pets?: boolean | null
          hobbies?: string[] | null
          id?: string | null
          ideal_flatmate?: string | null
          move_in_date?: string | null
          night_owl?: boolean | null
          occupation?: string | null
          profile_completed?: boolean | null
          smoker?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          wants_pets?: boolean | null
        }
        Update: {
          accommodation_type?: string | null
          age?: number | null
          bio?: string | null
          budget?: number | null
          cleanliness_level?: string | null
          created_at?: string | null
          desired_location?: string | null
          early_riser?: boolean | null
          full_name?: string | null
          guest_preferences?: string | null
          has_pets?: boolean | null
          hobbies?: string[] | null
          id?: string | null
          ideal_flatmate?: string | null
          move_in_date?: string | null
          night_owl?: boolean | null
          occupation?: string | null
          profile_completed?: boolean | null
          smoker?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          wants_pets?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
