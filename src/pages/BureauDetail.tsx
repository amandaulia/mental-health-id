
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MapPin, Clock, Building2, ArrowLeft, ExternalLink } from "lucide-react";
import { PractitionerCard } from "@/components/PractitionerCard";
import { useState, useEffect } from "react";
import { useInstitution, usePractitionersByInstitution } from "@/hooks/useDatabase";
import { transformInstitution, transformPractitioner } from "@/utils/dataTransform";
import { Bureau, Practitioner } from "@/types";

const BureauDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  
  const institutionId = parseInt(id || "0");
  const { data: dbInstitution, isLoading: institutionLoading, error: institutionError } = useInstitution(institutionId);
  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitionersByInstitution(institutionId);

  useEffect(() => {
    if (dbInstitution) {
      setBureau(transformInstitution(dbInstitution));
    }
  }, [dbInstitution]);

  useEffect(() => {
    if (dbPractitioners) {
      setPractitioners(dbPractitioners.map(transformPractitioner));
    }
  }, [dbPractitioners]);

  if (institutionLoading || practitionersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading bureau details...</div>
      </div>
    );
  }

  if (institutionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error loading bureau details</div>
      </div>
    );
  }

  if (!bureau) {
    return <div className="container mx-auto px-4 py-8">Bureau not found</div>;
  }

  const getBureauTypeLabel = (type: string) => {
    switch (type) {
      case "independent": return "Independent Bureau";
      case "clinic": return "Clinic";
      case "faskes1": return "Faskes 1";
      case "faskes2": return "Faskes 2";
      default: return type;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return "No Insurance";
      case "PRIVATE": return "Private Insurance";
      case "BPJS": return "BPJS";
      default: return ins;
    }
  };

  const handleTagClick = (type: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleMapClick = () => {
    const encodedAddress = encodeURIComponent(bureau.location.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs and Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{bureau.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold">{bureau.name}</h1>
                    {bureau.isVerified && (
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Type</p>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleTagClick('types', bureau.bureauType)}
                      >
                        {getBureauTypeLabel(bureau.bureauType)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Profession Types</p>
                    <div className="flex flex-wrap gap-2">
                      {bureau.professionTypes.map((type) => (
                        <Badge 
                          key={type} 
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleTagClick('professionTypes', type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Insurance Accepted</p>
                    <div className="flex flex-wrap gap-2">
                      {bureau.insurance.map((ins) => (
                        <Badge 
                          key={ins} 
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleTagClick('insurance', ins)}
                        >
                          {getInsuranceLabel(ins)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(bureau.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">{bureau.businessHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">Location</p>
                </div>
                <p className="text-muted-foreground">{bureau.location.address}</p>
                <p className="text-sm text-muted-foreground">{bureau.city}</p>
                
                <div className={`bg-muted rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isMapExpanded ? 'h-96' : 'h-32'
                }`}>
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">Interactive Map</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setIsMapExpanded(!isMapExpanded)}
                      >
                        {isMapExpanded ? 'Collapse' : 'Expand'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleMapClick}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practitioners Section */}
        {practitioners.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Our Practitioners ({practitioners.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {practitioners.map((practitioner) => (
                  <PractitionerCard key={practitioner.id} practitioner={practitioner} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BureauDetail;
