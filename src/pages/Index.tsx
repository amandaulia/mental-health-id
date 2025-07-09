
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterState, Resource } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { usePractitioners, useInstitutions } from "@/hooks/useDatabase";
import { transformPractitioner, transformInstitution } from "@/utils/dataTransform";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Transform database data to match frontend types
  const allResources: Resource[] = useMemo(() => {
    const resources: Resource[] = [];
    
    if (dbPractitioners) {
      const transformedPractitioners = dbPractitioners.map(p => transformPractitioner(p));
      resources.push(...transformedPractitioners);
    }
    
    if (dbInstitutions) {
      const transformedInstitutions = dbInstitutions.map(institution => transformInstitution(institution));
      resources.push(...transformedInstitutions);
    }
    
    return resources;
  }, [dbPractitioners, dbInstitutions]);

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key in filters) {
        if (Array.isArray(filters[key as keyof FilterState])) {
          urlFilters[key as keyof FilterState] = [value] as any;
        } else {
          urlFilters[key as keyof FilterState] = value as any;
        }
      }
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  const institutionNames = useMemo(() => {
    const names = new Set<string>();
    allResources.forEach(resource => {
      if (resource.type === "practitioner") {
        names.add(resource.bureauName);
      } else {
        names.add(resource.name);
      }
    });
    return Array.from(names);
  }, [allResources]);

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      // Enhanced search filter - search by name, city, and mode
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchName = resource.type === "practitioner" 
          ? resource.name.toLowerCase().includes(searchLower)
          : resource.name.toLowerCase().includes(searchLower);
        const matchInstitution = resource.type === "practitioner"
          ? resource.bureauName.toLowerCase().includes(searchLower)
          : resource.name.toLowerCase().includes(searchLower);
        const matchCity = resource.city.toLowerCase().includes(searchLower);
        const matchMode = resource.modes.some(mode => {
          const modeLabel = mode === "text" ? "chat" : 
                           mode === "voice" ? "voice call" : 
                           mode === "video" ? "video call" : 
                           mode === "offline" ? "offline" : mode;
          return modeLabel.toLowerCase().includes(searchLower);
        });
        
        if (!matchName && !matchInstitution && !matchCity && !matchMode) return false;
      }

      // Location filter (City & Country)
      if (filters.locations.length > 0) {
        const cityCountry = `${resource.city}, Indonesia`; // Assuming Indonesia for now
        if (!filters.locations.some(loc => cityCountry.includes(loc.split(',')[0]))) return false;
      }

      // Institution filter
      if (filters.institutions.length > 0) {
        const institutionName = resource.type === "practitioner" ? resource.bureauName : resource.name;
        if (!filters.institutions.includes(institutionName)) return false;
      }

      // Profession types filter
      if (filters.professionTypes.length > 0) {
        const hasMatchingProfession = resource.professionTypes.some(type => 
          filters.professionTypes.includes(type)
        );
        if (!hasMatchingProfession) return false;
      }

      // Type-specific filters
      if (resource.type === "practitioner") {
        // Specializations filter
        if (filters.specializations.length > 0) {
          const hasMatchingSpec = resource.specializations.some(spec => 
            filters.specializations.includes(spec)
          );
          if (!hasMatchingSpec) return false;
        }

        // Price range filter
        const allPrices = resource.services.map(s => s.price).filter(Boolean);
        if (allPrices.length > 0) {
          const minPrice = Math.min(...allPrices);
          const maxPrice = Math.max(...allPrices);
          if (minPrice > filters.priceRange[1] || maxPrice < filters.priceRange[0]) {
            return false;
          }
        }

        // Modes filter
        if (filters.modes.length > 0) {
          const hasMatchingMode = resource.modes.some(mode => 
            filters.modes.includes(mode)
          );
          if (!hasMatchingMode) return false;
        }
      }

      if (resource.type === "bureau") {
        // Specializations filter for bureaus
        if (filters.specializations.length > 0) {
          const hasMatchingSpec = resource.specializations.some(spec => 
            filters.specializations.includes(spec)
          );
          if (!hasMatchingSpec) return false;
        }

        // Modes filter for bureaus
        if (filters.modes.length > 0) {
          const hasMatchingMode = resource.modes.some(mode => 
            filters.modes.includes(mode)
          );
          if (!hasMatchingMode) return false;
        }
      }

      // Insurance filter (applies to both)
      if (filters.insurance.length > 0) {
        const hasMatchingInsurance = resource.insurance.some(ins => 
          filters.insurance.includes(ins)
        );
        if (!hasMatchingInsurance) return false;
      }

      return true;
    });
  }, [filters, allResources]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
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
  };

  const isLoading = practitionersLoading || institutionsLoading;

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
          <span className="gradient-text">Mental Health</span> Resource Directory
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your trusted companion in finding qualified psychologists, psychiatrists, and mental health clinics. 
          Taking care of your mental health is a brave and important step. 🌟
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
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

      {/* Results Section */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            <span className="text-primary">{filteredResources.length}</span> Resources Found
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
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

            let cardData: UnifiedCardData;
            
            if (resource.type === "practitioner") {
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

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                No resources found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any resources matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={handleClearAllFilters}
                className="text-primary hover:text-primary-hover font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
