import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Filter } from "lucide-react";
import { PractitionerCard } from "@/components/PractitionerCard";
import { BureauHeader } from "@/components/BureauHeader";
import { BureauContact } from "@/components/BureauContact";
import { ModeIcon } from "@/components/ModeIcon";
import { useState, useEffect } from "react";
import { useInstitution, usePractitionersByInstitution, useServicesByInstitution, useContactDetailsByInstitution, useLocationsByInstitution } from "@/hooks/useDatabase";
import { transformInstitution, transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { Bureau, Practitioner, Service, Mode } from "@/types";
import { BureauLocations } from "@/components/BureauLocations";

const BureauDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  
  // Filter states
  const [selectedMode, setSelectedMode] = useState<Mode | "all">("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  
  const institutionId = parseInt(id || "0");
  const { data: dbInstitution, isLoading: institutionLoading, error: institutionError } = useInstitution(institutionId);
  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitionersByInstitution(institutionId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByInstitution(institutionId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByInstitution(institutionId);
  const { data: dbLocations, isLoading: locationsLoading } = useLocationsByInstitution(institutionId);

  useEffect(() => {
    if (dbInstitution && dbServices) {
      console.log('dbServices in BureauDetail:', dbServices);
      
      const transformedServices = dbServices.map((item: any) => {
        const service = transformService(item.service);
        
        console.log('Processing service:', item.service?.name, {
          book_contact: item.service?.book_contact,
          learn_more_contact: item.service?.learn_more_contact
        });
        
        // Use the joined contact details for CTAs
        if (item.service?.book_contact?.link) {
          service.bookingUrl = item.service.book_contact.link;
          console.log(`Set bookingUrl for "${service.name}":`, service.bookingUrl);
        }
        
        if (item.service?.learn_more_contact?.link) {
          service.learnMoreUrl = item.service.learn_more_contact.link;
          console.log(`Set learnMoreUrl for "${service.name}":`, service.learnMoreUrl);
        }
        
        return service;
      });
      
      // Get institution contact details for the sidebar
      const contactDetails = dbContactDetails ? transformContactDetails(dbContactDetails) : [];
      
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

  // Get unique modes from all services
  const allModes = Array.from(new Set(
    services.flatMap(service => service.modes || [service.mode])
  ));

  // Filter services based on selected filters
  const filteredServices = services.filter(service => {
    // Filter by mode
    const serviceModes = service.modes || [service.mode];
    const modeMatch = selectedMode === "all" || serviceModes.includes(selectedMode);
    
    // Filter by price range
    const servicePrice = service.price ?? 0;
    const priceMatch = servicePrice >= priceRange[0] && servicePrice <= priceRange[1];
    
    return modeMatch && priceMatch;
  });

  // Get max price for slider
  const maxPrice = Math.max(...services.map(s => s.price ?? 0), 2000000);

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
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/professional-counseling')} 
            className="flex items-center gap-2"
          >
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
                <CardHeader className="space-y-6">
                  <CardTitle>Our Services ({filteredServices.length})</CardTitle>
                  
                  {/* Filters */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm font-medium">Filter by:</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Session Mode</label>
                        <Select 
                          value={selectedMode} 
                          onValueChange={(value) => setSelectedMode(value as Mode | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Modes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Modes</SelectItem>
                            {allModes.map(mode => (
                              <SelectItem key={mode} value={mode}>
                                {getModeLabel(mode)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={priceRange[0]}
                              onChange={(e) => {
                                const value = Math.max(0, Math.min(Number(e.target.value), priceRange[1]));
                                setPriceRange([value, priceRange[1]]);
                              }}
                              className="w-full"
                            />
                          </div>
                          <span className="text-muted-foreground">-</span>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Max"
                              value={priceRange[1]}
                              onChange={(e) => {
                                const value = Math.max(priceRange[0], Number(e.target.value));
                                setPriceRange([priceRange[0], value]);
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredServices.map((service, index) => (
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
                    {filteredServices.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No services match the selected filters.
                      </div>
                    )}
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
