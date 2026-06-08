import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Clock, Search, Monitor, Settings, X, User, Heart, MapPin } from "lucide-react";
import { PractitionerCard } from "@/components/PractitionerCard";
import { BureauHeader } from "@/components/BureauHeader";
import { BureauContact } from "@/components/BureauContact";
import { ModeIcon } from "@/components/ModeIcon";
import { useState, useEffect } from "react";
import { useInstitution, usePractitionersByInstitution, useServicesByInstitution, useContactDetailsByInstitution, useLocationsByInstitution } from "@/hooks/useDatabase";
import { useTrackResourceView } from "@/hooks/useTrackResourceView";
import { transformInstitution, transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { Bureau, Practitioner, Service, Mode, ProfessionType, Specialization } from "@/types";
import { getProfessionLabel, getSpecializationLabel } from "@/utils/labels";
import { withCtaFallback } from "@/utils/serviceCtaFallback";
import { BureauLocations } from "@/components/BureauLocations";
import { PhoneCallButton } from "@/components/PhoneCallButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";
import {
  SITE_URL,
  buildPostalAddress,
  buildGeo,
  phoneFromContacts,
  sameAsFromContacts,
  buildOffers,
  buildBreadcrumbList,
} from "@/utils/jsonLd";

const isTelLink = (url: string) => /^tel:/i.test(url);
const stripTel = (url: string) => url.replace(/^tel:/i, "");

const BureauDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [includeNullPrice, setIncludeNullPrice] = useState<boolean>(true);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("2000000");

  // Practitioner filter states
  const [pracSearch, setPracSearch] = useState("");
  const [pracProfessions, setPracProfessions] = useState<ProfessionType[]>([]);
  const [pracSpecializations, setPracSpecializations] = useState<Specialization[]>([]);
  const [pracModes, setPracModes] = useState<Mode[]>([]);
  const [pracCities, setPracCities] = useState<string[]>([]);
  const [pracPriceRange, setPracPriceRange] = useState<[number, number] | null>(null);
  const [pracIncludeNullPrice, setPracIncludeNullPrice] = useState<boolean>(true);
  
  const institutionId = parseInt(id || "0");
  useTrackResourceView("institution", institutionId || null);
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

      // Fill missing Book Now / Learn More from institution contacts (priority order)
      const servicesWithFallback = transformedServices.map((s) =>
        withCtaFallback(s, contactDetails),
      );

      setBureau(transformInstitution(dbInstitution, servicesWithFallback, contactDetails));
      setServices(servicesWithFallback);
      
      // Set price range from actual data (include 0 as a valid price)
      const prices = transformedServices
        .map(s => s.price)
        .filter((p): p is number => p != null);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinPriceInput(minPrice.toString());
        setMaxPriceInput(maxPrice.toString());
      }
    }
  }, [dbInstitution, dbServices, dbContactDetails]);

  useEffect(() => {
    if (dbPractitioners) {
      const transformedPractitioners = dbPractitioners.map((p: any) => {
        const pracServices = (p.practitioner_services || [])
          .map((ps: any) => ps.service)
          .filter(Boolean)
          .map((s: any) => transformService(s));
        const transformed = transformPractitioner(p, pracServices);
        const firstLocation = p.practitioner_locations?.find((pl: any) => pl?.location)?.location;
        if (firstLocation?.city) {
          transformed.city = firstLocation.city;
          transformed.location = {
            address: firstLocation.address || transformed.location.address,
            lat: 0,
            lng: 0,
          };
        }
        return transformed;
      });
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
        <div className="text-center">{t('detail.loading')}</div>
      </div>
    );
  }

  if (institutionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{t('detail.error')}</div>
      </div>
    );
  }

  if (!bureau) {
    return <div className="container mx-auto px-4 py-8">{t('detail.notFound')}</div>;
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
      case "text": return t('sessionModes.textChat');
      case "voice": return t('sessionModes.voiceCall');
      case "video": return t('sessionModes.videoCall');
      case "offline": return t('sessionModes.inPerson');
      default: return mode;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return t('insurance.noInsurance');
      case "private": return t('insurance.privateInsurance');
      case "bpjs": return "BPJS";
      default: return ins;
    }
  };

  // Get unique modes from all services
  const allModes = Array.from(new Set(
    services.flatMap(service => service.modes || [service.mode])
  ));

  // Unique durations (in minutes) from services
  const allDurations = Array.from(new Set(
    services.map(s => s.durationMinutes).filter((d): d is number => typeof d === 'number' && d > 0)
  )).sort((a, b) => a - b);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    return parts.join(' ') || `${mins}m`;
  };

  // Filter services based on selected filters
  const filteredServices = services.filter(service => {
    // Filter by search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!service.name.toLowerCase().includes(searchLower)) return false;
    }
    
    // Filter by mode
    if (selectedModes.length > 0) {
      const serviceModes = service.modes || [service.mode];
      const modeMatch = serviceModes.some(mode => selectedModes.includes(mode));
      if (!modeMatch) return false;
    }

    // Filter by duration
    if (selectedDurations.length > 0) {
      if (!service.durationMinutes || !selectedDurations.includes(service.durationMinutes)) return false;
    }

    // Filter by price range — services with no price respect the include toggle
    if (service.price == null) return includeNullPrice;
    const priceMatch = service.price >= priceRange[0] && service.price <= priceRange[1];
    return priceMatch;
  });

  // Get max price for slider
  const maxPrice = Math.max(
    ...services.map(s => s.price).filter((p): p is number => p != null),
    2000000
  );

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

  const toggleMode = (mode: Mode) => {
    setSelectedModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const removeFilter = (type: 'mode' | 'price' | 'search', value?: Mode) => {
    if (type === 'mode' && value) {
      setSelectedModes(prev => prev.filter(m => m !== value));
    } else if (type === 'price') {
      const prices = services.map(s => s.price).filter((p): p is number => p != null);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinPriceInput(minPrice.toString());
        setMaxPriceInput(maxPrice.toString());
      }
    } else if (type === 'search') {
      setSearchQuery("");
    }
  };

  const clearAllFilters = () => {
    setSelectedModes([]);
    setSelectedDurations([]);
    setSearchQuery("");
    const prices = services.map(s => s.price).filter((p): p is number => p != null);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
      setMinPriceInput(minPrice.toString());
      setMaxPriceInput(maxPrice.toString());
    }
  };

  const validPrices = services.map(s => s.price).filter((p): p is number => p != null);
  const hasActiveFilters = selectedModes.length > 0 || selectedDurations.length > 0 || searchQuery !== "" ||
    (validPrices.length > 0 && (priceRange[0] !== Math.min(...validPrices) ||
    priceRange[1] !== Math.max(...validPrices)));
  const noServicesMessage = `${t('detail.noServicesContactPrefix')} ${t('detail.institutionContactTarget')} ${t('detail.noServicesContactSuffix')}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        pageKey="bureau"
        path={`/bureau/${id}`}
        title={`${bureau.name}${locations[0]?.city ? ' — ' + locations[0].city : ''} | Klinik & Konseling Kesehatan Mental`}
        description={`${bureau.name} — klinik kesehatan mental${locations[0]?.city ? ' di ' + locations[0].city : ''}. Lihat layanan, biaya, asuransi, dan praktisi yang tersedia.`}
        jsonLd={(() => {
          const pageUrl = `${SITE_URL}/bureau/${id}`;
          const primary = locations[0];
          const phone = phoneFromContacts(bureau.contactDetails);
          const sameAs = sameAsFromContacts(bureau.contactDetails);
          const offers = buildOffers(services);
          const type = bureau.bureauType === "independent" ? "LocalBusiness" : "MedicalClinic";
          const businessNode = {
            "@type": type,
            name: bureau.name,
            url: pageUrl,
            ...(bureau.image && { image: bureau.image }),
            ...(phone && { telephone: phone }),
            ...(bureau.priceRange && { priceRange: bureau.priceRange }),
            ...(buildPostalAddress(primary) && { address: buildPostalAddress(primary) }),
            ...(buildGeo(primary) && { geo: buildGeo(primary) }),
            ...(bureau.specializations?.length && { medicalSpecialty: bureau.specializations }),
            ...(sameAs.length && { sameAs }),
            ...(offers && { availableService: offers }),
            ...(bureau.businessHours && bureau.businessHours !== "Not specified" && {
              openingHours: bureau.businessHours,
            }),
          };
          const breadcrumbNode = buildBreadcrumbList([
            { name: t('detail.home'), path: "/" },
            { name: t('nav.professionalCounseling') || "Professional Counseling", path: "/professional-counseling" },
            { name: bureau.name, path: `/bureau/${id}` },
          ]);
          return [businessNode, breadcrumbNode];
        })()}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs and Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('detail.home')}</Link>
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
            {t('detail.back')}
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
            <Card>
                <CardHeader className="space-y-6">
                  <CardTitle>
                    {t('detail.ourServices')}{services.length > 0 ? ` (${filteredServices.length})` : ''}
                  </CardTitle>
                  
                  {/* Filters and Search in one line */}
                  {services.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={t('detail.searchServices')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-full border-gray-200"
                      />
                    </div>
                    
                    {/* Session Mode Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2"
                        >
                          <Monitor className="h-4 w-4" />
                          <span>{t('filters.sessionMode')}</span>
                          {selectedModes.length > 0 && (
                            <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                              {selectedModes.length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionMode')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {allModes.map(mode => (
                              <button
                                key={mode}
                                onClick={() => toggleMode(mode as Mode)}
                                className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                                  selectedModes.includes(mode as Mode)
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

                    {/* Duration Filter */}
                    {allDurations.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            <span>{t('common.duration')}</span>
                            {selectedDurations.length > 0 && (
                              <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {selectedDurations.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">{t('common.duration')}</h3>
                            <div className="flex flex-wrap gap-2">
                              {allDurations.map(d => (
                                <button
                                  key={d}
                                  onClick={() => setSelectedDurations(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                                    selectedDurations.includes(d)
                                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  {formatDuration(d)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Price Range Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>{t('filters.priceRange')}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionCost')}</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.minimum')}</label>
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
                                <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.maximum')}</label>
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
                            <div className="flex items-center space-x-2 pt-2 border-t">
                              <Checkbox
                                id="include-null-price-services"
                                checked={includeNullPrice}
                                onCheckedChange={(checked) => setIncludeNullPrice(checked === true)}
                              />
                              <label htmlFor="include-null-price-services" className="text-sm text-foreground cursor-pointer">
                                {t('detail.includePriceUponRequest')}
                              </label>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  )}

                  {/* Active Filters */}
                  {services.length > 0 && hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('detail.activeFiltersLabel')}</span>
                      {selectedModes.map(mode => (
                        <Badge 
                          key={mode}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {getModeLabel(mode)}
                          <button
                            onClick={() => removeFilter('mode', mode)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </button>
                        </Badge>
                      ))}
                      {searchQuery && (
                        <Badge 
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          Search: {searchQuery}
                          <button
                            onClick={() => removeFilter('search')}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </button>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-6 text-xs"
                      >
                        {t('filters.clearAll')}
                      </Button>
                    </div>
                  )}
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
                                  <span>{service.duration === '__DURATION_NOT_SPECIFIED__' ? t('common.durationNotSpecified') : service.duration}</span>
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
              <p className={`mt-2 ${service.price == null ? 'text-sm text-muted-foreground italic' : 'text-lg font-medium text-primary'}`}>
                {service.price == null
                  ? t('detail.priceUponRequest')
                  : service.price === 0
                    ? t('detail.free')
                    : formatPrice(service.price)}
              </p>
                            </div>
                            <div className="flex gap-2">
                              {service.bookingUrl && (
                                isTelLink(service.bookingUrl) ? (
                                  <PhoneCallButton phone={stripTel(service.bookingUrl)} size="sm">
                                    {t('detail.bookNow')}
                                  </PhoneCallButton>
                                ) : (
                                  <Button size="sm" asChild>
                                    <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer">
                                      {t('detail.bookNow')}
                                    </a>
                                  </Button>
                                )
                              )}
                              {service.learnMoreUrl && (
                                isTelLink(service.learnMoreUrl) ? (
                                  <PhoneCallButton phone={stripTel(service.learnMoreUrl)} variant="outline" size="sm">
                                    {t('detail.learnMore')}
                                  </PhoneCallButton>
                                ) : (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={service.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                                      {t('detail.learnMore')}
                                    </a>
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {filteredServices.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        {services.length > 0 ? t('detail.noServicesMatch') : noServicesMessage}
                      </div>
                    )}
                  </div>
                </CardContent>
            </Card>

            {/* Practitioners Section */}
            {practitioners.length > 0 && (
              (() => {
                const allPracProfessions = Array.from(new Set(practitioners.flatMap(p => p.professionTypes))) as ProfessionType[];
                const allPracSpecs = Array.from(new Set(practitioners.flatMap(p => p.specializations))) as Specialization[];
                const allPracModes = Array.from(new Set(practitioners.flatMap(p => p.modes))) as Mode[];
                const allPracCities = Array.from(new Set(
                  practitioners.map(p => p.city).filter(c => c && c !== "Unknown City")
                )) as string[];
                const allPracPrices = practitioners
                  .flatMap(p => p.services.map(s => s.price))
                  .filter((p): p is number => p != null);
                const pracMaxPrice = allPracPrices.length ? Math.max(...allPracPrices) : 0;
                const pracMinPrice = allPracPrices.length ? Math.min(...allPracPrices) : 0;
                const effectivePriceRange = pracPriceRange ?? [pracMinPrice, pracMaxPrice];

                const filteredPractitioners = practitioners.filter(p => {
                  if (pracSearch && !p.name.toLowerCase().includes(pracSearch.toLowerCase())) return false;
                  if (pracProfessions.length && !p.professionTypes.some(pt => pracProfessions.includes(pt))) return false;
                  if (pracSpecializations.length && !p.specializations.some(s => pracSpecializations.includes(s))) return false;
                  if (pracModes.length && !p.modes.some(m => pracModes.includes(m))) return false;
                  if (pracCities.length && !pracCities.includes(p.city)) return false;
                  if (pracPriceRange && allPracPrices.length) {
                    const prices = p.services.map(s => s.price).filter((x): x is number => x != null);
                    if (prices.length === 0) {
                      if (!pracIncludeNullPrice) return false;
                    } else {
                      const inRange = prices.some(pr => pr >= pracPriceRange[0] && pr <= pracPriceRange[1]);
                      if (!inRange) return false;
                    }
                  }
                  return true;
                });

                const toggle = <T,>(arr: T[], set: (v: T[]) => void, value: T) => {
                  set(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
                };

                const hasPracFilters = pracSearch !== "" || pracProfessions.length > 0 || pracSpecializations.length > 0 || pracModes.length > 0 || pracCities.length > 0 || pracPriceRange !== null;

                const PillButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
                  <button
                    onClick={onClick}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                      active ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {children}
                  </button>
                );

                const filterBtnClass = "bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium justify-center flex items-center gap-2";

                return (
                <Card>
                  <CardHeader className="space-y-6">
                    <CardTitle>{t('detail.ourPractitioners')} ({filteredPractitioners.length})</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Search by name"
                          value={pracSearch}
                          onChange={(e) => setPracSearch(e.target.value)}
                          className="pl-10 rounded-full border-gray-200"
                        />
                      </div>

                      {allPracProfessions.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={filterBtnClass}>
                              <User className="h-4 w-4" />
                              <span>{t('filters.profession')}</span>
                              {pracProfessions.length > 0 && <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{pracProfessions.length}</Badge>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-6">
                            <div className="flex flex-wrap gap-2">
                              {allPracProfessions.map(pt => (
                                <PillButton key={pt} active={pracProfessions.includes(pt)} onClick={() => toggle(pracProfessions, setPracProfessions, pt)}>
                                  {getProfessionLabel(t, pt)}
                                </PillButton>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {allPracSpecs.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={filterBtnClass}>
                              <Heart className="h-4 w-4" />
                              <span>{t('filters.specialization')}</span>
                              {pracSpecializations.length > 0 && <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{pracSpecializations.length}</Badge>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-6">
                            <div className="flex flex-wrap gap-2">
                              {allPracSpecs.map(sp => (
                                <PillButton key={sp} active={pracSpecializations.includes(sp)} onClick={() => toggle(pracSpecializations, setPracSpecializations, sp)}>
                                  {getSpecializationLabel(t, sp)}
                                </PillButton>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {allPracModes.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={filterBtnClass}>
                              <Monitor className="h-4 w-4" />
                              <span>{t('filters.sessionMode')}</span>
                              {pracModes.length > 0 && <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{pracModes.length}</Badge>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-6">
                            <div className="flex flex-wrap gap-2">
                              {allPracModes.map(m => (
                                <PillButton key={m} active={pracModes.includes(m)} onClick={() => toggle(pracModes, setPracModes, m)}>
                                  {getModeLabel(m)}
                                </PillButton>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {allPracCities.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={filterBtnClass}>
                              <MapPin className="h-4 w-4" />
                              <span>{t('filters.city')}</span>
                              {pracCities.length > 0 && <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{pracCities.length}</Badge>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-6">
                            <div className="flex flex-wrap gap-2">
                              {allPracCities.map(c => (
                                <PillButton key={c} active={pracCities.includes(c)} onClick={() => toggle(pracCities, setPracCities, c)}>
                                  {c}
                                </PillButton>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {allPracPrices.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={filterBtnClass}>
                              <Settings className="h-4 w-4" />
                              <span>{t('filters.priceRange')}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-6">
                            <div className="space-y-4">
                              <Slider
                                value={effectivePriceRange}
                                min={pracMinPrice}
                                max={pracMaxPrice}
                                step={25000}
                                onValueChange={(v) => setPracPriceRange(v as [number, number])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Rp {effectivePriceRange[0].toLocaleString()}</span>
                                <span>Rp {effectivePriceRange[1].toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-2 pt-2 border-t">
                                <Checkbox
                                  id="include-null-price-practitioners"
                                  checked={pracIncludeNullPrice}
                                  onCheckedChange={(checked) => setPracIncludeNullPrice(checked === true)}
                                />
                                <label htmlFor="include-null-price-practitioners" className="text-sm text-foreground cursor-pointer">
                                  {t('detail.includePriceUponRequest')}
                                </label>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {hasPracFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPracSearch("");
                            setPracProfessions([]);
                            setPracSpecializations([]);
                            setPracModes([]);
                            setPracCities([]);
                            setPracPriceRange(null);
                          }}
                          className="text-xs"
                        >
                          {t('filters.clearAll')}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredPractitioners.length > 0 ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredPractitioners.map((practitioner) => (
                          <PractitionerCard key={practitioner.id} practitioner={practitioner} hideInstitutionName hideInsurance />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('common.noResults')}
                      </div>
                    )}
                  </CardContent>
              </Card>
                );
              })()
            )}
          </div>

          {/* Contact Details and Locations Sidebar */}
          <div className="space-y-6">
            <BureauContact bureau={bureau} />
            <BureauLocations locations={locations} bureauName={bureau.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BureauDetail;
