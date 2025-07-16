import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RelationManager } from "@/components/admin/RelationManager";
import { MultiSelectField } from "@/components/admin/MultiSelectField";

export default function AddOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    specialization: [] as string[],
    verified: false
  });

  const [relations, setRelations] = useState({
    contacts: [] as any[]
  });

  const [availableData, setAvailableData] = useState({
    contacts: [] as any[]
  });

  // Options for dropdowns
  const specializations = [
    "Personality Disorders", "Trauma", "Mood Disorders", "ADHD", "Anxiety",
    "Relationship", "Career", "OCD", "Self Development", "Gender", "Family",
    "Depression", "Interpersonal", "Education"
  ];
  const contactTypes = ["WhatsApp", "Phone", "Website", "Instagram", "Email"];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadOrganizationData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const { data: contacts } = await supabase.from('contact_details').select('*');
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
    if (!id) return;
    
    try {
      const { data: organization, error } = await supabase
        .from('organization')
        .select(`
          *,
          organization_contacts(contact_id, contact_details(*))
        `)
        .eq('id', id)
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
      let organizationId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('organization')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
        organizationId = parseInt(id);
      } else {
        const { data, error } = await supabase
          .from('organization')
          .insert([formData])
          .select()
          .single();
        if (error) throw error;
        organizationId = data.id;
      }

      // Handle relationships
      if (isEdit) {
        await supabase.from('organization_contacts').delete().eq('organization_id', organizationId);
      }

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
        .insert([contactData])
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Organization' : 'Add New Organization'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Organization description"
                  rows={3}
                />
              </div>

              <MultiSelectField
                label="Specializations"
                value={formData.specialization}
                options={specializations}
                onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
              />

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: !!checked }))}
                />
                <Label>Verified</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <RelationManager
                title="Contact Details"
                entityType="contact"
                selectedItems={relations.contacts}
                availableItems={availableData.contacts}
                onSelectExisting={(item) => setRelations(prev => ({ 
                  ...prev, 
                  contacts: [...prev.contacts, item] 
                }))}
                onRemove={(index) => setRelations(prev => ({ 
                  ...prev, 
                  contacts: prev.contacts.filter((_, i) => i !== index) 
                }))}
                onAddNew={handleAddNewContact}
                modalFields={[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'contact_type', label: 'Contact Type', type: 'select', options: contactTypes, required: true },
                  { key: 'value', label: 'Value', type: 'text', required: true },
                  { key: 'link', label: 'Link', type: 'text' }
                ]}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Organization' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}