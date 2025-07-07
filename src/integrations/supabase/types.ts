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
          practitioner_id: number | null
        }
        Insert: {
          contact_details_id?: number | null
          created_at?: string
          id?: number
          institution_id?: number | null
          practitioner_id?: number | null
        }
        Update: {
          contact_details_id?: number | null
          created_at?: string
          id?: number
          institution_id?: number | null
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
          insurance: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string
          location_id: number | null
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          type: Database["public"]["Enums"]["institution_type"]
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string
          location_id?: number | null
          name: string
          profession_type: Database["public"]["Enums"]["profession_type"][]
          type: Database["public"]["Enums"]["institution_type"]
          verified: boolean
        }
        Update: {
          created_at?: string
          id?: number
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string
          location_id?: number | null
          name?: string
          profession_type?: Database["public"]["Enums"]["profession_type"][]
          type?: Database["public"]["Enums"]["institution_type"]
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "institution_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
        ]
      }
      location: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string
          id: number
          last_updated_at: string
          province: string
        }
        Insert: {
          address?: string | null
          city: string
          country: string
          created_at?: string
          id?: number
          last_updated_at: string
          province: string
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: number
          last_updated_at?: string
          province?: string
        }
        Relationships: []
      }
      practitioner: {
        Row: {
          created_at: string
          education: string[] | null
          experience: number | null
          id: number
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
          book_cta: string | null
          created_at: string
          duration: number | null
          id: number
          institution_id: number | null
          last_updated_at: string
          learn_more_cta: string | null
          location_id: number | null
          name: string
          practitioner_id: number | null
          price: number | null
          session_mode: Database["public"]["Enums"]["session_mode"][] | null
        }
        Insert: {
          book_cta?: string | null
          created_at?: string
          duration?: number | null
          id?: number
          institution_id?: number | null
          last_updated_at: string
          learn_more_cta?: string | null
          location_id?: number | null
          name: string
          practitioner_id?: number | null
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
        }
        Update: {
          book_cta?: string | null
          created_at?: string
          duration?: number | null
          id?: number
          institution_id?: number | null
          last_updated_at?: string
          learn_more_cta?: string | null
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
      contact_type: "WHATSAPP" | "WEBSITE" | "INSTAGRAM"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_type: ["WHATSAPP", "WEBSITE", "INSTAGRAM"],
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
