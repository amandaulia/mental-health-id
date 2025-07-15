import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Upload, Users, Building2, Heart, Palette, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminSimple() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // State for existing data for relationships
  const [existingData, setExistingData] = useState({
    practitioners: [],
    institutions: [],
    organizations: [],
    peerCounselings: [],
    activities: [],
    locations: [],
    contacts: [],
    services: []
  });

  // Relationship states
  const [practitionerRelations, setPractitionerRelations] = useState({
    institutions: [],
    locations: [],
    contacts: []
  });

  const [institutionRelations, setInstitutionRelations] = useState({
    locations: [],
    contacts: []
  });

  // Dialog states
  const [showAddForms, setShowAddForms] = useState({
    institution: false,
    location: false,
    contact: false
  });

  // New entity forms for dialogs
  const [newEntityForms, setNewEntityForms] = useState({
    institution: { name: "", institution_type: "", verified: false },
    location: { name: "", city: "", province: "", country: "Indonesia", address: "" },
    contact: { contact_type: "", name: "", value: "", link: "" }
  });

  // Form states for different entities
  const [practitionerForm, setPractitionerForm] = useState({
    name: "",
    image: "",
    profession_type: [] as string[],
    specialization: [] as string[],
    insurance: [] as string[],
    education: [] as string[],
    experience: "",
    license_number: "",
    verified: false
  });

  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    image: "",
    institution_type: "",
    profession_type: [] as string[],
    specialization: [] as string[],
    insurance: [] as string[],
    verified: false
  });

  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    description: "",
    image: "",
    specialization: [] as string[],
    verified: false
  });

  const [peerCounselingForm, setPeerCounselingForm] = useState({
    name: "",
    image: "",
    peer_type: [] as string[],
    specialization: [] as string[],
    tags: [] as string[],
    verified: false
  });

  const [activityForm, setActivityForm] = useState({
    name: "",
    description: "",
    activity_type: [] as string[],
    specialization: [] as string[],
    session_mode: [] as string[],
    duration: "",
    price: ""
  });

  const [locationForm, setLocationForm] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    country: "Indonesia"
  });

  const [contactForm, setContactForm] = useState({
    contact_type: "",
    name: "",
    value: "",
    link: ""
  });

  // Options for dropdowns
  const professionTypes = ["Psychologist", "Psychiatrist", "Therapist"];
  const institutionTypes = ["Private Practice", "Clinic", "Hospital"];
  const insuranceTypes = ["Private Insurance", "BPJS"];
  const specializations = [
    "Personality Disorders", "Trauma", "Mood Disorders", "ADHD", "Anxiety",
    "Relationship", "Career", "OCD", "Self Development", "Gender", "Family",
    "Depression", "Interpersonal", "Education"
  ];
  const activityTypes = ["Workshop", "Sport", "Webinar", "Art", "Music", "Movie", "Books"];
  const sessionModes = ["Chat", "Voice Call", "Video Call", "Offline"];
  const peerTypes = ["Peer Counseling", "Group Therapy"];
  const contactTypes = ["WhatsApp", "Phone", "Website", "Instagram", "Email"];

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const [practitioners, institutions, organizations, peerCounselings, activities, locations, contacts, services] = await Promise.all([
        supabase.from('practitioner').select('id, name'),
        supabase.from('institution').select('id, name'),
        supabase.from('organization').select('id, name'),
        supabase.from('peer_counseling').select('id, name'),
        supabase.from('activity').select('id, name'),
        supabase.from('location').select('id, name, city'),
        supabase.from('contact_details').select('id, name, value, contact_type'),
        supabase.from('service').select('id, name')
      ]);

      setExistingData({
        practitioners: practitioners.data || [],
        institutions: institutions.data || [],
        organizations: organizations.data || [],
        peerCounselings: peerCounselings.data || [],
        activities: activities.data || [],
        locations: locations.data || [],
        contacts: contacts.data || [],
        services: services.data || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load existing data",
        variant: "destructive",
      });
    }
  };

  const handleArrayField = (value: string, currentArray: string[], setter: (arr: string[]) => void) => {
    if (value && !currentArray.includes(value)) {
      setter([...currentArray, value]);
    }
  };

  const removeFromArray = (value: string, currentArray: string[], setter: (arr: string[]) => void) => {
    setter(currentArray.filter(item => item !== value));
  };

  const handleSubmit = async (entityType: string, formData: any) => {
    setLoading(true);
    try {
      let data = { ...formData };

      // Clean up data based on entity type
      if (entityType === "practitioner") {
        data.experience = formData.experience ? parseFloat(formData.experience) : null;
        
        // Create practitioner first
        const { data: practitionerData, error: practitionerError } = await supabase
          .from('practitioner')
          .insert([data])
          .select()
          .single();

        if (practitionerError) throw practitionerError;

        // Create relationships for institutions
        for (const institution of practitionerRelations.institutions) {
          const { error: relationError } = await supabase
            .from('practitioner_institutions')
            .insert({ practitioner_id: practitionerData.id, institution_id: institution.id });
          if (relationError) throw relationError;
        }

        // Create relationships for locations
        for (const location of practitionerRelations.locations) {
          const { error: relationError } = await supabase
            .from('practitioner_locations')
            .insert({ practitioner_id: practitionerData.id, location_id: location.id });
          if (relationError) throw relationError;
        }

        // Create relationships for contacts
        for (const contact of practitionerRelations.contacts) {
          const { error: relationError } = await supabase
            .from('practitioner_contacts')
            .insert({ practitioner_id: practitionerData.id, contact_id: contact.id });
          if (relationError) throw relationError;
        }

        // Reset relationship states
        setPractitionerRelations({ institutions: [], locations: [], contacts: [] });
        
      } else if (entityType === "institution") {
        // Create institution first
        const { data: institutionData, error: institutionError } = await supabase
          .from('institution')
          .insert([data])
          .select()
          .single();

        if (institutionError) throw institutionError;

        // Create relationships for locations
        for (const location of institutionRelations.locations) {
          const { error: relationError } = await supabase
            .from('institution_locations')
            .insert({ institution_id: institutionData.id, location_id: location.id });
          if (relationError) throw relationError;
        }

        // Create relationships for contacts
        for (const contact of institutionRelations.contacts) {
          const { error: relationError } = await supabase
            .from('institution_contacts')
            .insert({ institution_id: institutionData.id, contact_id: contact.id });
          if (relationError) throw relationError;
        }

        // Reset relationship states
        setInstitutionRelations({ locations: [], contacts: [] });
        
      } else if (entityType === "activity") {
        data.duration = formData.duration ? parseFloat(formData.duration) : null;
        data.price = formData.price ? parseFloat(formData.price) : null;
        
        const { error } = await supabase
          .from('activity')
          .insert([data] as any);

        if (error) throw error;
      } else {
        const tableName = entityType === "contact" ? "contact_details" : entityType;
        const { error } = await supabase
          .from(tableName as any)
          .insert([data] as any);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${entityType} has been created successfully.`,
      });

      // Reset form
      resetForm(entityType);
      // Refresh existing data for relationships
      loadExistingData();

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

  const resetForm = (entityType: string) => {
    switch (entityType) {
      case "practitioner":
        setPractitionerForm({
          name: "", image: "", profession_type: [], specialization: [], 
          insurance: [], education: [], experience: "", license_number: "", verified: false
        });
        break;
      case "institution":
        setInstitutionForm({
          name: "", image: "", institution_type: "", profession_type: [], 
          specialization: [], insurance: [], verified: false
        });
        break;
      case "organization":
        setOrganizationForm({
          name: "", description: "", image: "", specialization: [], verified: false
        });
        break;
      case "peer_counseling":
        setPeerCounselingForm({
          name: "", image: "", peer_type: [], specialization: [], tags: [], verified: false
        });
        break;
      case "activity":
        setActivityForm({
          name: "", description: "", activity_type: [], specialization: [], session_mode: [], duration: "", price: ""
        });
        break;
      case "location":
        setLocationForm({
          name: "", address: "", city: "", province: "", country: "Indonesia"
        });
        break;
      case "contact":
        setContactForm({
          contact_type: "", name: "", value: "", link: ""
        });
        break;
    }
  };

  const RelationSelector = ({ 
    entityType,
    selectedItems, 
    existingOptions,
    onSelectExisting,
    onRemove, 
    placeholder,
    onShowAddForm
  }: {
    entityType: string;
    selectedItems: any[];
    existingOptions: any[];
    onSelectExisting: (item: any) => void;
    onRemove: (index: number) => void;
    placeholder: string;
    onShowAddForm: () => void;
  }) => (
    <div className="space-y-4">
      {selectedItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Select>
              <SelectTrigger className="h-12 bg-background border-2 border-border rounded-lg">
                <SelectValue placeholder={item.name || `Selected ${entityType}`} />
              </SelectTrigger>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-12 w-12 p-0 bg-muted hover:bg-muted/80"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ))}
      
      {existingOptions.length > 0 && (
        <div className="space-y-2">
          <Select onValueChange={(value) => {
            const selected = existingOptions.find(item => item.id.toString() === value);
            if (selected) onSelectExisting(selected);
          }}>
            <SelectTrigger className="h-12 bg-background border-2 border-border rounded-lg">
              <SelectValue placeholder={`Select existing ${entityType}`} />
            </SelectTrigger>
            <SelectContent>
              {existingOptions.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name || `${item.contact_type}: ${item.value}` || `${item.city}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button 
        onClick={onShowAddForm}
        className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-medium text-sm tracking-wide"
      >
        ADD NEW {entityType.toUpperCase()}
      </Button>
    </div>
  );

  const AddEntityDialog = ({ 
    entityType, 
    isOpen, 
    onClose, 
    onSave 
  }: { 
    entityType: string; 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (data: any) => void; 
  }) => {
    const formData = newEntityForms[entityType as keyof typeof newEntityForms];
    
    const updateForm = (updates: any) => {
      setNewEntityForms(prev => ({
        ...prev,
        [entityType]: { ...prev[entityType as keyof typeof prev], ...updates }
      }));
    };

    const handleSave = () => {
      onSave(formData);
      onClose();
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {entityType}</DialogTitle>
            <DialogDescription>Create a new {entityType} and add it to the relationship</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name *</Label>
              <Input 
                value={formData.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder={`${entityType} name`}
              />
            </div>
            
            {entityType === 'institution' && (
              <div>
                <Label>Type *</Label>
                <Select value={(formData as any).institution_type} onValueChange={(value) => updateForm({ institution_type: value })}>
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
            )}

            {entityType === 'contact' && (
              <>
                <div>
                  <Label>Contact Type *</Label>
                  <Select value={(formData as any).contact_type} onValueChange={(value) => updateForm({ contact_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value *</Label>
                  <Input 
                    value={(formData as any).value}
                    onChange={(e) => updateForm({ value: e.target.value })}
                    placeholder="Contact value"
                  />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input 
                    value={(formData as any).link}
                    onChange={(e) => updateForm({ link: e.target.value })}
                    placeholder="Optional URL"
                  />
                </div>
              </>
            )}

            {entityType === 'location' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>City *</Label>
                    <Input 
                      value={(formData as any).city}
                      onChange={(e) => updateForm({ city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>Province *</Label>
                    <Input 
                      value={(formData as any).province}
                      onChange={(e) => updateForm({ province: e.target.value })}
                      placeholder="Province"
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea 
                    value={(formData as any).address}
                    onChange={(e) => updateForm({ address: e.target.value })}
                    placeholder="Full address"
                  />
                </div>
              </>
            )}

            {['institution'].includes(entityType) && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={(formData as any).verified}
                  onCheckedChange={(checked) => updateForm({ verified: !!checked })}
                />
                <Label>Verified</Label>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name}>Create & Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleCreateAndAddEntity = async (entityType: string, formData: any) => {
    try {
      setLoading(true);
      const tableName = entityType === 'contact' ? 'contact_details' : entityType;
      
      const { data, error } = await supabase
        .from(tableName as any)
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Add to appropriate relationship state
      if (entityType === 'institution') {
        setPractitionerRelations(prev => ({
          ...prev,
          institutions: [...prev.institutions, data]
        }));
        setInstitutionRelations(prev => ({
          ...prev,
          institutions: [...(prev as any).institutions || [], data]
        }));
      } else if (entityType === 'location') {
        setPractitionerRelations(prev => ({
          ...prev,
          locations: [...prev.locations, data]
        }));
        setInstitutionRelations(prev => ({
          ...prev,
          locations: [...prev.locations, data]
        }));
      } else if (entityType === 'contact') {
        setPractitionerRelations(prev => ({
          ...prev,
          contacts: [...prev.contacts, data]
        }));
        setInstitutionRelations(prev => ({
          ...prev,
          contacts: [...prev.contacts, data]
        }));
      }

      // Refresh existing data
      loadExistingData();

      toast({
        title: "Success",
        description: `${entityType} created and added to relationship`,
      });

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

  const ArrayFieldInput = ({ 
    value, 
    options, 
    currentArray, 
    onAdd, 
    onRemove, 
    placeholder 
  }: {
    value: string;
    options: string[];
    currentArray: string[];
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={value} onValueChange={onAdd}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {currentArray.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onRemove(item)} 
            />
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Data Upload</h1>
        <p className="text-muted-foreground">Upload data to populate the mental health directory. Create relationships by referencing IDs after creating entities.</p>
      </div>

      <Tabs defaultValue="practitioner" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="practitioner" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Practitioners
          </TabsTrigger>
          <TabsTrigger value="institution" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Institutions
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="peer_counseling" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Peer Counseling
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Contacts
          </TabsTrigger>
        </TabsList>

        {/* Practitioner Form */}
        <TabsContent value="practitioner">
          <Card>
            <CardHeader>
              <CardTitle>Add Practitioner</CardTitle>
              <CardDescription>Add a mental health practitioner to the directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-name">Name *</Label>
                  <Input 
                    id="p-name"
                    value={practitionerForm.name}
                    onChange={(e) => setPractitionerForm({...practitionerForm, name: e.target.value})}
                    placeholder="Practitioner name"
                  />
                </div>
                <div>
                  <Label htmlFor="p-image">Image URL</Label>
                  <Input 
                    id="p-image"
                    value={practitionerForm.image}
                    onChange={(e) => setPractitionerForm({...practitionerForm, image: e.target.value})}
                    placeholder="Image URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-experience">Experience (years)</Label>
                  <Input 
                    id="p-experience"
                    type="number"
                    value={practitionerForm.experience}
                    onChange={(e) => setPractitionerForm({...practitionerForm, experience: e.target.value})}
                    placeholder="Years of experience"
                  />
                </div>
                <div>
                  <Label htmlFor="p-license">License Number</Label>
                  <Input 
                    id="p-license"
                    value={practitionerForm.license_number}
                    onChange={(e) => setPractitionerForm({...practitionerForm, license_number: e.target.value})}
                    placeholder="License number"
                  />
                </div>
              </div>

              <div>
                <Label>Profession Types</Label>
                <ArrayFieldInput
                  value=""
                  options={professionTypes}
                  currentArray={practitionerForm.profession_type}
                  onAdd={(value) => handleArrayField(value, practitionerForm.profession_type, (arr) => setPractitionerForm({...practitionerForm, profession_type: arr}))}
                  onRemove={(value) => removeFromArray(value, practitionerForm.profession_type, (arr) => setPractitionerForm({...practitionerForm, profession_type: arr}))}
                  placeholder="Select profession type"
                />
              </div>

              <div>
                <Label>Specializations</Label>
                <ArrayFieldInput
                  value=""
                  options={specializations}
                  currentArray={practitionerForm.specialization}
                  onAdd={(value) => handleArrayField(value, practitionerForm.specialization, (arr) => setPractitionerForm({...practitionerForm, specialization: arr}))}
                  onRemove={(value) => removeFromArray(value, practitionerForm.specialization, (arr) => setPractitionerForm({...practitionerForm, specialization: arr}))}
                  placeholder="Select specialization"
                />
              </div>

              <div>
                <Label>Insurance</Label>
                <ArrayFieldInput
                  value=""
                  options={insuranceTypes}
                  currentArray={practitionerForm.insurance}
                  onAdd={(value) => handleArrayField(value, practitionerForm.insurance, (arr) => setPractitionerForm({...practitionerForm, insurance: arr}))}
                  onRemove={(value) => removeFromArray(value, practitionerForm.insurance, (arr) => setPractitionerForm({...practitionerForm, insurance: arr}))}
                  placeholder="Select insurance type"
                />
              </div>

              <Separator className="my-6" />

              {/* Practitioner Relationships */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Associated Institutions, Locations & Contact Details</h3>
                
                <div>
                  <Label className="text-base font-medium">Institutions</Label>
                  <RelationSelector
                    entityType="institution"
                    selectedItems={practitionerRelations.institutions}
                    existingOptions={existingData.institutions}
                    onSelectExisting={(item) => setPractitionerRelations(prev => ({
                      ...prev,
                      institutions: [...prev.institutions, item]
                    }))}
                    onRemove={(index) => setPractitionerRelations(prev => ({
                      ...prev,
                      institutions: prev.institutions.filter((_, i) => i !== index)
                    }))}
                    placeholder="Select Institution"
                    onShowAddForm={() => setShowAddForms(prev => ({ ...prev, institution: true }))}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Locations</Label>
                  <RelationSelector
                    entityType="location"
                    selectedItems={practitionerRelations.locations}
                    existingOptions={existingData.locations}
                    onSelectExisting={(item) => setPractitionerRelations(prev => ({
                      ...prev,
                      locations: [...prev.locations, item]
                    }))}
                    onRemove={(index) => setPractitionerRelations(prev => ({
                      ...prev,
                      locations: prev.locations.filter((_, i) => i !== index)
                    }))}
                    placeholder="Select Location"
                    onShowAddForm={() => setShowAddForms(prev => ({ ...prev, location: true }))}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Contact Details</Label>
                  <RelationSelector
                    entityType="contact"
                    selectedItems={practitionerRelations.contacts}
                    existingOptions={existingData.contacts}
                    onSelectExisting={(item) => setPractitionerRelations(prev => ({
                      ...prev,
                      contacts: [...prev.contacts, item]
                    }))}
                    onRemove={(index) => setPractitionerRelations(prev => ({
                      ...prev,
                      contacts: prev.contacts.filter((_, i) => i !== index)
                    }))}
                    placeholder="Select Contact"
                    onShowAddForm={() => setShowAddForms(prev => ({ ...prev, contact: true }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox 
                  id="p-verified"
                  checked={practitionerForm.verified}
                  onCheckedChange={(checked) => setPractitionerForm({...practitionerForm, verified: !!checked})}
                />
                <Label htmlFor="p-verified">Verified</Label>
              </div>

              <Button 
                onClick={() => handleSubmit("practitioner", practitionerForm)}
                disabled={loading || !practitionerForm.name}
                className="w-full mt-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Practitioner & Relationships"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Form */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Add Location</CardTitle>
              <CardDescription>Add a location that can be used by other entities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="l-name">Location Name</Label>
                  <Input 
                    id="l-name"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                    placeholder="Location name"
                  />
                </div>
                <div>
                  <Label htmlFor="l-city">City *</Label>
                  <Input 
                    id="l-city"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                    placeholder="City"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="l-address">Address</Label>
                <Textarea 
                  id="l-address"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="l-province">Province *</Label>
                  <Input 
                    id="l-province"
                    value={locationForm.province}
                    onChange={(e) => setLocationForm({...locationForm, province: e.target.value})}
                    placeholder="Province"
                  />
                </div>
                <div>
                  <Label htmlFor="l-country">Country *</Label>
                  <Input 
                    id="l-country"
                    value={locationForm.country}
                    onChange={(e) => setLocationForm({...locationForm, country: e.target.value})}
                    placeholder="Country"
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSubmit("location", locationForm)}
                disabled={loading || !locationForm.city || !locationForm.province || !locationForm.country}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Location"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Details Form */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Add Contact Details</CardTitle>
              <CardDescription>Add contact information that can be used by other entities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="c-type">Contact Type *</Label>
                <Select value={contactForm.contact_type} onValueChange={(value) => setContactForm({...contactForm, contact_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-name">Display Name</Label>
                  <Input 
                    id="c-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Display name (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="c-value">Contact Value *</Label>
                  <Input 
                    id="c-value"
                    value={contactForm.value}
                    onChange={(e) => setContactForm({...contactForm, value: e.target.value})}
                    placeholder="Phone number, email, username, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="c-link">Link (URL)</Label>
                <Input 
                  id="c-link"
                  value={contactForm.link}
                  onChange={(e) => setContactForm({...contactForm, link: e.target.value})}
                  placeholder="Optional URL link"
                />
              </div>

              <Button 
                onClick={() => handleSubmit("contact", contactForm)}
                disabled={loading || !contactForm.contact_type || !contactForm.value}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Contact Details"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institution Form */}
        <TabsContent value="institution">
          <Card>
            <CardHeader>
              <CardTitle>Add Institution</CardTitle>
              <CardDescription>Add a mental health institution to the directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="i-name">Name *</Label>
                  <Input 
                    id="i-name"
                    value={institutionForm.name}
                    onChange={(e) => setInstitutionForm({...institutionForm, name: e.target.value})}
                    placeholder="Institution name"
                  />
                </div>
                <div>
                  <Label htmlFor="i-type">Institution Type *</Label>
                  <Select value={institutionForm.institution_type} onValueChange={(value) => setInstitutionForm({...institutionForm, institution_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
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
                <Label htmlFor="i-image">Image URL</Label>
                <Input 
                  id="i-image"
                  value={institutionForm.image}
                  onChange={(e) => setInstitutionForm({...institutionForm, image: e.target.value})}
                  placeholder="Image URL"
                />
              </div>

              <div>
                <Label>Profession Types</Label>
                <ArrayFieldInput
                  value=""
                  options={professionTypes}
                  currentArray={institutionForm.profession_type}
                  onAdd={(value) => handleArrayField(value, institutionForm.profession_type, (arr) => setInstitutionForm({...institutionForm, profession_type: arr}))}
                  onRemove={(value) => removeFromArray(value, institutionForm.profession_type, (arr) => setInstitutionForm({...institutionForm, profession_type: arr}))}
                  placeholder="Select profession type"
                />
              </div>

              <div>
                <Label>Specializations</Label>
                <ArrayFieldInput
                  value=""
                  options={specializations}
                  currentArray={institutionForm.specialization}
                  onAdd={(value) => handleArrayField(value, institutionForm.specialization, (arr) => setInstitutionForm({...institutionForm, specialization: arr}))}
                  onRemove={(value) => removeFromArray(value, institutionForm.specialization, (arr) => setInstitutionForm({...institutionForm, specialization: arr}))}
                  placeholder="Select specialization"
                />
              </div>

              <div>
                <Label>Insurance</Label>
                <ArrayFieldInput
                  value=""
                  options={insuranceTypes}
                  currentArray={institutionForm.insurance}
                  onAdd={(value) => handleArrayField(value, institutionForm.insurance, (arr) => setInstitutionForm({...institutionForm, insurance: arr}))}
                  onRemove={(value) => removeFromArray(value, institutionForm.insurance, (arr) => setInstitutionForm({...institutionForm, insurance: arr}))}
                  placeholder="Select insurance type"
                />
              </div>

              <Separator className="my-6" />

              {/* Institution Relationships */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Associated Locations & Contact Details</h3>
                
                <div>
                  <Label className="text-base font-medium">Locations</Label>
                  <RelationSelector
                    entityType="location"
                    selectedItems={institutionRelations.locations}
                    existingOptions={existingData.locations}
                    onSelectExisting={(item) => setInstitutionRelations(prev => ({
                      ...prev,
                      locations: [...prev.locations, item]
                    }))}
                    onRemove={(index) => setInstitutionRelations(prev => ({
                      ...prev,
                      locations: prev.locations.filter((_, i) => i !== index)
                    }))}
                    placeholder="Select Location"
                    onShowAddForm={() => setShowAddForms(prev => ({ ...prev, location: true }))}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Contact Details</Label>
                  <RelationSelector
                    entityType="contact"
                    selectedItems={institutionRelations.contacts}
                    existingOptions={existingData.contacts}
                    onSelectExisting={(item) => setInstitutionRelations(prev => ({
                      ...prev,
                      contacts: [...prev.contacts, item]
                    }))}
                    onRemove={(index) => setInstitutionRelations(prev => ({
                      ...prev,
                      contacts: prev.contacts.filter((_, i) => i !== index)
                    }))}
                    placeholder="Select Contact"
                    onShowAddForm={() => setShowAddForms(prev => ({ ...prev, contact: true }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox 
                  id="i-verified"
                  checked={institutionForm.verified}
                  onCheckedChange={(checked) => setInstitutionForm({...institutionForm, verified: !!checked})}
                />
                <Label htmlFor="i-verified">Verified</Label>
              </div>

              <Button 
                onClick={() => handleSubmit("institution", institutionForm)}
                disabled={loading || !institutionForm.name || !institutionForm.institution_type}
                className="w-full mt-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Institution & Relationships"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Entity Dialogs */}
      {Object.entries(showAddForms).map(([entityType, isOpen]) => (
        <AddEntityDialog
          key={entityType}
          entityType={entityType}
          isOpen={isOpen}
          onClose={() => setShowAddForms(prev => ({ ...prev, [entityType]: false }))}
          onSave={(data) => handleCreateAndAddEntity(entityType, data)}
        />
      ))}
    </div>
  );
}