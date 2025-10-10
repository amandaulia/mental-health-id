
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type Practitioner = Tables['practitioner']['Row'];
type Institution = Tables['institution']['Row'];
type Service = Tables['service']['Row'];
type ContactDetail = Tables['contact_details']['Row'];
type Location = Tables['location']['Row'];

export const databaseService = {
  // Fetch all practitioners (base data only - relationships fetched separately)
  async getPractitioners() {
    const { data, error } = await supabase
      .from('practitioner')
      .select('*');
    
    if (error) {
      console.error('Error fetching practitioners:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch single practitioner (base data only - relationships fetched separately)
  async getPractitioner(id: number) {
    const { data, error } = await supabase
      .from('practitioner')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching practitioner:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch contact details for a practitioner
  async getContactDetailsByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from('practitioner_contacts')
      .select(`
        contact_id,
        contact_details:contact_id(*)
      `)
      .eq('practitioner_id', practitionerId);
    
    if (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
    
    return data?.map(item => item.contact_details).filter(Boolean) || [];
  },

  // Fetch all institutions
  async getInstitutions() {
    const { data, error } = await supabase
      .from('institution')
      .select('*');
    
    if (error) {
      console.error('Error fetching institutions:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch single institution
  async getInstitution(id: number) {
    const { data, error } = await supabase
      .from('institution')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching institution:', error);
      throw error;
    }
    
    return data;
  },

  // NEW: Insert service with proper enum casting
  async insertService(serviceData: {
    name: string;
    duration?: number;
    price?: number;
    session_mode?: string[];
  }) {
    const { data, error } = await supabase
      .from('service')
      .insert({
        ...serviceData,
        session_mode: serviceData.session_mode ? serviceData.session_mode.map(mode => mode as any) : []
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting service:', error);
      throw error;
    }
    
    return data;
  },

  // NEW: Insert contact with proper enum casting
  async insertContact(contactData: {
    name?: string;
    contact_type: string;
    value: string;
    link?: string;
  }) {
    const { data, error } = await supabase
      .from('contact_details')
      .insert({
        ...contactData,
        contact_type: contactData.contact_type as any
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting contact:', error);
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
    const { data, error } = await supabase
      .from('location')
      .insert(locationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting location:', error);
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
      .from('institution')
      .insert({
        ...institutionData,
        institution_type: institutionData.institution_type as any,
        profession_type: institutionData.profession_type as any,
        specialization: institutionData.specialization as any,
        insurance: institutionData.insurance as any
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting institution:', error);
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
      .from('practitioner')
      .insert({
        ...practitionerData,
        profession_type: practitionerData.profession_type as any,
        specialization: practitionerData.specialization as any,
        insurance: practitionerData.insurance as any
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting practitioner:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch contact details for an institution
  async getContactDetailsByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('institution_contacts')
      .select(`
        contact_id,
        contact_details:contact_id(*)
      `)
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
    
    return data?.map(item => item.contact_details).filter(Boolean) || [];
  },

  // Fetch services for a practitioner with institution data
  async getServicesByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from('practitioner_services')
      .select(`
        service(*)
      `)
      .eq('practitioner_id', practitionerId);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch services for an institution with contact details for CTAs
  async getServicesByInstitution(institutionId: number) {
    const { data: servicesData, error } = await supabase
      .from('institution_services')
      .select('service(*)')
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    // Get all unique CTA IDs
    const ctaIds = new Set<number>();
    servicesData?.forEach((item: any) => {
      if (item.service?.book_cta) ctaIds.add(item.service.book_cta);
      if (item.service?.learn_more_cta) ctaIds.add(item.service.learn_more_cta);
    });
    
    // Fetch contact details for all CTAs
    const { data: contactData, error: contactError } = await supabase
      .from('contact_details')
      .select('id, link')
      .in('id', Array.from(ctaIds));
    
    if (contactError) {
      console.error('Error fetching contact details:', contactError);
    }
    
    // Create a map of contact ID to link
    const contactMap = new Map(contactData?.map(c => [c.id, c.link]) || []);
    
    // Enhance services with contact links
    return servicesData?.map((item: any) => ({
      ...item,
      service: {
        ...item.service,
        book_contact: item.service?.book_cta ? { id: item.service.book_cta, link: contactMap.get(item.service.book_cta) } : null,
        learn_more_contact: item.service?.learn_more_cta ? { id: item.service.learn_more_cta, link: contactMap.get(item.service.learn_more_cta) } : null,
      }
    }));
  },

  // Fetch contact details (generic function that can be used for both practitioners and institutions)
  async getContactDetails() {
    const { data, error } = await supabase
      .from('contact_details')
      .select('*');
    
    if (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch practitioners by institution (removed location from institution query)
  async getPractitionersByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('practitioner_institutions')
      .select(`
        practitioner(*)
      `)
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching practitioners by institution:', error);
      throw error;
    }
    
    return data?.map(item => item.practitioner).filter(Boolean) || [];
  },

  // NEW: Fetch locations for a practitioner using location_mapping
  async getLocationsByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from('practitioner_locations')
      .select(`
        location(*)
      `)
      .eq('practitioner_id', practitionerId);
    
    if (error) {
      console.error('Error fetching locations for practitioner:', error);
      throw error;
    }
    
    return data?.map(item => item.location).filter(Boolean) || [];
  },

  // NEW: Fetch locations for an institution using location_mapping
  async getLocationsByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('institution_locations')
      .select(`
        location(*)
      `)
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching locations for institution:', error);
      throw error;
    }
    
    return data?.map(item => item.location).filter(Boolean) || [];
  },

  // Fetch all locations
  async getLocations() {
    const { data, error } = await supabase
      .from('location')
      .select('*')
      .order('city');
    
    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
    
    return data || [];
  }
};
