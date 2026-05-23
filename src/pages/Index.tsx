import { useState, useMemo, useEffect } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterState, Practitioner, Bureau } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { Separator } from "@/components/ui/separator";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { usePractitionersWithRelations, useInstitutionsWithRelations, usePeerCounseling, useOrganizations, useActivities } from "@/hooks/useDatabase";
import { transformPractitioner, transformInstitution, transformService } from "@/utils/dataTransform";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackFeelingsAnalysis, trackSearch, trackFilter } from "@/utils/analytics";
import { Badge } from "@/components/ui/badge";
import { featureFlags } from "@/config/features";
import { useLanguage } from "@/contexts/LanguageContext";
import { sortByCompleteness } from "@/utils/completeness";
import { sortResources } from "@/utils/sortResources";
import type { Coordinates } from "@/utils/sortResources";
import { PageSEO } from "@/components/PageSEO";
import { matchProfessional, matchPeer, matchActivity, matchOrganization } from "@/utils/filterResource";

const Index = () => {
  const { t } = useLanguage();
  // Feature flags
  const isFeelingsAnalysisEnabled = false; // Set to false to hide the feature
  
  const [feelings, setFeelings] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<UnifiedCardData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    locations: [],
    institutions: [],
    institutionTypes: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    insurance: [],
    sortBy: "popular",
  });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationSortMessage, setLocationSortMessage] = useState("");
  const locationDeniedMessage = t("sort.locationDenied");
  const locationUnavailableMessage = t("sort.locationUnavailable");
  const locationUnsupportedMessage = t("sort.locationUnsupported");

  const { toast } = useToast();
  // OPTIMIZED: Fetch everything via Supabase JOINs (2 queries instead of 200+)
  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitionersWithRelations();
  const { data: dbInstitutions, isLoading: institutionsLoading } = useInstitutionsWithRelations();
  const { data: dbPeerCounseling, isLoading: peerCounselingLoading } = usePeerCounseling();
  const { data: dbOrganizations, isLoading: organizationsLoading } = useOrganizations();
  const { data: dbActivities, isLoading: activitiesLoading } = useActivities();

  const { data: resourcePopularity = [] } = useQuery({
    queryKey: ["resource-popularity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resource_popularity")
        .select("resource_type, resource_id, click_count");
      if (error) {
        console.error("Error fetching resource popularity:", error);
        return [];
      }
      return data || [];
    },
  });

  const popularity = useMemo(() => {
    return (resourcePopularity as any[]).reduce<Record<string, number>>((acc, item: any) => {
      acc[`${item.resource_type}:${item.resource_id}`] = item.click_count || 0;
      return acc;
    }, {});
  }, [resourcePopularity]);

  const sortOpts = useMemo(
    () => ({ sortBy: filters.sortBy || "popular", popularity, userLocation }),
    [filters.sortBy, popularity, userLocation]
  );

  const allPractitioners = useMemo<Practitioner[]>(() => {
    if (!dbPractitioners) return [];

    return dbPractitioners.map((dbPractitioner: any) => {
      const services = (dbPractitioner.practitioner_services || [])
        .map((ps: any) => ps.service)
        .filter(Boolean)
        .map(transformService);
      const locations = (dbPractitioner.practitioner_locations || [])
        .map((pl: any) => pl.location)
        .filter(Boolean);
      const primaryLocation = locations[0];

      return {
        ...transformPractitioner(dbPractitioner, services, []),
        city: primaryLocation?.city || t('home.fallback.unknownCity'),
        location: {
          address: primaryLocation?.address || t('home.fallback.addressUnavailable'),
          lat: 0,
          lng: 0,
        }
      };
    });
  }, [dbPractitioners, t]);

  const allBureaus = useMemo<Bureau[]>(() => {
    if (!dbInstitutions) return [];

    return dbInstitutions.map((dbInstitution: any) => {
      const services = (dbInstitution.institution_services || [])
        .map((is: any) => is.service)
        .filter(Boolean)
        .map(transformService);
      const locations = (dbInstitution.institution_locations || [])
        .map((il: any) => il.location)
        .filter(Boolean);
      const primaryLocation = locations[0];

      return {
        ...transformInstitution(dbInstitution, services, []),
        city: primaryLocation?.city || t('home.fallback.unknownCity'),
        location: {
          address: primaryLocation?.address || t('home.fallback.addressUnavailable'),
          lat: 0,
          lng: 0,
        }
      };
    });
  }, [dbInstitutions, t]);

  const allProfessionalResources = useMemo(() => {
    return [...allPractitioners, ...allBureaus];
  }, [allPractitioners, allBureaus]);

  const handleFeelingsAnalysis = async () => {
    if (!feelings.trim()) {
      toast({
        title: t('home.toast.shareFeelings'),
        description: "Tell us what you're feeling today to get personalized recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-feelings', {
        body: { feelings: feelings.trim() }
      });

      if (error) throw error;

      const recommendedCards: UnifiedCardData[] = data.recommendations?.map((rec: any) => ({
        type: rec.type,
        id: rec.id,
        name: rec.name,
        city: rec.city || "Jakarta",
        isVerified: rec.isVerified || false,
        ...rec
      })) || [];

      setRecommendations(recommendedCards);
      
      trackFeelingsAnalysis(feelings.trim().length, recommendedCards.length);
      
      toast({
        title: t('home.toast.recommendationsReady'),
        description: `Found ${recommendedCards.length} personalized recommendations for you.`
      });
    } catch (error) {
      console.error('Error analyzing feelings:', error);
      toast({
        title: t('home.toast.analysisFailed'),
        description: "We couldn't analyze your feelings right now. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredProfessionalResources = useMemo(() => {
    const filtered = allProfessionalResources.filter((r) => matchProfessional(r, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, allProfessionalResources, sortOpts]);

  const filteredPractitioners = useMemo(() => {
    const filtered = allPractitioners.filter((r) => matchProfessional(r, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, allPractitioners, sortOpts]);

  const filteredClinics = useMemo(() => {
    const filtered = allBureaus.filter((r) => matchProfessional(r, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, allBureaus, sortOpts]);

  const filteredPeerCounseling = useMemo(() => {
    if (!dbPeerCounseling) return [];
    const filtered = (dbPeerCounseling as any[]).filter((item) => matchPeer(item, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, dbPeerCounseling, sortOpts]);

  const filteredActivities = useMemo(() => {
    if (!dbActivities) return [];
    const filtered = (dbActivities as any[]).filter((item) => matchActivity(item, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, dbActivities, sortOpts]);

  const filteredOrganizations = useMemo(() => {
    if (!dbOrganizations) return [];
    const filtered = (dbOrganizations as any[]).filter((item) => matchOrganization(item, filters));
    return sortResources(filtered as any, sortOpts);
  }, [filters, dbOrganizations, sortOpts]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
    
    trackFilter(type, value, 'Home');
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      locations: [],
      institutions: [],
      institutionTypes: [],
      professionTypes: [],
      specializations: [],
      priceRange: [0, 2000000],
      modes: [],
      insurance: [],
      sortBy: "popular",
    });
    
    trackFilter('clear_all', 'all_filters', 'Home');
  };

  const institutionNames = useMemo(() => {
    const names = new Set<string>();
    allProfessionalResources.forEach(resource => {
      if (resource.type === "practitioner") {
        names.add(resource.bureauName);
      } else {
        names.add(resource.name);
      }
    });
    return Array.from(names);
  }, [allProfessionalResources]);

  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const specializations = new Set<string>();
    const sessionModes = new Set<string>();
    const insuranceTypes = new Set<string>();
    const professionTypes = new Set<string>();

    allProfessionalResources.forEach(resource => {
      if (resource.city && resource.city !== 'Unknown City') {
        const cityName = resource.city.split(',')[0].trim();
        cities.add(`${cityName}, Indonesia`);
      }

      resource.specializations.forEach(spec => specializations.add(spec));
      resource.modes.forEach(mode => sessionModes.add(mode));
      resource.insurance.filter(ins => ins !== "none").forEach(ins => insuranceTypes.add(ins));
      resource.professionTypes?.forEach((pt: string) => professionTypes.add(pt));
    });

    const addCitiesFromLocations = (rows: any[] | undefined, key: string) => {
      (rows || []).forEach((row: any) => {
        (row?.[key] || []).forEach((l: any) => {
          const c = l?.location?.city;
          if (c) cities.add(`${c.split(',')[0].trim()}, Indonesia`);
        });
      });
    };
    const addSpecs = (rows: any[] | undefined) => {
      (rows || []).forEach((row: any) => (row?.specialization || []).forEach((s: string) => specializations.add(s)));
    };
    addCitiesFromLocations(dbPeerCounseling as any[], "peer_counseling_locations");
    addCitiesFromLocations(dbOrganizations as any[], "organization_locations");
    addCitiesFromLocations(dbActivities as any[], "activity_locations");
    addSpecs(dbPeerCounseling as any[]);
    addSpecs(dbOrganizations as any[]);
    addSpecs(dbActivities as any[]);

    return {
      cities: Array.from(cities).sort(),
      specializations: Array.from(specializations).sort(),
      sessionModes: Array.from(sessionModes).sort(),
      insuranceTypes: Array.from(insuranceTypes).sort(),
      professionTypes: Array.from(professionTypes).sort(),
      institutionTypes: [],
      minPrice: 0,
      maxPrice: 2000000
    };
  }, [allProfessionalResources, dbPeerCounseling, dbOrganizations, dbActivities]);

  const isLoading = practitionersLoading || institutionsLoading || peerCounselingLoading || organizationsLoading || activitiesLoading;

  useEffect(() => {
    if (filters.search) {
      const totalResults = filteredPractitioners.length +
                          filteredClinics.length +
                          filteredPeerCounseling.length +
                          filteredActivities.length +
                          filteredOrganizations.length;
      trackSearch(filters.search, totalResults, 'Home');
    }
  }, [filters.search, filteredPractitioners, filteredClinics, filteredPeerCounseling, filteredActivities, filteredOrganizations]);

  useEffect(() => {
    if (filters.sortBy !== "nearest") {
      setLocationSortMessage("");
      return;
    }
    if (userLocation) {
      setLocationSortMessage("");
      return;
    }
    if (!navigator.geolocation) {
      setLocationSortMessage(locationUnsupportedMessage);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationSortMessage("");
      },
      (error) => {
        setLocationSortMessage(
          error.code === error.PERMISSION_DENIED
            ? locationDeniedMessage
            : locationUnavailableMessage
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [filters.sortBy, locationDeniedMessage, locationUnavailableMessage, locationUnsupportedMessage, userLocation]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="home" path="/" />
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">{t('home.hero.title1')}</span> {t('home.hero.title2')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          {t('home.hero.subtitle')}
        </p>
      </div>

      {/* Feelings Analysis Section */}
      {isFeelingsAnalysisEnabled && (
        <div className="mb-8 sm:mb-12">
          <div className="bg-card rounded-xl p-6 card-shadow max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t('home.feelings.title')}
              </h2>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Share what you're experiencing, and we'll recommend personalized mental health resources for you.
            </p>
            <Textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="I've been feeling anxious about work lately and having trouble sleeping..."
              className="min-h-[120px] mb-4"
            />
            <Button 
              onClick={handleFeelingsAnalysis}
              disabled={isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? t('home.feelings.analyzing') : t('home.feelings.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
            {t('home.feelings.recommendationsTitle')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                <UnifiedCard data={recommendation} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Browse Section */}
      <div className="mb-6">
        <div className="bg-card rounded-lg p-4">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            institutionNames={institutionNames}
            filterOptions={filterOptions}
            searchPlaceholder={t('search.placeholderAll')}
            locationSortMessage={locationSortMessage}
          />
        </div>
        <div className="mt-4">
          <FilterTags
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
      </div>

      {/* Preview Sections */}
      <div className="space-y-8">
        {/* Professional Counseling Preview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {t('home.sectionHeading.professional')} ({filteredPractitioners.length})
            </h2>
            <Button variant="outline" asChild>
              <a href="/professional-counseling">
                {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPractitioners.slice(0, 6).map((resource: any) => {
              const cardData: UnifiedCardData = {
                type: "practitioner",
                id: resource.id,
                image: resource.image,
                name: resource.name,
                city: resource.city,
                isVerified: resource.isVerified,
                institutionName: resource.bureauName,
                institutions: resource.institutions,
                professionTypes: resource.professionTypes,
                specializations: resource.specializations,
                priceRange: resource.priceRange,
                insurance: resource.insurance,
                modes: resource.modes,
              };
              return (
                <div key={`practitioner-${resource.id}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <UnifiedCard data={cardData} linkTo={`/practitioner/${resource.id}`} />
                </div>
              );
            })}
          </div>
          {filteredPractitioners.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('common.noResults') || 'No results match your filters.'}</p>
          )}
        </div>

        {/* Separator */}
        <Separator className="my-8" />

        {/* Clinics & Hospitals Preview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {t('home.sectionHeading.clinics')} ({filteredClinics.length})
            </h2>
            <Button variant="outline" asChild>
              <a href="/professional-counseling">
                {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClinics.slice(0, 6).map((resource: any) => {
              const cardData: UnifiedCardData = {
                type: "institution",
                id: resource.id,
                image: resource.image,
                name: resource.name,
                city: resource.city,
                isVerified: resource.isVerified,
                professionTypes: resource.professionTypes,
                specializations: resource.specializations,
                priceRange: resource.priceRange,
                insurance: resource.insurance,
                modes: resource.modes,
              };
              return (
                <div key={`clinic-${resource.id}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <UnifiedCard data={cardData} linkTo={`/bureau/${resource.id}`} />
                </div>
              );
            })}
          </div>
          {filteredClinics.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('common.noResults') || 'No results match your filters.'}</p>
          )}
        </div>

        <Separator className="my-8" />

        {/* Peer Counseling & Support Groups Preview */}
        {featureFlags.peerCounseling && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t('home.sectionHeading.peer')} ({filteredPeerCounseling.length})
              </h2>
              {filteredPeerCounseling.length === 0 && (
                <Badge variant="secondary" className="text-xs bg-purple-200 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                  {t('home.comingSoon')}
                </Badge>
              )}
            </div>
            {filteredPeerCounseling.length > 0 && (
              <Button variant="outline" asChild>
                <a href="/peer-counseling">
                  {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          {filteredPeerCounseling.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPeerCounseling.slice(0, 6).map((item: any, index: number) => {
                const cardData: UnifiedCardData = {
                  type: "peer-counseling",
                  id: item.id.toString(),
                  image: item.image,
                  name: item.name,
                  city: "Jakarta",
                  isVerified: item.verified,
                  specialization: item.specialization?.[0] || "General",
                  serviceType: item.peer_type?.[0] || "Peer Counseling",
                  price: 0,
                };
                return (
                  <div key={`peer-${item.id}-${index}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <UnifiedCard data={cardData} linkTo={`/peer-counseling/${item.id}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Stress Relief Activities Preview */}
        {featureFlags.stressRelief && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t('home.sectionHeading.stressRelief')} ({filteredActivities.length})
              </h2>
              <Button variant="outline" asChild>
                <a href="/stress-relief">
                  {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredActivities.slice(0, 6).map((item: any, index: number) => {
                const cardData: UnifiedCardData = {
                  type: "activity",
                  id: item.id.toString(),
                  image: item.image ?? undefined,
                  name: item.name,
                  city: item.activity_locations?.[0]?.location?.city || "",
                  organizationName: item.activity_organizations?.[0]?.organization?.name || "",
                  activityType: item.activity_type?.[0] || "",
                  price: typeof item.price === 'string' ? parseInt(item.price) : (item.price ?? 0),
                };
                return (
                  <div key={`activity-${item.id}-${index}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <UnifiedCard data={cardData} />
                  </div>
                );
              })}
            </div>
            {filteredActivities.length === 0 && (
              <p className="text-sm text-muted-foreground">{t('common.noResults') || 'No results match your filters.'}</p>
            )}
          </div>
        )}

        {/* Organizations & Communities Preview */}
        {featureFlags.organizations && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t('home.sectionHeading.organizations')} ({filteredOrganizations.length})
              </h2>
              <Button variant="outline" asChild>
                <a href="/organizations">
                  {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrganizations.slice(0, 6).map((item: any, index: number) => {
                const cardData: UnifiedCardData = {
                  type: "organization",
                  id: item.id.toString(),
                  image: item.image ?? undefined,
                  name: item.name,
                  city: item.organization_locations?.[0]?.location?.city || "",
                  organizationType: item.specialization?.[0] || "",
                };
                return (
                  <div key={`org-${item.id}-${index}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <UnifiedCard data={cardData} linkTo={`/organizations/${item.id}`} />
                  </div>
                );
              })}
            </div>
            {filteredOrganizations.length === 0 && (
              <p className="text-sm text-muted-foreground">{t('common.noResults') || 'No results match your filters.'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
