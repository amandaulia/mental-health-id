
import { useParams } from "react-router-dom";
import { mockBureaus } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2 } from "lucide-react";

const BureauDetail = () => {
  const { id } = useParams();
  const bureau = mockBureaus.find(b => b.id === id);

  if (!bureau) {
    return <div className="container mx-auto px-4 py-8">Bureau not found</div>;
  }

  const getBureauTypeLabel = (type: string) => {
    switch (type) {
      case "independent": return "Independent Bureau";
      case "clinic": return "Clinic";
      case "faskes1": return "Faskes 1";
      case "faskes2": return "Faskes 2";
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{bureau.name}</h1>
                {bureau.isVerified && (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{getBureauTypeLabel(bureau.bureauType)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-muted-foreground">{bureau.businessHours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{bureau.location.address}</p>
                      <p className="text-sm text-muted-foreground">{bureau.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance & Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance & Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Insurance Accepted</h4>
              <div className="flex flex-wrap gap-2">
                {bureau.insurance.map((ins) => (
                  <Badge key={ins} variant="outline">{getInsuranceLabel(ins)}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(bureau.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Map Preview Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Map preview coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BureauDetail;
