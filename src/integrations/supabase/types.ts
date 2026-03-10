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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          hotspot_id: string
          id: string
          risk_score: number
          sent_to: string
          status: string
          village: string
        }
        Insert: {
          created_at?: string
          hotspot_id: string
          id?: string
          risk_score: number
          sent_to: string
          status?: string
          village: string
        }
        Update: {
          created_at?: string
          hotspot_id?: string
          id?: string
          risk_score?: number
          sent_to?: string
          status?: string
          village?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_hotspot_id_fkey"
            columns: ["hotspot_id"]
            isOneToOne: false
            referencedRelation: "hotspots"
            referencedColumns: ["id"]
          },
        ]
      }
      asha_workers: {
        Row: {
          area: string
          created_at: string
          id: string
          name: string
          phone: string
          status: string
          village_name: string
        }
        Insert: {
          area?: string
          created_at?: string
          id?: string
          name: string
          phone?: string
          status?: string
          village_name: string
        }
        Update: {
          area?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          village_name?: string
        }
        Relationships: []
      }
      forecasts: {
        Row: {
          confidence: number
          created_at: string
          date: string
          district: string
          id: string
          risk_level: number
        }
        Insert: {
          confidence: number
          created_at?: string
          date: string
          district?: string
          id?: string
          risk_level: number
        }
        Update: {
          confidence?: number
          created_at?: string
          date?: string
          district?: string
          id?: string
          risk_level?: number
        }
        Relationships: []
      }
      hotspots: {
        Row: {
          created_at: string
          humidity: number
          id: string
          lat: number
          lng: number
          photo_url: string | null
          rain_mm: number
          reported_by: string | null
          risk_score: number
          status: string
          temp: number
          updated_at: string
          village_name: string
          water_stagnation_days: number
        }
        Insert: {
          created_at?: string
          humidity: number
          id?: string
          lat: number
          lng: number
          photo_url?: string | null
          rain_mm?: number
          reported_by?: string | null
          risk_score?: number
          status?: string
          temp: number
          updated_at?: string
          village_name: string
          water_stagnation_days?: number
        }
        Update: {
          created_at?: string
          humidity?: number
          id?: string
          lat?: number
          lng?: number
          photo_url?: string | null
          rain_mm?: number
          reported_by?: string | null
          risk_score?: number
          status?: string
          temp?: number
          updated_at?: string
          village_name?: string
          water_stagnation_days?: number
        }
        Relationships: []
      }
      squad_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          notes: string | null
          squad_name: string
          status: string
          villages: string[]
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          squad_name: string
          status?: string
          villages?: string[]
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          squad_name?: string
          status?: string
          villages?: string[]
        }
        Relationships: []
      }
      villages: {
        Row: {
          created_at: string
          district: string
          id: string
          name: string
          taluk: string
        }
        Insert: {
          created_at?: string
          district?: string
          id?: string
          name: string
          taluk?: string
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          name?: string
          taluk?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
