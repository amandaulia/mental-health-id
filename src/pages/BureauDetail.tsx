
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Clock } from "lucide-react";
import { PractitionerCard } from "@/components/PractitionerCard";
import { BureauHeader } from "@/components/BureauHeader";
import { BureauContact } from "@/components/BureauContact";
import { ModeIcon } from "@/components/ModeIcon";
import { useState, useEffect } from "react";
import { useInstitution, usePractitionersByInstitution, useServicesByInstitution, useContactDetailsByInstitution } from "@/hooks/useDatabase";
import { transformInstitution, transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { Bureau, Practitioner, Service } from "@/types";

const BureauDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const institutionId = parseInt(id || "0");
  const { data: dbInstitution, isLoading: institutionLoading, error: institutionError } = useInstitution(institutionId);
  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitionersByInstitution(institutionId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByInstitution(institutionId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByInstitution(institutionId);

  useEffect(() => {
    if (dbInstitution && dbServices && dbContactDetails) {
      const transformedServices = dbServices.map(transformService);
      const contactDetails = transformContactDetails(dbContactDetails);
      setBureau(transformInstitution(dbInstitution, transformedServices, contactDetails));
      setServices(transformedServices);
    }
  }, [dbInstitution, dbServices, dbContactDetails]);

  useEffect(() => {
    if (dbPractitioners) {
      const transformedPractitioners = dbPractitioners.map(p => transformPractitioner(p));
      setPractitioners(transformedPractitioners);
    }
  }, [dbPractitioners]);

  if (institutionLoading || practitionersLoading || servicesLoading || contactLoading) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "text": return "Chat";
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "Offline";
      default: return mode;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
      default: return ins;
    }
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

        {/* Institution Header */}
        <BureauHeader 
          bureau={bureau}
          getModeLabel={getModeLabel}
          getInsuranceLabel={getInsuranceLabel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            {services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Services ({services.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              {service.institutionName && (
                                <p className="text-sm text-muted-foreground">{service.institutionName}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{service.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ModeIcon mode={service.mode} />
                                  <span>{getModeLabel(service.mode)}</span>
                                </div>
                              </div>
                              <p className="font-medium text-primary text-lg mt-2">
                                {formatPrice(service.price)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {service.bookingUrl && (
                                <Button size="sm" asChild>
                                  <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer">
                                    Book Now
                                  </a>
                                </Button>
                              )}
                              {service.learnMoreUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={service.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                                    Learn More
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Practitioners Section */}
            {practitioners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Practitioners ({practitioners.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {practitioners.map((practitioner) => (
                      <PractitionerCard key={practitioner.id} practitioner={practitioner} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Details Sidebar */}
          <div className="space-y-8">
            <BureauContact bureau={bureau} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BureauDetail;
