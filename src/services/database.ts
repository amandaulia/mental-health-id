import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type Practitioner = Tables["practitioner"]["Row"];
type Institution = Tables["institution"]["Row"];
type Service = Tables["service"]["Row"];
type ContactDetail = Tables["contact_details"]["Row"];
type Location = Tables["location"]["Row"];

/**
 * Ensure links are ABSOLUTE so the app doesn’t route them relatively (e.g. /bureau/...)
 * - Keeps http(s), mailto:, tel: as-is
 * - Adds https:// to bare domains or www.* links
 */
function normalizeLink(raw?: string | null): string | null {
  if (!raw) return null;
  const link = raw.trim();

  // Already absolute or special schemes
  if (/^(?:https?:|mailto:|tel:)/i.test(link)) return link;

  // Bare domain or www.* → force https://
  if (/^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(link)) {
    return `https://${link.replace(/^\/+/, "")}`;
  }

  // Anything else that starts with a slash we'll leave as-is (likely internal)
  if (/^\//.test(link)) return link;

  // Fallback: force https:// (prevents relative routing under /bureau/*)
  return `https://${link}`;
}

export const databaseService = {
  // Fetch all practitioners (base data only - relationships fetched separately)
  async getPractitioners() {
    const { data, error } = await supabase.from("practitioner").select("*");

    if (error) {
      console.error("Error fetching practitioners:", error);
      throw error;
    }

    return data;
  },

  // Fetch single practitioner (base data only - relationships fetched separately)
  async getPractitioner(id: number) {
    const { data, error } = await supabase.from("practitioner").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching practitioner:", error);
      throw error;
    }

    return data;
  },

  // Fetch contact details for a practitioner
  async getContactDetailsByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from("practitioner_contacts")
      .select(
        `
        contact_id,
        contact_details:contact_id(*)
      `,
      )
      .eq("practitioner_id", practitionerId);

    if (error) {
      console.error("Error fetching contact details:", error);
      throw error;
    }

    return data?.map((item) => item.contact_details).filter(Boolean) || [];
  },

  // Fetch all institutions
  async getInstitutions() {
    const { data, error } = await supabase.from("institution").select("*");

    if (error) {
      console.error("Error fetching institutions:", error);
      throw error;
    }

    return data;
  },

  // Fetch single institution
  async getInstitution(id: number) {
    const { data, error } = await supabase.from("institution").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching institution:", error);
      throw error;
    }

    return data;
  },

  // NEW: Insert service with proper enum casting
  async insertService(serviceData: { name: string; duration?: number; price?: number; session_mode?: string[] }) {
    const { data, error } = await supabase
      .from("service")
      .insert({
        ...serviceData,
        session_mode: serviceData.session_mode ? serviceData.session_mode.map((mode) => mode as any) : [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting service:", error);
      throw error;
    }

    return data;
  },

  // NEW: Insert contact with proper enum casting — auto-normalize link
  async insertContact(contactData: { name?: string; contact_type: string; value: string; link?: string }) {
    const { data, error } = await supabase
      .from("contact_details")
      .insert({
        ...contactData,
        link: normalizeLink(contactData.link || null) ?? null,
        contact_type: contactData.contact_type as any,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact:", error);
      throw error;
    }

    return data;
  },

  // NEW: Insert location
  async insertLocation(locationData: {
    name?: string;
    address?: string;
    city: string;
    province: string;
    country: string;
  }) {
    const { data, error } = await supabase.from("location").insert(locationData).select().single();

    if (error) {
      console.error("Error inserting location:", error);
      throw error;
    }

    return data;
  },

  // NEW: Insert institution with proper enum casting
  async insertInstitution(institutionData: {
    name: string;
    image?: string;
    institution_type: string;
    profession_type?: string[];
    specialization?: string[];
    insurance?: string[];
    verified?: boolean;
  }) {
    const { data, error } = await supabase
      .from("institution")
      .insert({
        ...institutionData,
        institution_type: institutionData.institution_type as any,
        profession_type: institutionData.profession_type as any,
        specialization: institutionData.specialization as any,
        insurance: institutionData.insurance as any,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting institution:", error);
      throw error;
    }

    return data;
  },

  // NEW: Insert practitioner with proper enum casting
  async insertPractitioner(practitionerData: {
    name: string;
    image?: string;
    experience?: number;
    education?: string[];
    license_number?: string;
    profession_type?: string[];
    specialization?: string[];
    insurance?: string[];
    verified?: boolean;
  }) {
    const { data, error } = await supabase
      .from("practitioner")
      .insert({
        ...practitionerData,
        profession_type: practitionerData.profession_type as any,
        specialization: practitionerData.specialization as any,
        insurance: practitionerData.insurance as any,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting practitioner:", error);
      throw error;
    }

    return data;
  },

  // Fetch contact details for an institution
  async getContactDetailsByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from("institution_contacts")
      .select(
        `
        contact_id,
        contact_details:contact_id(*)
      `,
      )
      .eq("institution_id", institutionId);

    if (error) {
      console.error("Error fetching contact details:", error);
      throw error;
    }

    return data?.map((item) => item.contact_details).filter(Boolean) || [];
  },

  // Fetch services for a practitioner with institution data
  async getServicesByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from("practitioner_services")
      .select(
        `
        service(*)
      `,
      )
      .eq("practitioner_id", practitionerId);

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    return data;
  },

  // ✅ UPDATED: Fetch services for an institution with book_cta and learn_more_cta links, then normalize them
  async getServicesByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from("institution_services")
      .select(
        `
        service(*)
      `,
      )
      .eq("institution_id", institutionId);

    if (error) {
      console.error("Error fetching services with contact links:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get all unique CTA IDs
    const ctaIds = new Set<number>();
    data.forEach((item: any) => {
      if (item.service?.book_cta) ctaIds.add(item.service.book_cta);
      if (item.service?.learn_more_cta) ctaIds.add(item.service.learn_more_cta);
    });

    if (ctaIds.size === 0) {
      return data;
    }

    // Fetch contact details for all CTAs
    const { data: contactData, error: contactError } = await supabase
      .from('contact_details')
      .select('id, link')
      .in('id', Array.from(ctaIds));

    if (contactError) {
      console.error("Error fetching contact details:", contactError);
      return data;
    }

    // Create a map of contact ID to normalized link
    const contactMap = new Map<number, string | null>();
    contactData?.forEach(c => {
      const normalized = normalizeLink(c.link);
      contactMap.set(c.id, normalized);
    });
    
    // Return services with properly structured contact objects
    return data.map((row: any) => {
      const bookLink = row.service?.book_cta ? contactMap.get(row.service.book_cta) : null;
      const learnMoreLink = row.service?.learn_more_cta ? contactMap.get(row.service.learn_more_cta) : null;
      
      return {
        ...row,
        service: {
          ...row.service,
          book_contact: bookLink ? { link: bookLink } : null,
          learn_more_contact: learnMoreLink ? { link: learnMoreLink } : null,
        },
      };
    });
  },

  // Fetch contact details (generic function that can be used for both practitioners and institutions)
  async getContactDetails() {
    const { data, error } = await supabase.from("contact_details").select("*");

    if (error) {
      console.error("Error fetching contact details:", error);
      throw error;
    }

    return data;
  },

  // Fetch practitioners by institution (removed location from institution query)
  async getPractitionersByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from("practitioner_institutions")
      .select(
        `
        practitioner(*)
      `,
      )
      .eq("institution_id", institutionId);

    if (error) {
      console.error("Error fetching practitioners by institution:", error);
      throw error;
    }

    return data?.map((item) => item.practitioner).filter(Boolean) || [];
  },

  // NEW: Fetch locations for a practitioner using location_mapping
  async getLocationsByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from("practitioner_locations")
      .select(
        `
        location(*)
      `,
      )
      .eq("practitioner_id", practitionerId);

    if (error) {
      console.error("Error fetching locations for practitioner:", error);
      throw error;
    }

    return data?.map((item) => item.location).filter(Boolean) || [];
  },

  // NEW: Fetch locations for an institution using location_mapping
  async getLocationsByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from("institution_locations")
      .select(
        `
        location(*)
      `,
      )
      .eq("institution_id", institutionId);

    if (error) {
      console.error("Error fetching locations for institution:", error);
      throw error;
    }

    return data?.map((item) => item.location).filter(Boolean) || [];
  },

  // Fetch all locations
  async getLocations() {
    const { data, error } = await supabase.from("location").select("*").order("city");

    if (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }

    return data || [];
  },
};

/**
 * RENDERING TIP:
 * For external links, use <a> with an absolute URL (after normalizeLink).
 * Avoid using <Link> from 'next/link' for external links unless you’re sure
 * the URL is absolute (starts with http/https/mailto/tel).
 *
 * Example:
 * {service.book_link && (
 *   <a href={service.book_link} target="_blank" rel="noopener noreferrer">Book</a>
 * )}
 * {service.learn_more_link && (
 *   <a href={service.learn_more_link} target="_blank" rel="noopener noreferrer">Learn more</a>
 * )}
 */
