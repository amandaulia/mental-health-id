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
      activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string | null
          description: string | null
          duration: string | null
          id: number
          image: string | null
          last_updated_at: string | null
          max_participants: number | null
          name: string
          price: number | null
          schedule: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          max_participants?: number | null
          name: string
          price?: number | null
          schedule?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          max_participants?: number | null
          name?: string
          price?: number | null
          schedule?: string | null
        }
        Relationships: []
      }
      activity_contacts: {
        Row: {
          activity_id: number
          contact_id: number
        }
        Insert: {
          activity_id: number
          contact_id: number
        }
        Update: {
          activity_id?: number
          contact_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_contacts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_locations: {
        Row: {
          activity_id: number
          location_id: number
        }
        Insert: {
          activity_id: number
          location_id: number
        }
        Update: {
          activity_id?: number
          location_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_locations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
        ]
      }
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
      feeling_analyses: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          feelings_text: string
          id: number
          recommendations: Json | null
          user_session_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          feelings_text: string
          id?: never
          recommendations?: Json | null
          user_session_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          feelings_text?: string
          id?: never
          recommendations?: Json | null
          user_session_id?: string | null
        }
        Relationships: []
      }
      institution: {
        Row: {
          business_hours: string | null
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
          business_hours?: string | null
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
          business_hours?: string | null
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
      institution_contacts: {
        Row: {
          contact_id: number
          institution_id: number
        }
        Insert: {
          contact_id: number
          institution_id: number
        }
        Update: {
          contact_id?: number
          institution_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "institution_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_contacts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_locations: {
        Row: {
          institution_id: number
          location_id: number
        }
        Insert: {
          institution_id: number
          location_id: number
        }
        Update: {
          institution_id?: number
          location_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "institution_locations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_locations_location_id_fkey"
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
      location_contacts: {
        Row: {
          contact_id: number
          location_id: number
        }
        Insert: {
          contact_id: number
          location_id: number
        }
        Update: {
          contact_id?: number
          location_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "location_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_contacts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
        ]
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
      organization_contacts: {
        Row: {
          contact_id: number
          organization_id: number
        }
        Insert: {
          contact_id: number
          organization_id: number
        }
        Update: {
          contact_id?: number
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_locations: {
        Row: {
          location_id: number
          organization_id: number
        }
        Insert: {
          location_id: number
          organization_id: number
        }
        Update: {
          location_id?: number
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: number
          image: string | null
          last_updated_at: string | null
          mission_statement: string | null
          name: string
          type: Database["public"]["Enums"]["organization_type"]
          verified: boolean | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          mission_statement?: string | null
          name: string
          type: Database["public"]["Enums"]["organization_type"]
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          mission_statement?: string | null
          name?: string
          type?: Database["public"]["Enums"]["organization_type"]
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      peer_counseling_contacts: {
        Row: {
          contact_id: number
          peer_counseling_id: number
        }
        Insert: {
          contact_id: number
          peer_counseling_id: number
        }
        Update: {
          contact_id?: number
          peer_counseling_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "peer_counseling_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_counseling_contacts_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_counseling_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          last_updated_at: string | null
          meeting_format: Database["public"]["Enums"]["session_mode"][] | null
          meeting_schedule: string | null
          name: string
          price: number | null
          specialization: string[] | null
          type: Database["public"]["Enums"]["peer_counseling_type"]
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          meeting_format?: Database["public"]["Enums"]["session_mode"][] | null
          meeting_schedule?: string | null
          name: string
          price?: number | null
          specialization?: string[] | null
          type: Database["public"]["Enums"]["peer_counseling_type"]
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          image?: string | null
          last_updated_at?: string | null
          meeting_format?: Database["public"]["Enums"]["session_mode"][] | null
          meeting_schedule?: string | null
          name?: string
          price?: number | null
          specialization?: string[] | null
          type?: Database["public"]["Enums"]["peer_counseling_type"]
          verified?: boolean | null
        }
        Relationships: []
      }
      peer_counseling_locations: {
        Row: {
          location_id: number
          peer_counseling_id: number
        }
        Insert: {
          location_id: number
          peer_counseling_id: number
        }
        Update: {
          location_id?: number
          peer_counseling_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "peer_counseling_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_counseling_locations_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling_groups"
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
      practitioner_contacts: {
        Row: {
          contact_id: number
          practitioner_id: number
        }
        Insert: {
          contact_id: number
          practitioner_id: number
        }
        Update: {
          contact_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_contacts_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioner_institutions: {
        Row: {
          institution_id: number
          practitioner_id: number
        }
        Insert: {
          institution_id: number
          practitioner_id: number
        }
        Update: {
          institution_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_institutions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_institutions_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioner_locations: {
        Row: {
          location_id: number
          practitioner_id: number
        }
        Insert: {
          location_id: number
          practitioner_id: number
        }
        Update: {
          location_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_locations_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      service_offering_contacts: {
        Row: {
          contact_id: number
          service_offering_id: number
        }
        Insert: {
          contact_id: number
          service_offering_id: number
        }
        Update: {
          contact_id?: number
          service_offering_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_offering_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_offering_contacts_service_offering_id_fkey"
            columns: ["service_offering_id"]
            isOneToOne: false
            referencedRelation: "service_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_offerings: {
        Row: {
          book_cta: number | null
          created_at: string
          duration_override: number | null
          id: number
          last_updated_at: string
          learn_more_cta: number | null
          location_id: number
          practitioner_id: number | null
          price_override: number | null
          service_id: number
        }
        Insert: {
          book_cta?: number | null
          created_at?: string
          duration_override?: number | null
          id?: number
          last_updated_at?: string
          learn_more_cta?: number | null
          location_id: number
          practitioner_id?: number | null
          price_override?: number | null
          service_id: number
        }
        Update: {
          book_cta?: number | null
          created_at?: string
          duration_override?: number | null
          id?: number
          last_updated_at?: string
          learn_more_cta?: number | null
          location_id?: number
          practitioner_id?: number | null
          price_override?: number | null
          service_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_offerings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_offerings_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_offerings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
      activity_type:
        | "ART_THERAPY"
        | "NATURE_THERAPY"
        | "MEDITATION"
        | "MUSIC_THERAPY"
        | "DANCE_THERAPY"
        | "WRITING_THERAPY"
        | "SPORTS_THERAPY"
      contact_type:
        | "WHATSAPP"
        | "WEBSITE"
        | "INSTAGRAM"
        | "FACEBOOK"
        | "PHONE"
        | "EMAIL"
        | "TELEGRAM"
      institution_type: "PRIVATE" | "CLINIC" | "HOSPITAL"
      insurance: "PRIVATE" | "BPJS"
      organization_type:
        | "NON_PROFIT"
        | "COMMUNITY"
        | "CORPORATE_PROGRAM"
        | "STUDENT_ORGANIZATION"
        | "GOVERNMENT_INITIATIVE"
      peer_counseling_type: "PEER_COUNSELING" | "SUPPORT_GROUP"
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
      activity_type: [
        "ART_THERAPY",
        "NATURE_THERAPY",
        "MEDITATION",
        "MUSIC_THERAPY",
        "DANCE_THERAPY",
        "WRITING_THERAPY",
        "SPORTS_THERAPY",
      ],
      contact_type: [
        "WHATSAPP",
        "WEBSITE",
        "INSTAGRAM",
        "FACEBOOK",
        "PHONE",
        "EMAIL",
        "TELEGRAM",
      ],
      institution_type: ["PRIVATE", "CLINIC", "HOSPITAL"],
      insurance: ["PRIVATE", "BPJS"],
      organization_type: [
        "NON_PROFIT",
        "COMMUNITY",
        "CORPORATE_PROGRAM",
        "STUDENT_ORGANIZATION",
        "GOVERNMENT_INITIATIVE",
      ],
      peer_counseling_type: ["PEER_COUNSELING", "SUPPORT_GROUP"],
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
