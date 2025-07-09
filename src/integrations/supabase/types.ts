export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_details: {
        Row: {
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string
          id: number
          last_updated_at: string
          link: string | null
          value: string
        }
        Insert: {
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          id?: number
          last_updated_at: string
          link?: string | null
          value: string
        }
        Update: {
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          id?: number
          last_updated_at?: string
          link?: string | null
          value?: string
        }
        Relationships: []
      }
      contact_mapping: {
        Row: {
          contact_details_id: number | null
          created_at: string
          id: number
          institution_id: number | null
          last_updated_at: string | null
          location_id: number | null
          practitioner_id: number | null
        }
        Insert: {
          contact_details_id?: number | null
          created_at?: string
          id?: number
          institution_id?: number | null
          last_updated_at?: string | null
          location_id?: number | null
          practitioner_id?: number | null
        }
        Update: {
          contact_details_id?: number | null
          created_at?: string
          id?: number
          institution_id?: number | null
          last_updated_at?: string | null
          location_id?: number | null
          practitioner_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_mapping_contact_details_id_fkey"
            columns: ["contact_details_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_mapping_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_mapping_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_mapping_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      institution: {
        Row: {
          created_at: string
          id: number
          image: string | null
          insurance: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          type: Database["public"]["Enums"]["institution_type"]
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          type: Database["public"]["Enums"]["institution_type"]
          verified: boolean
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string
          name?: string
          profession_type?: Database["public"]["Enums"]["profession_type"][]
          type?: Database["public"]["Enums"]["institution_type"]
          verified?: boolean
        }
        Relationships: []
      }
      location: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string
          id: number
          last_updated_at: string
          name: string | null
          province: string
        }
        Insert: {
          address?: string | null
          city: string
          country: string
          created_at?: string
          id?: number
          last_updated_at: string
          name?: string | null
          province: string
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: number
          last_updated_at?: string
          name?: string | null
          province?: string
        }
        Relationships: []
      }
      location_mapping: {
        Row: {
          created_at: string
          id: number
          institution_id: number | null
          last_updated_at: string
          location_id: number
          practitioner_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          institution_id?: number | null
          last_updated_at: string
          location_id: number
          practitioner_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          institution_id?: number | null
          last_updated_at?: string
          location_id?: number
          practitioner_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "location_mapping_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_mapping_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_mapping_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioner: {
        Row: {
          created_at: string
          education: string[] | null
          experience: number | null
          id: number
          image: string | null
          institution_id: number | null
          insurance: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string
          license_number: string | null
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          session_mode: Database["public"]["Enums"]["session_mode"][] | null
          specialization: Database["public"]["Enums"]["specialization"][] | null
        }
        Insert: {
          created_at?: string
          education?: string[] | null
          experience?: number | null
          id?: number
          image?: string | null
          institution_id?: number | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string
          license_number?: string | null
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
        }
        Update: {
          created_at?: string
          education?: string[] | null
          experience?: number | null
          id?: number
          image?: string | null
          institution_id?: number | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string
          license_number?: string | null
          name?: string
          profession_type?: Database["public"]["Enums"]["profession_type"][]
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          book_cta: number | null
          created_at: string
          duration: number | null
          id: number
          institution_id: number | null
          last_updated_at: string
          learn_more_cta: number | null
          location_id: number | null
          name: string
          practitioner_id: number | null
          price: number | null
          session_mode: Database["public"]["Enums"]["session_mode"][] | null
        }
        Insert: {
          book_cta?: number | null
          created_at?: string
          duration?: number | null
          id?: number
          institution_id?: number | null
          last_updated_at: string
          learn_more_cta?: number | null
          location_id?: number | null
          name: string
          practitioner_id?: number | null
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
        }
        Update: {
          book_cta?: number | null
          created_at?: string
          duration?: number | null
          id?: number
          institution_id?: number | null
          last_updated_at?: string
          learn_more_cta?: number | null
          location_id?: number | null
          name?: string
          practitioner_id?: number | null
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_services_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_services_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_services_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_book_cta_fkey"
            columns: ["book_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_learn_more_cta_fkey"
            columns: ["learn_more_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
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
      contact_type: "WHATSAPP" | "WEBSITE" | "INSTAGRAM" | "FACEBOOK" | "PHONE"
      institution_type: "PRIVATE" | "CLINIC" | "HOSPITAL"
      insurance: "PRIVATE" | "BPJS"
      profession_type: "PSYCHOLOGIST" | "PSCYHIATRIST" | "ART THERAPIST"
      session_mode: "TEXT" | "VOICE" | "VIDEO" | "OFFLINE"
      specialization:
        | "PERSONALITY"
        | "TRAUMA"
        | "MOOD"
        | "ADHD"
        | "ANXIETY"
        | "RELATIONSHIP"
        | "CAREER"
        | "OCD"
        | "SELF_DEVELOPMENT"
        | "GENDER"
        | "FAMILY"
        | "DEPRESSION"
        | "INTERPERSONAL"
        | "EDUCATION"
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
      contact_type: ["WHATSAPP", "WEBSITE", "INSTAGRAM", "FACEBOOK", "PHONE"],
      institution_type: ["PRIVATE", "CLINIC", "HOSPITAL"],
      insurance: ["PRIVATE", "BPJS"],
      profession_type: ["PSYCHOLOGIST", "PSCYHIATRIST", "ART THERAPIST"],
      session_mode: ["TEXT", "VOICE", "VIDEO", "OFFLINE"],
      specialization: [
        "PERSONALITY",
        "TRAUMA",
        "MOOD",
        "ADHD",
        "ANXIETY",
        "RELATIONSHIP",
        "CAREER",
        "OCD",
        "SELF_DEVELOPMENT",
        "GENDER",
        "FAMILY",
        "DEPRESSION",
        "INTERPERSONAL",
        "EDUCATION",
      ],
    },
  },
} as const
