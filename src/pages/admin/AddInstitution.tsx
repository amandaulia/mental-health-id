import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MultiSelectField } from '@/components/admin/MultiSelectField';
import { RelationshipDropdown } from '@/components/admin/RelationshipDropdown';
import { AddPractitionerForm } from '@/components/admin/AddPractitionerForm';
import { AddServiceForm } from '@/components/admin/AddServiceForm';
import { AddLocationForm } from '@/components/admin/AddLocationForm';
import { AddContactForm } from '@/components/admin/AddContactForm';

export default function AddInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    institution_type: '',
    profession_type: [],
    specialization: [],
    insurance: [],
    verified: false
  });

  const [availableData, setAvailableData] = useState({
    practitioners: [] as any[],
    services: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [relations, setRelations] = useState({
    practitioners: [] as any[],
    services: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const institutionTypes = [
    'Private Practice',
    'Clinic',
    'Hospital'
  ];

  const professionTypes = [
    'Psychologist',
    'Psychiatrist',
    'Therapist'
  ];

  const specializations = [
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

  const insuranceTypes = [
    'Private Insurance',
    'BPJS'
  ];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadInstitutionData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [practitionersRes, servicesRes, locationsRes, contactsRes] = await Promise.all([
        supabase.from('practitioner').select('*'),
        supabase.from('service').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        practitioners: practitionersRes.data || [],
        services: servicesRes.data || [],
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

  const loadInstitutionData = async () => {
    try {
      const { data: institution, error } = await supabase
        .from('institution')
        .select(`
          *,
          practitioner_institutions(practitioner_id, practitioner(*)),
          institution_services(service_id, service(*)),
          institution_locations(location_id, location(*)),
          institution_contacts(contact_id, contact_details(*))
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      setFormData({
        name: institution.name || "",
        image: institution.image || "",
        institution_type: institution.institution_type || "",
        profession_type: institution.profession_type || [],
        specialization: institution.specialization || [],
        insurance: institution.insurance || [],
        verified: institution.verified || false
      });

      setRelations({
        practitioners: institution.practitioner_institutions?.map(pi => pi.practitioner) || [],
        services: institution.institution_services?.map(is => is.service) || [],
        locations: institution.institution_locations?.map(il => il.location) || [],
        contacts: institution.institution_contacts?.map(ic => ic.contact_details) || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load institution data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const institutionData = {
        name: formData.name,
        image: formData.image,
        institution_type: formData.institution_type as any,
        profession_type: formData.profession_type as any,
        specialization: formData.specialization as any,
        insurance: formData.insurance as any,
        verified: formData.verified
      };

      let institutionId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('institution')
          .update(institutionData)
          .eq('id', parseInt(id));
        if (error) throw error;
        institutionId = parseInt(id);

        // Delete existing relationships
        await Promise.all([
          supabase.from('practitioner_institutions').delete().eq('institution_id', institutionId),
          supabase.from('institution_services').delete().eq('institution_id', institutionId),
          supabase.from('institution_locations').delete().eq('institution_id', institutionId),
          supabase.from('institution_contacts').delete().eq('institution_id', institutionId)
        ]);
      } else {
        const { data, error } = await supabase
          .from('institution')
          .insert(institutionData)
          .select()
          .single();
        if (error) throw error;
        institutionId = data.id;
      }

      // Insert new relationships
      const relationPromises = [];

      if (relations.practitioners.length > 0) {
        relationPromises.push(
          supabase.from('practitioner_institutions').insert(
            relations.practitioners.map(practitioner => ({ institution_id: institutionId, practitioner_id: practitioner.id }))
          )
        );
      }

      if (relations.services.length > 0) {
        relationPromises.push(
          supabase.from('institution_services').insert(
            relations.services.map(service => ({ institution_id: institutionId, service_id: service.id }))
          )
        );
      }

      if (relations.locations.length > 0) {
        relationPromises.push(
          supabase.from('institution_locations').insert(
            relations.locations.map(location => ({ institution_id: institutionId, location_id: location.id }))
          )
        );
      }

      if (relations.contacts.length > 0) {
        relationPromises.push(
          supabase.from('institution_contacts').insert(
            relations.contacts.map(contact => ({ institution_id: institutionId, contact_id: contact.id }))
          )
        );
      }

      await Promise.all(relationPromises);

      toast({
        title: "Success",
        description: `Institution ${isEdit ? 'updated' : 'created'} successfully`,
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

  const handleAddNewPractitioner = async (practitionerData: any) => {
    try {
      const { data, error } = await supabase
        .from('practitioner')
        .insert({
          name: practitionerData.name,
          image: practitionerData.image,
          experience: practitionerData.experience,
          education: practitionerData.education,
          license_number: practitionerData.license_number,
          profession_type: practitionerData.profession_type,
          specialization: practitionerData.specialization,
          insurance: practitionerData.insurance,
          verified: practitionerData.verified
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        practitioners: [...prev.practitioners, data]
      }));

      setRelations(prev => ({
        ...prev,
        practitioners: [...prev.practitioners, data]
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create practitioner",
        variant: "destructive",
      });
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
          {isEdit ? 'Edit Institution' : 'Add New Institution'}
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

        <div>
          <Label>Institution Type</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, institution_type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select institution type" />
            </SelectTrigger>
            <SelectContent>
              {institutionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <MultiSelectField
            label="Profession Types"
            options={professionTypes}
            value={formData.profession_type}
            onChange={(value) => setFormData(prev => ({ ...prev, profession_type: value }))}
          />
        </div>

        <div>
          <MultiSelectField
            label="Specializations"
            options={specializations}
            value={formData.specialization}
            onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
          />
        </div>

        <div>
          <MultiSelectField
            label="Insurance"
            options={insuranceTypes}
            value={formData.insurance}
            onChange={(value) => setFormData(prev => ({ ...prev, insurance: value }))}
          />
        </div>

        {/* Relationships Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Relationships</h3>
          
          <RelationshipDropdown
            label="Practitioners"
            options={availableData.practitioners}
            selected={relations.practitioners}
            onSelect={(practitioner) => setRelations(prev => ({ ...prev, practitioners: [...prev.practitioners, practitioner] }))}
            onRemove={(practitioner) => setRelations(prev => ({ ...prev, practitioners: prev.practitioners.filter(p => p.id !== practitioner.id) }))}
            renderOption={(practitioner) => practitioner.name}
            renderSelected={(practitioner) => practitioner.name}
            AddNewComponent={AddPractitionerForm}
            onAddNew={handleAddNewPractitioner}
          />

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
            {loading ? "Saving..." : isEdit ? "Update Institution" : "Create Institution & Relationships"}
          </Button>
        </div>
      </form>
    </div>
  );
}