import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MultiSelectField } from '@/components/admin/MultiSelectField';
import { RelationshipDropdown } from '@/components/admin/RelationshipDropdown';
import { AddContactForm } from '@/components/admin/AddContactForm';

export default function AddOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    specialization: [],
    verified: false
  });

  const [availableData, setAvailableData] = useState({
    contacts: [] as any[]
  });

  const [relations, setRelations] = useState({
    contacts: [] as any[]
  });

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
      loadOrganizationData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const { data: contacts, error } = await supabase
        .from('contact_details')
        .select('*');

      if (error) throw error;

      setAvailableData({
        contacts: contacts || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load available data",
        variant: "destructive",
      });
    }
  };

  const loadOrganizationData = async () => {
    try {
      const { data: organization, error } = await supabase
        .from('organization')
        .select(`
          *,
          organization_contacts(contact_id, contact_details(*))
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      setFormData({
        name: organization.name || "",
        image: organization.image || "",
        description: organization.description || "",
        specialization: organization.specialization || [],
        verified: organization.verified || false
      });

      setRelations({
        contacts: organization.organization_contacts?.map(oc => oc.contact_details) || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const organizationData = {
        name: formData.name,
        image: formData.image,
        description: formData.description,
        specialization: formData.specialization as any,
        verified: formData.verified
      };

      let organizationId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('organization')
          .update(organizationData)
          .eq('id', parseInt(id));
        if (error) throw error;
        organizationId = parseInt(id);

        // Delete existing relationships
        await supabase.from('organization_contacts').delete().eq('organization_id', organizationId);
      } else {
        const { data, error } = await supabase
          .from('organization')
          .insert(organizationData)
          .select()
          .single();
        if (error) throw error;
        organizationId = data.id;
      }

      // Insert new relationships
      if (relations.contacts.length > 0) {
        await supabase.from('organization_contacts').insert(
          relations.contacts.map(contact => ({ organization_id: organizationId, contact_id: contact.id }))
        );
      }

      toast({
        title: "Success",
        description: `Organization ${isEdit ? 'updated' : 'created'} successfully`,
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
          {isEdit ? 'Edit Organization' : 'Add New Organization'}
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
            {loading ? "Saving..." : isEdit ? "Update Organization" : "Create Organization & Relationships"}
          </Button>
        </div>
      </form>
    </div>
  );
}