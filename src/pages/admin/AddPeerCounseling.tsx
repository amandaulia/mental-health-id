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
import { AddInstitutionForm } from '@/components/admin/AddInstitutionForm';
import { AddLocationForm } from '@/components/admin/AddLocationForm';
import { AddContactForm } from '@/components/admin/AddContactForm';

export default function AddPeerCounseling() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    peer_type: [],
    specialization: [],
    tags: [],
    verified: false
  });

  const [availableData, setAvailableData] = useState({
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [relations, setRelations] = useState({
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const peerTypes = [
    'Peer Counseling',
    'Group Therapy'
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
      loadPeerCounselingData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [institutionsRes, locationsRes, contactsRes] = await Promise.all([
        supabase.from('institution').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
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

  const loadPeerCounselingData = async () => {
    try {
      const { data: peerCounseling, error } = await supabase
        .from('peer_counseling')
        .select(`
          *,
          institution_peer_counselings(institution_id, institution(*)),
          peer_counseling_locations(location_id, location(*)),
          peer_counseling_contacts(contact_id, contact_details(*))
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      setFormData({
        name: peerCounseling.name || "",
        image: peerCounseling.image || "",
        peer_type: peerCounseling.peer_type || [],
        specialization: peerCounseling.specialization || [],
        tags: peerCounseling.tags || [],
        verified: peerCounseling.verified || false
      });

      setRelations({
        institutions: peerCounseling.institution_peer_counselings?.map(ipc => ipc.institution) || [],
        locations: peerCounseling.peer_counseling_locations?.map(pcl => pcl.location) || [],
        contacts: peerCounseling.peer_counseling_contacts?.map(pcc => pcc.contact_details) || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load peer counseling data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const peerCounselingData = {
        name: formData.name,
        image: formData.image,
        peer_type: formData.peer_type as any,
        specialization: formData.specialization as any,
        tags: formData.tags,
        verified: formData.verified
      };

      let peerCounselingId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('peer_counseling')
          .update(peerCounselingData)
          .eq('id', parseInt(id));
        if (error) throw error;
        peerCounselingId = parseInt(id);

        // Delete existing relationships
        await Promise.all([
          supabase.from('institution_peer_counselings').delete().eq('peer_counseling_id', peerCounselingId),
          supabase.from('peer_counseling_locations').delete().eq('peer_counseling_id', peerCounselingId),
          supabase.from('peer_counseling_contacts').delete().eq('peer_counseling_id', peerCounselingId)
        ]);
      } else {
        const { data, error } = await supabase
          .from('peer_counseling')
          .insert(peerCounselingData)
          .select()
          .single();
        if (error) throw error;
        peerCounselingId = data.id;
      }

      // Insert new relationships
      const relationPromises = [];

      if (relations.institutions.length > 0) {
        relationPromises.push(
          supabase.from('institution_peer_counselings').insert(
            relations.institutions.map(institution => ({ peer_counseling_id: peerCounselingId, institution_id: institution.id }))
          )
        );
      }

      if (relations.locations.length > 0) {
        relationPromises.push(
          supabase.from('peer_counseling_locations').insert(
            relations.locations.map(location => ({ peer_counseling_id: peerCounselingId, location_id: location.id }))
          )
        );
      }

      if (relations.contacts.length > 0) {
        relationPromises.push(
          supabase.from('peer_counseling_contacts').insert(
            relations.contacts.map(contact => ({ peer_counseling_id: peerCounselingId, contact_id: contact.id }))
          )
        );
      }

      await Promise.all(relationPromises);

      toast({
        title: "Success",
        description: `Peer counseling ${isEdit ? 'updated' : 'created'} successfully`,
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
        .insert(contactData)
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
          {isEdit ? 'Edit Peer Counseling' : 'Add New Peer Counseling'}
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
          <MultiSelectField
            label="Peer Type"
            options={peerTypes}
            value={formData.peer_type}
            onChange={(value) => setFormData(prev => ({ ...prev, peer_type: value }))}
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
            {loading ? "Saving..." : isEdit ? "Update Peer Counseling" : "Create Peer Counseling & Relationships"}
          </Button>
        </div>
      </form>
    </div>
  );
}