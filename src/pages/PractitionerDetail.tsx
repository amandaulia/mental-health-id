
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PractitionerHeader } from "@/components/PractitionerHeader";
import { PractitionerServices } from "@/components/PractitionerServices";
import { PractitionerContact } from "@/components/PractitionerContact";
import { usePractitioner, useServicesByPractitioner, useContactDetailsByPractitioner } from "@/hooks/useDatabase";
import { transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { useEffect, useState } from "react";
import { Practitioner } from "@/types";

const PractitionerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  
  const practitionerId = parseInt(id || "0");
  const { data: dbPractitioner, isLoading: practitionerLoading, error: practitionerError } = usePractitioner(practitionerId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByPractitioner(practitionerId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByPractitioner(practitionerId);

  useEffect(() => {
    if (dbPractitioner && dbServices && dbContactDetails) {
      const transformedServices = dbServices.map(transformService);
      const transformedContactDetails = transformContactDetails(dbContactDetails);
      
      setPractitioner(transformPractitioner(dbPractitioner, transformedServices, transformedContactDetails));
    }
  }, [dbPractitioner, dbServices, dbContactDetails]);

  if (practitionerLoading || servicesLoading || contactLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading practitioner details...</div>
      </div>
    );
  }

  if (practitionerError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error loading practitioner details</div>
      </div>
    );
  }

  if (!practitioner) {
    return <div className="container mx-auto px-4 py-8">Practitioner not found</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "text": return "Text Session";
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "Offline Session";
      default: return mode;
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

  const handleBureauClick = () => {
    navigate(`/bureau/${practitioner.bureauId}`);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6">
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
                <BreadcrumbPage>Practitioner Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <PractitionerHeader
          practitioner={practitioner}
          onTagClick={handleTagClick}
          onBureauClick={handleBureauClick}
          getModeLabel={getModeLabel}
          getInsuranceLabel={getInsuranceLabel}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PractitionerServices
              practitioner={practitioner}
              formatPrice={formatPrice}
              getModeLabel={getModeLabel}
            />
          </div>

          <PractitionerContact practitioner={practitioner} />
        </div>
      </div>
    </div>
  );
};

export default PractitionerDetail;
