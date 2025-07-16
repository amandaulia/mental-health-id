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

export default function AddPractitioner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    experience: "",
    education: [] as string[],
    license_number: "",
    profession_type: [] as string[],
    specialization: [] as string[],
    insurance: [] as string[],
    verified: false
  });

  const [relations, setRelations] = useState({
    services: [] as any[],
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [availableData, setAvailableData] = useState({
    services: [] as any[],
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  // Options for dropdowns
  const professionTypes = ["Psychologist", "Psychiatrist", "Therapist"];
  const specializations = [
    "Personality Disorders", "Trauma", "Mood Disorders", "ADHD", "Anxiety",
    "Relationship", "Career", "OCD", "Self Development", "Gender", "Family",
    "Depression", "Interpersonal", "Education"
  ];
  const insuranceTypes = ["Private Insurance", "BPJS"];
  const institutionTypes = ["Private Practice", "Clinic", "Hospital"];
  const sessionModes = ["Chat", "Voice Call", "Video Call", "Offline"];
  const contactTypes = ["WhatsApp", "Phone", "Website", "Instagram", "Email"];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadPractitionerData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [services, institutions, locations, contacts] = await Promise.all([
        supabase.from('service').select('*'),
        supabase.from('institution').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        services: services.data || [],
        institutions: institutions.data || [],
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

  const loadPractitionerData = async () => {
    if (!id) return;
    
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
        .eq('id', id)
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
        ...formData,
        experience: formData.experience ? parseFloat(formData.experience) : null
      };

      let practitionerId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('practitioner')
          .update(practitionerData)
          .eq('id', id);
        if (error) throw error;
        practitionerId = parseInt(id);
      } else {
        const { data, error } = await supabase
          .from('practitioner')
          .insert([practitionerData])
          .select()
          .single();
        if (error) throw error;
        practitionerId = data.id;
      }

      // Handle relationships
      if (isEdit) {
        // Delete existing relationships
        await Promise.all([
          supabase.from('practitioner_services').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_institutions').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_locations').delete().eq('practitioner_id', practitionerId),
          supabase.from('practitioner_contacts').delete().eq('practitioner_id', practitionerId)
        ]);
      }

      // Create new relationships
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
        .insert([{
          name: serviceData.name,
          duration: serviceData.duration ? parseFloat(serviceData.duration) : null,
          price: serviceData.price ? parseFloat(serviceData.price) : null,
          session_mode: serviceData.session_mode || []
        }])
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

  const handleAddNewInstitution = async (institutionData: any) => {
    try {
      const { data, error } = await supabase
        .from('institution')
        .insert([institutionData])
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
            {isEdit ? 'Edit Practitioner' : 'Add New Practitioner'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the practitioner's basic details</CardDescription>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Education</Label>
                <Textarea
                  value={formData.education.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    education: e.target.value.split('\n').filter(line => line.trim()) 
                  }))}
                  placeholder="Enter each education item on a new line"
                  rows={3}
                />
              </div>

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
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
              <CardDescription>Link this practitioner to services, institutions, locations, and contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                title="Institutions"
                entityType="institution"
                selectedItems={relations.institutions}
                availableItems={availableData.institutions}
                onSelectExisting={(item) => setRelations(prev => ({ 
                  ...prev, 
                  institutions: [...prev.institutions, item] 
                }))}
                onRemove={(index) => setRelations(prev => ({ 
                  ...prev, 
                  institutions: prev.institutions.filter((_, i) => i !== index) 
                }))}
                onAddNew={handleAddNewInstitution}
                modalFields={[
                  { key: 'name', label: 'Name', type: 'text', required: true },
                  { key: 'institution_type', label: 'Institution Type', type: 'select', options: institutionTypes, required: true },
                  { key: 'image', label: 'Image URL', type: 'text' },
                  { key: 'verified', label: 'Verified', type: 'checkbox' }
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
              {loading ? 'Saving...' : isEdit ? 'Update Practitioner' : 'Create Practitioner'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}