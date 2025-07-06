
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type Practitioner = Tables['practitioner']['Row'];
type Institution = Tables['institution']['Row'];
type Service = Tables['services']['Row'];
type ContactDetail = Tables['contact_details']['Row'];
type Location = Tables['location']['Row'];

export const databaseService = {
  // Fetch all practitioners with their institution and location data
  async getPractitioners() {
    const { data, error } = await supabase
      .from('practitioner')
      .select(`
        *,
        institution:institution_id(
          *,
          location:location_id(*)
        )
      `);
    
    if (error) {
      console.error('Error fetching practitioners:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch single practitioner with related data
  async getPractitioner(id: number) {
    const { data, error } = await supabase
      .from('practitioner')
      .select(`
        *,
        institution:institution_id(
          *,
          location:location_id(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching practitioner:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch all institutions with location data
  async getInstitutions() {
    const { data, error } = await supabase
      .from('institution')
      .select(`
        *,
        location:location_id(*)
      `);
    
    if (error) {
      console.error('Error fetching institutions:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch single institution with related data
  async getInstitution(id: number) {
    const { data, error } = await supabase
      .from('institution')
      .select(`
        *,
        location:location_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching institution:', error);
      throw error;
    }
    
    return data;
  },

  // Fetch services for a practitioner
  async getServicesByPractitioner(practitionerId: number) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
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
      .from('services')
      .select('*')
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

  // Fetch practitioners by institution
  async getPractitionersByInstitution(institutionId: number) {
    const { data, error } = await supabase
      .from('practitioner')
      .select(`
        *,
        institution:institution_id(
          *,
          location:location_id(*)
        )
      `)
      .eq('institution_id', institutionId);
    
    if (error) {
      console.error('Error fetching practitioners by institution:', error);
      throw error;
    }
    
    return data;
  }
};
