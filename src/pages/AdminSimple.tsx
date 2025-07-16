import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminSimple() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State for existing data
  const [data, setData] = useState({
    practitioners: [],
    institutions: [],
    organizations: [],
    peerCounselings: [],
    activities: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [practitioners, institutions, organizations, peerCounselings, activities] = await Promise.all([
        supabase.from('practitioner').select('*'),
        supabase.from('institution').select('*'),
        supabase.from('organization').select('*'),
        supabase.from('peer_counseling').select('*'),
        supabase.from('activity').select('*')
      ]);

      setData({
        practitioners: practitioners.data || [],
        institutions: institutions.data || [],
        organizations: organizations.data || [],
        peerCounselings: peerCounselings.data || [],
        activities: activities.data || []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const DataTable = ({ 
    data, 
    entityType, 
    columns 
  }: { 
    data: any[], 
    entityType: string, 
    columns: { key: string, label: string }[] 
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{entityType} Data</h3>
        <Button 
          onClick={() => navigate(`/admin/${entityType.toLowerCase().replace(' ', '-')}/add`)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New {entityType}
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {Array.isArray(item[column.key]) 
                    ? item[column.key]?.join(', ') || '-'
                    : item[column.key] || '-'
                  }
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/${entityType.toLowerCase().replace(' ', '-')}/edit/${item.id}`)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                No {entityType.toLowerCase()} found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const practitionerColumns = [
    { key: 'name', label: 'Name' },
    { key: 'profession_type', label: 'Profession' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'experience', label: 'Experience (years)' },
    { key: 'verified', label: 'Verified' }
  ];

  const institutionColumns = [
    { key: 'name', label: 'Name' },
    { key: 'institution_type', label: 'Type' },
    { key: 'profession_type', label: 'Profession Types' },
    { key: 'verified', label: 'Verified' }
  ];

  const organizationColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'verified', label: 'Verified' }
  ];

  const peerCounselingColumns = [
    { key: 'name', label: 'Name' },
    { key: 'peer_type', label: 'Type' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'verified', label: 'Verified' }
  ];

  const activityColumns = [
    { key: 'name', label: 'Name' },
    { key: 'activity_type', label: 'Type' },
    { key: 'duration', label: 'Duration' },
    { key: 'price', label: 'Price' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Data Upload</h1>
          <p className="text-muted-foreground">
            Upload data to populate the mental health directory. Create relationships by referencing IDs after creating entities.
          </p>
        </div>

        <Tabs defaultValue="practitioners" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="practitioners" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Practitioners
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Institutions
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="peer-counseling" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Peer Counseling
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Activities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practitioners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practitioners</CardTitle>
                <CardDescription>
                  Manage mental health practitioners in the directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={data.practitioners} 
                  entityType="Practitioner" 
                  columns={practitionerColumns} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Institutions</CardTitle>
                <CardDescription>
                  Manage mental health institutions and clinics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={data.institutions} 
                  entityType="Institution" 
                  columns={institutionColumns} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>
                  Manage mental health organizations and communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={data.organizations} 
                  entityType="Organization" 
                  columns={organizationColumns} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="peer-counseling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Peer Counseling</CardTitle>
                <CardDescription>
                  Manage peer counseling services and support groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={data.peerCounselings} 
                  entityType="Peer Counseling" 
                  columns={peerCounselingColumns} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>
                  Manage stress relief activities and workshops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={data.activities} 
                  entityType="Activity" 
                  columns={activityColumns} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}