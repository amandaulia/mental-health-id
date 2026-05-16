import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MultiSelectField } from '@/components/admin/MultiSelectField';
import { RelationshipDropdown } from '@/components/admin/RelationshipDropdown';
import { AddServiceForm } from '@/components/admin/AddServiceForm';
import { AddInstitutionForm } from '@/components/admin/AddInstitutionForm';
import { AddLocationForm } from '@/components/admin/AddLocationForm';
import { AddContactForm } from '@/components/admin/AddContactForm';

export default function AddPractitioner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    experience: '',
    education: [] as string[],
    license_number: '',
    profession_type: [] as string[],
    specialization: [] as string[],
    insurance: [] as string[],
    verified: false
  });

  const [availableData, setAvailableData] = useState({
    services: [] as any[],
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [relations, setRelations] = useState({
    services: [] as any[],
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const professionOptions = [
    'Psychologist',
    'Psychiatrist', 
    'Therapist'
  ];

  const specializationOptions = [
    'Personality Disorders',
    'Trauma',
    'Mood Disorders',
    'ADHD',
    'Anxiety',
    'Relationship',
    'Career',
    'OCD',
    'Self Development',
    'Gender',
    'Family',
    'Depression',
    'Interpersonal',
    'Education'
  ];

  const insuranceOptions = [
    'Private Insurance',
    'BPJS'
  ];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadPractitionerData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [servicesRes, institutionsRes, locationsRes, contactsRes] = await Promise.all([
        supabase.from('service').select('*'),
        supabase.from('institution').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        services: servicesRes.data || [],
        institutions: institutionsRes.data || [],
        locations: locationsRes.data || [],
        contacts: contactsRes.data || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load available data",
        variant: "destructive",
      });
    }
  };

  const loadPractitionerData = async () => {
    try {
      const { data: practitioner, error } = await supabase
        .from('practitioner')
        .select(`
          *,
          practitioner_services(service_id, service(*)),
          practitioner_institutions(institution_id, institution(*)),
          practitioner_locations(location_id, location(*)),
          practitioner_contacts(contact_id, contact_details(*))
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      setFormData({
        name: practitioner.name || "",
        image: practitioner.image || "",
        experience: practitioner.experience?.toString() || "",
        education: practitioner.education || [],
        license_number: practitioner.license_number || "",
        profession_type: practitioner.profession_type || [],
        specialization: practitioner.specialization || [],
        insurance: practitioner.insurance || [],
        verified: practitioner.verified || false
      });

      setRelations({
        services: practitioner.practitioner_services?.map(ps => ps.service) || [],
        institutions: practitioner.practitioner_institutions?.map(pi => pi.institution) || [],
        locations: practitioner.practitioner_locations?.map(pl => pl.location) || [],
        contacts: practitioner.practitioner_contacts?.map(pc => pc.contact_details) || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load practitioner data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const practitionerData = {
        name: formData.name,
        image: formData.image,
        experience: formData.experience ? parseFloat(formData.experience) : null,
        education: formData.education,
        license_number: formData.license_number,
        profession_type: formData.profession_type as any,
        specialization: formData.specialization as any,
        insurance: formData.insurance as any,
        verified: formData.verified
      };

      let practitionerId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('practitioner')
          .update(practitionerData)
          .eq('id', parseInt(id));
        if (error) throw error;
        practitionerId = parseInt(id);

        // Delete existing relationships
        await Promise.all([
          supabase.from('practitioner_services').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_institutions').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_locations').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_contacts').delete().eq('practitioner_id', practitionerId)
        ]);
      } else {
        const { data, error } = await supabase
          .from('practitioner')
          .insert(practitionerData)
          .select()
          .single();
        if (error) throw error;
        practitionerId = data.id;
      }

      // Insert new relationships
      const relationPromises = [];

      if (relations.services.length > 0) {
        relationPromises.push(
          supabase.from('practitioner_services').insert(
            relations.services.map(service => ({ practitioner_id: practitionerId, service_id: service.id }))
          )
        );
      }

      if (relations.institutions.length > 0) {
        relationPromises.push(
          supabase.from('practitioner_institutions').insert(
            relations.institutions.map(institution => ({ practitioner_id: practitionerId, institution_id: institution.id }))
          )
        );
      }

      if (relations.locations.length > 0) {
        relationPromises.push(
          supabase.from('practitioner_locations').insert(
            relations.locations.map(location => ({ practitioner_id: practitionerId, location_id: location.id }))
          )
        );
      }

      if (relations.contacts.length > 0) {
        relationPromises.push(
          supabase.from('practitioner_contacts').insert(
            relations.contacts.map(contact => ({ practitioner_id: practitionerId, contact_id: contact.id }))
          )
        );
      }

      await Promise.all(relationPromises);

      toast({
        title: "Success",
        description: `Practitioner ${isEdit ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewService = async (serviceData: any) => {
    try {
      const { data, error } = await supabase
        .from('service')
        .insert({
          name: serviceData.name,
          duration: serviceData.duration,
          price: serviceData.price,
          session_mode: serviceData.session_mode ? serviceData.session_mode.map((mode: string) => mode as any) : []
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        services: [...prev.services, data]
      }));

      setRelations(prev => ({
        ...prev,
        services: [...prev.services, data]
      }));

      toast({
        title: "Success",
        description: "Service created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create service: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleAddNewInstitution = async (institutionData: any) => {
    try {
      const { data, error } = await supabase
        .from('institution')
        .insert({
          name: institutionData.name,
          image: institutionData.image,
          institution_type: institutionData.institution_type as any,
          profession_type: institutionData.profession_type as any,
          specialization: institutionData.specialization as any,
          insurance: institutionData.insurance as any,
          verified: institutionData.verified
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        institutions: [...prev.institutions, data]
      }));

      setRelations(prev => ({
        ...prev,
        institutions: [...prev.institutions, data]
      }));

      toast({
        title: "Success",
        description: "Institution created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create institution: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleAddNewLocation = async (locationData: any) => {
    try {
      const { data, error } = await supabase
        .from('location')
        .insert(locationData)
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        locations: [...prev.locations, data]
      }));

      setRelations(prev => ({
        ...prev,
        locations: [...prev.locations, data]
      }));

      toast({
        title: "Success",
        description: "Location created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create location: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleAddNewContact = async (contactData: any) => {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .insert({
          ...contactData,
          contact_type: contactData.contact_type as any
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        contacts: [...prev.contacts, data]
      }));

      setRelations(prev => ({
        ...prev,
        contacts: [...prev.contacts, data]
      }));

      toast({
        title: "Success",
        description: "Contact created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create contact: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Edit Practitioner' : 'Add New Practitioner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experience">Experience (years)</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="license_number">License Number</Label>
            <Input
              id="license_number"
              value={formData.license_number}
              onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <MultiSelectField
            label="Profession Types"
            options={professionOptions}
            value={formData.profession_type}
            onChange={(value) => setFormData(prev => ({ ...prev, profession_type: value }))}
            getOptionLabel={(v) => v === 'Therapist' ? 'Counselor' : v}
          />
        </div>

        <div>
          <MultiSelectField
            label="Specializations"
            options={specializationOptions}
            value={formData.specialization}
            onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
          />
        </div>

        <div>
          <MultiSelectField
            label="Insurance"
            options={insuranceOptions}
            value={formData.insurance}
            onChange={(value) => setFormData(prev => ({ ...prev, insurance: value }))}
          />
        </div>

        {/* Relationships Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Relationships</h3>
          
          <RelationshipDropdown
            label="Services"
            options={availableData.services}
            selected={relations.services}
            onSelect={(service) => setRelations(prev => ({ ...prev, services: [...prev.services, service] }))}
            onRemove={(service) => setRelations(prev => ({ ...prev, services: prev.services.filter(s => s.id !== service.id) }))}
            renderOption={(service) => service.name}
            renderSelected={(service) => service.name}
            AddNewComponent={AddServiceForm}
            onAddNew={handleAddNewService}
          />

          <RelationshipDropdown
            label="Institutions"
            options={availableData.institutions}
            selected={relations.institutions}
            onSelect={(institution) => setRelations(prev => ({ ...prev, institutions: [...prev.institutions, institution] }))}
            onRemove={(institution) => setRelations(prev => ({ ...prev, institutions: prev.institutions.filter(i => i.id !== institution.id) }))}
            renderOption={(institution) => institution.name}
            renderSelected={(institution) => institution.name}
            AddNewComponent={AddInstitutionForm}
            onAddNew={handleAddNewInstitution}
          />

          <RelationshipDropdown
            label="Locations"
            options={availableData.locations}
            selected={relations.locations}
            onSelect={(location) => setRelations(prev => ({ ...prev, locations: [...prev.locations, location] }))}
            onRemove={(location) => setRelations(prev => ({ ...prev, locations: prev.locations.filter(l => l.id !== location.id) }))}
            renderOption={(location) => `${location.name || location.city}, ${location.city}`}
            renderSelected={(location) => `${location.name || location.city}, ${location.city}`}
            AddNewComponent={AddLocationForm}
            onAddNew={handleAddNewLocation}
          />

          <RelationshipDropdown
            label="Contact Details"
            options={availableData.contacts}
            selected={relations.contacts}
            onSelect={(contact) => setRelations(prev => ({ ...prev, contacts: [...prev.contacts, contact] }))}
            onRemove={(contact) => setRelations(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== contact.id) }))}
            renderOption={(contact) => `${contact.name || contact.contact_type}: ${contact.value}`}
            renderSelected={(contact) => `${contact.name || contact.contact_type}: ${contact.value}`}
            AddNewComponent={AddContactForm}
            onAddNew={handleAddNewContact}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={formData.verified}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: !!checked }))}
          />
          <Label htmlFor="verified">Verified</Label>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Practitioner" : "Create Practitioner & Relationships"}
          </Button>
        </div>
      </form>
    </div>
  );
}