import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterState, UnifiedCardData } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard } from "@/components/UnifiedCard";
import { InfiniteCardGrid } from "@/components/InfiniteCardGrid";
import { usePractitionersWithRelations, useInstitutionsWithRelations, useResourcePopularity } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { trackSearch, trackFilter } from "@/utils/analytics";
import { PageSEO } from "@/components/PageSEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { sortResources } from "@/utils/sortResources";
import type { Coordinates } from "@/utils/sortResources";

const ITEMS_PER_PAGE = 10;

const canonicalizeInsurance = (insurance: string) => {
  const normalized = insurance?.trim().toLowerCase();
  if (normalized === "bpjs") return "BPJS";
  if (normalized === "private" || normalized === "private insurance") return "Private Insurance";
  if (normalized === "none") return "none";
  return insurance?.trim() || "";
};

const normalizeInsuranceList = (insurance: string[] = []) => {
  return Array.from(new Set(insurance.map(canonicalizeInsurance).filter(Boolean)));
};

const formatRupiah = (price: number) =>
  price === 0 ? "Free" : `Rp ${price.toLocaleString()}`;

const buildPriceRange = (prices: number[]): string | null => {
  if (prices.length === 0) return null;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (minPrice === maxPrice) return formatRupiah(minPrice);
  return `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;
};

const hasInsuranceMatch = (resourceInsurance: string[] = [], selectedInsurance: string[] = []) => {
  const resourceValues = normalizeInsuranceList(resourceInsurance);
  const selectedValues = normalizeInsuranceList(selectedInsurance);
  return selectedValues.some((selected) => resourceValues.includes(selected));
};

const ProfessionalCounseling = () => {
  const { t } = useLanguage();
  const locationDeniedMessage = t("sort.locationDenied");
  const locationUnavailableMessage = t("sort.locationUnavailable");
  const locationUnsupportedMessage = t("sort.locationUnsupported");
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
    includeNullPrice: true,
    sortBy: "popular",
  });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationSortMessage, setLocationSortMessage] = useState("");

  // OPTIMIZED: Fetch all data with relations in 2 queries instead of 300+
  const { data: practitionersData = [], isLoading: practitionersLoading } = usePractitionersWithRelations();
  const { data: institutionsData = [], isLoading: institutionsLoading } = useInstitutionsWithRelations();

  const { data: resourcePopularity = [] } = useResourcePopularity();

  // Fetch min/max prices for the price range filter
  const { data: priceRange } = useQuery({
    queryKey: ["service-price-range"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service").select("price").not("price", "is", null);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { minPrice: 0, maxPrice: 5000000 };
      }

      const prices = data.map((s) => s.price).filter((p) => p != null);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return {
        minPrice: Math.floor(minPrice / 25000) * 25000,
        maxPrice: Math.ceil(maxPrice / 25000) * 25000,
      };
    },
  });

  // OPTIMIZED: Transform data directly from the nested query results
  const allPractitioners = useMemo(() => {
    if (practitionersLoading) return [];

    return practitionersData.map((practitioner: any) => {
      const locations = practitioner.practitioner_locations?.map((pl: any) => pl.location).filter(Boolean) || [];
      const services = practitioner.practitioner_services?.map((ps: any) => ps.service).filter(Boolean) || [];
      const institutionInsurance = practitioner.practitioner_institutions?.flatMap((pi: any) => pi.institution?.insurance || []) || [];
      const institutionTypes = Array.from(new Set(
        (practitioner.practitioner_institutions || [])
          .map((pi: any) => pi.institution?.institution_type)
          .filter(Boolean)
      ));
      const institutions = (practitioner.practitioner_institutions || [])
        .map((pi: any) => pi.institution)
        .filter((inst: any) => inst?.id && inst?.name)
        .map((inst: any) => ({ id: inst.id.toString(), name: inst.name }));

      // Extract cities from locations
      const cities = Array.from(new Set(locations.map((loc: any) => loc.city).filter(Boolean)));
      const cityString = cities.length > 0 ? cities.join(", ") : "Unknown City";
      
      // Extract modes from services
      const mapMode = (mode: string): string => {
        const normalized = mode.toLowerCase().trim();
        if (normalized === "video call") return "video";
        if (normalized === "chat") return "text";
        if (normalized === "voice call") return "voice";
        if (normalized === "offline") return "offline";
        return normalized;
      };

      const allModes = services.flatMap((s: any) => s.session_mode?.map((m: string) => m.toLowerCase()) || []);
      const uniqueModesSet = Array.from(new Set(allModes.map((mode: string) => mapMode(mode))));
      const modeOrder = ["text", "voice", "video", "offline"];
      const uniqueModes = uniqueModesSet.sort((a: any, b: any) => modeOrder.indexOf(a) - modeOrder.indexOf(b));

      // Calculate price range (include 0 as "Free")
      const prices = services
        .map((s: any) => s.price)
        .filter((p: any): p is number => p != null);

      return {
        type: "practitioner" as const,
        id: practitioner.id,
        name: practitioner.name,
        bureauName: practitioner.practitioner_institutions?.[0]?.institution?.name || "Independent",
        institutions,
        image: practitioner.image,
        professionTypes: practitioner.profession_type || [],
        specializations: practitioner.specialization || [],
        institutionTypes,
        insurance: normalizeInsuranceList([...institutionInsurance, ...(practitioner.insurance || [])]),
        verified: practitioner.verified || false,
        city: cityString,
        modes: uniqueModes,
        priceRange: buildPriceRange(prices),
        services,
        locations,
      };
    });
  }, [practitionersData, practitionersLoading]);

  // OPTIMIZED: Transform institutions with their nested data
  const allBureaus = useMemo(() => {
    if (institutionsLoading) return [];

    return institutionsData.map((institution: any) => {
      const locations = institution.institution_locations?.map((il: any) => il.location).filter(Boolean) || [];
      const services = institution.institution_services?.map((is: any) => is.service).filter(Boolean) || [];

      // Extract cities from locations
      const cities = Array.from(new Set(locations.map((loc: any) => loc.city).filter(Boolean)));
      const cityString = cities.length > 0 ? cities.join(", ") : "Unknown City";
      
      // Extract modes from services
      const mapMode = (mode: string): string => {
        const normalized = mode.toLowerCase().trim();
        if (normalized === "video call") return "video";
        if (normalized === "chat") return "text";
        if (normalized === "voice call") return "voice";
        if (normalized === "offline") return "offline";
        return normalized;
      };

      const allModes = services.flatMap((s: any) => s.session_mode || []);
      const uniqueModesSet = Array.from(new Set(allModes.map((mode: string) => mapMode(mode))));
      const modeOrder = ["text", "voice", "video", "offline"];
      const uniqueModes = uniqueModesSet.sort((a: any, b: any) => modeOrder.indexOf(a) - modeOrder.indexOf(b));

      // Calculate price range (include 0 as "Free")
      const prices = services
        .map((s: any) => s.price)
        .filter((p: any): p is number => p != null);

      return {
        type: "bureau" as const,
        id: institution.id,
        name: institution.name,
        image: institution.image,
        bureauType: institution.institution_type,
        professionTypes: institution.profession_type || [],
        specializations: institution.specialization || [],
        insurance: normalizeInsuranceList(institution.insurance || []),
        verified: institution.verified || false,
        city: cityString,
        modes: uniqueModes,
        priceRange: buildPriceRange(prices),
        services,
        locations,
      };
    });
  }, [institutionsData, institutionsLoading]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter((item) => item !== value);
    setFilters((prev) => ({ ...prev, [type]: newArray }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      locations: [],
      institutions: [],
      institutionTypes: [],
      professionTypes: [],
      specializations: [],
      priceRange: [filterOptions.minPrice || 0, filterOptions.maxPrice || 0],
      modes: [],
      insurance: [],
      includeNullPrice: false,
      sortBy: "popular",
    });
  };

  const filteredPractitioners = useMemo(() => {
    return allPractitioners.filter((practitioner: any) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !practitioner.name.toLowerCase().includes(searchLower) &&
          !practitioner.bureauName.toLowerCase().includes(searchLower) &&
          !practitioner.city.toLowerCase().includes(searchLower)
        )
          return false;
      }

      if (filters.locations.length > 0) {
        const cityCountry = `${practitioner.city}, Indonesia`;
        if (!filters.locations.some((loc) => cityCountry.includes(loc.split(",")[0]))) return false;
      }

      if (filters.institutions.length > 0 && !filters.institutions.includes(practitioner.bureauName)) {
        return false;
      }

      if (filters.institutionTypes.length > 0) {
        if (filters.includePractitionersForInstitutionType === false) {
          return false;
        }
        if (!filters.institutionTypes.some((t) => practitioner.institutionTypes?.includes(t))) {
          return false;
        }
      }

      if (
        filters.professionTypes.length > 0 &&
        !filters.professionTypes.some((type) => practitioner.professionTypes.includes(type))
      ) {
        return false;
      }

      if (
        filters.specializations.length > 0 &&
        !filters.specializations.some((spec: any) => practitioner.specializations.includes(spec))
      ) {
        return false;
      }

      if (filters.priceRange && practitioner.services.length > 0) {
        const hasServiceInRange = practitioner.services.some((service: any) => {
          if (filters.includeNullPrice && (!service.price || service.price === 0)) {
            return true;
          }
          return service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
        });
        if (!hasServiceInRange) return false;
      }

      if (filters.modes.length > 0 && !filters.modes.some((mode) => practitioner.modes.includes(mode))) {
        return false;
      }

      if (filters.insurance.length > 0 && !hasInsuranceMatch(practitioner.insurance, filters.insurance)) {
        return false;
      }

      return true;
    });
  }, [filters, allPractitioners]);

  const filteredBureaus = useMemo(() => {
    return allBureaus.filter((bureau: any) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const getBureauTypeLabel = (type: string) => {
          const labels: Record<string, string> = {
            independent: "Private Practice",
            clinic: "Clinic",
            faskes1: "Faskes 1",
            faskes2: "Faskes 2",
          };
          return labels[type] || type;
        };
        const bureauTypeLabel = getBureauTypeLabel(bureau.bureauType).toLowerCase();

        if (
          !bureau.name.toLowerCase().includes(searchLower) &&
          !bureau.city.toLowerCase().includes(searchLower) &&
          !bureauTypeLabel.includes(searchLower)
        )
          return false;
      }

      if (filters.locations.length > 0) {
        const cityCountry = `${bureau.city}, Indonesia`;
        if (!filters.locations.some((loc) => cityCountry.includes(loc.split(",")[0]))) return false;
      }

      if (filters.institutions.length > 0 && !filters.institutions.includes(bureau.name)) {
        return false;
      }

      if (filters.institutionTypes.length > 0 && !filters.institutionTypes.includes(bureau.bureauType)) {
        return false;
      }

      if (filters.professionTypes.length > 0) {
        if (filters.includeInstitutionsForProfessionType === false) {
          return false;
        }
        if (!filters.professionTypes.some((type) => bureau.professionTypes.includes(type))) {
          return false;
        }
      }

      if (
        filters.specializations.length > 0 &&
        !filters.specializations.some((spec: any) => bureau.specializations.includes(spec))
      ) {
        return false;
      }

      if (filters.priceRange && bureau.services.length > 0) {
        const hasServiceInRange = bureau.services.some((service: any) => {
          if (service.price == null) return filters.includeNullPrice;
          return service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
        });
        if (!hasServiceInRange) return false;
      }

      if (filters.modes.length > 0 && !filters.modes.some((mode) => bureau.modes.includes(mode))) {
        return false;
      }

      if (filters.insurance.length > 0 && !hasInsuranceMatch(bureau.insurance, filters.insurance)) {
        return false;
      }

      return true;
    });
  }, [filters, allBureaus]);

  const allResources = useMemo(() => {
    const popularity = resourcePopularity.reduce<Record<string, number>>((acc, item: any) => {
      acc[`${item.resource_type}:${item.resource_id}`] = item.click_count || 0;
      return acc;
    }, {});

    return sortResources([...filteredPractitioners, ...filteredBureaus], {
      sortBy: filters.sortBy || "popular",
      popularity,
      userLocation,
    });
  }, [filteredPractitioners, filteredBureaus, filters.sortBy, resourcePopularity, userLocation]);

  const institutionNames = useMemo(() => {
    const names = new Set<string>();
    allPractitioners.forEach((practitioner: any) => names.add(practitioner.bureauName));
    allBureaus.forEach((bureau: any) => names.add(bureau.name));
    return Array.from(names);
  }, [allPractitioners, allBureaus]);

  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const specializations = new Set<string>();
    const sessionModes = new Set<string>();
    const insuranceTypes = new Set<string>();
    const institutionTypes = new Set<string>();
    const professionTypes = new Set<string>();

    [...allPractitioners, ...allBureaus].forEach((resource: any) => {
      if (resource.city && resource.city !== "Unknown City") {
        const cityName = resource.city.split(",")[0].trim();
        cities.add(`${cityName}, Indonesia`);
      }

      resource.specializations.forEach((spec: any) => specializations.add(spec));
      resource.modes.forEach((mode: any) => sessionModes.add(mode));
      resource.insurance
        .map((ins: any) => canonicalizeInsurance(ins))
        .filter((ins: any) => ins && ins !== "none")
        .forEach((ins: any) => insuranceTypes.add(ins));
      (resource.professionTypes || []).forEach((p: any) => p && professionTypes.add(p));
    });

    allBureaus.forEach((bureau: any) => {
      institutionTypes.add(bureau.bureauType);
    });

    return {
      cities: Array.from(cities).sort(),
      specializations: Array.from(specializations).sort(),
      sessionModes: Array.from(sessionModes).sort(),
      insuranceTypes: Array.from(insuranceTypes).sort(),
      institutionTypes: Array.from(institutionTypes).sort(),
      professionTypes: Array.from(professionTypes).sort(),
      minPrice: priceRange?.minPrice || 0,
      maxPrice: priceRange?.maxPrice || 0,
    };
  }, [allPractitioners, allBureaus, priceRange]);

  useEffect(() => {
    if (filterOptions.minPrice !== undefined && filterOptions.maxPrice !== undefined) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
      }));
    }
  }, [filterOptions.minPrice, filterOptions.maxPrice]);

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

  const isInitialLoading = practitionersLoading || institutionsLoading;

  useEffect(() => {
    if (filters.search) {
      // Track search
    }
  }, [filters.search]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="professional" path="/professional-counseling" />
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">{t("pages.professional.heroTitleA")}</span>
          {t("pages.professional.heroTitleB")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          {t("pages.professional.heroLead")}
        </p>
      </div>

      {/* Search and Browse Section */}
      <div className="mb-6 sticky top-16 sm:top-20 z-40 -mx-4 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-2">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={filterOptions}
            institutionNames={institutionNames}
            locationSortMessage={locationSortMessage}
            showSort
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

      {!isInitialLoading && (
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredPractitioners.length} practitioners, {filteredBureaus.length} institutions
        </div>
      )}

      {/* Loading indicator */}
      {isInitialLoading && (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="text-lg font-medium text-foreground">
              {t('detail.loading')}
            </span>
          </div>
        </div>
      )}

      <InfiniteCardGrid
        items={allResources}
        pageSize={ITEMS_PER_PAGE}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        renderItem={(resource: any) => {
          const cardData: UnifiedCardData = resource.type === "practitioner" ? {
            type: "practitioner",
            id: resource.id.toString(),
            name: resource.name,
            institutionName: resource.bureauName,
            institutions: resource.institutions,
            professionTypes: resource.professionTypes,
            specializations: resource.specializations,
            insurance: resource.insurance,
            city: resource.city,
            modes: resource.modes,
            priceRange: resource.priceRange,
            isVerified: resource.verified,
            image: resource.image,
          } : {
            type: "institution",
            id: resource.id.toString(),
            name: resource.name,
            professionTypes: resource.professionTypes,
            specializations: resource.specializations,
            insurance: resource.insurance,
            city: resource.city,
            modes: resource.modes,
            priceRange: resource.priceRange,
            isVerified: resource.verified,
            image: resource.image,
          };
          const linkTo = resource.type === "practitioner"
            ? `/practitioner/${resource.id}`
            : `/bureau/${resource.id}`;
          return <UnifiedCard key={`${resource.type}-${resource.id}`} data={cardData} linkTo={linkTo} />;
        }}
      />

      {allResources.length === 0 && !isInitialLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t('filters.noResults')}</p>
          <Button onClick={handleClearAllFilters} variant="outline">
            {t('filters.clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCounseling;
