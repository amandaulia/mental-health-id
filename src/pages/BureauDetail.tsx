import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Clock, Search, Monitor, Settings } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<Mode | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("2000000");
  
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
    const labels: Record<string, string> = {
      text: "Text Chat",
      voice: "Voice Call",
      video: "Video Call",
      offline: "In-Person"
    };
    return labels[mode] || mode;
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
    // Filter by search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!service.name.toLowerCase().includes(searchLower)) return false;
    }
    
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

  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value);
    const numValue = parseInt(value) || 0;
    const newMin = Math.max(0, Math.min(numValue, priceRange[1]));
    setPriceRange([newMin, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseInt(value) || maxPrice;
    const newMax = Math.max(priceRange[0], Math.min(numValue, maxPrice));
    setPriceRange([priceRange[0], newMax]);
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
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full border-gray-200"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Session Mode Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2"
                          >
                            <Monitor className="h-4 w-4" />
                            <span>Session Mode</span>
                            {selectedMode !== "all" && (
                              <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                1
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Session Mode</h3>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setSelectedMode("all")}
                                className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                                  selectedMode === "all"
                                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                All Modes
                              </button>
                              {allModes.map(mode => (
                                <button
                                  key={mode}
                                  onClick={() => setSelectedMode(mode as Mode)}
                                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                                    selectedMode === mode
                                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  {getModeLabel(mode)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Price Range Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Price Range</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Session Cost (IDR)</h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                                  <Input
                                    type="number"
                                    value={minPriceInput}
                                    onChange={(e) => handleMinPriceChange(e.target.value)}
                                    className="text-sm"
                                    min={0}
                                    max={maxPrice}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                                  <Input
                                    type="number"
                                    value={maxPriceInput}
                                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                                    className="text-sm"
                                    min={0}
                                    max={maxPrice}
                                  />
                                </div>
                              </div>
                              
                              <Slider
                                value={priceRange}
                                max={maxPrice}
                                step={25000}
                                onValueChange={(value) => {
                                  setPriceRange(value as [number, number]);
                                  setMinPriceInput(value[0].toString());
                                  setMaxPriceInput(value[1].toString());
                                }}
                                className="mb-2"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Rp {priceRange[0].toLocaleString()}</span>
                                <span>Rp {priceRange[1].toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
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
