import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Search, Monitor, Clock, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PractitionerHeader } from "@/components/PractitionerHeader";
import { PractitionerServices } from "@/components/PractitionerServices";
import { PractitionerContact } from "@/components/PractitionerContact";
import { PractitionerLocations } from "@/components/PractitionerLocations";
import { usePractitioner, useServicesByPractitioner, useContactDetailsByPractitioner, useLocationsByPractitioner, useContactDetailsByInstitution } from "@/hooks/useDatabase";
import { transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { useEffect, useMemo, useState } from "react";
import { Practitioner, Mode } from "@/types";
import { trackError } from "@/utils/analytics";
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

const PractitionerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [contactFromInstitution, setContactFromInstitution] = useState(false);

  // Service filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [includeNullPrice, setIncludeNullPrice] = useState<boolean>(true);
  
  const practitionerId = parseInt(id || "0");
  const { data: dbPractitioner, isLoading: practitionerLoading, error: practitionerError } = usePractitioner(practitionerId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByPractitioner(practitionerId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByPractitioner(practitionerId);
  const { data: dbLocations, isLoading: locationsLoading } = useLocationsByPractitioner(practitionerId);

  // Derive institution ID for contact fallback
  const institutionId = useMemo<number>(() => {
    const inst = (dbPractitioner as any)?.practitioner_institutions?.[0]?.institution;
    return inst?.id ? Number(inst.id) : 0;
  }, [dbPractitioner]);
  const practitionerContactsEmpty = !dbContactDetails || (dbContactDetails as any[]).length === 0;
  const shouldFetchInstitutionContacts = !contactLoading && practitionerContactsEmpty && institutionId > 0;
  const { data: dbInstitutionContacts } = useContactDetailsByInstitution(
    shouldFetchInstitutionContacts ? institutionId : 0
  );

  useEffect(() => {
    if (dbPractitioner && dbServices && dbContactDetails) {
      const transformedServices = dbServices.map(transformService);
      let transformedContactDetails = transformContactDetails(dbContactDetails);
      let usingInstitutionContacts = false;
      if (transformedContactDetails.length === 0 && dbInstitutionContacts && (dbInstitutionContacts as any[]).length > 0) {
        transformedContactDetails = transformContactDetails(dbInstitutionContacts as any[]);
        usingInstitutionContacts = true;
      }
      setContactFromInstitution(usingInstitutionContacts);
      setPractitioner(transformPractitioner(dbPractitioner, transformedServices, transformedContactDetails));
    }
  }, [dbPractitioner, dbServices, dbContactDetails, dbInstitutionContacts]);

  useEffect(() => {
    if (dbLocations) {
      const validLocations = (dbLocations as any[]).filter((loc: any) => 
        loc && typeof loc === 'object' && loc.id && loc.name && !loc.error
      );
      const transformedLocations = validLocations.map((loc: any) => ({
        id: loc.id.toString(),
        name: loc.name || "Unnamed Location", 
        address: loc.address || "Address not available",
        city: loc.city || "Unknown City",
        province: loc.province || "Unknown Province",
        country: loc.country || "Unknown Country"
      }));
      setLocations(transformedLocations);
    }
  }, [dbLocations]);

  useEffect(() => {
    if (practitionerError) {
      trackError(
        'Data Loading Error',
        'Failed to load practitioner details',
        `Practitioner ID: ${practitionerId}`
      );
    }
  }, [practitionerError, practitionerId]);

  if (practitionerLoading || servicesLoading || contactLoading || locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('detail.loading')}</div>
      </div>
    );
  }

  if (practitionerError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {t('detail.error')}
        </div>
      </div>
    );
  }

  if (!practitioner) {
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
      case "offline": return t('sessionModes.offlineSession');
      default: return mode;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return t('insurance.noInsurance');
      case "PRIVATE": return t('insurance.privateInsurance');
      case "BPJS": return "BPJS";
      default: return ins;
    }
  };

  // Build filter facets from services
  const services = practitioner.services;
  const allModes = Array.from(new Set(services.flatMap(s => s.modes || [s.mode]))) as Mode[];
  const allDurations = Array.from(new Set(
    services.map(s => s.durationMinutes).filter((d): d is number => typeof d === 'number' && d > 0)
  )).sort((a, b) => a - b);
  const validPrices = services.map(s => s.price).filter((p): p is number => p != null);
  const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
  const maxPrice = validPrices.length ? Math.max(...validPrices) : 2000000;
  const effectivePriceRange: [number, number] = priceRange ?? [minPrice, maxPrice];

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    return parts.join(' ') || `${mins}m`;
  };

  const filteredServices = services.filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedModes.length > 0) {
      const sModes = s.modes || [s.mode];
      if (!sModes.some(m => selectedModes.includes(m))) return false;
    }
    if (selectedDurations.length > 0) {
      if (!s.durationMinutes || !selectedDurations.includes(s.durationMinutes)) return false;
    }
    if (s.price == null) return includeNullPrice;
    return s.price >= effectivePriceRange[0] && s.price <= effectivePriceRange[1];
  });

  const toggleMode = (mode: Mode) =>
    setSelectedModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  const toggleDuration = (d: number) =>
    setSelectedDurations(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const hasActiveFilters =
    selectedModes.length > 0 ||
    selectedDurations.length > 0 ||
    searchQuery !== "" ||
    (validPrices.length > 0 && (effectivePriceRange[0] !== minPrice || effectivePriceRange[1] !== maxPrice));

  const clearAllFilters = () => {
    setSelectedModes([]);
    setSelectedDurations([]);
    setSearchQuery("");
    setPriceRange(null);
    setIncludeNullPrice(true);
  };

  const filteredPractitioner: Practitioner = { ...practitioner, services: filteredServices };

  const handleTagClick = (type: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleBureauClick = () => {
    navigate(`/bureau/${practitioner.bureauId}`);
  };

  const pageUrl = `${SITE_URL}/practitioner/${practitionerId}`;
  const primaryLocation = locations[0];
  const personNode: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${pageUrl}#person`,
    name: practitioner.name,
    url: pageUrl,
    ...(practitioner.image && { image: practitioner.image }),
    ...(practitioner.professionTypes?.[0] && { jobTitle: practitioner.professionTypes[0] }),
    ...(practitioner.specializations?.length && { knowsAbout: practitioner.specializations }),
    ...(practitioner.education && { alumniOf: practitioner.education }),
    ...(practitioner.bureauName &&
      practitioner.bureauName !== "Independent" && {
        worksFor: {
          "@type": "Organization",
          name: practitioner.bureauName,
          ...(practitioner.bureauId && { url: `${SITE_URL}/bureau/${practitioner.bureauId}` }),
        },
      }),
  };
  const phone = phoneFromContacts(practitioner.contactDetails);
  const sameAs = sameAsFromContacts(practitioner.contactDetails);
  const offers = buildOffers(practitioner.services);
  const businessNode: Record<string, unknown> = {
    "@type": "MedicalBusiness",
    "@id": `${pageUrl}#business`,
    name: practitioner.name,
    url: pageUrl,
    ...(practitioner.image && { image: practitioner.image }),
    ...(phone && { telephone: phone }),
    ...(practitioner.priceRange && { priceRange: practitioner.priceRange }),
    ...(buildPostalAddress(primaryLocation) && { address: buildPostalAddress(primaryLocation) }),
    ...(buildGeo(primaryLocation) && { geo: buildGeo(primaryLocation) }),
    ...(sameAs.length && { sameAs }),
    ...(offers && { availableService: offers }),
    provider: { "@id": `${pageUrl}#person` },
  };
  const breadcrumbNode = buildBreadcrumbList([
    { name: t('detail.home'), path: "/" },
    { name: t('nav.professionalCounseling') || "Professional Counseling", path: "/professional-counseling" },
    { name: practitioner.name, path: `/practitioner/${practitionerId}` },
  ]);
  const jsonLd = [personNode, businessNode, breadcrumbNode];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <PageSEO
        pageKey="practitioner"
        path={`/practitioner/${practitionerId}`}
        title={`${practitioner.name} — ${practitioner.professionTypes?.[0] || t('detail.practitionerDetails')}${locations[0]?.city ? ' di ' + locations[0].city : ''} | Direktori Kesehatan Mental Indonesia`}
        description={`Profil ${practitioner.name}${practitioner.professionTypes?.[0] ? ', ' + practitioner.professionTypes[0] : ''}${locations[0]?.city ? ' di ' + locations[0].city : ''}. Lihat layanan, biaya, asuransi, dan kontak konseling.`}
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto space-y-6">
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
                <BreadcrumbPage>{t('detail.practitionerDetails')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('detail.back')}
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
              practitioner={filteredPractitioner}
              formatPrice={formatPrice}
              getModeLabel={getModeLabel}
              titleCount={services.length > 0 ? filteredServices.length : undefined}
              filtersSlot={services.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder={t('detail.searchServices')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full border-gray-200"
                    />
                  </div>
                  {allModes.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>{t('filters.sessionMode')}</span>
                          {selectedModes.length > 0 && (
                            <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{selectedModes.length}</Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">{t('filters.sessionMode')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {allModes.map(mode => (
                              <button
                                key={mode}
                                onClick={() => toggleMode(mode)}
                                className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${selectedModes.includes(mode) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}
                              >
                                {getModeLabel(mode)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {allDurations.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{t('common.duration')}</span>
                          {selectedDurations.length > 0 && (
                            <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{selectedDurations.length}</Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">{t('common.duration')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {allDurations.map(d => (
                              <button
                                key={d}
                                onClick={() => toggleDuration(d)}
                                className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${selectedDurations.includes(d) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}
                              >
                                {formatDuration(d)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>{t('filters.priceRange')}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t('filters.sessionCost')}</h3>
                        <Slider
                          value={effectivePriceRange}
                          min={minPrice}
                          max={Math.max(maxPrice, minPrice + 1)}
                          step={25000}
                          onValueChange={(v) => setPriceRange(v as [number, number])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Rp {effectivePriceRange[0].toLocaleString()}</span>
                          <span>Rp {effectivePriceRange[1].toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          <Checkbox
                            id="include-null-price-prac-services"
                            checked={includeNullPrice}
                            onCheckedChange={(c) => setIncludeNullPrice(c === true)}
                          />
                          <label htmlFor="include-null-price-prac-services" className="text-sm cursor-pointer">
                            {t('detail.includePriceUponRequest')}
                          </label>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto text-xs">
                      {t('filters.clearAll')}
                    </Button>
                  )}
                </div>
              ) : undefined}
            />
          </div>

          <div className="space-y-6">
            <PractitionerContact practitioner={practitioner} fromInstitution={contactFromInstitution} />
            <PractitionerLocations locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDetail;
