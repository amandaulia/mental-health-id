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
      activity: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"][] | null
          book_cta: number | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: number
          last_updated_at: string | null
          learn_more_cta: number | null
          name: string
          price: number | null
          session_mode: Database["public"]["Enums"]["session_mode"][] | null
          specialization: Database["public"]["Enums"]["specialization"][] | null
        }
        Insert: {
          activity_type?: Database["public"]["Enums"]["activity_type"][] | null
          book_cta?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          last_updated_at?: string | null
          learn_more_cta?: number | null
          name: string
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"][] | null
          book_cta?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          last_updated_at?: string | null
          learn_more_cta?: number | null
          name?: string
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_book_cta_fkey"
            columns: ["book_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_learn_more_cta_fkey"
            columns: ["learn_more_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "activity"
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
      activity_institutions: {
        Row: {
          activity_id: number
          institution_id: number
        }
        Insert: {
          activity_id: number
          institution_id: number
        }
        Update: {
          activity_id?: number
          institution_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_institutions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_institutions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
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
            referencedRelation: "activity"
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
      activity_organizations: {
        Row: {
          activity_id: number
          organization_id: number
        }
        Insert: {
          activity_id: number
          organization_id: number
        }
        Update: {
          activity_id?: number
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_organizations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_practitioners: {
        Row: {
          activity_id: number
          practitioner_id: number
        }
        Insert: {
          activity_id: number
          practitioner_id: number
        }
        Update: {
          activity_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_practitioners_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_practitioners_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_details: {
        Row: {
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string | null
          id: number
          last_updated_at: string | null
          link: string | null
          name: string | null
          value: string
        }
        Insert: {
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at?: string | null
          id?: number
          last_updated_at?: string | null
          link?: string | null
          name?: string | null
          value: string
        }
        Update: {
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string | null
          id?: number
          last_updated_at?: string | null
          link?: string | null
          name?: string | null
          value?: string
        }
        Relationships: []
      }
      institution: {
        Row: {
          created_at: string | null
          id: number
          image: string | null
          institution_type: Database["public"]["Enums"]["institution_type"]
          insurance: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string | null
          name: string
          profession_type:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization: Database["public"]["Enums"]["specialization"][] | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image?: string | null
          institution_type: Database["public"]["Enums"]["institution_type"]
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string | null
          name: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image?: string | null
          institution_type?: Database["public"]["Enums"]["institution_type"]
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string | null
          name?: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
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
      institution_peer_counselings: {
        Row: {
          institution_id: number
          peer_counseling_id: number
        }
        Insert: {
          institution_id: number
          peer_counseling_id: number
        }
        Update: {
          institution_id?: number
          peer_counseling_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "institution_peer_counselings_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_peer_counselings_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_services: {
        Row: {
          institution_id: number
          service_id: number
        }
        Insert: {
          institution_id: number
          service_id: number
        }
        Update: {
          institution_id?: number
          service_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "institution_services_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      location: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string | null
          id: number
          last_updated_at: string | null
          name: string | null
          province: string
        }
        Insert: {
          address?: string | null
          city: string
          country: string
          created_at?: string | null
          id?: number
          last_updated_at?: string | null
          name?: string | null
          province: string
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string | null
          id?: number
          last_updated_at?: string | null
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
      organization: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          last_updated_at: string | null
          name: string
          specialization: Database["public"]["Enums"]["specialization"][] | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          last_updated_at?: string | null
          name: string
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          last_updated_at?: string | null
          name?: string
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
        }
        Relationships: []
      }
      organization_activities: {
        Row: {
          activity_id: number
          organization_id: number
        }
        Insert: {
          activity_id: number
          organization_id: number
        }
        Update: {
          activity_id?: number
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
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
            referencedRelation: "organization"
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
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_peer_counselings: {
        Row: {
          organization_id: number
          peer_counseling_id: number
        }
        Insert: {
          organization_id: number
          peer_counseling_id: number
        }
        Update: {
          organization_id?: number
          peer_counseling_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_peer_counselings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_peer_counselings_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_practitioners: {
        Row: {
          organization_id: number
          practitioner_id: number
        }
        Insert: {
          organization_id: number
          practitioner_id: number
        }
        Update: {
          organization_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_practitioners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_practitioners_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_counseling: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          last_updated_at: string | null
          name: string
          peer_type: Database["public"]["Enums"]["peer_type"][] | null
          specialization: Database["public"]["Enums"]["specialization"][] | null
          tags: string[] | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          last_updated_at?: string | null
          name: string
          peer_type?: Database["public"]["Enums"]["peer_type"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          tags?: string[] | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          last_updated_at?: string | null
          name?: string
          peer_type?: Database["public"]["Enums"]["peer_type"][] | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          tags?: string[] | null
          verified?: boolean | null
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
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioner: {
        Row: {
          created_at: string | null
          education: string[] | null
          experience: number | null
          id: number
          image: string | null
          insurance: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at: string | null
          license_number: string | null
          name: string
          profession_type:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization: Database["public"]["Enums"]["specialization"][] | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          education?: string[] | null
          experience?: number | null
          id?: number
          image?: string | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string | null
          license_number?: string | null
          name: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          education?: string[] | null
          experience?: number | null
          id?: number
          image?: string | null
          insurance?: Database["public"]["Enums"]["insurance"][] | null
          last_updated_at?: string | null
          license_number?: string | null
          name?: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"][]
            | null
          specialization?:
            | Database["public"]["Enums"]["specialization"][]
            | null
          verified?: boolean | null
        }
        Relationships: []
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
      practitioner_peer_counselings: {
        Row: {
          peer_counseling_id: number
          practitioner_id: number
        }
        Insert: {
          peer_counseling_id: number
          practitioner_id: number
        }
        Update: {
          peer_counseling_id?: number
          practitioner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_peer_counselings_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_peer_counselings_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioner_services: {
        Row: {
          practitioner_id: number
          service_id: number
        }
        Insert: {
          practitioner_id: number
          service_id: number
        }
        Update: {
          practitioner_id?: number
          service_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "practitioner_services_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practitioner_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      service: {
        Row: {
          book_cta: number | null
          created_at: string | null
          duration: number | null
          id: number
          last_updated_at: string | null
          learn_more_cta: number | null
          name: string
          price: number | null
          session_mode: Database["public"]["Enums"]["session_mode"][] | null
        }
        Insert: {
          book_cta?: number | null
          created_at?: string | null
          duration?: number | null
          id?: number
          last_updated_at?: string | null
          learn_more_cta?: number | null
          name: string
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
        }
        Update: {
          book_cta?: number | null
          created_at?: string | null
          duration?: number | null
          id?: number
          last_updated_at?: string | null
          learn_more_cta?: number | null
          name?: string
          price?: number | null
          session_mode?: Database["public"]["Enums"]["session_mode"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "service_book_cta_fkey"
            columns: ["book_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_learn_more_cta_fkey"
            columns: ["learn_more_cta"]
            isOneToOne: false
            referencedRelation: "contact_details"
            referencedColumns: ["id"]
          },
        ]
      }
      service_locations: {
        Row: {
          location_id: number
          service_id: number
        }
        Insert: {
          location_id: number
          service_id: number
        }
        Update: {
          location_id?: number
          service_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_locations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      service_peer_counselings: {
        Row: {
          peer_counseling_id: number
          service_id: number
        }
        Insert: {
          peer_counseling_id: number
          service_id: number
        }
        Update: {
          peer_counseling_id?: number
          service_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_peer_counselings_peer_counseling_id_fkey"
            columns: ["peer_counseling_id"]
            isOneToOne: false
            referencedRelation: "peer_counseling"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_peer_counselings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_user_app_metadata: {
        Args: { new_app_metadata: Json; user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      activity_type:
        | "Workshop"
        | "Sport"
        | "Webinar"
        | "Art"
        | "Music"
        | "Movie"
        | "Books"
      app_role: "admin" | "moderator" | "user"
      contact_type:
        | "WhatsApp"
        | "Phone"
        | "Website"
        | "Instagram"
        | "Email"
        | "Application"
      institution_type:
        | "Private Practice"
        | "Clinic"
        | "Faskes 1"
        | "Faskes 2"
        | "Faskes 3"
        | "Private Hospital"
      insurance: "Private Insurance" | "BPJS"
      peer_type: "Peer Counseling" | "Group Therapy"
      profession_type:
        | "Psychologist"
        | "Psychiatrist"
        | "Therapist"
        | "Counselor"
      session_mode: "Chat" | "Voice Call" | "Video Call" | "Offline"
      specialization:
        | "Personality Disorders"
        | "Trauma"
        | "Mood Disorders"
        | "ADHD"
        | "Anxiety"
        | "Relationship"
        | "Career"
        | "OCD"
        | "Self Development"
        | "Gender"
        | "Family"
        | "Depression"
        | "Interpersonal"
        | "Education"
        | "Children/Adolescence"
        | "Hypnotherapy"
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
        "Workshop",
        "Sport",
        "Webinar",
        "Art",
        "Music",
        "Movie",
        "Books",
      ],
      app_role: ["admin", "moderator", "user"],
      contact_type: [
        "WhatsApp",
        "Phone",
        "Website",
        "Instagram",
        "Email",
        "Application",
      ],
      institution_type: [
        "Private Practice",
        "Clinic",
        "Faskes 1",
        "Faskes 2",
        "Faskes 3",
        "Private Hospital",
      ],
      insurance: ["Private Insurance", "BPJS"],
      peer_type: ["Peer Counseling", "Group Therapy"],
      profession_type: [
        "Psychologist",
        "Psychiatrist",
        "Therapist",
        "Counselor",
      ],
      session_mode: ["Chat", "Voice Call", "Video Call", "Offline"],
      specialization: [
        "Personality Disorders",
        "Trauma",
        "Mood Disorders",
        "ADHD",
        "Anxiety",
        "Relationship",
        "Career",
        "OCD",
        "Self Development",
        "Gender",
        "Family",
        "Depression",
        "Interpersonal",
        "Education",
        "Children/Adolescence",
        "Hypnotherapy",
      ],
    },
  },
} as const
