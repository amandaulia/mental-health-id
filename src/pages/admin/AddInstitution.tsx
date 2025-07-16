import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RelationManager } from "@/components/admin/RelationManager";
import { MultiSelectField } from "@/components/admin/MultiSelectField";

export default function AddInstitution() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    institution_type: "",
    profession_type: [] as string[],
    specialization: [] as string[],
    insurance: [] as string[],
    verified: false
  });

  const [relations, setRelations] = useState({
    practitioners: [] as any[],
    services: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [availableData, setAvailableData] = useState({
    practitioners: [] as any[],
    services: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  // Options for dropdowns
  const institutionTypes = ["Private Practice", "Clinic", "Hospital"];
  const professionTypes = ["Psychologist", "Psychiatrist", "Therapist"];
  const specializations = [
    "Personality Disorders", "Trauma", "Mood Disorders", "ADHD", "Anxiety",
    "Relationship", "Career", "OCD", "Self Development", "Gender", "Family",
    "Depression", "Interpersonal", "Education"
  ];
  const insuranceTypes = ["Private Insurance", "BPJS"];
  const sessionModes = ["Chat", "Voice Call", "Video Call", "Offline"];
  const contactTypes = ["WhatsApp", "Phone", "Website", "Instagram", "Email"];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadInstitutionData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [practitioners, services, locations, contacts] = await Promise.all([
        supabase.from('practitioner').select('*'),
        supabase.from('service').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        practitioners: practitioners.data || [],
        services: services.data || [],
        locations: locations.data || [],
        contacts: contacts.data || []
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
    if (!id) return;
    
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
        .eq('id', id)
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
      let institutionId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('institution')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
        institutionId = parseInt(id);
      } else {
        const { data, error } = await supabase
          .from('institution')
          .insert([formData])
          .select()
          .single();
        if (error) throw error;
        institutionId = data.id;
      }

      // Handle relationships
      if (isEdit) {
        // Delete existing relationships
        await Promise.all([
          supabase.from('practitioner_institutions').delete().eq('institution_id', institutionId),
          supabase.from('institution_services').delete().eq('institution_id', institutionId),
          supabase.from('institution_locations').delete().eq('institution_id', institutionId),
          supabase.from('institution_contacts').delete().eq('institution_id', institutionId)
        ]);
      }

      // Create new relationships
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
        .insert([practitionerData])
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
        .insert([serviceData])
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleAddNewLocation = async (locationData: any) => {
    try {
      const { data, error } = await supabase
        .from('location')
        .insert([locationData])
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
            {isEdit ? 'Edit Institution' : 'Add New Institution'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institution Information</CardTitle>
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
                  <Label>Institution Type *</Label>
                  <Select 
                    value={formData.institution_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, institution_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <MultiSelectField
                label="Profession Types"
                value={formData.profession_type}
                options={professionTypes}
                onChange={(value) => setFormData(prev => ({ ...prev, profession_type: value }))}
              />

              <MultiSelectField
                label="Specializations"
                value={formData.specialization}
                options={specializations}
                onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
              />

              <MultiSelectField
                label="Insurance"
                value={formData.insurance}
                options={insuranceTypes}
                onChange={(value) => setFormData(prev => ({ ...prev, insurance: value }))}
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
              <CardTitle>Relationships</CardTitle>
              <CardDescription>Link this institution to practitioners, services, locations, and contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RelationManager
                title="Practitioners"
                entityType="practitioner"
                selectedItems={relations.practitioners}
                availableItems={availableData.practitioners}
                onSelectExisting={(item) => setRelations(prev => ({ 
                  ...prev, 
                  practitioners: [...prev.practitioners, item] 
                }))}
                onRemove={(index) => setRelations(prev => ({ 
                  ...prev, 
                  practitioners: prev.practitioners.filter((_, i) => i !== index) 
                }))}
                onAddNew={handleAddNewPractitioner}
                modalFields={[
                  { key: 'name', label: 'Name', type: 'text', required: true },
                  { key: 'image', label: 'Image URL', type: 'text' },
                  { key: 'experience', label: 'Experience (years)', type: 'number' },
                  { key: 'verified', label: 'Verified', type: 'checkbox' }
                ]}
              />

              <RelationManager
                title="Services"
                entityType="service"
                selectedItems={relations.services}
                availableItems={availableData.services}
                onSelectExisting={(item) => setRelations(prev => ({ 
                  ...prev, 
                  services: [...prev.services, item] 
                }))}
                onRemove={(index) => setRelations(prev => ({ 
                  ...prev, 
                  services: prev.services.filter((_, i) => i !== index) 
                }))}
                onAddNew={handleAddNewService}
                modalFields={[
                  { key: 'name', label: 'Name', type: 'text', required: true },
                  { key: 'duration', label: 'Duration (minutes)', type: 'number' },
                  { key: 'price', label: 'Price', type: 'number' },
                  { key: 'session_mode', label: 'Session Mode', type: 'select', options: sessionModes }
                ]}
              />

              <RelationManager
                title="Locations"
                entityType="location"
                selectedItems={relations.locations}
                availableItems={availableData.locations}
                onSelectExisting={(item) => setRelations(prev => ({ 
                  ...prev, 
                  locations: [...prev.locations, item] 
                }))}
                onRemove={(index) => setRelations(prev => ({ 
                  ...prev, 
                  locations: prev.locations.filter((_, i) => i !== index) 
                }))}
                onAddNew={handleAddNewLocation}
                modalFields={[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'address', label: 'Address', type: 'text' },
                  { key: 'city', label: 'City', type: 'text', required: true },
                  { key: 'province', label: 'Province', type: 'text', required: true },
                  { key: 'country', label: 'Country', type: 'text', required: true }
                ]}
              />

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
              {loading ? 'Saving...' : isEdit ? 'Update Institution' : 'Create Institution'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
