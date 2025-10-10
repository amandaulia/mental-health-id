
import { useState, useMemo, useEffect } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { databaseService } from "@/services/database";
import { FilterState, Practitioner, Bureau, UnifiedCardData } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard } from "@/components/UnifiedCard";
import { usePractitioners, useInstitutions } from "@/hooks/useDatabase";
import { transformPractitioner, transformInstitution, transformService } from "@/utils/dataTransform";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackSearch, trackFilter } from "@/utils/analytics";

const ProfessionalCounseling = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    locations: [],
    institutions: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000], // Will be updated by useEffect
    modes: [],
    insurance: []
  });


  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitioners();
  const { data: dbInstitutions, isLoading: institutionsLoading } = useInstitutions();
  
  // Fetch locations for practitioners
  const { data: practitionerLocations, isLoading: practitionerLocationsLoading } = useQuery({
    queryKey: ['all-practitioner-locations', dbPractitioners?.map(p => p.id)],
    queryFn: async () => {
      if (!dbPractitioners) return {};
      const locationsMap: Record<number, any[]> = {};
      
      for (const practitioner of dbPractitioners) {
        try {
          const locations = await databaseService.getLocationsByPractitioner(practitioner.id);
          locationsMap[practitioner.id] = locations || [];
        } catch (error) {
          console.error(`Error fetching locations for practitioner ${practitioner.id}:`, error);
          locationsMap[practitioner.id] = [];
        }
      }
      
      return locationsMap;
    },
    enabled: !!dbPractitioners && dbPractitioners.length > 0,
  });

  // Fetch locations for institutions
  const { data: institutionLocations, isLoading: institutionLocationsLoading } = useQuery({
    queryKey: ['all-institution-locations', dbInstitutions?.map(i => i.id)],
    queryFn: async () => {
      if (!dbInstitutions) return {};
      const locationsMap: Record<number, any[]> = {};
      
      for (const institution of dbInstitutions) {
        try {
          const locations = await databaseService.getLocationsByInstitution(institution.id);
          locationsMap[institution.id] = locations || [];
        } catch (error) {
          console.error(`Error fetching locations for institution ${institution.id}:`, error);
          locationsMap[institution.id] = [];
        }
      }
      
      return locationsMap;
    },
    enabled: !!dbInstitutions && dbInstitutions.length > 0,
  });
  
  // Fetch services for all practitioners
  const { data: allPractitionerServices, isLoading: practitionerServicesLoading } = useQuery({
    queryKey: ['all-practitioner-services', dbPractitioners?.map(p => p.id)],
    queryFn: async () => {
      if (!dbPractitioners) return {};
      const servicesMap: Record<number, any[]> = {};
      
      for (const practitioner of dbPractitioners) {
        try {
          const services = await databaseService.getServicesByPractitioner(practitioner.id);
          servicesMap[practitioner.id] = services || [];
        } catch (error) {
          console.error(`Error fetching services for practitioner ${practitioner.id}:`, error);
          servicesMap[practitioner.id] = [];
        }
      }
      
      return servicesMap;
    },
    enabled: !!dbPractitioners && dbPractitioners.length > 0,
  });

  // Fetch services for all institutions
  const { data: allInstitutionServices, isLoading: institutionServicesLoading } = useQuery({
    queryKey: ['all-institution-services', dbInstitutions?.map(i => i.id)],
    queryFn: async () => {
      if (!dbInstitutions) return {};
      const servicesMap: Record<number, any[]> = {};
      
      for (const institution of dbInstitutions) {
        try {
          const services = await databaseService.getServicesByInstitution(institution.id);
          servicesMap[institution.id] = services || [];
        } catch (error) {
          console.error(`Error fetching services for institution ${institution.id}:`, error);
          servicesMap[institution.id] = [];
        }
      }
      
      return servicesMap;
    },
    enabled: !!dbInstitutions && dbInstitutions.length > 0,
  });

  const allPractitioners = useMemo(() => {
    if (!dbPractitioners || !practitionerLocations || !allPractitionerServices) return [];
    return dbPractitioners.map(p => {
      const locations = practitionerLocations[p.id] || [];
      const cities = Array.from(new Set(locations.map((loc: any) => loc.city).filter(Boolean)));
      const cityString = cities.length > 0 ? cities.join(', ') : 'Unknown City';
      
      // Get session modes from services and map them to the correct format
      const mapMode = (mode: string): string => {
        const normalized = mode.toLowerCase().trim();
        if (normalized === 'video call') return 'video';
        if (normalized === 'chat') return 'text';
        if (normalized === 'voice call') return 'voice';
        if (normalized === 'offline') return 'offline';
        return normalized;
      };
      
      const rawServices = allPractitionerServices[p.id] || [];
      const allModes = rawServices.flatMap((item: any) => item.service?.session_mode || []);
      const uniqueModesSet = Array.from(new Set(allModes.map((mode: string) => mapMode(mode))));
      
      // Sort modes in the desired order: text, voice, video, offline
      const modeOrder = ['text', 'voice', 'video', 'offline'];
      const uniqueModes = uniqueModesSet.sort((a, b) => modeOrder.indexOf(a) - modeOrder.indexOf(b)) as any;
      
      const transformed = transformPractitioner(p);
      return {
        ...transformed,
        city: cityString,
        modes: uniqueModes
      };
    });
  }, [dbPractitioners, practitionerLocations, allPractitionerServices]);

  const allBureaus = useMemo(() => {
    if (!dbInstitutions || institutionServicesLoading || !allInstitutionServices || !institutionLocations) return [];
    return dbInstitutions.map(institution => {
      // Get services for this institution from the services map
      const rawServices = allInstitutionServices[institution.id] || [];
      // Transform the nested service structure to flat services
      const services = rawServices.map(item => transformService(item.service));
      
      // Get session modes from services and map them to the correct format
      const mapMode = (mode: string): string => {
        const normalized = mode.toLowerCase().trim();
        if (normalized === 'video call') return 'video';
        if (normalized === 'chat') return 'text';
        if (normalized === 'voice call') return 'voice';
        if (normalized === 'offline') return 'offline';
        return normalized;
      };
      
      const allModes = rawServices.flatMap((item: any) => item.service?.session_mode || []);
      const uniqueModesSet = Array.from(new Set(allModes.map((mode: string) => mapMode(mode))));
      
      // Sort modes in the desired order: text, voice, video, offline
      const modeOrder = ['text', 'voice', 'video', 'offline'];
      const uniqueModes = uniqueModesSet.sort((a, b) => modeOrder.indexOf(a) - modeOrder.indexOf(b)) as any;
      
      // Get locations for this institution
      const locations = institutionLocations[institution.id] || [];
      const cities = Array.from(new Set(locations.map((loc: any) => loc.city).filter(Boolean)));
      const cityString = cities.length > 0 ? cities.join(', ') : 'Unknown City';
      
      const transformed = transformInstitution(institution, services);
      console.log('Bureau transform:', institution.name, 'priceRange:', transformed.priceRange, 'services count:', services.length);
      return {
        ...transformed,
        city: cityString,
        modes: uniqueModes
      };
    });
  }, [dbInstitutions, allInstitutionServices, institutionLocations, institutionServicesLoading]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
    
    trackFilter(type, value, 'Professional Counseling');
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      locations: [],
      institutions: [],
      professionTypes: [],
      specializations: [],
      priceRange: [filterOptions.minPrice || 0, filterOptions.maxPrice || 525000],
      modes: [],
      insurance: []
    });
    
    trackFilter('clear_all', 'all_filters', 'Professional Counseling');
  };

  const filteredPractitioners = useMemo(() => {
    return allPractitioners.filter((practitioner: Practitioner) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!practitioner.name.toLowerCase().includes(searchLower) &&
            !practitioner.bureauName.toLowerCase().includes(searchLower) &&
            !practitioner.city.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.locations.length > 0) {
        const cityCountry = `${practitioner.city}, Indonesia`;
        if (!filters.locations.some(loc => cityCountry.includes(loc.split(',')[0]))) return false;
      }

      if (filters.institutions.length > 0 && !filters.institutions.includes(practitioner.bureauName)) {
        return false;
      }

      if (filters.professionTypes.length > 0 &&
          !filters.professionTypes.some(type => practitioner.professionTypes.includes(type))) {
        return false;
      }

      if (filters.specializations.length > 0 &&
          !filters.specializations.some(spec => practitioner.specializations.includes(spec))) {
        return false;
      }

      const practitionerPrice = practitioner.services.map(s => s.price);
      const minPrice = Math.min(...practitionerPrice);
      const maxPrice = Math.max(...practitionerPrice);
      if (filters.priceRange && (minPrice < filters.priceRange[0] || maxPrice > filters.priceRange[1])) {
        return false;
      }

      if (filters.modes.length > 0 &&
          !filters.modes.some(mode => practitioner.modes.includes(mode))) {
        return false;
      }

      if (filters.insurance.length > 0 &&
          !filters.insurance.some(ins => practitioner.insurance.includes(ins))) {
        return false;
      }

      return true;
    });
  }, [filters, allPractitioners]);

  const filteredBureaus = useMemo(() => {
    return allBureaus.filter((bureau: Bureau) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!bureau.name.toLowerCase().includes(searchLower) &&
            !bureau.city.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.locations.length > 0) {
        const cityCountry = `${bureau.city}, Indonesia`;
        if (!filters.locations.some(loc => cityCountry.includes(loc.split(',')[0]))) return false;
      }

      if (filters.institutions.length > 0 && !filters.institutions.includes(bureau.name)) {
        return false;
      }

      if (filters.professionTypes.length > 0 &&
          !filters.professionTypes.some(type => bureau.professionTypes.includes(type))) {
        return false;
      }

      if (filters.specializations.length > 0 &&
          !filters.specializations.some(spec => bureau.specializations.includes(spec))) {
        return false;
      }

      if (filters.modes.length > 0 &&
          !filters.modes.some(mode => bureau.modes.includes(mode))) {
        return false;
      }

      if (filters.insurance.length > 0 &&
          !filters.insurance.some(ins => bureau.insurance.includes(ins))) {
        return false;
      }

      return true;
    });
  }, [filters, allBureaus]);

  const allResources = useMemo(() => {
    return [...filteredPractitioners, ...filteredBureaus];
  }, [filteredPractitioners, filteredBureaus]);

  const institutionNames = useMemo(() => {
    const names = new Set<string>();
    allPractitioners.forEach(practitioner => names.add(practitioner.bureauName));
    allBureaus.forEach(bureau => names.add(bureau.name));
    return Array.from(names);
  }, [allPractitioners, allBureaus]);

  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const specializations = new Set<string>();
    const sessionModes = new Set<string>();
    const insuranceTypes = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    [...allPractitioners, ...allBureaus].forEach(resource => {
      // Extract city - exclude "Unknown City" and ensure proper formatting
      if (resource.city && resource.city !== 'Unknown City') {
        const cityName = resource.city.split(',')[0].trim(); // Extract just the city name
        cities.add(`${cityName}, Indonesia`);
      }

      // Extract specializations
      resource.specializations.forEach(spec => specializations.add(spec));

      // Extract session modes
      resource.modes.forEach(mode => sessionModes.add(mode));

      // Extract insurance types
      resource.insurance.forEach(ins => insuranceTypes.add(ins));

      // Calculate min and max price
      if (resource.type === 'practitioner') {
        const prices = resource.services.map(s => s.price).filter(p => p != null && p > 0);
        if (prices.length > 0) {
          minPrice = Math.min(minPrice, ...prices);
          maxPrice = Math.max(maxPrice, ...prices);
        }
      } else {
        // For bureau, extract from priceRange string
        if (resource.priceRange) {
          const priceMatch = resource.priceRange.match(/[\d.,]+/g);
          if (priceMatch) {
            const prices = priceMatch.map(p => parseFloat(p.replace(/[.,]/g, '')));
            minPrice = Math.min(minPrice, ...prices);
            maxPrice = Math.max(maxPrice, ...prices);
          }
        }
      }
    });

    // Only reset if no prices were found in the data
    if (minPrice === Infinity) minPrice = 0;
    if (maxPrice === 0) maxPrice = 0;

    return {
      cities: Array.from(cities).sort(),
      specializations: Array.from(specializations).sort(),
      sessionModes: Array.from(sessionModes).sort(),
      insuranceTypes: Array.from(insuranceTypes).sort(),
      minPrice: Math.floor(minPrice / 25000) * 25000, // Round down to nearest 25000
      maxPrice: Math.ceil(maxPrice / 25000) * 25000 // Round up to nearest 25000
    };
  }, [allPractitioners, allBureaus]);

  // Update price range when filterOptions change
  const prevMinPrice = React.useRef(0);
  const prevMaxPrice = React.useRef(525000);
  React.useEffect(() => {
    if (filterOptions.minPrice !== prevMinPrice.current || filterOptions.maxPrice !== prevMaxPrice.current) {
      prevMinPrice.current = filterOptions.minPrice;
      prevMaxPrice.current = filterOptions.maxPrice;
      setFilters(prev => ({
        ...prev,
        priceRange: [filterOptions.minPrice, filterOptions.maxPrice]
      }));
    }
  }, [filterOptions.minPrice, filterOptions.maxPrice]);

  const isLoading = practitionersLoading || institutionsLoading || practitionerServicesLoading || institutionServicesLoading || practitionerLocationsLoading || institutionLocationsLoading;

  useEffect(() => {
    if (filters.search) {
      const totalResults = filteredPractitioners.length + filteredBureaus.length;
      trackSearch(filters.search, totalResults, 'Professional Counseling');
    }
  }, [filters.search, filteredPractitioners, filteredBureaus]);

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
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Professional</span> Counseling
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Find mental health professionals and institutions to help you navigate your mental health journey. 👩🏻‍⚕️
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-card rounded-lg p-4">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            institutionNames={institutionNames}
            filterOptions={filterOptions}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allResources.map((resource) => {
          let cardData: UnifiedCardData;

          if (resource.type === "practitioner") {
            const formatPrice = (prices: number[]) => {
              if (prices.length === 0) return undefined;
              if (prices.length === 1) return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(prices[0]);
              
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              return `${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(minPrice)} - ${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(maxPrice)}`;
            };
            const prices = resource.services.map(s => s.price).filter(Boolean);
            cardData = {
              type: "practitioner",
              id: resource.id,
              image: resource.image,
              name: resource.name,
              city: resource.city,
              isVerified: resource.isVerified,
              institutionName: resource.bureauName,
              professionTypes: resource.professionTypes,
              specializations: resource.specializations,
              priceRange: formatPrice(prices),
              insurance: resource.insurance,
              modes: resource.modes
            };
          } else {
            cardData = {
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
              modes: resource.modes
            };
          }

          return (
            <div key={resource.id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <UnifiedCard
                data={cardData}
                linkTo={resource.type === "practitioner" ? `/practitioner/${resource.id}` : `/bureau/${resource.id}`}
              />
            </div>
          );
        })}
      </div>

      {allResources.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-muted-foreground">No resources found matching your criteria.</p>
          <Button variant="link" onClick={handleClearAllFilters}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCounseling;
