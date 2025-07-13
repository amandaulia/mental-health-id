
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type Practitioner = Tables['practitioner']['Row'];
type Institution = Tables['institution']['Row'];
type Service = Tables['service']['Row'];
type ContactDetail = Tables['contact_details']['Row'];
type Location = Tables['location']['Row'];

export const databaseService = {
  // Fetch all practitioners with their institution data (removed location from institution query)
  async getPractitioners() {
    const { data, error } = await supabase
      .from('practitioner')
      .select(`
        *,
        institution:institution_id(*)
      `);
    
    if (error) {
      console.error('Error fetching practitioners:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch single practitioner with related data (removed location from institution query)
  async getPractitioner(id: number) {
    const { data, error } = await supabase
      .from('practitioner')
      .select(`
        *,
        institution:institution_id(*)
      `)
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
        contact_details(*)
      `)
      .eq('practitioner_id', practitionerId);
    
    if (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
    
    return data?.map(item => item.contact_details).filter(Boolean) || [];
  },

  // Fetch all institutions (removed location query)
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

  // Fetch single institution (removed location query)
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

  // Fetch contact details for an institution
  async getContactDetailsByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('institution_contacts')
      .select(`
        contact_details(*)
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

  // Fetch services for an institution
  async getServicesByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('institution_services')
      .select('service(*)')
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data;
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
