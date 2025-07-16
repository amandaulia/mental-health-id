import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RelationManager } from "@/components/admin/RelationManager";
import { MultiSelectField } from "@/components/admin/MultiSelectField";

export default function AddActivity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    activity_type: [] as string[],
    duration: "",
    price: "",
    session_mode: [] as string[],
    specialization: [] as string[]
  });

  const [relations, setRelations] = useState({
    institutions: [] as any[],
    organizations: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [availableData, setAvailableData] = useState({
    institutions: [] as any[],
    organizations: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  // Options for dropdowns
  const activityTypes = ["Workshop", "Sport", "Webinar", "Art", "Music", "Movie", "Books"];
  const sessionModes = ["Chat", "Voice Call", "Video Call", "Offline"];
  const specializations = [
    "Personality Disorders", "Trauma", "Mood Disorders", "ADHD", "Anxiety",
    "Relationship", "Career", "OCD", "Self Development", "Gender", "Family",
    "Depression", "Interpersonal", "Education"
  ];
  const institutionTypes = ["Private Practice", "Clinic", "Hospital"];
  const contactTypes = ["WhatsApp", "Phone", "Website", "Instagram", "Email"];

  useEffect(() => {
    loadAvailableData();
    if (isEdit) {
      loadActivityData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [institutions, organizations, locations, contacts] = await Promise.all([
        supabase.from('institution').select('*'),
        supabase.from('organization').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
        institutions: institutions.data || [],
        organizations: organizations.data || [],
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

  const loadActivityData = async () => {
    if (!id) return;
    
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
        .eq('id', id)
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
        ...formData,
        duration: formData.duration ? parseFloat(formData.duration) : null,
        price: formData.price ? parseFloat(formData.price) : null
      };

      let activityId: number;

      if (isEdit) {
        const { error } = await supabase
          .from('activity')
          .update(activityData)
          .eq('id', id);
        if (error) throw error;
        activityId = parseInt(id);
      } else {
        const { data, error } = await supabase
          .from('activity')
          .insert([activityData])
          .select()
          .single();
        if (error) throw error;
        activityId = data.id;
      }

      // Handle relationships
      if (isEdit) {
        await Promise.all([
          supabase.from('activity_institutions').delete().eq('activity_id', activityId),
          supabase.from('activity_organizations').delete().eq('activity_id', activityId),
          supabase.from('activity_locations').delete().eq('activity_id', activityId),
          supabase.from('activity_contacts').delete().eq('activity_id', activityId)
        ]);
      }

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
            {isEdit ? 'Edit Activity' : 'Add New Activity'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Activity description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <MultiSelectField
                label="Activity Types"
                value={formData.activity_type}
                options={activityTypes}
                onChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
              />

              <MultiSelectField
                label="Session Modes"
                value={formData.session_mode}
                options={sessionModes}
                onChange={(value) => setFormData(prev => ({ ...prev, session_mode: value }))}
              />

              <MultiSelectField
                label="Specializations"
                value={formData.specialization}
                options={specializations}
                onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}