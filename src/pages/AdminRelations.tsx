import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Users, Building2, Heart, Palette, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminRelations() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // State for existing data
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

  // Relationship forms
  const [practitionerRelations, setPractitionerRelations] = useState({
    institutions: [],
    services: [],
    locations: [],
    contacts: [],
    organizations: [],
    peerCounselings: []
  });

  const [institutionRelations, setInstitutionRelations] = useState({
    practitioners: [],
    services: [],
    locations: [],
    contacts: [],
    peerCounselings: []
  });

  const [showAddForms, setShowAddForms] = useState({
    institution: false,
    service: false,
    location: false,
    contact: false,
    organization: false,
    peerCounseling: false,
    practitioner: false,
    activity: false
  });

  // New entity forms
  const [newEntityForms, setNewEntityForms] = useState({
    institution: { name: "", institution_type: "", verified: false },
    service: { name: "", duration: "", price: "", description: "" },
    location: { name: "", city: "", province: "", country: "Indonesia", address: "" },
    contact: { contact_type: "", name: "", value: "", link: "" },
    organization: { name: "", description: "", verified: false },
    peerCounseling: { name: "", verified: false },
    practitioner: { name: "", verified: false },
    activity: { name: "", description: "" }
  });

  // Options
  const institutionTypes = ["Private Practice", "Clinic", "Hospital"];
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

  const DestinationSelector = ({ 
    entityType,
    selectedItems, 
    existingOptions,
    onSelectExisting,
    onRemove, 
    placeholder,
    showAddForm,
    onShowAddForm
  }: {
    entityType: string;
    selectedItems: any[];
    existingOptions: any[];
    onSelectExisting: (item: any) => void;
    onRemove: (index: number) => void;
    placeholder: string;
    showAddForm: boolean;
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

            {(entityType === 'service' || entityType === 'activity') && (
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={(formData as any).description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Description"
                />
              </div>
            )}

            {['institution', 'organization', 'peerCounseling', 'practitioner'].includes(entityType) && (
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
      const tableName = entityType === 'peerCounseling' ? 'peer_counseling' : 
                       entityType === 'contact' ? 'contact_details' : entityType;
      
      const { data, error } = await supabase
        .from(tableName as any)
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Add to relationship
      // This would depend on which tab we're on - for now just adding to practitioners
      setPractitionerRelations(prev => ({
        ...prev,
        [entityType + 's']: [...prev[entityType + 's' as keyof typeof prev], data]
      }));

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Relations Manager</h1>
        <p className="text-muted-foreground">Create relationships between entities. Select existing items or add new ones.</p>
      </div>

      <Tabs defaultValue="practitioner" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="practitioner">
            <Users className="h-4 w-4 mr-2" />
            Practitioner
          </TabsTrigger>
          <TabsTrigger value="institution">
            <Building2 className="h-4 w-4 mr-2" />
            Institution
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="peer_counseling">
            <Heart className="h-4 w-4 mr-2" />
            Peer Counseling
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Palette className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practitioner">
          <Card>
            <CardHeader>
              <CardTitle>Practitioner Relationships</CardTitle>
              <CardDescription>Add relationships for a practitioner with institutions, services, locations, contacts, organizations, and peer counseling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Institutions</Label>
                <DestinationSelector
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
                  showAddForm={showAddForms.institution}
                  onShowAddForm={() => setShowAddForms(prev => ({ ...prev, institution: true }))}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Locations</Label>
                <DestinationSelector
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
                  showAddForm={showAddForms.location}
                  onShowAddForm={() => setShowAddForms(prev => ({ ...prev, location: true }))}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Contact Details</Label>
                <DestinationSelector
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
                  showAddForm={showAddForms.contact}
                  onShowAddForm={() => setShowAddForms(prev => ({ ...prev, contact: true }))}
                />
              </div>
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