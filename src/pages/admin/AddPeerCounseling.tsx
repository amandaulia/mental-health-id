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

export default function AddPeerCounseling() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    peer_type: [] as string[],
    specialization: [] as string[],
    tags: [] as string[],
    verified: false
  });

  const [relations, setRelations] = useState({
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  const [availableData, setAvailableData] = useState({
    institutions: [] as any[],
    locations: [] as any[],
    contacts: [] as any[]
  });

  // Options for dropdowns
  const peerTypes = ["Peer Counseling", "Group Therapy"];
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
      loadPeerCounselingData();
    }
  }, [id]);

  const loadAvailableData = async () => {
    try {
      const [institutions, locations, contacts] = await Promise.all([
        supabase.from('institution').select('*'),
        supabase.from('location').select('*'),
        supabase.from('contact_details').select('*')
      ]);

      setAvailableData({
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

  const loadPeerCounselingData = async () => {
    if (!id) return;
    
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
      let peerCounselingId: number;

      const peerCounselingData = {
        name: formData.name,
        image: formData.image,
        peer_type: formData.peer_type as any,
        specialization: formData.specialization as any,
        tags: formData.tags,
        verified: formData.verified
      };

      if (isEdit) {
        const { error } = await supabase
          .from('peer_counseling')
          .update(peerCounselingData)
          .eq('id', parseInt(id));
        if (error) throw error;
        peerCounselingId = parseInt(id);
      } else {
        const { data, error } = await supabase
          .from('peer_counseling')
          .insert(peerCounselingData)
          .select()
          .single();
        if (error) throw error;
        peerCounselingId = data.id;
      }

      // Handle relationships
      if (isEdit) {
        await Promise.all([
          supabase.from('institution_peer_counselings').delete().eq('peer_counseling_id', peerCounselingId),
          supabase.from('peer_counseling_locations').delete().eq('peer_counseling_id', peerCounselingId),
          supabase.from('peer_counseling_contacts').delete().eq('peer_counseling_id', peerCounselingId)
        ]);
      }

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
            {isEdit ? 'Edit Peer Counseling' : 'Add New Peer Counseling'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peer Counseling Information</CardTitle>
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

              <MultiSelectField
                label="Peer Types"
                value={formData.peer_type}
                options={peerTypes}
                onChange={(value) => setFormData(prev => ({ ...prev, peer_type: value }))}
              />

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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Peer Counseling' : 'Create Peer Counseling'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}