import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Users, Building2, Heart, Palette, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminSimple() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
      } else if (entityType === "activity") {
        data.duration = formData.duration ? parseFloat(formData.duration) : null;
        data.price = formData.price ? parseFloat(formData.price) : null;
      }

      const tableName = entityType === "contact" ? "contact_details" : entityType;
      const { error } = await supabase
        .from(tableName as any)
        .insert([data] as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${entityType} has been created successfully.`,
      });

      // Reset form
      resetForm(entityType);

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

              <div className="flex items-center space-x-2">
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
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Practitioner"}
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
      </Tabs>
    </div>
  );
}