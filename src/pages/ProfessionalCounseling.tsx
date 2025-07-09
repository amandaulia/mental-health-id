
import { useState, useMemo, useEffect } from "react";
import React from "react";
import { FilterState, Practitioner, Bureau, UnifiedCardData } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard } from "@/components/UnifiedCard";
import { usePractitioners, useInstitutions } from "@/hooks/useDatabase";
import { transformPractitioner, transformInstitution } from "@/utils/dataTransform";
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
    priceRange: [0, 2000000],
    modes: [],
    insurance: []
  });

  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitioners();
  const { data: dbInstitutions, isLoading: institutionsLoading } = useInstitutions();

  const allPractitioners = useMemo(() => {
    if (!dbPractitioners) return [];
    return dbPractitioners.map(p => transformPractitioner(p));
  }, [dbPractitioners]);

  const allBureaus = useMemo(() => {
    if (!dbInstitutions) return [];
    return dbInstitutions.map(institution => transformInstitution(institution));
  }, [dbInstitutions]);

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
      priceRange: [0, 2000000],
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

  const isLoading = practitionersLoading || institutionsLoading;

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Professional Counseling</h1>
        <p className="text-muted-foreground">Find qualified mental health professionals and institutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg p-4">
            <SearchAndFilters
              filters={filters}
              onFiltersChange={setFilters}
              institutionNames={institutionNames}
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

        <div className="md:col-span-3">
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
        </div>
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
