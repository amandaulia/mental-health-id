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
import { useInstitution, usePractitionersByInstitution, useServicesByInstitution, useContactDetailsByInstitution, useLocationsByInstitution } from "@/hooks/useDatabase";
import { transformInstitution, transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { Bureau, Practitioner, Service } from "@/types";
import { BureauLocations } from "@/components/BureauLocations";
import { supabase } from "@/integrations/supabase/client";

const BureauDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  
  const institutionId = parseInt(id || "0");
  const { data: dbInstitution, isLoading: institutionLoading, error: institutionError } = useInstitution(institutionId);
  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitionersByInstitution(institutionId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByInstitution(institutionId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByInstitution(institutionId);
  const { data: dbLocations, isLoading: locationsLoading } = useLocationsByInstitution(institutionId);

  useEffect(() => {
    const fetchServiceCTAs = async () => {
      if (dbInstitution && dbServices) {
        // Extract all unique CTA IDs from services
        const ctaIds = new Set<number>();
        dbServices.forEach((item: any) => {
          if (item.service?.book_cta) ctaIds.add(item.service.book_cta);
          if (item.service?.learn_more_cta) ctaIds.add(item.service.learn_more_cta);
        });

        console.log('CTA IDs to fetch:', Array.from(ctaIds));

        // Fetch contact details for these CTA IDs
        const { data: ctaContacts, error } = await supabase
          .from('contact_details')
          .select('*')
          .in('id', Array.from(ctaIds));
        
        if (error) {
          console.error('Error fetching CTA contacts:', error);
          return;
        }

        console.log('Fetched CTA contacts:', ctaContacts);
        
        // Create a map of contact detail IDs to links
        const contactLinkMap = new Map();
        ctaContacts?.forEach((contact: any) => {
          contactLinkMap.set(contact.id, contact.link);
        });
        
        console.log('Contact link map:', Object.fromEntries(contactLinkMap));
        
        const transformedServices = dbServices.map((item: any) => {
          const service = transformService(item.service);
          
          console.log('Processing service:', service.name, {
            bookingUrlId: service.bookingUrl,
            learnMoreUrlId: service.learnMoreUrl
          });
          
          // Map CTA IDs to actual contact detail links
          if (service.bookingUrl && contactLinkMap.has(parseInt(service.bookingUrl))) {
            service.bookingUrl = contactLinkMap.get(parseInt(service.bookingUrl));
            console.log('  -> Set booking URL to:', service.bookingUrl);
          } else {
            service.bookingUrl = undefined;
          }
          
          if (service.learnMoreUrl && contactLinkMap.has(parseInt(service.learnMoreUrl))) {
            service.learnMoreUrl = contactLinkMap.get(parseInt(service.learnMoreUrl));
            console.log('  -> Set learn more URL to:', service.learnMoreUrl);
          } else {
            service.learnMoreUrl = undefined;
          }
          
          return service;
        });
        
        console.log('Final transformed services:', transformedServices.map(s => ({
          name: s.name,
          bookingUrl: s.bookingUrl,
          learnMoreUrl: s.learnMoreUrl
        })));
        
        // Also get institution contact details for the sidebar
        const contactDetails = dbContactDetails ? transformContactDetails(dbContactDetails) : {
          whatsapp: undefined,
          website: undefined,
          instagram: undefined
        };
        
        setBureau(transformInstitution(dbInstitution, transformedServices, contactDetails));
        setServices(transformedServices);
      }
    };

    fetchServiceCTAs();
  }, [dbInstitution, dbServices, dbContactDetails]);

  useEffect(() => {
    if (dbPractitioners) {
      const transformedPractitioners = dbPractitioners.map(p => transformPractitioner(p));
      setPractitioners(transformedPractitioners);
    }
  }, [dbPractitioners]);

  useEffect(() => {
    if (dbLocations) {
      console.log('Raw dbLocations:', dbLocations);
      const validLocations = (dbLocations as any[]).filter((loc: any) => {
        const isValid = loc && typeof loc === 'object' && loc.id && !loc.error;
        console.log('Location validation:', loc, 'isValid:', isValid);
        return isValid;
      });
      console.log('Valid locations after filter:', validLocations);
      const transformedLocations = validLocations.map((loc: any) => ({
        id: loc.id.toString(),
        name: loc.name || "Unnamed Location",
        address: loc.address || "Address not available",
        city: loc.city || "Unknown City",
        province: loc.province || "Unknown Province",
        country: loc.country || "Unknown Country"
      }));
      console.log('Transformed locations:', transformedLocations);
      setLocations(transformedLocations);
    } else {
      console.log('dbLocations is null/undefined');
    }
  }, [dbLocations]);

  if (institutionLoading || practitionersLoading || servicesLoading || contactLoading || locationsLoading) {
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
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{service.duration}</span>
                                </div>
                                {service.modes && service.modes.length > 0 ? (
                                  <div className="flex items-center gap-2">
                                    {service.modes.map((mode, idx) => (
                                      <div key={idx} className="flex items-center gap-1">
                                        <ModeIcon mode={mode} />
                                        <span>{getModeLabel(mode)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <ModeIcon mode={service.mode} />
                                    <span>{getModeLabel(service.mode)}</span>
                                  </div>
                                )}
                              </div>
                              <p className={`mt-2 ${service.price == null ? 'text-sm text-muted-foreground italic' : service.price === 0 ? 'text-lg font-medium text-primary' : 'text-lg font-medium text-primary'}`}>
                                {service.price == null 
                                  ? 'Price available upon consultation' 
                                  : service.price === 0 
                                  ? 'Free' 
                                  : formatPrice(service.price)}
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

          {/* Contact Details and Locations Sidebar */}
          <div className="space-y-6">
            <BureauContact bureau={bureau} />
            <BureauLocations locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BureauDetail;
