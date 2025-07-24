import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MultiSelectField } from '@/components/admin/MultiSelectField';
import { RelationshipDropdown } from '@/components/admin/RelationshipDropdown';
import { AddInstitutionForm } from '@/components/admin/AddInstitutionForm';
import { AddOrganizationForm } from '@/components/admin/AddOrganizationForm';
import { AddLocationForm } from '@/components/admin/AddLocationForm';
import { AddContactForm } from '@/components/admin/AddContactForm';

export default function AddActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activity_type: [],
    duration: '',
    price: '',
    session_mode: [],
    specialization: []
  });

  const [availableData, setAvailableData] = useState({
    institutions: [] as any[],
    organizations: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [relations, setRelations] = useState({
    institutions: [] as any[],
    organizations: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const activityTypes = [
    'Workshop',
    'Sport',
    'Webinar',
    'Art',
    'Music',
    'Movie',
    'Books'
  ];

  const sessionModes = [
    'Chat',
    'Voice Call',
    'Video Call',
    'Offline'
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

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadActivityData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [institutionsRes, organizationsRes, locationsRes, contactsRes] = await Promise.all([
        supabase.from('institution').select('*'),
        supabase.from('organization').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        institutions: institutionsRes.data || [],
        organizations: organizationsRes.data || [],
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

  const loadActivityData = async () => {
    try {
      const { data: activity, error } = await supabase
        .from('activity')
        .select(`
          *,
          activity_institutions(institution_id, institution(*)),
          activity_organizations(organization_id, organization(*)),
          activity_locations(location_id, location(*)),
          activity_contacts(contact_id, contact_details(*))
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      setFormData({
        name: activity.name || "",
        description: activity.description || "",
        activity_type: activity.activity_type || [],
        duration: activity.duration?.toString() || "",
        price: activity.price?.toString() || "",
        session_mode: activity.session_mode || [],
        specialization: activity.specialization || []
      });

      setRelations({
        institutions: activity.activity_institutions?.map(ai => ai.institution) || [],
        organizations: activity.activity_organizations?.map(ao => ao.organization) || [],
        locations: activity.activity_locations?.map(al => al.location) || [],
        contacts: activity.activity_contacts?.map(ac => ac.contact_details) || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load activity data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const activityData = {
        name: formData.name,
        description: formData.description,
        activity_type: formData.activity_type as any,
        duration: formData.duration ? parseFloat(formData.duration) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        session_mode: formData.session_mode as any,
        specialization: formData.specialization as any
      };

      let activityId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('activity')
          .update(activityData)
          .eq('id', parseInt(id));
        if (error) throw error;
        activityId = parseInt(id);

        // Delete existing relationships
        await Promise.all([
          supabase.from('activity_institutions').delete().eq('activity_id', activityId),
          supabase.from('activity_organizations').delete().eq('activity_id', activityId),
          supabase.from('activity_locations').delete().eq('activity_id', activityId),
          supabase.from('activity_contacts').delete().eq('activity_id', activityId)
        ]);
      } else {
        const { data, error } = await supabase
          .from('activity')
          .insert(activityData)
          .select()
          .single();
        if (error) throw error;
        activityId = data.id;
      }

      // Insert new relationships
      const relationPromises = [];

      if (relations.institutions.length > 0) {
        relationPromises.push(
          supabase.from('activity_institutions').insert(
            relations.institutions.map(institution => ({ activity_id: activityId, institution_id: institution.id }))
          )
        );
      }

      if (relations.organizations.length > 0) {
        relationPromises.push(
          supabase.from('activity_organizations').insert(
            relations.organizations.map(organization => ({ activity_id: activityId, organization_id: organization.id }))
          )
        );
      }

      if (relations.locations.length > 0) {
        relationPromises.push(
          supabase.from('activity_locations').insert(
            relations.locations.map(location => ({ activity_id: activityId, location_id: location.id }))
          )
        );
      }

      if (relations.contacts.length > 0) {
        relationPromises.push(
          supabase.from('activity_contacts').insert(
            relations.contacts.map(contact => ({ activity_id: activityId, contact_id: contact.id }))
          )
        );
      }

      await Promise.all(relationPromises);

      toast({
        title: "Success",
        description: `Activity ${isEdit ? 'updated' : 'created'} successfully`,
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

  const handleAddNewInstitution = async (institutionData: any) => {
    try {
      const { data, error } = await supabase
        .from('institution')
        .insert({
          name: institutionData.name,
          image: institutionData.image,
          institution_type: institutionData.institution_type,
          profession_type: institutionData.profession_type,
          specialization: institutionData.specialization,
          insurance: institutionData.insurance,
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create institution",
        variant: "destructive",
      });
    }
  };

  const handleAddNewOrganization = async (organizationData: any) => {
    try {
      const { data, error } = await supabase
        .from('organization')
        .insert({
          name: organizationData.name,
          image: organizationData.image,
          description: organizationData.description,
          specialization: organizationData.specialization,
          verified: organizationData.verified
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableData(prev => ({
        ...prev,
        organizations: [...prev.organizations, data]
      }));

      setRelations(prev => ({
        ...prev,
        organizations: [...prev.organizations, data]
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create organization",
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create location",
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create contact",
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
          {isEdit ? 'Edit Activity' : 'Add New Activity'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <MultiSelectField
            label="Activity Type"
            options={activityTypes}
            value={formData.activity_type}
            onChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <MultiSelectField
            label="Session Mode"
            options={sessionModes}
            value={formData.session_mode}
            onChange={(value) => setFormData(prev => ({ ...prev, session_mode: value }))}
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

        {/* Relationships Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Relationships</h3>
          
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
            label="Organizations"
            options={availableData.organizations}
            selected={relations.organizations}
            onSelect={(organization) => setRelations(prev => ({ ...prev, organizations: [...prev.organizations, organization] }))}
            onRemove={(organization) => setRelations(prev => ({ ...prev, organizations: prev.organizations.filter(o => o.id !== organization.id) }))}
            renderOption={(organization) => organization.name}
            renderSelected={(organization) => organization.name}
            AddNewComponent={AddOrganizationForm}
            onAddNew={handleAddNewOrganization}
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

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Activity" : "Create Activity & Relationships"}
          </Button>
        </div>
      </form>
    </div>
  );
}